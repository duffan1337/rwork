from django.urls import path

from .views import *

urlpatterns = [
    path('', WorksListView.as_view(), name='list_of_works'),
    path('prices-and-services/', PricesAndServices.as_view(), name='prices_and_services'),
    path('<int:work_id>/', WorkDetailed.as_view(), name='work_detailed'),
    # path('addpage/', addpage, name='add_page'),
    # path('contact/', contact, name='contact'),
    # path('login/', login, name='login'),
    # path('post/<int:post_id>', show_post, name='post'),
    # path('category/<int:cat_id>', show_category, name='category'),

]
