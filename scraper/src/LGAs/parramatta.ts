import { LGAEvent } from '../types'
import playwright from 'playwright'

export async function ScrapeParramattaElements(
  browser: playwright.Browser
): Promise<void> {
  const page = await browser.newPage()
  await page.goto('https://atparramatta.com/whats-on')
  await browser.close()
  const events: LGAEvent[] = await page.$$eval(
    '.product_pod',
    (elements: HTMLElement[]) => {
      return elements.map((event): LGAEvent => {
        return {
          title: event.querySelector('div')?.innerText || '',
          description: event.querySelector('div')?.innerText || null,
          startDate:
            new Date(Date.parse(event.querySelector('div')?.innerText || '')) ||
            new Date(),
          endDate:
            new Date(Date.parse(event.querySelector('div')?.innerText || '')) ||
            new Date(),
          id: event.querySelector('div')?.innerText || '',
          eventImageUrl: event.querySelector('div')?.innerText || '',
          eventUrl: event.querySelector('div')?.innerText || '',
        }
      })
    }
  )
  console.log(events)
}
