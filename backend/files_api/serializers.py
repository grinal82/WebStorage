from rest_framework import serializers
from .models import UserFile


class UserFileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    comment = serializers.CharField(required=False, allow_blank=True)


class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = "__all__"

    # NOTE: method to be used in patch method of UserFileDetailView
    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.comment = validated_data.get("comment", instance.comment)
        instance = super().update(instance, validated_data)

        instance.save()
        return instance
