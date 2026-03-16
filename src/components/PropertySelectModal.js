import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../lib/supabase';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeUp = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  animation: ${fadeIn} 0.2s ease;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
  width: 100%; max-width: 480px;
  animation: ${fadeUp} 0.25s ease;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800; font-size: 1rem; letter-spacing: -0.03em;
  display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1.75rem;
  span { color: ${({ theme }) => theme.colors.accent}; }
`;
const LogoDot = styled.div`
  width: 7px; height: 7px; border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;

const StepIndicator = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.75rem;`;
const StepDot = styled.div`
  width: 8px; height: 8px; border-radius: 50%;
  background: ${({ $done, $active, theme }) =>
    $done ? theme.colors.success : $active ? theme.colors.accent : theme.colors.border};
  transition: background 0.3s;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.375rem;
`;
const Sub = styled.p`
  font-size: 0.875rem; color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300; margin-bottom: 1.5rem; line-height: 1.6;
`;

const Label = styled.label`
  display: block; font-size: 0.8125rem; font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted}; margin-bottom: 0.5rem; letter-spacing: 0.02em;
`;

const CheckboxList = styled.div`display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;`;
const CheckboxItem = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $checked, theme }) => $checked ? theme.colors.accent : theme.colors.border};
  background: ${({ $checked, theme }) => $checked ? theme.colors.accentDim : theme.colors.bg};
  cursor: pointer; font-size: 0.875rem; user-select: none;
  color: ${({ $checked, theme }) => $checked ? theme.colors.accent : theme.colors.text};
  transition: all 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.accent}; }
`;
const CheckboxBox = styled.div`
  width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0;
  border: 2px solid ${({ $checked, theme }) => $checked ? theme.colors.accent : theme.colors.border};
  background: ${({ $checked, theme }) => $checked ? theme.colors.accent : 'transparent'};
  color: #fff; font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
`;

const Input = styled.input`
  width: 100%; padding: 0.75rem 1rem; box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ $error, theme }) => $error ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text}; font-size: 0.9375rem;
  font-family: ${({ theme }) => theme.fonts.mono}; margin-bottom: 0.5rem;
  outline: none; transition: border-color 0.2s;
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; font-family: inherit; }
`;

const HelpText = styled.div`
  font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300; margin-bottom: 1.25rem; line-height: 1.5;
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none;
      &:hover { text-decoration: underline; } }
`;

const ErrorText = styled.div`
  font-size: 0.8125rem; color: ${({ theme }) => theme.colors.danger}; margin-bottom: 1rem;
`;

const BtnPrimary = styled.button`
  width: 100%; padding: 0.875rem;
  background: ${({ theme }) => theme.colors.accent}; color: #fff;
  font-family: ${({ theme }) => theme.fonts.display}; font-weight: 700; font-size: 1rem;
  border-radius: ${({ theme }) => theme.radius.md}; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.accentHover}; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BtnGhost = styled.button`
  width: 100%; padding: 0.75rem; color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.875rem; margin-top: 0.625rem; transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const Divider = styled.div`
  display: flex; align-items: center; gap: 1rem; margin: 0.75rem 0;
  color: ${({ theme }) => theme.colors.textDim}; font-size: 0.8125rem;
  &::before, &::after { content: ''; flex: 1; height: 1px; background: ${({ theme }) => theme.colors.border}; }
`;

const BtnGoogle = styled.button`
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem; font-weight: 500; padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md}; transition: all 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.borderLight}; }
  svg { width: 16px; height: 16px; }
`;

const EmptyState = styled.div`
  text-align: center; padding: 1.25rem;
  color: ${({ theme }) => theme.colors.textDim}; font-size: 0.875rem; line-height: 1.6;
`;

const Spinner = styled.div`
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: ${spin} 0.7s linear infinite;
`;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const PLAN_LIMITS = { free: 1, basic: 1, pro: 3, agency: 10 };

