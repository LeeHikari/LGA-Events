import { LGAEvent } from './types'
import { writeFile } from 'fs/promises'
import fs from 'fs'

export async function ExportToJson(events: LGAEvent[]): Promise<void> {
  try {
    if (!fs.existsSync('out')) {
      fs.mkdirSync('out')
    }

    await writeFile('out/LGAEvents.json', JSON.stringify(events))
  } catch (error) {
    console.error(error)
  }
}
