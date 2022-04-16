import { LGAEvent } from '../common/types'
import { Page } from 'playwright'
import ora from 'ora'
import chalk from 'chalk'

export async function scrapeInnerWest(page: Page): Promise<LGAEvent[]> {
  const baseUrl =
    'https://www.innerwest.nsw.gov.au/explore/whats-on#/results?categories=All&types=All&page=1'
  const retrievingElements = ora(`Innerwest - Scraping`)

  let events: LGAEvent[] = []
  try {
    page.on('console', (msg) => {
      const args = msg.args()
      for (let i = 0; i < args.length; ++i) {
        console.log(`${i}: ${args[i]}`)
      }
    })

    await page.goto(baseUrl)
    await page.click('a#btnListView')

    // for when we want to load all the events
    // while ((await page.locator('input#btnLoadMore').count()) > 0) {
    //   await page.click('input#btnLoadMore')
    // }

    events = await page
      .locator('div.sub-whats-on-event')
      .evaluateAll((eventElements: HTMLElement[]) => {
        return eventElements
          .map((eventElement): LGAEvent | null => {
            const anchorElement =
              eventElement.querySelector<HTMLElement>('h2.float-left > a')
            if (!anchorElement?.innerText) {
              console.warn('MISSING: anchorElement - Innerwest')
              return null
            }

            const title = anchorElement.innerText

            const url = anchorElement.getAttribute('href')
            if (!url) {
              console.warn('MISSING: Url - Innerwest')
              return null
            }

            const dateString =
              eventElement.querySelector<HTMLElement>('abbr')?.innerText
            if (!dateString) {
              console.warn('Missing: DateString - InnerWest')
              return null
            }

            const [day, month, year] = dateString
              .split('/')
              .map((subString) => Number.parseInt(subString))
            if (!day || !month || !year) {
              console.warn(
                `Missing: Date - InnerWest ${JSON.stringify([
                  day,
                  month,
                  year,
                ])}`
              )
              return null
            }

            const startDate = new Date(year, month - 1, day, 0, 0, 0, 0)

            const imageUrl = eventElement
              .querySelector<HTMLElement>('div.image > img')
              ?.getAttribute('src')
            if (!imageUrl) {
              console.warn('Missing: Image - Inner West')
              return null
            }

            const description = eventElement
              .querySelector<HTMLElement>('div.wo-eventddesc')
              ?.innerText?.replace('...more', '')
            if (!description) {
              console.warn('Missing: Description - Inner West')
              return null
            }

            const id = startDate.toJSON() + title

            return {
              title,
              description,
              startDate,
              endDate: null,
              category: null,
              id,
              imageUrl,
              url,
              lga: 'innerwest'
            }
          })
          .filter((event): event is LGAEvent => event !== null)
      })

    retrievingElements.succeed(chalk.blue(`Innerwest - Successfully scraped`))
  } catch (error) {
    retrievingElements.fail(chalk.red(`Innerwest - ${error}`))
    throw new Error(`Innerwest - ${error}`)
  }

  return events
}
