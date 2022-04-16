import { LGAEvent } from '../common/types'
import { Page } from 'playwright'
import ora from 'ora'
import chalk from 'chalk'

export async function scrapeParramatta(page: Page): Promise<LGAEvent[]> {
  const baseUrl = 'https://atparramatta.com'
  const retrievingElements = ora(`Parramatta - Scraping`)
  let events: LGAEvent[] = []
  try {
    // Only used for dev logging purposes
    // page.$$eval executes code on a headless browser,
    // so console.logs inside this function will not appear on the node console.
    page.on('console', (msg) => {
      const args = msg.args()
      for (let i = 0; i < args.length; ++i) {
        console.log(`${i}: ${args[i]}`)
      }
    })

    await page.goto(`${baseUrl}/whats-on`)
    await page.click('input#edit-action')

    await page.click('text=Search Events')

    events = await page
      .locator('div.col')
      .evaluateAll((eventElements: HTMLElement[], pageUrl) => {
        return eventElements
          .map((eventElement): LGAEvent | null => {
            const anchorElement =
              eventElement.querySelector<HTMLElement>('a.col-wrap')
            if (!anchorElement) {
              return null
            }

            let eventUrl = anchorElement.getAttribute('href')
            if (!eventUrl) {
              return null
            }
            eventUrl = `${pageUrl}${eventUrl}`

            const imageElement =
              anchorElement.querySelector<HTMLElement>('div.image-block')
            if (!imageElement) {
              return null
            }
            const backgroundProperty = imageElement.style.background
            const from = backgroundProperty.indexOf('"') + 1
            const to = backgroundProperty.lastIndexOf('"')
            const imageUrl = `${pageUrl}${backgroundProperty.slice(from, to)}`

            const dateString =
              anchorElement.querySelector<HTMLElement>(
                'div.content-block div.content-details div.event-date'
              )?.innerText || null
            if (!dateString) {
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

            const title =
              anchorElement.querySelector<HTMLElement>('div.content-block h4.title')
                ?.innerText || null
            if (!title) {
              return null
            }

            const categoryElement = anchorElement.querySelector<HTMLElement>(
              'div.content-block div.content-taxonomy'
            )
            if (!categoryElement?.innerText) {
              return null
            }
            const category = categoryElement.innerText.replaceAll(
              /\s{2,}|\n/g,
              ''
            )

            const description =
              anchorElement.querySelector<HTMLElement>(
                'div.content-block div.content-details div.description'
              )?.innerText || null

            const eventUrlParts = eventUrl.split('/')
            const id = encodeURIComponent(
              //encodeURIComponent converts special characters to be URI friendly
              `${startDate.toJSON().split('T')[0]}-${
                //ToJSON formats the date to global standard eg.2022-05-26
                eventUrlParts[eventUrlParts.length - 1]
              }`
            )

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
      chalk.blue(`Parramatta - Successfully scraped`)
    )
  } catch (error) {
    retrievingElements.fail(chalk.red(`Parramatta - ${error}`))
  }
  return events
}
