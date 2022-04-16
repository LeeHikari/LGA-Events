import { EventList } from 'components/EventList'
import { normalizedStyles, globalStyles } from 'common/styles'
import styled, { createGlobalStyle } from 'styled-components'
import { theme } from 'common/theme'

const GlobalStyle = createGlobalStyle`
${normalizedStyles}
${globalStyles}
`

export function App(): JSX.Element {
  return (
    <>
      <GlobalStyle />
      <Layout>
        <Header>
          <Title>LGA Events</Title>
        </Header>
        <Main>
          <EventList />
        </Main>
      </Layout>
    </>
  )
}

const Layout = styled.div`
  min-width: 100vw;
  min-height: 100vh;
`

const Header = styled.div`
  grid-area: header;
  background-color: ${theme.color.primary.background};
  padding: 16px;
  text-align: center;
  font-weight: 800;
  font-style: italic;
  letter-spacing: 2px;
`

const Title = styled.h1`
  color: ${theme.color.primary.foreground};
  font-size: ${theme.fontSize.extraLarge};
  margin: 0px;
`

const Main = styled.div`
  background-color: ${theme.color.secondary.background};
  padding: 16px;
`
