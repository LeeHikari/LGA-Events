import { LGAEvent } from '../common/types'
import playwright from 'playwright'

export async function scrapeParramatta(
  browser: playwright.Browser
): Promise<void> {
  try {
    const baseUrl = 'https://atparramatta.com'
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

    await page.goto(`${baseUrl}/whats-on`)
    await page.click('input#edit-action')

    await page.click('text=Search Events')

    //TODO refactor to use https://playwright.dev/docs/api/class-locator#locator-evaluate-all instead
    const events: LGAEvent[] = await page.$$eval(
      'div.col',
      (eventElements: HTMLElement[], baseUrl) => {
        return eventElements
          .map((eventElement): LGAEvent | null => {
            const anchorElement =
              eventElement.querySelector<HTMLElement>('a.col-wrap')
            if (!anchorElement) {
              return null
            }

            let url = anchorElement.getAttribute('href')
            if (!url) {
              return null
            }
            url = `${baseUrl}${url}`

            const imageElement =
              anchorElement.querySelector<HTMLElement>('div.image-block')
            if (!imageElement) {
              return null
            }
            const backgroundProperty = imageElement.style.background
            const from = backgroundProperty.indexOf('"') + 1
            const to = backgroundProperty.lastIndexOf('"')
            const imageUrl = `${baseUrl}${backgroundProperty.slice(from, to)}`

            const dateString =
              anchorElement.querySelector(
                'div.content-block div.content-details div.event-date'
              )?.textContent || null
            if (!dateString) {
              return null
            }

            const dateStringParts = dateString.split(' - ')
            if (dateStringParts.length === 0 || dateStringParts.length > 2) {
              throw new Error(
                `Date format has changed on ${baseUrl} Received ${JSON.stringify(
                  { dateStringParts, url }
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
              anchorElement.querySelector('div.content-block h4.title')
                ?.textContent || null
            if (!title) {
              return null
            }

            const description =
              anchorElement.querySelector(
                'div.content-block div.content-details div.description'
              )?.textContent || null
              
            const eventUrlParts = url.split('/')
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
              id,
              imageUrl,
              url,
            }
          })
          .filter((event): event is LGAEvent => event !== null)
      },
      baseUrl
    )
    console.log(events)
  } catch (error) {
    console.error('\x1b[41m%s\x1b[0m', `Parramatta - ${error}`)
  }
}
