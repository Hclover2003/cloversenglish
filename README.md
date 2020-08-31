##Reset Migrations
find . -path "_/migrations/_.py" -not -name "**init**.py" -delete
find . -path "_/migrations/_.pyc" -delete
pip install --upgrade --force-reinstall django

##Installation
python3 -m venv .venv
python -m pip install Django

##Django App Setup:
django-admin startproject PROJECT_NAME
python manage.py startapp APP_NAME
add APP_NAME to INSTALLED_APPS in settings.py

python manage.py makemigrations APP_NAME
python manage.py migrate
python manage.py createsuperuser
admin.site.register(MODEL_NAME)

##App Folder Setup
templates/APP_NAME
static/APP_NAME

###Important Imports:
URLS.PY
path('', include(APP_URLS.PY))
from django.urls import include, path
APP_URLS.PY
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
urlpatterns = [
path("PATH", views.VIEW_NAME, name="NICKNAME"),
]
APP_VIEWS.PY
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.core.paginator import Paginator
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

##CSS and Styling

<!-- bootstrap -->

    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
      crossorigin="anonymous"
    />

<!-- js -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
<!--fontawesome-->

    <script src="https://kit.fontawesome.com/d249f6d9f5.js" crossorigin="anonymous"></script>

##Django Template
{%block body%}{%endblock%}
{%if%}{%else%}{%endif%}
{%for%}{%endfor%}
{%csrf_token%}
{{VARIABLE_NAME}}
