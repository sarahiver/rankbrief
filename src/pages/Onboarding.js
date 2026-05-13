import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// =============================================================================
// RankBrief Onboarding Wizard
// Routes: /onboarding (full-screen wizard)
//
// Flow:
//   Step 1: Konto erstellt (auto-complete wenn User eingeloggt)
//   Step 2: Google verbinden (OAuth-Start-Button)
//   Step 3: GSC Property wählen (multi-select, ohne Klick-Zahlen v1)
//   Step 4: GA4 zuordnen (manuelle Eingabe oder Skip)
//   Step 5: Erster Report (Trigger + Wartebildschirm)
//
// Query params:
//   ?step=property&google_account_id=XXX  → direkt zu Step 3 nach OAuth-Return
//   ?step=ga4                             → direkt zu Step 4
//   ?step=report                          → direkt zu Step 5
// =============================================================================

// ── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50%      { opacity: 1; }
`;

// ── Layout ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: #0f0f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  @media (max-width: 768px) { padding: 1rem 0.75rem; }
`;

const Logo = styled(Link)`
  position: absolute;
  top: 1.5rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  text-decoration: none;
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  span { color: #6C63FF; }
  @media (max-width: 768px) { top: 1rem; left: 1rem; }
`;
const LogoDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6C63FF;
  box-shadow: 0 0 8px #6C63FF;
`;

const WizardCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 280px 1fr;
  max-width: 880px;
  width: 100%;
  min-height: 560px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  animation: ${fadeUp} 0.4s ease both;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

// ── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = styled.aside`
  background: #fafafa;
  padding: 2rem 1.5rem;
  border-right: 1px solid #f0f0f4;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #f0f0f4;
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
    gap: 0.5rem;
  }
`;
const SidebarLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  @media (max-width: 768px) { display: none; }
`;
const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  opacity: ${({ $active, $done }) => ($active || $done ? 1 : 0.5)};
  transition: opacity 0.2s;
  @media (max-width: 768px) {
    flex-shrink: 0;
    padding: 0.5rem 0.75rem;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    min-width: 100px;
    text-align: center;
  }
`;
const StepBubble = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $done, $active }) =>
    $done ? '#1a1a2e' : $active ? '#6C63FF' : 'transparent'};
  color: ${({ $done, $active }) => ($done || $active ? '#fff' : '#888')};
  border: 2px solid ${({ $done, $active }) =>
    $done ? '#1a1a2e' : $active ? '#6C63FF' : '#d4d4dc'};
`;
const StepText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;
const StepTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a2e;
  @media (max-width: 768px) { font-size: 0.75rem; }
`;
const StepSub = styled.div`
  font-size: 0.75rem;
  color: ${({ $active }) => ($active ? '#6C63FF' : '#888')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  @media (max-width: 768px) { display: none; }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f4;
  font-size: 0.75rem;
  color: #888;
  line-height: 1.5;
  @media (max-width: 768px) { display: none; }
`;

// ── Main content area ───────────────────────────────────────────────────────
const Main = styled.section`
  padding: 2.5rem 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) { padding: 1.5rem 1.25rem; }
`;
const MainHeader = styled.div`
  margin-bottom: 1.5rem;
`;
const StepCounter = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.375rem;
`;
const MainTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.02em;
  margin: 0 0 0.375rem;
  line-height: 1.2;
`;
const MainSub = styled.p`
  font-size: 0.9375rem;
  color: #52526e;
  margin: 0;
  line-height: 1.5;
`;

const MainBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  min-height: 200px;
`;

const MainFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f4;
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;
const FooterMeta = styled.div`
  font-size: 0.8125rem;
  color: #888;
`;

const ButtonPrimary = styled.button`
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.15s;
  &:hover:not(:disabled) { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const ButtonGhost = styled.button`
  background: transparent;
  color: #6C63FF;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: rgba(108, 99, 255, 0.06); }
`;

const ErrorMsg = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
`;

