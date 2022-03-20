import playwright from 'playwright'
import { ScrapeParramattaElements } from './LGAs/parramatta'

export async function start(): Promise<void> {
  console.log('\x1b[44m%s\x1b[0m', 'launch')
  const browser = await playwright.webkit.launch()
  console.log('\x1b[44m%s\x1b[0m', 'launched')
  await ScrapeParramattaElements(browser)
  await browser.close()
  console.log('\x1b[44m%s\x1b[0m', 'closed')
}

start()
