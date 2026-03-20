import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ── Hardcoded admin UID – only this user can access /admin ────────────────────
const ADMIN_UID = process.env.REACT_APP_ADMIN_UID || '';

const fadeUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
const spin    = keyframes`to{transform:rotate(360deg)}`;

const Layout   = styled.div`min-height:100vh;background:${({theme})=>theme.colors.bg};display:flex;flex-direction:column;`;
const TopBar   = styled.header`height:60px;border-bottom:1px solid ${({theme})=>theme.colors.border};display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:${({theme})=>theme.colors.bgCard};position:sticky;top:0;z-index:10;`;
const Logo     = styled.div`font-family:${({theme})=>theme.fonts.display};font-weight:800;font-size:1rem;letter-spacing:-0.03em;display:flex;align-items:center;gap:0.4rem;span{color:${({theme})=>theme.colors.accent}}`;
const LogoDot  = styled.div`width:7px;height:7px;border-radius:50%;background:${({theme})=>theme.colors.accent};`;
const AdminBadge = styled.div`font-size:0.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:0.2rem 0.6rem;border-radius:99px;background:rgba(239,68,68,0.1);color:#EF4444;border:1px solid rgba(239,68,68,0.2);`;
const BtnSm    = styled.button`font-size:0.8125rem;color:${({theme})=>theme.colors.textDim};padding:0.375rem 0.875rem;border-radius:${({theme})=>theme.radius.md};border:1px solid ${({theme})=>theme.colors.border};transition:all .2s;&:hover{color:${({theme})=>theme.colors.text}}`;
const Main     = styled.main`max-width:1200px;width:100%;margin:0 auto;padding:2rem;animation:${fadeUp} .4s ease both;`;

// Stats row
const StatsGrid = styled.div`display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;margin-bottom:2rem;@media(max-width:900px){grid-template-columns:repeat(2,1fr)}`;
const StatCard  = styled.div`background:${({theme})=>theme.colors.bgCard};border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius.lg};padding:1.25rem;border-left:3px solid ${({$color})=>$color||'#6C63FF'}`;
const StatLabel = styled.div`font-size:0.75rem;color:${({theme})=>theme.colors.textDim};text-transform:uppercase;letter-spacing:.08em;margin-bottom:.375rem;`;
const StatValue = styled.div`font-family:${({theme})=>theme.fonts.display};font-size:1.75rem;font-weight:700;letter-spacing:-.03em;`;

// Tabs
const Tabs      = styled.div`display:flex;gap:.5rem;margin-bottom:1.5rem;border-bottom:1px solid ${({theme})=>theme.colors.border};padding-bottom:.5rem;`;
const Tab       = styled.button`font-size:.875rem;font-weight:${({$active})=>$active?'700':'400'};color:${({$active,theme})=>$active?theme.colors.accent:theme.colors.textMuted};padding:.5rem 1rem;border-radius:${({theme})=>theme.radius.md};background:${({$active,theme})=>$active?theme.colors.accentDim:'transparent'};transition:all .15s;&:hover{color:${({theme})=>theme.colors.accent}}`;

