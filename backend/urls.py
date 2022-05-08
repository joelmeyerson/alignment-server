from django.urls import path
from .views import AlignmentView

urlpatterns = [
    path('alignment', AlignmentView.as_view()),
]
