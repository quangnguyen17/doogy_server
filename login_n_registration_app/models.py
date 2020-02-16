from django.db import models
from datetime import datetime
import re


class UserManager(models.Manager):
    def register_validator(self, data):
        errors = {}
        EMAIL_REGEX = re.compile(
            r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

        if len(data['name']) < 2:
            errors['name'] = "Name - required; at least 8 characters; letters only"
        if not EMAIL_REGEX.match(data['email']):
            errors['email'] = "Invalid email address!"
        if len(data['password']) < 8:
            errors['password'] = "Password - required; at least 8 characters;"
        if data['password'] != data['confirm_pw']:
            errors['confirm_pw'] = "Passwords don't match, matches password confirmation"

        return errors

    def login_validator(self, data):
        errors = {}
        EMAIL_REGEX = re.compile(
            r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

        if not EMAIL_REGEX.match(data['email']):
            errors['email'] = "Invalid email address!"
        if len(data['password']) < 8:
            errors['password'] = "Password - required; at least 8 characters;"

        return errors


class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    wall_urls = models.TextField(default="")
    liked_urls = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()

    def valid_urls(self):
        liked_urls = self.liked_urls.split(", ")
        valid_urls = []

        for i in range(len(liked_urls)):
            url = liked_urls[i]
            if len(url) > 0:
                valid_urls.append(url)

        return valid_urls
