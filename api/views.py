from django.http import JsonResponse
# удалите импорты rest_framework.decorators и rest_framework.response

def health_check(request):
    return JsonResponse({'status': 'ok'})
