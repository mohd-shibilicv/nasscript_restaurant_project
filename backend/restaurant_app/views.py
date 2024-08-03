from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Sum, Count
from restaurant_app.models import Category, Dish, Order, Notification, Bill
from restaurant_app.serializers import (
    CategorySerializer,
    DishSerializer,
    OrderSerializer,
    NotificationSerializer,
    BillSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'total_amount']

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=30)
        
        daily_sales = Order.objects.filter(
            created_at__range=(start_date, end_date)
        ).values('created_at__date').annotate(
            total_sales=Sum('total_amount'),
            order_count=Count('id')
        ).order_by('created_at__date')

        total_income = Order.objects.filter(
            created_at__range=(start_date, end_date)
        ).aggregate(total_income=Sum('total_amount'))['total_income'] or 0

        new_customers = Order.objects.filter(
            created_at__range=(start_date, end_date)
        ).values('id').distinct().count()

        return Response({
            'daily_sales': daily_sales,
            'total_income': total_income,
            'new_customers': new_customers,
        })


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
