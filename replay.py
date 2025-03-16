import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

action_trace_path = "action_trace.json"

driver = webdriver.Chrome()

with open(action_trace_path, "r") as f:
    action_trace = json.load(f)

    # first item has website that we will go to with selenium
    driver.get(action_trace[0]["url"])

    try:
        # wait max 10 seconds for page to load
        WebDriverWait(driver, 10).until(lambda driver: driver.execute_script('return document.readyState') == 'complete')
    finally:
        driver.quit()

    # every item after this is either input with the following format:
        # {selector: "",  type: "input", timestamp: 0, value: "value"}
    # or click with the following format:
        # {selector: "", type: "click", timestamp: 0}
    for action in action_trace[1:]:
        try:
            if action["type"] == "input":
                element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, action["selector"]))
                )
                element.send_keys(action["value"])
            elif action["type"] == "click":
                element = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, action["selector"]))
                )
                element.click()
        except Exception as e:
            print(f"Error: {e}")
            break
    pass

# print(action_trace)
