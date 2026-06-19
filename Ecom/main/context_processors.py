from .models import SiteSettings


def site_settings(request):     #to call sitSettings obj/recoed directly without doing these whole database calling process everytime.
    """
    Makes site settings available
    in every template.
    """

    settings_obj = SiteSettings.objects.first()

    return {
        'site_settings': settings_obj
    }