import { theme } from 'common/theme'
import { Event } from './Event'
import { LGAEvent } from 'common/types'
import { useEffect, useState } from 'react'
import { getEvents } from 'services/api'
import styled from 'styled-components'

export function EventList(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<LGAEvent[]>([])

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents(): Promise<void> {
    try {
      const response = await getEvents()
      setEvents(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
