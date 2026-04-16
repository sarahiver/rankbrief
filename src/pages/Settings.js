import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import t from '../lib/i18n';
import PropertySelectModal from '../components/PropertySelectModal';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

const PortalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
`;

const PortalSpinner = styled.div`
  width: 44px;
  height: 44px;
  border: 3px solid rgba(108,99,255,0.2);
  border-top-color: #6C63FF;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

const PortalLoadingText = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
`;

// ── Layout ────────────────────────────────────────────────────────────────────
const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg};
`;

const TopBar = styled.header`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background: ${({ theme }) => theme.colors.bgCard};
  position: sticky;
  top: 0;
  @media (max-width: 480px) { padding: 0 0.75rem; }
  z-index: 10;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const LogoDot = styled.div`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 480px) { gap: 0.375rem; }
`;

const TopBarLink = styled(Link)`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
  @media (max-width: 480px) {
    padding: 0.375rem 0.5rem;
    font-size: 0;
    &::before { content: '←'; font-size: 1rem; }
  }
`;

const LangToggle = styled.button`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textDim};
  background: ${({ $active, theme }) => $active ? theme.colors.accentDim : 'transparent'};
  transition: all 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.accent}; }
`;

const BtnSignOut = styled.button`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; border-color: ${({ theme }) => theme.colors.borderLight}; }
  @media (max-width: 480px) { display: none; }
`;

const Main = styled.main`
  flex: 1;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
  animation: ${fadeUp} 0.4s ease both;
  @media (max-width: 480px) { padding: 1.25rem 1rem 3rem; }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 2rem;
`;


// ── Tabs ──────────────────────────────────────────────────────────────────────
const TabBar = styled.div`
  display: flex;
  gap: 2px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  flex: 1;
  min-width: 80px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-size: 0.80rem;
  font-weight: ${({ $active }) => $active ? 700 : 500};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  background: ${({ $active, theme }) => $active ? theme.colors.bgCard : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textMuted};
  border: ${({ $active }) => $active ? '1px solid rgba(108,99,255,0.2)' : '1px solid transparent'};
  box-shadow: ${({ $active }) => $active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};
  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.bgCard : theme.colors.bgElevated};
    color: ${({ theme }) => theme.colors.text};
  }
`;

// ── Tier selector (settings) ──────────────────────────────────────────────────
const TierGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1rem;
`;

const TierRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 10px;
  border: ${({ $selected }) => $selected ? '2px solid #6C63FF' : '1px solid rgba(0,0,0,0.1)'};
  background: ${({ $selected }) => $selected ? 'rgba(108,99,255,0.06)' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: rgba(108,99,255,0.3); }
`;

const TierLabel = styled.div`
  font-weight: 700;
  font-size: 0.88rem;
  color: ${({ $selected }) => $selected ? '#6C63FF' : 'inherit'};
`;

const TierSub = styled.div`
  font-size: 0.68rem;
  color: var(--color-text-muted, #888);
  margin-top: 1px;
`;

const TierPrice = styled.div`
  text-align: right;
`;

const TierPriceMain = styled.div`
  font-weight: 800;
  font-size: 0.95rem;
  color: ${({ $selected }) => $selected ? '#6C63FF' : 'inherit'};
`;

const TierPricePer = styled.div`
  font-size: 0.65rem;
  color: #10B981;
  font-weight: 600;
`;

// ── Section ───────────────────────────────────────────────────────────────────
const Section = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const SectionHead = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const SectionSub = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  margin-top: 0.2rem;
`;

const SectionBody = styled.div`
  padding: 1.5rem;
  @media (max-width: 480px) { padding: 1rem; }
`;

// ── Form Elements ─────────────────────────────────────────────────────────────
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
  &:last-child { margin-bottom: 0; }
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.6875rem 1rem;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.bgElevated};
  }
`;

const FieldHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300;
  a { color: ${({ theme }) => theme.colors.accent}; }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// ── Buttons ───────────────────────────────────────────────────────────────────
const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.2s;
  white-space: nowrap;

  background: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.accent :
    $variant === 'danger' ? 'rgba(239,68,68,0.08)' :
    theme.colors.bgElevated};
  color: ${({ $variant, theme }) =>
    $variant === 'primary' ? '#fff' :
    $variant === 'danger' ? theme.colors.danger :
    theme.colors.text};
  border: 1px solid ${({ $variant, theme }) =>
    $variant === 'primary' ? 'transparent' :
    $variant === 'danger' ? 'rgba(239,68,68,0.2)' :
    theme.colors.border};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.colors.accentHover :
      $variant === 'danger' ? 'rgba(239,68,68,0.14)' :
      theme.colors.border};
    box-shadow: ${({ $variant }) => $variant === 'primary' ? '0 4px 16px rgba(108,99,255,0.3)' : 'none'};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// ── Plan Badge ────────────────────────────────────────────────────────────────
const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: ${({ $plan, theme }) =>
    $plan === 'free' ? theme.colors.bgElevated :
    $plan === 'basic' ? 'rgba(16,185,129,0.1)' :
    $plan === 'pro' ? theme.colors.accentDim :
    'rgba(245,158,11,0.1)'};
  color: ${({ $plan, theme }) =>
    $plan === 'free' ? theme.colors.textDim :
    $plan === 'basic' ? theme.colors.success :
    $plan === 'pro' ? theme.colors.accent :
    theme.colors.warning};
  border: 1px solid ${({ $plan, theme }) =>
    $plan === 'free' ? theme.colors.border :
    $plan === 'basic' ? 'rgba(16,185,129,0.2)' :
    $plan === 'pro' ? 'rgba(108,99,255,0.2)' :
    'rgba(245,158,11,0.2)'};
`;

const StatusDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
`;

// ── Info Row ──────────────────────────────────────────────────────────────────
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 1rem;
  flex-wrap: wrap;
  &:last-child { border-bottom: none; }
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ $mono, theme }) => $mono ? theme.fonts.mono : 'inherit'};
`;

// ── Property Card ─────────────────────────────────────────────────────────────
const PropertyCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  margin-bottom: 1rem;
  &:last-child { margin-bottom: 0; }
`;

const PropertyHead = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.bgElevated};
`;

const PropertyDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $status, theme }) =>
    $status === 'active' ? theme.colors.success : theme.colors.danger};
  flex-shrink: 0;
`;

const PropertyName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PropertyUrl = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const PropertyBody = styled.div`
  padding: 1.25rem;
`;

// ── Alerts ────────────────────────────────────────────────────────────────────
const Alert = styled.div`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  background: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.successDim :
    $type === 'error' ? 'rgba(239,68,68,0.08)' :
    theme.colors.accentDim};
  border: 1px solid ${({ $type, theme }) =>
    $type === 'success' ? 'rgba(16,185,129,0.2)' :
    $type === 'error' ? 'rgba(239,68,68,0.2)' :
    'rgba(108,99,255,0.2)'};
  color: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success :
    $type === 'error' ? theme.colors.danger :
    theme.colors.accent};
`;

const Spinner = styled.div`
  width: 20px; height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 3rem auto;
`;

const DangerZone = styled.div`
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  background: rgba(239,68,68,0.04);
`;

const DangerTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 0.375rem;
`;

const DangerText = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  margin-bottom: 1rem;
`;


// ── Branding Components ───────────────────────────────────────────────────────
const ProTag = styled.span`
  display: inline-flex; align-items: center;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
  padding: 0.15rem 0.5rem; border-radius: 99px;
  border: 1px solid rgba(108,99,255,0.2);
  text-transform: uppercase;
`;

const LogoDropZone = styled.div`
  width: 100%; height: 96px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 2px dashed ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.accentDim : theme.colors.bgElevated};
  display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.25rem;
  transition: all 0.2s; overflow: hidden;
`;

const LogoThumbWrap = styled.div`
  display: flex; align-items: center; gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgElevated};
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const LogoThumb = styled.div`
  width: 96px; height: 56px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
  img { max-width: 88px; max-height: 48px; object-fit: contain; }
`;

