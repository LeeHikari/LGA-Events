import { theme } from 'common/theme'
import { LGAEvent } from 'common/types'
import { formatDate } from 'common/utils'
import styled from 'styled-components'
import TruncateMarkup from 'react-truncate-markup'

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
        <p style={{ marginTop: '0px' }}>
          {formatDate(event.startDate)}
          {event.endDate && ` - ${formatDate(event.endDate)}`}
        </p>
        {event.title && <h1>{event.title}</h1>}
        {event.description && (
          <TruncateMarkup lines={3}>
            <p>{event.description}</p>
          </TruncateMarkup>
        )}
        {event.category && <p>{event.category}</p>}
      </Text>
    </Container>
  )
}

const Container = styled.a`
  background-color: #fff;
  box-shadow: ${theme.shadow.medium};
  border-radius: 5px;
  transition: 0.3s ease;
  color: black;

  &:hover {
    box-shadow: ${theme.shadow.mediumLeft};
    transform: translateX(4px);
    cursor: pointer;
  }
`

const Text = styled.div`
  padding: 10px;

  h1 {
    margin-top: 0;
    font-weight: ${theme.fontWeight.bold};
  }
`

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
`
