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
    }

    await writeFile('out/LGAEvents.json', JSON.stringify(events))

    exportingJson.succeed(chalk.blue(`Exporting to JSON successful`))
  } catch (error) {
    exportingJson.fail(chalk.red(`Exporting to JSON failed - ${error}`))
  }
}
