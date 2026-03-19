import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
const PLAN_LIMITS = { free: 1, basic: 1, pro: 3, agency: 10 };

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
  padding: 0 2rem;
  background: ${({ theme }) => theme.colors.bgCard};
  position: sticky;
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
  gap: 1rem;
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
`;

const Main = styled.main`
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  animation: ${fadeUp} 0.4s ease both;
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
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
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
  gap: 1rem;
  cursor: pointer;
  &:hover { background: rgba(108,99,255,0.03); }
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
  gap: 1rem;
  flex-wrap: wrap;
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
`;

const KpiCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
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
function FrozenWallView({ onUpgrade, upgrading }) {
  const plans = [
    {
      key: 'basic',
      name: 'Basic',
      price: '19',
      features: ['1 Domain', 'Monatlicher PDF-Report', 'GSC + GA4 Daten', 'KI-Zusammenfassung', 'Email-Versand'],
    },
    {
      key: 'pro',
      name: 'Pro',
      price: '39',
      highlight: true,
      features: ['3 Domains', 'Alles in Basic', 'White-Label Reports', 'Eigenes Logo', 'Priority Delivery'],
    },
    {
      key: 'agency',
      name: 'Agency',
      price: '79',
      features: ['10 Domains', 'Alles in Pro', 'Client Management', 'Bulk Reporting', 'Agency Branding'],
    },
  ];

  return (
    <FrozenWall>
      <FrozenIcon>⏸️</FrozenIcon>
      <FrozenTitle>Dein kostenloser Monat ist abgelaufen</FrozenTitle>
      <FrozenSubtitle>
        Wähle einen Plan um weiterhin automatische monatliche SEO-Reports zu erhalten.
        Deine Daten sind sicher gespeichert.
      </FrozenSubtitle>

      <PlanGrid>
        {plans.map(plan => (
          <PlanCard key={plan.key} $highlight={plan.highlight}>
            {plan.highlight && <PlanBadge>Empfohlen</PlanBadge>}
            <PlanName $highlight={plan.highlight}>{plan.name}</PlanName>
            <PlanPrice $highlight={plan.highlight}>
              €{plan.price}<span>/mo</span>
            </PlanPrice>
            {plan.features.map(f => (
              <PlanFeature key={f} $highlight={plan.highlight}>{f}</PlanFeature>
            ))}
            <PlanBtn
              $highlight={plan.highlight}
              onClick={() => onUpgrade(plan.key)}
              disabled={upgrading}
            >
              {upgrading ? 'Wird geladen...' : 'Jetzt starten →'}
            </PlanBtn>
          </PlanCard>
        ))}
      </PlanGrid>
    </FrozenWall>
  );
}

function fmtMonth(dateStr) {
  return new Date(dateStr).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
}

// ── UpgradeModal ──────────────────────────────────────────────────────────────
function UpgradeModal({ currentPlan, onUpgrade, onClose, upgrading }) {
  const opts = currentPlan === 'pro'
    ? [{ key: 'agency', name: 'Agency', price: '79', highlight: true, features: ['10 Domains', 'Alles in Pro', 'Client Management', 'Endkunden-Email', 'Agency Branding'] }]
    : [
        { key: 'pro',    name: 'Pro',    price: '39', highlight: true, features: ['3 Domains', 'White-Label', 'SEO-Empfehlungen', 'Endkunden-Email'] },
        { key: 'agency', name: 'Agency', price: '79', highlight: false, features: ['10 Domains', 'Alles in Pro', 'Client Management', 'Endkunden-Email'] },
      ];
  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalClose onClick={onClose}>✕</ModalClose>
        <ModalTitle>Mehr Domains? Upgrade erforderlich</ModalTitle>
        <ModalSub>
          Du hast das Domain-Limit deines aktuellen Plans erreicht. Upgrade um weitere Websites zu verbinden.
        </ModalSub>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${opts.length}, 1fr)`, gap: '1rem' }}>
          {opts.map(p => (
            <PlanCard key={p.key} $highlight={p.highlight}>
              <PlanName $highlight={p.highlight}>{p.name}</PlanName>
              <PlanPrice $highlight={p.highlight}>€{p.price}<span>/mo</span></PlanPrice>
              {p.features.map(f => <PlanFeature key={f} $highlight={p.highlight}>{f}</PlanFeature>)}
              <PlanBtn $highlight={p.highlight} onClick={() => onUpgrade(p.key)} disabled={upgrading}>
                {upgrading ? 'Lädt...' : `Upgrade auf ${p.name} →`}
              </PlanBtn>
            </PlanCard>
          ))}
        </div>
      </ModalBox>
    </ModalOverlay>
  );
}

