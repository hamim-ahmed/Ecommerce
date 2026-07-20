"""
serializers.py

Purpose:
---------
Serializer converts Django Model objects
into JSON format and vice versa.

Example:

Database Record
----------------

Product(
    id=1,
    name='Helmet',
    price=500
)

becomes

JSON
----------------

{
    "id": 1,
    "name": "Helmet",
    "price": "500.00"
}

Vue, React, Mobile Apps and Browsers
can understand JSON.
"""

from rest_framework import serializers

# Relative import
#
# serializers.py is inside:
#
# main/api/
#
# ".." means:
#
# go up one directory
#
# main/api
#      ↑
# main
#
from ..models import (
    Category,
    SubCategory,
    Product,
    Order,
    OrderItem,
    Notification,
    DeliveryCharge,
    Banner,
)


# ==========================================================
# SUB CATEGORY SERIALIZER
# ==========================================================

class SubCategorySerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = SubCategory

        fields = [

            'id',

            'name',

            'slug',

            'image',

        ]

# ==========================================================
# CATEGORY SERIALIZER
# ==========================================================

class CategorySerializer(
    serializers.ModelSerializer
):

    """
    Returns category together
    with all active subcategories.
    """

    subcategories = serializers.SerializerMethodField()

    class Meta:

        model = Category

        fields = [

            'id',

            'name',

            'slug',

            'image',

            'subcategories',

        ]

    def get_subcategories(

        self,

        obj

    ):

        queryset = (

            obj.subcategories

            .filter(

                is_active=True

            )

            .order_by(

                'display_order',

                'name'

            )

        )

        return SubCategorySerializer(

            queryset,

            many=True,

            context=self.context

        ).data


# ==========================================================
# PRODUCT LIST SERIALIZER
# ==========================================================

class ProductSerializer(serializers.ModelSerializer):
    """
    Used for Product Listing Page.

    Example:

    /api/products/

    Returns a lightweight version
    of product information.

    We don't send long descriptions here
    because listing pages don't need them.
    """

    # Category name is not directly stored
    # in Product table.
    #
    # It comes from:
    #
    # Product
    #   ↓
    # category
    #   ↓
    # category.name

    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )
    subcategory = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    subcategory_name = serializers.CharField(
        source='subcategory.name',
        read_only=True
    )

    main_image = serializers.ImageField(
        read_only=True
    )

    class Meta:

        model = Product

        fields = [

            'id',

            'name',

            'slug',

            'sku',

            'price',

            'main_image',

            'category',

            'category_name',

            'subcategory',

            'subcategory_name',

        ]




class BannerSerializer(
    serializers.ModelSerializer
):
    """
    Banner serializer for homepage slider.

    Returns only active banners,
    ordered by display_order.
    """

    image = serializers.SerializerMethodField()

    class Meta:

        model = Banner

        fields = [

            'id',

            'title',

            'subtitle',

            'image',

            'button_text',

            'button_url',

            'open_in_new_tab',

            'display_order',
        ]

    def get_image(
        self,
        obj
    ):

        request = self.context.get(
            'request'
        )

        if obj.image:

            return request.build_absolute_uri(

                obj.image.url

            )

        return None



# ==========================================================
# PRODUCT DETAIL SERIALIZER
# ==========================================================

