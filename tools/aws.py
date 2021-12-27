"""
Configuration for AWS communication. Pulls in settings from Django settings 

This is the central location to create anything AWS/boto3 related
"""

import boto3
from django.conf import settings

s3_client = boto3.client('s3', 
                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID, 
                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, 
                      )

def uploader(image_obj):
    """
    Parses image and uploads to AWS S3 bucket.
    """
    s3_client.upload_fileobj(image_obj.file, settings.AWS_STORAGE_BUCKET_NAME, image_obj.name, ExtraArgs={'ACL':'public-read'})
