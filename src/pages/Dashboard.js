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
  border: 1px solid ${({ $active, theme }) => $active ? 'rgba(108,99,255,0.3)' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.borderLight}; }
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [report, setReport] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  const connected = new URLSearchParams(location.search).get('connected') === 'true';
  const upgraded = new URLSearchParams(location.search).get('upgraded') === 'true';

  // Load properties on mount
  useEffect(() => {
    loadProperties();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('plan, plan_status')
      .eq('id', user.id)
      .single();
    setProfile(data);
  };

  const handleUpgrade = async (plan) => {
    setUpgrading(true);
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
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setUpgrading(false);
  };

  // Load report when property selected
  useEffect(() => {
    if (selectedProperty) loadLatestReport(selectedProperty.id);
  }, [selectedProperty]);

  const loadProperties = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    setProperties(data ?? []);
    if (data?.length > 0) setSelectedProperty(data[0]);
    setLoading(false);
  };

  const loadLatestReport = async (propertyId) => {
    setReportLoading(true);
    const { data: reportRows } = await supabase
      .from('reports')
      .select('*')
      .eq('property_id', propertyId)
      .eq('status', 'done')
      .order('report_month', { ascending: false })
      .limit(1);

    const reportData = reportRows?.[0] ?? null;


    if (reportData) {
      setReport(reportData);
      const { data: kw } = await supabase
        .from('report_keywords')
        .select('*')
        .eq('report_id', reportData.id)
        .order('rank');
      const { data: pg } = await supabase
        .from('report_pages')
        .select('*')
        .eq('report_id', reportData.id)
        .order('rank');
      setKeywords(kw ?? []);
      setPages(pg ?? []);
    } else {
      setReport(null);
      setKeywords([]);
      setPages([]);
    }
    setReportLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleConnectGoogle = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = 'https://ubexqxxkqjzhsgidsseh.supabase.co/functions/v1/google-oauth-callback';
    const SCOPES = [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
    ].join(' ');
    const state = encodeURIComponent(`${user.id}|Meine Website|`);
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

  const reportMonth = report
    ? new Date(report.report_month).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
    : null;

  return (
    <Layout>
      <TopBar>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
        <TopBarRight>
          <UserEmail>{user?.email}</UserEmail>
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

        {profile?.plan === 'free' && properties.length > 0 && (
          <ConnectBanner>
            <ConnectText>
              <h2>Upgrade auf Basic</h2>
              <p>Automatische monatliche Reports, KI-Zusammenfassung und PDF-Versand ab 19€/Monat.</p>
            </ConnectText>
            <BtnConnect onClick={() => handleUpgrade('basic')} disabled={upgrading}>
              {upgrading ? 'Wird geladen...' : 'Jetzt upgraden →'}
            </BtnConnect>
          </ConnectBanner>
        )}

        {loading ? <Spinner /> : (
          <>
            {/* No properties yet */}
            {properties.length === 0 && (
              <ConnectBanner>
                <ConnectText>
                  <h2>Google Search Console verbinden</h2>
                  <p>Verbinde deine GSC Property um automatische monatliche Reports zu erhalten.</p>
                </ConnectText>
                <BtnConnect onClick={handleConnectGoogle}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Connect Google Search Console
                </BtnConnect>
              </ConnectBanner>
            )}

            {/* Properties list */}
            {properties.length > 0 && (
              <>
                <SectionTitle>Deine Properties</SectionTitle>
                <PropertyList>
                  {properties.map(p => (
                    <PropertyCard
                      key={p.id}
                      $active={selectedProperty?.id === p.id}
                      onClick={() => setSelectedProperty(p)}
                    >
                      <PropertyInfo>
                        <PropertyDot $status={p.status} />
                        <div>
                          <PropertyName>{p.display_name}</PropertyName>
                          <PropertyUrl>{p.gsc_property_url}</PropertyUrl>
                        </div>
                      </PropertyInfo>
                      <PropertyMeta>
                        Verbunden {new Date(p.created_at).toLocaleDateString('de-DE')}
                      </PropertyMeta>
                    </PropertyCard>
                  ))}
                </PropertyList>

                {/* Report data */}
                {reportLoading ? <Spinner /> : (
                  <>
                    {report ? (
                      <>
                        <ReportPeriod>Report: {reportMonth}</ReportPeriod>

                        {/* KPIs */}
                        <KpiGrid>
                          <KpiCard>
                            <KpiLabel>Clicks</KpiLabel>
                            <KpiValue>{fmt(report.clicks)}</KpiValue>
                            {report.clicks_delta != null
                              ? <KpiDelta $up={report.clicks_delta >= 0}>{Math.abs(report.clicks_delta).toFixed(1)}% ggü. Vormonat</KpiDelta>
                              : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                          </KpiCard>
                          <KpiCard>
                            <KpiLabel>Impressionen</KpiLabel>
                            <KpiValue>{fmt(report.impressions)}</KpiValue>
                            {report.impressions_delta != null
                              ? <KpiDelta $up={report.impressions_delta >= 0}>{Math.abs(report.impressions_delta).toFixed(1)}%</KpiDelta>
                              : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                          </KpiCard>
                          <KpiCard>
                            <KpiLabel>Ø CTR</KpiLabel>
                            <KpiValue>{fmtPct(report.ctr)}</KpiValue>
                            {report.ctr_delta != null
                              ? <KpiDelta $up={report.ctr_delta >= 0}>{Math.abs(report.ctr_delta).toFixed(2)}%</KpiDelta>
                              : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                          </KpiCard>
                          <KpiCard>
                            <KpiLabel>Ø Position</KpiLabel>
                            <KpiValue>{fmtPos(report.avg_position)}</KpiValue>
                            {report.position_delta != null
                              ? <KpiDelta $up={report.position_delta <= 0}>{Math.abs(report.position_delta).toFixed(1)}</KpiDelta>
                              : <KpiEmpty>Kein Vergleich</KpiEmpty>}
                          </KpiCard>
                        </KpiGrid>

                        {/* AI Summary */}
                        <SectionTitle>KI-Zusammenfassung</SectionTitle>
                        <SummaryCard>
                          {report.summary_text
                            ? <SummaryText>{report.summary_text}</SummaryText>
                            : <SummaryEmpty>
                                🤖 Noch keine KI-Zusammenfassung vorhanden. Wird automatisch beim nächsten Report generiert.
                              </SummaryEmpty>}
                        </SummaryCard>

                        {/* Keywords + Pages */}
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
                              : <TableEmpty>
                                  Keine Keyword-Daten.<br/>
                                  <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{color: '#6C63FF'}}>GSC einrichten →</a>
                                </TableEmpty>}
                          </TableCard>

                          <TableCard>
                            <TableHeader>Top Seiten</TableHeader>
                            {pages.length > 0
                              ? pages.map(p => (
                                  <TableRow key={p.id}>
                                    <TableLabel title={p.page_url}>
                                      {p.page_url.replace(/^https?:\/\/[^/]+/, '') || '/'}
                                    </TableLabel>
                                    <TableVal>{p.clicks} Klicks</TableVal>
                                  </TableRow>
                                ))
                              : <TableEmpty>
                                  Keine Seiten-Daten.<br/>
                                  <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{color: '#6C63FF'}}>GSC einrichten →</a>
                                </TableEmpty>}
                          </TableCard>
                        </TableGrid>

                        {/* GA4 */}
                        {report.sessions === 0 && (
                          <Alert $type="info">
                            💡 GA4-Daten fehlen. <a href="https://analytics.google.com" target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>GA4 einrichten</a> und beim nächsten Report wird die Engagement Rate automatisch erfasst.
                          </Alert>
                        )}
                      </>
                    ) : (
                      <EmptyState>
                        <EmptyIcon>📭</EmptyIcon>
                        <EmptyTitle>Noch kein Report vorhanden</EmptyTitle>
                        <EmptyText>Der erste Report wird automatisch am 1. des nächsten Monats generiert.</EmptyText>
                      </EmptyState>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Main>
    </Layout>
  );
}
