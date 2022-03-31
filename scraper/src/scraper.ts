import { webkit } from 'playwright'
import { LGAEvent } from './common/types'
import { ExportToJson } from './common/utils'
import { scrapeParramatta } from './LGAs/parramatta'
import ora from 'ora'
import chalk from 'chalk'

export async function start(): Promise<void> {
  const launchingBrowser = ora('Launching browser').start()
  const browser = await webkit.launch()
  const context = await browser.newContext()
  launchingBrowser.succeed(chalk.blue('Browser launched successfully'))
  
  const events: LGAEvent[] = await scrapeParramatta(await context.newPage())

  await browser.close()
  launchingBrowser.succeed(chalk.blue('Scraping finished'))

  await ExportToJson(events)
}

start()
