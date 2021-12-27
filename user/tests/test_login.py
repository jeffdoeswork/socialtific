import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from ..models import User

@pytest.mark.django_db(transaction=True)
def test_login_success(browser, user):
    """
    Assert user can successfully login and is properly redirected.
    """
    browser.get('http://localhost:3000/login')
    email_input = browser.find_element(By.NAME,"username")
    email_input.send_keys(user.email)
    password_input = browser.find_element(By.NAME,"password")
    password_input.send_keys(user.password)
    password_input.send_keys(Keys.ENTER)
    text_area = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "textarea"))
    )
    text_area.send_keys('This should not raise an exception')
    assert text_area



def test_login_failed(browser):
    """
    Assert user cannot login, is not redirected, and cannot 
    submit an Observation
    """
    browser.get('http://localhost:3000/login')
    email_input = browser.find_element(By.NAME,"username")
    email_input.send_keys('adin')
    password_input = browser.find_element(By.NAME,"password")
    password_input.send_keys('testing1')
    password_input.send_keys(Keys.ENTER)
    WebDriverWait(browser, 10, poll_frequency=.3).until(
        EC.presence_of_element_located((By.CLASS_NAME, "showAlert"))
    )

