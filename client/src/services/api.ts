import axios, { AxiosPromise } from 'axios'
import { LGAEvent } from 'common/types'

export function getEvents(): AxiosPromise<LGAEvent[]> {
  return axios.get('https://storage.googleapis.com/lgaevents/LGAInfo.json')
}