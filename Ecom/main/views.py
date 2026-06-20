from django.shortcuts import render, get_object_or_404

from .models import (
    Banner,
    Product
)


def home(request):

    banners = Banner.objects.filter(
        is_active=True
    )

    featured_products = Product.objects.filter(
        is_active=True,
        is_featured=True
    )[:8]

    latest_products = Product.objects.filter(
        is_active=True
    ).order_by('-created_at')[:12]

    context = {

        'banners': banners,

        'featured_products': featured_products,

        'latest_products': latest_products,
    }

    return render(
        request,
        'main/home.html',
        context
    )


def product_list(request):

    products = Product.objects.filter(
        is_active=True
    ).select_related('category')

    context = {
        'products': products
    }

    return render(
        request,
        'main/products.html',
        context
    )


def product_detail(request, slug):

    product = get_object_or_404(
        Product,
        slug=slug,
        is_active=True
    )

    related_products = Product.objects.filter(
        category=product.category,
        is_active=True
    ).exclude(
        id=product.id
    )[:4]

    context = {
        'product': product,
        'related_products': related_products,
    }

    return render(
        request,
        'main/product_detail.html',
        context
    )


def cart_page(request):
    """
    Cart data is stored in LocalStorage.

    Django only serves the page.

    Vue/JavaScript loads cart data.
    """

    return render(
        request,
        'main/cart.html'
    )


def checkout_page(request):

    return render(
        request,
        'main/checkout.html'
    )

def order_success_page(request):

    return render(
        request,
        'main/order_success.html'
    )