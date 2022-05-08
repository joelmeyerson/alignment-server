from django.contrib import admin
from django.urls import path, include

# from backend.views import backendView, addAlignmentView
from backend.views import backendView, addAlignmentView, AlignmentView, index


urlpatterns = [
    path('admin/', admin.site.urls),
    path('backend/', backendView),
    path('addAlignment/', addAlignmentView),
    path('api/', include('backend.urls')),
    path("", index, name="index")
]
