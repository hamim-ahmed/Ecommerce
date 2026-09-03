"""
views.py

Purpose
--------
Receives API requests.

Examples:

GET  /api/products/

GET  /api/categories/

POST /api/orders/

This file acts as the middle layer between:

Browser / Vue
      ↓
APIView
      ↓
Database
"""
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.generics import get_object_or_404

# Relative imports
from ..models import (
    Category,
    Product,
    DeliveryCharge,
    Order,
    Notification,
    Banner,
)

from .serializers import (

    CategorySerializer,

    ProductSerializer,

    ProductDetailSerializer,

    OrderCreateSerializer,

    DeliveryChargeSerializer,

    AdminDashboardSerializer,

    AdminOrderListSerializer,

    AdminOrderDetailSerializer,

    OrderStatusUpdateSerializer,

    PublicOrderTrackingSerializer,

    NotificationSerializer,

    BannerSerializer,

)


# ==========================================================
# CATEGORY LIST API
# ==========================================================

class CategoryListAPIView(generics.ListAPIView):
    """
    Returns ALL active categories.

    Example URL:

    /api/categories/

    Example Response:

    [
        {
            "id":1,
            "name":"Helmet"
        },

        {
            "id":2,
            "name":"Engine Oil"
        }
    ]
    """

    # Database query

    queryset = (

        Category.objects

        .filter(

            is_active=True

        )

        .prefetch_related(

            'subcategories'

        )

    )

    # Serializer used to convert
    # Category objects into JSON

    serializer_class = CategorySerializer



class BannerListAPIView(
    generics.ListAPIView
):
    """
    Homepage Banner API

    Returns all active banners
    ordered by display_order.
    """

    serializer_class = BannerSerializer

    queryset = (

        Banner.objects

        .filter(
            is_active=True
        )

        .order_by(
            'display_order'
        )

    )



# ==========================================================
# PRODUCT LIST API
# ==========================================================

from django.db.models import Q
from rest_framework import generics


class ProductListAPIView(
    generics.ListAPIView
):
    """
    Product List API

    Supports:

    /api/products/

    /api/products/?category=3

    /api/products/?search=helmet

    /api/products/?category=3&search=helmet
    """

    serializer_class = ProductSerializer

    def get_queryset(self):

        queryset = Product.objects.filter(

            is_active=True

        ).select_related(

            'category',

            'subcategory'

        )

        # -----------------------------------------
        # Category Filter
        # -----------------------------------------

        category = self.request.GET.get(

            'category'

        )
        subcategory = self.request.GET.get(

            'subcategory'

        )

        if category:

            queryset = queryset.filter(

                category_id=category

            )
        if subcategory:
            queryset = queryset.filter(

                subcategory_id=subcategory

            )

        # -----------------------------------------
        # Search Filter
        # -----------------------------------------

        search = self.request.GET.get(

            'search'

        )

        if search:

            queryset = queryset.filter(

                Q(name__icontains=search)

            )

        return queryset

# ==========================================================
# PRODUCT DETAIL API
# ==========================================================

class ProductDetailAPIView(
    generics.RetrieveAPIView
):
    """
    Returns ONE product.

    Example:

    /api/products/helmet-a/

    Response:

    {
        "id":1,
        "name":"Helmet A",
        "price":"500.00",
        ...
    }
    """

    queryset = Product.objects.filter(
        is_active=True
    )

    serializer_class = (
        ProductDetailSerializer
    )

    # DRF normally searches by id.
    #
    # Example:
    #
    # /api/products/1/
    #
    # We want:
    #
    # /api/products/helmet-a/

    lookup_field = 'slug'



# ==========================================================
# ORDER CREATE API
# ==========================================================

from rest_framework import status
from rest_framework.response import Response


class OrderCreateAPIView(
    generics.CreateAPIView
):

    serializer_class = (
        OrderCreateSerializer
    )

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        order = serializer.save()

        return Response(
            {
                'success': True,

                # Database order ID
                'order_id': order.id,

                # Public tracking number
                # This is what the customer will use
                # to track the order without logging in.
                'tracking_number': order.tracking_number,

                'message': 'Order created successfully.'
            },
            status=status.HTTP_201_CREATED
        )

