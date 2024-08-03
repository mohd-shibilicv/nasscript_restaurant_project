from django.contrib import admin
from restaurant_app.models import Category, Dish, Order, OrderItem, Bill, Notification

admin.site.register(Category)
admin.site.register(Dish)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Bill)
admin.site.register(Notification)
