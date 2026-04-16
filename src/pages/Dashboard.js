import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import t from '../lib/i18n';
import PropertySelectModal from '../components/PropertySelectModal';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ── Plan limits ────────────────────────────────────────────────────────────────
// Property limit now comes from profiles.property_limit

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
  @media (max-width: 480px) { padding: 0 0.75rem; }
  top: 0;
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

const UserEmail = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  @media (max-width: 600px) { display: none; }
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
  @media (max-width: 480px) { font-size: 0.6875rem; padding: 0.2rem 0.375rem; }
`;

const BtnSettings = styled(Link)`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  &:hover { color: ${({ theme }) => theme.colors.text}; border-color: ${({ theme }) => theme.colors.borderLight}; }
  @media (max-width: 480px) { padding: 0.375rem 0.5rem; font-size: 0; &::before { content: '⚙'; font-size: 1rem; } }
`;

const BtnSupport = styled.button`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; border-color: ${({ theme }) => theme.colors.borderLight}; }
  @media (max-width: 480px) { padding: 0.375rem 0.5rem; font-size: 0; &::before { content: '?'; font-size: 1rem; font-weight: 700; } }
`;

const SupportOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
`;

const SupportBox = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem; max-width: 520px; width: 100%;
`;

const SupportTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem; font-weight: 800; letter-spacing: -.03em; margin-bottom: .375rem;
`;

const SupportSub = styled.p`
  font-size: .875rem; color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300; margin-bottom: 1.25rem; line-height: 1.6;
`;

const SupportField = styled.div`margin-bottom: 1rem;`;

const SupportLabel = styled.div`
  font-size: .8rem; font-weight: 600; color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: .375rem;
`;

const SupportSelect = styled.select`
  width: 100%; padding: .625rem .875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text}; font-size: .9375rem; outline: none;
`;

const SupportInput = styled.input`
  width: 100%; padding: .625rem .875rem; box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text}; font-size: .9375rem; outline: none;
  transition: border-color .2s;
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const SupportTextarea = styled.textarea`
  width: 100%; padding: .625rem .875rem; box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text}; font-size: .9375rem; outline: none;
  resize: vertical; min-height: 120px; font-family: inherit; line-height: 1.6;
  transition: border-color .2s;
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const Main = styled.main`
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  animation: ${fadeUp} 0.4s ease both;
  @media (max-width: 480px) { padding: 1.25rem 1rem; }
`;

// ── Alerts ────────────────────────────────────────────────────────────────────
const Alert = styled.div`
  padding: 0.875rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.successDim :
    $type === 'error' ? 'rgba(248,113,113,0.1)' :
    theme.colors.accentDim};
  border: 1px solid ${({ $type, theme }) =>
    $type === 'success' ? 'rgba(52,211,153,0.2)' :
    $type === 'error' ? 'rgba(248,113,113,0.2)' :
    'rgba(108,99,255,0.2)'};
  color: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success :
    $type === 'error' ? theme.colors.danger :
    theme.colors.accent};
`;

// ── Connect Banner ────────────────────────────────────────────────────────────
const ConnectBanner = styled.div`
  background: linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(99,207,255,0.05) 100%);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 480px) { flex-direction: column; padding: 1.25rem; }
`;

const ConnectText = styled.div`
  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.375rem;
  }
  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 300;
  }
`;

const BtnConnect = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { background: ${({ theme }) => theme.colors.accentHover}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108,99,255,0.4); }
  svg { width: 16px; height: 16px; }
  @media (max-width: 480px) { width: 100%; justify-content: center; }
`;

// ── Trial Upgrade Banner (Plan-Picker) ────────────────────────────────────────
const TrialUpgradeBanner = styled.div`
  background: linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(99,207,255,0.04) 100%);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TrialUpgradeTop = styled.div`
  margin-bottom: 1.5rem;
`;

const TrialUpgradeTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.375rem;
`;

const TrialUpgradeSub = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
`;

const TrialPlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

const TrialPlanCard = styled.div`
  background: ${({ theme, $highlight }) => $highlight ? theme.colors.accent : theme.colors.bgCard};
  border: 1px solid ${({ theme, $highlight }) => $highlight ? 'transparent' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  transform: ${({ $highlight }) => $highlight ? 'scale(1.03)' : 'none'};
`;

const TrialPlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  text-transform: uppercase;
  white-space: nowrap;
`;

// ── Frozen Wall ───────────────────────────────────────────────────────────────
const FrozenWall = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem 4rem;
  text-align: center;
  animation: ${fadeUp} 0.4s ease both;
`;

const FrozenIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.25rem;
`;

const FrozenTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
`;

const FrozenSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  max-width: 460px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  width: 100%;
  max-width: 820px;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

const PlanCard = styled.div`
  background: ${({ theme, $highlight }) => $highlight ? theme.colors.accent : theme.colors.bgCard};
  border: 1px solid ${({ theme, $highlight }) => $highlight ? 'transparent' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  transform: ${({ $highlight }) => $highlight ? 'scale(1.03)' : 'none'};
`;

const PlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  text-transform: uppercase;
`;

const PlanName = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme, $highlight }) => $highlight ? 'rgba(255,255,255,0.7)' : theme.colors.textDim};
`;

const PlanPrice = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: ${({ $highlight }) => $highlight ? '#fff' : 'inherit'};
  span { font-size: 1rem; font-weight: 400; opacity: 0.6; }
`;

const PlanFeature = styled.div`
  font-size: 0.8125rem;
  color: ${({ $highlight }) => $highlight ? 'rgba(255,255,255,0.85)' : 'inherit'};
  font-weight: 300;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  &::before { content: '✓'; font-weight: 700; opacity: 0.8; }
`;

const PlanBtn = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: ${({ $highlight }) => $highlight ? '#fff' : 'transparent'};
  color: ${({ theme, $highlight }) => $highlight ? theme.colors.accent : theme.colors.accent};
  border: ${({ $highlight }) => $highlight ? 'none' : '1px solid currentColor'};
  &:hover { opacity: 0.85; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;


// ── Upsell Banner ─────────────────────────────────────────────────────────────
const UpgradeHint = styled.div`
  background: linear-gradient(135deg, rgba(108,99,255,0.06) 0%, rgba(99,207,255,0.04) 100%);
  border: 1px solid rgba(108,99,255,0.18);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const UpgradeHintText = styled.div`
  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.9375rem;
    font-weight: 700;
    margin-bottom: 0.375rem;
  }
  p { font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textMuted}; font-weight: 300; line-height: 1.5; }
  ul { margin: 0.5rem 0 0 0; padding: 0; list-style: none; }
  ul li { font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textMuted}; font-weight: 300; display: flex; align-items: center; gap: 0.375rem; }
  ul li::before { content: '→'; color: ${({ theme }) => theme.colors.accent}; font-size: 0.75rem; }
`;

const UpgradeHintBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700; font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff; border: none; cursor: pointer;
  transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  &:hover { background: ${({ theme }) => theme.colors.accentHover}; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(108,99,255,0.3); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

// ── Data Explained ─────────────────────────────────────────────────────────────
const DataExplainCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.25rem;
  margin-top: 1rem;
`;

const DataExplainTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDim};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
`;

const DataExplainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const DataExplainItem = styled.div`
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
`;

const DataExplainIcon = styled.div`
  width: 28px; height: 28px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) => $color || 'rgba(108,99,255,0.1)'};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.875rem; flex-shrink: 0;
`;

const DataExplainBody = styled.div`
  strong { font-size: 0.8125rem; font-weight: 600; color: ${({ theme }) => theme.colors.text}; display: block; margin-bottom: 0.125rem; }
  span { font-size: 0.75rem; color: ${({ theme }) => theme.colors.textMuted}; font-weight: 300; line-height: 1.4; }
`;

// ── Section ───────────────────────────────────────────────────────────────────
const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

// ── Properties ────────────────────────────────────────────────────────────────
const PropertyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

const PropertyCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $active, theme }) => $active ? 'rgba(108,99,255,0.4)' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: border-color 0.2s;
  box-shadow: ${({ $active }) => $active ? '0 0 0 2px rgba(108,99,255,0.08)' : 'none'};
