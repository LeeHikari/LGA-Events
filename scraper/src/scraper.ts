import { webkit } from 'playwright'
import { LGAEvent } from './common/types'
import { exportToJson, uploadToCloud } from './common/utils'
import { scrapeParramatta } from './LGAs/parramatta'
import ora from 'ora'
import 'dotenv/config'
import chalk from 'chalk'

//Used to see if dotenv package is working?
//console.log(process.env)

export async function start(): Promise<void> {
  const launchingBrowser = ora('Launching browser').start()

  try {
    const browser = await webkit.launch()
    const context = await browser.newContext()

    launchingBrowser.succeed(
      chalk.yellow.inverse('Browser launched successfully')
    )

    const events: LGAEvent[] = await scrapeParramatta(await context.newPage())

    const mode = process.argv[2]
    if (mode === '--cloud') {
      await exportToJson(events)
      await uploadToCloud()
    } else {
      console.log(events)
      await exportToJson(events)
    }

    await browser.close()
    launchingBrowser.succeed(chalk.yellow.inverse('Scraping finished'))
  } catch (error) {
    launchingBrowser.fail(chalk.red(`Error occured in Start() - ${error}`))
  }
}

start()
