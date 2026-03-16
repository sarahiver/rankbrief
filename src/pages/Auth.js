import React, { useState } from 'react';
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
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
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
    box-shadow: 0 6px 20px rgba(108,99,255,0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.8125rem;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const BtnGoogle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    background: ${({ theme }) => theme.colors.bgCard};
  }

  svg { width: 18px; height: 18px; }
`;

const Toggle = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 1.5rem;
  font-weight: 300;

  button {
    background: none;
    border: none;
    padding: 0;
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 500;
    font-size: inherit;
    cursor: pointer;

    &:hover { text-decoration: underline; }
  }
`;

const ErrorMsg = styled.div`
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const SuccessMsg = styled.div`
  background: ${({ theme }) => theme.colors.successDim};
  border: 1px solid rgba(52,211,153,0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.success};
`;

const PromoField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: -0.25rem;
`;

const PromoInput = styled.input`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: border-color 0.2s;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; text-transform: none; }
`;

const PromoLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export default function Auth({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError(''); setSuccess('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { data: signUpData, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Promo code einloesen falls angegeben
        if (promoCode.trim() && signUpData?.user?.id) {
          const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
          const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;
          const res = await fetch(`${SUPABASE_URL}/functions/v1/redeem-promo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON}`,
              'apikey': SUPABASE_ANON,
            },
            body: JSON.stringify({ code: promoCode.trim(), user_id: signUpData.user.id }),
          });
          const promoResult = await res.json();
          if (promoResult.success) {
            setSuccess(`✅ Account created & promo code activated! Your ${promoResult.plan} plan is ready. Check your email to confirm your account.`);
          } else {
            setSuccess('Check your email to confirm your account. (Promo code could not be applied – please contact support.)');
          }
        } else {
          setSuccess('Check your email to confirm your account.');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <Page>
      <Glow />
      <Card>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>

        <Title>{isLogin ? 'Welcome back' : 'Create your account'}</Title>
        <Sub>{isLogin ? 'Sign in to your RankBrief dashboard.' : 'Start for free – first month on us. No credit card required.'}</Sub>

        <Form>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          {success && <SuccessMsg>{success}</SuccessMsg>}

          <Field>
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
            />
          </Field>

          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder={isLogin ? '••••••••' : 'At least 8 characters'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </Field>

          {!isLogin && (
            <PromoField>
              <PromoLabel>
                🎟️ Promo code <span style={{ fontWeight: 300, fontSize: '0.75rem', color: '#999' }}>(optional)</span>
              </PromoLabel>
              <PromoInput
                type="text"
                placeholder="e.g. AGENCY-SARAH"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
              />
            </PromoField>
          )}

          <BtnSubmit onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </BtnSubmit>

          <Divider>or</Divider>

          <BtnGoogle onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </BtnGoogle>
        </Form>

        <Toggle>
          {isLogin ? (
            <>Don't have an account? <button onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}>Sign up free</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}>Sign in</button></>
          )}
        </Toggle>
      </Card>
    </Page>
  );
}
