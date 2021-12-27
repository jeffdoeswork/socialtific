from django.urls import path
from newsfeed import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'api/observations', views.ObservationViewSet, basename="observation" )
router.register(r'api/hypothesis', views.HypothesisViewSet, basename="hypothesis" )
router.register(r'api/experiment', views.ExperimentViewSet, basename="expermient" )
router.register(r'api/data', views.DataViewset)
router.register(r'api/conclusion', views.ConclusionViewSet, basename="conclusion")
router.register(r'api/groups', views.GroupViewSet, basename="groups"),
router.register(r'api/react', views.ReactionViewSet)

urlpatterns = [
    path('api/new-social-method/<int:pk>/', views.create_social_method),
    path('api/artifacts', views.artifact_feed)
]
urlpatterns += router.urls