`;

const PropertyHeader = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: pointer;
  &:hover { background: rgba(108,99,255,0.03); }
  @media (max-width: 480px) { padding: 1rem; }
`;

const PropertyChevron = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
  transition: transform 0.2s;
  display: inline-block;
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const PropertyBody = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem;
  @media (max-width: 480px) { padding: 1rem; }
`;

const ReauthBadge = styled.button`
  font-size: 0.72rem;
  font-weight: 600;
  color: #F59E0B;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover { background: rgba(245,158,11,0.2); }
`;

// ── Recipient Email ───────────────────────────────────────────────────────────
const RecipientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;
const RecipientLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;
const RecipientInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;
  &:focus { outline: none; border-color: rgba(108,99,255,0.4); }
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; }
`;
const RecipientSaveBtn = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  transition: all 0.2s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  &:hover { background: ${({ theme }) => theme.colors.accentHover}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const RecipientHint = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

// ── Report History ────────────────────────────────────────────────────────────
const ReportHistoryTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textDim};
  margin-bottom: 0.875rem;
`;
const ReportHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;
const ReportHistoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) => $active ? theme.colors.accentDim : theme.colors.bg};
  border: 1px solid ${({ $active }) => $active ? 'rgba(108,99,255,0.2)' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;
  gap: 1rem;
  &:hover { background: ${({ theme }) => theme.colors.accentDim}; }
`;
const ReportHistoryMonth = styled.div`
  font-size: 0.875rem;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text};
`;
const ReportHistoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const ReportHistoryClicks = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-family: ${({ theme }) => theme.fonts.mono};
`;
const NoPdfBadge = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textDim};
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// ── Add Property Row ──────────────────────────────────────────────────────────
const AddPropertyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.75rem;
  flex-wrap: wrap;
  @media (max-width: 480px) { flex-direction: column; align-items: stretch; }
`;
const PropertyCountBadge = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
`;

const GoogleAccountsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const GoogleAccountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
  background: rgba(108,99,255,0.08);
  border: 1px solid rgba(108,99,255,0.2);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 500;
`;

// ── Upgrade Modal ─────────────────────────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease;
`;
const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  animation: ${fadeUp} 0.25s ease;
`;
const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`;
const ModalSub = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  margin-bottom: 1.75rem;
  line-height: 1.6;
`;
const ModalClose = styled.button`
  float: right;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textDim};
  margin-top: -0.25rem;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const SpinnerSm = styled.div`
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const PropertyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

const PropertyDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $status, theme }) => $status === 'active' ? theme.colors.success : theme.colors.danger};
  box-shadow: 0 0 8px ${({ $status, theme }) => $status === 'active' ? theme.colors.success : theme.colors.danger};
  flex-shrink: 0;
`;

const PropertyName = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const PropertyUrl = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const PropertyMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
  text-align: right;
`;

// ── KPI Grid ──────────────────────────────────────────────────────────────────
const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 700px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { gap: 0.5rem; }
`;

const KpiCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  @media (max-width: 480px) { padding: 0.875rem 0.75rem; }
`;

const KpiLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
`;

const KpiValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
  margin-bottom: 0.375rem;
  @media (max-width: 480px) { font-size: 1.375rem; }
`;

const KpiDelta = styled.div`
  font-size: 0.75rem;
  color: ${({ $up, theme }) => $up ? theme.colors.success : theme.colors.danger};
  &::before { content: '${({ $up }) => $up ? '▲' : '▼'} '; }
`;

const KpiEmpty = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300;
`;

// ── Summary ───────────────────────────────────────────────────────────────────
const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

// ── Market Radar ─────────────────────────────────────────────────────────────
const RadarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
  @media (max-width: 480px) { gap: 0.625rem; }
`;
const RadarCard = styled.div`
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  border: 1px solid ${({ $type }) =>
    $type === 'revier'   ? 'rgba(16,185,129,0.2)' :
    $type === 'angriff'  ? 'rgba(108,99,255,0.2)' : 'rgba(245,158,11,0.2)'};
  background: ${({ theme }) => theme.colors.bgCard};
`;
const RadarHeader = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  display: flex; align-items: center; gap: 0.5rem;
  background: ${({ $type }) =>
    $type === 'revier'   ? 'rgba(16,185,129,0.08)' :
    $type === 'angriff'  ? 'rgba(108,99,255,0.08)' : 'rgba(245,158,11,0.08)'};
  color: ${({ $type }) =>
    $type === 'revier'   ? '#10B981' :
    $type === 'angriff'  ? '#6C63FF' : '#F59E0B'};
  border-bottom: 1px solid ${({ $type }) =>
    $type === 'revier'   ? 'rgba(16,185,129,0.15)' :
    $type === 'angriff'  ? 'rgba(108,99,255,0.15)' : 'rgba(245,158,11,0.15)'};
`;
const RadarRow = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
`;
const RadarKeyword = styled.div`
  font-size: 0.8125rem; font-weight: 500; color: ${({ theme }) => theme.colors.text};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 0.125rem;
`;
const RadarMeta = styled.div`
  font-size: 0.75rem; color: ${({ theme }) => theme.colors.textDim}; font-weight: 300;
  font-family: ${({ theme }) => theme.fonts.mono};
`;
const RadarEmpty = styled.div`
  padding: 1rem; font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300; text-align: center;
`;

// ── Conversion Signal ────────────────────────────────────────────────────────
const ConvBox = styled.div`
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${({ $level }) =>
    $level === 'critical' ? 'rgba(239,68,68,0.3)' :
    $level === 'warning'  ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.2)'};
  background: ${({ $level }) =>
    $level === 'critical' ? 'rgba(239,68,68,0.06)' :
    $level === 'warning'  ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.05)'};
`;
const ConvTitle = styled.div`
  font-size: 0.9375rem; font-weight: 700; margin-bottom: 0.375rem;
  display: flex; align-items: center; gap: 0.5rem;
  color: ${({ $level, theme }) =>
    $level === 'critical' ? '#EF4444' :
    $level === 'warning'  ? '#F59E0B' : '#10B981'};
`;
const ConvText = styled.div`
  font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300; line-height: 1.7; margin-bottom: 0.75rem;
`;
const ConvTriggers = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.75rem;
`;
const ConvTrigger = styled.span`
  font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.625rem;
  border-radius: 99px;
  background: rgba(108,99,255,0.1); color: #6C63FF;
  border: 1px solid rgba(108,99,255,0.2);
`;

// ── Recommendations ───────────────────────────────────────────────────────────
const RecGrid = styled.div`
  display: flex; flex-direction: column; gap: 0.625rem; margin-bottom: 1.5rem;
`;
const RecCard = styled.div`
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.25rem;
  border-left: 3px solid ${({ $cat }) =>
    $cat === 'quick_win' ? '#10B981' :
    $cat === 'growth'    ? '#6C63FF' : '#EF4444'};
  background: ${({ $cat }) =>
    $cat === 'quick_win' ? 'rgba(16,185,129,0.06)' :
    $cat === 'growth'    ? 'rgba(108,99,255,0.06)' : 'rgba(239,68,68,0.06)'};
  border-top: 1px solid ${({ $cat }) =>
    $cat === 'quick_win' ? 'rgba(16,185,129,0.15)' :
    $cat === 'growth'    ? 'rgba(108,99,255,0.15)' : 'rgba(239,68,68,0.15)'};
  border-right: 1px solid ${({ $cat }) =>
    $cat === 'quick_win' ? 'rgba(16,185,129,0.15)' :
    $cat === 'growth'    ? 'rgba(108,99,255,0.15)' : 'rgba(239,68,68,0.15)'};
  border-bottom: 1px solid ${({ $cat }) =>
    $cat === 'quick_win' ? 'rgba(16,185,129,0.15)' :
    $cat === 'growth'    ? 'rgba(108,99,255,0.15)' : 'rgba(239,68,68,0.15)'};
`;
const RecBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.375rem;
  font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: 0.375rem;
  color: ${({ $cat }) =>
    $cat === 'quick_win' ? '#10B981' :
    $cat === 'growth'    ? '#6C63FF' : '#EF4444'};
`;
const RecTitle = styled.div`
  font-size: 0.9375rem; font-weight: 700; color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.375rem;
`;
const RecText = styled.div`
  font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300; line-height: 1.6;
`;

