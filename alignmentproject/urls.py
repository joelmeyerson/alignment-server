from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# from backend.views import backendView, addAlignmentView
from backend.views import backendView, addAlignmentView, AlignmentView, index


urlpatterns = [
    path('admin/', admin.site.urls),
    path('backend/', backendView),
    path('addAlignment/', addAlignmentView),
    path('api/', include('backend.urls')),
    path("", index, name="index")
]

if settings.DEBUG:
    urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)