import { LGAEvent } from '../types'
import playwright from 'playwright'

export async function ScrapeParramattaElements(
  browser: playwright.Browser
): Promise<void> {
  const page = await browser.newPage()
  await page.goto('https://atparramatta.com/whats-on')
  await browser.close()
  const events: LGAEvent[] = await page.$$eval(
    '.col-wrap',
    (elements: HTMLElement[]) => {
      return elements.map((event): LGAEvent => {
        const dates = page.locator('div:event-dates').textContent.toString()
        return {
          title: page.locator('div:title').textContent.toString() || '',
          description: event.querySelector('div')?.innerText || null,
          startDate:
            new Date(
              Date.parse(dates.substring(0, dates.indexOf('-') - 1) || '')
            ) || new Date(),
          endDate:
            new Date(
              Date.parse(dates.substring(dates.indexOf('-') + 1) || '')
            ) || new Date(),
          id:
            `${dates.substring(0, dates.indexOf('-'))}-${page
              .locator('div:title')
              .textContent.toString()
              .replace(' ', '-')}` || '',
          eventImageUrl: event.querySelector('div')?.innerText || '',
          eventUrl: event.querySelector('div')?.innerText || '',
        }
      })
    }
  )
  console.log(events)
}
