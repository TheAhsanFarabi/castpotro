import time
import random
import string
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# ---------------------------------------------------------
# HELPER: Generate Random User
# ---------------------------------------------------------
def generate_random_email():
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"tester_{random_str}@castpotro.com"

# ---------------------------------------------------------
# SETUP
# ---------------------------------------------------------
options = webdriver.ChromeOptions()
options.add_experimental_option("detach", True)
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.maximize_window()

try:
    print("\n🚀 TEST STARTED: Specific Course Selection ('Intro to LLMs')\n")

    # 1. REGISTER
    print("1️⃣  Navigating to Register...")
    driver.get("http://localhost:3000/register")
    wait = WebDriverWait(driver, 10)

    TEST_EMAIL = generate_random_email()
    print(f"   ↳ Creating User: {TEST_EMAIL}")

    wait.until(EC.visibility_of_element_located((By.NAME, "name"))).send_keys("AI Tester")
    driver.find_element(By.NAME, "email").send_keys(TEST_EMAIL)
    driver.find_element(By.NAME, "password").send_keys("password123")
    driver.find_element(By.NAME, "age").send_keys("25")
    
    # Click Register
    try:
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    except:
        driver.find_element(By.CSS_SELECTOR, ".btn-primary").click()

    # 2. DASHBOARD
    print("2️⃣  Waiting for Dashboard...")
    wait.until(EC.url_contains("/dashboard"))
    time.sleep(2) # Wait for animations to settle

    # 3. SELECT SPECIFIC COURSE
    target_course = "Intro to Large Language Models"
    print(f"3️⃣  Searching for course: '{target_course}'...")

    # 👇 UPDATED XPATH: Finds the card containing the specific Title H3
    course_card = wait.until(EC.element_to_be_clickable(
        (By.XPATH, f"//div[contains(@class, 'group') and .//h3[contains(text(), '{target_course}')]]")
    ))
    
    # Scroll into view just in case it's off-screen
    driver.execute_script("arguments[0].scrollIntoView();", course_card)
    time.sleep(1) # Small pause after scroll
    course_card.click()
    print(f"   ↳ Found & Clicked '{target_course}'")

    # 4. UNLOCK COURSE
    print("4️⃣  Unlocking Course...")
    unlock_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(), 'Unlock Now')]")
    ))
    unlock_btn.click()

    # 5. WAIT FOR REDIRECT
    print("5️⃣  Waiting for Course View...")
    wait.until(EC.url_contains("?course="))
    time.sleep(2) 

    # 6. CLICK LESSON (First active lesson)
    print("6️⃣  Starting First Lesson...")
    lesson_link = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//a[contains(@href, '/dashboard/learn')]")
    ))
    lesson_link.click()

    # 7. INTERACTIVE LESSON FLOW
    print("7️⃣  Validating Lesson Page...")
    
    # A. Check Step 1 (Theory)
    print("   ↳ [Step 1] Reading Theory...")
    watch_video_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Watch Video')]")
    ))
    watch_video_btn.click()

    # B. Check Step 2 (Video)
    print("   ↳ [Step 2] Video Loaded. Starting Quiz...")
    start_quiz_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Start Quiz')]")
    ))
    time.sleep(1)
    start_quiz_btn.click()

    # C. Check Step 3 (Quiz)
    print("   ↳ [Step 3] Taking Quiz...")
    options = wait.until(EC.presence_of_all_elements_located(
        (By.CSS_SELECTOR, "button.text-left")
    ))
    if options:
        options[0].click() # Select first option
    
    submit_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Submit & Get Feedback')]")
    ))
    submit_btn.click()

    # D. Check Step 4 (Completion)
    print("   ↳ [Step 4] Completing Lesson...")
    complete_lesson_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(., 'Complete Lesson')]")
    ))
    complete_lesson_btn.click()

    # 8. FINAL VERIFICATION
    print("8️⃣  Verifying Return to Dashboard...")
    wait.until(EC.url_contains("/dashboard?course="))
    print("   ✅ Returned to Dashboard successfully.")

    print(f"\n🎉 TEST PASSED: Successfully completed '{target_course}'! 🎉\n")

except Exception as e:
    print(f"\n❌ TEST FAILED: {e}")

finally:
    print("🏁 Closing in 5s...")
    time.sleep(5)
    driver.quit()