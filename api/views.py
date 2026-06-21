import os
import re
import mimetypes
from django.views import View
from django.http import JsonResponse, HttpResponse, Http404
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .models import Video
from .serializers import VideoSerializer, RegisterSerializer

User = get_user_model()


def health_check(request):
    return JsonResponse({'status': 'ok'})


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-uploaded_at')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)


class StreamVideoView(View):
    def get(self, request, video_id):
        try:
            video = Video.objects.get(id=video_id)
        except Video.DoesNotExist:
            return HttpResponse(status=404)

        video_path = video.video_file.path

        if not os.path.exists(video_path):
            return HttpResponse(status=404)

        content_type, _ = mimetypes.guess_type(video_path)
        if not content_type:
            content_type = 'video/mp4'

        try:
            with open(video_path, 'rb') as f:
                file_data = f.read()
        except Exception as e:
            return HttpResponse(f"Error reading file: {str(e)}", status=500)

        response = HttpResponse(file_data, content_type=content_type)
        response['Accept-Ranges'] = 'bytes'
        return response


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        print("Received data:", request.data)  # ← добавить для отладки
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "message": "User created successfully"
        })
