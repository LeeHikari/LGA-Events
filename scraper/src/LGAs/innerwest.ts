import { LGAEvent } from '../common/types'
import axios from 'axios'

export async function scrapeInnerWest(): Promise<LGAEvent[]> {
  let events: LGAEvent[] = []

  try {
    const response = await axios.get<InnerWestLGAEvent[]>(
      'https://www.innerwest.nsw.gov.au/iwc/api/v1/events?page=1&size=100',
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    events = response.data.map(toLGAEvent)
  } catch (error) {
    console.error(error)
  }

  return events
}

type InnerWestLGAEvent = {
  EventCategoryName: string
  EventTypeName: string
  address: string
  categories: string // should be converted into an array
  country: string
  enddate: string
  id: number
  image: string
  location: string
  longdescription: string
  description: string
  startdate: string
  state: string
  suburb: string
  title: string
}

function toLGAEvent(event: InnerWestLGAEvent): LGAEvent {
  const {
    title,
    description,
    id: numberId,
    image,
    startdate,
    enddate,
    EventCategoryName: category,
  } = event

  const startDate = new Date(startdate)

  return {
    category,
    description,
    endDate: new Date(enddate),
    id: `${startDate.toJSON()}${title}`,
    imageUrl: encodeURIComponent(image),
    lga: 'innerwest',
    startDate,
    title,
    url: `https://www.innerwest.nsw.gov.au/explore/whats-on#/details/${numberId.toFixed()}`,
  }
}
