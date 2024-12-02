// src/app/api/fullscreen/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function runSeleniumAutomation() {
  try {
    // Dynamically import selenium-webdriver
    const { Builder } = await import('selenium-webdriver');
    const chrome = await import('selenium-webdriver/chrome');
    
    // Create Chrome options
    const options = new chrome.Options();
    options.addArguments(
      '--start-maximized',
      '--disable-infobars',
      '--disable-notifications',
      '--kiosk',
      '--disable-automation-controlled-banner',
      '--disable-extensions',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled'
    );

    // Create driver
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    try {
      // Navigate to target URL
      await driver.get('https://nationize.in');

      // Execute fullscreen script
      await driver.executeScript(`
        async function enterFullscreen() {
          try {
            // Attempt fullscreen methods
            if (document.documentElement.requestFullscreen) {
              await document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              await document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              await document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
              await document.documentElement.msRequestFullscreen();
            }

            // Disable key events
            document.onkeydown = function(e) {
              return false;
            };

            // Lock keyboard if possible
            if (navigator.keyboard && navigator.keyboard.lock) {
              await navigator.keyboard.lock();
            }
          } catch (error) {
            console.error('Fullscreen failed:', error);
          }
        }

        enterFullscreen();
      `);

      // Take screenshot
    //   const screenshot = await driver.takeScreenshot();

      return {
        success: true,
        message: 'Fullscreen automation completed',
        // screenshot: screenshot
      };
    } catch (navigationError) {
      console.error('Navigation error:', navigationError);
      return {
        success: false,
        message: 'Automation failed',
        error: navigationError instanceof Error ? navigationError.message : String(navigationError)
      };
    } finally {
      // Always quit the driver
    //   await driver.quit();
    }
  } catch (importError) {
    console.error('Selenium import error:', importError);
    return {
      success: false,
      message: 'Failed to load Selenium',
      error: importError instanceof Error ? importError.message : String(importError)
    };
  }
}

export async function GET(request: NextRequest) {
  // Ensure server-side only
  if (typeof window !== 'undefined') {
    return NextResponse.json({ 
      error: 'Server-side method only' 
    }, { status: 400 });
  }

  try {
    const result = await runSeleniumAutomation();

    return result.success 
      ? NextResponse.json(result, { status: 200 })
      : NextResponse.json(result, { status: 500 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Unexpected server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}