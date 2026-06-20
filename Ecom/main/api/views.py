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

from rest_framework import generics

# Relative imports
from ..models import (
    Category,
    Product,
    DeliveryCharge,
)

from .serializers import (

    CategorySerializer,

    ProductSerializer,

    ProductDetailSerializer,

    OrderCreateSerializer,

    DeliveryChargeSerializer,
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

    queryset = Category.objects.filter(
        is_active=True
    )

    # Serializer used to convert
    # Category objects into JSON

    serializer_class = CategorySerializer


# ==========================================================
# PRODUCT LIST API
# ==========================================================

class ProductListAPIView(
    generics.ListAPIView
):
    """
    Returns all active products.

    Example:

    /api/products/

    Used by:

        Product Listing Page

        Search Results

        Category Pages
    """

    queryset = Product.objects.filter(
        is_active=True
    ).select_related(
        'category'
    )

    serializer_class = ProductSerializer


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
                'order_id': order.id,
                'message': 'Order created successfully.'
            },
            status=status.HTTP_201_CREATED
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