import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%,100% { opacity:.3; transform:scale(1); }
  50%      { opacity:.6; transform:scale(1.05); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({theme}) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${pulse} 6s ease-in-out infinite;
  pointer-events: none;
  &.o1 { width:500px;height:500px;background:radial-gradient(circle,rgba(108,99,255,.1) 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%); }
  &.o2 { width:300px;height:300px;background:radial-gradient(circle,rgba(99,207,255,.07) 0%,transparent 70%);bottom:0;right:5%;animation-delay:3s; }
`;

const Card = styled.div`
  background: ${({theme}) => theme.colors.bgCard};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 520px;
  width: 100%;
  animation: ${fadeUp} 0.6s ease both;
  position: relative;
  z-index: 1;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: .375rem;
  margin-bottom: 2rem;
  text-decoration: none;
`;
const LogoDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({theme}) => theme.colors.accent};
  box-shadow: 0 0 8px ${({theme}) => theme.colors.accent};
`;
const LogoText = styled.span`
  font-family: ${({theme}) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 800;
  color: ${({theme}) => theme.colors.text};
  letter-spacing: -0.03em;
  span { color: ${({theme}) => theme.colors.accent}; }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  background: ${({theme}) => theme.colors.accentDim};
  border: 1px solid rgba(108,99,255,.2);
  border-radius: 100px;
  padding: .25rem .875rem;
  font-size: .75rem;
  font-weight: 600;
  color: ${({theme}) => theme.colors.accent};
  margin-bottom: 1.25rem;
  &::before { content:''; width:5px;height:5px;border-radius:50%;background:${({theme}) => theme.colors.accent}; }
`;

const Title = styled.h1`
  font-family: ${({theme}) => theme.fonts.display};
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin-bottom: .75rem;
  .grad {
    background: linear-gradient(135deg, #6C63FF 0%, #A78BFA 40%, #63CFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Sub = styled.p`
  font-size: .9375rem;
  color: ${({theme}) => theme.colors.textMuted};
  line-height: 1.65;
  font-weight: 300;
  margin-bottom: 1.75rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: .625rem;
  margin-bottom: 1rem;
  @media (max-width: 480px) { flex-direction: column; }
`;

const Input = styled.input`
  flex: 1;
  padding: .75rem 1rem;
  background: ${({theme}) => theme.colors.bg};
  border: 1.5px solid ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.radius.lg};
  color: ${({theme}) => theme.colors.text};
  font-size: .9375rem;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
  font-family: monospace;
  &::placeholder { color: ${({theme}) => theme.colors.textDim}; font-family: inherit; }
  &:focus {
    border-color: ${({theme}) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accentDim};
  }
`;

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  background: ${({theme}) => theme.colors.accent};
  color: #fff;
  font-weight: 700;
  font-size: .9375rem;
  padding: .75rem 1.5rem;
  border-radius: ${({theme}) => theme.radius.lg};
  border: none;
  cursor: pointer;
  transition: all .2s;
  white-space: nowrap;
  &:hover:not(:disabled) {
    background: ${({theme}) => theme.colors.accentHover};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(108,99,255,.35);
  }
  &:disabled { opacity: .6; cursor: not-allowed; transform: none; }
`;

const Spinner = styled.div`
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} .7s linear infinite;
`;

const Error = styled.div`
  font-size: .8125rem;
  color: #EF4444;
  margin-bottom: .75rem;
  padding: .5rem .875rem;
  background: #EF444410;
  border-radius: 8px;
  border: 1px solid #EF444425;
`;

const ResultBox = styled.div`
  animation: ${fadeUp} 0.4s ease both;
`;

const ResultBanner = styled.div`
  background: linear-gradient(135deg, #10B98110, #6C63FF08);
  border: 1px solid #10B98125;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ResultTitle = styled.div`
  font-size: .8125rem;
  font-weight: 700;
  color: #10B981;
  margin-bottom: .25rem;
