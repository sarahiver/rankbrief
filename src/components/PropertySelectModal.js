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
  width: 100%; max-width: 520px;
  max-height: 85vh; overflow-y: auto;
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
const StepDots = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.75rem;`;
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
  font-weight: 300; margin-bottom: 1.25rem; line-height: 1.6;
`;
const InfoBox = styled.div`
  font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textMuted};
  background: rgba(108,99,255,0.06); border: 1px solid rgba(108,99,255,0.15);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.625rem 0.875rem; margin-bottom: 1.25rem; line-height: 1.5;
`;
const AccountBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: 0.75rem; overflow: hidden;
`;
const AccountHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.colors.bgElevated};
  cursor: pointer; user-select: none;
  &:hover { background: rgba(108,99,255,0.04); }
`;
const AccountEmail = styled.div`
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.875rem; font-weight: 600; color: ${({ theme }) => theme.colors.text};
`;
const AccountChevron = styled.span`
  font-size: 0.75rem; color: ${({ theme }) => theme.colors.textDim};
  transition: transform 0.2s;
  display: inline-block;
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'none'};
`;
const AccountBody = styled.div`
  padding: ${({ $open }) => $open ? '0.75rem' : '0'};
  max-height: ${({ $open }) => $open ? '400px' : '0'};
  overflow: hidden;
  transition: all 0.25s ease;
`;
const CheckboxList = styled.div`display: flex; flex-direction: column; gap: 0.4rem;`;
const CheckboxItem = styled.div`
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.5rem 0.75rem; border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $checked, theme }) => $checked ? theme.colors.accent : theme.colors.border};
  background: ${({ $checked, theme }) => $checked ? theme.colors.accentDim : theme.colors.bg};
  cursor: pointer; font-size: 0.8125rem; user-select: none;
  color: ${({ $checked, theme }) => $checked ? theme.colors.accent : theme.colors.text};
  transition: all 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.accent}; }
`;
const CheckboxBox = styled.div`
  width: 15px; height: 15px; border-radius: 3px; flex-shrink: 0;
  border: 2px solid ${({ $checked, theme }) => $checked ? theme.colors.accent : theme.colors.border};
  background: ${({ $checked, theme }) => $checked ? theme.colors.accent : 'transparent'};
  color: #fff; font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
`;
const ActiveBadge = styled.span`
  margin-left: auto; font-size: 0.7rem; font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
  background: rgba(16,185,129,0.1); padding: 0.125rem 0.5rem;
  border-radius: 99px; white-space: nowrap; flex-shrink: 0;
`;
const ErrorBadge = styled.div`
  font-size: 0.8125rem; color: ${({ theme }) => theme.colors.danger};
  padding: 0.5rem 0.75rem; background: rgba(239,68,68,0.08);
  border-radius: ${({ theme }) => theme.radius.md};
`;
const EmptyNote = styled.div`
  font-size: 0.8125rem; color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300; padding: 0.375rem 0.25rem;
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
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
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
  display: flex; align-items: center; gap: 1rem; margin: 0.875rem 0;
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
const Spinner = styled.div`
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: ${spin} 0.7s linear infinite;
`;
const LoadingWrap = styled.div`
  text-align: center; padding: 2rem;
  color: ${({ theme }) => theme.colors.textDim}; font-size: 0.875rem; font-weight: 300;
`;
const LoadSpinner = styled.div`
  width: 24px; height: 24px; margin: 0 auto 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%; animation: ${spin} 0.7s linear infinite;
