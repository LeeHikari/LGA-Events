import { LGAEvent } from 'common/types'
import { formatDate } from 'common/utils'
import React from 'react'
import styled from 'styled-components'

type EventProps = {
  event: LGAEvent
}

export function Event({ event }: EventProps): JSX.Element {
  return (
    <Container
      href={event.url}
      style={{ textDecorationLine: 'none' }}
      target="_blank"
      rel="noreferrer"
    >
      <Image src={event.imageUrl} alt="Placeholder" />
      <Text>
        <h1>{event.title}</h1>
        {event.description && <p>{event.description}</p>}
        <p>
          {formatDate(event.startDate)}
          {event.endDate && ` - ${formatDate(event.endDate)}`}
        </p>
        <p>
          {event.category &&<p>{event.category}</p>}
        </p>
      </Text>
    </Container>
  )
}

const Container = styled.a`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  transition: 0.3s ease;
  color: black;

  &:hover {
    box-shadow: -4px 4px 6px 0 rgba(0, 0, 0, 0.3);
    transform: translateX(4px);
    cursor: pointer;
  }
`

const Text = styled.div`
  padding: 10px;

  h1 {
    margin-top: 0;
  }
`

const Image = styled.img`
  display: inline;
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
`
