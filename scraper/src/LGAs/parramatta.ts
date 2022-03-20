import { LGAEvent } from '../types'
import playwright from 'playwright'

export async function ScrapeParramattaElements(browser: playwright.Browser){
    const page = await browser.newPage()
    await page.goto('https://atparramatta.com/whats-on')
    await browser.close()
    const events: LGAEvent[] = await page.$$eval('.product_pod', (elements: any[]) => {
        return elements.map((event) => {
            const title = event.querySelector('').innerText
            const description = event.querySelector('').innerText
            const startDate = event.querySelector('').innerText
            const endDate = event.querySelector('').innerText
            const id = event.querySelector('').innerText
            const eventImageUrl = event.querySelector('').innerText
            const eventUrl = event.querySelector('').innerText
            return { 
                title,
                description,
                startDate,
                endDate,
                id,
                eventImageUrl,
                eventUrl
            }
        })
    })

    console.log(events)
}