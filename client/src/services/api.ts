import axios, { AxiosPromise } from 'axios'

export function getColors(): AxiosPromise<string[]> {
  return axios.get('http://localhost:5000/colors')
}
