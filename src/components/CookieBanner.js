import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { getConsent, setConsent } from '../analytics';

const slideUp = keyframes`
  from { transform: translateY(calc(100% + 24px)); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;
const slideDown = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(calc(100% + 24px)); opacity: 0; }
`;

const Banner = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: calc(100% - 48px);
  max-width: 680px;
  background: #1a1a2e;
  border: 1px solid rgba(108,99,255,0.35);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  animation: ${({ $hiding }) => $hiding
    ? css`${slideDown} 0.35s ease forwards`
    : css`${slideUp} 0.4s cubic-bezier(0.16,1,0.3,1) forwards`};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    bottom: 12px;
    left: 12px;
    right: 12px;
    width: auto;
    transform: none;
  }
`;

const Icon = styled.div`
  font-size: 22px;
  width: 44px;
  height: 44px;
  background: rgba(108,99,255,0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextBlock = styled.div`flex: 1; min-width: 0;`;

const Title = styled.p`
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
`;

const Body = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #8888aa;
  a { color: #6C63FF; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  @media (max-width: 600px) { width: 100%; }
`;

const BtnAccept = styled.button`
  background: #6C63FF;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover { background: #5a52e0; }
  @media (max-width: 600px) { flex: 1; }
`;

const BtnDecline = styled.button`
  background: transparent;
  color: #8888aa;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  &:hover { color: #fff; border-color: rgba(255,255,255,0.25); }
  @media (max-width: 600px) { flex: 1; }
`;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding]   = useState(false);

  useEffect(() => {
    if (getConsent() === null) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (decision) => {
    setHiding(true);
    setTimeout(() => {
      setConsent(decision);
      setVisible(false);
      setHiding(false);
    }, 350);
  };

  if (!visible) return null;

  return (
    <Banner $hiding={hiding}>
      <Icon>🍪</Icon>
      <TextBlock>
        <Title>Cookies &amp; Datenschutz · Privacy</Title>
        <Body>
          Wir nutzen Google Analytics zur Verbesserung unserer Website. · We use Google Analytics to improve our site.{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Datenschutz · Privacy</a>
        </Body>
      </TextBlock>
      <Buttons>
        <BtnDecline onClick={() => dismiss('denied')}>Ablehnen · Decline</BtnDecline>
        <BtnAccept onClick={() => dismiss('granted')}>Akzeptieren · Accept</BtnAccept>
      </Buttons>
    </Banner>
  );
}