const SummaryText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
  font-weight: 300;
`;

const SummaryEmpty = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// ── Tables ────────────────────────────────────────────────────────────────────
const TableGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
  @media (max-width: 480px) { gap: 0.75rem; }
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 1rem;
  &:last-child { border-bottom: none; }
`;

const TableLabel = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
  @media (max-width: 480px) { max-width: 120px; font-size: 0.75rem; }
`;

const TableVal = styled.div`
  font-size: 0.8125rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const TableEmpty = styled.div`
  padding: 1.5rem 1.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300;
`;

// ── Empty / Loading ───────────────────────────────────────────────────────────
const EmptyState = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 3rem;
  text-align: center;
`;

const EmptyIcon = styled.div` font-size: 2.5rem; margin-bottom: 1rem; `;
const EmptyTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;
`;
const EmptyText = styled.p`
  font-size: 0.875rem; color: ${({ theme }) => theme.colors.textMuted}; font-weight: 300;
`;

const Spinner = styled.div`
  width: 20px; height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 3rem auto;
`;

const ReportPeriod = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  margin-bottom: 1.5rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ReportPeriodLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const DownloadBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.display};
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(108,99,255,0.25);
  padding: 0.3rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover {
    background: rgba(108,99,255,0.18);
    border-color: rgba(108,99,255,0.4);
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null) return '–';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function fmtPct(n) {
  if (n == null) return '–';
  return (n * 100).toFixed(2) + '%';
}

function fmtPos(n) {
  if (n == null) return '–';
  return n.toFixed(1);
}