const LogoThumbInfo = styled.div`flex: 1; min-width: 0;`;
const LogoThumbName = styled.div`font-size: 0.8125rem; font-weight: 500; color: ${({ theme }) => theme.colors.text}; margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const LogoThumbMeta = styled.div`font-size: 0.75rem; color: ${({ theme }) => theme.colors.textDim}; font-weight: 300;`;

const ColorRow = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
`;

const ColorSwatch = styled.div`
  width: 44px; height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $c }) => $c};
  flex-shrink: 0; position: relative; overflow: hidden; transition: border-color 0.2s;
  input[type="color"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
`;

const FontGrid = styled.div`display: flex; flex-wrap: wrap; gap: 0.5rem;`;

const FontPill = styled.button`
  padding: 0.4rem 0.875rem; border-radius: 99px; font-size: 0.875rem;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.accentDim : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textMuted};
  font-family: ${({ $ff }) => $ff}; transition: all 0.2s;
  &:hover:not(:disabled) { border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.accent}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const LangGrid = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;

const LangPill = styled.button`
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; border-radius: 10px; text-align: left; width: 100%;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.accentDim : 'transparent'};
  cursor: pointer; transition: all 0.18s;
  &:hover { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const LangFlag  = styled.span`font-size: 1.5rem; line-height: 1; flex-shrink: 0;`;
const LangInfo  = styled.div`flex: 1;`;
const LangLabel = styled.div`
  font-size: 0.9rem; font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;
const LangSub   = styled.div`
  font-size: 0.78rem; color: ${({ theme }) => theme.colors.textMuted}; margin-top: 1px;
`;
const LangCheck = styled.div`
  font-size: 0.85rem; font-weight: 700;
  color: ${({ theme }) => theme.colors.accent}; flex-shrink: 0;
`;

// PDF Preview
const PdfShell     = styled.div`border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.lg}; overflow: hidden; background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,0.06);`;
const PdfHead      = styled.div`padding: 0.875rem 1.25rem; border-bottom: 3px solid ${({ $c }) => $c}; display: flex; align-items: center; justify-content: space-between; background: #fff;`;
const PdfHeadLeft  = styled.div`display: flex; align-items: center; gap: 0.625rem; img { height: 28px; object-fit: contain; }`;
const PdfCompany   = styled.div`font-family: ${({ $ff }) => $ff}; font-size: 0.9375rem; font-weight: 700; color: ${({ $c }) => $c};`;
const PdfPeriod    = styled.div`font-size: 0.6875rem; color: #aaa;`;
const PdfKpis      = styled.div`display: grid; grid-template-columns: repeat(4,1fr); gap: 0.5rem; padding: 0.875rem 1.25rem;`;
const PdfKpi       = styled.div`
  border-radius: 6px; padding: 0.625rem;
  background: ${({ $c }) => $c + '14'};
  border-left: 3px solid ${({ $c }) => $c};
  .label { font-size: 0.55rem; color: #999; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.2rem; }
  .val   { font-family: ${({ $ff }) => $ff}; font-size: 0.9375rem; font-weight: 700; color: #111; line-height: 1; }
  .delta { font-size: 0.6rem; color: #10B981; margin-top: 0.15rem; }
`;
const PdfSummary   = styled.div`margin: 0 1.25rem; padding: 0.625rem 0.875rem; background: ${({ $c }) => $c + '0a'}; border-left: 3px solid ${({ $c }) => $c}; border-radius: 5px; font-size: 0.6875rem; color: #555; font-family: ${({ $ff }) => $ff}; line-height: 1.5;`;
const PdfTableHead = styled.div`display: flex; justify-content: space-between; padding: 0.375rem 1.25rem; font-size: 0.6rem; font-weight: 700; color: ${({ $c }) => $c}; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #f0f0f0; margin-top: 0.625rem;`;
const PdfTableRow  = styled.div`display: flex; justify-content: space-between; padding: 0.3rem 1.25rem; font-size: 0.6875rem; color: #444; font-family: ${({ $ff }) => $ff}; border-bottom: 1px solid #f9f9f9; &:last-child { border-bottom: none; }`;
const PdfFoot      = styled.div`padding: 0.5rem 1.25rem; border-top: 1px solid #eee; display: flex; justify-content: space-between; font-size: 0.6rem; color: #bbb; font-family: ${({ $ff }) => $ff}; margin-top: 0.625rem;`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function toFullHex(hex) {
  if (!hex || typeof hex !== 'string') return '#6C63FF';
  const h = hex.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(h))
    return '#' + h[1]+h[1] + h[2]+h[2] + h[3]+h[3];
  if (/^#[0-9a-fA-F]{6}$/.test(h)) return h;
  return '#6C63FF';
}

const FONTS = [
  { key: 'Inter',            label: 'Inter',        ff: 'Inter, sans-serif' },
  { key: 'Roboto',           label: 'Roboto',       ff: 'Roboto, sans-serif' },
  { key: 'Montserrat',       label: 'Montserrat',   ff: 'Montserrat, sans-serif' },
  { key: 'Lato',             label: 'Lato',         ff: 'Lato, sans-serif' },
  { key: 'Playfair Display', label: 'Playfair',     ff: '"Playfair Display", serif' },
  { key: 'Merriweather',     label: 'Merriweather', ff: 'Merriweather, serif' },
];

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
  max-width: 400px;
  width: 100%;
