from django.shortcuts import render, redirect, HttpResponse
from login_n_registration_app.models import *
from .models import *

# PAGES (Home, Dashboard, View)
# HOME


def index(request):
    context = {
        'user': None
    }

    if user_logged_in(request):
        user = User.objects.all().get(id=request.session['user_id'])
        context['liked_urls'] = user.liked_urls
        context['user_id'] = user.id
        context['user'] = user

    return render(request, 'index.html', context)

# VIEW


def view(request):
    url = request.GET['image_url']
    breed = get_breed(url)

    context = {
        'url': url,
        'breed': breed,
        'user_id': None,
        'user': None
    }

    if user_logged_in(request):
        user = User.objects.all().get(id=request.session['user_id'])

        context['liked_urls'] = user.liked_urls
        context['user_id'] = user.id
        context['user'] = user

    return render(request, 'view.html', context)

# DASHBOARD


def dashboard(request):
    if user_logged_in(request):
        user = User.objects.all().get(id=request.session['user_id'])

        context = {
            'liked_urls': user.valid_urls(),
            'user_id': user.id,
            'user': user
        }

        return render(request, 'dashboard.html', context)

    return redirect("/")


def logout(request):
    request.session['user_id'] = None
    return redirect("/")


def like(request, user_id):
    user = User.objects.all().get(id=user_id)
    liked_urls = user.valid_urls()
    image_url = request.GET['image_url']
    response = "/static/assets/heart.png"

    if image_url not in liked_urls:
        liked_urls.append(image_url)
        user.liked_urls = ", ".join(liked_urls)
        response = "/static/assets/heart-filled.png"
    else:
        valid_urls = []
        for i in range(len(liked_urls)):
            url = liked_urls[i]
            if url != image_url:
                valid_urls.append(url)
        user.liked_urls = ", ".join(valid_urls)

    user.save()
    return HttpResponse(response)


def user_logged_in(request):
    return 'user_id' in request.session and request.session['user_id'] != None


def update_dark_mode(request):
    request.session['dark_mode'] = request.GET['dark']
    return HttpResponse("success")


def get_breed(str):
    base_url = 'https://images.dog.ceo/breeds/'
    breed_str = ''

    for i in range(len(base_url), len(str)):
        if (str[i] == "/"):
            break
        breed_str += str[i]

    return breed_str
