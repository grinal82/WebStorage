from rest_framework import serializers
from .models import UserFile


class UserFileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    comment = serializers.CharField(required=False, allow_blank=True)


class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = "__all__"
