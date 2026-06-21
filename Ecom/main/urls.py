from django.urls import path
from . import views
from django.urls import include


urlpatterns = [

    # =====================================
    # API Routes
    # =====================================

    path(
        'api/',
        include('main.api.urls')
    ),

    # =====================================
    # Website Routes
    # =====================================

    path(
        '',
        views.home,
        name='home'
    ),

    path(
        'products/',
        views.product_list,
        name='product_list'
    ),

    path(
        'product/<slug:slug>/',
        views.product_detail,
        name='product_detail'
    ),
    path(
        'cart/',
        views.cart_page,
        name='cart'
    ),
    path(
        'checkout/',
        views.checkout_page,
        name='checkout'
    ),
    path(
        'order-success/',
        views.order_success_page,
        name='order_success'
    ),

    path(
        'admin-panel/dashboard/',
        views.admin_dashboard_page,
        name='admin_dashboard_page'
    ),

    path(
        'admin-panel/orders/',
        views.admin_orders_page,
        name='admin_orders_page'
    ),

    path(
        'admin-panel/orders/<int:order_id>/',

        views.admin_order_detail_page,

        name='admin_order_detail_page'
    ),
]