
import pytest
from selenium.common.exceptions import ElementNotInteractableException as TypingException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from user.models import User 
from django.conf import settings

pytestmark = pytest.mark.django_db(databases=['default'], transaction=True)

def test_disabled_textarea_on_newsfeed(browser):
    """
    Assert that exception is raised that the textarea is not interactable
    """
    browser.get('http://localhost:3000/')
    text_area = WebDriverWait(browser, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "textarea"))
    )

    with pytest.raises(TypingException):
        text_area.send_keys('sHOULD NOT TYPE')


def test_submit_observation(browser, user):
    """
    Assert that an observation can be submitted and is displayed
    """
    text = 'End 2End testing leads to higher success rate'
    browser.get('http://localhost:3000/login')
    email_input = browser.find_element(By.NAME,"username")
    email_input.send_keys(user.username)
    password_input = browser.find_element(By.NAME,"password")
    password_input.send_keys(user.password)
    password_input.send_keys(Keys.ENTER)

    text_area = WebDriverWait(browser, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "textarea"))
    )

    text_area.send_keys(text)

    button = browser.find_element(By.CLASS_NAME, 'btn-info')
    button.click()
    node = f'//p[text()="{text}"]'
    browser.find_element(By.XPATH, node )