// Table
const TableWrap = styled.div`background:${({theme})=>theme.colors.bgCard};border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius.lg};overflow:hidden;`;
const THead     = styled.div`display:grid;grid-template-columns:${({$cols})=>$cols};padding:.625rem 1rem;background:${({theme})=>theme.colors.bg};border-bottom:1px solid ${({theme})=>theme.colors.border};font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${({theme})=>theme.colors.textDim};`;
const TRow      = styled.div`display:grid;grid-template-columns:${({$cols})=>$cols};padding:.625rem 1rem;border-bottom:1px solid ${({theme})=>theme.colors.border};align-items:center;gap:.5rem;&:last-child{border-bottom:none};&:hover{background:${({theme})=>theme.colors.bg}}`;
const TCell     = styled.div`font-size:.8125rem;color:${({theme})=>theme.colors.text};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
const TCellMono = styled(TCell)`font-family:${({theme})=>theme.fonts.mono};color:${({theme})=>theme.colors.textMuted};font-size:.75rem;`;

// Badges
const PlanBadge = styled.span`font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:.2rem .5rem;border-radius:99px;background:${({$plan})=>$plan==='agency'?'rgba(245,158,11,.12)':$plan==='pro'?'rgba(108,99,255,.12)':$plan==='basic'?'rgba(16,185,129,.12)':'rgba(148,163,184,.12)'};color:${({$plan})=>$plan==='agency'?'#D97706':$plan==='pro'?'#6C63FF':$plan==='basic'?'#059669':'#94A3B8'};`;
const StatusDot = styled.span`display:inline-block;width:7px;height:7px;border-radius:50%;background:${({$ok})=>$ok?'#10B981':'#EF4444'};margin-right:.4rem;`;

// Action buttons
const ActionBtn = styled.button`font-size:.75rem;font-weight:600;padding:.25rem .625rem;border-radius:${({theme})=>theme.radius.md};border:1px solid ${({$danger,theme})=>$danger?'rgba(239,68,68,.3)':theme.colors.border};color:${({$danger,theme})=>$danger?'#EF4444':theme.colors.textMuted};background:transparent;transition:all .15s;&:hover{background:${({$danger})=>$danger?'rgba(239,68,68,.08)':'rgba(108,99,255,.06)'};color:${({$danger,theme})=>$danger?'#EF4444':theme.colors.accent};border-color:${({$danger,theme})=>$danger?'rgba(239,68,68,.5)':theme.colors.accent};}&:disabled{opacity:.4;cursor:not-allowed}`;

// Modal
const Overlay   = styled.div`position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;`;
const ModalBox  = styled.div`background:${({theme})=>theme.colors.bgCard};border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius.xl};padding:2rem;max-width:480px;width:100%;`;
const ModalTitle= styled.h2`font-family:${({theme})=>theme.fonts.display};font-size:1.125rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.5rem;`;
const ModalSub  = styled.p`font-size:.875rem;color:${({theme})=>theme.colors.textMuted};font-weight:300;margin-bottom:1.5rem;line-height:1.6;`;
const Select    = styled.select`width:100%;padding:.625rem .875rem;background:${({theme})=>theme.colors.bg};border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius.md};color:${({theme})=>theme.colors.text};font-size:.9375rem;margin-bottom:1rem;outline:none;`;
const BtnRow    = styled.div`display:flex;gap:.75rem;justify-content:flex-end;`;
const BtnPrimary= styled.button`padding:.625rem 1.25rem;background:${({theme})=>theme.colors.accent};color:#fff;font-weight:700;font-size:.875rem;border-radius:${({theme})=>theme.radius.md};transition:all .2s;&:hover{background:${({theme})=>theme.colors.accentHover}}&:disabled{opacity:.5;cursor:not-allowed}`;
const BtnGhost  = styled.button`padding:.625rem 1.25rem;color:${({theme})=>theme.colors.textMuted};font-size:.875rem;border-radius:${({theme})=>theme.radius.md};transition:color .2s;&:hover{color:${({theme})=>theme.colors.text}}`;
const BtnDanger = styled.button`padding:.625rem 1.25rem;background:rgba(239,68,68,.1);color:#EF4444;font-weight:700;font-size:.875rem;border-radius:${({theme})=>theme.radius.md};border:1px solid rgba(239,68,68,.2);transition:all .2s;&:hover{background:rgba(239,68,68,.18)}&:disabled{opacity:.5;cursor:not-allowed}`;

const Spinner   = styled.div`width:20px;height:20px;border:2px solid ${({theme})=>theme.colors.border};border-top-color:${({theme})=>theme.colors.accent};border-radius:50%;animation:${spin} .7s linear infinite;margin:3rem auto;`;

