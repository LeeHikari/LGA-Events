import { LGAEvent } from '../common/types'
import { Page } from 'playwright'
import ora from 'ora'
import chalk from 'chalk'

export async function scrapeParramatta(page: Page): Promise<LGAEvent[]> {
  const baseUrl = 'https://atparramatta.com'
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

    await page.goto(`${baseUrl}/whats-on`)
    await page.click('input#edit-action')

    await page.click('text=Search Events')

    events = await page
      .locator('div.col')
      .evaluateAll((eventElements: HTMLElement[], pageUrl) => {
        return eventElements
          .map((eventElement): LGAEvent | null => {
            //PARSE AnchorElement - START
            const anchorElement =
              eventElement.querySelector<HTMLElement>('a.col-wrap')
            if (!anchorElement) {
              console.warn('MISSING: anchor - Parramatta.ts')
              return null
            }
            //PARSE AnchorElement - END

            //PARSE EventUrl - START
            let eventUrl = anchorElement.getAttribute('href')
            if (!eventUrl) {
              console.warn('MISSING: eventUrl - Parramatta.ts')
              return null
            }
            eventUrl = `${pageUrl}${eventUrl}`
            //PARSE EventUrl - END

            //PARSE ImageElement - START
            const imageElement =
              anchorElement.querySelector<HTMLElement>('div.image-block')
            if (!imageElement) {
              console.warn('MISSING: image - Parramatta.ts')
              return null
            }
            const backgroundProperty = imageElement.style.background
            const from = backgroundProperty.indexOf('"') + 1
            const to = backgroundProperty.lastIndexOf('"')
            const imageUrl = `${pageUrl}${backgroundProperty.slice(from, to)}`
            //PARSE ImageElement - END

            //PARSE DateString - START
            const dateString =
              anchorElement.querySelector(
                'div.content-block div.content-details div.event-date'
              )?.textContent || null
            if (!dateString) {
              console.warn('MISSING: date - Parramatta.ts')
              return null
            }

            const dateStringParts = dateString.split(' - ')
            if (
              dateStringParts.length === 0 ||
              dateStringParts.length > 2 ||
              !dateStringParts[0]
            ) {
              throw new Error(
                `Date format has changed on ${pageUrl} Received ${JSON.stringify(
                  { dateStringParts, eventUrl }
                )}`
              )
            }

            const startDate = new Date(dateStringParts[0])
            startDate.setHours(0, 0, 0, 0)

            const endDate = dateStringParts[1]
              ? new Date(dateStringParts[1])
              : null
            endDate?.setHours(0, 0, 0, 0)
            //PARSE DateString - END

            //PARSE Title - START
            const title =
              anchorElement.querySelector('div.content-block h4.title')
                ?.textContent || null
            if (!title) {
              console.warn('MISSING: title')
              return null
            }
            //PARSE Title - END

            //PARSE CategoryElement - START
            const categoryElement = anchorElement.querySelector(
              'div.content-block div.content-taxonomy'
            )
            if (!categoryElement?.textContent) {
              console.warn('MISSING: category')
              return null
            }
            const category = categoryElement.textContent.replaceAll(
              /\s{2,}|\n/g,
              ''
            )
            //PARSE CategoryElement - END

            //PARSE Description - START
            const description =
              anchorElement.querySelector(
                'div.content-block div.content-details div.description'
              )?.textContent || null
            if (!description) {
              console.warn('MISSING: description - Parramatta.ts')
              return null
            }
            //PARSE Description - END

            const id = startDate.toJSON() + title

            return {
              title,
              description,
              startDate,
              endDate,
              category,
              id,
              imageUrl,
              url: eventUrl,
            }
          })
          .filter((event): event is LGAEvent => event !== null)
      }, baseUrl)
    retrievingElements.succeed(
      chalk.blue(`${baseUrl}/whats-on - Successfully scraped`)
    )
  } catch (error) {
    retrievingElements.fail(chalk.red(`${baseUrl}/whats-on - ${error}`))
  }
  return events
}
