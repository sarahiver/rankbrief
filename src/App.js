import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from './styles/GlobalStyle';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Docs from './pages/Docs';
import Settings from './pages/Settings';
import { PrivacyEN, PrivacyDE, TermsEN, TermsDE } from './pages/Legal';
import CookieBanner from './components/CookieBanner';
import usePageTracking from './components/usePageTracking';
import PropertySelectModal from './components/PropertySelectModal';

// Wartet auf Session nach PKCE-Exchange (max 5s)
async function waitForSession() {
  let { data: { session } } = await supabase.auth.getSession();
  if (session) return session;
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      listener.subscription.unsubscribe();
      resolve(null);
    }, 5000);
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s) {
        clearTimeout(timeout);
        listener.subscription.unsubscribe();
        resolve(s);
      }
    });
  });
}

// Prüft ob pending Properties vorhanden sind
async function hasPendingProperties(userId) {
  const { data } = await supabase
    .from('properties')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .limit(1);
  return (data ?? []).length > 0;
}

function AuthCallback({ onShowModal }) {
  useEffect(() => {
    const handle = async () => {
      const session = await waitForSession();
      if (!session) { window.location.replace('/login'); return; }

      const pending = await hasPendingProperties(session.user.id);
      if (pending) {
        // Modal öffnen statt auf Onboarding-Page navigieren
        window.location.replace('/dashboard?showModal=1');
      } else {
        window.location.replace('/dashboard');
      }
    };
    handle();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#9898B8', fontSize: '0.875rem' }}>Verbindung wird hergestellt…</div>
    </div>
  );
}

const noNavRoutes = ['/login', '/register', '/dashboard', '/onboarding', '/docs', '/settings'];
const noFooterRoutes = ['/login', '/register', '/dashboard', '/onboarding', '/docs', '/settings'];

function AppInner() {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang]     = useState(() => localStorage.getItem('rb_lang') || 'en');
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [modalContext, setModalContext] = useState({ plan: 'free', activeCount: 0 });
  const location = useLocation();
  const path = location.pathname;
  usePageTracking();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ?showModal=1 nach OAuth-Callback → Plan laden + Modal öffnen
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showModal') === '1' && user) {
      // Plan + aktive Properties laden damit Limit-Enforcement korrekt ist
      const loadContext = async () => {
        const [{ data: profile }, { data: activeProps }] = await Promise.all([
          supabase.from('profiles').select('plan').eq('id', user.id).single(),
          supabase.from('properties').select('id').eq('user_id', user.id).eq('status', 'active'),
        ]);
        setModalContext({
          plan: profile?.plan || 'free',
          activeCount: activeProps?.length || 0,
        });
        setShowPropertyModal(true);
      };
      loadContext();
      window.history.replaceState({}, '', '/dashboard?connected=1');
    }
  }, [location.search, user]);

  const handleLangChange = (l) => {
    setLang(l);
    localStorage.setItem('rb_lang', l);
  };

  const handleModalDone = () => {
    setShowPropertyModal(false);
    // Dashboard neu laden damit neue Properties erscheinen
    window.location.replace('/dashboard?connected=true');
  };

  const handleOpenModal = (ctx = {}) => {
    setModalContext({ plan: ctx.plan || 'free', activeCount: ctx.activeCount || 0 });
    setShowPropertyModal(true);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#9898B8', fontSize: '0.875rem' }}>Loading...</div>
    </div>
  );

  const showNav    = !noNavRoutes.some(r => path.startsWith(r));
  const showFooter = !noFooterRoutes.some(r => path.startsWith(r));

  return (
    <>
      {/* Globales Property-Modal — liegt über allem */}
      {showPropertyModal && user && (
        <PropertySelectModal
          user={user}
          lang={lang}
          onDone={handleModalDone}
          onNewAccount={() => {
            setShowPropertyModal(false);
            // OAuth starten – nach Callback öffnet sich Modal wieder
            const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
            const REDIRECT_URI = 'https://ubexqxxkqjzhsgidsseh.supabase.co/functions/v1/google-oauth-callback';
            const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly','https://www.googleapis.com/auth/analytics.readonly','https://www.googleapis.com/auth/userinfo.email'].join(' ');
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
          }}
          plan={modalContext.plan}
          activeCount={modalContext.activeCount}
        />
      )}

      {showNav && <Navbar user={user} lang={lang} onLangChange={handleLangChange} />}
      <Routes>
        <Route path="/"          element={<Landing lang={lang} />} />
        <Route path="/login"     element={!user ? <Auth mode="login" lang={lang} /> : <Navigate to="/dashboard" />} />
        <Route path="/register"  element={!user ? <Auth mode="register" lang={lang} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onOpenModal={handleOpenModal} /> : <Navigate to="/login" />} />
        <Route path="/settings"  element={user ? <Settings user={user} lang={lang} /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={user ? <Onboarding user={user} /> : <Navigate to="/login" />} />
        <Route path="/docs"      element={<Docs />} />
        <Route path="/privacy"   element={<PrivacyEN />} />
        <Route path="/terms"     element={<TermsEN />} />
        <Route path="/de/privacy" element={<PrivacyDE />} />
        <Route path="/de/terms"  element={<TermsDE />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
      {showFooter && <Footer />}
      <CookieBanner />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ThemeProvider>
  );
}
