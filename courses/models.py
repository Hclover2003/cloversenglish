from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Course(models.Model):
    CATEGORIES = (('books', 'books'), ('poetry', 'poetry'), ('daily', 'daily'),
                  ('other', 'other'))
    LEVELS = (('one', 'one'), ('two', 'two'), ('three', 'three'),
              ('four', 'four'))
    timestamp = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100)
    tagline = models.CharField(max_length=200)
    description = models.CharField(max_length=5000)
    coverimg = models.CharField(max_length=2000)
    category = models.CharField(
        max_length=128, blank=True, choices=CATEGORIES, default='')
    level = models.CharField(
        max_length=128, blank=True, choices=LEVELS, default='')

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "tagline": self.tagline,
            "description": self.description,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p"),
            "coverimg": self.coverimg,
            "category": self.category,
            "level": self.level
        }

    def __str__(self):
        return f"{self.title}|{self.tagline}|{self.category}|{self.level}|{self.timestamp}"


class Tag(models.Model):
    name = models.CharField(max_length=200)


class Video(models.Model):
    url = models.CharField(max_length=500)
    img = models.CharField(max_length=500)
    title = models.CharField(max_length=1000)
    tags = models.ManyToManyField("Video", related_name="taggedvideos")
    description = models.CharField(max_length=2000)
    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="videos")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "url": self.url,
            "description": self.description,
            "img": self.img,
            "coverimg": self.coverimg,
            "course": self.course.title,
        }


class Comment(models.Model):
    video = models.ForeignKey(
        "Video", on_delete=models.CASCADE, related_name="vidcomments")
    comment = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="usercomments")

    def __str__(self):
        return f"{self.comment}|{self.user.username}|{self.timestamp}"

    def serialize(self):
        return {
            "id": self.id,
            "vidtitle": self.video.title,
            "comment": self.comment,
            "timestamp": self.timestamp,
            "username": self.user.username,
        }


class Reply(models.Model):
    parentcomment = models.ForeignKey(
        "Comment", blank=True, null=True, on_delete=models.SET_NULL, related_name="commentreplies")
    timestamp = models.DateTimeField(auto_now_add=True)
    reply = models.CharField(max_length=1000)
    user = models.ForeignKey("User", blank=True, null=True,
                             on_delete=models.SET_NULL, related_name="userreplies")

    def serialize(self):
        return {
            "id": self.id,
            "cmtid": self.parentcomment.id,
            "reply": self.reply,
            "timestamp": self.timestamp,
            "username": self.user.username,
        }