// ── Frozen Wall Component ─────────────────────────────────────────────────────
// ── Property Configurator (shared between FrozenWall + UpgradeModal) ─────────
function PropertyConfigurator({ onCheckout, upgrading, lang = 'de' }) {
  const isDE = lang === 'de';
  const [targetProps, setTargetProps] = React.useState(1);
  const [whiteLabel, setWhiteLabel] = React.useState(false);

  // Calculate cheapest package combination
  function calcPackages(extraProps) {
    const pkgs = [];
    let remaining = extraProps;
    while (remaining >= 10) { pkgs.push('prop_10'); remaining -= 10; }
    if (remaining >= 5) { pkgs.push('prop_5'); remaining -= 5; }
    if (remaining >= 1) { pkgs.push('prop_3'); remaining -= 3; remaining = Math.max(0, remaining); }
    // Check if 3er is overkill for last step
    return pkgs;
  }

  function calcPrice(props, wl) {
    const extra = Math.max(0, props - 1);
    let cost = 19;
    let remaining = extra;
    while (remaining >= 10) { cost += 50; remaining -= 10; }
    if (remaining >= 5) { cost += 30; remaining -= 5; }
    if (remaining >= 1) { cost += 24; remaining = 0; }
    if (wl) cost += 5;
    return cost;
  }

  // Optimal suggestion
  function optimalPath(props) {
    const extra = Math.max(0, props - 1);
    const parts = [];
    let rem = extra;
    let total = 19;
    while (rem >= 10) { parts.push(isDE ? '+10 Properties (€50)' : '+10 properties (€50)'); total += 50; rem -= 10; }
    if (rem >= 5) { parts.push(isDE ? '+5 Properties (€30)' : '+5 properties (€30)'); total += 30; rem -= 5; }
    if (rem >= 1) { parts.push(isDE ? '+3 Properties (€24)' : '+3 properties (€24)'); total += 24; rem = 0; }
    return parts;
  }

  const totalPrice = calcPrice(targetProps, whiteLabel);
  const packages = calcPackages(Math.max(0, targetProps - 1));
  if (whiteLabel) packages.push('whitelabel');
  const pathParts = optimalPath(targetProps);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ background: 'var(--color-bg-card, #fff)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 16, padding: '1.5rem' }}>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted, #888)', marginBottom: 8 }}>
            {isDE ? 'Wie viele Properties?' : 'How many properties?'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setTargetProps(p => Math.max(1, p-1))}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(108,99,255,0.3)', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF' }}>−</button>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C1C2E', minWidth: 40, textAlign: 'center' }}>{targetProps}</div>
            <button onClick={() => setTargetProps(p => p+1)}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(108,99,255,0.3)', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF' }}>+</button>
            <input type="range" min="1" max="30" value={targetProps} onChange={e => setTargetProps(+e.target.value)}
              style={{ flex: 1, accentColor: '#6C63FF' }} />
          </div>
        </div>

        {pathParts.length > 0 && (
          <div style={{ background: 'rgba(108,99,255,0.05)', borderRadius: 8, padding: '8px 12px', marginBottom: '1rem', fontSize: '0.75rem', color: '#5A5A78' }}>
            <span style={{ fontWeight: 700, color: '#6C63FF' }}>{isDE ? 'Günstigste Kombination: ' : 'Optimal: '}</span>
            {isDE ? 'Basis' : 'Base'} + {pathParts.join(' + ')}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(108,99,255,0.05)', borderRadius: 8, marginBottom: '1.25rem', cursor: 'pointer' }}
          onClick={() => setWhiteLabel(w => !w)}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1C2E' }}>
              White-Label <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#888' }}>+€5/Monat</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888' }}>
              {isDE ? 'Eigenes Logo, kein RankBrief-Branding' : 'Your logo, no RankBrief branding'}
            </div>
          </div>
          <div style={{ width: 36, height: 20, borderRadius: 10, background: whiteLabel ? '#6C63FF' : '#E0E0E8', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#fff', position: 'absolute', top: 2, left: whiteLabel ? 18 : 2, transition: 'left 0.2s' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '1rem' }}>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1C1C2E', letterSpacing: '-0.05em' }}>€{totalPrice}</div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>{isDE ? '/Monat' : '/month'}</div>
          {targetProps > 1 && <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, marginLeft: 4 }}>
            {isDE ? `(€${(totalPrice/targetProps).toFixed(2)} pro Property)` : `(€${(totalPrice/targetProps).toFixed(2)} per property)`}
          </div>}
        </div>

        <button
          onClick={() => onCheckout(packages)}
          disabled={upgrading}
          style={{ width: '100%', padding: '12px', background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.95rem', fontWeight: 700, cursor: upgrading ? 'not-allowed' : 'pointer', opacity: upgrading ? 0.7 : 1 }}>
          {upgrading ? (isDE ? 'Wird geladen...' : 'Loading...') : (isDE ? `Jetzt starten — €${totalPrice}/Monat →` : `Get started — €${totalPrice}/month →`)}
        </button>
        <div style={{ fontSize: '0.70rem', color: '#A0A0BC', textAlign: 'center', marginTop: 8 }}>
          {isDE ? '1 Monat kostenlos testen · Danach automatische Verlängerung · Jederzeit kündbar' : '1 month free trial · Then auto-renews · Cancel anytime'}
        </div>
      </div>
    </div>
  );
}

function FrozenWallView({ onUpgrade, upgrading, lang = 'de' }) {
  const isDE = lang === 'de';
  return (
    <FrozenWall>
      <FrozenIcon>⏸️</FrozenIcon>
      <FrozenTitle>{isDE ? 'Dein kostenloser Monat ist abgelaufen' : 'Your free month has ended'}</FrozenTitle>
      <FrozenSubtitle>
        {isDE ? 'Wähle dein Paket und starte direkt weiter. Deine Daten sind sicher gespeichert.' : 'Choose your plan and continue. Your data is safe.'}
      </FrozenSubtitle>
      <div style={{ marginBottom: '1.5rem', padding: '12px 16px', background: 'rgba(108,99,255,0.06)', borderRadius: 10, textAlign: 'center', fontSize: '0.82rem', color: '#5A5A78' }}>
        ✓ {isDE ? 'Voller Report mit KI, Markt-Radar & Empfehlungen' : 'Full report with AI, market radar & recommendations'} &nbsp;·&nbsp;
        ✓ {isDE ? 'GA4-Integration' : 'GA4 integration'} &nbsp;·&nbsp;
        ✓ {isDE ? 'Automatischer Versand' : 'Automatic delivery'}
      </div>
      <PropertyConfigurator onCheckout={onUpgrade} upgrading={upgrading} lang={lang} />
    </FrozenWall>
  );
}

function fmtMonth(dateStr) {
  return new Date(dateStr).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
}

// ── UpgradeModal ──────────────────────────────────────────────────────────────
function UpgradeModal({ currentPlan, onUpgrade, onClose, upgrading, lang = 'de' }) {
  const isDE = lang === 'de';
  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalClose onClick={onClose}>✕</ModalClose>
        <ModalTitle>{isDE ? 'Mehr Properties hinzufügen' : 'Add more properties'}</ModalTitle>
        <ModalSub>
          {isDE
            ? 'Du hast das Property-Limit erreicht. Wähle wie viele weitere Websites du verwalten möchtest.'
            : "You've reached your property limit. Choose how many more websites you'd like to manage."}
        </ModalSub>
        <PropertyConfigurator onCheckout={(pkgs) => { onUpgrade(pkgs); onClose(); }} upgrading={upgrading} lang={lang} />
      </ModalBox>
    </ModalOverlay>
  );
}

// ── PropertyItem (expandable) ─────────────────────────────────────────────────
function PropertyItem({ property, isAgency, plan, lang = 'de', onReauth }) {
  const [open, setOpen]                       = useState(false);
  const [reports, setReports]                 = useState([]);
  const [reportsLoading, setReportsLoading]   = useState(false);
  const [selectedReport, setSelectedReport]   = useState(null);
  const [keywords, setKeywords]               = useState([]);
  const [pages, setPages]                     = useState([]);
  const [detailLoading, setDetailLoading]     = useState(false);
  const [recipientEmail, setRecipientEmail]   = useState(property.recipient_email || '');
  const [savingEmail, setSavingEmail]         = useState(false);
  const [emailSaved, setEmailSaved]           = useState(false);
  const loaded = React.useRef(false);

  const loadReports = async () => {
    if (loaded.current) return;
    loaded.current = true;
    setReportsLoading(true);
    const { data } = await supabase
      .from('reports')
      .select('id, report_month, clicks, pdf_url, status')
      .eq('property_id', property.id)
      .eq('status', 'done')
      .order('report_month', { ascending: false })
      .limit(12);
    const rows = data ?? [];
    setReports(rows);
    if (rows.length > 0) loadReportDetail(rows[0]);
    setReportsLoading(false);
  };

  const loadReportDetail = async (report) => {
    setDetailLoading(true);
    setSelectedReport(report);
    const [{ data: full }, { data: kw }, { data: pg }] = await Promise.all([
      supabase.from('reports').select('*').eq('id', report.id).single(),
      supabase.from('report_keywords').select('*').eq('report_id', report.id).order('rank'),
      supabase.from('report_pages').select('*').eq('report_id', report.id).order('rank'),
    ]);
    setSelectedReport(full ?? report);
    setKeywords(kw ?? []);
    setPages(pg ?? []);
    setDetailLoading(false);
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadReports();
  };

  const handleSaveEmail = async () => {
    setSavingEmail(true);
    await supabase.from('properties').update({ recipient_email: recipientEmail || null }).eq('id', property.id);
    setSavingEmail(false);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2500);
  };

  return (
    <PropertyCard $active={open}>
      <PropertyHeader onClick={handleToggle}>
        <PropertyInfo>
          <PropertyDot $status={property.status} />
          <div>
            <PropertyName>{property.display_name}</PropertyName>
            <PropertyUrl>{property.gsc_property_url}</PropertyUrl>
          </div>
        </PropertyInfo>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {(!property.refresh_token_encrypted) && (
            <ReauthBadge onClick={e => { e.stopPropagation(); onReauth && onReauth(); }}>
              ⚠️ {lang === 'de' ? 'Google-Konto neu verbinden →' : 'Reconnect Google account →'}
            </ReauthBadge>
          )}
          <PropertyMeta>Verbunden {new Date(property.created_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB')}</PropertyMeta>
          <PropertyChevron $open={open}>▾</PropertyChevron>
        </div>
      </PropertyHeader>

      {open && (
        <PropertyBody>
          {/* Endkunden-Email – nur Agency */}
          {isAgency && (
            <>
              <RecipientRow>
                <RecipientLabel>📧 {lang === 'de' ? 'Endkunden-Email (optional):' : 'Client Email (optional):'}</RecipientLabel>
                <RecipientInput
                  type="email"
                  placeholder="kunde@beispiel.de"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                />
                <RecipientSaveBtn onClick={handleSaveEmail} disabled={savingEmail}>
                  {savingEmail ? <SpinnerSm /> : emailSaved ? (lang === 'de' ? '✓ Gespeichert' : '✓ Saved') : (lang === 'de' ? 'Speichern' : 'Save')}
                </RecipientSaveBtn>
              </RecipientRow>
              <RecipientHint>
                {lang === 'de'
                  ? 'Wenn gesetzt, bekommt der Endkunde den Report zusätzlich zu dir – mit deinem White-Label Branding als PDF-Anhang. Leer lassen = nur du bekommst den Report.'
                  : 'If set, your client receives the report in addition to you – with your white-label branding as a PDF attachment. Leave empty = only you receive the report.'}
              </RecipientHint>
            </>
          )}

          {/* Reauth Warning */}
          {!property.refresh_token_encrypted && (
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
                  ? 'RankBrief kann keine Daten von der Google Search Console abrufen, weil die Verbindung zu deinem Google-Konto abgelaufen oder unterbrochen ist. Das passiert, wenn du dein Google-Passwort geändert hast, die App-Berechtigungen widerrufen wurden oder die Verbindung zu lange inaktiv war. Bitte verbinde dein Konto erneut – der Vorgang dauert nur wenige Sekunden.'
                  : 'RankBrief cannot fetch data from Google Search Console because the connection to your Google account has expired or been interrupted. This can happen if you changed your Google password, revoked app permissions, or the connection was inactive for too long. Please reconnect – it only takes a few seconds.'}
              </div>
              <button
                onClick={onReauth}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: '#F59E0B',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '0.5rem 1.125rem',
                  cursor: 'pointer',
                }}
              >
                {lang === 'de' ? '🔗 Jetzt neu verbinden' : '🔗 Reconnect now'}
              </button>
            </div>
          )}

          {/* Report-Verlauf */}
          <ReportHistoryTitle>{lang === 'de' ? 'Report-Verlauf' : 'Report History'}</ReportHistoryTitle>
          {reportsLoading ? (
            <Spinner />
          ) : reports.length === 0 ? (
            property?.last_no_data_at ? (
              <div style={{
                padding:'1rem',
                borderRadius:'8px',
                background:'rgba(245,158,11,0.07)',
                borderLeft:'3px solid #F59E0B',
                border:'1px solid rgba(245,158,11,0.15)',
                borderLeft:'3px solid #F59E0B',
              }}>
                <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#d97706', marginBottom:'0.375rem' }}>
                  ⚠️ {lang === 'en' ? 'No GSC data available yet' : 'Noch keine GSC-Daten verfügbar'}
                </div>
                <div style={{ fontSize:'0.8125rem', color:'#92400e', lineHeight:1.6 }}>
                  {lang === 'en'
                    ? `Google Search Console hasn't collected data for this domain yet. New domains typically need 2–4 weeks. You'll receive an email automatically once your first report is ready.`
                    : `Google Search Console hat für diese Domain noch keine Daten gesammelt. Neue Domains benötigen 2–4 Wochen. Du erhältst automatisch eine E-Mail sobald der erste Report verfügbar ist.`}
                </div>
              </div>
            ) : (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <EmptyTitle>Noch kein Report vorhanden</EmptyTitle>
              <EmptyText>{t(lang, 'dash.first_report')}</EmptyText>
            </EmptyState>
            )
          ) : (
            <>
              <ReportHistoryList>
                {reports.map(r => (
                  <ReportHistoryRow
                    key={r.id}
                    $active={selectedReport?.id === r.id}
                    onClick={() => loadReportDetail(r)}
                  >
                    <ReportHistoryMonth $active={selectedReport?.id === r.id}>
                      {fmtMonth(r.report_month)}
                    </ReportHistoryMonth>
                    <ReportHistoryMeta>
                      <ReportHistoryClicks>{fmt(r.clicks)} {lang === 'de' ? 'Klicks' : 'clicks'}</ReportHistoryClicks>
                      {r.pdf_url
                        ? <DownloadBtn href={r.pdf_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                            ↓ PDF
                          </DownloadBtn>
                        : <NoPdfBadge>{lang === 'de' ? 'kein PDF' : 'no PDF'}</NoPdfBadge>}
                    </ReportHistoryMeta>
                  </ReportHistoryRow>
                ))}
              </ReportHistoryList>

              {/* Detail des ausgewählten Reports */}
              {detailLoading ? (
                <Spinner />
              ) : selectedReport && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.25rem', fontFamily: 'monospace' }}>
                    {lang === 'de' ? 'Details:' : 'Details:'} {fmtMonth(selectedReport.report_month)}
                  </div>
                  <KpiGrid>
                    <KpiCard>
                      <KpiLabel>Clicks</KpiLabel>
                      <KpiValue>{fmt(selectedReport.clicks)}</KpiValue>
                      {selectedReport.clicks_delta != null
                        ? <KpiDelta $up={selectedReport.clicks_delta >= 0}>{Math.abs(selectedReport.clicks_delta).toFixed(1)}% {lang === 'de' ? 'ggü. Vormonat' : 'vs. prev. month'}</KpiDelta>
                        : <KpiEmpty>{lang === 'de' ? 'Kein Vergleich' : 'No comparison'}</KpiEmpty>}
                    </KpiCard>
                    <KpiCard>
                      <KpiLabel>{lang === 'de' ? 'Impressionen' : 'Impressions'}</KpiLabel>
                      <KpiValue>{fmt(selectedReport.impressions)}</KpiValue>
                      {selectedReport.impressions_delta != null
                        ? <KpiDelta $up={selectedReport.impressions_delta >= 0}>{Math.abs(selectedReport.impressions_delta).toFixed(1)}%</KpiDelta>
                        : <KpiEmpty>{lang === 'de' ? 'Kein Vergleich' : 'No comparison'}</KpiEmpty>}
                    </KpiCard>
                    <KpiCard>
                      <KpiLabel>Ø CTR</KpiLabel>
                      <KpiValue>{fmtPct(selectedReport.ctr)}</KpiValue>
                      {selectedReport.ctr_delta != null
                        ? <KpiDelta $up={selectedReport.ctr_delta >= 0}>{Math.abs(selectedReport.ctr_delta).toFixed(2)}%</KpiDelta>
                        : <KpiEmpty>{lang === 'de' ? 'Kein Vergleich' : 'No comparison'}</KpiEmpty>}
                    </KpiCard>
                    <KpiCard>
                      <KpiLabel>{lang === 'de' ? 'Ø Position' : 'Avg. Position'}</KpiLabel>
                      <KpiValue>{fmtPos(selectedReport.avg_position)}</KpiValue>
                      {selectedReport.position_delta != null
                        ? <KpiDelta $up={selectedReport.position_delta <= 0}>{Math.abs(selectedReport.position_delta).toFixed(1)}</KpiDelta>
                        : <KpiEmpty>{lang === 'de' ? 'Kein Vergleich' : 'No comparison'}</KpiEmpty>}
                    </KpiCard>
                  </KpiGrid>

                  {plan === 'basic' && (
                    <UpgradeHint>
                      <UpgradeHintText>
                        <h3>{lang === 'de' ? '🚀 Mit Pro bekommst du noch mehr' : '🚀 Get even more with Pro'}</h3>
                        <ul>
                          <li><strong>3 Domains:</strong> {lang === 'de' ? 'Mehrere Websites in einem Account verwalten' : 'Manage multiple websites in one account'}</li>
                          <li><strong>{t(lang, 'dash.seo_recs')}</strong> {t(lang, 'dash.seo_recs_sub')}</li>
                          <li><strong>White-Label Reports:</strong> {lang === 'de' ? 'Reports mit eigenem Logo und Branding' : 'Reports with your own logo and branding'}</li>
                        </ul>
                      </UpgradeHintText>
                    </UpgradeHint>
                  )}

                  {['basic', 'pro', 'agency'].includes(plan) && (
                    <>
                      <SectionTitle>{lang === 'de' ? 'KI-Zusammenfassung' : 'AI Summary'}</SectionTitle>
                      <SummaryCard>
                        {selectedReport.summary_text
                          ? <SummaryText>{selectedReport.summary_text}</SummaryText>
                          : <SummaryEmpty>{t(lang, 'dash.no_summary')}</SummaryEmpty>}
                      </SummaryCard>
                    </>
                  )}

                  {/* Conversion-Signal – wenn GA4-Daten vorhanden */}
                  {selectedReport.conversion_signal && (
                    (() => {
                      const cs = selectedReport.conversion_signal;
                      const isGood = cs.level === 'good';
                      const triggers = lang === 'de'
                        ? { critical: ['Trust-Badges', 'Kundenbewertungen', 'Klare Preisangaben', 'Garantie-Siegel', 'Live-Chat', 'Verknappung'], warning: ['Social Proof', 'FAQ-Sektion', 'Klarer Call-to-Action', 'Ladezeit optimieren', 'Mobile UX prüfen'], good: [] }[cs.level]
                        : { critical: ['Trust badges', 'Customer reviews', 'Clear pricing', 'Money-back guarantee', 'Live chat', 'Scarcity signals'], warning: ['Social proof', 'FAQ section', 'Clear CTA', 'Page speed', 'Mobile UX'], good: [] }[cs.level];
                      const icon = cs.level === 'critical' ? '🚨' : cs.level === 'warning' ? '⚠️' : '✅';
                      const title = lang === 'de'
                        ? cs.level === 'critical' ? `${icon} Conversion-Alarm: ${cs.engagement_rate}% Engagement Rate`
                          : cs.level === 'warning' ? `${icon} Verbesserungspotenzial: ${cs.engagement_rate}% Engagement Rate`
                          : `${icon} Gute Conversion-Basis: ${cs.engagement_rate}% Engagement Rate`
                        : cs.level === 'critical' ? `${icon} Conversion Alert: ${cs.engagement_rate}% Engagement Rate`
                          : cs.level === 'warning' ? `${icon} Room for Improvement: ${cs.engagement_rate}% Engagement Rate`
                          : `${icon} Strong Engagement: ${cs.engagement_rate}% Engagement Rate`;
                      const body = lang === 'de'
                        ? cs.level === 'critical'
                          ? `Ihre Besucher finden die Seite, verlassen sie aber zu schnell. Bei ${cs.sessions?.toLocaleString('de-DE')} monatlichen Sessions${cs.trending_down ? ' – und die Engagement Rate sinkt weiter' : ''} verlieren Sie potenzielle Kunden bereits auf der Einstiegsseite. Psychologische Trigger können die Verweildauer deutlich erhöhen:`
                          : cs.level === 'warning'
                          ? `${cs.sessions?.toLocaleString('de-DE')} Sessions, aber die Engagement Rate liegt bei nur ${cs.engagement_rate}%${cs.trending_down ? ' und sinkt' : ''}. Besucher kommen – aber konvertieren noch nicht optimal. Diese Maßnahmen können helfen:`
                          : `Mit ${cs.engagement_rate}% Engagement Rate und ${cs.sessions?.toLocaleString('de-DE')} Sessions liegt Ihre Website über dem Branchenschnitt. Weiterhin auf Qualität achten.`
                        : cs.level === 'critical'
                          ? `Visitors find your site but leave too quickly. With ${cs.sessions?.toLocaleString('en-US')} monthly sessions${cs.trending_down ? ' and a declining trend' : ''}, you are losing potential customers at the entry point. Psychological triggers can significantly increase time on page:`
                          : cs.level === 'warning'
                          ? `${cs.sessions?.toLocaleString('en-US')} sessions, but engagement rate is only ${cs.engagement_rate}%${cs.trending_down ? ' and dropping' : ''}. Visitors arrive but aren't converting optimally yet. These tactics can help:`
                          : `With ${cs.engagement_rate}% engagement rate and ${cs.sessions?.toLocaleString('en-US')} sessions, your site is performing above average. Keep up the quality.`;
                      return (
                        <ConvBox $level={cs.level}>
                          <ConvTitle $level={cs.level}>{title}</ConvTitle>
                          <ConvText>{body}</ConvText>
                          {triggers?.length > 0 && (
                            <ConvTriggers>
                              {triggers.map((t, i) => <ConvTrigger key={i}>{t}</ConvTrigger>)}
                            </ConvTriggers>
                          )}
                        </ConvBox>
                      );
                    })()
                  )}

                  {/* Markt-Radar – für alle Pläne */}
                  {selectedReport.market_radar && (
                    <>
                      <SectionTitle>
                        {lang === 'de' ? '🎯 Markt-Radar' : '🎯 Market Radar'}
                      </SectionTitle>
                      <RadarGrid>
                        {/* Revier-Verteidigung */}
                        <RadarCard $type="revier">
                          <RadarHeader $type="revier">
                            🏆 {lang === 'de' ? 'Revier-Verteidigung' : 'Your Territory'}
                          </RadarHeader>
                          {selectedReport.market_radar.revier?.length > 0 ? (
                            selectedReport.market_radar.revier.map((k, i) => (
                              <RadarRow key={i}>
                                <RadarKeyword title={k.keyword}>{k.keyword}</RadarKeyword>
                                <RadarMeta>Pos. {k.position} · {k.clicks} {lang === 'de' ? 'Klicks' : 'clicks'} · {k.ctr}% CTR</RadarMeta>
                              </RadarRow>
                            ))
                          ) : (
                            <RadarEmpty>{lang === 'de' ? 'Noch keine Top-3 Keywords' : 'No top-3 keywords yet'}</RadarEmpty>
                          )}
                        </RadarCard>

                        {/* Angriffs-Modus */}
                        <RadarCard $type="angriff">
                          <RadarHeader $type="angriff">
                            ⚡ {lang === 'de' ? 'Angriffs-Modus' : 'Attack Mode'}
                          </RadarHeader>
                          {selectedReport.market_radar.angriff?.length > 0 ? (
                            selectedReport.market_radar.angriff.map((k, i) => (
                              <RadarRow key={i}>
                                <RadarKeyword title={k.keyword}>{k.keyword}</RadarKeyword>
                                <RadarMeta>Pos. {k.position} · {k.impressions} {lang === 'de' ? 'Einbl.' : 'impr.'} · {k.ctr}% CTR</RadarMeta>
                              </RadarRow>
                            ))
                          ) : (
                            <RadarEmpty>{lang === 'de' ? 'Keine Keywords auf Seite 1 unten' : 'No keywords in positions 4-10'}</RadarEmpty>
                          )}
                        </RadarCard>

                        {/* Potenzial-Wecker */}
                        <RadarCard $type="potenzial">
                          <RadarHeader $type="potenzial">
                            💤 {lang === 'de' ? 'Schlafende Riesen' : 'Sleeping Giants'}
                          </RadarHeader>
                          {selectedReport.market_radar.potenzial?.length > 0 ? (
                            selectedReport.market_radar.potenzial.map((k, i) => (
                              <RadarRow key={i}>
                                <RadarKeyword title={k.keyword}>{k.keyword}</RadarKeyword>
                                <RadarMeta>Pos. {k.position} · {k.impressions} {lang === 'de' ? 'Einbl.' : 'impr.'}</RadarMeta>
                              </RadarRow>
                            ))
                          ) : (
                            <RadarEmpty>{lang === 'de' ? 'Keine Keywords auf Seite 2' : 'No page-2 keywords'}</RadarEmpty>
                          )}
                        </RadarCard>
                      </RadarGrid>
                    </>
                  )}

                  {/* Business-Empfehlungen – nur Pro/Agency */}
                  {['pro', 'agency'].includes(plan) && selectedReport.recommendations?.length > 0 && (
                    <>
                      <SectionTitle>
                        {lang === 'de' ? '🎯 Strategische Empfehlungen' : '🎯 Strategic Recommendations'}
                      </SectionTitle>
                      <RecGrid>
                        {selectedReport.recommendations.map((rec, i) => {
                          const cat = rec.category || (i === 0 ? 'quick_win' : i === 1 ? 'growth' : 'risk');
                          const catLabel = lang === 'de'
                            ? { quick_win: '⚡ Quick Win', growth: '🚀 Strategisches Wachstum', risk: '⚠️ Risiko-Warnung' }[cat]
                            : { quick_win: '⚡ Quick Win', growth: '🚀 Strategic Growth', risk: '⚠️ Risk Warning' }[cat];
                          return (
                            <RecCard key={i} $cat={cat}>
                              <RecBadge $cat={cat}>{catLabel}</RecBadge>
                              <RecTitle>{rec.title}</RecTitle>
                              <RecText>{rec.text}</RecText>
                            </RecCard>
                          );
                        })}
                      </RecGrid>
                    </>
                  )}

                  <TableGrid>
                    <TableCard>
                      <TableHeader>Top Keywords</TableHeader>
                      {keywords.length > 0
                        ? keywords.map(k => (
                            <TableRow key={k.id}>
                              <TableLabel title={k.keyword}>{k.keyword}</TableLabel>
                              <TableVal>{k.clicks} {lang === 'de' ? 'Klicks' : 'clicks'}</TableVal>
                            </TableRow>
                          ))
                        : <TableEmpty>{lang === 'de' ? 'Keine Keyword-Daten.' : 'No keyword data.'}<br /><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: '#6C63FF' }}>{lang === 'de' ? 'GSC einrichten →' : 'Set up GSC →'}</a></TableEmpty>}
                    </TableCard>
                    <TableCard>
                      <TableHeader>{lang === 'de' ? 'Top Seiten' : 'Top Pages'}</TableHeader>
                      {pages.length > 0
                        ? pages.map(p => (
                            <TableRow key={p.id}>
                              <TableLabel title={p.page_url}>{p.page_url.replace(/^https?:\/\/[^/]+/, '') || '/'}</TableLabel>
                              <TableVal>{p.clicks} {lang === 'de' ? 'Klicks' : 'clicks'}</TableVal>
                            </TableRow>
                          ))
                        : <TableEmpty>{lang === 'de' ? 'Keine Seiten-Daten.' : 'No page data.'}<br /><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: '#6C63FF' }}>{lang === 'de' ? 'GSC einrichten →' : 'Set up GSC →'}</a></TableEmpty>}
                    </TableCard>
                  </TableGrid>

                  {['basic', 'pro', 'agency'].includes(plan) && (() => {
                    const noGa4Setup = !property.ga_property_id;
                    const ga4NoData  = property.ga_property_id && (selectedReport.sessions == null || selectedReport.sessions === 0);
                    if (noGa4Setup) return (
                      <Alert $type="info">
                        <span style={{ fontWeight: 600 }}>
                          {lang === 'de' ? '📊 Google Analytics nicht verbunden' : '📊 Google Analytics not connected'}
                        </span><br />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 300, lineHeight: 1.7, display: 'block', marginTop: '0.375rem' }}>
                          {lang === 'de' ? (
                            <>
                              Mit GA4 ergänzt RankBrief deinen Report um:<br />
                              → <strong>Sessions & Unique Visitors</strong> — wie viele Menschen kommen wirklich?<br />
                              → <strong>Engagement Rate</strong> — interagieren Besucher mit deiner Seite?<br />
                              → <strong>Business Impact</strong> — Leads und Umsatzpotenzial aus deinem Traffic<br />
                              <a href="/settings" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}>
                                Jetzt GA4 einrichten →
                              </a>
                            </>
                          ) : (
                            <>
                              With GA4, RankBrief adds to your report:<br />
                              → <strong>Sessions & Unique Visitors</strong> — how many people actually visit?<br />
                              → <strong>Engagement Rate</strong> — are visitors interacting with your site?<br />
                              → <strong>Business Impact</strong> — lead and revenue potential from your traffic<br />
                              <a href="/settings" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}>
                                Set up GA4 now →
                              </a>
                            </>
                          )}
                        </span>
                      </Alert>
                    );
                    if (ga4NoData) return (
                      <Alert $type="info">
                        <span style={{ fontWeight: 600 }}>
                          {lang === 'de' ? '⚠️ GA4-Daten nicht verfügbar' : '⚠️ GA4 data not available'}
                        </span><br />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 300 }}>
                          {lang === 'de'
                            ? `GA4 Property ID ${property.ga_property_id} ist hinterlegt, aber für diesen Monat liegen keine Daten vor. Bitte prüfe die ID in den `
                            : `GA4 Property ID ${property.ga_property_id} is configured, but no data is available for this month. Please verify the ID in `}
                          <a href="/settings" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}>
                            {lang === 'de' ? 'Einstellungen →' : 'Settings →'}
                          </a>
                        </span>
                      </Alert>
                    );
                    return null;
                  })()}
                </div>
              )}
            </>
          )}
        </PropertyBody>
      )}
    </PropertyCard>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard({ user, onOpenModal, lang = 'de', onLangChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [googleAccounts, setGoogleAccounts] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ category: '', subject: '', message: '' });
  const [supportSending, setSupportSending] = useState(false);
  const [supportSent, setSupportSent] = useState(false);

  const connected = new URLSearchParams(location.search).get('connected') === 'true';
  const upgraded = new URLSearchParams(location.search).get('upgraded') === 'true';

  useEffect(() => {
    loadProperties();
    loadProfile();
    loadGoogleAccounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGoogleAccounts = async () => {
    const { data } = await supabase.from('google_accounts').select('id, google_email').eq('user_id', user.id);
    setGoogleAccounts(data ?? []);
  };

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('plan, plan_status, free_report_sent, trial_ends_at, promo_code_used')
      .eq('id', user.id)
      .single();
    setProfile(data);
  };


  const handleUpgrade = async (addons = []) => {
    setUpgrading(true);
    setShowUpgradeModal(false);
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
      else console.error('No checkout URL:', data);
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setUpgrading(false);
  };

  const loadProperties = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setProperties(data ?? []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const startGoogleOAuth = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = 'https://ubexqxxkqjzhsgidsseh.supabase.co/functions/v1/google-oauth-callback';
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
    authUrl.searchParams.set('include_granted_scopes', 'true');
    authUrl.searchParams.set('state', state);
    window.location.href = authUrl.toString();
  };

  const handleSupportSubmit = async () => {
    if (!supportForm.category || !supportForm.message.trim()) return;
    setSupportSending(true);
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
      await fetch(`${SUPABASE_URL}/functions/v1/send-support-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          user_email: user.email,
          user_id: user.id,
          category: supportForm.category,
          subject: supportForm.subject,
          message: supportForm.message,
          lang,
        }),
      });
      setSupportSent(true);
      setSupportForm({ category: '', subject: '', message: '' });
    } catch (err) {
      console.error('Support error:', err);
    }
    setSupportSending(false);
  };

  const handleConnectGoogle = () => {
    const plan  = profile?.plan || 'free';
    const limit = profile?.property_limit ?? 1;
    const activeCount = properties.filter(p => p.status === 'active').length;
    if (activeCount >= limit) {
      setShowUpgradeModal(true);
      return;
    }
    // Hat der User bereits Google-Konten? → Modal direkt öffnen (kein neues OAuth nötig)
    // Kein Google-Konto → OAuth starten
    if (googleAccounts.length > 0) {
      if (onOpenModal) onOpenModal({ plan, activeCount });
      else setShowPropertyModal(true);
    } else {
      startGoogleOAuth();
    }
  };

  const plan     = profile?.plan || 'free';
  const whiteLabelEnabled = profile?.white_label_enabled === true;
  const propertyLimit = profile?.property_limit ?? 1;
  const activeProperties = properties.filter(p => p.status === 'active');
  const canAdd   = activeProperties.length < propertyLimit;

  // ── Frozen Account ──────────────────────────────────────────────────────────
  if (profile?.plan_status === 'frozen') {
    return (
      <Layout>
        <TopBar>
          <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
          <TopBarRight>
            <UserEmail>{user?.email}</UserEmail>
            {onLangChange && (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <LangToggle $active={lang === 'de'} onClick={() => onLangChange('de')}>DE</LangToggle>
                <LangToggle $active={lang === 'en'} onClick={() => onLangChange('en')}>EN</LangToggle>
              </div>
            )}
            <BtnSupport onClick={() => setShowSupportModal(true)}>? Support</BtnSupport>
            <BtnSettings to="/settings">⚙ Settings</BtnSettings>
            <BtnSignOut onClick={handleSignOut}>Sign out</BtnSignOut>
          </TopBarRight>
        </TopBar>
        <Main>
          <FrozenWallView onUpgrade={handleUpgrade} upgrading={upgrading} lang={lang} />
        </Main>
      </Layout>
    );
  }

  return (
    <Layout>
      {showUpgradeModal && (
        <UpgradeModal
          currentPlan={plan}
          onUpgrade={handleUpgrade}
          onClose={() => setShowUpgradeModal(false)}
          upgrading={upgrading}
          lang={lang}
        />
      )}
      {showPropertyModal && (
        <PropertySelectModal
          user={user}
          plan={plan}
          activeCount={activeProperties.length}
          onDone={() => { setShowPropertyModal(false); loadProperties(); }}
          onNewAccount={() => { setShowPropertyModal(false); startGoogleOAuth(); }}
          lang={lang}
        />
      )}
      <TopBar>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
        <TopBarRight>
          <UserEmail>{user?.email}</UserEmail>
          {onLangChange && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <LangToggle $active={lang === 'de'} onClick={() => onLangChange('de')}>DE</LangToggle>
              <LangToggle $active={lang === 'en'} onClick={() => onLangChange('en')}>EN</LangToggle>
            </div>
          )}
          <BtnSupport onClick={() => setShowSupportModal(true)}>? Support</BtnSupport>
          <BtnSettings to="/settings">⚙ Settings</BtnSettings>
          <BtnSignOut onClick={handleSignOut}>Sign out</BtnSignOut>
        </TopBarRight>
      </TopBar>

      <Main>
        {connected && (
          <Alert $type="success">
            ✅ Google Search Console erfolgreich verbunden!
          </Alert>
        )}

        {upgraded && (
          <Alert $type="success">
            🎉 Upgrade erfolgreich! Dein Plan wurde aktiviert.
          </Alert>
        )}

        {/* Upgrade-Banner nur für Free-User MIT erstem Report (Trial läuft) */}
        {profile?.plan === 'free' && profile?.free_report_sent && properties.length > 0 && (
          <TrialUpgradeBanner>
            <TrialUpgradeTop>
              <TrialUpgradeTitle>{t(lang, 'dash.trial_title')}</TrialUpgradeTitle>
              <TrialUpgradeSub>{t(lang, 'dash.trial_sub')}</TrialUpgradeSub>
            </TrialUpgradeTop>
            <TrialPlanGrid>
              {[
                { key: 'basic', name: 'Basic', price: '19', features: ['1 Domain', t(lang, 'dash.feature_monthly_report'), lang === 'de' ? 'GSC-Daten' : 'GSC Data', t(lang, 'dash.feature_ai_summary'), t(lang, 'dash.feature_email')] },
                { key: 'pro', name: 'Pro', price: '39', highlight: true, features: ['3 Domains', t(lang, 'dash.feature_all_basic'), lang === 'de' ? 'GA4-Daten' : 'GA4 Data', lang === 'de' ? 'SEO-Empfehlungen' : 'SEO Recommendations', 'White-Label'] },
                { key: 'agency', name: 'Agency', price: '79', features: ['10 Domains', t(lang, 'dash.feature_all_pro'), 'Client Management', 'Bulk Reporting', 'Agency Branding'] },
              ].map(plan => (
                <TrialPlanCard key={plan.key} $highlight={plan.highlight}>
                  {plan.highlight && <TrialPlanBadge>{lang === 'de' ? 'Empfohlen' : 'Recommended'}</TrialPlanBadge>}
                  <PlanName $highlight={plan.highlight}>{plan.name}</PlanName>
                  <PlanPrice $highlight={plan.highlight}>€{plan.price}<span>/mo</span></PlanPrice>
                  {plan.features.map(f => (
                    <PlanFeature key={f} $highlight={plan.highlight}>{f}</PlanFeature>
                  ))}
                  <PlanBtn
                    $highlight={plan.highlight}
                    onClick={() => handleUpgrade(plan.key)}
                    disabled={upgrading}
                  >
                    {upgrading ? t(lang, 'dash.upgrade_loading') : `${plan.name} ${t(lang, 'dash.choose_plan')}`}
                  </PlanBtn>
                </TrialPlanCard>
              ))}
            </TrialPlanGrid>
          </TrialUpgradeBanner>
        )}

        {loading ? <Spinner /> : (
          <>
            {/* Header row: Titel + einziger Connect-Button */}
            <AddPropertyRow>
              <SectionTitle style={{ margin: 0 }}>
                {activeProperties.length === 0 ? t(lang, 'dash.first_website') : t(lang, 'dash.properties_title')}
              </SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                {activeProperties.length > 0 && (
                  <PropertyCountBadge>
                    {activeProperties.length} / {propertyLimit}
                  </PropertyCountBadge>
                )}

                {/* Button 1: Property hinzufügen (aus bestehendem Konto) — wenn Google-Konto vorhanden */}
                {googleAccounts.length > 0 && canAdd && (
                  <BtnConnect
                    onClick={() => { if (onOpenModal) onOpenModal({ plan, activeCount: activeProperties.length }); else setShowPropertyModal(true); }}
                    disabled={upgrading}
                    style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(108,99,255,0.4)', color: '#6C63FF' }}
                  >
                    {lang === 'de' ? '+ Property hinzufügen' : '+ Add Property'}
                  </BtnConnect>
                )}

                {/* Button 2: Google-Konto verbinden — immer sichtbar wenn kein Konto oder Pro/Agency */}
                {(googleAccounts.length === 0 || ['pro', 'agency'].includes(plan)) && canAdd && (
                  <BtnConnect
                    onClick={startGoogleOAuth}
                    disabled={upgrading}
                    style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {googleAccounts.length === 0 ? t(lang, 'dash.connect_google') : t(lang, 'dash.more_account')}
                  </BtnConnect>
                )}

                {!canAdd && (
                  <BtnConnect onClick={() => setShowUpgradeModal(true)} disabled={upgrading} style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                    {lang === 'de' ? 'Upgrade für mehr Domains →' : 'Upgrade for more domains →'}
                  </BtnConnect>
                )}
              </div>
            </AddPropertyRow>

            {/* Leerer State: kurzer Hinweistext statt doppeltem Banner */}
            {activeProperties.length === 0 && (
              <div style={{
                padding: '1.5rem',
                background: 'rgba(108,99,255,0.04)',
                border: '1px solid rgba(108,99,255,0.12)',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                color: '#52526E',
                fontWeight: 300,
                lineHeight: 1.6,
              }}>
                {lang === 'de'
                  ? <>Verbinde dein Google-Konto um GSC-Properties auszuwählen und monatliche Reports zu erhalten. <strong>Der erste Monat ist kostenlos.</strong></>
                  : <>Connect your Google account to select GSC properties and receive monthly reports. <strong>The first month is free.</strong></>
                }
              </div>
            )}

            {activeProperties.length > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#9898B8', fontWeight: 300, marginBottom: '0.5rem', textAlign: 'right' }}>
                {lang === 'de'
                  ? <>Properties verwalten oder entfernen → <a href="/settings" style={{ color: '#6C63FF', textDecoration: 'none' }}>Einstellungen</a></>
                  : <>Manage or remove properties → <a href="/settings" style={{ color: '#6C63FF', textDecoration: 'none' }}>Settings</a></>
                }
              </div>
            )}

            {activeProperties.length > 0 && (
              <PropertyList>
                {activeProperties.map(p => (
                  <PropertyItem
                    key={p.id}
                    property={p}
                    isAgency={whiteLabelEnabled}
                    plan={plan}
                    lang={lang}
                    onReauth={startGoogleOAuth}
                  />
                ))}
              </PropertyList>
            )}
          </>
        )}
      </Main>
      {showSupportModal && (
        <SupportOverlay onClick={() => { setShowSupportModal(false); setSupportSent(false); }}>
          <SupportBox onClick={e => e.stopPropagation()}>
            {supportSent ? (
              <>
                <SupportTitle>{lang === 'de' ? '✅ Nachricht gesendet!' : '✅ Message sent!'}</SupportTitle>
                <SupportSub>
                  {lang === 'de'
                    ? 'Wir haben deine Anfrage erhalten und melden uns so schnell wie möglich bei dir. Schau auch in deinen Spam-Ordner.'
                    : 'We have received your request and will get back to you as soon as possible. Please also check your spam folder.'}
                </SupportSub>
                <BtnConnect onClick={() => { setShowSupportModal(false); setSupportSent(false); }} style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 700, background: "var(--color-accent, #6C63FF)", color: "#fff", border: "none", borderRadius: "8px" }}>
                  {lang === 'de' ? 'Schließen' : 'Close'}
                </BtnConnect>
              </>
            ) : (
              <>
                <SupportTitle>{lang === 'de' ? '💬 Support-Anfrage' : '💬 Support Request'}</SupportTitle>
                <SupportSub>
                  {lang === 'de'
                    ? 'Wir helfen dir gerne. Beschreibe dein Anliegen und wir melden uns schnellstmöglich.'
                    : 'We are happy to help. Describe your issue and we will get back to you as soon as possible.'}
                </SupportSub>
                <SupportField>
                  <SupportLabel>{lang === 'de' ? 'Kategorie' : 'Category'}</SupportLabel>
                  <SupportSelect
                    value={supportForm.category}
                    onChange={e => setSupportForm(f => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">{lang === 'de' ? '— Bitte wählen —' : '— Please select —'}</option>
                    <option value="report_missing">{lang === 'de' ? 'Report wurde nicht gesendet' : 'Report was not sent'}</option>
                    <option value="pdf_issue">{lang === 'de' ? 'PDF-Problem' : 'PDF issue'}</option>
                    <option value="gsc_connection">{lang === 'de' ? 'Google-Verbindung funktioniert nicht' : 'Google connection not working'}</option>
                    <option value="billing">{lang === 'de' ? 'Zahlung / Abonnement' : 'Billing / Subscription'}</option>
                    <option value="feature_request">{lang === 'de' ? 'Feature-Wunsch' : 'Feature request'}</option>
                    <option value="other">{lang === 'de' ? 'Sonstiges' : 'Other'}</option>
                  </SupportSelect>
                </SupportField>
                <SupportField>
                  <SupportLabel>{lang === 'de' ? 'Betreff (optional)' : 'Subject (optional)'}</SupportLabel>
                  <SupportInput
                    type="text"
                    placeholder={lang === 'de' ? 'Kurze Zusammenfassung...' : 'Brief summary...'}
                    value={supportForm.subject}
                    onChange={e => setSupportForm(f => ({ ...f, subject: e.target.value }))}
                  />
                </SupportField>
                <SupportField>
                  <SupportLabel>{lang === 'de' ? 'Nachricht' : 'Message'} *</SupportLabel>
                  <SupportTextarea
                    placeholder={lang === 'de' ? 'Beschreibe dein Anliegen so genau wie möglich...' : 'Describe your issue in as much detail as possible...'}
                    value={supportForm.message}
                    onChange={e => setSupportForm(f => ({ ...f, message: e.target.value }))}
                  />
                </SupportField>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <BtnSignOut onClick={() => setShowSupportModal(false)} style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}>
                    {lang === 'de' ? 'Abbrechen' : 'Cancel'}
                  </BtnSignOut>
                  <BtnConnect
                    onClick={handleSupportSubmit}
                    disabled={supportSending || !supportForm.category || !supportForm.message.trim()}
                    style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 700, background: "#6C63FF", color: "#fff", border: "none", borderRadius: "8px", opacity: (supportSending || !supportForm.category || !supportForm.message.trim()) ? 0.5 : 1, cursor: (supportSending || !supportForm.category || !supportForm.message.trim()) ? "not-allowed" : "pointer" }}
                  >
                    {supportSending
                      ? (lang === 'de' ? 'Sendet...' : 'Sending...')
                      : (lang === 'de' ? 'Anfrage senden' : 'Send request')}
                  </BtnConnect>
                </div>
              </>
            )}
          </SupportBox>
        </SupportOverlay>
      )}
    </Layout>
  );
}
