export const theme = {
  color: {
    primary: { background: '#2B3D54', foreground: '#d5e8ff' },
    secondary: { background: '#2C5B61', foreground: '#c5f0f5' },
    tertiary: { background: '#247065', foreground: '#caf8f1' },
    success: { background: '#f5ffe9', foreground: '#46bc16' },
    info: { background: '#e1f6ff', foreground: '#1978fe' },
    warning: { background: '#fffbe0', foreground: '#f79d13' },
    danger: { background: '#ffeeec', foreground: '#fc333e' },
  } as ColorStructure,
  borderRadius: {
    small: '5px',
    medium: '10px',
  },
  breakpointUpValue: {
    mobileLandscape: 576,
    tablet: 768,
    desktop: 992,
    desktopLarge: 1200,
  },
  breakpointUp: {
    mobileLandscape: '(min-width: 576px)',
    tablet: '(min-width: 768px)',
    desktop: '(min-width: 992px)',
    desktopLarge: '(min-width: 1200px)',
  },
  breakpointDown: {
    mobilePortrait: '(max-width: 575.98px)',
    mobileLandscape: '(max-width: 767.98px)',
    tablet: '(max-width: 991.98px)',
    desktop: '(max-width: 1199.98px)',
  },
  transitionDuration: {
    instant: '100ms',
    short: '200ms',
    medium: '300ms',
    long: '500ms',
  },
  fontSize: {
    small: '12px',
    medium: '16px',
    large: '20px',
    extraLarge: '36px',
  },
  shadow: {
    medium: '0 2px 4px 0 hsla(0, 0%, 0%, 0.2)',
    large: '0 2px 2px 2px hsla(0, 0%, 0%, 0.2)',
    inner: {
      medium: '0 2px 4px 2px hsla(0, 0%, 0%, 0.2) inset',
    },
  },
} as const

type ColorStructure = Record<string, { background: string; foreground: string }>
