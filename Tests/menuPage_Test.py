import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class MenuPageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        service = Service('/usr/local/bin/chromedriver')
        cls.driver = webdriver.Chrome(service=service)

    def test_add_to_cart(self):
        driver = self.driver
        driver.get("http://localhost:5173/menupage")  # Adjust if necessary

        # Wait for the "Search and Sort" button to be present and click it
        search_sort_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Search and Sort')]"))
        )
        search_sort_button.click()

        # Wait for the search input to be visible
        search_input = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Search menu items...']"))
        )

        # Input a search term
        dish_name = "Biriyani"  # Set the dish name you expect
        search_input.send_keys(dish_name)

        # Wait for the sort dropdown and select an option
        sort_select = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//select[contains(@class, 'menu-sort-select')]"))
        )
        sort_select.click()

        # Select "Price: Low to High"
        low_to_high_option = sort_select.find_element(By.XPATH, "//option[@value='asc']")
        low_to_high_option.click()

        # Wait for the items to be filtered and displayed
        time.sleep(2)  # Adjust based on your app's response time

        # Wait for the "Add to Cart" button to be clickable
        add_to_cart_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add to Cart')]"))
        )

        # Scroll the button into view
        driver.execute_script("arguments[0].scrollIntoView();", add_to_cart_button)

        # Optional delay before clicking
        time.sleep(1)
        add_to_cart_button.click()

        # Take a screenshot for debugging (optional)
        driver.save_screenshot("screenshot_before_checking_message.png")

        # Check for the success message
        try:
            success_message = WebDriverWait(driver, 20).until(
                EC.visibility_of_element_located((By.XPATH, f"//div[contains(text(), '{dish_name} added to cart!')]"))
            )
            # Assert that the message contains the dish name
            self.assertIn(dish_name, success_message.text)
        except Exception as e:
            print("Exception occurred:", e)
            self.fail("Success message not found or another error occurred.")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
