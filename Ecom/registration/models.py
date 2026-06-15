from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class AppUsers(AbstractUser):                                                      #customizing default User Model to add fields
    is_moderator = models.BooleanField('moderator status', default=False)
