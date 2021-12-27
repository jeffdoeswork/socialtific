import json
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from newsfeed.tests.factories import UserFactory

from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.conf import settings





@pytest.fixture
def user():
    password = 'testing1'
    user =  UserFactory()
    user.set_password(password) # create hash that Djangowill check against for authen
    user.save()
    user.password = password # return password back to 'normal' for easy access inside tests
    return user

@pytest.fixture
def browser():
    service = Service(ChromeDriverManager().install())    
    chrome_driver = webdriver.Chrome(service=service)
    yield chrome_driver
    chrome_driver.quit()