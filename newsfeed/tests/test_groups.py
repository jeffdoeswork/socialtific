import pytest
from selenium.webdriver.common.by import By

def test_create_group(browser, user):
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