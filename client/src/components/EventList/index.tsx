import { theme } from 'common/theme'
import { Event } from './Event'
import { LGAEvent } from 'common/types'
import { useEffect, useRef, useState } from 'react'
import { getEvents } from 'services/api'
import { filterEventsByKeyword, Searchbar } from '../SearchBar/index'
import styled from 'styled-components'

export function EventList(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<LGAEvent[]>([])
  const [keyword, setKeyword] = useState('')
  const initialEventsRef = useRef<LGAEvent[]>([])

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const response = await getEvents()
        initialEventsRef.current = response.data
        setEvents(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    if (!keyword) {
      setEvents(initialEventsRef.current)
      return
    }

    if (keyword.length >= 3) {
      setEvents((state) => filterEventsByKeyword(state, keyword))
    }
  }, [keyword])

  return (
    <>
      <Searchbar keyword={keyword} setKeyword={setKeyword} />
      <Heading>Any events on?</Heading>
      {loading ? (
        <h3>loading...</h3>
      ) : (
        <Grid>
          {events.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </Grid>
      )}
    </>
  )
}

const Heading = styled.h1`
  color: ${theme.color.secondary.foreground};
`

const Grid = styled.div`
  display: grid;
  gap: 16px;

  @media ${theme.breakpointUp.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${theme.breakpointUp.desktop} {
    grid-template-columns: repeat(3, 1fr);
    padding-left: 100px;
    padding-right: 100px;
  }

  @media ${theme.breakpointUp.desktopLarge} {
    grid-template-columns: repeat(4, 1fr);
    padding-left: 100px;
    padding-right: 100px;
  }
`
