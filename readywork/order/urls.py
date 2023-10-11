from django.urls import path

from .views import *

urlpatterns = [
    path('buy_work/', BuyWork.as_view(), name='buy_work'),
]