// ── Property cards ──────────────────────────────────────────────────────────
const PropertyCard = styled.div`
  background: ${({ $selected, $disabled }) =>
    $disabled ? '#fafafa' : $selected ? '#1a1a2e' : '#fff'};
  border: 1px solid ${({ $selected, $disabled }) =>
    $disabled ? '#f0f0f4' : $selected ? '#1a1a2e' : '#e8e8f5'};
  border-radius: 10px;
  padding: 0.875rem 1rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.15s;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  &:hover {
    border-color: ${({ $disabled, $selected }) =>
      $disabled ? '#f0f0f4' : $selected ? '#1a1a2e' : '#6C63FF'};
  }
`;
const Checkbox = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1.5px solid ${({ $checked }) => ($checked ? '#6C63FF' : '#d4d4dc')};
  background: ${({ $checked }) => ($checked ? '#6C63FF' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
`;
const PropertyInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;
const PropertyName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $onDark }) => ($onDark ? '#fff' : '#1a1a2e')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const PropertyMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ $onDark }) => ($onDark ? '#aaa' : '#888')};
`;

const InfoBox = styled.div`
  background: rgba(108, 99, 255, 0.06);
  border-left: 3px solid #6C63FF;
  border-radius: 0 8px 8px 0;
  padding: 0.75rem 0.875rem;
  font-size: 0.8125rem;
  color: #52526e;
  line-height: 1.5;
`;

// ── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const LoadingWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 240px;
`;
const LoadingIcon = styled.div`
  font-size: 2.5rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;
const LoadingText = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
`;
const LoadingSub = styled.div`
  font-size: 0.8125rem;
  color: #888;
  text-align: center;
  max-width: 280px;
  line-height: 1.5;
`;

// ── GA4 inputs ───────────────────────────────────────────────────────────────
const GA4Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #fafafa;
  border: 1px solid #f0f0f4;
  border-radius: 10px;
`;
const GA4Label = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a1a2e;
`;
const GA4Input = styled.input`
  border: 1px solid #e8e8f5;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-family: monospace;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #6C63FF;
  }
`;
const GA4Hint = styled.div`
  font-size: 0.75rem;
  color: #888;
`;

// =============================================================================
// Step Definitions
// =============================================================================
const STEPS = [
  { key: 'account',  label: 'Konto erstellt',    sub: 'E-Mail bestätigt' },
  { key: 'google',   label: 'Google verbinden',  sub: 'Search Console & GA4' },
  { key: 'property', label: 'Property wählen',   sub: 'Website auswählen' },
  { key: 'ga4',      label: 'GA4 zuordnen',      sub: 'Optional' },
  { key: 'report',   label: 'Erster Report',     sub: 'In ~60 Sekunden' },
];

// =============================================================================
// Helper: map query param to step index
// =============================================================================
function parseStepFromQuery(searchParams) {
  const stepKey = searchParams.get('step');
  if (!stepKey) return null;
  const idx = STEPS.findIndex(s => s.key === stepKey);
  return idx >= 0 ? idx : null;
}

// =============================================================================
// Main Component
// =============================================================================
export default function Onboarding({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Step state: 0..4 (index into STEPS)
  const [currentStep, setCurrentStep] = useState(() => {
    const fromQuery = parseStepFromQuery(searchParams);
    return fromQuery !== null ? fromQuery : 1; // Default: Step 2 (Google verbinden), weil Konto bereits erstellt
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Property step state
  const [gscProperties, setGscProperties] = useState([]); // [{ url, google_account_id }]
  const [selectedUrls, setSelectedUrls] = useState({});   // { url: google_account_id }
  const [propertyLimit, setPropertyLimit] = useState(1);

  // GA4 step state
  const [ga4Inputs, setGa4Inputs] = useState({}); // { url: ga4_id }

  // Report step state
  const [reportTriggered, setReportTriggered] = useState(false);

  // Google account id from OAuth callback
  const googleAccountId = searchParams.get('google_account_id');

  // ── Load profile + properties on mount ───────────────────────────────────
  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    try {
      // 1. Property-Limit aus profiles laden
      const { data: profile } = await supabase
        .from('profiles')
        .select('property_limit')
        .eq('id', user.id)
        .single();
      setPropertyLimit(profile?.property_limit ?? 1);

      // 2. Bestehende active Properties prüfen
      const { data: activeProps } = await supabase
        .from('properties')
        .select('id, gsc_property_url')
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Wenn bereits aktive Properties UND nicht via OAuth-Callback hier
      // → User ist fertig, zum Dashboard weiterleiten
      if ((activeProps?.length ?? 0) > 0 && !googleAccountId && currentStep < 4) {
        navigate('/dashboard');
        return;
      }

      // 3. Wenn google_account_id in URL → wir kommen frisch vom OAuth-Callback
      // → automatisch zu Step "property" wechseln und GSC-Properties laden
      if (googleAccountId) {
        await loadGscProperties();
        if (currentStep < 2) setCurrentStep(2);
      }
    } catch (err) {
      console.error('loadInitial error:', err);
    }
    setLoading(false);
  };

  // ── Load GSC properties (von get-gsc-properties Edge Function) ───────────
  const loadGscProperties = async () => {
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const { data: { session } } = await supabase.auth.getSession();
      const userToken = session?.access_token || SUPABASE_ANON;

      const res = await fetch(`${SUPABASE_URL}/functions/v1/get-gsc-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
          'apikey': SUPABASE_ANON,
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      const accounts = data.accounts ?? [];

      // Alle Properties flatten
      const allSites = [];
      for (const acc of accounts) {
        for (const site of (acc.sites ?? [])) {
          allSites.push({
            url: site,
            google_account_id: acc.google_account_id,
            google_email: acc.google_email,
          });
        }
      }
      setGscProperties(allSites);
    } catch (err) {
      console.error('loadGscProperties error:', err);
      setError('GSC-Properties konnten nicht geladen werden.');
    }
  };

  // ── Step 2: Google OAuth Start ───────────────────────────────────────────
  const startGoogleOAuth = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = 'https://ubexqxxkqjzhsgidsseh.supabase.co/functions/v1/google-oauth-callback';
    const SCOPES = [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ');
    const state = encodeURIComponent(`${user.id}||onboarding`);
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('include_granted_scopes', 'true');
    window.location.href = authUrl.toString();
  };

  // ── Step 3: Property selection ───────────────────────────────────────────
  const toggleProperty = (url, accountId) => {
    setSelectedUrls(prev => {
      const next = { ...prev };
      if (next[url]) {
        delete next[url];
      } else {
        // Limit-Check
        const currentCount = Object.keys(next).length;
        if (currentCount >= propertyLimit) {
          // Radio-Verhalten: wenn Limit=1, alte abwählen
          if (propertyLimit === 1) {
            return { [url]: accountId };
          }
          setError(`Du kannst maximal ${propertyLimit} ${propertyLimit === 1 ? 'Property' : 'Properties'} auswählen.`);
          return prev;
        }
        next[url] = accountId;
      }
      setError('');
      return next;
    });
  };

  const continueToGa4 = () => {
    if (Object.keys(selectedUrls).length === 0) {
      setError('Bitte wähle mindestens eine Property aus.');
      return;
    }
    setError('');
    setCurrentStep(3); // GA4 step
  };

  // ── Step 4: GA4 (mit Skip-Option) ────────────────────────────────────────
  const handleGa4Change = (url, value) => {
    setGa4Inputs(prev => ({ ...prev, [url]: value }));
  };

  const continueToReport = async (skipGa4 = false) => {
    setLoading(true);
    setError('');

    try {
      // Properties in DB anlegen mit Token von google_accounts
      const googleAccountIds = [...new Set(Object.values(selectedUrls))];
      const { data: gaTokens } = await supabase
        .from('google_accounts')
        .select('id, refresh_token_encrypted, token_iv')
        .in('id', googleAccountIds);
      const tokenByAccountId = {};
      for (const ga of (gaTokens ?? [])) {
        tokenByAccountId[ga.id] = {
          refresh_token_encrypted: ga.refresh_token_encrypted,
          token_iv: ga.token_iv,
        };
      }

      const newPropertyIds = [];

      for (const [url, accountId] of Object.entries(selectedUrls)) {
        // Prüfen ob Property bereits in DB existiert
        const { data: existing } = await supabase
          .from('properties')
          .select('id, status, first_report_triggered_at, refresh_token_encrypted')
          .eq('user_id', user.id)
          .eq('gsc_property_url', url)
          .maybeSingle();

        const ga4Value = skipGa4 ? null : (ga4Inputs[url]?.trim() || null);
        const tokenData = tokenByAccountId[accountId] || {};

        if (existing) {
          const updates = {
            status: 'active',
            last_synced_at: new Date().toISOString(),
          };
          if (ga4Value) updates.ga_property_id = ga4Value;
          if (!existing.refresh_token_encrypted && tokenData.refresh_token_encrypted) {
            updates.refresh_token_encrypted = tokenData.refresh_token_encrypted;
            updates.token_iv = tokenData.token_iv;
          }
          await supabase.from('properties').update(updates).eq('id', existing.id);
          if (!existing.first_report_triggered_at) newPropertyIds.push(existing.id);
        } else {
          const { data: inserted } = await supabase
            .from('properties')
            .insert({
              user_id: user.id,
              google_account_id: accountId,
              gsc_property_url: url,
              display_name: url,
              status: 'active',
              ga_property_id: ga4Value,
              last_synced_at: new Date().toISOString(),
              refresh_token_encrypted: tokenData.refresh_token_encrypted ?? null,
              token_iv: tokenData.token_iv ?? null,
            })
            .select('id')
            .single();
          if (inserted?.id) newPropertyIds.push(inserted.id);
        }
      }

      // Pending bereinigen
      await supabase
        .from('properties')
        .delete()
        .eq('user_id', user.id)
        .eq('status', 'pending');

      // Sofort-Report-Trigger für alle neuen Properties
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const { data: { session } } = await supabase.auth.getSession();
      const userToken = session?.access_token || SUPABASE_ANON;

      for (const propertyId of newPropertyIds) {
        fetch(`${SUPABASE_URL}/functions/v1/run-monthly-reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
            'apikey': SUPABASE_ANON,
          },
          body: JSON.stringify({ property_id: propertyId, force: true }),
        }).catch(err => console.error('First-report trigger failed:', err));
      }

      setReportTriggered(true);
      setCurrentStep(4); // Report step
    } catch (err) {
      console.error('continueToReport error:', err);
      setError('Beim Speichern ist etwas schiefgelaufen. Bitte versuche es erneut.');
    }
    setLoading(false);
  };

  // ── Step 5: Report wartebildschirm → nach 5s zum Dashboard ──────────────
  useEffect(() => {
    if (currentStep === 4 && reportTriggered) {
      const timer = setTimeout(() => {
        navigate('/dashboard?connected=true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, reportTriggered, navigate]);

  // =============================================================================
  // Render
  // =============================================================================

  const renderStepContent = () => {
    // Step 0: Konto erstellt — sollten wir nicht zeigen, weil User bereits hier ist
    // Step 1: Google verbinden
    if (currentStep === 1) {
      return (
        <>
          <MainHeader>
            <StepCounter>Schritt 2 von 5</StepCounter>
            <MainTitle>Verbinde dein Google-Konto</MainTitle>
            <MainSub>
              Wir brauchen Lese-Zugriff auf Google Search Console und Analytics,
              um deinen Report zu erstellen. Du kannst die Verbindung jederzeit trennen.
            </MainSub>
          </MainHeader>
          <MainBody>
            <InfoBox>
              <strong>Lese-Zugriff (read-only).</strong> RankBrief kann ausschließlich
              deine SEO-Daten lesen — nichts ändern, nichts veröffentlichen.
              OAuth-Tokens sind AES-256-verschlüsselt und auf EU-Servern gespeichert.
            </InfoBox>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </MainBody>
          <MainFooter>
            <FooterMeta>Erster Report ist kostenlos — keine Kreditkarte nötig.</FooterMeta>
            <ButtonPrimary onClick={startGoogleOAuth}>
              Mit Google verbinden →
            </ButtonPrimary>
          </MainFooter>
        </>
      );
    }

    // Step 2: Property wählen
    if (currentStep === 2) {
      const selectedCount = Object.keys(selectedUrls).length;
      return (
        <>
          <MainHeader>
            <StepCounter>Schritt 3 von 5</StepCounter>
            <MainTitle>Wähle deine Property</MainTitle>
            <MainSub>
              {propertyLimit === 1
                ? 'Wähle eine Website für deinen ersten Report.'
                : `Wähle bis zu ${propertyLimit} Websites für deine Reports.`}
            </MainSub>
          </MainHeader>
          <MainBody>
            {loading ? (
              <LoadingWrap>
                <Spinner style={{ color: '#6C63FF' }} />
                <LoadingText>Lade deine Properties…</LoadingText>
              </LoadingWrap>
            ) : gscProperties.length === 0 ? (
              <InfoBox>
                Wir konnten keine Search Console Properties in deinem Google-Konto finden.
                Stelle sicher, dass du in der{' '}
                <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: '#6C63FF' }}>
                  Google Search Console
                </a>
                {' '}eine Property verifiziert hast.
              </InfoBox>
            ) : (
              gscProperties.map(prop => {
                const selected = !!selectedUrls[prop.url];
                return (
                  <PropertyCard
                    key={prop.url}
                    $selected={selected}
                    onClick={() => toggleProperty(prop.url, prop.google_account_id)}
                  >
                    <Checkbox $checked={selected}>{selected && '✓'}</Checkbox>
                    <PropertyInfo>
                      <PropertyName $onDark={selected}>{prop.url}</PropertyName>
                      <PropertyMeta $onDark={selected}>{prop.google_email}</PropertyMeta>
                    </PropertyInfo>
                  </PropertyCard>
                );
              })
            )}
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </MainBody>
          <MainFooter>
            <FooterMeta>
              {selectedCount} {selectedCount === 1 ? 'Property' : 'Properties'} ausgewählt
            </FooterMeta>
            <ButtonPrimary
              onClick={continueToGa4}
              disabled={selectedCount === 0 || loading}
            >
              Weiter zu GA4 →
            </ButtonPrimary>
          </MainFooter>
        </>
      );
    }

    // Step 3: GA4 zuordnen
    if (currentStep === 3) {
      const selectedUrlsList = Object.keys(selectedUrls);
      return (
        <>
          <MainHeader>
            <StepCounter>Schritt 4 von 5</StepCounter>
            <MainTitle>Google Analytics zuordnen (optional)</MainTitle>
            <MainSub>
              Gib für jede Property die GA4 Property ID ein — oder überspringe diesen
              Schritt und füge sie später hinzu.
            </MainSub>
          </MainHeader>
          <MainBody>
            {selectedUrlsList.map(url => (
              <GA4Row key={url}>
                <GA4Label>{url}</GA4Label>
                <GA4Input
                  type="text"
                  placeholder="z.B. 123456789"
                  value={ga4Inputs[url] || ''}
                  onChange={e => handleGa4Change(url, e.target.value.replace(/\D/g, ''))}
                />
                <GA4Hint>
                  Zu finden in Google Analytics → Verwaltung → Property-Einstellungen
                </GA4Hint>
              </GA4Row>
            ))}
            <InfoBox>
              GA4-Daten sind <strong>optional</strong>. Dein Report enthält dann nur Search-Console-Daten
              (Klicks, Impressionen, Keywords) — was für die meisten Reports ausreicht.
            </InfoBox>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </MainBody>
          <MainFooter>
            <ButtonGhost onClick={() => continueToReport(true)} disabled={loading}>
              Überspringen
            </ButtonGhost>
            <ButtonPrimary onClick={() => continueToReport(false)} disabled={loading}>
              {loading ? <Spinner /> : <>Report erstellen →</>}
            </ButtonPrimary>
          </MainFooter>
        </>
      );
    }

    // Step 4: Erster Report — Wartebildschirm
    if (currentStep === 4) {
      return (
        <>
          <MainHeader>
            <StepCounter>Schritt 5 von 5</StepCounter>
            <MainTitle>Dein erster Report wird erstellt ✨</MainTitle>
            <MainSub>
              Wir holen deine SEO-Daten ab, generieren die KI-Zusammenfassung und schicken
              dir das PDF per Mail.
            </MainSub>
          </MainHeader>
          <MainBody>
            <LoadingWrap>
              <LoadingIcon>📊</LoadingIcon>
              <LoadingText>Report wird generiert…</LoadingText>
              <LoadingSub>
                Du wirst gleich zum Dashboard weitergeleitet. Die Mail mit deinem PDF-Report
                kommt in den nächsten 60 Sekunden.
              </LoadingSub>
            </LoadingWrap>
          </MainBody>
        </>
      );
    }

    return null;
  };

  return (
    <Page>
      <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
      <WizardCard>
        <Sidebar>
          <SidebarLabel>Setup</SidebarLabel>
          {STEPS.map((step, idx) => {
            const done = idx < currentStep;
            const active = idx === currentStep;
            return (
              <StepItem key={step.key} $active={active} $done={done}>
                <StepBubble $done={done} $active={active}>
                  {done ? '✓' : idx + 1}
                </StepBubble>
                <StepText>
                  <StepTitle>{step.label}</StepTitle>
                  <StepSub $active={active}>
                    {active ? 'Aktueller Schritt' : step.sub}
                  </StepSub>
                </StepText>
              </StepItem>
            );
          })}
          <SidebarFooter>
            Erster Report ist kostenlos — keine Kreditkarte nötig.
          </SidebarFooter>
        </Sidebar>
        <Main>
          {renderStepContent()}
        </Main>
      </WizardCard>
    </Page>
  );
}
