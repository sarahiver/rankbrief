import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    bg: '#F7F7FB',
    bgCard: '#FFFFFF',
    bgElevated: '#EFEFF7',
    border: '#E3E3EF',
    borderLight: '#C8C8DE',
    accent: '#6C63FF',
    accentHover: '#5A52E0',
    accentDim: 'rgba(108, 99, 255, 0.08)',
    accentDimHover: 'rgba(108, 99, 255, 0.14)',
    text: '#0F0F1A',
    textMuted: '#52526E',
    textDim: '#9898B8',
    success: '#10B981',
    successDim: 'rgba(16, 185, 129, 0.08)',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  fonts: {
    display: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
  },
  shadow: {
    card: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    glow: '0 0 40px rgba(108, 99, 255, 0.1)',
    glowStrong: '0 0 60px rgba(108, 99, 255, 0.18)',
  }
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 16px;
    line-height: 1.6;
    min-height: 100vh;
  }

  a { color: inherit; text-decoration: none; }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea { font-family: inherit; }

  ::selection {
    background: rgba(108, 99, 255, 0.15);
    color: ${({ theme }) => theme.colors.text};
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;
