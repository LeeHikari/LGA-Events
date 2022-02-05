import { ColorList } from 'components/ColorList'
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
          <Title>Example app</Title>
        </Header>
        <Main>
          <ColorList />
        </Main>
      </Layout>
    </>
  )
}

const Layout = styled.div`
  display: grid;
  grid-template-areas:
    'header'
    'main';
  grid-template-rows: 100px 1fr;
  min-width: 100vw;
  min-height: 100vh;
`

const Header = styled.div`
  grid-area: header;
  background-color: ${theme.color.primary.background};
  padding: 16px;
`

const Title = styled.h1`
  color: ${theme.color.primary.foreground};
`

const Main = styled.div`
  grid-area: main;
  background-color: ${theme.color.secondary.background};
  padding: 16px;
`