// ── Password Gate ─────────────────────────────────────────────────────────────
const GatePage  = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;background:${({theme})=>theme.colors.bg};`;
const GateCard  = styled.div`background:${({theme})=>theme.colors.bgCard};border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius.xl};padding:2.5rem;width:100%;max-width:380px;animation:${fadeUp} .4s ease both;`;
const GateLogo  = styled.div`font-family:${({theme})=>theme.fonts.display};font-weight:800;font-size:1rem;letter-spacing:-.03em;display:flex;align-items:center;gap:.4rem;margin-bottom:1.75rem;span{color:${({theme})=>theme.colors.accent}}`;
const GateTitle = styled.h1`font-family:${({theme})=>theme.fonts.display};font-size:1.25rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.375rem;`;
const GateSub   = styled.p`font-size:.875rem;color:${({theme})=>theme.colors.textMuted};font-weight:300;margin-bottom:1.5rem;`;
const GateInput = styled.input`width:100%;padding:.75rem 1rem;box-sizing:border-box;background:${({theme})=>theme.colors.bg};border:1px solid ${({$err,theme})=>$err?theme.colors.danger:theme.colors.border};border-radius:${({theme})=>theme.radius.md};color:${({theme})=>theme.colors.text};font-size:.9375rem;outline:none;margin-bottom:.75rem;transition:border-color .2s;&:focus{border-color:${({theme})=>theme.colors.accent}}&::placeholder{color:${({theme})=>theme.colors.textDim}}`;
const GateBtn   = styled.button`width:100%;padding:.875rem;background:${({theme})=>theme.colors.accent};color:#fff;font-family:${({theme})=>theme.fonts.display};font-weight:700;font-size:1rem;border-radius:${({theme})=>theme.radius.md};transition:all .2s;&:hover:not(:disabled){background:${({theme})=>theme.colors.accentHover};transform:translateY(-1px)}&:disabled{opacity:.5;cursor:not-allowed}`;
const GateErr   = styled.div`font-size:.8125rem;color:${({theme})=>theme.colors.danger};margin-bottom:.75rem;`;
const SearchInput = styled.input`padding:.5rem .875rem;background:${({theme})=>theme.colors.bg};border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius.md};color:${({theme})=>theme.colors.text};font-size:.875rem;width:260px;outline:none;transition:border-color .2s;&:focus{border-color:${({theme})=>theme.colors.accent}}&::placeholder{color:${({theme})=>theme.colors.textDim}}`;
const Alert     = styled.div`padding:.75rem 1rem;border-radius:${({theme})=>theme.radius.md};font-size:.875rem;margin-bottom:1rem;background:${({$err})=>$err?'rgba(239,68,68,.1)':'rgba(16,185,129,.08)'};border:1px solid ${({$err})=>$err?'rgba(239,68,68,.2)':'rgba(16,185,129,.2)'};color:${({$err})=>$err?'#EF4444':'#10B981'};`;

const ADMIN_PW_KEY = 'rb_admin_unlocked';
const ADMIN_PW     = process.env.REACT_APP_ADMIN_PW || 'rankbrief-admin';
const PLANS = ['free','basic','pro','agency'];
const COLS_USERS = '2fr 1fr 1fr 1fr 1fr 1fr 1.5fr';
const COLS_REPORTS = '2fr 1fr 1fr 1fr 1fr';
const COLS_PROPS = '2fr 1fr 1fr 1fr 1fr';

function fmtDate(d) {
  if (!d) return '–';
  return new Date(d).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'2-digit' });
}

