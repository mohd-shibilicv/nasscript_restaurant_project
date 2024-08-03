from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Dish(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='images/', default='default_dish_image.jpg')
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='dishes')

    class Meta:
        verbose_name = 'Dish'
        verbose_name_plural = 'Dishes'

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.id} - {self.created_at}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.order.id} - {self.dish} - {self.quantity}"


class Bill(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='bills')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField(default=False)
    billed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bill for order {self.order.id}"


class Notification(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.message[:50]}..."
