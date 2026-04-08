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
const StatsGrid = styled.div`display:grid;grid-template-columns:repeat(6,1fr);gap:1rem;margin-bottom:2rem;@media(max-width:1100px){grid-template-columns:repeat(3,1fr)}@media(max-width:600px){grid-template-columns:repeat(2,1fr)}`;
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
const StatusDot = styled.span`display:inline-block;width:7px;height:7px;border-radius:50%;background:${({$status})=>$status==='active'?'#10B981':$status==='frozen'?'#6C63FF':'#F59E0B'};margin-right:.4rem;`;
const PromoBar  = styled.div`height:4px;border-radius:99px;background:${({theme})=>theme.colors.border};overflow:hidden;margin-top:3px;width:80px;`;
const PromoFill = styled.div`height:100%;border-radius:99px;background:${({$pct})=>$pct>=100?'#EF4444':$pct>=66?'#F59E0B':'#10B981'};width:${({$pct})=>Math.min($pct,100)}%;transition:width .3s;`;

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

// ── User Accordion ───────────────────────────────────────────────────────────
const UserRow     = styled.div`background:${({theme})=>theme.colors.bgCard};border:1px solid ${({$open,theme})=>$open?theme.colors.accent:theme.colors.border};border-radius:${({theme})=>theme.radius.lg};overflow:hidden;transition:border-color .2s;margin-bottom:.5rem;`;
const UserRowHead = styled.div`display:flex;align-items:center;justify-content:space-between;padding:.875rem 1.25rem;cursor:pointer;gap:1rem;&:hover{background:rgba(108,99,255,.03)}`;
const UserRowBody = styled.div`border-top:1px solid ${({theme})=>theme.colors.border};padding:1.25rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;@media(max-width:700px){grid-template-columns:1fr}`;
const InfoBlock   = styled.div``;
const InfoLabel2  = styled.div`font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${({theme})=>theme.colors.textDim};margin-bottom:.25rem;`;
const InfoVal     = styled.div`font-size:.875rem;color:${({theme})=>theme.colors.text};`;
const Chevron     = styled.span`font-size:.75rem;color:${({theme})=>theme.colors.textDim};transition:transform .2s;display:inline-block;transform:${({$open})=>$open?'rotate(180deg)':'rotate(0)'};`;
const ActionsRow  = styled.div`display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem;padding-top:1rem;border-top:1px solid ${({theme})=>theme.colors.border};`;

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
const PLAN_PRICES = { free: 0, basic: 19, pro: 39, agency: 79 };
const COLS_USERS = '2fr 1fr 1fr 1fr 1fr 1fr 1.2fr 1.5fr';
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
  const [users, setUsers]       = useState([]);
  const [reports, setReports]   = useState([]);
  const [props, setProps]       = useState([]);
  const [promos, setPromos]     = useState([]);
  const [stats, setStats]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [alert, setAlert]       = useState(null);
  const [modal, setModal]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [newPlan, setNewPlan]   = useState('free');
  const [promoForm, setPromoForm] = useState({ code: '', plan: 'pro', max_uses: 50, report_limit: 6, notes: '' });
  const [exportingXlsx, setExportingXlsx] = useState(false);
  const [openUser, setOpenUser]   = useState(null);

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
      { data: allPromos },
    ] = await Promise.all([
      supabase.from('profiles').select('id, plan, plan_status, free_report_sent, promo_code_used, promo_reports_limit, promo_reports_used, trial_ends_at, created_at, report_language, email').order('created_at', { ascending: false }),
      supabase.from('reports').select('id, property_id, report_month, clicks, status, pdf_url, summary_text, created_at').order('created_at', { ascending: false }).limit(200),
      supabase.from('properties').select('id, user_id, gsc_property_url, display_name, status, ga_property_id, created_at').order('created_at', { ascending: false }),
      supabase.from('promo_codes').select('*').order('created_at', { ascending: false }),
    ]);

    // ── Load emails via Edge Function (always — uses service role key) ────
    const emailMap = {};

    // 1. Seed from google_accounts (fast, no auth needed)
    const { data: gAccounts } = await supabase
      .from('google_accounts')
      .select('user_id, google_email');
    (gAccounts || []).forEach(g => { if (g.google_email) emailMap[g.user_id] = g.google_email; });

    // 2. Seed from profiles.email column (already backfilled)
    (profiles || []).forEach(p => { if (p.email) emailMap[p.id] = p.email; });

    // 3. Always call Edge Function to catch any missing (e.g. email/password signups)
    try {
      const SUPABASE_URL  = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/get-admin-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': SUPABASE_ANON,
        },
      });
      const result = await res.json();
      if (result.emailMap) {
        Object.assign(emailMap, result.emailMap); // overwrite with authoritative data
      } else {
        console.warn('get-admin-users returned:', result);
      }
    } catch (e) {
      console.warn('Could not load emails via Edge Function:', e);
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
    setPromos(allPromos || []);

    setStats({
      total_users:    (profiles || []).length,
      paid_users:     (profiles || []).filter(p => ['basic','pro','agency'].includes(p.plan) && !p.promo_code_used).length,
      promo_users:    (profiles || []).filter(p => p.promo_code_used).length,
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
    await supabase.from('profiles').update({ promo_code_used: null, promo_reports_used: 0, promo_reports_limit: null }).eq('id', u.id);
    showAlert('Promo zurückgesetzt — User kann neuen Code einlösen.');
    loadAll();
  };

  const handleAssignPromo = async (userId, promoCode) => {
    if (!promoCode) return;
    const promo = promos.find(p => p.code === promoCode);
    if (!promo) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      plan:                promo.plan,
      plan_status:         'active',
      promo_code_used:     promo.code,
      promo_reports_limit: promo.report_limit,
      promo_reports_used:  0,
    }).eq('id', userId);
    if (!error) {
      await supabase.from('promo_codes').update({ uses_count: (promo.uses_count || 0) + 1 }).eq('id', promo.id);
    }
    setSaving(false);
    if (error) { showAlert('Fehler: ' + error.message, true); return; }
    showAlert(`Code ${promo.code} zugewiesen → ${promo.plan}`);
    setModal(null);
    loadAll();
  };

  const handleFreeze = async (u) => {
    const newStatus = u.plan_status === 'frozen' ? 'active' : 'frozen';
    await supabase.from('profiles').update({ plan_status: newStatus }).eq('id', u.id);
    showAlert(`Account ${newStatus === 'frozen' ? 'eingefroren' : 'reaktiviert'}.`);
    loadAll();
  };

  // ── XLSX Export ─────────────────────────────────────────────────────────────
  const generateXlsx = async () => {
    setExportingXlsx(true);
    try {
      // Dynamically load SheetJS
      if (!window.XLSX) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const XLS = window.XLSX;
      const wb = XLS.utils.book_new();

      const today = new Date().toLocaleDateString('de-DE');
      const fmt = (d) => d ? new Date(d).toLocaleDateString('de-DE') : '–';
      const eur = (n) => n != null ? Number(n).toFixed(2) : '0.00';

      // ── Sheet 1: Übersicht ──
      const paidUsers = users.filter(u => ['basic','pro','agency'].includes(u.plan) && !u.promo_code_used);
      const promoUsers = users.filter(u => u.promo_code_used);
      const freeUsers = users.filter(u => u.plan === 'free');
      const mrr = paidUsers.reduce((s, u) => s + (PLAN_PRICES[u.plan] || 0), 0);
      const promoMrr = promoUsers.reduce((s, u) => s + (PLAN_PRICES[u.plan] || 0), 0);

      const overviewData = [
        ['RankBrief — Finanz-Dashboard', '', '', ''],
        ['Exportdatum:', today, '', ''],
        ['', '', '', ''],
        ['▌ KEY METRICS', '', '', ''],
        ['Metric', 'Wert', 'Hinweis', ''],
        ['Gesamt User', users.length, '', ''],
        ['Zahlende User (ohne Promo)', paidUsers.length, '', ''],
        ['Promo User (noch nicht zahlend)', promoUsers.length, 'Werden zahlend nach Promo-Ablauf', ''],
        ['Free User', freeUsers.length, '', ''],
        ['MRR zahlende User (€)', eur(mrr), 'Ohne Promo-User', ''],
        ['MRR inkl. Promo-Potential (€)', eur(mrr + promoMrr), 'Wenn alle Promo-User konvertieren', ''],
        ['ARR zahlende User (€)', eur(mrr * 12), '', ''],
        ['ARR inkl. Promo-Potential (€)', eur((mrr + promoMrr) * 12), '', ''],
        ['Ø Revenue/zahlender User (€)', eur(paidUsers.length ? mrr / paidUsers.length : 0), '', ''],
        ['', '', '', ''],
        ['▌ PLAN-MIX', '', '', ''],
        ['Plan', 'Preis/Mo (€)', 'Anzahl User', 'MRR Anteil (€)'],
        ...['basic','pro','agency','free'].map(plan => {
          const planUsers = users.filter(u => u.plan === plan && !u.promo_code_used);
          return [plan.charAt(0).toUpperCase()+plan.slice(1), PLAN_PRICES[plan], planUsers.length, eur(planUsers.length * PLAN_PRICES[plan])];
        }),
        ['GESAMT', '', users.length, eur(mrr)],
      ];
      const ws1 = XLS.utils.aoa_to_sheet(overviewData);
      ws1['!cols'] = [{wch:35},{wch:20},{wch:35},{wch:15}];
      XLS.utils.book_append_sheet(wb, ws1, '📊 Übersicht');

      // ── Sheet 2: User Detail ──
      const userHeaders = [
        'E-Mail','Plan','Plan-Status','Promo-Code','Promo-Plan','Report-Limit',
        'Reports verbraucht','Reports verbleibend','Promo %','Registriert',
        'Properties','Reports gesamt','Sprache','Mo-Wert (€)','Jahreswert (€)','Zahlend?'
      ];
      const userRows = users.map(u => {
        const promoLeft = u.promo_reports_limit ? Math.max(0, u.promo_reports_limit - (u.promo_reports_used||0)) : '∞';
        const promoPct = u.promo_reports_limit ? Math.round(((u.promo_reports_used||0)/u.promo_reports_limit)*100)+'%' : '–';
        const moVal = PLAN_PRICES[u.plan] || 0;
        const isPaid = ['basic','pro','agency'].includes(u.plan) && !u.promo_code_used;
        return [
          u.email, u.plan, u.plan_status, u.promo_code_used||'–',
          u.promo_code_used ? u.plan : '–',
          u.promo_reports_limit||'∞', u.promo_reports_used||0, promoLeft, promoPct,
          fmt(u.created_at), u.property_count||0, u.report_count||0,
          (u.report_language||'–').toUpperCase(),
          eur(moVal), eur(moVal*12), isPaid ? 'Ja' : (u.promo_code_used ? 'Promo' : 'Nein')
        ];
      });
      const ws2 = XLS.utils.aoa_to_sheet([userHeaders, ...userRows]);
      ws2['!cols'] = [
        {wch:28},{wch:10},{wch:12},{wch:18},{wch:12},{wch:12},
        {wch:16},{wch:16},{wch:10},{wch:14},{wch:10},{wch:14},
        {wch:8},{wch:14},{wch:14},{wch:10}
      ];
      XLS.utils.book_append_sheet(wb, ws2, '👤 User Detail');

      // ── Sheet 3: Promo Tracking ──
      const promoHeaders = [
        'Code','Plan','Preis/Mo (€)','Max Einlösungen','Genutzt','Verbleibend',
        'Auslastung %','Report-Limit','Aktiv','Notiz',
        'Aktive Promo User','Erwarteter MRR nach Conv. (€)','Erwarteter ARR (€)'
      ];
      const promoRows = promos.map(p => {
        const activePromoUsers = users.filter(u => u.promo_code_used === p.code).length;
        const expMrr = activePromoUsers * (PLAN_PRICES[p.plan]||0);
        return [
          p.code, p.plan, PLAN_PRICES[p.plan]||0,
          p.max_uses, p.uses_count, p.max_uses - p.uses_count,
          Math.round((p.uses_count/p.max_uses)*100)+'%',
          p.report_limit||'∞', p.active?'Aktiv':'Inaktiv', p.notes||'–',
          activePromoUsers, eur(expMrr), eur(expMrr*12)
        ];
      });
      const ws3 = XLS.utils.aoa_to_sheet([promoHeaders, ...promoRows]);
      ws3['!cols'] = [
        {wch:18},{wch:10},{wch:12},{wch:14},{wch:10},{wch:12},
        {wch:12},{wch:12},{wch:10},{wch:20},{wch:16},{wch:22},{wch:18}
      ];
      XLS.utils.book_append_sheet(wb, ws3, '🎟 Promo Tracking');

      // ── Sheet 4: Reports Monatsübersicht ──
      const reportsByMonth = {};
      reports.forEach(r => {
        if (!r.report_month) return;
        const key = r.report_month.slice(0,7);
        if (!reportsByMonth[key]) reportsByMonth[key] = { total: 0, done: 0, pdf: 0 };
        reportsByMonth[key].total++;
        if (r.status === 'done') reportsByMonth[key].done++;
        if (r.pdf_url) reportsByMonth[key].pdf++;
      });
      const monthHeaders = ['Monat','Reports gesamt','Reports done','PDFs erstellt','Erfolgsrate %'];
      const monthRows = Object.entries(reportsByMonth)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([month, d]) => [
          month, d.total, d.done, d.pdf,
          d.total ? Math.round((d.done/d.total)*100)+'%' : '–'
        ]);
      const ws4 = XLS.utils.aoa_to_sheet([monthHeaders, ...monthRows]);
      ws4['!cols'] = [{wch:12},{wch:16},{wch:14},{wch:14},{wch:14}];
      XLS.utils.book_append_sheet(wb, ws4, '📅 Reports/Monat');

      // Download
      const filename = `RankBrief_Finanzen_${today.replace(/\./g,'-')}.xlsx`;
      XLS.writeFile(wb, filename);
      showAlert('✅ XLSX exportiert: ' + filename);
    } catch (err) {
      console.error('XLSX export error:', err);
      showAlert('Fehler beim Export: ' + err.message, true);
    }
    setExportingXlsx(false);
  };

  // ── Filter ──────────────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filteredUsers   = users.filter(u => u.email?.toLowerCase().includes(q) || u.plan?.includes(q));
  const filteredReports = reports.filter(r => r.id?.includes(q) || r.status?.includes(q));
  const filteredProps   = props.filter(p => p.gsc_property_url?.toLowerCase().includes(q) || p.user_email?.toLowerCase().includes(q));

  const handleCreatePromo = async () => {
    if (!promoForm.code.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('promo_codes').insert({
      code:         promoForm.code.trim().toUpperCase(),
      plan:         promoForm.plan,
      max_uses:     parseInt(promoForm.max_uses) || 100,
      report_limit: promoForm.report_limit ? parseInt(promoForm.report_limit) : null,
      notes:        promoForm.notes || null,
    });
    setSaving(false);
    if (error) { showAlert('Fehler: ' + error.message, true); return; }
    showAlert('Code erstellt ✓');
    setPromoForm({ code: '', plan: 'pro', max_uses: 50, report_limit: 6, notes: '' });
    setModal(null);
    loadAll();
  };

  const handleTogglePromo = async (promo) => {
    await supabase.from('promo_codes').update({ active: !promo.active }).eq('id', promo.id);
    showAlert(promo.active ? 'Code deaktiviert' : 'Code aktiviert');
    loadAll();
  };

  const handleDeletePromo = async (promo) => {
    await supabase.from('promo_codes').delete().eq('id', promo.id);
    showAlert('Code gelöscht');
    loadAll();
  };

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
          <StatCard $color="#10B981"><StatLabel>Zahlend (Stripe)</StatLabel><StatValue>{stats.paid_users ?? '–'}</StatValue></StatCard>
          <StatCard $color="#F59E0B"><StatLabel>Promo (nicht zahlend)</StatLabel><StatValue>{stats.promo_users ?? '–'}</StatValue></StatCard>
          <StatCard $color="#94A3B8"><StatLabel>Free</StatLabel><StatValue>{stats.free_users ?? '–'}</StatValue></StatCard>
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
            <Tab $active={tab==='promos'}  onClick={()=>setTab('promos')}>🎟 Promo-Codes ({promos.length})</Tab>
            <Tab $active={tab==='finanzen'} onClick={()=>setTab('finanzen')}>💰 Finanzen</Tab>
          </Tabs>
          <SearchInput placeholder="Suchen…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <div>
                {filteredUsers.map(u => {
                  const isOpen = openUser === u.id;
                  const promoPct = u.promo_reports_limit
                    ? Math.round(((u.promo_reports_used ?? 0) / u.promo_reports_limit) * 100)
                    : 0;
                  return (
                    <UserRow key={u.id} $open={isOpen}>
                      {/* ── Header (always visible) ── */}
                      <UserRowHead onClick={() => setOpenUser(isOpen ? null : u.id)}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', minWidth:0 }}>
                          <StatusDot $status={u.plan_status} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:600, fontSize:'.9375rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
                            <div style={{ fontSize:'.75rem', color:'var(--color-text-secondary)', fontFamily:'monospace' }}>{u.id.slice(0,16)}…</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
                          <PlanBadge $plan={u.plan}>{u.plan}</PlanBadge>
                          {u.promo_code_used && (
                            <span style={{ fontSize:'.7rem', fontWeight:700, color:'#F59E0B', fontFamily:'monospace', background:'rgba(245,158,11,.1)', padding:'.15rem .5rem', borderRadius:99 }}>
                              🎟 {u.promo_code_used !== true ? u.promo_code_used : 'PROMO'}
                            </span>
                          )}
                          <Chevron $open={isOpen}>▾</Chevron>
                        </div>
                      </UserRowHead>

                      {/* ── Body (expanded) ── */}
                      {isOpen && (
                        <UserRowBody>
                          <InfoBlock>
                            <InfoLabel2>Status</InfoLabel2>
                            <InfoVal><StatusDot $status={u.plan_status} />{u.plan_status}</InfoVal>
                          </InfoBlock>
                          <InfoBlock>
                            <InfoLabel2>Properties</InfoLabel2>
                            <InfoVal>{u.property_count}</InfoVal>
                          </InfoBlock>
                          <InfoBlock>
                            <InfoLabel2>Reports generiert</InfoLabel2>
                            <InfoVal>{u.report_count}</InfoVal>
                          </InfoBlock>
                          <InfoBlock>
                            <InfoLabel2>Registriert</InfoLabel2>
                            <InfoVal>{fmtDate(u.created_at)}</InfoVal>
                          </InfoBlock>
                          <InfoBlock>
                            <InfoLabel2>Sprache</InfoLabel2>
                            <InfoVal>{u.report_language?.toUpperCase() || '–'}</InfoVal>
                          </InfoBlock>
                          {u.promo_code_used && (
                            <InfoBlock>
                              <InfoLabel2>Promo-Fortschritt</InfoLabel2>
                              {u.promo_reports_limit ? (
                                <div>
                                  <InfoVal style={{ marginBottom:4 }}>
                                    {u.promo_reports_used ?? 0} / {u.promo_reports_limit} Reports
                                    {promoPct >= 100 && <span style={{ marginLeft:'.5rem', color:'#EF4444', fontSize:'.75rem' }}>Limit erreicht</span>}
                                  </InfoVal>
                                  <PromoBar style={{ width:'100%' }}>
                                    <PromoFill $pct={promoPct} />
                                  </PromoBar>
                                </div>
                              ) : (
                                <InfoVal style={{ color:'#10B981' }}>∞ unbegrenzt</InfoVal>
                              )}
                            </InfoBlock>
                          )}
                          <ActionsRow style={{ gridColumn:'1 / -1' }}>
                            <ActionBtn onClick={() => { setNewPlan(u.plan); setModal({ type:'plan', user:u }); }}>✏️ Plan ändern</ActionBtn>
                            <ActionBtn onClick={() => handleFreeze(u)}>
                              {u.plan_status === 'frozen' ? '▶ Reaktivieren' : '⏸ Einfrieren'}
                            </ActionBtn>
                            <ActionBtn onClick={() => { setModal({ type:'assign_promo', user:u }); }}>🎟 Code zuweisen</ActionBtn>
                            <ActionBtn $danger onClick={() => setModal({ type:'delete', user:u })}>🗑 Löschen</ActionBtn>
                          </ActionsRow>
                        </UserRowBody>
                      )}
                    </UserRow>
                  );
                })}
              </div>
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
                    <TCell><StatusDot $status={p.status} />{p.status}</TCell>
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
                      <StatusDot $status={r.status==='done'?'active':'inactive'} />
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

            {/* ── PROMO CODES TAB ── */}
            {tab === 'finanzen' && (() => {
              const paidUsers = users.filter(u => ['basic','pro','agency'].includes(u.plan) && !u.promo_code_used);
              const promoUsers = users.filter(u => u.promo_code_used);
              const freeUsers = users.filter(u => u.plan === 'free');
              const mrr = paidUsers.reduce((s, u) => s + (PLAN_PRICES[u.plan] || 0), 0);
              const promoMrr = promoUsers.reduce((s, u) => s + (PLAN_PRICES[u.plan] || 0), 0);
              return (
                <div>
                  {/* Export Button */}
                  <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.5rem' }}>
                    <BtnPrimary
                      style={{ width:'auto', padding:'0.625rem 1.5rem', fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.5rem' }}
                      onClick={generateXlsx}
                      disabled={exportingXlsx}
                    >
                      {exportingXlsx ? '⏳ Wird exportiert…' : '⬇ XLSX exportieren'}
                    </BtnPrimary>
                  </div>

                  {/* KPI Cards */}
                  <StatsGrid style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'1.5rem' }}>
                    <StatCard $color="#10B981">
                      <StatLabel>MRR (zahlend)</StatLabel>
                      <StatValue>€{mrr.toFixed(0)}</StatValue>
                      <div style={{ fontSize:'0.75rem', color:'#888', marginTop:'0.25rem' }}>{paidUsers.length} User</div>
                    </StatCard>
                    <StatCard $color="#6C63FF">
                      <StatLabel>MRR Potential (inkl. Promo)</StatLabel>
                      <StatValue>€{(mrr + promoMrr).toFixed(0)}</StatValue>
                      <div style={{ fontSize:'0.75rem', color:'#888', marginTop:'0.25rem' }}>wenn alle Promo-User konvertieren</div>
                    </StatCard>
                    <StatCard $color="#F59E0B">
                      <StatLabel>ARR (zahlend)</StatLabel>
                      <StatValue>€{(mrr * 12).toFixed(0)}</StatValue>
                      <div style={{ fontSize:'0.75rem', color:'#888', marginTop:'0.25rem' }}>hochgerechnet</div>
                    </StatCard>
                    <StatCard $color="#A78BFA">
                      <StatLabel>Ø Revenue/User</StatLabel>
                      <StatValue>€{paidUsers.length ? (mrr / paidUsers.length).toFixed(0) : 0}</StatValue>
                      <div style={{ fontSize:'0.75rem', color:'#888', marginTop:'0.25rem' }}>pro Monat</div>
                    </StatCard>
                  </StatsGrid>

                  {/* Plan Mix */}
                  <div style={{ marginBottom:'1.5rem' }}>
                    <div style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'#888', marginBottom:'0.75rem' }}>Plan-Mix (zahlende User)</div>
                    <TableWrap>
                      <THead $cols="1.5fr 1fr 1fr 1fr 1fr">
                        <div>Plan</div><div>Preis/Mo</div><div>User (zahlend)</div><div>User (Promo)</div><div>MRR Anteil</div>
                      </THead>
                      {['basic','pro','agency','free'].map(plan => {
                        const paid = users.filter(u => u.plan === plan && !u.promo_code_used).length;
                        const promo = users.filter(u => u.plan === plan && u.promo_code_used).length;
                        const planMrr = paid * (PLAN_PRICES[plan] || 0);
                        return (
                          <TRow key={plan} $cols="1.5fr 1fr 1fr 1fr 1fr">
                            <TCell><PlanBadge $plan={plan}>{plan}</PlanBadge></TCell>
                            <TCell>€{PLAN_PRICES[plan]}/Mo</TCell>
                            <TCell style={{ fontWeight: paid > 0 ? 700 : 400 }}>{paid}</TCell>
                            <TCell style={{ color: promo > 0 ? '#F59E0B' : '#ccc' }}>{promo}</TCell>
                            <TCell style={{ fontWeight: 600, color: '#10B981' }}>€{planMrr.toFixed(0)}</TCell>
                          </TRow>
                        );
                      })}
                      <TRow $cols="1.5fr 1fr 1fr 1fr 1fr" style={{ borderTop:'2px solid #e8e8f0' }}>
                        <TCell style={{ fontWeight:700 }}>GESAMT</TCell>
                        <TCell>–</TCell>
                        <TCell style={{ fontWeight:700 }}>{paidUsers.length}</TCell>
                        <TCell style={{ fontWeight:700, color:'#F59E0B' }}>{promoUsers.length}</TCell>
                        <TCell style={{ fontWeight:700, color:'#10B981' }}>€{mrr.toFixed(0)}</TCell>
                      </TRow>
                    </TableWrap>
                  </div>

                  {/* User Zahlungsstatus */}
                  <div>
                    <div style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'#888', marginBottom:'0.75rem' }}>User Zahlungsstatus</div>
                    <TableWrap>
                      <THead $cols="2fr 1fr 1fr 1fr 1fr 1fr 1fr">
                        <div>E-Mail</div><div>Plan</div><div>Status</div><div>Promo-Code</div><div>Reports verbl.</div><div>Mo-Wert</div><div>Zahlend?</div>
                      </THead>
                      {users.map(u => {
                        const isPaid = ['basic','pro','agency'].includes(u.plan) && !u.promo_code_used;
                        const isPromo = !!u.promo_code_used;
                        const promoLeft = u.promo_reports_limit
                          ? Math.max(0, u.promo_reports_limit - (u.promo_reports_used||0))
                          : '∞';
                        const moVal = PLAN_PRICES[u.plan] || 0;
                        return (
                          <TRow key={u.id} $cols="2fr 1fr 1fr 1fr 1fr 1fr 1fr">
                            <TCell style={{ fontWeight:500 }}>{u.email}</TCell>
                            <TCell><PlanBadge $plan={u.plan}>{u.plan}</PlanBadge></TCell>
                            <TCell><StatusDot $status={u.plan_status} />{u.plan_status}</TCell>
                            <TCell>
                              {isPromo
                                ? <span style={{ fontSize:'.7rem', fontWeight:700, color:'#F59E0B', background:'rgba(245,158,11,.1)', padding:'.15rem .5rem', borderRadius:99 }}>
                                    🎟 {u.promo_code_used}
                                  </span>
                                : <span style={{ color:'#ccc' }}>–</span>}
                            </TCell>
                            <TCell>
                              {isPromo
                                ? <span style={{ color: promoLeft === 0 ? '#EF4444' : '#F59E0B', fontWeight:600 }}>{promoLeft} Reports</span>
                                : <span style={{ color:'#ccc' }}>–</span>}
                            </TCell>
                            <TCell style={{ fontWeight:600, color: moVal > 0 ? '#10B981' : '#ccc' }}>
                              {moVal > 0 ? `€${moVal}` : '–'}
                            </TCell>
                            <TCell>
                              {isPaid
                                ? <span style={{ color:'#10B981', fontWeight:700 }}>✓ Zahlend</span>
                                : isPromo
                                  ? <span style={{ color:'#F59E0B', fontWeight:600 }}>⏳ Promo</span>
                                  : <span style={{ color:'#94A3B8' }}>Free</span>}
                            </TCell>
                          </TRow>
                        );
                      })}
                    </TableWrap>
                  </div>
                </div>
              );
            })()}

            {tab === 'promos' && (
              <>
                <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
                  <BtnPrimary style={{ width:'auto', padding:'0.5rem 1.25rem', fontSize:'0.875rem' }}
                    onClick={() => setModal({ type:'create_promo' })}>
                    + Neuer Code
                  </BtnPrimary>
                </div>
                <TableWrap>
                  <THead $cols="1.5fr 1fr 1fr 1fr 1fr 1fr 1.5fr">
                    <div>Code</div><div>Plan</div><div>Genutzt</div><div>Max</div><div>Report-Limit</div><div>Status</div><div>Aktionen</div>
                  </THead>
                  {promos.length === 0 && (
                    <div style={{ padding:'1.5rem', textAlign:'center', fontSize:'0.875rem', color:'var(--text-dim)' }}>Keine Codes vorhanden</div>
                  )}
                  {promos.map(p => (
                    <TRow key={p.id} $cols="1.5fr 1fr 1fr 1fr 1fr 1fr 1.5fr">
                      <TCell style={{ fontWeight:700, fontFamily:'monospace', fontSize:'0.8rem' }}>{p.code}</TCell>
                      <TCell><PlanBadge $plan={p.plan}>{p.plan}</PlanBadge></TCell>
                      <TCell>{p.uses_count}</TCell>
                      <TCell>{p.max_uses}</TCell>
                      <TCell>{p.report_limit ?? <span style={{ color:'#10B981' }}>∞</span>}</TCell>
                      <TCell>
                        <StatusDot $status={p.active ? 'active' : 'inactive'} />
                        {p.active ? 'Aktiv' : 'Inaktiv'}
                      </TCell>
                      <div style={{ display:'flex', gap:'.375rem' }}>
                        <ActionBtn onClick={() => handleTogglePromo(p)}>
                          {p.active ? '⏸ Pause' : '▶ Aktivieren'}
                        </ActionBtn>
                        <ActionBtn $danger onClick={() => handleDeletePromo(p)}>Löschen</ActionBtn>
                      </div>
                    </TRow>
                  ))}
                </TableWrap>
              </>
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

      {modal?.type === 'create_promo' && (
        <Overlay onClick={() => setModal(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>Neuer Promo-Code</ModalTitle>
            <ModalSub>Code wird automatisch in Großbuchstaben gespeichert.</ModalSub>
            {[
              ['Code', 'code', 'text', 'Z.B. SOMMER2026'],
              ['Notiz (intern)', 'notes', 'text', 'Z.B. Beta-Tester Kampagne'],
            ].map(([label, key, type, ph]) => (
              <div key={key} style={{ marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)', marginBottom:'0.375rem' }}>{label}</div>
                <GateInput as="input" type={type} placeholder={ph}
                  value={promoForm[key]}
                  onChange={e => setPromoForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ marginBottom:0 }} />
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
              <div>
                <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)', marginBottom:'0.375rem' }}>Plan</div>
                <Select value={promoForm.plan} onChange={e => setPromoForm(f => ({ ...f, plan: e.target.value }))}>
                  {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
              <div>
                <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)', marginBottom:'0.375rem' }}>Max. Einlösungen</div>
                <GateInput as="input" type="number" placeholder="50"
                  value={promoForm.max_uses}
                  onChange={e => setPromoForm(f => ({ ...f, max_uses: e.target.value }))}
                  style={{ marginBottom:0 }} />
              </div>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)', marginBottom:'0.375rem' }}>
                Report-Limit <span style={{ fontWeight:300, color:'var(--text-dim)' }}>(leer = unbegrenzt)</span>
              </div>
              <GateInput as="input" type="number" placeholder="6 (leer = unbegrenzt)"
                value={promoForm.report_limit}
                onChange={e => setPromoForm(f => ({ ...f, report_limit: e.target.value }))}
                style={{ marginBottom:0 }} />
            </div>
            <BtnRow>
              <BtnGhost onClick={() => setModal(null)}>Abbrechen</BtnGhost>
              <BtnPrimary onClick={handleCreatePromo} disabled={saving || !promoForm.code.trim()}>
                {saving ? 'Erstellt…' : 'Code erstellen'}
              </BtnPrimary>
            </BtnRow>
          </ModalBox>
        </Overlay>
      )}
      {modal?.type === 'assign_promo' && (
        <Overlay onClick={() => setModal(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>Code zuweisen</ModalTitle>
            <ModalSub>
              <strong>{modal.user.email}</strong><br />
              Aktuell: {modal.user.promo_code_used
                ? <><span style={{fontFamily:'monospace',fontWeight:700}}>{modal.user.promo_code_used}</span> → <PlanBadge $plan={modal.user.plan}>{modal.user.plan}</PlanBadge></>
                : 'kein Code'}
            </ModalSub>
            <div style={{ marginBottom:'1rem' }}>
              <div style={{ fontSize:'.8rem', fontWeight:600, color:'var(--color-text-secondary)', marginBottom:'.375rem' }}>Code auswählen</div>
              <Select id="assign-select" defaultValue="">
                <option value="" disabled>— Code wählen —</option>
                {promos.filter(p => p.active).map(p => (
                  <option key={p.id} value={p.code}>
                    {p.code} · {p.plan}{p.report_limit ? ` · ${p.report_limit} Reports` : ' · ∞'} ({p.uses_count}/{p.max_uses} genutzt)
                  </option>
                ))}
              </Select>
            </div>
            <div style={{ fontSize:'.8rem', color:'var(--color-text-secondary)', marginBottom:'1rem', fontWeight:300 }}>
              Der alte Code wird überschrieben, Report-Zähler wird auf 0 zurückgesetzt.
            </div>
            <BtnRow>
              <BtnGhost onClick={() => setModal(null)}>Abbrechen</BtnGhost>
              <BtnPrimary
                onClick={() => handleAssignPromo(modal.user.id, document.getElementById('assign-select').value)}
                disabled={saving}
              >
                {saving ? 'Wird zugewiesen…' : 'Code zuweisen'}
              </BtnPrimary>
            </BtnRow>
          </ModalBox>
        </Overlay>
      )}

    </Layout>
  );
}
