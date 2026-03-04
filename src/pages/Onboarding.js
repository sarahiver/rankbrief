import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

// ── Layout ────────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 520px;
  animation: ${fadeUp} 0.4s ease both;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 2rem;
  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const LogoDot = styled.div`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const StepDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $active, $done, theme }) =>
    $done ? theme.colors.success :
    $active ? theme.colors.accent :
    theme.colors.border};
  transition: background 0.3s;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  margin-bottom: 1.75rem;
  line-height: 1.6;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ $error, theme }) => $error ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 0.5rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; font-family: inherit; }
`;

const HelpText = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-weight: 300;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const ErrorText = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 1rem;
`;

const SkipText = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  margin-bottom: 1.25rem;
  font-weight: 300;
`;

const BtnPrimary = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.accentHover}; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BtnGhost = styled.button`
  width: 100%;
  padding: 0.75rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.875rem;
  margin-top: 0.75rem;
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const Spinner = styled.div`
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.6;
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function Onboarding({ user }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = GSC auswählen, 2 = GA4 eingeben
  const [pendingSites, setPendingSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [ga4Id, setGa4Id] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPendingSites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPendingSites = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('properties')
      .select('id, gsc_property_url, display_name')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    setPendingSites(data ?? []);
    if (data?.length > 0) setSelectedSite(data[0].id);
    setLoading(false);
  };

  const handleSelectProperty = async () => {
    if (!selectedSite) return;
    setStep(2);
  };

  const handleSave = async (skipGa4 = false) => {
    setSaving(true);
    setError('');

    // GA4 ID validieren (wenn nicht übersprungen)
    const ga4Value = skipGa4 ? null : ga4Id.trim() || null;
    if (!skipGa4 && ga4Id.trim() && !/^\d+$/.test(ga4Id.trim())) {
      setError('Die GA4 Property ID besteht nur aus Zahlen (z.B. 123456789). Nicht die G-XXX Measurement ID.');
      setSaving(false);
      return;
    }

    try {
      // Ausgewählte Property auf "active" setzen + GA4 ID speichern
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          status: 'active',
          ga_property_id: ga4Value,
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', selectedSite)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Alle anderen pending Properties dieses Users löschen
      await supabase
        .from('properties')
        .delete()
        .eq('user_id', user.id)
        .eq('status', 'pending');

      navigate('/dashboard?connected=true');
    } catch (err) {
      setError('Fehler beim Speichern. Bitte versuche es erneut.');
      console.error(err);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Page>
        <Card>
          <Logo><LogoDot />Rank<span>Brief</span></Logo>
          <EmptyState>Verbindung wird hergestellt...</EmptyState>
        </Card>
      </Page>
    );
  }

  // Keine pending Sites → direkt zum Dashboard
  if (!loading && pendingSites.length === 0) {
    navigate('/dashboard?connected=true');
    return null;
  }

  return (
    <Page>
      <Card>
        <Logo><LogoDot />Rank<span>Brief</span></Logo>

        <StepIndicator>
          <StepDot $done={step > 1} $active={step === 1} />
          <StepDot $done={step > 2} $active={step === 2} />
        </StepIndicator>

        {/* ── Step 1: GSC Property auswählen ── */}
        {step === 1 && (
          <>
            <Title>Welche Website tracken?</Title>
            <Subtitle>
              Wir haben {pendingSites.length} {pendingSites.length === 1 ? 'Property' : 'Properties'} in deiner Google Search Console gefunden.
              Wähle die Website aus, für die du monatliche Reports erhalten möchtest.
            </Subtitle>

            <Label>GSC Property</Label>
            <Select
              value={selectedSite}
              onChange={e => setSelectedSite(e.target.value)}
            >
              {pendingSites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.gsc_property_url}
                </option>
              ))}
            </Select>

            <BtnPrimary onClick={handleSelectProperty} disabled={!selectedSite}>
              Weiter →
            </BtnPrimary>
          </>
        )}

        {/* ── Step 2: GA4 Property ID ── */}
        {step === 2 && (
          <>
            <Title>Google Analytics verbinden</Title>
            <Subtitle>
              Mit deiner GA4 Property ID ergänzen wir die Reports um Sessions, Nutzer und Engagement Rate.
            </Subtitle>

            <Label>GA4 Property ID</Label>
            <Input
              type="text"
              placeholder="123456789"
              value={ga4Id}
              onChange={e => setGa4Id(e.target.value)}
              $error={!!error}
            />

            <HelpText>
              Die Property ID findest du in{' '}
              <a href="https://analytics.google.com" target="_blank" rel="noreferrer">
                Google Analytics
              </a>
              {' '}→ Admin → Property Settings → Property ID.
              Es ist eine reine Zahl – nicht die Measurement ID (G-XXXXXXXX).
            </HelpText>

            {error && <ErrorText>{error}</ErrorText>}

            <SkipText>
              Du kannst die GA4 ID auch später in den Einstellungen hinzufügen.
            </SkipText>

            <BtnPrimary onClick={() => handleSave(false)} disabled={saving}>
              {saving ? <Spinner /> : 'Einrichtung abschließen →'}
            </BtnPrimary>

            <BtnGhost onClick={() => handleSave(true)} disabled={saving}>
              Ohne GA4 fortfahren
            </BtnGhost>
          </>
        )}
      </Card>
    </Page>
  );
}
