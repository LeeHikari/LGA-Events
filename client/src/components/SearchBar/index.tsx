import React from 'react'
import { LGAEvent } from '../../common/types'

type SearchbarProps = {
  keyword: string
  setKeyword: React.Dispatch<React.SetStateAction<string>>
}

export function Searchbar(props: SearchbarProps): JSX.Element {
  return (
    <input
      type="text"
      value={props.keyword}
      onChange={(x) => props.setKeyword(x.target.value)}
    />
  )
}

export function filterEventsByKeyword(
  events: LGAEvent[],
  keyword: string
): LGAEvent[] {
  const filteredEvents: LGAEvent[] = []
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    const lowerCaseKeyword = keyword.toLowerCase()

    if (
      event.title.toLowerCase().includes(lowerCaseKeyword) ||
      event.description?.toLowerCase().includes(lowerCaseKeyword)
    ) {
      filteredEvents.push(event)
    }
  }
  return filteredEvents
}
