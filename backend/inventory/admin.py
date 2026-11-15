from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'price',
        'stock_quantity',
        'size',
        'colour',
        'created_at',
    )

    list_filter = ('category',)
    search_fields = ('name', 'category')
    ordering = ('name',)