export default function Admin({ user }) {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_PW_KEY) === '1');
  const [pwInput, setPwInput]   = useState('');
  const [pwErr, setPwErr]       = useState(false);
  const [tab, setTab]           = useState('users');
  const [users, setUsers]     = useState([]);
  const [reports, setReports] = useState([]);
  const [props, setProps]     = useState([]);
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [alert, setAlert]     = useState(null);
  const [modal, setModal]     = useState(null); // { type: 'plan'|'delete'|'report_delete', user?, prop?, report? }
  const [saving, setSaving]   = useState(false);
  const [newPlan, setNewPlan] = useState('free');

  // Guard: only admin
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (ADMIN_UID && user.id !== ADMIN_UID) { navigate('/dashboard'); return; }
    loadAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePwSubmit = () => {
    if (pwInput === ADMIN_PW) {
      sessionStorage.setItem(ADMIN_PW_KEY, '1');
      setUnlocked(true);
      setPwErr(false);
    } else {
      setPwErr(true);
      setPwInput('');
    }
  };

  const showAlert = (msg, err = false) => {
    setAlert({ msg, err });
    setTimeout(() => setAlert(null), 3500);
  };

  const loadAll = async () => {
    setLoading(true);
    const [
      { data: profiles },
      { data: allReports },
      { data: allProps },
    ] = await Promise.all([
      supabase.from('profiles').select('id, plan, plan_status, free_report_sent, promo_code_used, trial_ends_at, created_at, report_language, email').order('created_at', { ascending: false }),
      supabase.from('reports').select('id, property_id, report_month, clicks, status, pdf_url, summary_text, created_at').order('created_at', { ascending: false }).limit(200),
      supabase.from('properties').select('id, user_id, gsc_property_url, display_name, status, ga_property_id, created_at').order('created_at', { ascending: false }),
    ]);

    // ── Load emails: profiles.email first, then Edge Function for missing ──
    // Build initial email map from profiles.email column
    const emailMap = {};
    (profiles || []).forEach(p => { if (p.email) emailMap[p.id] = p.email; });

    // Also pull google_accounts emails as fallback
    const { data: gAccounts } = await supabase
      .from('google_accounts')
      .select('user_id, google_email');
    (gAccounts || []).forEach(g => { if (!emailMap[g.user_id]) emailMap[g.user_id] = g.google_email; });

    // If any profiles still missing email → call Edge Function (uses service role)
    const missingEmails = (profiles || []).filter(p => !emailMap[p.id]);
    if (missingEmails.length > 0) {
      try {
        const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${SUPABASE_URL}/functions/v1/get-admin-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
          },
        });
        const result = await res.json();
        if (result.emailMap) {
          Object.assign(emailMap, result.emailMap);
        }
      } catch (e) {
        console.warn('Could not load emails via Edge Function:', e);
      }
    }

    const profilesWithEmail = (profiles || []).map(p => ({
      ...p,
      email: emailMap[p.id] || p.id.slice(0, 12) + '…',
    }));

    // Count reports per property
    const reportsByProp = {};
    (allReports || []).forEach(r => {
      reportsByProp[r.property_id] = (reportsByProp[r.property_id] || 0) + 1;
    });

    // Attach property count + email to user rows
    const propsByUser = {};
    (allProps || []).forEach(p => { propsByUser[p.user_id] = (propsByUser[p.user_id] || 0) + 1; });

    const reportsByUser = {};
    (allProps || []).forEach(p => {
      reportsByUser[p.user_id] = (reportsByUser[p.user_id] || 0) + (reportsByProp[p.id] || 0);
    });

    const usersEnriched = profilesWithEmail.map(p => ({
      ...p,
      property_count: propsByUser[p.id] || 0,
      report_count: reportsByUser[p.id] || 0,
    }));

    const allPropsEnriched = (allProps || []).map(p => ({
      ...p,
      report_count: reportsByProp[p.id] || 0,
      user_email: emailMap[p.user_id] || p.user_id.slice(0,8) + '…',
    }));

    setUsers(usersEnriched);
    setReports(allReports || []);
    setProps(allPropsEnriched);

    setStats({
      total_users:    (profiles || []).length,
      paid_users:     (profiles || []).filter(p => ['basic','pro','agency'].includes(p.plan)).length,
      free_users:     (profiles || []).filter(p => p.plan === 'free').length,
      total_reports:  (allReports || []).length,
      total_props:    (allProps || []).length,
      active_props:   (allProps || []).filter(p => p.status === 'active').length,
      agency_users:   (profiles || []).filter(p => p.plan === 'agency').length,
      pro_users:      (profiles || []).filter(p => p.plan === 'pro').length,
      basic_users:    (profiles || []).filter(p => p.plan === 'basic').length,
      reports_with_pdf: (allReports || []).filter(r => r.pdf_url).length,
    });
    setLoading(false);
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleChangePlan = async () => {
    if (!modal?.user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan, plan_status: newPlan === 'free' ? 'active' : 'active' })
      .eq('id', modal.user.id);
    setSaving(false);
    if (error) { showAlert('Fehler: ' + error.message, true); return; }
    showAlert(`Plan geändert → ${newPlan}`);
    setModal(null);
    loadAll();
  };

  const handleDeleteUser = async () => {
    if (!modal?.user) return;
    setSaving(true);
    // Delete cascades via RLS / FK: properties → reports → keywords/pages
    await supabase.from('properties').delete().eq('user_id', modal.user.id);
    await supabase.from('google_accounts').delete().eq('user_id', modal.user.id);
    await supabase.from('profiles').delete().eq('id', modal.user.id);
    // Note: auth.users requires service-role – show hint
    setSaving(false);
    showAlert('Profil + Daten gelöscht. Auth-User muss manuell in Supabase Auth gelöscht werden.');
    setModal(null);
    loadAll();
  };

  const handleDeleteReport = async () => {
    if (!modal?.report) return;
    setSaving(true);
    await supabase.from('report_keywords').delete().eq('report_id', modal.report.id);
    await supabase.from('report_pages').delete().eq('report_id', modal.report.id);
    await supabase.from('reports').delete().eq('id', modal.report.id);
    setSaving(false);
    showAlert('Report gelöscht.');
    setModal(null);
    loadAll();
  };

  const handleResetPromo = async (u) => {
    await supabase.from('profiles').update({ promo_code_used: false }).eq('id', u.id);
    showAlert('Promo-Code zurückgesetzt.');
    loadAll();
  };

  const handleFreeze = async (u) => {
    const newStatus = u.plan_status === 'frozen' ? 'active' : 'frozen';
    await supabase.from('profiles').update({ plan_status: newStatus }).eq('id', u.id);
    showAlert(`Account ${newStatus === 'frozen' ? 'eingefroren' : 'reaktiviert'}.`);
    loadAll();
  };

  // ── Filter ──────────────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filteredUsers   = users.filter(u => u.email?.toLowerCase().includes(q) || u.plan?.includes(q));
  const filteredReports = reports.filter(r => r.id?.includes(q) || r.status?.includes(q));
  const filteredProps   = props.filter(p => p.gsc_property_url?.toLowerCase().includes(q) || p.user_email?.toLowerCase().includes(q));

  if (!user || (ADMIN_UID && user.id !== ADMIN_UID)) return null;

  // ── Password Gate ──────────────────────────────────────────────────────────
  if (!unlocked) return (
    <GatePage>
      <GateCard>
        <GateLogo><LogoDot />Rank<span>Brief</span></GateLogo>
        <GateTitle>Admin-Zugang</GateTitle>
        <GateSub>Bitte gib das Admin-Passwort ein.</GateSub>
        <GateInput
          type="password"
          placeholder="Passwort"
          value={pwInput}
          $err={pwErr}
          onChange={e => { setPwInput(e.target.value); setPwErr(false); }}
          onKeyDown={e => e.key === 'Enter' && handlePwSubmit()}
          autoFocus
        />
        {pwErr && <GateErr>Falsches Passwort.</GateErr>}
        <GateBtn onClick={handlePwSubmit} disabled={!pwInput}>Einloggen →</GateBtn>
      </GateCard>
    </GatePage>
  );

  return (
    <Layout>
      <TopBar>
        <Logo><LogoDot />Rank<span>Brief</span> <AdminBadge>Admin</AdminBadge></Logo>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          <BtnSm onClick={() => navigate('/dashboard')}>← Dashboard</BtnSm>
          <BtnSm onClick={loadAll}>↻ Refresh</BtnSm>
        </div>
      </TopBar>

      <Main>
        {alert && <Alert $err={alert.err}>{alert.msg}</Alert>}

        {/* Stats */}
        <StatsGrid>
          <StatCard $color="#6C63FF"><StatLabel>Gesamt User</StatLabel><StatValue>{stats.total_users ?? '–'}</StatValue></StatCard>
          <StatCard $color="#10B981"><StatLabel>Bezahlend</StatLabel><StatValue>{stats.paid_users ?? '–'}</StatValue></StatCard>
          <StatCard $color="#F59E0B"><StatLabel>Free</StatLabel><StatValue>{stats.free_users ?? '–'}</StatValue></StatCard>
          <StatCard $color="#6C63FF"><StatLabel>Reports gesamt</StatLabel><StatValue>{stats.total_reports ?? '–'}</StatValue></StatCard>
          <StatCard $color="#10B981"><StatLabel>Aktive Properties</StatLabel><StatValue>{stats.active_props ?? '–'}</StatValue></StatCard>
        </StatsGrid>

        {/* Plan breakdown */}
        <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[['Agency', stats.agency_users, '#D97706'], ['Pro', stats.pro_users, '#6C63FF'], ['Basic', stats.basic_users, '#10B981']].map(([label, val, color]) => (
            <div key={label} style={{ fontSize:'0.8125rem', color, fontWeight:700, background:`${color}12`, border:`1px solid ${color}30`, borderRadius:99, padding:'0.25rem 0.875rem' }}>
              {label}: {val ?? 0}
            </div>
          ))}
          <div style={{ fontSize:'0.8125rem', color:'#94A3B8', fontWeight:600, background:'rgba(148,163,184,.1)', border:'1px solid rgba(148,163,184,.2)', borderRadius:99, padding:'0.25rem 0.875rem' }}>
            PDFs generiert: {stats.reports_with_pdf ?? 0}
          </div>
        </div>

        {/* Search + Tabs */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'0.75rem' }}>
          <Tabs style={{ margin:0, border:'none', padding:0 }}>
            <Tab $active={tab==='users'}   onClick={()=>setTab('users')}>👤 User ({users.length})</Tab>
            <Tab $active={tab==='props'}   onClick={()=>setTab('props')}>🌐 Properties ({props.length})</Tab>
            <Tab $active={tab==='reports'} onClick={()=>setTab('reports')}>📄 Reports ({reports.length})</Tab>
          </Tabs>
          <SearchInput placeholder="Suchen…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <TableWrap>
                <THead $cols={COLS_USERS}>
                  <div>E-Mail / ID</div><div>Plan</div><div>Status</div>
                  <div>Properties</div><div>Reports</div><div>Erstellt</div><div>Aktionen</div>
                </THead>
                {filteredUsers.map(u => (
                  <TRow key={u.id} $cols={COLS_USERS}>
                    <div>
                      <TCell style={{ fontWeight:500 }}>{u.email}</TCell>
                      <TCellMono>{u.id.slice(0,12)}…</TCellMono>
                    </div>
                    <TCell><PlanBadge $plan={u.plan}>{u.plan}</PlanBadge></TCell>
                    <TCell>
                      <StatusDot $ok={u.plan_status !== 'frozen'} />
                      {u.plan_status}
                    </TCell>
                    <TCell>{u.property_count}</TCell>
                    <TCell>{u.report_count}</TCell>
                    <TCellMono>{fmtDate(u.created_at)}</TCellMono>
                    <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                      <ActionBtn onClick={() => { setNewPlan(u.plan); setModal({ type:'plan', user:u }); }}>Plan</ActionBtn>
                      <ActionBtn onClick={() => handleFreeze(u)}>{u.plan_status === 'frozen' ? '▶ Aktiv' : '⏸ Freeze'}</ActionBtn>
                      {u.promo_code_used && <ActionBtn onClick={() => handleResetPromo(u)}>Promo ↺</ActionBtn>}
                      <ActionBtn $danger onClick={() => setModal({ type:'delete', user:u })}>Löschen</ActionBtn>
                    </div>
                  </TRow>
                ))}
              </TableWrap>
            )}

            {/* ── PROPERTIES TAB ── */}
            {tab === 'props' && (
              <TableWrap>
                <THead $cols={COLS_PROPS}>
                  <div>Property URL</div><div>User</div><div>Status</div><div>Reports</div><div>GA4</div>
                </THead>
                {filteredProps.map(p => (
                  <TRow key={p.id} $cols={COLS_PROPS}>
                    <div>
                      <TCell style={{ fontWeight:500 }}>{p.display_name || p.gsc_property_url}</TCell>
                      <TCellMono>{p.gsc_property_url}</TCellMono>
                    </div>
                    <TCellMono>{p.user_email}</TCellMono>
                    <TCell><StatusDot $ok={p.status==='active'} />{p.status}</TCell>
                    <TCell>{p.report_count}</TCell>
                    <TCell>{p.ga_property_id ? <span style={{ color:'#10B981', fontWeight:600, fontSize:'.75rem' }}>✓ {p.ga_property_id}</span> : <span style={{ color:'#94A3B8', fontSize:'.75rem' }}>–</span>}</TCell>
                  </TRow>
                ))}
              </TableWrap>
            )}

            {/* ── REPORTS TAB ── */}
            {tab === 'reports' && (
              <TableWrap>
                <THead $cols={COLS_REPORTS}>
                  <div>Report ID</div><div>Monat</div><div>Klicks</div><div>Status</div><div>Aktionen</div>
                </THead>
                {filteredReports.map(r => (
                  <TRow key={r.id} $cols={COLS_REPORTS}>
                    <TCellMono>{r.id.slice(0,16)}…</TCellMono>
                    <TCell>{r.report_month ? new Date(r.report_month).toLocaleDateString('de-DE', { month:'long', year:'numeric' }) : '–'}</TCell>
                    <TCell>{r.clicks?.toLocaleString('de-DE') ?? '–'}</TCell>
                    <TCell>
                      <StatusDot $ok={r.status==='done'} />
                      {r.status}
                      {r.pdf_url && <span style={{ marginLeft:'.5rem', fontSize:'.7rem', color:'#10B981' }}>PDF ✓</span>}
                    </TCell>
                    <div style={{ display:'flex', gap:'.375rem' }}>
                      {r.pdf_url && <ActionBtn as="a" href={r.pdf_url} target="_blank" rel="noreferrer">↓ PDF</ActionBtn>}
                      <ActionBtn $danger onClick={() => setModal({ type:'report_delete', report:r })}>Löschen</ActionBtn>
                    </div>
                  </TRow>
                ))}
              </TableWrap>
            )}
          </>
        )}
      </Main>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {modal?.type === 'plan' && (
        <Overlay onClick={() => setModal(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>Plan ändern</ModalTitle>
            <ModalSub>User: <strong>{modal.user.email}</strong><br />Aktuell: <PlanBadge $plan={modal.user.plan}>{modal.user.plan}</PlanBadge></ModalSub>
            <Select value={newPlan} onChange={e => setNewPlan(e.target.value)}>
              {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
            <BtnRow>
              <BtnGhost onClick={() => setModal(null)}>Abbrechen</BtnGhost>
              <BtnPrimary onClick={handleChangePlan} disabled={saving}>{saving ? 'Speichert…' : 'Plan setzen'}</BtnPrimary>
            </BtnRow>
          </ModalBox>
        </Overlay>
      )}

      {modal?.type === 'delete' && (
        <Overlay onClick={() => setModal(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>User löschen?</ModalTitle>
            <ModalSub>
              <strong>{modal.user.email}</strong> wird mit allen Properties, Reports und Google-Konten dauerhaft gelöscht.<br /><br />
              ⚠️ Der Auth-User in Supabase muss danach manuell gelöscht werden.
            </ModalSub>
            <BtnRow>
              <BtnGhost onClick={() => setModal(null)}>Abbrechen</BtnGhost>
              <BtnDanger onClick={handleDeleteUser} disabled={saving}>{saving ? 'Löscht…' : 'Dauerhaft löschen'}</BtnDanger>
            </BtnRow>
          </ModalBox>
        </Overlay>
      )}

      {modal?.type === 'report_delete' && (
        <Overlay onClick={() => setModal(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>Report löschen?</ModalTitle>
            <ModalSub>Report vom {modal.report.report_month ? new Date(modal.report.report_month).toLocaleDateString('de-DE', { month:'long', year:'numeric' }) : '–'} wird mit allen Keywords und Seiten-Daten gelöscht.</ModalSub>
            <BtnRow>
              <BtnGhost onClick={() => setModal(null)}>Abbrechen</BtnGhost>
              <BtnDanger onClick={handleDeleteReport} disabled={saving}>{saving ? 'Löscht…' : 'Löschen'}</BtnDanger>
            </BtnRow>
          </ModalBox>
        </Overlay>
      )}
    </Layout>
  );
}
