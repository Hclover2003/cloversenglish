from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("logout", views.logout_view, name="logout"),
    path("login", views.login_view, name="login"),
    path("register", views.register_view, name="register"),
    path("coursepage", views.course_page, name="coursepage"),
    path("coursedetails/<int:courseid>",
         views.course_details, name="coursedetails"),
    path("videodetails/<int:videoid>",
         views.video_details, name="videodetails"),

    # api routes
    path("courses/<str:view>", views.courses, name="courses"),
    path("comment/<str:view>", views.comment, name="comment"),
    path("reply", views.reply, name="reply")
]
