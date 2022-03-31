import { LGAEvent } from './types'
import { writeFile } from 'fs/promises'
import fs from 'fs'
import ora from 'ora'
import chalk from 'chalk'

export async function ExportToJson(events: LGAEvent[]): Promise<void> {
  const exportingJson = ora('Exporting to JSON').start()

  try {
    if (!fs.existsSync('out')) {
      fs.mkdirSync('out')
      exportingJson.succeed(chalk.blue(`Out file created`))
    }

    await writeFile('out/LGAEvents.json', JSON.stringify(events))

    exportingJson.succeed(chalk.blue(`Export to JSON successful`))
  } catch (error) {
    exportingJson.fail(chalk.red(`Export to JSON failed - ${error}`))
  }
}