class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Used for Product Detail Page.

    Example:

    /api/products/helmet-a/

    Returns complete product information.
    """

    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:

        model = Product

        fields = [

            'id',

            'name',

            'slug',

            'sku',

            'price',

            'stock',

            'short_description',

            'description',

            'main_image',

            'category',

            'category_name',
        ]


# ==========================================================
# ORDER ITEM CREATE SERIALIZER
# ==========================================================

class OrderItemCreateSerializer(
    serializers.Serializer
):
    """
    Represents ONE cart item.

    Example:

    {
        "product_id": 1,
        "product_name": "Helmet",
        "quantity": 2,
        "unit_price": 500
    }
    """

    product_id = serializers.IntegerField()

    product_name = serializers.CharField()

    quantity = serializers.IntegerField()

    unit_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )


# ==========================================================
# ORDER CREATE SERIALIZER
# ==========================================================

# ==========================================================
# ORDER CREATE SERIALIZER
# ==========================================================

class OrderCreateSerializer(
    serializers.Serializer
):
    """
    Used during Checkout.

    Example Request:

    {
        "customer_name":"Hamim",

        "phone":"017xxxxxxxx",

        "address":"Dhaka",

        "delivery_area":"Inside Dhaka",

        "delivery_charge":"60.00",

        "note":"Call before delivery",

        "items":[
            {
                "product_id":1,
                "product_name":"Helmet",
                "quantity":2,
                "unit_price":"500.00"
            }
        ]
    }
    """

    # ======================================================
    # CUSTOMER INFORMATION
    # ======================================================

    customer_name = serializers.CharField()

    phone = serializers.CharField()

    address = serializers.CharField()

    note = serializers.CharField(
        required=False,
        allow_blank=True
    )

    # ======================================================
    # DELIVERY INFORMATION
    # ======================================================

    delivery_area = serializers.CharField()

    delivery_charge = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    # ======================================================
    # ORDER ITEMS
    # ======================================================

    items = OrderItemCreateSerializer(
        many=True
    )

    # ======================================================
    # CREATE ORDER
    # ======================================================

    def create(self, validated_data):
        """
        Called automatically when:

        serializer.save()

        is executed.

        Responsibilities:

        1. Create Order
        2. Create Order Items
        3. Calculate Subtotal
        4. Add Delivery Charge
        5. Calculate Grand Total
        6. Create Notification
        """

        # --------------------------------------------------
        # Extract order items
        # --------------------------------------------------

        items = validated_data.pop(
            'items'
        )

        # --------------------------------------------------
        # Extract delivery information
        #
        # Currently delivery_area is used
        # for checkout calculation only.
        #
        # It is NOT stored in Order model.
        # --------------------------------------------------

        delivery_area = validated_data.pop(
            'delivery_area'
        )

        delivery_charge = validated_data.pop(
            'delivery_charge'
        )

        # --------------------------------------------------
        # Create Order
        #
        # Remaining validated_data contains:
        #
        # customer_name
        # phone
        # address
        # note
        # --------------------------------------------------

        order = Order.objects.create(
            **validated_data
        )

        # --------------------------------------------------
        # Calculate subtotal
        # --------------------------------------------------

        subtotal = 0

        # --------------------------------------------------
        # Create Order Items
        # --------------------------------------------------

        for item in items:

            item_subtotal = (
                item['quantity']
                * item['unit_price']
            )

            subtotal += item_subtotal

            OrderItem.objects.create(

                order=order,

                product_id=item['product_id'],

                product_name=item['product_name'],

                quantity=item['quantity'],

                unit_price=item['unit_price'],

                subtotal=item_subtotal
            )

        # --------------------------------------------------
        # Save Order Totals
        # --------------------------------------------------

        order.subtotal = subtotal

        order.delivery_charge = (
            delivery_charge
        )

        order.total_amount = (
            subtotal
            +
            delivery_charge
        )

        order.save()

        # --------------------------------------------------
        # Create Admin Notification
        # --------------------------------------------------

        Notification.objects.create(
            title='New Order Received',
            message=(
                f'Order #{order.id} '
                f'received from '
                f'{order.customer_name}'
            )
        )

        # --------------------------------------------------
        # Return Created Order
        # --------------------------------------------------

        return order




# ==========================================================
# DELIVERY CHARGE SERIALIZER
# ==========================================================

class DeliveryChargeSerializer(
    serializers.ModelSerializer
):
    """
    Returns available delivery options.

    Example Response:

    [
        {
            "id":1,
            "area_name":"Inside Dhaka",
            "charge":"60.00"
        }
    ]
    """

    class Meta:

        model = DeliveryCharge

        fields = [
            'id',
            'area_name',
            'charge',
        ]


# ==========================================================
# ADMIN DASHBOARD SERIALIZER
# ==========================================================

class AdminDashboardSerializer(
    serializers.Serializer
):

    pending_orders = serializers.IntegerField()

    confirmed_orders = serializers.IntegerField()

    processing_orders = serializers.IntegerField()

    delivered_orders = serializers.IntegerField()

    cancelled_orders = serializers.IntegerField()






# ==========================================================
# ADMIN ORDER LIST SERIALIZER
# ==========================================================

class AdminOrderListSerializer(
    serializers.ModelSerializer
):
    """
    Used for:

    /api/admin/orders/

    Returns lightweight
    order information
    for the table view.
    """

    class Meta:

        model = Order

        fields = [

            'id',

            'customer_name',

            'phone',

            'status',

            'subtotal',

            'delivery_charge',

            'total_amount',

            'created_at'
        ]



# ==========================================================
# ADMIN ORDER ITEM SERIALIZER
# ==========================================================

class AdminOrderItemSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = OrderItem

        fields = [

            'id',

            'product_name',

            'quantity',

            'unit_price',

            'subtotal'
        ]


# ==========================================================
# ADMIN ORDER DETAIL SERIALIZER
# ==========================================================

class AdminOrderDetailSerializer(
    serializers.ModelSerializer
):

    items = (
        AdminOrderItemSerializer(
            many=True,
            read_only=True
        )
    )

    class Meta:

        model = Order

        fields = [
        'id',

        'customer_name',

        'phone',

        'address',

        'subtotal',

        'delivery_charge',

        'total_amount',

        'status',

        'created_at',

        'confirmed_at',

        'processing_at',

        'delivered_at',

        'cancelled_at',

        'items'
        ]

# ==========================================================
# ORDER STATUS UPDATE
# ==========================================================

from django.utils import timezone
from django.utils.timezone import localtime

class OrderStatusUpdateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Order

        fields = [
            'status'
        ]

    def update(
        self,
        instance,
        validated_data
    ):

        new_status = validated_data.get(
            'status'
        )

        # ----------------------------------
        # Save status change timestamps
        # ----------------------------------

        if new_status == 'confirmed':

            if not instance.confirmed_at:

                instance.confirmed_at = (
                    localtime(timezone.now())
                )

        elif new_status == 'processing':

            if not instance.processing_at:

                instance.processing_at = (
                    localtime(timezone.now())
                )

        elif new_status == 'delivered':

            if not instance.delivered_at:

                instance.delivered_at = (
                    localtime(timezone.now())
                )

        elif new_status == 'cancelled':

            if not instance.cancelled_at:

                instance.cancelled_at = (
                    localtime(timezone.now())
                )

        instance.status = new_status

        instance.save()

        return instance


# ==================================================
# NOTIFICATION SERIALIZER
# ==================================================

import re


class NotificationSerializer(
    serializers.ModelSerializer
):

    order_id = (
        serializers.SerializerMethodField()
    )

    class Meta:

        model = Notification

        fields = '__all__'

    def get_order_id(
        self,
        obj
    ):

        match = re.search(

            r'Order #(\d+)',

            obj.message
        )

        if match:

            return int(
                match.group(1)
            )

        return None