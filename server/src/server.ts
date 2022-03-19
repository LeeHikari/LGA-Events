import playwright from 'playwright'

async function start(): Promise<void> {
  const browser = await playwright.webkit.launch()
  const page = await browser.newPage()
  await page.goto('https://books.toscrape.com/')
  const books = await page.$$eval('.product_pod', (elements) => {
    const data: unknown[] = []
    elements.forEach((book) => {
      const name = book.querySelector('h3').innerText
      const price = book.querySelector('.price_color').innerText
      const stock = book.querySelector('.availability').innerText
      data.push({ name, price, stock })
    })
    return data
  })
  console.log(books)
  await browser.close()
}

start()
