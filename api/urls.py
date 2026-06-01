from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'videos', views.VideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

urlpatterns = [
    path('videos/stream/<int:video_id>/', views.StreamVideoView.as_view(), name='stream_video'),
    path('', include(router.urls)),
]

from .views import VideoViewSet, StreamVideoView, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'videos', VideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('videos/stream/<int:video_id>/', StreamVideoView.as_view(), name='stream_video'),
]