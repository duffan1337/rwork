from django.db import models
from django.contrib.auth.models import AbstractUser


class Role(models.TextChoices):
    CLIENT = 'CLIENT'
    AUTHOR = 'AUTHOR'

class User(AbstractUser):
    role = models.CharField(max_length=25, choices=Role.choices, default=Role.CLIENT)




