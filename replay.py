import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options


action_trace_path = "action_trace.json"
service = Service(executable_path="C:/Users/Fadi/Documents/Career/AlteraInterview/extension-take-home/chromedriver.exe")

driver = webdriver.Chrome(service=service)

with open(action_trace_path, "r") as f:
    action_trace = json.load(f)

    # first item has website that we will go to with selenium
    driver.get(action_trace[0]["url"])

    try:
        # wait max 10 seconds for page to load
        WebDriverWait(driver, 10).until(lambda driver: driver.execute_script('return document.readyState') == 'complete')
    except Exception as e:
        driver.quit()
    
    previousTimestamp = int(action_trace[0]["timestamp"])
    # every item after this is either keydown or click with the following format:
    for action in action_trace[1:]:
        try:
            if action["type"] == "keydown" and action["value"] != "Shift":
                # wait for the time difference between this and the previous action
                timeDiff = int(action["timestamp"]) - previousTimestamp
                if timeDiff > 0:
                    driver.implicitly_wait(timeDiff / 1000)
                
                element.send_keys(action["value"])

                # reset for next iteration    
                previousTimestamp = int(action["timestamp"])
            elif action["type"] == "click":
                element = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, action["selector"]))
                )
                timeDiff = int(action["timestamp"]) - previousTimestamp
                if timeDiff > 0:
                    driver.implicitly_wait(timeDiff / 1000)
                
                element.click()

                # reset for next iteration    
                previousTimestamp = int(action["timestamp"])
        except Exception as e:
            print(f"Error: {e}")
            break
    pass

# print(action_trace)
