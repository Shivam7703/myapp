import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export async function openFullscreen() {
  // Create Chrome options with additional arguments
  const options = new chrome.Options();

  // Add regular arguments
  options.addArguments('--start-maximized');
  options.addArguments('--disable-infobars');
  options.addArguments('--disable-notifications');
  options.addArguments('--kiosk');
  options.addArguments('--disable-automation-controlled-banner');
  options.addArguments('--disable-extensions');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--no-sandbox');

  // Add prefs to disable automation-controlled features
  options.addArguments(`--disable-blink-features=AutomationControlled`);

  // Initialize the driver with options
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Navigate to the HTML file
    await driver.get('https://nationize.in');

    // Wait a bit for the page to load
    await new Promise(resolve => setTimeout(resolve, 700));

    // Execute JavaScript for fullscreen
    await driver.executeScript(`
      async function enterFullscreen() {
        // Lock the keyboard
        if (navigator.keyboard && navigator.keyboard.lock) {
          await navigator.keyboard.lock();
        }

        // Disable default key events
        document.onkeydown = function(e) {
          return false;
        }

        try {
          // Request fullscreen with multiple fallbacks
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            await document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            await document.documentElement.msRequestFullscreen();
          } else {
            console.error('Fullscreen not supported');
          }
        } catch (error) {
          console.error('Fullscreen request failed:', error);
        }
      }

      enterFullscreen();
    `);

    // Keep the browser open (you can adjust the time or remove this)
    await new Promise(resolve => setTimeout(resolve, 330000));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await driver.quit();
  }
}