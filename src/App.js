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
import Admin from './pages/Admin';
import CookieBanner from './components/CookieBanner';
import usePageTracking from './components/usePageTracking';

function AuthCallback() {
  const [status, setStatus] = React.useState('loading'); // loading | success | error

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 8;

    const tryGetSession = async () => {
      attempts++;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus('success');
        setTimeout(() => window.location.replace('/dashboard'), 1500);
      } else if (attempts < maxAttempts) {
        setTimeout(tryGetSession, 600);
      } else {
        window.location.replace('/login');
      }
    };

    tryGetSession();
  }, []);

  if (status === 'success') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8f8fc', flexDirection: 'column', gap: '1rem',
      }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a2e' }}>
          E-Mail bestätigt!
        </div>
        <div style={{ fontSize: '0.9375rem', color: '#888' }}>
          Du wirst gleich weitergeleitet…
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8f8fc', flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{
        width: '2rem', height: '2rem', border: '3px solid #e8e8f0',
        borderTop: '3px solid #6C63FF', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: '0.9375rem', color: '#888' }}>Account wird aktiviert…</div>
    </div>
  );
}

const noNavRoutes = ['/login', '/register', '/dashboard', '/onboarding', '/docs', '/settings', '/admin'];
const noFooterRoutes = ['/login', '/register', '/dashboard', '/onboarding', '/docs', '/settings', '/admin'];

function AppInner() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('rb_lang') || 'en');
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

  const handleLangChange = (l) => {
    setLang(l);
    localStorage.setItem('rb_lang', l);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#9898B8', fontSize: '0.875rem' }}>Loading...</div>
    </div>
  );

  const showNav = !noNavRoutes.some(r => path.startsWith(r));
  const showFooter = !noFooterRoutes.some(r => path.startsWith(r));

  return (
    <>
      {showNav && <Navbar user={user} lang={lang} onLangChange={handleLangChange} />}
      <Routes>
        <Route path="/" element={<Landing lang={lang} onLangChange={handleLangChange} />} />
        <Route path="/login" element={!user ? <Auth mode="login" lang={lang} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Auth mode="register" lang={lang} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} lang={lang} onLangChange={handleLangChange} /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings user={user} lang={lang} onLangChange={handleLangChange} /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={user ? <Onboarding user={user} /> : <Navigate to="/login" />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/privacy" element={<PrivacyEN />} />
        <Route path="/terms" element={<TermsEN />} />
        <Route path="/de/privacy" element={<PrivacyDE />} />
        <Route path="/de/terms" element={<TermsDE />} />
        <Route path="/admin" element={user ? <Admin user={user} /> : <Navigate to="/login" />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/" />} />
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
