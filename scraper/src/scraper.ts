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
  launchingBrowser.succeed(chalk.yellow.inverse('Browser launched successfully'))

  const events: LGAEvent[] = await scrapeParramatta(await context.newPage())

  const mode = process.argv[2]
  if (mode === '--dev' ){
    await ExportToJson(events)
  } else if(mode === '--log'){
    console.log(events)
  }
  
  await browser.close()
  launchingBrowser.succeed(chalk.yellow.inverse('Scraping finished'))
}

start()
