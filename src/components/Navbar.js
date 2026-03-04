import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  ${({ $scrolled }) => $scrolled && css`
    background: rgba(247, 247, 251, 0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  `}
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const LogoDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.accent};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  @media (max-width: 700px) { display: none; }
`;

const NavLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LangToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  @media (max-width: 480px) { display: none; }
`;

const LangBtn = styled.button`
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: all 0.2s;
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textDim};
  &:hover { color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.text}; }
`;

const BtnGhost = styled(Link)`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const BtnPrimary = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: ${({ theme }) => theme.colors.accent};
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s;
  font-family: ${({ theme }) => theme.fonts.display};
  white-space: nowrap;
  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(108, 99, 255, 0.3);
  }
`;

const labels = {
  en: { features: 'Features', pricing: 'Pricing', faq: 'FAQ', docs: 'Docs', signin: 'Sign in', start: 'Start free' },
  de: { features: 'Features', pricing: 'Preise', faq: 'FAQ', docs: 'Docs', signin: 'Anmelden', start: 'Kostenlos' },
};

export default function Navbar({ user, lang, onLangChange }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const t = labels[lang || 'en'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Nav $scrolled={scrolled || !isLanding}>
      <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>

      {isLanding && (
        <NavLinks>
          <NavLink to="/#features">{t.features}</NavLink>
          <NavLink to="/#pricing">{t.pricing}</NavLink>
          <NavLink to="/#faq">{t.faq}</NavLink>
          <NavLink to="/docs">{t.docs}</NavLink>
        </NavLinks>
      )}

      <NavActions>
        <LangToggle>
          <LangBtn $active={lang === 'en'} onClick={() => onLangChange?.('en')}>EN</LangBtn>
          <LangBtn $active={lang === 'de'} onClick={() => onLangChange?.('de')}>DE</LangBtn>
        </LangToggle>

        {user ? (
          <BtnPrimary to="/dashboard">Dashboard</BtnPrimary>
        ) : (
          <>
            <BtnGhost to="/login">{t.signin}</BtnGhost>
            <BtnPrimary to="/register">{t.start}</BtnPrimary>
          </>
        )}
      </NavActions>
    </Nav>
  );
}
