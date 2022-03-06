import { LGAEvent } from 'common/types'
import React from 'react'
import styled from 'styled-components'

type EventProps = {
  event: LGAEvent
}

export function Event({ event }: EventProps): JSX.Element {
  return (
    <Container>
      <div>{event.title}</div>
    </Container>
  )
}

const Container = styled.div`
  border-radius: 10px;
  opacity: 0.5;
  padding: 16px;
  height: 20px;
`
