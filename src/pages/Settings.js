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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Password change state
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // GA4 edit state per property
  const [ga4Edits, setGa4Edits] = useState({});
  const [ga4Saving, setGa4Saving] = useState({});

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: prof }, { data: props }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('properties').select('*').eq('user_id', user.id).order('created_at'),
    ]);
    setProfile(prof);
    setProperties(props ?? []);
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
            <ModalText>
              Dein Account, alle Properties und alle Report-Daten werden dauerhaft gelöscht.
              Ein aktives Abonnement wird nicht automatisch gekündigt – bitte zuerst über
              das Billing-Portal kündigen.
            </ModalText>
            <ModalActions>
              <Btn onClick={() => setDeleteConfirm(false)}>Abbrechen</Btn>
              <Btn $variant="danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? 'Wird gelöscht...' : 'Account löschen'}
              </Btn>
            </ModalActions>
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

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {isPaid && (
                <Btn $variant="primary" onClick={handlePortal} disabled={portalLoading}>
                  {portalLoading ? 'Wird geladen...' : '↗ Billing Portal öffnen'}
                </Btn>
              )}
              {isFree && (
                <>
                  <Btn $variant="primary" onClick={() => handleUpgrade('basic')}>
                    Basic – €19/mo
                  </Btn>
                  <Btn onClick={() => handleUpgrade('pro')}>
                    Pro – €39/mo
                  </Btn>
                  <Btn onClick={() => handleUpgrade('agency')}>
                    Agency – €79/mo
                  </Btn>
                </>
              )}
              {plan === 'basic' && (
                <Btn onClick={() => handleUpgrade('pro')}>
                  Upgrade auf Pro – €39/mo →
                </Btn>
              )}
              {plan === 'pro' && (
                <Btn onClick={() => handleUpgrade('agency')}>
                  Upgrade auf Agency – €79/mo →
                </Btn>
              )}
            </div>

            {isPaid && (
              <FieldHint style={{ marginTop: '0.75rem' }}>
                Im Billing Portal kannst du deinen Plan ändern, Zahlungsmethode aktualisieren und kündigen.
              </FieldHint>
            )}
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

        {/* ── Account ────────────────────────────────────────────────────── */}
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
