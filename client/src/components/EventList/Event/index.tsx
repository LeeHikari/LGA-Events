import { LGAEvent } from 'common/types'
import React from 'react'
import styled from 'styled-components'

type EventProps = {
  event: LGAEvent
}

export function Event({ event }: EventProps): JSX.Element {
  return (
    <Container>
      <h1>{event.title ?? ''}</h1>
      <p>{event.description ?? ''}</p>
      <p>
        {event.startDate ?? ''}{event.endDate ?? ''}
      </p>
      <Image src={event.eventImageUrl ?? ''} alt="Placeholder" />
      <a href={event.eventUrl ?? ''}>{event.title ?? ''}</a>
    </Container>
  )
}

const Container = styled.div`

`
const Image = styled.img`

`