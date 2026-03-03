import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    bg: '#0A0A0F',
    bgCard: '#111118',
    bgElevated: '#16161F',
    border: '#1E1E2E',
    borderLight: '#2A2A3E',
    accent: '#6C63FF',
    accentHover: '#8B85FF',
    accentDim: 'rgba(108, 99, 255, 0.12)',
    accentDimHover: 'rgba(108, 99, 255, 0.2)',
    text: '#F0F0FF',
    textMuted: '#8888AA',
    textDim: '#55556A',
    success: '#34D399',
    successDim: 'rgba(52, 211, 153, 0.1)',
    warning: '#FBBF24',
    danger: '#F87171',
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
    card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
    glow: '0 0 40px rgba(108, 99, 255, 0.15)',
    glowStrong: '0 0 60px rgba(108, 99, 255, 0.3)',
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

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  ::selection {
    background: rgba(108, 99, 255, 0.3);
    color: #fff;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;
