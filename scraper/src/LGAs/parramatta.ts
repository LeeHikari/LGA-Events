import { LGAEvent } from '../types'
import playwright from 'playwright'

export async function ScrapeParramattaElements(
  browser: playwright.Browser
): Promise<void> {
  try {
    const page = await browser.newPage()

    // Only used for dev logging purposes
    // page.$$eval executes code on a headless browser,
    // so console.logs inside this function will not appear on the node console.
    page.on('console', (msg) => {
      const args = msg.args()
      for (let i = 0; i < args.length; ++i) {
        console.log(`${i}: ${args[i]}`)
      }
    })

    await page.goto('https://atparramatta.com/whats-on')
    const events: LGAEvent[] = await page.$$eval(
      'a.col-wrap',
      (elements: HTMLElement[]) => {
        function getId(dateString: string, title: string): string {
          return `${dateString.slice(
            0,
            dateString.indexOf('-')
          )}-${title.replace(' ', '-')}`
        }

        // replace title with eventUrl when you have it working
        function getDateParts(
          dateString: string,
          title: string
        ): {
          startDate: Date
          endDate: Date | null
        } {
          const dateStringParts = dateString.split(' - ')

          if (dateStringParts.length === 0 || dateStringParts.length > 2) {
            throw new Error(
              `Date format has changed on https://atparramatta.com/whats-on Received ${JSON.stringify(
                { dateStringParts, title }
              )}`
            )
          }

          const startDate = new Date(dateStringParts[0])
          const endDate = dateStringParts[1]
            ? new Date(dateStringParts[1])
            : null

          return { startDate, endDate }
        }

        return elements
          .map((element): LGAEvent | null => {
            const dateString =
              element.querySelector(
                'div.content-block div.content-details div.event-date'
              )?.textContent || null

            if (!dateString) {
              return null
            }

            const title =
              element.querySelector('div.content-block h4.title')
                ?.textContent || null

            if (!title) {
              return null
            }

            const { startDate, endDate } = getDateParts(dateString, title)

            return {
              title,
              description:
                element.querySelector(
                  'div.content-block div.content-details div.description'
                )?.textContent || null,
              startDate,
              endDate,
              id: getId(dateString, title),
              eventImageUrl: element.querySelector('div')?.innerText || '',
              eventUrl: element.querySelector('div')?.innerText || '',
            }
          })
          .filter((event): event is LGAEvent => event !== null)
      }
    )
    console.log(events)
  } catch (error) {
    console.error('\x1b[41m%s\x1b[0m', `Parramatta - ${error}`)
  }
}
