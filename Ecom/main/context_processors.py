from .models import SiteSettings, Category


def site_settings(request):     #to call sitSettings obj/recoed directly without doing these whole database calling process everytime.
    """
    Makes site settings available
    in every template.
    """

    settings_obj = SiteSettings.objects.first()

    categories = Category.objects.filter(
        is_active=True
    )

    return {
        'site_settings': settings_obj,
        'categories': categories
    }