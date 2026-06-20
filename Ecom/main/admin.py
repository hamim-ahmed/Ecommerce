from django.contrib import admin
from .models import (
    Category,
    Product,
    ProductImage,
    Order,
    OrderItem,
    Notification,
    SiteSettings,
    Banner,
    DeliveryCharge,
)


# ==========================================================
# Product Image Inline
# ==========================================================

class ProductImageInline(admin.TabularInline):
    """
    Allows adding multiple gallery images
    directly from Product admin page.
    """

    model = ProductImage
    extra = 1


# ==========================================================
# Category Admin
# ==========================================================

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'slug',
        'display_order',
        'is_active',
        'created_at',
        'updated_at',
    )

    list_filter = (
        'is_active',
    )

    search_fields = (
        'name',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }

    ordering = (
        'name',
    )


# ==========================================================
# Product Admin
# ==========================================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'category',
        'slug',
        'price',
        'stock',
        'sku',
        'is_featured',
        'is_active',
        'created_at',
    )

    list_filter = (
        'category',
        'is_featured',
        'is_active',
    )

    search_fields = (
        'name',
        'short_description',
        'description',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }

    ordering = (
        'name',
    )

    inlines = [
        ProductImageInline
    ]


# ==========================================================
# Order Item Inline
# ==========================================================

class OrderItemInline(admin.TabularInline):
    """
    Shows ordered products
    inside Order admin page.
    """

    model = OrderItem
    extra = 0

    readonly_fields = (
        'product_name',
        'product',
        'quantity',
        'unit_price',
        'subtotal',
    )

    can_delete = False


# ==========================================================
# Order Admin
# ==========================================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer_name',
        'phone',
        'total_amount',
        'status',
        'created_at',
    )
    list_editable = (
        'status',
    )

    list_filter = (
        'status',
        'created_at',
    )

    search_fields = (
        'customer_name',
        'phone',
        'address',
    )

    ordering = (
        '-created_at',
    )

    inlines = [
        OrderItemInline
    ]

# ==========================================================
# order item list
# ==========================================================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'order',
        'customer_name',
        'product_name',
        'quantity',
        'unit_price',
        'subtotal',
    )

    search_fields = (
        'product_name',
        'order__customer_name',
        'order__phone',
    )

    ordering = (
        '-id',
    )

    def customer_name(self, obj):
        return obj.order.customer_name

    customer_name.short_description = 'Customer'


# ==========================================================
# Notification Admin
# ==========================================================

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'title',
        'is_read',
        'created_at',
    )

    list_filter = (
        'is_read',
    )

    search_fields = (
        'title',
        'message',
    )

    ordering = (
        '-created_at',
    )

    # ==========================================================
    # site settings
    # ==========================================================
@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'site_name',
        'phone',
        'email',
        'updated_at',
    )



    # ==========================================================
    # banner settings
    # ==========================================================

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'title',
        'display_order',
        'is_active',
    )

    list_filter = (
        'is_active',
    )

    search_fields = (
        'title',
    )

    ordering = (
        'display_order',
    )


@admin.register(DeliveryCharge)
class DeliveryChargeAdmin(
    admin.ModelAdmin
):

    list_display = (
        'area_name',
        'charge',
        'is_active',
    )

    list_editable = (
        'charge',
        'is_active',
    )
