from django.contrib.auth import get_user_model
from newsfeed.models import Observation, Data, Experiment, Hypothesis, Comment
import time

def loaddb():
    User = get_user_model()
    PASSWORD='testing1'
    users=[]
    if not User.objects.filter(username="test").exists():
        user = User(username='test', email='test@test.com', password=PASSWORD)
        users.append(user)
        print('Creating User "Test"!')
        time.sleep(1)
    if not User.objects.filter(username="test").exists():    
        user = User(username='foo', email='foo@foo.com', password=PASSWORD)
        users.append(user)
        print('Creating user "admin')
        
    User.objects.bulk_create(users)
    time.sleep(1)

    Observation.objects.create(user=User.objects.get(username='admin'), description="The earth is flat")
    Observation.objects.create(user=User.objects.get(username='test'), description="Birds are gov't drone")