import { theme } from 'common/theme'
import { Event } from './Event'
import { LGAEvent } from 'common/types'
import { useEffect, useState } from 'react'
import { getEvents } from 'services/api'

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
    <div style={{ color: theme.color.secondary.foreground }}>
      <h2>Any events on?</h2>
      {loading ? (
        <h3>loading...</h3>
      ) : (
        events.map((event) => <Event key={event.id} event={event} />)
      )}
    </div>
  )
}
