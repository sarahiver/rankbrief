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

const noNavRoutes = ['/login', '/register', '/dashboard', '/onboarding', '/docs', '/settings'];
const noFooterRoutes = ['/login', '/register', '/dashboard', '/onboarding', '/docs', '/settings'];

function AppInner() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('rb_lang') || 'en');
  const location = useLocation();
  const path = location.pathname;

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
        <Route path="/" element={<Landing lang={lang} />} />
        <Route path="/login" element={!user ? <Auth mode="login" /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Auth mode="register" /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings user={user} /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={user ? <Onboarding user={user} /> : <Navigate to="/login" />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/privacy" element={<PrivacyEN />} />
        <Route path="/terms" element={<TermsEN />} />
        <Route path="/de/privacy" element={<PrivacyDE />} />
        <Route path="/de/terms" element={<TermsDE />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showFooter && <Footer />}
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
