from django.shortcuts import render, redirect, HttpResponse
from django.contrib import messages
from django.views.generic import View
from .models import User
import bcrypt


class LoginRegistration(View):
    def get(self, request):
        return redirect("/")

    def post(self, request):
        if 'register' in request.POST:
            errors = User.objects.register_validator(request.POST)
            password = bcrypt.hashpw(
                request.POST['password'].encode(), bcrypt.gensalt()).decode()

            if len(errors) > 0:
                return render(request, 'welcome.html', {'messages': errors.values()})

            user = User.objects.create(
                name=request.POST['name'], email=request.POST['email'], password=password)
            request.session['user_id'] = user.id
            return redirect("/")

        if 'login' in request.POST:
            errors = User.objects.login_validator(request.POST)
            if len(errors) > 0:
                return render(request, 'welcome.html', {'messages': errors.values()})

            for user in User.objects.all():
                password_matched = bcrypt.checkpw(
                    request.POST['password'].encode(), user.password.encode())
                if password_matched and (user.email == request.POST['email']):
                    request.session['user_id'] = user.id
                    return redirect("/")

            return redirect("/", {'messages': ['Password and Email do not match.']})

        return redirect("/")


def index(request):
    if 'user_id' in request.session:
        if request.session['user_id'] != None:
            return redirect("/")

    return render(request, 'welcome.html')
