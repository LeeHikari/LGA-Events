import { LGAEvent } from './types'
import { appendFile } from 'fs/promises'

export async function ExportToJson(events: LGAEvent[]): Promise<void> {
  const jsonLGAEventString = JSON.stringify(events)
  await appendFile(`${__filename}/LGAEvents.json`, jsonLGAEventString)
}
