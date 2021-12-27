import factory
import json
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory
from newsfeed.models import Group, Data, Experiment, Hypothesis, Conclusion


class UserFactory(DjangoModelFactory):
    username = 'testuser587'
    email = 'test@suite.com'

    class Meta:
        model = get_user_model()
    

class ArtifactFactory(factory.Factory):
    description = factory.Faker('paragraph', nb=3)
    author = factory.SubFactory(UserFactory)

class GroupFactory(DjangoModelFactory):
    admin = factory.SubFactory(UserFactory)
    name = factory.Faker('Coolios')

    class Meta:
        model = Group
    
   


class Data(ArtifactFactory, DjangoModelFactory):
    

    class Meta:
        model = Data
    

class Experiement(DjangoModelFactory):
    author = factory.SubFactory(UserFactory)

    class Meta:
        model = Experiment
    

class Hypothesis(DjangoModelFactory):
    author = factory.SubFactory(UserFactory)

    class Meta:
        model = Hypothesis 

class ConclusionFactory(DjangoModelFactory):
    author = factory.SubFactory(UserFactory)

    class Meta:
        model = Conclusion
    