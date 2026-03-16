import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

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
  gap: 0.75rem;
`;

const TopBarLink = styled(Link)`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
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

const Main = styled.main`
  flex: 1;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
  animation: ${fadeUp} 0.4s ease both;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 2rem;
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
const PLAN_LIMITS = {
  free: { label: 'Free', domains: 1 },
  basic: { label: 'Basic', domains: 1 },
  pro: { label: 'Pro', domains: 3 },
  agency: { label: 'Agency', domains: 10 },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Settings({ user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [googleAccounts, setGoogleAccounts] = useState([]);
  const [promoCode, setPromoCode] = useState('');
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
  const [pwLoading, setPwLoading] = useState(false);

  // GA4 edit state per property
  const [ga4Edits, setGa4Edits] = useState({});
  const [ga4Saving, setGa4Saving] = useState({});

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
      else showAlert('Fehler beim Öffnen des Portals. Bitte erneut versuchen.', 'error');
    } catch {
      showAlert('Netzwerkfehler. Bitte erneut versuchen.', 'error');
    }
    setPortalLoading(false);
  };

  // ── Upgrade (Checkout) ────────────────────────────────────────────────────
  const handleUpgrade = async (plan) => {
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ plan, user_id: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch {
      showAlert('Fehler beim Laden des Checkouts.', 'error');
    }
  };

  // ── Downgrade with property selection ────────────────────────────────────
  const handleDowngrade = (targetPlan) => {
    const maxDomains = PLAN_LIMITS[targetPlan]?.domains ?? 1;
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

  // ── GA4 ID speichern ──────────────────────────────────────────────────────
  const saveGa4 = async (propertyId) => {
    setGa4Saving(s => ({ ...s, [propertyId]: true }));
    const val = ga4Edits[propertyId]?.trim();
    if (val && !/^\d+$/.test(val)) {
      showAlert('GA4 Property ID muss eine reine Zahl sein (z.B. 123456789)', 'error');
      setGa4Saving(s => ({ ...s, [propertyId]: false }));
      return;
    }
    const { error } = await supabase
      .from('properties')
      .update({ ga_property_id: val || null })
      .eq('id', propertyId);
    if (error) showAlert('Fehler beim Speichern.', 'error');
    else showAlert('GA4 Property ID gespeichert.');
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
    if (error) showAlert('Fehler beim Löschen.', 'error');
    else {
      showAlert('Property gelöscht.');
      setProperties(ps => ps.filter(p => p.id !== deletePropertyId));
    }
    setDeletePropertyId(null);
  };

  // ── Neue Property verbinden ───────────────────────────────────────────────
  const handleConnectNew = () => {
    const plan = profile?.plan || 'free';
    const limit = PLAN_LIMITS[plan]?.domains ?? 1;
    if (properties.length >= limit) {
      showAlert(`Dein ${PLAN_LIMITS[plan]?.label}-Plan erlaubt max. ${limit} Domain(s). Bitte upgraden.`, 'error');
      return;
    }
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/google-oauth-callback`;
    const SCOPES = [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
    ].join(' ');
    const state = encodeURIComponent(`${user.id}|Neue Website|`);
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
    if (error) showAlert('Fehler beim Speichern.', 'error');
    else showAlert('Branding gespeichert – wirkt beim nächsten Report. ✓');
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
      showAlert('Neues Passwort muss mindestens 8 Zeichen haben.', 'error');
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwNew });
    if (error) showAlert(error.message, 'error');
    else {
      showAlert('Passwort erfolgreich geändert.');
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
      showAlert('Bitte kündige zuerst dein Abo über das Billing Portal, bevor du den Account löschst.', 'error');
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
      showAlert('Fehler beim Löschen des Accounts. Bitte kontaktiere support@rankbrief.com', 'error');
    }
    setDeleteLoading(false);
  };

  const plan = profile?.plan || 'free';
  const planInfo = PLAN_LIMITS[plan];
  const isFree = plan === 'free';
  const isPaid = ['basic', 'pro', 'agency'].includes(plan);
  const isPro  = ['pro', 'agency'].includes(plan);
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
    <Layout>
      {/* Confirm Modal: Property löschen */}
      {/* ── Downgrade Property Selection Modal ── */}
      {downgradeModal && (
        <ModalOverlay onClick={() => setDowngradeModal(null)}>
          <ModalCard onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
              {branding.report_language === 'en'
                ? `Downgrade to ${PLAN_LIMITS[downgradeModal.targetPlan]?.label}`
                : `Wechsel zu ${PLAN_LIMITS[downgradeModal.targetPlan]?.label}`}
            </h3>
            <p style={{ margin: '0 0 1rem', fontSize: '13px', color: '#666' }}>
              {branding.report_language === 'en'
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
                {branding.report_language === 'en' ? 'Cancel' : 'Abbrechen'}
              </Btn>
              <Btn $variant="primary" onClick={confirmDowngrade} disabled={selectedProperties.length !== downgradeModal.maxDomains}>
                {branding.report_language === 'en' ? 'Confirm & Switch Plan →' : 'Bestätigen & Plan wechseln →'}
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
              <Btn $variant="danger" onClick={handleDeleteProperty}>Löschen</Btn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Confirm Modal: Account löschen */}
      {deleteConfirm && (
        <ModalOverlay onClick={() => setDeleteConfirm(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalTitle>Account wirklich löschen?</ModalTitle>
            {['basic', 'pro', 'agency'].includes(profile?.plan) && profile?.plan_status === 'active' ? (
              <>
                <ModalText style={{ color: '#ef4444' }}>
                  ⚠️ Du hast noch ein aktives Abo ({profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}).
                  Bitte kündige es zuerst im Billing Portal – danach kannst du deinen Account löschen.
                </ModalText>
                <ModalActions>
                  <Btn onClick={() => setDeleteConfirm(false)}>Abbrechen</Btn>
                  <Btn $variant="primary" onClick={handlePortal}>Zum Billing Portal →</Btn>
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
                    {deleteLoading ? 'Wird gelöscht...' : 'Account löschen'}
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
          <BtnSignOut onClick={handleSignOut}>Sign out</BtnSignOut>
        </TopBarRight>
      </TopBar>

      <Main>
        <PageTitle>Settings</PageTitle>

        {alert && <Alert $type={alert.type}>{alert.msg}</Alert>}

        {/* ── Plan & Billing ─────────────────────────────────────────────── */}
        <Section>
          <SectionHead>
            <div>
              <SectionTitle>Plan & Billing</SectionTitle>
              <SectionSub>Dein aktuelles Abonnement und Zahlungsinformationen</SectionSub>
            </div>
            <PlanBadge $plan={plan}>
              <StatusDot />
              {planInfo?.label || 'Free'}
            </PlanBadge>
          </SectionHead>
          <SectionBody>
            <InfoRow>
              <InfoLabel>Aktueller Plan</InfoLabel>
              <InfoValue>{planInfo?.label} – bis zu {planInfo?.domains} Domain{planInfo?.domains > 1 ? 's' : ''}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>
                {profile?.plan_status === 'frozen' ? '⏸ Pausiert' :
                 profile?.plan_status === 'active' ? '✅ Aktiv' : profile?.plan_status}
              </InfoValue>
            </InfoRow>
            {profile?.trial_ends_at && (
              <InfoRow>
                <InfoLabel>Freimonat endet am</InfoLabel>
                <InfoValue>{new Date(profile.trial_ends_at).toLocaleDateString('de-DE')}</InfoValue>
              </InfoRow>
            )}

            {/* ── Primary Upsell CTA ── */}
            {isFree && (
              <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '10px' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                  {branding.report_language === 'en' ? '🚀 Upgrade to Basic' : '🚀 Upgrade auf Basic'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary, #666)', marginBottom: '0.75rem' }}>
                  {branding.report_language === 'en'
                    ? 'Get monthly SEO reports automatically – starting at €19/month.'
                    : 'Monatliche SEO-Reports automatisch – ab €19/Monat.'}
                </div>
                <Btn $variant="primary" onClick={() => handleUpgrade('basic')}>
                  {branding.report_language === 'en' ? 'Upgrade to Basic – €19/mo →' : 'Upgrade auf Basic – €19/mo →'}
                </Btn>
              </div>
            )}
            {plan === 'basic' && (
              <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '10px' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                  {branding.report_language === 'en' ? '⚡ Upgrade to Pro' : '⚡ Upgrade auf Pro'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary, #666)', marginBottom: '0.75rem' }}>
                  {branding.report_language === 'en'
                    ? '3 domains + AI recommendations – €39/month.'
                    : '3 Domains + KI-Empfehlungen – €39/Monat.'}
                </div>
                <Btn $variant="primary" onClick={() => handleUpgrade('pro')}>
                  {branding.report_language === 'en' ? 'Upgrade to Pro – €39/mo →' : 'Upgrade auf Pro – €39/mo →'}
                </Btn>
              </div>
            )}
            {plan === 'pro' && (
              <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '10px' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                  {branding.report_language === 'en' ? '🏆 Upgrade to Agency' : '🏆 Upgrade auf Agency'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary, #666)', marginBottom: '0.75rem' }}>
                  {branding.report_language === 'en'
                    ? '10 domains + white-label reports – €79/month.'
                    : '10 Domains + White-Label Reports – €79/Monat.'}
                </div>
                <Btn $variant="primary" onClick={() => handleUpgrade('agency')}>
                  {branding.report_language === 'en' ? 'Upgrade to Agency – €79/mo →' : 'Upgrade auf Agency – €79/mo →'}
                </Btn>
              </div>
            )}

            {/* ── Other Plans ── */}
            <div style={{ marginTop: '1.25rem' }}>
              <FieldHint style={{ marginBottom: '0.5rem' }}>
                {branding.report_language === 'en' ? 'Looking for a different plan?' : 'Anderen Plan wählen?'}
              </FieldHint>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {plan !== 'basic' && (
                  <Btn onClick={() => plan === 'free' ? handleUpgrade('basic') : handleDowngrade('basic')} style={{ fontSize: '13px', padding: '6px 14px' }}>
                    Basic – €19/mo
                  </Btn>
                )}
                {plan !== 'pro' && (
                  <Btn onClick={() => ['free','basic'].includes(plan) ? handleUpgrade('pro') : handleDowngrade('pro')} style={{ fontSize: '13px', padding: '6px 14px' }}>
                    Pro – €39/mo
                  </Btn>
                )}
                {plan !== 'agency' && (
                  <Btn onClick={() => plan === 'agency' ? handleDowngrade('agency') : handleUpgrade('agency')} style={{ fontSize: '13px', padding: '6px 14px' }}>
                    Agency – €79/mo
                  </Btn>
                )}
                {isPaid && (
                  <Btn onClick={handlePortal} disabled={portalLoading} style={{ fontSize: '13px', padding: '6px 14px' }}>
                    {portalLoading ? '...' : (branding.report_language === 'en' ? '↗ Billing Portal' : '↗ Billing Portal')}
                  </Btn>
                )}
              </div>
            </div>
          </SectionBody>
        </Section>

        {/* ── Properties ─────────────────────────────────────────────────── */}
        <Section>
          <SectionHead>
            <div>
              <SectionTitle>Properties</SectionTitle>
              <SectionSub>
                {properties.length} / {planInfo?.domains} Domains verbunden
              </SectionSub>
            </div>
            {properties.length < (planInfo?.domains ?? 1) && (
              <Btn $variant="primary" onClick={handleConnectNew}>
                + Property hinzufügen
              </Btn>
            )}
          </SectionHead>
          <SectionBody>
            {properties.length === 0 && (
              <Alert $type="info">
                Noch keine Property verbunden.{' '}
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
                  <Btn $variant="danger" onClick={() => setDeletePropertyId(prop.id)}>
                    Entfernen
                  </Btn>
                </PropertyHead>
                <PropertyBody>
                  <Field>
                    <Label>GA4 Property ID</Label>
                    <Row>
                      <Input
                        style={{ flex: 1 }}
                        placeholder="z.B. 123456789"
                        value={ga4Edits[prop.id] ?? ''}
                        onChange={e => setGa4Edits(eds => ({ ...eds, [prop.id]: e.target.value }))}
                      />
                      <Btn
                        $variant="primary"
                        onClick={() => saveGa4(prop.id)}
                        disabled={ga4Saving[prop.id]}
                      >
                        {ga4Saving[prop.id] ? 'Speichert...' : 'Speichern'}
                      </Btn>
                    </Row>
                    <FieldHint>
                      Nur Ziffern – z.B. <code>123456789</code>. Zu finden in{' '}
                      <a href="https://analytics.google.com" target="_blank" rel="noreferrer">
                        Google Analytics → Admin → Property-Einstellungen
                      </a>
                    </FieldHint>
                  </Field>
                </PropertyBody>
              </PropertyCard>
            ))}

            {properties.length >= (planInfo?.domains ?? 1) && properties.length > 0 && (
              <FieldHint style={{ marginTop: '0.75rem' }}>
                Limit erreicht. {plan !== 'agency' && (
                  <button
                    onClick={() => handleUpgrade(plan === 'basic' ? 'pro' : 'agency')}
                    style={{ background: 'none', border: 'none', color: '#6C63FF', cursor: 'pointer', fontSize: 'inherit', fontWeight: 600 }}
                  >
                    Upgrade für mehr Domains →
                  </button>
                )}
              </FieldHint>
            )}
          </SectionBody>
        </Section>


        {/* ── Branding & White-Label ───────────────────────────────────── */}
        <Section>
          <SectionHead>
            <div>
              <SectionTitle>Branding & White-Label <ProTag>Pro / Agency</ProTag></SectionTitle>
              <SectionSub>Logo, Farben, Schriftart und Absendername im monatlichen PDF-Report</SectionSub>
            </div>
          </SectionHead>
          <SectionBody>
            {!isPro && (
              <Alert $type="info" style={{ marginBottom: '1.5rem' }}>
                🔒 White-Label ist ab dem Pro-Plan verfügbar.{' '}
                <button onClick={() => handleUpgrade('pro')} style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
                  Jetzt upgraden →
                </button>
              </Alert>
            )}

            {/* Logo */}
            <Field>
              <Label>Firmenlogo</Label>

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
                      Ändern
                    </Btn>
                    <Btn $variant="danger" onClick={() => setBranding(b => ({ ...b, brand_logo_url: '', _logoFile: '', _logoSize: 0 }))} disabled={!isPro}>
                      Entfernen
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
                    {logoUploading ? 'Wird hochgeladen...' : 'Drag & Drop oder klicken zum Hochladen'}
                  </p>
                </LogoDropZone>
              )}

              <input id="rb-logo-input" type="file" accept=".png,.jpg,.jpeg,.svg"
                style={{ display: 'none' }} onChange={e => uploadLogo(e.target.files?.[0])} disabled={!isPro} />

              {!branding.brand_logo_url && (
                <Btn style={{ marginTop: '0.5rem' }} onClick={() => isPro && document.getElementById('rb-logo-input').click()} disabled={!isPro || logoUploading}>
                  {logoUploading ? 'Lädt hoch...' : '↑ Logo hochladen'}
                </Btn>
              )}

              <FieldHint>PNG, JPG oder SVG · max. 500 KB · Empfohlen: 400×120px, transparenter Hintergrund</FieldHint>
            </Field>

            {/* Firmenname */}
            <Field>
              <Label>Firmenname im Report</Label>
              <Input placeholder="z.B. Muster SEO GmbH" value={branding.brand_company_name}
                onChange={e => setBranding(b => ({ ...b, brand_company_name: e.target.value }))} disabled={!isPro} />
              <FieldHint>Erscheint im Header und Footer anstelle von "RankBrief"</FieldHint>
            </Field>

            {/* Reply-To */}
            <Field>
              <Label>Reply-To E-Mail</Label>
              <Input type="email" placeholder="reports@deine-agentur.de" value={branding.brand_reply_to_email}
                onChange={e => setBranding(b => ({ ...b, brand_reply_to_email: e.target.value }))} disabled={!isPro} />
              <FieldHint>Kunden sehen diese Adresse wenn sie auf den Report antworten</FieldHint>
            </Field>

            {/* Primärfarbe */}
            <Field>
              <Label>Primärfarbe (Headlines, KPI-Akzente)</Label>
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
              <Label>Akzentfarbe (Trennlinien, Highlights)</Label>
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
              <Label>Schriftart</Label>
              <FontGrid>
                {FONTS.map(f => (
                  <FontPill key={f.key} $active={branding.brand_font === f.key} $ff={f.ff}
                    onClick={() => isPro && setBranding(b => ({ ...b, brand_font: f.key }))} disabled={!isPro}>
                    {f.label}
                  </FontPill>
                ))}
              </FontGrid>
              <FieldHint>Schriftart wird im PDF via Google Fonts geladen</FieldHint>
            </Field>

            {/* Report-Sprache */}
            <Field>
              <Label>Report-Sprache</Label>
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
              <FieldHint>Gilt für KI-Zusammenfassung, Empfehlungen und alle Beschriftungen im PDF</FieldHint>
            </Field>

            {/* Live PDF Preview */}
            <Field>
              <Label>Live-Vorschau PDF-Report</Label>
              <PdfShell>
                <PdfHead $c={branding.brand_primary_color}>
                  <PdfHeadLeft>
                    {branding.brand_logo_url
                      ? <img src={branding.brand_logo_url} alt="Logo" />
                      : <div style={{ width: 8, height: 8, borderRadius: '50%', background: branding.brand_primary_color }} />
                    }
                    <PdfCompany $c={branding.brand_primary_color} $ff={activeFontFF}>
                      {branding.brand_company_name || 'RankBrief'}
                    </PdfCompany>
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
              <FieldHint>Echtzeit-Vorschau — das finale PDF kann minimal abweichen</FieldHint>
            </Field>

            <Btn $variant="primary" onClick={saveBranding} disabled={brandingSaving || !isPro}>
              {brandingSaving ? 'Wird gespeichert...' : 'Branding speichern'}
            </Btn>
          </SectionBody>
        </Section>

        {/* ── Promo Code ──────────────────────────────────────────────────── */}
        {profile?.plan === 'free' && !profile?.promo_code_used && (
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
        )}

        {/* ── Google-Konten ─────────────────────────────────────────────── */}
        <Section>
          <SectionHead>
            <div>
              <SectionTitle>Verbundene Google-Konten</SectionTitle>
              <SectionSub>Diese Google-Accounts sind mit deinem RankBrief-Account verknüpft.</SectionSub>
            </div>
          </SectionHead>
          <SectionBody>
            {googleAccounts.length === 0 ? (
              <div style={{ fontSize: '0.875rem', color: '#888', fontWeight: 300 }}>
                Noch kein Google-Konto verbunden. Verbinde ein Konto über das Dashboard.
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
                        Verbunden {new Date(account.created_at).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionBody>
        </Section>

        {/* ── Account ─────────────────────────────────────────────────────── */}
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
              <Label>Neues Passwort</Label>
              <Input
                type="password"
                placeholder="Mindestens 8 Zeichen"
                value={pwNew}
                onChange={e => setPwNew(e.target.value)}
              />
            </Field>

            <Btn
              $variant="primary"
              onClick={handlePasswordChange}
              disabled={pwLoading || !pwNew}
            >
              {pwLoading ? 'Wird gespeichert...' : 'Passwort ändern'}
            </Btn>
          </SectionBody>
        </Section>

        {/* ── Danger Zone ────────────────────────────────────────────────── */}
        <Section>
          <SectionHead>
            <div>
              <SectionTitle style={{ color: '#EF4444' }}>Danger Zone</SectionTitle>
              <SectionSub>Irreversible Aktionen</SectionSub>
            </div>
          </SectionHead>
          <SectionBody>
            <DangerZone>
              <DangerTitle>Account löschen</DangerTitle>
              <DangerText>
                Löscht deinen Account, alle Properties und alle Report-Daten dauerhaft.
                Ein aktives Abo bitte vorher im Billing Portal kündigen.
              </DangerText>
              <Btn $variant="danger" onClick={() => setDeleteConfirm(true)}>
                Account löschen
              </Btn>
            </DangerZone>
          </SectionBody>
        </Section>
      </Main>
    </Layout>
  );
}
