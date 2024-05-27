from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver

class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def find_element(self, by, value):
        return self.driver.find_elements(by, value)

    def is_element_visible(self, by, value):
        try:
            self.find_element(by, value)
            return True
        except:
            return False
        
    def wait_for_seconds(self, seconds):
        WebDriverWait(self.driver, seconds).until(lambda driver: True)

    def select_element(self, value):
        return self.find_element(value).click()

