import { theme } from 'common/theme'
import { LGA_Event } from 'common/types'
import { useEffect, useState } from 'react'
import { getEvents } from 'services/api'
import styled, { css } from 'styled-components'

export function EventList(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<LGA_Event[]>([])

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
      <h2>Woh colors?</h2>
      {loading ? (
        <h3>loading...</h3>
      ) : (
        events.map((event) => (
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <Event>{JSON.stringify(event)}</Event>
          </div>
        ))
      )}
    </div>
  )
}


const Event = styled.div`
  border-radius: 10px;
  opacity: 0.5;
  padding: 16px;
  height: 20px;
`
