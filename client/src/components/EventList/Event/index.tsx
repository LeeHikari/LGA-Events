import { LGAEvent } from 'common/types'
import { formatDate } from 'common/utils'
import React from 'react'
import styled from 'styled-components'

type EventProps = {
  event: LGAEvent
}

export function Event({ event }: EventProps): JSX.Element {
  return (
    <Container>
      <a href={event.eventUrl} style={{ textDecorationLine: 'none' }}>
        <Image src={event.eventImageUrl} alt="Placeholder" />
        <Text>
          <h1>{event.title}</h1>
          {event.description && <p>{event.description}</p>}
          <p>
            {formatDate(event.startDate)}
            {event.endDate && ` - ${formatDate(event.endDate)}`}
          </p>
        </Text>
      </a>
    </Container>
  )
}

const Container = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  margin: 0px 25px 25px 0px;
  width: 350px;
`
const Text = styled.p`
  color: black;
  padding: 0px 7px 5px 7px;
`

const Image = styled.img`
  display: inline;
  width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
`
