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
        <p className="date">
          {formatDate(event.startDate)}
          {event.endDate && ` - ${formatDate(event.endDate)}`}
        </p>
        {event.title && <h1>{event.title}</h1>}
        {event.description && (
          <TruncateMarkup lines={3}>
            <p className="description">{event.description}</p>
          </TruncateMarkup>
        )}
        {event.category && <p className="category">{event.category}</p>}
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
  font-family: Lato, sans-serif;

  h1 {
    margin-top: 0;
    font-family: 'EB Garamond', serif;
    font-weight: ${theme.fontWeight.semiBold};
    font-size: ${theme.fontSize.large};
  }

  .date {
    margin-top: 0px;
    font-style: italic;
    font-size: ${theme.fontSize.small};
  }

  .category {
    font-style: italic;
  }
`

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
`
