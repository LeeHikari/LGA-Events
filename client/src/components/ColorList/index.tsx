import { theme } from 'common/theme'
import { useEffect, useState } from 'react'
import { getColors } from 'services/api'
import styled, { css } from 'styled-components'

export function ColorList(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    loadColors()
  }, [])

  async function loadColors(): Promise<void> {
    try {
      const response = await getColors()
      setColors(response.data)
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
        colors.map((color) => (
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <Name>{color}</Name>
            <Color $color={color} />
          </div>
        ))
      )}
    </div>
  )
}

type ColorProps = {
  $color: string
}
const Color = styled.div<ColorProps>`
  border-radius: 10px;
  opacity: 0.5;
  padding: 16px;
  height: 20px;

  ${({ $color }) =>
    css`
      background-color: ${$color};
    `};
`

const Name = styled.div`
  font-size: ${theme.fontSize.large};
`
