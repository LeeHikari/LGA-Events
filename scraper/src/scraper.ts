import playwright from 'playwright'

type Book = { name: string; price: string; stock: string }

async function start(): Promise<void> {
  const browser = await playwright.webkit.launch()
  const page = await browser.newPage()
  await page.goto('https://books.toscrape.com/')
  const books: Book[] = await page.$$eval('.product_pod', (elements) => {
    return elements.map((book) => {
      const name = book.querySelector('h3').innerText
      const price = book.querySelector('.price_color').innerText
      const stock = book.querySelector('.availability').innerText
      return { name, price, stock }
    })
  })
  console.log(books)
  await browser.close()
}

start()
