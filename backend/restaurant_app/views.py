from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import TokenError, RefreshToken
from django.utils import timezone
from django.contrib.auth import get_user_model
from restaurant_app.utils import generate_order_pdf, send_sms, shorten_url
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db.models import Sum, Count, Avg, F
from django.db.models.functions import TruncDate, TruncHour
from restaurant_app.models import Category, Dish, Order, OrderItem, Notification, Bill
from restaurant_app.serializers import (
    CategorySerializer,
    DishSerializer,
    OrderSerializer,
    NotificationSerializer,
    BillSerializer,
    UserSerializer,
)


User = get_user_model()


class UserRegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class LogoutView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["post"])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "price"]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(detail=True, methods=["post"])
    def generate_and_send_pdf(self, request, pk=None):
        order = self.get_object()
        phone_number = request.data.get("phone_number")

        if not phone_number:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate PDF
        pdf_buffer = generate_order_pdf(order)
        customer_phone_number = f"whatsapp:+91{phone_number}"

        # Save PDF to storage
        pdf_file = ContentFile(pdf_buffer.getvalue())
        pdf_path = default_storage.save(f"orders/order_{order.id}.pdf", pdf_file)

        # Get the URL of the saved PDF
        scheme = request.scheme
        host = request.get_host()
        pdf_url = default_storage.url(pdf_path)
        full_path_url = f"{scheme}://{host}/{pdf_url}"
        short_url = shorten_url(full_path_url)

        # Send SMS with PDF link
        message = f"Thanl you for your purchase.\n\nYour order details: {short_url}"
        send_sms(customer_phone_number, message)

        return Response(
            {"message": "PDF generated and sent successfully"},
            status=status.HTTP_200_OK,
        )

    def get_queryset_by_time_range(self, time_range):
        end_date = timezone.now()
        if time_range == "day":
            start_date = end_date - timedelta(days=1)
        elif time_range == "week":
            start_date = end_date - timedelta(weeks=1)
        elif time_range == "month":
            start_date = end_date - timedelta(days=30)
        elif time_range == "year":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)

        return self.queryset.filter(created_at__range=(start_date, end_date))

    @action(detail=False, methods=["get"])
    def dashboard_data(self, request):
        time_range = request.query_params.get("time_range", "month")
        queryset = self.get_queryset_by_time_range(time_range)

        # Calculate daily sales
        daily_sales = (
            queryset.annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(total_sales=Sum("total_amount"), order_count=Count("id"))
            .order_by("date")
        )

        # Calculate total income
        total_income = (
            queryset.aggregate(total_income=Sum("total_amount"))["total_income"] or 0
        )

        # Calculate popular time slots
        popular_time_slots = (
            queryset.annotate(hour=TruncHour("created_at"))
            .values("hour")
            .annotate(order_count=Count("id"))
            .order_by("-order_count")[:5]
        )

        # Calculate top dishes
        top_dishes = (
            OrderItem.objects.filter(order__in=queryset)
            .values(
                "dish__name",
                "dish__image",
            )
            .annotate(orders=Count("id"))
            .order_by("-orders")[:5]
        )

        # Calculate sales by category
        category_sales = (
            OrderItem.objects.filter(order__in=queryset)
            .values("dish__category__name")
            .annotate(value=Sum(F("quantity") * F("dish__price")))
            .order_by("-value")
        )

        # Calculate total orders
        total_orders = queryset.count()

        # Calculate average order value
        avg_order_value = (
            queryset.aggregate(avg_value=Avg("total_amount"))["avg_value"] or 0
        )

        return Response(
            {
                "daily_sales": daily_sales,
                "total_income": total_income,
                "popular_time_slots": popular_time_slots,
                "top_dishes": top_dishes,
                "category_sales": category_sales,
                "total_orders": total_orders,
                "avg_order_value": avg_order_value,
            }
        )

    @action(detail=False, methods=["get"])
    def sales_trends(self, request):
        time_range = request.query_params.get("time_range", "month")
        current_queryset = self.get_queryset_by_time_range(time_range)

        # Calculate the previous time range
        end_date = timezone.now() - timedelta(
            days=1
        )  # Exclude today for fair comparison
        if time_range == "day":
            start_date = end_date - timedelta(days=1)
            prev_start_date = start_date - timedelta(days=1)
        elif time_range == "week":
            start_date = end_date - timedelta(weeks=1)
            prev_start_date = start_date - timedelta(weeks=1)
        elif time_range == "month":
            start_date = end_date - timedelta(days=30)
            prev_start_date = start_date - timedelta(days=30)
        elif time_range == "year":
            start_date = end_date - timedelta(days=365)
            prev_start_date = start_date - timedelta(days=365)

        prev_queryset = self.queryset.filter(
            created_at__range=(prev_start_date, start_date)
        )

        current_stats = current_queryset.aggregate(
            total_income=Sum("total_amount"),
            total_orders=Count("id"),
            avg_order_value=Avg("total_amount"),
        )

        prev_stats = prev_queryset.aggregate(
            total_income=Sum("total_amount"),
            total_orders=Count("id"),
            avg_order_value=Avg("total_amount"),
        )

        def calculate_trend(current, previous):
            if previous and previous != 0:
                return ((current - previous) / previous) * 100
            return 0

        trends = {
            "total_income_trend": calculate_trend(
                current_stats["total_income"] or 0, prev_stats["total_income"] or 0
            ),
            "total_orders_trend": calculate_trend(
                current_stats["total_orders"] or 0, prev_stats["total_orders"] or 0
            ),
            "avg_order_value_trend": calculate_trend(
                current_stats["avg_order_value"] or 0,
                prev_stats["avg_order_value"] or 0,
            ),
        }

        return Response(trends)


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "notification marked as read"})

    @action(detail=False, methods=["get"])
    def unread(self, request):
        unread_notifications = self.queryset.filter(is_read=False)
        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)
