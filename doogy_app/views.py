from django.shortcuts import render, redirect, HttpResponse
from login_n_registration_app.models import *
from .models import *


def index(request):
    context = {
        'user': None
    }

    if user_logged_in(request):
        user_id = request.session['user_id']
        user = User.objects.all().get(id=user_id)
        context['liked_urls'] = user.liked_urls
        context['user_id'] = user_id
        context['user'] = user

    return render(request, 'index.html', context)


def logout(request):
    request.session['user_id'] = None
    return redirect("/")


def dashboard(request):
    if user_logged_in(request):
        user = User.objects.all().get(id=request.session['user_id'])

        context = {
            'liked_urls': user.liked_urls_array(),
            'user': user
        }

        return render(request, 'dashboard.html', context)

    return redirect("/")


def like(request, user_id):
    user = User.objects.all().get(id=user_id)
    image_url = request.GET['image_url']
    response = "/static/assets/heart-filled.png"

    liked_urls_array = user.liked_urls_array()
    if image_url in liked_urls_array:
        for index in range(len(liked_urls_array)):
            if liked_urls_array[index] == image_url:
                liked_urls_array.pop(index)

        user.liked_urls = ", ".join(liked_urls_array)
        response = "/static/assets/heart.png"
    else:
        user.liked_urls += f"{image_url}, "

    user.save()
    return HttpResponse(response)


def download(request):
    return HttpResponse("download")


def view_raw(request):
    return HttpResponse("view raw")


def get_liked(request):
    return HttpResponse("get liked")


def user_logged_in(request):
    return 'user_id' in request.session and request.session['user_id'] != None
