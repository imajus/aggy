export const theme = {
  colors: {
    primary: {
      main: '#2B6CB0', // Ocean blue
      light: '#4299E1',
      dark: '#2C5282',
    },
    secondary: {
      main: '#38A169', // Ocean green
      light: '#48BB78',
      dark: '#2F855A',
    },
    background: {
      main: '#F7FAFC', // Light grey background
      paper: '#FFFFFF',
      sidebar: '#EDF2F7',
    },
    text: {
      primary: '#2D3748', // Dark grey for main text
      secondary: '#4A5568', // Medium grey for secondary text
      light: '#676FFF', // Light blue for subtle text
    },
    border: '#E2E8F0',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
} as const;

export type Theme = typeof theme; 