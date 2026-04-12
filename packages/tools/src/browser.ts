import { chromium, Browser, Page } from "playwright";

let sharedBrowser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!sharedBrowser) {
    sharedBrowser = await chromium.launch({
      headless: true
    });
  }
  return sharedBrowser;
}

export async function withPage<T>(
  fn: (page: Page) => Promise<T>
): Promise<T> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    return await fn(page);
  } finally {
    await page.close();
  }
}

export async function simpleNavigate(url: string): Promise<string> {
  return withPage(async (page) => {
    await page.goto(url, { waitUntil: "networkidle" });
    return await page.content();
  });
}