`;

const ResultDomain = styled.div`
  font-family: monospace;
  font-size: .9375rem;
  color: ${({theme}) => theme.colors.text};
  font-weight: 600;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: .5rem;
  margin-bottom: 1.5rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: flex-start;
  gap: .625rem;
  font-size: .875rem;
  color: ${({theme}) => theme.colors.textMuted};
  line-height: 1.5;
  span.icon { color: #10B981; flex-shrink: 0; margin-top: 1px; }
`;

const CtaBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  background: ${({theme}) => theme.colors.accent};
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  padding: .9rem 2rem;
  border-radius: ${({theme}) => theme.radius.lg};
  text-decoration: none;
  transition: all .2s;
  margin-bottom: .75rem;
  &:hover {
    background: ${({theme}) => theme.colors.accentHover};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108,99,255,.35);
  }
`;

const SecondaryLink = styled(Link)`
  display: block;
  text-align: center;
  font-size: .8125rem;
  color: ${({theme}) => theme.colors.textMuted};
  text-decoration: none;
  &:hover { color: ${({theme}) => theme.colors.text}; }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({theme}) => theme.colors.border};
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: .3rem;
  font-size: .75rem;
  color: ${({theme}) => theme.colors.textDim};
  svg { color: #10B981; }
`;

function cleanDomain(raw) {
  let d = raw.trim();
  if (!d.startsWith('http')) d = 'https://' + d;
  try {
    return new URL(d).hostname.replace(/^www\./, '');
  } catch {
    return raw.trim().replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  }
}

function isValidDomain(d) {
  return /^[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(d);
}

export default function TestPage({ lang = 'en' }) {
  const [input, setInput]     = React.useState('');
  const [domain, setDomain]   = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError]     = React.useState('');
  const [done, setDone]       = React.useState(false);
  const isDE = lang === 'de';

  const handleSubmit = async () => {
    setError('');
    const d = cleanDomain(input);
    if (!d || !isValidDomain(d)) {
      setError(isDE ? 'Bitte eine gültige Domain eingeben (z.B. example.com)' : 'Please enter a valid domain (e.g. example.com)');
      return;
    }
    setDomain(d);
    setLoading(true);
    // Simulate brief check — in production you could validate GSC availability
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  const regUrl = `/register?domain=${encodeURIComponent(domain)}&source=test`;

  return (
    <Page>
      <Orb className="o1" />
      <Orb className="o2" />
      <Card>
        <Logo to="/">
          <LogoDot />
          <LogoText>Rank<span>Brief</span></LogoText>
        </Logo>

        {!done ? (
          <>
            <Badge>{isDE ? 'Kostenlos testen' : 'Free report'}</Badge>
            <Title>
              {isDE
                ? <><span className="grad">Wie sieht dein</span><br />Report aus?</>
                : <><span className="grad">See your report</span><br />before you sign up.</>}
            </Title>
            <Sub>
              {isDE
                ? 'Gib deine Domain ein — wir zeigen dir genau was deine Kunden jeden Monat automatisch erhalten.'
                : 'Enter your domain and see exactly what your clients would receive automatically every month.'}
            </Sub>

            {error && <Error>{error}</Error>}

            <InputRow>
              <Input
                type="text"
                placeholder={isDE ? 'deine-domain.de' : 'your-domain.com'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
              />
              <Btn onClick={handleSubmit} disabled={loading || !input.trim()}>
                {loading ? <Spinner /> : (isDE ? 'Report ansehen' : 'See report')}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Btn>
            </InputRow>

            <TrustRow>
              {[
                isDE ? 'Erster Report kostenlos' : 'First report free',
                isDE ? 'Keine Kreditkarte' : 'No credit card',
                isDE ? 'Setup in 3 Min' : 'Setup in 3 min',
              ].map(item => (
                <TrustItem key={item}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 0l1.4 4.2H12L8.6 6.8l1.4 4.4L6 8.8l-4 2.4 1.4-4.4L0 4.2h4.6z"/>
                  </svg>
                  {item}
                </TrustItem>
              ))}
            </TrustRow>
          </>
        ) : (
          <ResultBox>
            <ResultBanner>
              <ResultTitle>
                {isDE ? '✅ Domain erkannt' : '✅ Domain found'}
              </ResultTitle>
              <ResultDomain>{domain}</ResultDomain>
            </ResultBanner>

            <FeatureList>
              {[
                isDE
                  ? ['Automatischer PDF-Report', 'Jeden 1. des Monats — mit deinem Logo, deinem Namen']
                  : ['Automatic PDF report', 'On the 1st of every month — with your logo and name'],
                isDE
                  ? ['KI-Zusammenfassung', 'Was hat sich verändert, was sind die nächsten Schritte']
                  : ['AI summary', "What changed, what's next — written in plain language"],
                isDE
                  ? ['Top Keywords & Seiten', 'Mit Performance-Balken und Positionsveränderungen']
                  : ['Top keywords & pages', 'With performance bars and position changes'],
                isDE
                  ? ['Markt-Radar', 'Revier, Angriff, Potenzial — dein SEO-Lagebild auf einen Blick']
                  : ['Market radar', 'Territory, Attack, Potential — your SEO landscape at a glance'],
              ].map(([title, desc]) => (
                <Feature key={title}>
                  <span className="icon">✓</span>
                  <span><strong>{title}</strong> — {desc}</span>
                </Feature>
              ))}
            </FeatureList>

            <CtaBtn to={regUrl}>
              {isDE ? 'Kostenlosen Report erhalten →' : 'Get my free report →'}
            </CtaBtn>
            <SecondaryLink to="/register">
              {isDE ? 'Konto erstellen — kostenlos, keine Kreditkarte' : 'Create account — free, no credit card'}
            </SecondaryLink>

            <TrustRow>
              <TrustItem>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0l1.4 4.2H12L8.6 6.8l1.4 4.4L6 8.8l-4 2.4 1.4-4.4L0 4.2h4.6z"/>
                </svg>
                {isDE ? 'Code EARLY2026 — 3 Monate Pro gratis' : 'Code EARLY2026 — 3 months Pro free'}
              </TrustItem>
            </TrustRow>
          </ResultBox>
        )}
      </Card>
    </Page>
  );
}
