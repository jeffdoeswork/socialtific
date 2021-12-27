from .models import Follow
from django.contrib.auth import get_user_model
from django.db.models import Q
from newsfeed.models import Group
from rest_framework import serializers 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()

class FollowerSerializer(serializers.ModelSerializer):
    folowed_by = serializers.StringRelatedField() #  no need to return entire seralized user object
    is_following = serializers.StringRelatedField()

    class Meta:
        model = Follow
        fields = ('__all__')


class UserSerializer(serializers.ModelSerializer):

    profilePicLink = serializers.CharField(source="profile_pic_link")
    friends = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        exclude = ('profile_pic_link',) # without the exlusion both 'versions' would be shown

    def get_friends(self, obj):
        friend_dict = {}
        friend_dict['followers'] = obj.followed_by.exclude(followed_by=obj).values_list("followed_by__username", flat=True)
        friend_dict['isFollowing'] = obj.followed_by.values_list("is_following__username", flat=True)
        return friend_dict

    def get_groups(self, obj): # this cold be an instance method instead
        return Group.objects.filter(Q(members=obj)| Q(admin=obj)).values_list("name", flat=True)


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = User 
        fields = ('id','username', 'email', 'first_name', 'last_name', 'token', 'profilePicLink', 'friends', 'groups')
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v 

        return data