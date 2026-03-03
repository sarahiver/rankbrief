import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrap = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 3rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
`;

const FooterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.textMuted};

  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const FooterLink = styled(Link)`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Copy = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
`;

export default function Footer() {
  return (
    <FooterWrap>
      <FooterInner>
        <Logo to="/">Rank<span>Brief</span></Logo>
        <FooterLinks>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/de/privacy">Datenschutz</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/de/terms">Nutzungsbedingungen</FooterLink>
        </FooterLinks>
        <Copy>© {new Date().getFullYear()} S&I. – Iver Gentz, Hamburg</Copy>
      </FooterInner>
    </FooterWrap>
  );
}