# ==========================================================
# PUBLIC ORDER TRACKING API
# ==========================================================
from rest_framework.views import APIView
class PublicOrderTrackingAPIView(
    APIView
):
    """
    Public Guest Order Tracking API.

    Customers can track their order without logging in.

    Example:

        GET /api/orders/track/?tracking_number=AM-XXXXXXXX

    Only tracking-related information is returned.

    Customer phone, address and other private information
    are intentionally NOT exposed.
    """

    def get(
        self,
        request
    ):

        # --------------------------------------------------
        # Get tracking number from URL query parameter
        # --------------------------------------------------

        tracking_number = request.GET.get(
            'tracking_number'
        )


        # --------------------------------------------------
        # Validate tracking number
        # --------------------------------------------------

        if not tracking_number:

            return Response(
                {
                    'success': False,

                    'message':
                        'Tracking number is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # --------------------------------------------------
        # Clean user input
        # --------------------------------------------------

        tracking_number = (
            tracking_number
            .strip()
            .upper()
        )


        # --------------------------------------------------
        # Find order
        #
        # We search using the public tracking number,
        # NOT the database order ID.
        # --------------------------------------------------

        try:

            order = Order.objects.get(
                tracking_number=tracking_number
            )

        except Order.DoesNotExist:

            return Response(
                {
                    'success': False,

                    'message':
                        'No order found with this tracking number.'
                },
                status=status.HTTP_404_NOT_FOUND
            )


        # --------------------------------------------------
        # Serialize safe public information
        # --------------------------------------------------

        serializer = (
            PublicOrderTrackingSerializer(
                order
            )
        )


        # --------------------------------------------------
        # Return response
        # --------------------------------------------------

        return Response(
            {
                'success': True,
                'order': serializer.data
            },
            status=status.HTTP_200_OK
        )

# ==========================================================
# DELIVERY CHARGE LIST API
# ==========================================================

class DeliveryChargeListAPIView(
    generics.ListAPIView
):
    """
    Returns available delivery charges.

    Example:

    GET

    /api/delivery-charges/
    """

    queryset = DeliveryCharge.objects.filter(
        is_active=True
    )

    serializer_class = (
        DeliveryChargeSerializer
    )




# ==========================================================
# ADMIN DASHBOARD API
# ==========================================================
from rest_framework.views import APIView
from rest_framework.response import Response

class AdminDashboardAPIView(
    APIView
):
    """
    Returns dashboard statistics.
    """

    def get(
        self,
        request
    ):
        data = {

            'pending_orders':
                Order.objects.filter(
                    status='pending'
                ).count(),

            'confirmed_orders':
                Order.objects.filter(
                    status='confirmed'
                ).count(),

            'processing_orders':
                Order.objects.filter(
                    status='processing'
                ).count(),

            'delivered_orders':
                Order.objects.filter(
                    status='delivered'
                ).count(),

            'cancelled_orders':
                Order.objects.filter(
                    status='cancelled'
                ).count(),
        }

        serializer = (
            AdminDashboardSerializer(
                data
            )
        )

        return Response(
            serializer.data
        )



# ==========================================================
# ADMIN ORDERS LIST API
# ==========================================================

class AdminOrderListAPIView(
    APIView
):
    """
    GET

    /api/admin/orders/

    /api/admin/orders/?status=pending
    """

    def get(
        self,
        request
    ):

        queryset = (
            Order.objects
            .all()
            .order_by('-created_at')
        )

        status_filter = (
            request.GET.get(
                'status'
            )
        )

        if status_filter:

            queryset = queryset.filter(
                status=status_filter
            )

        serializer = (
            AdminOrderListSerializer(
                queryset,
                many=True
            )
        )

        return Response(
            serializer.data
        )


# ==========================================================
# ADMIN ORDER DETAIL API
# ==========================================================

class AdminOrderDetailAPIView(
    APIView
):

    def get(
        self,
        request,
        order_id
    ):

        order = get_object_or_404(

            Order,

            pk=order_id
        )

        serializer = (
            AdminOrderDetailSerializer(
                order
            )
        )

        return Response(
            serializer.data
        )


# ==========================================================
# UPDATE ORDER STATUS
# ==========================================================

class OrderStatusUpdateAPIView(
    APIView
):

    def patch(
        self,
        request,
        order_id
    ):

        order = get_object_or_404(

            Order,

            pk=order_id
        )

        serializer = (
            OrderStatusUpdateSerializer(

                order,

                data=request.data,

                partial=True
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response({

            'message':
                'Order updated successfully.'
        })



# ==================================================
# ADMIN NOTIFICATIONS
# ==================================================

class AdminNotificationListAPIView(
    generics.ListAPIView
):

    serializer_class = (
        NotificationSerializer
    )

    def get_queryset(self):

        return (

            # Notification.objects
            #
            # .filter(
            #     is_read=False
            # )
            #
            # .order_by(
            #     '-created_at'
            # )[:10]
            Notification.objects.order_by(
                '-created_at'
            )[:10]

        )


# ==================================================
# MARK NOTIFICATION READ
# ==================================================

class NotificationReadAPIView(
    APIView
):

    def patch(
        self,
        request,
        notification_id
    ):

        notification = (
            get_object_or_404(

                Notification,

                pk=notification_id

            )
        )

        notification.is_read = True

        notification.save()

        return Response({

            'message':
                'Notification updated.'
        })


# ==================================================
# UNREAD NOTIFICATION COUNT
# ==================================================

class NotificationCountAPIView(
    APIView
):

    def get(
        self,
        request
    ):

        count = (

            Notification.objects

            .filter(
                is_read=False
            )

            .count()
        )

        return Response({

            'count': count

        })



class MarkAllNotificationsReadAPIView(
    APIView
):

    def patch(
        self,
        request
    ):

        Notification.objects.filter(
            is_read=False
        ).update(
            is_read=True
        )

        return Response({

            'message':
                'Notifications marked as read.'

        })