import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  line-height: 1.6;
`;

const BackLink = styled(Link)`
  display: block;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 1.5rem;
  font-weight: 300;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true); setError('');

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <Page>
      <Glow />
      <Card>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>

        <Title>Reset your password</Title>
        <Sub>
          Enter your email address and we'll send you a link to reset your password.
        </Sub>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        {success ? (
          <SuccessMsg>
            ✅ Check your inbox — we've sent a password reset link to <strong>{email}</strong>.
            <br /><br />
            The link expires in 1 hour.
          </SuccessMsg>
        ) : (
          <>
            <Field>
              <Label>Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
              />
            </Field>
            <BtnSubmit onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link →'}
            </BtnSubmit>
          </>
        )}

        <BackLink to="/login">← Back to sign in</BackLink>
      </Card>
    </Page>
  );
}
