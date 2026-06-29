from django.contrib import admin
from .models import (
    Category,
    SubCategory,
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
# Sub Category Admin
# ==========================================================

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'category',
        'display_order',
        'is_active',
        'created_at',
    )

    list_filter = (
        'category',
        'is_active',
    )

    search_fields = (
        'name',
        'category__name',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }

    ordering = (
        'category',
        'display_order',
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
        'subcategory',
        'slug',
        'price',
        'main_image',
        'stock',
        'sku',
        'is_featured',
        'is_active',
        'created_at',
    )

    list_filter = (
        'category',
        'subcategory',
        'is_featured',
        'is_active',
    )

    search_fields = (
        'name',
        'short_description',
        'description',
        'category__name',
        'subcategory__name',
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

    fieldsets = (

        (
            'Category',

            {

                'fields': (

                    'category',

                    'subcategory',

                )

            }

        ),

        (
            'Basic Information',

            {

                'fields': (

                    'name',

                    'slug',

                    'sku',

                    'short_description',

                    'description',

                )

            }

        ),

        (
            'Pricing',

            {

                'fields': (

                    'price',

                    'stock',

                )

            }

        ),

        (
            'Images',

            {

                'fields': (

                    'main_image',

                )

            }

        ),

        (
            'Display',

            {

                'fields': (

                    'is_featured',

                    'is_active',

                )

            }

        ),

    )


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
# ORDER ADMIN ACTIONS
# ==========================================================

@admin.action(
    description='Mark selected orders as Confirmed'
)
def mark_confirmed(
    modeladmin,
    request,
    queryset
):

    queryset.update(
        status='confirmed'
    )


@admin.action(
    description='Mark selected orders as Processing'
)
def mark_processing(
    modeladmin,
    request,
    queryset
):

    queryset.update(
        status='processing'
    )


@admin.action(
    description='Mark selected orders as Delivered'
)
def mark_delivered(
    modeladmin,
    request,
    queryset
):

    queryset.update(
        status='delivered'
    )


@admin.action(
    description='Mark selected orders as Cancelled'
)
def mark_cancelled(
    modeladmin,
    request,
    queryset
):

    queryset.update(
        status='cancelled'
    )
# ==========================================================
# Order Admin
# ==========================================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer_name',
        'phone',
        'status',
        'subtotal',
        'delivery_charge',
        'total_amount',
        'created_at',
    )

    list_filter = (
        'status',
        'created_at',
    )

    search_fields = (
        'customer_name',
        'phone',
    )

    readonly_fields = (
        'subtotal',
        'delivery_charge',
        'total_amount',
        'created_at',
        'updated_at',
    )
    actions = [

        mark_confirmed,

        mark_processing,

        mark_delivered,

        mark_cancelled,
    ]

    inlines = [
        OrderItemInline,
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
