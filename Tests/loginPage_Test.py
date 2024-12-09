import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class LoginPageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        service = Service('/usr/local/bin/chromedriver')  # Adjust the path as needed
        cls.driver = webdriver.Chrome(service=service)

    def test_login_success(self):
        driver = self.driver
        driver.get("http://localhost:5173/login")

        # Input valid email
        email_input = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "email"))
        )
        email_input.send_keys("") # Replace with a valid test email

        # Input valid password
        password_input = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "password"))
        )
        password_input.send_keys("")  # Replace with the corresponding password

        # Click login button
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
        )
        login_button.click()

        # Wait for the toast message to be visible
        try:
            toast_message = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'Toastify__toast--success')]"))
            )
            self.assertIn("Login successful!", toast_message.text)
        except Exception as e:
            print("Current page source:", driver.page_source)
            print("Exception occurred:", e)
            self.fail("Login did not succeed or the toast message was not displayed.")

        # Verify redirection to user profile page
        WebDriverWait(driver, 10).until(EC.url_changes("http://localhost:5173/login"))
        print("Current URL after login:", driver.current_url)
        self.assertEqual(driver.current_url, "http://localhost:5173/userprofile")

    def test_login_failure(self):
        driver = self.driver
        driver.get("http://localhost:5173/login")

        # Input invalid email
        email_input = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "email"))
        )
        email_input.send_keys("invalid@example.com")  # Replace with an invalid test email

        # Input invalid password
        password_input = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "password"))
        )
        password_input.send_keys("wrongpassword")  # Replace with an invalid password

        # Click login button
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
        )
        login_button.click()

        # Wait for the error toast message
        try:
            error_message = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'Toastify__toast--error')]"))
            )
            self.assertIn("Invalid email or password", error_message.text)  # Adjust as necessary
        except Exception as e:
            print("Current page source:", driver.page_source)
            print("Exception occurred:", e)
            self.fail("Error message for failed login not displayed.")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