export default function PropertySelectModal({ user, onDone, plan = 'free', activeCount = 0 }) {
  const limit = PLAN_LIMITS[plan] ?? 1;
  const remaining = Math.max(0, limit - activeCount); // wie viele Properties noch hinzugefügt werden dürfen

  const [step, setStep] = useState(1);
  const [pendingSites, setPendingSites] = useState([]);
  const [selected, setSelected] = useState([]);
  const [ga4Id, setGa4Id] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadPending(remaining); }, [remaining]);

  const loadPending = async (slots) => {
    setLoading(true);
    const { data } = await supabase
      .from('properties')
      .select('id, gsc_property_url, google_account_id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    const sites = data ?? [];
    setPendingSites(sites);
    // Nur bis zum Plan-Limit vorauswählen (slots = wie viele noch erlaubt)
    const allowed = slots > 0 ? slots : 1;
    if (sites.length > 0) setSelected(sites.slice(0, allowed).map(s => s.id));
    setLoading(false);
  };

  const toggle = (id) => setSelected(prev => {
    if (prev.includes(id)) return prev.filter(s => s !== id);
    if (prev.length >= remaining) return prev; // Limit erreicht → kein weiteres Anklicken
    return [...prev, id];
  });

  const handleConnectAnother = () => {
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

  const handleSave = async (skipGa4 = false) => {
    if (selected.length === 0) return;
    // Sicherheits-Check: nie mehr als erlaubt speichern
    const allowedSelected = selected.slice(0, Math.max(1, remaining));
    if (allowedSelected.length < selected.length) {
      setError(`Dein Plan erlaubt nur ${remaining} weitere ${remaining === 1 ? 'Property' : 'Properties'}.`);
      setSelected(allowedSelected);
      return;
    }
    setSaving(true); setError('');
    const ga4Value = skipGa4 ? null : ga4Id.trim() || null;
    if (!skipGa4 && ga4Id.trim() && !/^\d+$/.test(ga4Id.trim())) {
      setError('Die GA4 Property ID besteht nur aus Zahlen (z.B. 123456789).');
      setSaving(false); return;
    }
    try {
      await supabase.from('properties')
        .update({ status: 'active', ga_property_id: ga4Value, last_synced_at: new Date().toISOString() })
        .in('id', selected).eq('user_id', user.id);

      // Nicht ausgewählte pending Properties löschen
      const notSelected = pendingSites.map(s => s.id).filter(id => !selected.includes(id));
      if (notSelected.length > 0) {
        await supabase.from('properties').delete().in('id', notSelected).eq('user_id', user.id);
      }
      onDone();
    } catch (err) {
      setError('Fehler beim Speichern. Bitte versuche es erneut.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Overlay>
        <Box>
          <Logo><LogoDot />Rank<span>Brief</span></Logo>
          <EmptyState>Verbindung wird hergestellt…</EmptyState>
        </Box>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <Box>
        <Logo><LogoDot />Rank<span>Brief</span></Logo>

        <StepIndicator>
          <StepDot $done={step > 1} $active={step === 1} />
          <StepDot $done={step > 2} $active={step === 2} />
        </StepIndicator>

        {step === 1 && (
          <>
            <Title>Welche Properties tracken?</Title>
            <Sub>
              {pendingSites.length === 0
                ? 'Keine neuen Properties gefunden.'
                : <>
                    Wir haben {pendingSites.length} {pendingSites.length === 1 ? 'Property' : 'Properties'} gefunden.{' '}
                    Du kannst noch <strong>{remaining}</strong> von {limit} {limit === 1 ? 'Property' : 'Properties'} hinzufügen ({plan === 'free' ? 'Free' : plan.charAt(0).toUpperCase() + plan.slice(1)}-Plan).
                  </>}
            </Sub>

            {pendingSites.length === 0 ? (
              <EmptyState>
                Keine ausstehenden Properties.<br />
                Verbinde ein weiteres Google-Konto oder schließe das Fenster.
              </EmptyState>
            ) : (
              <>
                <Label>GSC Properties</Label>
                <CheckboxList>
                  {pendingSites.map(site => (
                    <CheckboxItem key={site.id} $checked={selected.includes(site.id)} onClick={() => toggle(site.id)}>
                      <CheckboxBox $checked={selected.includes(site.id)}>
                        {selected.includes(site.id) && '✓'}
                      </CheckboxBox>
                      <span>{site.gsc_property_url}</span>
                    </CheckboxItem>
                  ))}
                </CheckboxList>
                <BtnPrimary onClick={() => setStep(2)} disabled={selected.length === 0}>
                  {selected.length === 0 ? 'Mindestens eine Property wählen' : `${selected.length} ${selected.length === 1 ? 'Property' : 'Properties'} verbinden →`}
                </BtnPrimary>
              </>
            )}

            <Divider>oder</Divider>
            <BtnGoogle onClick={handleConnectAnother}>
              <GoogleIcon />
              Weiteres Google-Konto verbinden
            </BtnGoogle>

            {pendingSites.length > 0 && (
              <BtnGhost onClick={onDone}>Später einrichten</BtnGhost>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Title>Google Analytics verbinden</Title>
            <Sub>Optional: GA4 Property ID für Sessions, Nutzer und Engagement Rate im Report.</Sub>

            <Label>GA4 Property ID</Label>
            <Input
              type="text" placeholder="123456789"
              value={ga4Id} onChange={e => setGa4Id(e.target.value)}
              $error={!!error}
            />
            <HelpText>
              Zu finden in{' '}
              <a href="https://analytics.google.com" target="_blank" rel="noreferrer">Google Analytics</a>
              {' '}→ Admin → Property Settings → Property ID. Nur Zahlen – nicht die G-XXXXXXXX ID.
            </HelpText>
            {error && <ErrorText>{error}</ErrorText>}

            <BtnPrimary onClick={() => handleSave(false)} disabled={saving}>
              {saving ? <Spinner /> : 'Einrichtung abschließen →'}
            </BtnPrimary>
            <BtnGhost onClick={() => handleSave(true)} disabled={saving}>
              Ohne GA4 fortfahren
            </BtnGhost>
          </>
        )}
      </Box>
    </Overlay>
  );
}
