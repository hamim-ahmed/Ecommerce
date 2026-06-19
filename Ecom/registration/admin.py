from django.contrib import admin
from django.contrib.auth.admin import  UserAdmin as BaseUserAdmin
from .models import AppUsers

# Register your models here.
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username','first_name','last_name', 'email', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login','is_moderator')
    fieldsets = BaseUserAdmin.fieldsets + (                                                #the fieldsets attribute to include the fields is_student and is_teacher in the user creation and update forms in the admin panel.
        (None, {'fields': ('is_moderator', 'service_id')}),
    )
    add_fieldsets = (                                                                       # To add these field into django admin panel when creating a new user from django admin.
        (None, {
            'classes': ('wide',),
            'fields': (
            'username', 'first_name', 'last_name', 'email', 'service_id', 'password1', 'password2', 'is_moderator')}
         ),
    )
    search_fields = ['username', 'first_name', 'last_name', 'service_id']

# Register your model with the custom admin class
admin.site.register(AppUsers, CustomUserAdmin)