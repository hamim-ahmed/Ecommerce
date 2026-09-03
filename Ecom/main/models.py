import secrets
from django.db import models
from django.utils.text import slugify


# ==========================================================
# ORDER TRACKING NUMBER GENERATOR
# ==========================================================

def generate_tracking_number():

    """
    Generates a unique-looking public order tracking number.

    Example:

        AM-7F92K4D81A3C8E21

    The tracking number is randomly generated
    and does not expose the database Order ID.
    """

    return (
        'IV-' +
        secrets.token_hex(8).upper()
    )

class Category(models.Model):
    """
    Product Categories

    Examples:
        Motorcycle
        Engine Oil
        Helmet
        Spare Parts
    """

    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        unique=True,
        blank=True
    )

    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True
    )

    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls category menu ordering."
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        ordering = [
            'display_order',
            'name'
        ]
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'


class SubCategory(models.Model):
    """
    Product Sub Categories

    Examples:

        Category:
            Helmets

        Sub Categories:
            MT
            SMK
            LS2
            Shark

    """

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='subcategories'
    )

    name = models.CharField(
        max_length=100
    )

    slug = models.SlugField(
        blank=True
    )

    image = models.ImageField(
        upload_to='subcategories/',
        blank=True,
        null=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = [

            'display_order',

            'name'

        ]

        unique_together = [

            'category',

            'name'

        ]

    def save(self, *args, **kwargs):

        if not self.slug:

            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):

        return f'{self.category.name} / {self.name}'



class Product(models.Model):
    """
    Main product table.
    """

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products'
    )

    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.SET_NULL,
        related_name='products',
        null=True,
        blank=True
    )

    name = models.CharField(
        max_length=200
    )

    slug = models.SlugField(
        unique=True,
        blank=True
    )

    short_description = models.CharField(
        max_length=255,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    stock = models.PositiveIntegerField(
        default=0
    )
    sku = models.CharField(
        max_length=100,
        blank=True
    )

    main_image = models.ImageField(
        upload_to='products/'
    )

    is_featured = models.BooleanField(
        default=False
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """
    Multiple images for one product.
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='products/gallery/'
    )

    def __str__(self):
        return f"{self.product.name} Image"


class Order(models.Model):
    """
    Customer order.
    """

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    tracking_number = models.CharField(
        max_length=30,
        unique=True,
        default=generate_tracking_number,
        editable=False
    )

    customer_name = models.CharField(
        max_length=200
    )

    phone = models.CharField(
        max_length=20
    )

    address = models.TextField()

    note = models.TextField(
        blank=True
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    delivery_charge = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    # ==================================================
    # ORDER TIMELINE FIELDS
    # ==================================================
    # These timestamps allow us
    # to show a timeline in the
    # admin order details page.
    #

    confirmed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    processing_at = models.DateTimeField(
        null=True,
        blank=True
    )

    delivered_at = models.DateTimeField(
        null=True,
        blank=True
    )

    cancelled_at = models.DateTimeField(
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Order #{self.id}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    product_name = models.CharField(
        max_length=200, null=True,
        blank=True
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    def __str__(self):
        return f"Order {self.order.id} - {self.product_name}"



class Notification(models.Model):
    """
    Admin notifications.
    """

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


#for updating site logo, name , etc.
class SiteSettings(models.Model):
    """
    Global website settings.

    Only one record should exist.
    """

    site_name = models.CharField(
        max_length=200,
        default='My Ecommerce Store'
    )

    logo = models.ImageField(
        upload_to='site/logo/',
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    facebook_url = models.URLField(
        blank=True
    )

    youtube_url = models.URLField(
        blank=True
    )

    footer_text = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.site_name

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'


class Banner(models.Model):

    title = models.CharField(
        max_length=255
    )

    subtitle = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to='banners/'
    )

    button_text = models.CharField(
        max_length=100,
        blank=True
    )

    button_url = models.CharField(
        max_length=255,
        blank=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    # NEW FIELD
    open_in_new_tab = models.BooleanField(
        default=False
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['display_order']


class DeliveryCharge(models.Model):
    """
    Delivery charge settings.

    Usually only two rows:

    Inside Dhaka
    Outside Dhaka
    """

    area_name = models.CharField(
        max_length=100,
        unique=True
    )

    charge = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.area_name}"
            f" - {self.charge}"
        )