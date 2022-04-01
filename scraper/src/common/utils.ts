import { LGAEvent } from './types'
import { writeFile } from 'fs/promises'
import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import ora from 'ora'
import chalk from 'chalk'

export async function exportToJson(events: LGAEvent[]): Promise<void> {
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

  uploadToCloud()
}

export async function uploadToCloud(): Promise<void> {
  const uploadingToCloud = ora('Uploading to cloud').start()
  
  try {
    const storage = new Storage()
    await storage.bucket('lgaevents').upload('./out/LGAEvents.json')

    uploadingToCloud.succeed(chalk.blue(`Uploaded to cloud successfully`))
    
  } catch (error) {
    uploadingToCloud.fail(chalk.red(`Uploaded to cloud failed - ${error}`))
  }
}