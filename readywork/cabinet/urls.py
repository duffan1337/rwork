from django.urls import path, include

from .views import *

urlpatterns = [
    path('', Profile.as_view(), name='profile'),
    path('create_work/', CreateWork.as_view(), name='create_work'),
    path('my_works/', MyWorks.as_view(), name='my_works'),
]
