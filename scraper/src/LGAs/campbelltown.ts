import { LGAEvent } from '../common/types'
import { Page } from 'playwright'
import ora from 'ora'
import chalk from 'chalk'

export async function scrapeCampbelltown(page: Page): Promise<LGAEvent[]> {
  const baseUrl = 'https://www.campbelltown.nsw.gov.au/WhatsOn'
  const retrievingElements = ora(`${baseUrl}/whats-on - Getting Elements`)
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
            //PARSE EVENTURL - START
            const eventUrl = anchorElement.getAttribute('href')
            if (!eventUrl) {
              console.warn('MISSING: eventUrl - Campbelltown.ts')
              return null
            }
            //PARSE EVENTURL - END

            //PARSE TITLE - START
            const title = anchorElement.getAttribute('title')
            if (!title) {
              console.warn('MISSING: title - Campbelltown.ts')
              return null
            }
            //PARSE TITLE - END

            //PARSE DESCRIPTION - START
            const description =
              anchorElement.querySelector(
                'div.event-listing-info-container p.search-listing-description'
              )?.textContent || null
            if (!description) {
              console.warn('MISSING: description - Campbelltown.ts')
              return null
            }
            //PARSE DESCRIPTION - END

            // PARSE DATE - START
            const dayString =
              anchorElement.querySelector(
                'div.event-listing-info-container div.event-related-date.event-listing-date span.event-day'
              )?.textContent || null
            if (!dayString) {
              console.warn('MISSING: dayString - Campbelltown.ts')
              return null
            }

            const day = Number.parseInt(dayString)
            if (!day) {
              console.warn('MISSING: day - Campbelltown.ts')
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
              console.warn('MISSING: monthIndex - Campbelltown.ts')
              return null
            }

            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const currentMonthIndex = currentDate.getMonth()

            const monthIsNextYear = currentMonthIndex > monthIndex
            const year = monthIsNextYear ? currentYear + 1 : currentYear

            const startDate = new Date(year, monthIndex, day, 0, 0, 0)
            // PARSE DATE - END

            //PARSE IMAGE - START
            const imageUrl = anchorElement
              .querySelector('div.event-listing-image img.listing-image')
              ?.getAttribute('src')

            if (!imageUrl) {
              console.warn('MISSING: imageURL - Campbelltown.ts')
              return null
            }
            //PARSE IMAGE - END

            //PARSE CATEGORY - START
            const category = anchorElement.querySelector(
              'div.category-container.event-category-container span.category-listing'
            )?.textContent

            if (!category) {
              console.warn('MISSING: category - Campbelltown.ts')
              return null
            }
            //PARSE CATEGORY - END

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
    retrievingElements.succeed(
      chalk.green(`Campbelltown - Successfully scraped`)
    )
  } catch (error) {
    retrievingElements.fail(chalk.red(`Campbelltown - ${error}`))
  }
  return events
}
