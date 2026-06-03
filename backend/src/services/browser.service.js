import { chromium } from "playwright";

export const takeScreenshot = async (url, width, height, fullPage = false, ignoredSelectors = []) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
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
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default {
  takeScreenshot
};
