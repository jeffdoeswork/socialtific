from . import views
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api/users/profile', views.UserViewSet, basename="users") # one-liner to automatically create URLS
router.register(r'api/users/friends', views.FollowerViewSet)
urlpatterns = router.urls 
urlpatterns+=[
    path('api/users/signup/', views.sign_up ),
    path('api/users/login/', views.MyTokenObtainPairView.as_view()),
    path('api/users/change-password/', views.change_password),
    path('api/users/password-recovery', views.password_recovery), # sends email
    path('api/users/verify/token=<str:token>/', views.verify_token), # verifies token in url for passwordrecovery
    path('api/users/validate-registration', views.validate_registration),
    path('api/users/get-user', views.get_user)
]