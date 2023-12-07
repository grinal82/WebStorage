from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import get_valid_filename

Users = get_user_model()


def user_file_directory_path(instance, filename):
    return f"{instance.user.id}/{filename}"


class UserFile(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_file_directory_path)
    name = models.CharField(max_length=255)
    comment = models.TextField(blank=True, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    last_download_date = models.DateTimeField(auto_now=False, null=True)

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.last_download_date = timezone.now()

    def __str__(self):
        return f"{self.user} - {self.name}"
