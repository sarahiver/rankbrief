import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

// ── Animations ────────────────────────────────────────────────────────────────
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ── Nav Shell ─────────────────────────────────────────────────────────────────
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
    background: rgba(247, 247, 251, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  `}

  @media (max-width: 700px) { padding: 0 1rem; }
  @media (max-width: 380px) { padding: 0 0.75rem; }
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
  z-index: 200;
  flex-shrink: 0;
  @media (max-width: 380px) { font-size: 1.1rem; }
`;

const LogoDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.accent};
`;

// ── Desktop Nav Links ─────────────────────────────────────────────────────────
const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  @media (max-width: 700px) { display: none; }
`;

const NavBtn = styled.button`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const NavLinkRouter = styled(Link)`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

// ── Actions ───────────────────────────────────────────────────────────────────
const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 200;
  flex-shrink: 0;
  @media (max-width: 480px) { gap: 0.375rem; }
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
  @media (max-width: 480px) { display: none; }
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
  @media (max-width: 480px) {
    padding: 0.4rem 0.875rem;
    font-size: 0.8125rem;
  }
`;

// ── Hamburger ─────────────────────────────────────────────────────────────────
const Hamburger = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 200;

  @media (max-width: 700px) { display: flex; }

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: ${({ theme }) => theme.colors.text};
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  ${({ $open }) => $open && css`
    span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `}
`;

// ── Mobile Drawer ─────────────────────────────────────────────────────────────
const Drawer = styled.div`
  display: none;
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: min(320px, 85vw);
    background: #ffffff;
    box-shadow: -4px 0 40px rgba(0,0,0,0.12);
    z-index: 150;
    padding: 80px 2rem 2rem;
    gap: 0;
    animation: ${slideIn} 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 700px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(2px);
    z-index: 140;
  }
`;

const DrawerLink = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: none;
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  cursor: pointer;
  letter-spacing: -0.01em;
  gap: 0.75rem;
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const DrawerLinkRouter = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.01em;
  gap: 0.75rem;
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const DrawerActions = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
`;

const DrawerBtnPrimary = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
`;

const DrawerBtnGhost = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-size: 0.9375rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DrawerLangToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  margin-top: 0.75rem;
`;

const DrawerLangBtn = styled.button`
  flex: 1;
  padding: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: all 0.2s;
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active }) => $active ? '#fff' : '#999'};
`;

// ── Labels ────────────────────────────────────────────────────────────────────
const labels = {
  en: { features: 'Features', pricing: 'Pricing', faq: 'FAQ', docs: 'Docs', signin: 'Sign in', start: 'Start free' },
  de: { features: 'Features', pricing: 'Preise', faq: 'FAQ', docs: 'Docs', signin: 'Anmelden', start: 'Kostenlos starten' },
};

// ── Scroll helper ─────────────────────────────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80; // navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Navbar({ user, lang, onLangChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const t = labels[lang || 'de'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleAnchor = useCallback((id) => {
    setMenuOpen(false);
    if (isLanding) {
      scrollToSection(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToSection(id), 300);
    }
  }, [isLanding, navigate]);

  return (
    <>
      <Nav $scrolled={scrolled || !isLanding}>
        <Logo to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><LogoDot />Rank<span>Brief</span></Logo>

        {/* Desktop links */}
        {isLanding && (
          <NavLinks>
            <NavBtn onClick={() => handleAnchor('features')}>{t.features}</NavBtn>
            <NavBtn onClick={() => handleAnchor('pricing')}>{t.pricing}</NavBtn>
            <NavBtn onClick={() => handleAnchor('faq')}>{t.faq}</NavBtn>
            <NavLinkRouter to="/docs">{t.docs}</NavLinkRouter>
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

          {/* Hamburger – mobile only */}
          <Hamburger $open={menuOpen} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </Hamburger>
        </NavActions>
      </Nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <Overlay onClick={() => setMenuOpen(false)} />
          <Drawer>
            {isLanding && (
              <>
                <DrawerLink onClick={() => handleAnchor('features')}>📊 {t.features}</DrawerLink>
                <DrawerLink onClick={() => handleAnchor('pricing')}>💰 {t.pricing}</DrawerLink>
                <DrawerLink onClick={() => handleAnchor('faq')}>❓ {t.faq}</DrawerLink>
              </>
            )}
            <DrawerLinkRouter to="/docs" onClick={() => setMenuOpen(false)}>📄 {t.docs}</DrawerLinkRouter>

            <DrawerActions>
              {user ? (
                <DrawerBtnPrimary to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard →</DrawerBtnPrimary>
              ) : (
                <>
                  <DrawerBtnPrimary to="/register" onClick={() => setMenuOpen(false)}>{t.start} →</DrawerBtnPrimary>
                  <DrawerBtnGhost to="/login" onClick={() => setMenuOpen(false)}>{t.signin}</DrawerBtnGhost>
                </>
              )}
              <DrawerLangToggle>
                <DrawerLangBtn $active={lang === 'en'} onClick={() => { onLangChange?.('en'); }}>🇬🇧 English</DrawerLangBtn>
                <DrawerLangBtn $active={lang === 'de'} onClick={() => { onLangChange?.('de'); }}>🇩🇪 Deutsch</DrawerLangBtn>
              </DrawerLangToggle>
            </DrawerActions>
          </Drawer>
        </>
      )}
    </>
  );
}
