import { LGAEvent } from './types'
import { writeFile } from 'fs/promises'

export async function ExportToJson(events: LGAEvent[]): Promise<void> {
  const jsonLGAEventString = JSON.stringify(events)
  await writeFile('./out/LGAEvents.json', jsonLGAEventString)
}
