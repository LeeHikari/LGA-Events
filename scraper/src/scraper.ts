import playwright from 'playwright'
import { ScrapeParramattaElements } from './LGAs/parramatta'

export async function start(): Promise<void> {
  const browser = await playwright.webkit.launch()
  ScrapeParramattaElements(browser);
  await browser.close()
}

start()