`;

const PLAN_LIMITS = { free: 1, basic: 1, pro: 3, agency: 10 };

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function PropertySelectModal({ user, onDone, onNewAccount, plan = 'free', activeCount = 0 }) {
  const limit = PLAN_LIMITS[plan] ?? 1;
  const isPro = ['pro', 'agency'].includes(plan);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ga4Id, setGa4Id] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [openAccounts, setOpenAccounts] = useState({});
  const [selected, setSelected] = useState({}); // { url: google_account_id }
  const [realRemaining, setRealRemaining] = useState(limit);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;

      const [gscRes, { data: activeProps }] = await Promise.all([
        fetch(`${SUPABASE_URL}/functions/v1/get-gsc-properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON}` },
          body: JSON.stringify({ user_id: user.id }),
        }),
        supabase.from('properties').select('id, gsc_property_url, google_account_id, ga_property_id')
          .eq('user_id', user.id).eq('status', 'active'),
      ]);

      const gscData = await gscRes.json();
      const accs = gscData.accounts ?? [];
      setAccounts(accs);

      // Alle aufklappen
      const openState = {};
      accs.forEach(a => { openState[a.google_account_id] = true; });
      setOpenAccounts(openState);

      // Echtes remaining
      const realActive = activeProps?.length ?? 0;
      setRealRemaining(Math.max(0, limit - realActive));

      // Aktive Properties vorauswählen + GA4 prefill
      const preSelected = {};
      for (const p of activeProps ?? []) {
        preSelected[p.gsc_property_url] = p.google_account_id;
        if (p.ga_property_id) setGa4Id(p.ga_property_id);
      }
      setSelected(preSelected);

    } catch (err) {
      console.error('loadData error:', err);
    }
    setLoading(false);
  };

  const toggleProperty = (url, googleAccountId) => {
    setSelected(prev => {
      const isSelected = url in prev;
      if (isSelected) {
        const next = { ...prev };
        delete next[url];
        return next;
      }
      if (limit === 1) return { [url]: googleAccountId }; // Radio
      const count = Object.keys(prev).length;
      if (count >= limit) return prev;
      return { ...prev, [url]: googleAccountId };
    });
  };

  const handleSave = async (skipGa4 = false) => {
    setSaving(true); setError('');
    const ga4Value = skipGa4 ? null : ga4Id.trim() || null;
    if (!skipGa4 && ga4Id.trim() && !/^\d+$/.test(ga4Id.trim())) {
      setError('Die GA4 Property ID besteht nur aus Zahlen (z.B. 123456789).');
      setSaving(false); return;
    }
    try {
      const selectedUrls = Object.keys(selected);

      // Aktuelle aktive Properties
      const { data: currentActive } = await supabase
        .from('properties').select('id, gsc_property_url')
        .eq('user_id', user.id).eq('status', 'active');
      const currentActiveUrls = new Set((currentActive ?? []).map(p => p.gsc_property_url));

      // Neu ausgewählte aktivieren
      for (const [url, accountId] of Object.entries(selected)) {
        if (currentActiveUrls.has(url)) {
          if (ga4Value) await supabase.from('properties').update({ ga_property_id: ga4Value })
            .eq('user_id', user.id).eq('gsc_property_url', url);
        } else {
          await supabase.from('properties').upsert({
            user_id: user.id, google_account_id: accountId,
            gsc_property_url: url, display_name: url,
            status: 'active', ga_property_id: ga4Value,
            last_synced_at: new Date().toISOString(),
          }, { onConflict: 'user_id,gsc_property_url' });
        }
      }

      // Abgewählte → inactive (nicht löschen — damit User sie später wieder aktivieren kann)
      const deactivate = (currentActive ?? []).filter(p => !selectedUrls.includes(p.gsc_property_url));
      for (const p of deactivate) {
        await supabase.from('properties').update({ status: 'inactive' }).eq('id', p.id);
      }

      // Pending bereinigen
      await supabase.from('properties').delete().eq('user_id', user.id).eq('status', 'pending');

      onDone();
    } catch (err) {
      setError('Fehler beim Speichern.'); console.error(err);
    }
    setSaving(false);
  };

  const selectedCount = Object.keys(selected).length;

  return (
    <Overlay>
      <Box>
        <Logo><LogoDot />Rank<span>Brief</span></Logo>
        <StepDots>
          <StepDot $done={step > 1} $active={step === 1} />
          <StepDot $done={step > 2} $active={step === 2} />
        </StepDots>

        {step === 1 && (
          <>
            <Title>Welche Properties tracken?</Title>
            <Sub>
              {realRemaining > 0
                ? <>Du kannst noch <strong>{realRemaining}</strong> von <strong>{limit}</strong> {limit === 1 ? 'Property' : 'Properties'} verbinden ({plan === 'free' ? 'Free' : plan.charAt(0).toUpperCase() + plan.slice(1)}-Plan).</>
                : <>Du hast alle {limit} {limit === 1 ? 'Property' : 'Properties'} deines Plans belegt. Wähle ab um eine andere zu aktivieren.</>
              }
            </Sub>

            <InfoBox>
              💡 <strong>sc-domain:</strong> Deckt alle Subdomains & Protokolle ab (empfohlen). URL-Properties nur den exakten Pfad.
            </InfoBox>

            {loading ? (
              <LoadingWrap><LoadSpinner />Properties werden geladen…</LoadingWrap>
            ) : accounts.length === 0 ? (
              <EmptyNote>Keine Google-Konten gefunden.</EmptyNote>
            ) : (
              accounts.map(account => (
                <AccountBlock key={account.google_account_id}>
                  <AccountHeader onClick={() => setOpenAccounts(p => ({ ...p, [account.google_account_id]: !p[account.google_account_id] }))}>
                    <AccountEmail>
                      <GoogleIcon />
                      {account.google_email}
                    </AccountEmail>
                    <AccountChevron $open={openAccounts[account.google_account_id]}>▾</AccountChevron>
                  </AccountHeader>
                  <AccountBody $open={openAccounts[account.google_account_id]}>
                    {account.error ? (
                      <ErrorBadge>⚠️ Token abgelaufen oder Fehler beim Laden. Bitte Google-Konto neu verbinden.</ErrorBadge>
                    ) : account.sites?.length === 0 ? (
                      <EmptyNote>Keine GSC Properties in diesem Konto gefunden.</EmptyNote>
                    ) : (
                      <CheckboxList>
                        {(account.sites ?? []).map(site => {
                          const isSelected = site.url in selected;
                          return (
                            <CheckboxItem key={site.url} $checked={isSelected} onClick={() => toggleProperty(site.url, account.google_account_id)}>
                              <CheckboxBox $checked={isSelected}>{isSelected && '✓'}</CheckboxBox>
                              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {site.url}
                              </span>
                              {site.active && <ActiveBadge>aktiv</ActiveBadge>}
                            </CheckboxItem>
                          );
                        })}
                      </CheckboxList>
                    )}
                  </AccountBody>
                </AccountBlock>
              ))
            )}

            <div style={{ marginTop: '1.25rem' }}>
              <BtnPrimary onClick={() => setStep(2)} disabled={selectedCount === 0 || loading}>
                {selectedCount === 0 ? 'Mindestens eine Property wählen' : `${selectedCount} ${selectedCount === 1 ? 'Property' : 'Properties'} verbinden →`}
              </BtnPrimary>

              {isPro && onNewAccount && (
                <>
                  <Divider>oder</Divider>
                  <BtnGoogle onClick={onNewAccount}>
                    <GoogleIcon />
                    Weiteres Google-Konto verbinden
                  </BtnGoogle>
                </>
              )}
              <BtnGhost onClick={onDone}>Später einrichten</BtnGhost>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Title>Google Analytics verbinden</Title>
            <Sub>Optional: GA4 Property ID für Sessions, Nutzer und Engagement Rate im Report.</Sub>
            <Input type="text" placeholder="123456789" value={ga4Id} onChange={e => setGa4Id(e.target.value)} $error={!!error} />
            <HelpText>
              Zu finden in <a href="https://analytics.google.com" target="_blank" rel="noreferrer">Google Analytics</a> → Admin → Property Settings → Property ID. Nur Zahlen — nicht G-XXXXXXXX.
            </HelpText>
            {error && <ErrorText>{error}</ErrorText>}
            <BtnPrimary onClick={() => handleSave(false)} disabled={saving}>
              {saving ? <Spinner /> : 'Einrichtung abschließen →'}
            </BtnPrimary>
            <BtnGhost onClick={() => handleSave(true)} disabled={saving}>Ohne GA4 fortfahren</BtnGhost>
          </>
        )}
      </Box>
    </Overlay>
  );
}
