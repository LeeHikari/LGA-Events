import axios, { AxiosPromise } from 'axios'
import { LGA_Event } from 'common/types'

export function getEvents(): AxiosPromise<LGA_Event[]> {
  return axios.get('https://storage.googleapis.com/lgaevents/LGAInfo.json')
}