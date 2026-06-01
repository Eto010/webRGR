import os
import re
from django.views import View
from django.http import JsonResponse, HttpResponse, Http404
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .models import Video
from .serializers import VideoSerializer, RegisterSerializer

User = get_user_model()

# Health check
def health_check(request):
    return JsonResponse({'status': 'ok'})

# Video CRUD
class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-uploaded_at')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)

# Video streaming with range requests
class StreamVideoView(View):
    def get(self, request, video_id):
        video = Video.objects.get(id=video_id)
        video_path = video.video_file.path
        if not os.path.exists(video_path):
            raise Http404

        stat = os.stat(video_path)
        file_size = stat.st_size
        range_header = request.headers.get('Range', None)

        if range_header:
            m = re.search(r'bytes=(\d+)-(\d*)', range_header)
            if m:
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else file_size - 1
                if start >= file_size or end >= file_size:
                    return HttpResponse(status=416)
                length = end - start + 1
                response = HttpResponse(status=206)
                response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
                response['Content-Length'] = str(length)
                with open(video_path, 'rb') as f:
                    f.seek(start)
                    response.write(f.read(length))
            else:
                return HttpResponse(status=400)
        else:
            response = HttpResponse(status=200)
            response['Content-Length'] = str(file_size)
            with open(video_path, 'rb') as f:
                response.write(f.read())

        response['Content-Type'] = 'video/mp4'
        response['Accept-Ranges'] = 'bytes'
        return response

# User registration
class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
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