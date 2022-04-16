import { LGAEvent } from '../common/types'
import { Page } from 'playwright'

export async function scrapeCampbelltown(page: Page): Promise<LGAEvent[]> {
  const baseUrl = 'https://www.campbelltown.nsw.gov.au/WhatsOn'
  let events: LGAEvent[] = []

  try {
    // Only used for dev logging purposes
    // page.locator.evaluateAll executes code on a headless browser,
    // so console.logs inside this function will not appear on the node console.

    // page.on('console', (msg) => {
    //   const args = msg.args()
    //   for (let i = 0; i < args.length; ++i) {
    //     console.log(`${i}: ${args[i]}`)
    //   }
    // })

    await page.goto(baseUrl)

    events = await page
      .locator('a.listing-link.event-listing-link')
      .evaluateAll((eventElements: HTMLElement[]) => {
        return eventElements
          .map((anchorElement): LGAEvent | null => {
            const eventUrl = anchorElement.getAttribute('href')
            if (!eventUrl) {
              console.warn('MISSING: eventUrl')
              return null
            }

            const title = anchorElement.getAttribute('title')
            if (!title) {
              console.warn('MISSING: title')
              return null
            }

            const description =
              anchorElement.querySelector(
                'div.event-listing-info-container p.search-listing-description'
              )?.textContent || null
            if (!description) {
              console.warn('MISSING: description')
              return null
            }

            // PARSE DATE - START
            const dayString =
              anchorElement.querySelector(
                'div.event-listing-info-container div.event-related-date.event-listing-date span.event-day'
              )?.textContent || null
            if (!dayString) {
              console.warn('MISSING: dayString')
              return null
            }

            const day = Number.parseInt(dayString)
            if (!day) {
              console.warn('MISSING: day')
              return null
            }

            const monthName =
              anchorElement.querySelector(
                'div.event-listing-info-container div.event-related-date.event-listing-date span.event-month'
              )?.textContent || null

            const months = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ]

            const monthIndex = months.findIndex((m) => m === monthName)
            if (!monthIndex) {
              console.warn('MISSING: monthIndex')
              return null
            }

            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const currentMonthIndex = currentDate.getMonth()

            const monthIsNextYear = currentMonthIndex > monthIndex
            const year = monthIsNextYear ? currentYear + 1 : currentYear

            const startDate = new Date(year, monthIndex, day, 0, 0, 0)
            // PARSE DATE - END

            const imageUrl = anchorElement
              .querySelector('div.event-listing-image img.listing-image')
              ?.getAttribute('src')

            if (!imageUrl) {
              console.warn('MISSING: ImageURL')
              return null
            }

            const category = anchorElement.querySelector(
              'div.category-container.event-category-container span.category-listing'
            )?.textContent

            if (!category) {
              console.warn('MISSING: Category')
              return null
            }

            const id = startDate.toJSON() + title

            return {
              title,
              description,
              startDate,
              endDate: null,
              category,
              id,
              imageUrl,
              url: eventUrl,
              lga: 'campbelltown'
            }
          })
          .filter((event): event is LGAEvent => event !== null)
      })
  } catch (error) {
    console.log(error)
  }
  return events
}
