import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../lib/supabase';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const Glow = styled.div`
  position: fixed;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  filter: blur(40px);
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2.5rem;
  animation: ${fadeUp} 0.5s ease both;
  position: relative;
  z-index: 1;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const LogoDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.accent};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.375rem;
`;

const Sub = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; }
`;

const BtnSubmit = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1rem;
  padding: 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s;
  margin-top: 0.5rem;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorMsg = styled.div`
  background: rgba(248,113,113,0.1);
  border: 1px solid rgba(248,113,113,0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 1rem;
`;

const SuccessMsg = styled.div`
  background: ${({ theme }) => theme.colors.successDim};
  border: 1px solid rgba(52,211,153,0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 1rem;
`;

const StrengthBar = styled.div`
  height: 4px;
  border-radius: 2px;
  margin-top: 0.5rem;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background 0.3s;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct }) =>
    $pct < 40 ? '#EF4444' :
    $pct < 70 ? '#F59E0B' :
    '#10B981'};
`;

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score += 25;
  if (pw.length >= 12) score += 15;
  if (/[A-Z]/.test(pw)) score += 20;
  if (/[0-9]/.test(pw)) score += 20;
  if (/[^A-Za-z0-9]/.test(pw)) score += 20;
  return Math.min(score, 100);
}

export default function ResetPassword() {
  const navigate  = useNavigate();
  const [password, setPassword]   = useState('');
  const [confirm,  setConfirm]    = useState('');
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState('');
  const [success,  setSuccess]    = useState(false);
  const [validLink, setValidLink] = useState(true);

  useEffect(() => {
    // Supabase setzt die Session automatisch aus dem URL-Hash
    // Wir warten kurz und prüfen ob eine Session vorhanden ist
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Auf onAuthStateChange warten (Supabase verarbeitet den Hash)
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            // Link ist gültig, User kann Passwort setzen
            listener.subscription.unsubscribe();
          } else if (!session) {
            setValidLink(false);
            listener.subscription.unsubscribe();
          }
        });
        // Timeout: nach 3s ohne Event → Link ungültig
        setTimeout(() => {
          listener.subscription.unsubscribe();
        }, 3000);
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async () => {
    if (!password) { setError('Please enter a new password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true); setError('');

    const { error: err } = await supabase.auth.updateUser({ password });

    if (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    }
    setLoading(false);
  };

  const strength = getStrength(password);

  if (!validLink) {
    return (
      <Page>
        <Glow />
        <Card>
          <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
          <Title>Link expired</Title>
          <Sub>This password reset link has expired or is invalid. Please request a new one.</Sub>
          <Link to="/forgot-password" style={{ display: 'block', textAlign: 'center', color: 'inherit' }}>
            <BtnSubmit as="div">Request new link →</BtnSubmit>
          </Link>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Glow />
      <Card>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>

        <Title>Set new password</Title>
        <Sub>Choose a strong password for your RankBrief account.</Sub>

        {error   && <ErrorMsg>{error}</ErrorMsg>}
        {success && <SuccessMsg>✅ Password updated! Redirecting to dashboard…</SuccessMsg>}

        {!success && (
          <>
            <Field>
              <Label>New password</Label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              {password && (
                <StrengthBar>
                  <StrengthFill $pct={strength} />
                </StrengthBar>
              )}
            </Field>

            <Field>
              <Label>Confirm password</Label>
              <Input
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </Field>

            <BtnSubmit onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving…' : 'Update password →'}
            </BtnSubmit>
          </>
        )}
      </Card>
    </Page>
  );
}
