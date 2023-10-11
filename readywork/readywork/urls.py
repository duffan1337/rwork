from django.conf.urls.static import static
from django.views.generic import TemplateView

from readywork import settings
from django.contrib import admin
from django.urls import path

from works.views import *
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', include('works.urls')),
    path('', GetAllWorks.as_view(), name='home'),
    path('users/', include('user.urls')),
    path('works/', include('works.urls')),
    path('profile/', include('cabinet.urls')),
    path('order/', include('order.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)