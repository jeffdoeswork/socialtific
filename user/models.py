from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models




class User(AbstractUser):

    profile_pic_link = models.CharField(max_length=255, null=True)
    email = models.EmailField(max_length=255, unique=True)
    is_email_verified = models.BooleanField(default=False)


    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.username


class Follow(models.Model):
    followed_by = models.ForeignKey(User, related_name='followed_by', on_delete=models.CASCADE)
    is_following = models.ForeignKey(User, related_name='is_following',on_delete=models.CASCADE)