`;

const ModalTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

const ModalText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

// ── Plan info ─────────────────────────────────────────────────────────────────
// Plan limits now come from profiles.property_limit

// ── Component ─────────────────────────────────────────────────────────────────
export default function Settings({ user, lang = 'de', onLangChange }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [googleAccounts, setGoogleAccounts] = useState([]);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [targetProps, setTargetProps] = useState(1);
  const [wlAddon, setWlAddon] = useState(false);
  const [activeTab, setActiveTab] = useState('plan');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [downgradeModal, setDowngradeModal] = useState(null); // { targetPlan, maxDomains }
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Password change state
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwRepeat, setPwRepeat] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // GA4 edit state per property
  const [ga4Edits, setGa4Edits] = useState({});
  const [ga4Saving, setGa4Saving] = useState({});
  const [ga4Status, setGa4Status] = useState({}); // { [propertyId]: null | 'checking' | {valid, message} }
  const [ga4Timers, setGa4Timers] = useState({});

  // Branding state
  const [branding, setBranding] = useState({
    brand_company_name:   '',
    brand_logo_url:       '',
    brand_primary_color:  '#6C63FF',
    brand_accent_color:   '#A78BFA',
    brand_font:           'Inter',
    brand_reply_to_email: '',
    report_language:      'de',
  });
  const [brandingSaving, setBrandingSaving] = useState(false);
  const [logoUploading, setLogoUploading]   = useState(false);
  const [dragging, setDragging]             = useState(false);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: prof }, { data: props }, { data: gAccounts }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('properties').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('google_accounts').select('id, google_email, created_at').eq('user_id', user.id).order('created_at'),
    ]);
    setGoogleAccounts(gAccounts ?? []);
    setProfile(prof);
    setProperties(props ?? []);
    // Init branding from profile
    if (prof) {
      setBranding({
        brand_company_name:   prof.brand_company_name   || '',
        brand_logo_url:       prof.brand_logo_url       || '',
        brand_primary_color:  toFullHex(prof.brand_primary_color  || '#6C63FF'),
        brand_accent_color:   toFullHex(prof.brand_accent_color   || '#A78BFA'),
        brand_font:           prof.brand_font           || 'Inter',
        brand_reply_to_email: prof.brand_reply_to_email || '',
        report_language:      prof.report_language      || 'de',
      });
    }
    // Init GA4 edits
    const edits = {};
    (props ?? []).forEach(p => { edits[p.id] = p.ga_property_id || ''; });
    setGa4Edits(edits);
    setLoading(false);
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleRedeemPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true); setPromoResult(null);
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/redeem-promo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify({ code: promoCode.trim(), user_id: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoResult({ success: true, plan: data.plan });
        setTimeout(() => window.location.replace('/dashboard?upgraded=true'), 1500);
      } else {
        setPromoResult({ success: false, message: data.error || 'Ungültiger oder bereits verwendeter Code.' });
      }
    } catch {
      setPromoResult({ success: false, message: 'Fehler. Bitte erneut versuchen.' });
    }
    setPromoLoading(false);
  };

  // ── Stripe Customer Portal ────────────────────────────────────────────────
  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else showAlert(t(lang, 'set.portal_error'), 'error');
    } catch {
      showAlert(t(lang, 'error_network'), 'error');
    }
    setPortalLoading(false);
  };

  // ── Checkout ──────────────────────────────────────────────────────────────
  const handleUpgrade = async (addons = []) => {
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ addons, user_id: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else showAlert('Fehler beim Laden des Checkouts.', 'error');
    } catch {
      showAlert('Fehler beim Laden des Checkouts.', 'error');
    }
  };

  // ── Property package calculator ───────────────────────────────────────────
  const calcCheckoutPackages = (targetProps) => {
    const extra = Math.max(0, targetProps - 1);
    const pkgs = [];
    let rem = extra;
    while (rem >= 10) { pkgs.push('prop_10'); rem -= 10; }
    if (rem >= 5) { pkgs.push('prop_5'); rem -= 5; }
    if (rem >= 1) { pkgs.push('prop_3'); rem = 0; }
    return pkgs;
  };

  // ── Downgrade with property selection ────────────────────────────────────
  const handleDowngrade = (targetPlan) => {
    const maxDomains = propertyLimit;
    const activeProps = properties.filter(p => p.is_active !== false);
    if (activeProps.length > maxDomains) {
      setSelectedProperties(activeProps.slice(0, maxDomains).map(p => p.id));
      setDowngradeModal({ targetPlan, maxDomains });
    } else {
      handleUpgrade(targetPlan);
    }
  };

  const confirmDowngrade = async () => {
    if (!downgradeModal) return;
    const { targetPlan, maxDomains } = downgradeModal;
    if (selectedProperties.length !== maxDomains) {
      const lang = branding.report_language;
      showAlert(lang === 'en'
        ? `Please select exactly ${maxDomains} domain(s) to keep.`
        : `Bitte genau ${maxDomains} Domain(s) auswählen.`, 'error');
      return;
    }
    // Deactivate non-selected properties
    const toDeactivate = properties
      .filter(p => !selectedProperties.includes(p.id))
      .map(p => p.id);
    for (const pid of toDeactivate) {
      await supabase.from('properties').update({ is_active: false }).eq('id', pid);
    }
    setDowngradeModal(null);
    handleUpgrade(targetPlan);
  };

  // ── GA4 ID validieren (debounced) ────────────────────────────────────────
  const validateGa4 = async (propertyId, val) => {
    if (!val.trim()) { setGa4Status(s => ({ ...s, [propertyId]: null })); return; }
    if (!/^\d+$/.test(val.trim())) {
      setGa4Status(s => ({ ...s, [propertyId]: { valid: false, message: 'Nur Zahlen erlaubt — nicht die G-XXXXXXXX ID.' } }));
      return;
    }
    setGa4Status(s => ({ ...s, [propertyId]: 'checking' }));
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/validate-ga4`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ user_id: user.id, ga4_property_id: val.trim() }),
      });
      const data = await res.json();
      setGa4Status(s => ({ ...s, [propertyId]: { valid: data.valid, message: data.message } }));
    } catch {
      setGa4Status(s => ({ ...s, [propertyId]: { valid: false, message: 'Validierung fehlgeschlagen.' } }));
    }
  };

  const handleGa4Change = (propertyId, val) => {
    setGa4Edits(eds => ({ ...eds, [propertyId]: val }));
    setGa4Status(s => ({ ...s, [propertyId]: null }));
    if (ga4Timers[propertyId]) clearTimeout(ga4Timers[propertyId]);
    if (val.trim().length >= 6) {
      const t = setTimeout(() => validateGa4(propertyId, val), 800);
      setGa4Timers(ts => ({ ...ts, [propertyId]: t }));
    }
  };

  // ── GA4 ID speichern ──────────────────────────────────────────────────────
  const saveGa4 = async (propertyId) => {
    const val = ga4Edits[propertyId]?.trim();
    const status = ga4Status[propertyId];
    if (val && status && status !== 'checking' && !status.valid) {
      showAlert(status.message || 'Bitte überprüfe die GA4 Property ID.', 'error');
      return;
    }
    if (val && status === 'checking') {
      showAlert('GA4 ID wird noch geprüft. Bitte einen Moment warten.', 'error');
      return;
    }
    setGa4Saving(s => ({ ...s, [propertyId]: true }));
    const { error } = await supabase
      .from('properties')
      .update({ ga_property_id: val || null })
      .eq('id', propertyId);
    if (error) showAlert(lang === 'de' ? 'Fehler beim Speichern.' : 'Error saving. Please try again.', 'error');
    else showAlert(lang === 'de' ? '🎉 GA4 verbunden! Dein nächster Report enthält Besucher, Sessions & Engagement.' : '🎉 GA4 connected! Your next report will include visitors, sessions & engagement.');
    setGa4Saving(s => ({ ...s, [propertyId]: false }));
  };

  // ── Property löschen ──────────────────────────────────────────────────────
  const [deletePropertyId, setDeletePropertyId] = useState(null);

  const handleDeleteProperty = async () => {
    if (!deletePropertyId) return;
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', deletePropertyId);
    if (error) showAlert(t(lang, 'set.error_delete'), 'error');
    else {
      showAlert(t(lang, 'set.property_deleted'));
      setProperties(ps => ps.filter(p => p.id !== deletePropertyId));
    }
    setDeletePropertyId(null);
  };

  // ── Neue Property verbinden ───────────────────────────────────────────────
  const startOAuth = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/google-oauth-callback`;
    const SCOPES = [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ');
    const state = encodeURIComponent(`${user.id}||`);
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);
    window.location.href = authUrl.toString();
  };

  const handleConnectNew = () => {
    const planLimit = propertyLimit;
    if (properties.length >= planLimit) {
      showAlert(lang === 'de' ? `Du hast ${planLimit} Properties gebucht. Upgrade im Plan-Tab um mehr hinzuzufügen.` : `You have ${planLimit} properties booked. Upgrade in the plan tab to add more.`, 'error');
      return;
    }
    // Hat der User bereits Google-Konten? → Modal öffnen (keine neues OAuth nötig)
    if (googleAccounts.length > 0) {
      setShowPropertyModal(true);
    } else {
      startOAuth();
    }
  };

  // ── Branding speichern ───────────────────────────────────────────────────────
  const saveBranding = async () => {
    setBrandingSaving(true);
    const { error } = await supabase.from('profiles').update({
      brand_company_name:   branding.brand_company_name   || null,
      brand_logo_url:       branding.brand_logo_url       || null,
      brand_primary_color:  branding.brand_primary_color,
      brand_accent_color:   branding.brand_accent_color,
      brand_font:           branding.brand_font,
      brand_reply_to_email: branding.brand_reply_to_email || null,
      report_language:      branding.report_language,
    }).eq('id', user.id);
    if (error) showAlert(lang === 'de' ? 'Fehler beim Speichern.' : 'Error saving. Please try again.', 'error');
    else showAlert(t(lang, 'set.branding_saved'));
    setBrandingSaving(false);
  };

  // ── Logo Upload via Cloudinary ────────────────────────────────────────────
  const LOGO_MAX_BYTES = 500 * 1024; // 500 KB
  const LOGO_ALLOWED   = ['image/png', 'image/jpeg', 'image/svg+xml'];
  const LOGO_ACCEPT    = '.png,.jpg,.jpeg,.svg';

  const uploadLogo = async (file) => {
    if (!file) return;
    if (!LOGO_ALLOWED.includes(file.type)) {
      showAlert('Nur PNG, JPG oder SVG erlaubt.', 'error'); return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      showAlert(`Logo zu groß – max. 500 KB (aktuell ${(file.size / 1024).toFixed(0)} KB).`, 'error'); return;
    }
    setLogoUploading(true);
    try {
      // Upload to Supabase Storage (bucket: logos)
      const ext      = file.name.split('.').pop();
      const path     = `${user.id}/logo.${ext}`;
      const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path);
      const cacheBusted = publicUrl + '?t=' + Date.now();
      setBranding(b => ({ ...b, brand_logo_url: cacheBusted, _logoFile: file.name, _logoSize: file.size }));
      showAlert('Logo hochgeladen – "Branding speichern" klicken.');
    } catch (err) {
      const hint = err.message?.includes('400') || err.message?.includes('policy')
        ? ' – Bitte RLS Policy für den "logos" Bucket in Supabase prüfen.'
        : '';
      showAlert('Upload fehlgeschlagen: ' + err.message + hint, 'error');
    }
    setLogoUploading(false);
  };

  // ── Passwort ändern ───────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    if (!pwNew || pwNew.length < 8) {
      showAlert(lang === 'de' ? 'Neues Passwort muss mindestens 8 Zeichen haben.' : 'New password must be at least 8 characters.', 'error');
      return;
    }
    if (pwNew !== pwRepeat) {
      showAlert(lang === 'de' ? 'Passwörter stimmen nicht überein.' : 'Passwords do not match.', 'error');
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwNew });
    if (error) showAlert(error.message, 'error');
    else {
      showAlert(t(lang, 'set.password_saved'));
      setPwCurrent('');
      setPwNew('');
    }
    setPwLoading(false);
  };

  // ── Account löschen ───────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    // Block deletion if active paid subscription exists
    const hasActivePlan = ['basic', 'pro', 'agency'].includes(profile?.plan)
      && profile?.plan_status === 'active';
    if (hasActivePlan) {
      setDeleteConfirm(false);
      showAlert(t(lang, 'set.delete_cancel_first'), 'error');
      return;
    }
    setDeleteLoading(true);
    try {
      // Delete all properties (cascades reports via FK)
      await supabase.from('properties').delete().eq('user_id', user.id);
      // Delete profile
      await supabase.from('profiles').delete().eq('id', user.id);
      // Sign out (actual user deletion requires service role – user data is cleared)
      await supabase.auth.signOut();
      navigate('/');
    } catch {
      showAlert(t(lang, 'error_generic'), 'error');
    }
    setDeleteLoading(false);
  };

  const plan = profile?.plan || 'free';

  const isFree = plan === 'free';
  const isPaid = ['basic', 'pro', 'agency'].includes(plan);
  const whiteLabelEnabled = profile?.white_label_enabled === true;
  const propertyLimit = profile?.property_limit ?? 1;
  const isPro  = profile?.subscription_status === 'active' || ['pro', 'agency', 'basic'].includes(plan);
  const isAgency = whiteLabelEnabled;
  const activeFontFF = FONTS.find(f => f.key === branding.brand_font)?.ff || 'Inter, sans-serif';

  if (loading) return (
    <Layout>
      <TopBar>
        <Logo to="/dashboard"><LogoDot />Rank<span>Brief</span></Logo>
      </TopBar>
      <Spinner />
    </Layout>
  );

  return (
    <>
    <Layout>
      {/* Confirm Modal: Property löschen */}
      {/* ── Downgrade Property Selection Modal ── */}
      {downgradeModal && (
        <ModalOverlay onClick={() => setDowngradeModal(null)}>
          <ModalCard onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
              {lang === 'en'
                ? `Adjust properties`
                : `Properties anpassen`}
            </h3>
            <p style={{ margin: '0 0 1rem', fontSize: '13px', color: '#666' }}>
              {lang === 'en'
                ? `Your new plan supports ${downgradeModal.maxDomains} domain(s). Please select which domain(s) you want to keep active.`
                : `Dein neuer Plan unterstützt ${downgradeModal.maxDomains} Domain(s). Bitte wähle aus, welche Domain(s) aktiv bleiben sollen.`}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {properties.map(p => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', border: selectedProperties.includes(p.id) ? '2px solid #6C63FF' : '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', background: selectedProperties.includes(p.id) ? 'rgba(108,99,255,0.06)' : '#fff' }}>
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(p.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        if (selectedProperties.length < downgradeModal.maxDomains) {
                          setSelectedProperties(s => [...s, p.id]);
                        }
                      } else {
                        setSelectedProperties(s => s.filter(id => id !== p.id));
                      }
                    }}
                    style={{ accentColor: '#6C63FF' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{p.display_name || p.gsc_property_url}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Btn onClick={() => setDowngradeModal(null)}>
                {lang === 'en' ? 'Cancel' : 'Abbrechen'}
              </Btn>
              <Btn $variant="primary" onClick={confirmDowngrade} disabled={selectedProperties.length !== downgradeModal.maxDomains}>
                {lang === 'en' ? 'Confirm & Switch Plan →' : 'Confirm & Switch Plan →'}
              </Btn>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {deletePropertyId && (
        <ModalOverlay onClick={() => setDeletePropertyId(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalTitle>Property löschen?</ModalTitle>
            <ModalText>
              Diese Property und alle zugehörigen Report-Daten werden unwiderruflich gelöscht.
              Diese Aktion kann nicht rückgängig gemacht werden.
            </ModalText>
            <ModalActions>
              <Btn onClick={() => setDeletePropertyId(null)}>Abbrechen</Btn>
              <Btn $variant="danger" onClick={handleDeleteProperty}>{t(lang, 'delete')}</Btn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Confirm Modal: {t(lang, 'set.delete_account')} */}
      {deleteConfirm && (
        <ModalOverlay onClick={() => setDeleteConfirm(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalTitle>Account wirklich löschen?</ModalTitle>
            {['basic', 'pro', 'agency'].includes(profile?.plan) && profile?.plan_status === 'active' ? (
              <>
                <ModalText style={{ color: '#ef4444' }}>
                  ⚠️ {lang === 'de' ? `Du hast noch ein aktives Abo (${propertyLimit} Properties).` : `You have an active subscription (${propertyLimit} properties).`}
                  {lang === 'de' ? 'Bitte kündige es zuerst im Billing Portal – danach kannst du deinen Account löschen.' : 'Please cancel your subscription in the Billing Portal first, then you can delete your account.'}
                </ModalText>
                <ModalActions>
                  <Btn onClick={() => setDeleteConfirm(false)}>Abbrechen</Btn>
                  <Btn $variant="primary" onClick={handlePortal}>{lang === 'de' ? 'Zum Billing Portal →' : 'Go to Billing Portal →'}</Btn>
                </ModalActions>
              </>
            ) : (
              <>
                <ModalText>
                  Dein Account, alle Properties und alle Report-Daten werden dauerhaft gelöscht.
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </ModalText>
                <ModalActions>
                  <Btn onClick={() => setDeleteConfirm(false)}>Abbrechen</Btn>
                  <Btn $variant="danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                    {deleteLoading ? t(lang, 'deleting') : t(lang, 'set.delete_account')}
                  </Btn>
                </ModalActions>
              </>
            )}
          </ModalCard>
        </ModalOverlay>
      )}

      <TopBar>
        <Logo to="/dashboard"><LogoDot />Rank<span>Brief</span></Logo>
        <TopBarRight>
          <TopBarLink to="/dashboard">← Dashboard</TopBarLink>
          {onLangChange && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <LangToggle $active={lang === 'de'} onClick={() => onLangChange('de')}>DE</LangToggle>
              <LangToggle $active={lang === 'en'} onClick={() => onLangChange('en')}>EN</LangToggle>
            </div>
          )}
          <BtnSignOut onClick={handleSignOut}>Sign out</BtnSignOut>
        </TopBarRight>
      </TopBar>

      <Main>
        <PageTitle>Settings</PageTitle>

        {alert && <Alert $type={alert.type}>{alert.msg}</Alert>}

        <TabBar>
          {[
            { id: 'plan',       labelDE: '💳 Plan & Abo',      labelEN: '💳 Plan & billing' },
            { id: 'properties', labelDE: '🌐 Properties',       labelEN: '🌐 Properties' },
            { id: 'branding',   labelDE: '🎨 Branding',         labelEN: '🎨 Branding' },
            { id: 'google',     labelDE: '🔗 Google-Konten',    labelEN: '🔗 Google accounts' },
            { id: 'account',    labelDE: '👤 Account',          labelEN: '👤 Account' },
          ].map(tab => (
            <Tab key={tab.id} $active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
              {lang === 'de' ? tab.labelDE : tab.labelEN}
            </Tab>
          ))}
        </TabBar>

        {activeTab === 'plan' && (
          <>
            <Section>
          <SectionHead>
            <div>
              <SectionTitle>{t(lang, 'set.plan_billing')}</SectionTitle>
              <SectionSub>{t(lang, 'set.plan_sub')}</SectionSub>
            </div>
            <PlanBadge $plan={profile?.subscription_status === 'active' ? 'pro' : plan}>
              <StatusDot />
              {profile?.subscription_status === 'active' || profile?.subscription_status === 'promo'
                ? `${propertyLimit} ${propertyLimit === 1 ? 'Property' : 'Properties'}${whiteLabelEnabled ? ' · WL' : ''}`
                : (lang === 'de' ? 'Kostenlos' : 'Free')}
            </PlanBadge>
          </SectionHead>
          <SectionBody>
            <InfoRow>
              <InfoLabel>{t(lang, 'set.current_plan')}</InfoLabel>
              <InfoValue>
                {propertyLimit} {propertyLimit === 1 ? 'Property' : 'Properties'}
                {whiteLabelEnabled ? (lang === 'de' ? ' · White-Label ✓' : ' · White-label ✓') : ''}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>{t(lang, 'set.status')}</InfoLabel>
              <InfoValue>
                {profile?.plan_status === 'frozen' ? (lang === 'de' ? '⏸ Pausiert' : '⏸ Paused') :
                 profile?.plan_status === 'active' ? (lang === 'de' ? '✅ Aktiv' : '✅ Active') : profile?.plan_status}
              </InfoValue>
            </InfoRow>
            {profile?.trial_ends_at && (
              <InfoRow>
                <InfoLabel>{lang === 'de' ? 'Freimonat endet am' : 'Trial ends on'}</InfoLabel>
                <InfoValue>{new Date(profile.trial_ends_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB')}</InfoValue>
              </InfoRow>
            )}

            {/* ── Add-ons / Upgrade ── */}
            {(() => {
              const isDE = lang === 'de';
              const hasActiveSub = profile?.subscription_status === 'active';
              const currentProps = profile?.property_limit ?? 1;
              const hasWL = profile?.white_label_enabled === true;

              if (!hasActiveSub) {
                // Not subscribed yet — show configurator
                const tierPrices = { 1:19, 4:43, 6:49, 11:69, 16:99, 21:119 };
                const tierAddons = { 1:[], 4:['prop_3'], 6:['prop_5'], 11:['prop_10'], 16:['prop_10','prop_5'], 21:['prop_10','prop_10'] };
                const calcPrice = (props, wl) => (tierPrices[props] || 19) + (wl ? 5 : 0);

                return (
                  <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
                      {isDE ? '🚀 Abo starten' : '🚀 Start subscription'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{isDE ? 'Properties:' : 'Properties:'}</span>
                      <button onClick={() => setTargetProps(p => Math.max(1,p-1))} style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(108,99,255,0.3)', background:'transparent', cursor:'pointer', color:'#6C63FF' }}>−</button>
                      <strong style={{ minWidth:24, textAlign:'center' }}>{targetProps}</strong>
                      <button onClick={() => setTargetProps(p => p+1)} style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(108,99,255,0.3)', background:'transparent', cursor:'pointer', color:'#6C63FF' }}>+</button>
                      <input type="range" min="1" max="30" value={targetProps} onChange={e => setTargetProps(+e.target.value)} style={{ flex:1, accentColor:'#6C63FF' }} />
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', cursor:'pointer' }} onClick={() => setWlAddon(w => !w)}>
                      <div style={{ width:32, height:18, borderRadius:9, background: wlAddon?'#6C63FF':'#E0E0E8', position:'relative', flexShrink:0 }}>
                        <div style={{ width:14, height:14, borderRadius:7, background:'#fff', position:'absolute', top:2, left: wlAddon?16:2, transition:'left 0.15s' }} />
                      </div>
                      <span style={{ fontSize:'13px' }}>White-Label +€5/Monat</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:'0.75rem' }}>
                      <span style={{ fontSize:'1.8rem', fontWeight:800, color:'#1C1C2E' }}>€{calcPrice(targetProps, wlAddon)}</span>
                      <span style={{ fontSize:'13px', color:'#888' }}>{isDE ? '/Monat' : '/month'}</span>
                      {targetProps > 1 && <span style={{ fontSize:'12px', color:'#10B981', fontWeight:600 }}>· €{(calcPrice(targetProps,false)/targetProps).toFixed(2)}/{isDE?'Seite':'site'}</span>}
                    </div>
                    <Btn $variant="primary" onClick={() => { const pkgs = [...(tierAddons[targetProps] || [])]; if (wlAddon) pkgs.push('whitelabel'); handleUpgrade(pkgs); }}>
                      {isDE ? 'Jetzt starten →' : 'Get started →'}
                    </Btn>
                  </div>
                );
              }

              // Active subscription — show current status + Stripe portal
              return (
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:'1rem' }}>
                    <div style={{ padding:'8px 12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:8, fontSize:'13px' }}>
                      ✓ {currentProps} {isDE ? `Property${currentProps > 1 ? 's' : ''}` : `propert${currentProps > 1 ? 'ies' : 'y'}`}
                    </div>
                    {hasWL && (
                      <div style={{ padding:'8px 12px', background:'rgba(108,99,255,0.08)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:8, fontSize:'13px' }}>
                        ✓ White-Label
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <Btn $variant="primary" onClick={handlePortal}>
                      {isDE ? 'Abo verwalten & Add-ons →' : 'Manage subscription & add-ons →'}
                    </Btn>
                    {!hasWL && (
                      <Btn onClick={() => handleUpgrade(['whitelabel'])}>
                        {isDE ? '+ White-Label (€5/Monat)' : '+ White-Label (€5/month)'}
                      </Btn>
                    )}
                  </div>
                  <FieldHint style={{ marginTop:'0.5rem' }}>
                    {isDE ? 'Weitere Properties oder Add-ons über das Billing Portal hinzufügen.' : 'Add more properties or add-ons via the billing portal.'}
                  </FieldHint>
                </div>
              );
            })()}
          </SectionBody>
                    </Section>

            <Section>
            <SectionHead>
              <div>
                <SectionTitle>🎟️ Promo-Code einlösen</SectionTitle>
                <SectionSub>Hast du einen Code? Hier upgraden ohne Kreditkarte.</SectionSub>
              </div>
            </SectionHead>
            <SectionBody>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="z.B. 2026RANKBRIEFPROMO"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleRedeemPromo()}
                  style={{
                    padding: '0.625rem 1rem', borderRadius: '8px', fontSize: '0.875rem',
                    letterSpacing: '0.06em', textTransform: 'uppercase', outline: 'none',
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    color: 'var(--text)', width: '220px',
                  }}
                />
                <button
                  onClick={handleRedeemPromo}
                  disabled={promoLoading || !promoCode.trim()}
                  style={{
                    padding: '0.625rem 1.25rem', borderRadius: '8px', fontWeight: 700,
                    fontSize: '0.875rem', background: '#6C63FF', color: '#fff',
                    border: 'none', cursor: 'pointer', opacity: (promoLoading || !promoCode.trim()) ? 0.5 : 1,
                  }}
                >
                  {promoLoading ? 'Prüfe…' : 'Einlösen →'}
                </button>
              </div>
              {promoResult && (
                <div style={{
                  marginTop: '0.75rem', fontSize: '0.8125rem', fontWeight: 500,
                  color: promoResult.success ? '#10B981' : '#EF4444',
                }}>
                  {promoResult.success
                    ? `✅ Code aktiviert! Dein ${promoResult.plan}-Plan ist jetzt aktiv.`
                    : `❌ ${promoResult.message}`}
                </div>
              )}
            </SectionBody>
              </Section>

            <Section>
            <SectionHead>
              <div>
                <SectionTitle>💳 {lang === 'de' ? 'Billing & Rechnungen' : 'Billing & Invoices'}</SectionTitle>
                <SectionSub>
                  {lang === 'de'
                    ? 'Zahlungsmethode ändern, Rechnungen downloaden und Abo verwalten.'
                    : 'Update payment method, download invoices and manage your subscription.'}
                </SectionSub>
              </div>
            </SectionHead>
            <SectionBody>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'rgba(108,99,255,0.05)',
                border: '1px solid rgba(108,99,255,0.15)',
                borderRadius: '10px',
              }}>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                    {lang === 'de' ? 'Aktueller Plan' : 'Current Plan'}:{' '}
                    <span style={{ color: '#6C63FF', textTransform: 'capitalize' }}>{profile.plan}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#888', marginTop: '0.2rem', fontWeight: 300 }}>
                    {lang === 'de'
                      ? 'Rechnungen, Zahlungsmethode & Abo im Stripe-Portal verwalten.'
                      : 'Manage invoices, payment method & subscription in the Stripe portal.'}
                  </div>
                </div>
                <Btn $variant="primary" onClick={handlePortal} disabled={portalLoading} style={{ whiteSpace: 'nowrap' }}>
                  {portalLoading ? '...' : (lang === 'de' ? '🧾 Rechnungen & Billing →' : '🧾 Invoices & Billing →')}
                </Btn>
              </div>
            </SectionBody>
              </Section>
          </>
        )}

        {activeTab === 'properties' && (
          <Section>
          <SectionHead>
            <div>
              <SectionTitle>Properties</SectionTitle>
              <SectionSub>
                {properties.length} / {propertyLimit} {lang === 'de' ? 'Properties verbunden' : 'properties connected'}
              </SectionSub>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {googleAccounts.length > 0 && properties.length < propertyLimit && (
                <Btn $variant="secondary" onClick={handleConnectNew}>
                  {t(lang, 'set.add_property')}
                </Btn>
              )}
              {(googleAccounts.length === 0 || ['pro', 'agency'].includes(profile?.plan)) && properties.length < propertyLimit && (
                <Btn $variant="primary" onClick={startOAuth}>
                  {t(lang, 'set.connect_google')}
                </Btn>
              )}
            </div>
          </SectionHead>
          <SectionBody>
            {properties.length === 0 && (
              <Alert $type="info">
                {lang === 'de' ? 'Noch keine Property verbunden.' : 'No properties connected yet.'}{' '}
                <button
                  onClick={handleConnectNew}
                  style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
                >
                  Jetzt verbinden →
                </button>
              </Alert>
            )}

            {properties.map(prop => (
              <PropertyCard key={prop.id}>
                <PropertyHead>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <PropertyDot $status={prop.status} />
                    <div>
                      <PropertyName>{prop.display_name}</PropertyName>
                      <PropertyUrl>{prop.gsc_property_url}</PropertyUrl>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {!prop.refresh_token_encrypted && (
                      <button
                        onClick={startOAuth}
                        style={{
                          fontSize: '0.72rem', fontWeight: 600, color: '#F59E0B',
                          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                          borderRadius: '6px', padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}
                      >
                        ⚠️ {lang === 'de' ? 'Neu verbinden →' : 'Reconnect →'}
                      </button>
                    )}
                    <Btn $variant="danger" onClick={() => setDeletePropertyId(prop.id)}>
                      {lang === 'de' ? 'Entfernen' : 'Remove'}
                    </Btn>
                  </div>
                </PropertyHead>
                <PropertyBody>
                  {!prop.refresh_token_encrypted && (
                    <div style={{
                      marginBottom: '1rem',
                      padding: '1rem 1.25rem',
                      background: 'rgba(245,158,11,0.07)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      borderRadius: '10px',
                      borderLeft: '4px solid #F59E0B',
                    }}>
                      <div style={{ fontWeight: 700, color: '#B45309', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                        ⚠️ {lang === 'de' ? 'Google-Konto neu verbinden erforderlich' : 'Google account reconnection required'}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#78716C', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                        {lang === 'de'
                          ? 'RankBrief kann keine Daten von der Google Search Console abrufen, weil die Verbindung zu deinem Google-Konto abgelaufen oder unterbrochen ist. Das passiert, wenn du dein Google-Passwort geändert hast, die App-Berechtigungen widerrufen wurden oder die Verbindung zu lange inaktiv war. Bitte verbinde dein Konto erneut.'
                          : 'RankBrief cannot fetch data from Google Search Console because the connection to your Google account has expired or been interrupted. This can happen if you changed your Google password, revoked app permissions, or the connection was inactive for too long. Please reconnect.'}
                      </div>
                      <button
                        onClick={startOAuth}
                        style={{
                          fontSize: '0.8125rem', fontWeight: 600, color: '#fff',
                          background: '#F59E0B', border: 'none', borderRadius: '7px',
                          padding: '0.5rem 1.125rem', cursor: 'pointer',
                        }}
                      >
                        {lang === 'de' ? '🔗 Jetzt neu verbinden' : '🔗 Reconnect now'}
                      </button>
                    </div>
                  )}
                  <Field>
                    <Label>GA4 Property ID</Label>
                    <Row>
                      <Input
                        style={{ flex: 1 }}
                        placeholder="z.B. 123456789"
                        value={ga4Edits[prop.id] ?? ''}
                        onChange={e => handleGa4Change(prop.id, e.target.value)}
                      />
                      <Btn
                        $variant="primary"
                        onClick={() => saveGa4(prop.id)}
                        disabled={ga4Saving[prop.id] || ga4Status[prop.id] === 'checking' || (ga4Edits[prop.id]?.trim() && ga4Status[prop.id] && !ga4Status[prop.id]?.valid)}
                      >
                        {ga4Saving[prop.id] ? t(lang, 'saving') : ga4Status[prop.id] === 'checking' ? '⏳' : t(lang, 'save')}
                      </Btn>
                    </Row>
                    {ga4Status[prop.id] && ga4Status[prop.id] !== 'checking' && (
                      <div style={{
                        fontSize: '0.8125rem', fontWeight: 600, marginTop: '0.5rem',
                        padding: '0.375rem 0.75rem', borderRadius: '6px',
                        color: ga4Status[prop.id].valid ? '#065F46' : '#991B1B',
                        background: ga4Status[prop.id].valid ? '#D1FAE5' : '#FEE2E2',
                        border: `1px solid ${ga4Status[prop.id].valid ? '#6EE7B7' : '#FECACA'}`,
                      }}>
                        {ga4Status[prop.id].message}
                      </div>
                    )}
                    {/* Persistenter Erfolgs-Hinweis nach Speichern */}
                    {!ga4Status[prop.id] && (ga4Edits[prop.id] || prop.ga_property_id) && prop.ga_property_id && (
                      <div style={{
                        fontSize: '0.8125rem', fontWeight: 600, marginTop: '0.5rem',
                        padding: '0.375rem 0.75rem', borderRadius: '6px',
                        color: '#065F46', background: '#D1FAE5', border: '1px solid #6EE7B7',
                      }}>
                        {t(lang, 'set.ga4_connected', { id: prop.ga_property_id })}
                      </div>
                    )}
                    <FieldHint>
                      {lang === 'de' ? 'Nur Ziffern – z.B. ' : 'Numbers only – e.g. '}<code>123456789</code>{lang === 'de' ? '. Zu finden in' : '. Find it in'}{' '}
                      <a href="https://analytics.google.com" target="_blank" rel="noreferrer">
                        {lang === 'de' ? 'Google Analytics → Admin → Property-Einstellungen' : 'Google Analytics → Admin → Property Settings'}
                      </a>
                    </FieldHint>
                  </Field>
                </PropertyBody>
              </PropertyCard>
            ))}

            {properties.length >= propertyLimit && properties.length > 0 && (
              <FieldHint style={{ marginTop: '0.75rem' }}>
                Limit erreicht. {plan !== 'agency' && (
                  <button
                    onClick={() => handleUpgrade(plan === 'basic' ? 'pro' : 'agency')}
                    style={{ background: 'none', border: 'none', color: '#6C63FF', cursor: 'pointer', fontSize: 'inherit', fontWeight: 600 }}
                  >
                    {t(lang, 'dash.upgrade_domains')}
                  </button>
                )}
              </FieldHint>
            )}
          </SectionBody>
          </Section>
        )}

        {activeTab === 'branding' && (
          <Section>
          <SectionHead>
            <div>
              <SectionTitle>Branding & White-Label</SectionTitle>
              <SectionSub>{lang === 'de' ? 'Logo, Farben, Schriftart und Absendername im monatlichen PDF-Report' : 'Logo, colors, font and sender name in the monthly PDF report'}</SectionSub>
            </div>
          </SectionHead>
          <SectionBody>
            {!isPro && (
              <Alert $type="info" style={{ marginBottom: '1.5rem' }}>
                {t(lang, 'set.branding_locked')}{' '}
                <button onClick={() => handleUpgrade('pro')} style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
                  {lang === 'de' ? 'Jetzt upgraden →' : 'Upgrade now →'}
                </button>
              </Alert>
            )}

            {/* Logo */}
            <Field>
              <Label>{lang === 'de' ? 'Firmenlogo' : 'Company Logo'}</Label>

              {/* Thumbnail wenn Logo vorhanden */}
              {branding.brand_logo_url ? (
                <LogoThumbWrap>
                  <LogoThumb>
                    <img src={branding.brand_logo_url} alt="Logo" />
                  </LogoThumb>
                  <LogoThumbInfo>
                    <LogoThumbName>{branding._logoFile || 'logo'}</LogoThumbName>
                    <LogoThumbMeta>
                      {branding._logoSize ? `${(branding._logoSize / 1024).toFixed(0)} KB · ` : ''}PNG / JPG / SVG
                    </LogoThumbMeta>
                  </LogoThumbInfo>
                  <Row style={{ gap: '0.5rem' }}>
                    <Btn onClick={() => isPro && document.getElementById('rb-logo-input').click()} disabled={!isPro || logoUploading}>
                      {t(lang, 'save')}
                    </Btn>
                    <Btn $variant="danger" onClick={() => setBranding(b => ({ ...b, brand_logo_url: '', _logoFile: '', _logoSize: 0 }))} disabled={!isPro}>
                      {lang === 'de' ? 'Entfernen' : 'Remove'}
                    </Btn>
                  </Row>
                </LogoThumbWrap>
              ) : (
                /* Drop Zone wenn kein Logo */
                <LogoDropZone
                  $active={dragging}
                  onClick={() => isPro && document.getElementById('rb-logo-input').click()}
                  onDragOver={e => { e.preventDefault(); if (isPro) setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => { e.preventDefault(); setDragging(false); if (isPro) uploadLogo(e.dataTransfer.files?.[0]); }}
                  style={{ cursor: isPro ? 'pointer' : 'not-allowed', opacity: isPro ? 1 : 0.6 }}
                >
                  <div style={{ fontSize: '1.25rem' }}>🖼</div>
                  <p style={{ fontSize: '0.8125rem', color: '#9898B8', fontWeight: 300 }}>
                    {logoUploading ? 'Wird hochgeladen...' : lang === 'de' ? 'Drag & Drop oder klicken zum Hochladen' : 'Drag & drop or click to upload'}
                  </p>
                </LogoDropZone>
              )}

              <input id="rb-logo-input" type="file" accept=".png,.jpg,.jpeg,.svg"
                style={{ display: 'none' }} onChange={e => uploadLogo(e.target.files?.[0])} disabled={!isPro} />

              {!branding.brand_logo_url && (
                <Btn style={{ marginTop: '0.5rem' }} onClick={() => isPro && document.getElementById('rb-logo-input').click()} disabled={!isPro || logoUploading}>
                  {logoUploading ? t(lang, 'uploading') : lang === 'de' ? '↑ Logo hochladen' : '↑ Upload Logo'}
                </Btn>
              )}

              <FieldHint>{lang === 'de' ? 'PNG, JPG oder SVG · max. 500 KB · Empfohlen: 400×120px, transparenter Hintergrund' : 'PNG, JPG or SVG · max. 500 KB · Recommended: 400×120px, transparent background'}</FieldHint>
            </Field>

            {/* Firmenname */}
            <Field>
              <Label>{lang === 'de' ? 'Firmenname im Report' : 'Company Name'}</Label>
              <Input placeholder={lang === 'de' ? 'z.B. Muster SEO GmbH' : 'e.g. My SEO Agency'} value={branding.brand_company_name}
                onChange={e => setBranding(b => ({ ...b, brand_company_name: e.target.value }))} disabled={!isPro} />
              <FieldHint>{lang === 'de' ? 'Erscheint im Header und Footer anstelle von "RankBrief"' : 'Appears in header and footer instead of "RankBrief"'}</FieldHint>
            </Field>

            {/* Reply-To */}
            <Field>
              <Label>Reply-To E-Mail</Label>
              <Input type="email" placeholder={lang === 'de' ? 'reports@deine-agentur.de' : 'reports@your-agency.com'} value={branding.brand_reply_to_email}
                onChange={e => setBranding(b => ({ ...b, brand_reply_to_email: e.target.value }))} disabled={!isPro} />
              <FieldHint>{lang === 'de' ? 'Kunden sehen diese Adresse wenn sie auf den Report antworten' : 'Clients see this address when they reply to the report'}</FieldHint>
            </Field>

            {/* Primärfarbe */}
            <Field>
              <Label>{lang === 'de' ? 'Primärfarbe (Headlines, KPI-Akzente)' : 'Primary Color (Headlines, KPIs)'}</Label>
              <ColorRow>
                <ColorSwatch $c={branding.brand_primary_color}>
                  <input type="color" value={branding.brand_primary_color}
                    onChange={e => isPro && setBranding(b => ({ ...b, brand_primary_color: toFullHex(e.target.value) }))} disabled={!isPro} />
                </ColorSwatch>
                <Input style={{ flex: 1 }} value={branding.brand_primary_color} placeholder="#6C63FF"
                  onChange={e => setBranding(b => ({ ...b, brand_primary_color: e.target.value }))} disabled={!isPro} />
              </ColorRow>
            </Field>

            {/* Akzentfarbe */}
            <Field>
              <Label>{lang === 'de' ? 'Akzentfarbe (Trennlinien, Highlights)' : 'Accent Color (Dividers, Highlights)'}</Label>
              <ColorRow>
                <ColorSwatch $c={branding.brand_accent_color}>
                  <input type="color" value={branding.brand_accent_color}
                    onChange={e => isPro && setBranding(b => ({ ...b, brand_accent_color: toFullHex(e.target.value) }))} disabled={!isPro} />
                </ColorSwatch>
                <Input style={{ flex: 1 }} value={branding.brand_accent_color} placeholder="#A78BFA"
                  onChange={e => setBranding(b => ({ ...b, brand_accent_color: e.target.value }))} disabled={!isPro} />
              </ColorRow>
            </Field>

            {/* Schriftart */}
            <Field>
              <Label>{lang === 'de' ? 'Schriftart' : 'Font'}</Label>
              <FontGrid>
                {FONTS.map(f => (
                  <FontPill key={f.key} $active={branding.brand_font === f.key} $ff={f.ff}
                    onClick={() => isPro && setBranding(b => ({ ...b, brand_font: f.key }))} disabled={!isPro}>
                    {f.label}
                  </FontPill>
                ))}
              </FontGrid>
              <FieldHint>{t(lang, 'set.font_hint')}</FieldHint>
            </Field>

            {/* Report-Sprache */}
            <Field>
              <Label>{lang === 'de' ? 'Report-Sprache' : 'Report Language'}</Label>
              <LangGrid>
                {[
                  { key: 'de', flag: '🇩🇪', label: 'Deutsch', sub: 'Zusammenfassung & Empfehlungen auf Deutsch' },
                  { key: 'en', flag: '🇬🇧', label: 'English', sub: 'Summary & recommendations in English' },
                ].map(l => (
                  <LangPill
                    key={l.key}
                    $active={branding.report_language === l.key}
                    onClick={() => setBranding(b => ({ ...b, report_language: l.key }))}
                  >
                    <LangFlag>{l.flag}</LangFlag>
                    <LangInfo>
                      <LangLabel>{l.label}</LangLabel>
                      <LangSub>{l.sub}</LangSub>
                    </LangInfo>
                    {branding.report_language === l.key && <LangCheck>✓</LangCheck>}
                  </LangPill>
                ))}
              </LangGrid>
              <FieldHint>{lang === 'de' ? 'Gilt für KI-Zusammenfassung, Empfehlungen und alle Beschriftungen im PDF' : 'Applies to AI summary, recommendations and all labels in the PDF'}</FieldHint>
            </Field>

            {/* Live PDF Preview */}
            <Field>
              <Label>{lang === 'de' ? 'Live-Vorschau PDF-Report' : 'Live PDF Preview'}</Label>
              <PdfShell>
                <PdfHead $c={branding.brand_primary_color}>
                  <PdfHeadLeft>
                    {branding.brand_logo_url
                      ? <img src={branding.brand_logo_url} alt="Logo" />
                      : <>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: branding.brand_primary_color }} />
                          <PdfCompany $c={branding.brand_primary_color} $ff={activeFontFF}>
                            {branding.brand_company_name || 'RankBrief'}
                          </PdfCompany>
                        </>
                    }
                  </PdfHeadLeft>
                  <PdfPeriod>SEO Report · {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</PdfPeriod>
                </PdfHead>
                <PdfKpis>
                  {[{l:'Clicks',v:'4.821',d:'▲ 12.4%'},{l:'Impressionen',v:'89.3k',d:'▲ 8.1%'},{l:'Ø CTR',v:'5.4%',d:'▲ 0.8%'},{l:'Ø Position',v:'14.2',d:'▲ 2.1'}].map(k => (
                    <PdfKpi key={k.l} $c={branding.brand_primary_color} $ff={activeFontFF}>
                      <div className="label">{k.l}</div>
                      <div className="val">{k.v}</div>
                      <div className="delta">{k.d}</div>
                    </PdfKpi>
                  ))}
                </PdfKpis>
                <PdfSummary $c={branding.brand_primary_color} $ff={activeFontFF}>
                  🤖 KI-Zusammenfassung: Im vergangenen Monat verzeichnete deine Website starkes Wachstum. Die Klickrate stieg auf 5.4 %, getrieben durch bessere Rankings für deine Top-Keywords.
                </PdfSummary>
                <PdfTableHead $c={branding.brand_primary_color}><span>Top Keywords</span><span>Klicks</span></PdfTableHead>
                {[['seo agentur hamburg',142],['website optimierung',98],['google ranking verbessern',76]].map(([kw,cl]) => (
                  <PdfTableRow key={kw} $ff={activeFontFF}>
                    <span>{kw}</span>
                    <span style={{ color: branding.brand_accent_color, fontWeight: 600 }}>{cl}</span>
                  </PdfTableRow>
                ))}
                <PdfFoot $ff={activeFontFF}>
                  <span>{branding.brand_company_name || 'RankBrief'} · Automatischer SEO-Report</span>
                  <span style={{ color: branding.brand_accent_color }}>Powered by RankBrief</span>
                </PdfFoot>
              </PdfShell>
              <FieldHint>{lang === 'de' ? 'Echtzeit-Vorschau — das finale PDF kann minimal abweichen' : 'Real-time preview — the final PDF may differ slightly'}</FieldHint>
            </Field>

            <Btn $variant="primary" onClick={saveBranding} disabled={brandingSaving || !isPro}>
              {brandingSaving ? (lang === 'de' ? 'Wird gespeichert...' : 'Saving...') : (lang === 'de' ? 'Branding speichern' : 'Save Branding')}
            </Btn>
          </SectionBody>
          </Section>
        )}

        {activeTab === 'google' && (
          <Section>
          <SectionHead>
            <div>
              <SectionTitle>{lang === 'de' ? 'Verbundene Google-Konten' : 'Connected Google Accounts'}</SectionTitle>
              <SectionSub>Diese Google-Accounts sind mit deinem RankBrief-Account verknüpft.</SectionSub>
            </div>
          </SectionHead>
          <SectionBody>
            {googleAccounts.length === 0 ? (
              <div style={{ fontSize: '0.875rem', color: '#888', fontWeight: 300 }}>
                {lang === 'de' ? 'Noch kein Google-Konto verbunden. Verbinde ein Konto über das Dashboard.' : 'No Google account connected yet. Connect an account from the Dashboard.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {googleAccounts.map(account => (
                  <div key={account.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    background: 'rgba(108,99,255,0.05)',
                    border: '1px solid rgba(108,99,255,0.15)',
                    borderRadius: '8px',
                  }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" style={{ flexShrink: 0 }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{account.google_email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 300 }}>
                        {lang === 'de' ? 'Verbunden' : 'Connected'} {new Date(account.created_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionBody>
          </Section>
        )}

        {activeTab === 'account' && (
          <>
            <Section>
          <SectionHead>
            <div>
              <SectionTitle>Account</SectionTitle>
              <SectionSub>E-Mail und Passwort</SectionSub>
            </div>
          </SectionHead>
          <SectionBody>
            <Field>
              <Label>E-Mail-Adresse</Label>
              <Input value={user.email} disabled />
            </Field>

            <Field>
              <Label>{lang === 'de' ? 'Neues Passwort' : 'New password'}</Label>
              <Input
                type="password"
                placeholder={lang === 'de' ? 'Mindestens 8 Zeichen' : 'At least 8 characters'}
                value={pwNew}
                onChange={e => setPwNew(e.target.value)}
              />
            </Field>

            <Field>
              <Label>{lang === 'de' ? 'Passwort wiederholen' : 'Confirm password'}</Label>
              <Input
                type="password"
                placeholder={lang === 'de' ? 'Passwort bestätigen' : 'Confirm your password'}
                value={pwRepeat}
                onChange={e => setPwRepeat(e.target.value)}
                style={{ borderColor: pwRepeat && pwNew && pwRepeat !== pwNew ? '#EF4444' : undefined }}
              />
              {pwRepeat && pwNew && pwRepeat !== pwNew && (
                <FieldHint style={{ color: '#EF4444', marginTop: 4 }}>
                  {lang === 'de' ? 'Passwörter stimmen nicht überein' : 'Passwords do not match'}
                </FieldHint>
              )}
            </Field>

            <Btn
              $variant="primary"
              onClick={handlePasswordChange}
              disabled={pwLoading || !pwNew || pwNew !== pwRepeat}
            >
              {pwLoading ? t(lang, 'saving') : t(lang, 'set.save_password')}
            </Btn>
          </SectionBody>
            </Section>

            <Section>
          <SectionHead>
            <div>
              <SectionTitle style={{ color: '#EF4444' }}>Danger Zone</SectionTitle>
              <SectionSub>Irreversible Aktionen</SectionSub>
            </div>
          </SectionHead>
          <SectionBody>
            <DangerZone>
              <DangerTitle>{t(lang, 'set.delete_account')}</DangerTitle>
              <DangerText>
                {t(lang, 'set.delete_account_sub')}
                {t(lang, 'set.delete_cancel_first')}
              </DangerText>
              <Btn $variant="danger" onClick={() => setDeleteConfirm(true)}>
                {t(lang, 'set.delete_account')}
              </Btn>
            </DangerZone>
          </SectionBody>
            </Section>
          </>
        )}
      </Main>
    </Layout>

      {portalLoading && (
        <PortalOverlay>
          <PortalSpinner />
          <PortalLoadingText>
            {lang === 'de' ? 'Billing-Portal wird geöffnet…' : 'Opening billing portal…'}
          </PortalLoadingText>
        </PortalOverlay>
      )}

      {showPropertyModal && (
        <PropertySelectModal
          user={user}
          plan={profile?.plan || 'free'}
          activeCount={properties.length}
          onDone={() => {
            setShowPropertyModal(false);
            loadData();
            showAlert(lang === 'de'
              ? '🎉 Geschafft! Jetzt zurücklehnen und auf den 1. warten – dein Report kommt automatisch.'
              : '🎉 Done! Sit back and wait for the 1st – your report will arrive automatically.', 'success');
          }}
          onNewAccount={() => { setShowPropertyModal(false); startOAuth(); }}
        />
      )}
    </>
  );
}
