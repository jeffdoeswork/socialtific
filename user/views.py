import boto3
import jwt
from .models import Follow
from user.serializers import MyTokenObtainPairSerializer, UserSerializer
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.db.models import Q
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from tools.aws import uploader


User = get_user_model()



@api_view(['POST'])
def sign_up(request):
    data = request.data
    pic = data['profilePic']
    try:
        user = User.objects.create_user(
            username = data['username'],
            first_name = data['firstName'],
            last_name = data['lastName'],
            email=data['email'],
            password=data['password']
        )
        if pic:
            user.profile_pic = pic
            
        user.save()
    except Exception as e:
        print(e)
        return Response({'type':'username', 'message':'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    token = str(RefreshToken.for_user(user).access_token)

    # current_site = request._request.META['HTTP_ORIGIN']
    current_site = "http://localhost:3000/"

    absurl = current_site + 'registration-confirm' + "?token=" + token
    email_body = 'Hi ' + user.email + ',\n'\
                                            'Please use the link below to complete the registration. \n' + absurl
    data = {'email_body': email_body,
            'to_email': [user.email],
            'email_subject': 'Please Verify Your Account'}
    
    email = EmailMessage(subject=data['email_subject'], body=data['email_body'], to=data['to_email'])
    email.send()
    return Response('success')


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def change_password(request):
    password= request.data['password']
    request_user = request.data.get('user', request.user)
    user = User.objects.get(username=request_user)
    user.set_password(password)
    user.save()
    return Response('success')


@api_view(['GET'])
def verify_token(request, token):
    if token:
        data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = data['user_id']
        user = User.objects.get(id=user_id).username
        return Response({'user':user})


@api_view(["POST"])
def password_recovery(request):
    email = request.data['email']
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message':'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    else:
        token = str(RefreshToken.for_user(user).access_token)

        # current_site = request._request.META['HTTP_ORIGIN']
        current_site = "http://localhost:3000/"
        absurl = current_site + 'passwordRecoverConfirm/' + "?token=" + token
        email_body = 'Hi ' + user.email + ',\n'\
                                             'You have recieved this email because a request has been made'\
        ' to change your password. If you did not initiate this request, please disregard this email. \n' + absurl
        data = {'email_body': email_body,
                'to_email': [user.email],
                'email_subject': 'Please Verify Your Account'}
        email = EmailMessage(subject=data['email_subject'], body=data['email_body'], to=data['to_email'])
        email.send()
        return Response('success')


@api_view(["GET"])
def validate_registration(request):
    token = request.query_params.get('token')
    try:
        data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except Exception as e:
        print(e)
        return Response("invalid token",status=status.HTTP_404_NOT_FOUND)
    user_id = data["user_id"]
    user = User.objects.get(id=user_id)
    user.is_email_verified = True
    user.save()
    return Response('ok')


@api_view(["GET"])
def get_user(request):
    """
    Return a user that is an exact match.
    """
    query = request.query_params.get('user')
    user = User.objects.filter(username__startswith=query)  
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def update(self, request, pk=None, partial=True):
        user = self.queryset.get(username=pk)
        image = request.data.get('image')
        if image:
            uploader(image)
            user.profile_pic_link = settings.AWS_BUCKET_URL + image.name
        user.save()
        return Response('ok')
    
    def retrieve(self, request, *args, **kwargs):
        user = kwargs.get('pk')
        user = self.queryset.get(username=user)
        serializer = self.serializer_class(user)
        return Response(serializer.data)


class FollowerViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()

    def create(self, request):
        """
        Create a Follow inst
        
        Requested User will always be is_following instance
        """
        friend = request.data.get('friend')
        kwargs = {}
        try:
            followed_by = User.objects.get(username=request.user)
            is_following = User.objects.get(username=friend)
        except User.DoesNotExist:
            return Response('Resource not found', status=status.HTTP_404_NOT_FOUND)

        kwargs['followed_by'] = followed_by
        kwargs['is_following'] = is_following
        if  not Follow.objects.filter(**kwargs).exists():
            Follow.objects.create(**kwargs)
            return Response('ok')

    def destroy(self, request, pk=None):
        """
        Delete a Follow isnt
        """
        try:
            Follow.objects.filter(followed_by__username=request.user, is_following__username=pk).delete()
        except Follow.DoesNotExist:
            pass
        return Response('friend deleted')