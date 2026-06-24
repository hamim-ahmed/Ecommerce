"""
urls.py

Purpose
--------
Connect URL endpoints to API Views.

Example:

Browser Requests:

    /api/categories/

            ↓

    CategoryListAPIView

            ↓

    JSON Response


Think of urls.py as a traffic controller.

It decides:

"Which API View should handle this request?"
"""

from django.urls import path

# Import API Views

from .views import (

    CategoryListAPIView,

    ProductListAPIView,

    ProductDetailAPIView,

    OrderCreateAPIView,

    DeliveryChargeListAPIView,

    AdminDashboardAPIView,

    AdminOrderListAPIView,

    AdminOrderDetailAPIView,

    OrderStatusUpdateAPIView,

    AdminNotificationListAPIView,

    NotificationReadAPIView,

    NotificationCountAPIView,

    MarkAllNotificationsReadAPIView,
)


urlpatterns = [

    # ==================================================
    # CATEGORY LIST
    # ==================================================
    #
    # GET
    #
    # /api/categories/
    #
    # Returns:
    #
    # [
    #   {...},
    #   {...}
    # ]
    #

    path(
        'categories/',

        CategoryListAPIView.as_view(),

        name='api_categories'
    ),

    # ==================================================
    # PRODUCT LIST
    # ==================================================
    #
    # GET
    #
    # /api/products/
    #
    # Returns all products.
    #

    path(
        'products/',

        ProductListAPIView.as_view(),

        name='api_products'
    ),

    # ==================================================
    # PRODUCT DETAIL
    # ==================================================
    #
    # GET
    #
    # /api/products/helmet-a/
    #
    # GET
    #
    # /api/products/engine-oil/
    #
    # slug value is automatically
    # passed to ProductDetailAPIView.
    #

    path(
        'products/<slug:slug>/',

        ProductDetailAPIView.as_view(),

        name='api_product_detail'
    ),

    # ==================================================
    # ORDER CREATE
    # ==================================================
    #
    # POST
    #
    # /api/orders/
    #
    # Creates:
    #
    # Order
    # OrderItem
    # Notification
    #

    path(
        'orders/',

        OrderCreateAPIView.as_view(),

        name='api_order_create'
    ),

    path(
        'delivery-charges/',

        DeliveryChargeListAPIView.as_view(),

        name='api_delivery_charges'
    ),

    path(
        'admin/dashboard/',
        AdminDashboardAPIView.as_view(),
        name='admin_dashboard'
    ),

    path(
        'admin/orders/',
        AdminOrderListAPIView.as_view(),
        name='admin_orders'
    ),

    path(
        'admin/orders/<int:order_id>/',

        AdminOrderDetailAPIView.as_view(),

        name='admin_order_detail'
    ),

    path(
        'admin/orders/<int:order_id>/status/',

        OrderStatusUpdateAPIView.as_view(),

        name='admin_order_status_update'
    ),

    path(
        'admin/notifications/',

        AdminNotificationListAPIView.as_view(),

        name='admin_notifications'
    ),

    path(
        'admin/notifications/<int:notification_id>/read/',

        NotificationReadAPIView.as_view(),

        name='notification_read'
    ),
    path(
        'admin/notifications/count/',

        NotificationCountAPIView.as_view(),

        name='notification_count'
    ),

    path(
            'admin/notifications/read-all/',
            MarkAllNotificationsReadAPIView.as_view(),
            name='notification_read_all'
        ),

]