// ── PropertyItem (expandable) ─────────────────────────────────────────────────
function PropertyItem({ property, isAgency, plan }) {
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
          <PropertyMeta>Verbunden {new Date(property.created_at).toLocaleDateString('de-DE')}</PropertyMeta>
          <PropertyChevron $open={open}>▾</PropertyChevron>
        </div>
      </PropertyHeader>

      {open && (
        <PropertyBody>
          {/* Endkunden-Email – nur Agency */}
          {isAgency && (
            <>
              <RecipientRow>
                <RecipientLabel>📧 Endkunden-Email (optional):</RecipientLabel>
                <RecipientInput
                  type="email"
                  placeholder="kunde@beispiel.de"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                />
                <RecipientSaveBtn onClick={handleSaveEmail} disabled={savingEmail}>
                  {savingEmail ? <SpinnerSm /> : emailSaved ? '✓ Gespeichert' : 'Speichern'}
                </RecipientSaveBtn>
              </RecipientRow>
              <RecipientHint>
                Wenn gesetzt, bekommt der Endkunde den Report zusätzlich zu dir – mit deinem White-Label Branding als PDF-Anhang. Leer lassen = nur du bekommst den Report.
              </RecipientHint>
            </>
          )}

          {/* Report-Verlauf */}
          <ReportHistoryTitle>Report-Verlauf</ReportHistoryTitle>
          {reportsLoading ? (
            <Spinner />
          ) : reports.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <EmptyTitle>Noch kein Report vorhanden</EmptyTitle>
              <EmptyText>Der erste Report wird automatisch am 1. des nächsten Monats generiert.</EmptyText>
            </EmptyState>
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
                      <ReportHistoryClicks>{fmt(r.clicks)} Klicks</ReportHistoryClicks>
                      {r.pdf_url
                        ? <DownloadBtn href={r.pdf_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>↓ PDF</DownloadBtn>
                        : <NoPdfBadge>kein PDF</NoPdfBadge>}
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
                    Details: {fmtMonth(selectedReport.report_month)}
                  </div>
                  <KpiGrid>
                    <KpiCard>
                      <KpiLabel>Clicks</KpiLabel>
                      <KpiValue>{fmt(selectedReport.clicks)}</KpiValue>
                      {selectedReport.clicks_delta != null
                        ? <KpiDelta $up={selectedReport.clicks_delta >= 0}>{Math.abs(selectedReport.clicks_delta).toFixed(1)}% ggü. Vormonat</KpiDelta>
                        : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                    </KpiCard>
                    <KpiCard>
                      <KpiLabel>Impressionen</KpiLabel>
                      <KpiValue>{fmt(selectedReport.impressions)}</KpiValue>
                      {selectedReport.impressions_delta != null
                        ? <KpiDelta $up={selectedReport.impressions_delta >= 0}>{Math.abs(selectedReport.impressions_delta).toFixed(1)}%</KpiDelta>
                        : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                    </KpiCard>
                    <KpiCard>
                      <KpiLabel>Ø CTR</KpiLabel>
                      <KpiValue>{fmtPct(selectedReport.ctr)}</KpiValue>
                      {selectedReport.ctr_delta != null
                        ? <KpiDelta $up={selectedReport.ctr_delta >= 0}>{Math.abs(selectedReport.ctr_delta).toFixed(2)}%</KpiDelta>
                        : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                    </KpiCard>
                    <KpiCard>
                      <KpiLabel>Ø Position</KpiLabel>
                      <KpiValue>{fmtPos(selectedReport.avg_position)}</KpiValue>
                      {selectedReport.position_delta != null
                        ? <KpiDelta $up={selectedReport.position_delta <= 0}>{Math.abs(selectedReport.position_delta).toFixed(1)}</KpiDelta>
                        : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                    </KpiCard>
                  </KpiGrid>

                  {plan === 'basic' && (
                    <UpgradeHint>
                      <UpgradeHintText>
                        <h3>🚀 Mit Pro bekommst du noch mehr</h3>
                        <ul>
                          <li><strong>3 Domains:</strong> Mehrere Websites in einem Account verwalten</li>
                          <li><strong>SEO-Empfehlungen:</strong> Konkrete Maßnahmen was du diese Woche tun kannst</li>
                          <li><strong>White-Label Reports:</strong> Reports mit eigenem Logo und Branding</li>
                        </ul>
                      </UpgradeHintText>
                    </UpgradeHint>
                  )}

                  {['basic', 'pro', 'agency'].includes(plan) && (
                    <>
                      <SectionTitle>KI-Zusammenfassung</SectionTitle>
                      <SummaryCard>
                        {selectedReport.summary_text
                          ? <SummaryText>{selectedReport.summary_text}</SummaryText>
                          : <SummaryEmpty>🤖 Noch keine KI-Zusammenfassung vorhanden. Wird automatisch beim nächsten Report generiert.</SummaryEmpty>}
                      </SummaryCard>
                    </>
                  )}

                  <TableGrid>
                    <TableCard>
                      <TableHeader>Top Keywords</TableHeader>
                      {keywords.length > 0
                        ? keywords.map(k => (
                            <TableRow key={k.id}>
                              <TableLabel title={k.keyword}>{k.keyword}</TableLabel>
                              <TableVal>{k.clicks} Klicks</TableVal>
                            </TableRow>
                          ))
                        : <TableEmpty>Keine Keyword-Daten.<br /><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: '#6C63FF' }}>GSC einrichten →</a></TableEmpty>}
                    </TableCard>
                    <TableCard>
                      <TableHeader>Top Seiten</TableHeader>
                      {pages.length > 0
                        ? pages.map(p => (
                            <TableRow key={p.id}>
                              <TableLabel title={p.page_url}>{p.page_url.replace(/^https?:\/\/[^/]+/, '') || '/'}</TableLabel>
                              <TableVal>{p.clicks} Klicks</TableVal>
                            </TableRow>
                          ))
                        : <TableEmpty>Keine Seiten-Daten.<br /><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: '#6C63FF' }}>GSC einrichten →</a></TableEmpty>}
                    </TableCard>
                  </TableGrid>

                  {selectedReport.sessions === 0 && ['basic', 'pro', 'agency'].includes(plan) && (
                    <Alert $type="info">
                      <strong>GA4-Daten fehlen</strong><br />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 300 }}>
                        Google Analytics 4 zeigt dir was Besucher auf deiner Website tun.{' '}
                        <a href="https://analytics.google.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}>
                          GA4 kostenlos einrichten →
                        </a>{' '}(ca. 5 Minuten)
                      </span>
                    </Alert>
                  )}
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
export default function Dashboard({ user, onOpenModal }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [googleAccounts, setGoogleAccounts] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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


  const handleUpgrade = async (plan, billing = 'monthly') => {
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
        body: JSON.stringify({ plan, billing, user_id: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
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
    authUrl.searchParams.set('state', state);
    window.location.href = authUrl.toString();
  };

  const handleConnectGoogle = () => {
    const plan  = profile?.plan || 'free';
    const limit = PLAN_LIMITS[plan] ?? 1;
    const activeCount = properties.filter(p => p.status === 'active').length;
    if (activeCount >= limit) {
      setShowUpgradeModal(true);
      return;
    }
    // Hat der User bereits Google-Konten? → Modal direkt öffnen (kein neues OAuth nötig)
    // Kein Google-Konto → OAuth starten
    if (googleAccounts.length > 0) {
      if (onOpenModal) onOpenModal({ plan, activeCount });
    } else {
      startGoogleOAuth();
    }
  };

  const plan     = profile?.plan || 'free';
  const limit    = PLAN_LIMITS[plan] ?? 1;
  const isAgency = plan === 'agency';
  const activeProperties = properties.filter(p => p.status === 'active');
  const canAdd   = activeProperties.length < limit;

  // ── Frozen Account ──────────────────────────────────────────────────────────
  if (profile?.plan_status === 'frozen') {
    return (
      <Layout>
        <TopBar>
          <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
          <TopBarRight>
            <UserEmail>{user?.email}</UserEmail>
            <BtnSettings to="/settings">⚙ Settings</BtnSettings>
            <BtnSignOut onClick={handleSignOut}>Sign out</BtnSignOut>
          </TopBarRight>
        </TopBar>
        <Main>
          <FrozenWallView onUpgrade={handleUpgrade} upgrading={upgrading} />
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
        />
      )}
      <TopBar>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
        <TopBarRight>
          <UserEmail>{user?.email}</UserEmail>
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
              <TrialUpgradeTitle>Dein kostenloser Monat läuft</TrialUpgradeTitle>
              <TrialUpgradeSub>Wähle einen Plan um nach dem Freimonat weiterhin Reports zu erhalten.</TrialUpgradeSub>
            </TrialUpgradeTop>
            <TrialPlanGrid>
              {[
                { key: 'basic', name: 'Basic', price: '19', features: ['1 Domain', 'Monatlicher PDF-Report', 'GSC-Daten', 'KI-Zusammenfassung', 'Email-Versand'] },
                { key: 'pro', name: 'Pro', price: '39', highlight: true, features: ['3 Domains', 'Alles in Basic', 'GA4-Daten', 'SEO-Empfehlungen', 'White-Label'] },
                { key: 'agency', name: 'Agency', price: '79', features: ['10 Domains', 'Alles in Pro', 'Client Management', 'Bulk Reporting', 'Agency Branding'] },
              ].map(plan => (
                <TrialPlanCard key={plan.key} $highlight={plan.highlight}>
                  {plan.highlight && <TrialPlanBadge>Empfohlen</TrialPlanBadge>}
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
                    {upgrading ? 'Lädt...' : `${plan.name} wählen →`}
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
                {activeProperties.length === 0 ? 'Erste Website verbinden' : 'Deine Properties'}
              </SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                {activeProperties.length > 0 && (
                  <PropertyCountBadge>
                    {activeProperties.length} / {limit} ({plan === 'free' ? 'Free' : plan.charAt(0).toUpperCase() + plan.slice(1)})
                  </PropertyCountBadge>
                )}

                {/* Button 1: Property hinzufügen (aus bestehendem Konto) — wenn Google-Konto vorhanden */}
                {googleAccounts.length > 0 && canAdd && (
                  <BtnConnect
                    onClick={() => onOpenModal && onOpenModal({ plan, activeCount: activeProperties.length })}
                    disabled={upgrading}
                    style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(108,99,255,0.4)', color: '#6C63FF' }}
                  >
                    + Property hinzufügen
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
                    {googleAccounts.length === 0 ? 'Google-Konto verbinden' : '+ Weiteres Konto'}
                  </BtnConnect>
                )}

                {!canAdd && (
                  <BtnConnect onClick={() => setShowUpgradeModal(true)} disabled={upgrading} style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                    Upgrade für mehr Domains →
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
                Verbinde dein Google-Konto um GSC-Properties auszuwählen und monatliche Reports zu erhalten. <strong>Der erste Monat ist kostenlos.</strong>
              </div>
            )}

            {activeProperties.length > 0 && (
              <PropertyList>
                {activeProperties.map(p => (
                  <PropertyItem
                    key={p.id}
                    property={p}
                    isAgency={isAgency}
                    plan={plan}
                  />
                ))}
              </PropertyList>
            )}
          </>
        )}
      </Main>
    </Layout>
  );
}
