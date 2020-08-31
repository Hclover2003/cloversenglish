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
from .models import *


def index(request):
    return render(request, "courses/index.html")


def course_page(request):
    return render(request, "courses/courses.html")


def course_details(request, courseid):
    course = Course.objects.get(pk=courseid)
    videos = Video.objects.filter(course=course)
    return render(request, "courses/coursedetails.html", {
        "course": course,
        "videos": videos
    })


@csrf_exempt
def comment(request, view):
    if view == 'add':
        data = json.loads(request.body)
        newcmt = Comment(comment=data['comment'], user=request.user,
                         video=Video.objects.get(pk=data['vidid']))
        newcmt.save()
    comments = Comment.objects.all()
    return JsonResponse([comment.serialize() for comment in comments], safe=False)


def video_details(request, videoid):
    video = Video.objects.get(pk=videoid)
    comments = Comment.objects.filter(video=video)
    print(len(comments))
    return render(request, "courses/videodetails.html", {
        "video": video,
        "comments": comments,
        "clen": len(comments)
    })


@csrf_exempt
def courses(request, view):
    if view == "all":
        courses = Course.objects.all()
    elif view == "filtered":
        data = json.loads(request.body)
        if (data["category"] != "all categories" and data["level"] != "all levels"):
            courses = Course.objects.filter(
                level=data["level"], category=data["category"])
        elif data["category"] != "all categories":
            courses = Course.objects.filter(category=data["category"])
        elif data["level"] != "all levels":
            courses = Course.objects.filter(level=data["level"])
    return JsonResponse([course.serialize() for course in courses], safe=False)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "courses/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "courses/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "courses/register.html")


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "courses/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "courses/login.html")
