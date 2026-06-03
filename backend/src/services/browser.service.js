import { chromium } from "playwright";

let browserInstance = null;

export const startBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await chromium.launch({ headless: true });
  }
  return browserInstance;
};

export const closeBrowser = async () => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
};

export const takeScreenshot = async (browser, url, width, height, ignoredSelectors = [], fullPage = false) => {
  const isMobile = width <= 768;
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile,
    hasTouch: isMobile
  });
  
  const page = await context.newPage();
  
  try {
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    } catch (timeoutError) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    }

    await page.addStyleTag({
      content: `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }`
    });

    if (Array.isArray(ignoredSelectors) && ignoredSelectors.length > 0) {
      await page.evaluate((selectors) => {
        selectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((el) => {
            el.style.visibility = "hidden";
          });
        });
      }, ignoredSelectors);
    }

    const buffer = await page.screenshot({ type: "png", fullPage });
    return buffer;
  } catch (pageError) {
    throw new Error(pageError.message);
  } finally {
    await context.close();
  }
};

export default {
  startBrowser,
  closeBrowser,
  takeScreenshot
};
