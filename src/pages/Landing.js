import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// ── Animations ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ── Layout ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
`;

// ── Hero ─────────────────────────────────────────────────────────────────────
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 2rem 6rem;
  overflow: hidden;
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${pulse} 6s ease-in-out infinite;
  pointer-events: none;

  &.orb1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%);
    top: -100px; left: 50%;
    transform: translateX(-50%);
    animation-delay: 0s;
  }
  &.orb2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(99,207,255,0.1) 0%, transparent 70%);
    bottom: 100px; right: 10%;
    animation-delay: 2s;
  }
  &.orb3 {
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(255,99,180,0.08) 0%, transparent 70%);
    bottom: 200px; left: 5%;
    animation-delay: 4s;
  }
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%);
  pointer-events: none;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: 100px;
  padding: 0.375rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.6s ease both;

  &::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.accent};
  }
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
  max-width: 900px;
  margin-bottom: 1.5rem;
  animation: ${fadeUp} 0.6s 0.1s ease both;

  .gradient {
    background: linear-gradient(135deg, #6C63FF 0%, #A78BFA 40%, #63CFFF 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 4s linear infinite;
  }
`;

const HeroSub = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 560px;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  font-weight: 300;
  animation: ${fadeUp} 0.6s 0.2s ease both;
`;

const HeroCTA = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeUp} 0.6s 0.3s ease both;
`;

const BtnPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1rem;
  padding: 0.875rem 2rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all 0.25s;
  box-shadow: 0 0 0 0 rgba(108,99,255,0.4);

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(108,99,255,0.4);
  }

  svg { transition: transform 0.2s; }
  &:hover svg { transform: translateX(3px); }
`;

const BtnGhost = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 0.875rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.borderLight};
    background: ${({ theme }) => theme.colors.bgCard};
  }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeUp} 0.6s 0.4s ease both;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};

  svg { color: ${({ theme }) => theme.colors.success}; }
`;

// ── Mock Dashboard Preview ────────────────────────────────────────────────────
const PreviewWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 860px;
  margin: 4rem auto 0;
  animation: ${fadeUp} 0.8s 0.5s ease both;
`;

const PreviewGlow = styled.div`
  position: absolute;
  inset: -40px;
  background: radial-gradient(ellipse at 50% 50%, rgba(108,99,255,0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: ${float} 4s ease-in-out infinite;
`;

const PreviewCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
  animation: ${float} 5s ease-in-out infinite;
`;

const PreviewBar = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .red { background: #FF5F57; }
  .yellow { background: #FEBC2E; }
  .green { background: #28C840; }

  span {
    margin-left: auto;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textDim};
  }
`;

const PreviewBody = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const KpiCard = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem;

  .label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textDim};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
  }

  .value {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  .delta {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    color: ${({ up }) => up ? '#34D399' : '#F87171'};

    &::before { content: '${({ up }) => up ? '▲' : '▼'} '; }
  }
`;

const ChartRow = styled.div`
  padding: 0 1.5rem 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ChartPlaceholder = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem;
  height: 120px;
  position: relative;
  overflow: hidden;

  .title {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textDim};
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  svg { width: 100%; height: 70px; }
`;

const TablePlaceholder = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem;

  .title {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textDim};
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child { border-bottom: none; }

  .kw { font-size: 0.8rem; color: ${({ theme }) => theme.colors.textMuted}; }
  .val { font-size: 0.75rem; font-family: ${({ theme }) => theme.fonts.mono}; color: ${({ theme }) => theme.colors.accent}; }
`;

// ── Features ─────────────────────────────────────────────────────────────────
const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 6rem 2rem;
`;

const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 1rem;
  max-width: 600px;
`;

const SectionSub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.0625rem;
  max-width: 500px;
  line-height: 1.7;
  font-weight: 300;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.75rem;
  transition: all 0.25s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 44px; height: 44px;
  background: ${({ theme }) => theme.colors.accentDim};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const FeatureText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  font-weight: 300;
`;

// ── How it works ─────────────────────────────────────────────────────────────
const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 24px; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.border}, ${({ theme }) => theme.colors.borderLight}, ${({ theme }) => theme.colors.border}, transparent);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
    &::before { display: none; }
  }
`;

const Step = styled.div`
  text-align: center;
  position: relative;
`;

const StepNum = styled.div`
  width: 48px; height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.accent};
  margin: 0 auto 1.25rem;
  position: relative;
  z-index: 1;
`;

const StepTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const StepText = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  font-weight: 300;
`;

// ── Pricing ───────────────────────────────────────────────────────────────────
const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 860px) { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
`;

const PricingCard = styled.div`
  background: ${({ $featured, theme }) => $featured ? theme.colors.accent : theme.colors.bgCard};
  border: 1px solid ${({ $featured, theme }) => $featured ? 'transparent' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;

  ${({ $featured }) => $featured && `
    box-shadow: 0 0 60px rgba(108,99,255,0.3);
    transform: scale(1.02);
  `}

  &:hover { transform: ${({ $featured }) => $featured ? 'scale(1.04)' : 'translateY(-3px)'}; }
`;

const PlanBadge = styled.div`
  display: inline-block;
  background: rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
  color: ${({ $featured }) => $featured ? '#fff' : ({ theme }) => theme.colors.accent};
`;

const PlanPrice = styled.div`
  margin-bottom: 1.5rem;

  .amount {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${({ $featured }) => $featured ? '#fff' : ({ theme }) => theme.colors.text};
    line-height: 1;
  }

  .period {
    font-size: 0.875rem;
    color: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.7)' : ({ theme }) => theme.colors.textMuted};
    margin-left: 0.25rem;
  }
`;

const PlanFeatures = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.85)' : ({ theme }) => theme.colors.textMuted};
  font-weight: 300;

  &::before {
    content: '✓';
    width: 18px; height: 18px;
    background: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.2)' : 'rgba(108,99,255,0.15)'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6875rem;
    color: ${({ $featured }) => $featured ? '#fff' : '#6C63FF'};
    flex-shrink: 0;
  }
`;

const PlanCTA = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  transition: all 0.2s;

  background: ${({ $featured }) => $featured ? '#fff' : 'rgba(108,99,255,0.12)'};
  color: ${({ $featured }) => $featured ? '#6C63FF' : ({ theme }) => theme.colors.accent};
  border: 1px solid ${({ $featured }) => $featured ? 'transparent' : 'rgba(108,99,255,0.2)'};

  &:hover {
    background: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.9)' : 'rgba(108,99,255,0.2)'};
    transform: translateY(-1px);
  }
`;

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-width: 720px;
`;

const FaqItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const FaqQ = styled.button`
  width: 100%;
  text-align: left;
  padding: 1.25rem 1.5rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.bgCard};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  letter-spacing: -0.01em;

  &:hover { background: ${({ theme }) => theme.colors.bgElevated}; }

  span {
    color: ${({ theme }) => theme.colors.accent};
    font-size: 1.25rem;
    font-weight: 300;
    flex-shrink: 0;
  }
`;

const FaqA = styled.div`
  padding: ${({ $open }) => $open ? '1.25rem 1.5rem' : '0 1.5rem'};
  max-height: ${({ $open }) => $open ? '300px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
  font-weight: 300;
  background: ${({ theme }) => theme.colors.bgCard};
`;

// ── data ──────────────────────────────────────────────────────────────────────
const features = [
  { icon: '⚡', title: 'Fully Automated', text: 'Connect once. Every month, your report is generated and delivered automatically – no manual work required.' },
  { icon: '🤖', title: 'AI-Powered Summaries', text: 'Each report includes a plain-language summary written by Claude. No SEO jargon, just clear insights your clients understand.' },
  { icon: '🏷️', title: 'White-Label Ready', text: 'Upload your logo and send reports under your own brand. Your clients see your name, not ours.' },
  { icon: '📊', title: 'GSC + GA4 Combined', text: 'Clicks, impressions, sessions, engagement – all in one clean report. No switching between tools.' },
  { icon: '📈', title: 'Month-over-Month Trends', text: 'Every metric comes with a comparison to the previous month. See what\'s improving and what needs attention.' },
  { icon: '🔒', title: 'GDPR Compliant', text: 'EU servers, AES-256 token encryption, minimal data retention. Built for European privacy requirements from day one.' },
];

const steps = [
  { n: '01', title: 'Connect Google', text: 'Sign in with Google and select your Search Console and GA4 properties.' },
  { n: '02', title: 'Choose a plan', text: 'Pick Basic, Pro, or Agency depending on how many domains you manage.' },
  { n: '03', title: 'Receive your report', text: 'On the 1st of every month, your PDF report lands in your inbox automatically.' },
  { n: '04', title: 'Share with clients', text: 'Forward or white-label the report. Your clients get professional insights without any effort.' },
];

const plans = [
  {
    name: 'Basic', price: '19', period: '/mo',
    features: ['1 domain', 'Monthly PDF report', 'GSC + GA4 data', 'AI summary', 'Email delivery'],
  },
  {
    name: 'Pro', price: '39', period: '/mo', featured: true,
    features: ['3 domains', 'Everything in Basic', 'White-label reports', 'Custom logo', 'Priority delivery'],
  },
  {
    name: 'Agency', price: '79', period: '/mo',
    features: ['10 domains', 'Everything in Pro', 'Client management', 'Bulk reporting', 'Agency branding'],
  },
];

const faqs = [
  { q: 'Is my Google data safe?', a: 'Yes. We request read-only access to your Search Console and Analytics data. OAuth tokens are encrypted using AES-256-GCM and stored on EU servers (Frankfurt). We never access your data beyond what\'s needed to generate your report.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your dashboard at any time. Your subscription remains active until the end of the billing period. No questions asked, no hidden fees.' },
  { q: 'Do I need to be technical to use RankBrief?', a: 'Not at all. Setup takes about 3 minutes: sign in with Google, select your website, choose a plan. After that, everything is automatic.' },
  { q: 'What does the report include?', a: 'Each report covers clicks, impressions, CTR, average position, sessions, engagement rate, top 10 keywords, top 10 pages, month-over-month comparison, and an AI-written plain-language summary.' },
  { q: 'Can I use my own logo?', a: 'Yes, on Pro and Agency plans. Upload your logo and your clients will receive reports branded with your company name and logo – no RankBrief branding.' },
  { q: 'Which Google properties are supported?', a: 'Any verified Google Search Console property. GA4 support is available for all standard properties. We support both domain and URL-prefix GSC properties.' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Landing() {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <Page>
      {/* HERO */}
      <HeroSection>
        <GlowOrb className="orb1" />
        <GlowOrb className="orb2" />
        <GlowOrb className="orb3" />
        <GridBg />

        <HeroBadge>Automated SEO reporting for agencies & freelancers</HeroBadge>

        <HeroTitle>
          Your SEO report,<br />
          <span className="gradient">delivered automatically.</span>
        </HeroTitle>

        <HeroSub>
          Connect Google Search Console once. Every month, RankBrief generates a professional PDF report and sends it to your inbox – powered by AI, zero manual work.
        </HeroSub>

        <HeroCTA>
          <BtnPrimary to="/register">
            Start for free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BtnPrimary>
          <BtnGhost to="#features">See how it works</BtnGhost>
        </HeroCTA>

        <TrustRow>
          <TrustItem>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0l1.8 5.4H14l-4.6 3.3 1.8 5.5L7 11l-4.2 3.2 1.8-5.5L0 5.4h5.2z"/></svg>
            No credit card required
          </TrustItem>
          <TrustItem>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0l1.8 5.4H14l-4.6 3.3 1.8 5.5L7 11l-4.2 3.2 1.8-5.5L0 5.4h5.2z"/></svg>
            GDPR compliant · EU servers
          </TrustItem>
          <TrustItem>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0l1.8 5.4H14l-4.6 3.3 1.8 5.5L7 11l-4.2 3.2 1.8-5.5L0 5.4h5.2z"/></svg>
            Cancel anytime
          </TrustItem>
        </TrustRow>

        <PreviewWrap>
          <PreviewGlow />
          <PreviewCard>
            <PreviewBar>
              <div className="dot red" /><div className="dot yellow" /><div className="dot green" />
              <span>rankbrief.com/dashboard</span>
            </PreviewBar>
            <PreviewBody>
              {[
                { label: 'Clicks', value: '4,821', delta: '+12.4%', up: true },
                { label: 'Impressions', value: '89,340', delta: '+8.1%', up: true },
                { label: 'Avg. CTR', value: '5.4%', delta: '-0.3%', up: false },
                { label: 'Avg. Position', value: '14.2', delta: '+2.1', up: true },
              ].map(k => (
                <KpiCard key={k.label} up={k.up}>
                  <div className="label">{k.label}</div>
                  <div className="value">{k.value}</div>
                  <div className="delta">{k.delta}</div>
                </KpiCard>
              ))}
            </PreviewBody>
            <ChartRow>
              <ChartPlaceholder>
                <div className="title">Click trend · Last 3 months</div>
                <svg viewBox="0 0 400 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#6C63FF" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,60 C50,55 80,45 120,40 C160,35 180,30 220,25 C260,20 300,18 340,12 C360,9 380,8 400,5 L400,70 L0,70 Z" fill="url(#g)"/>
                  <path d="M0,60 C50,55 80,45 120,40 C160,35 180,30 220,25 C260,20 300,18 340,12 C360,9 380,8 400,5" stroke="#6C63FF" strokeWidth="2" fill="none"/>
                </svg>
              </ChartPlaceholder>
              <TablePlaceholder>
                <div className="title">Top Keywords</div>
                {['seo reporting tool', 'gsc monthly report', 'automated seo', 'search console pdf'].map(kw => (
                  <TableRow key={kw}>
                    <span className="kw">{kw}</span>
                    <span className="val">{Math.floor(Math.random() * 300 + 50)}</span>
                  </TableRow>
                ))}
              </TablePlaceholder>
            </ChartRow>
          </PreviewCard>
        </PreviewWrap>
      </HeroSection>

      {/* HOW IT WORKS */}
      <Section id="features">
        <SectionLabel>How it works</SectionLabel>
        <SectionTitle>Set it up once.<br />Reports run forever.</SectionTitle>
        <SectionSub>Four steps between you and automated monthly SEO reporting.</SectionSub>
        <StepsGrid>
          {steps.map(s => (
            <Step key={s.n}>
              <StepNum>{s.n}</StepNum>
              <StepTitle>{s.title}</StepTitle>
              <StepText>{s.text}</StepText>
            </Step>
          ))}
        </StepsGrid>
      </Section>

      {/* FEATURES */}
      <Section>
        <SectionLabel>Features</SectionLabel>
        <SectionTitle>Everything you need.<br />Nothing you don't.</SectionTitle>
        <SectionSub>Built for freelancers and small agencies who bill hourly and hate manual reporting.</SectionSub>
        <FeaturesGrid>
          {features.map(f => (
            <FeatureCard key={f.title}>
              <FeatureIcon>{f.icon}</FeatureIcon>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureText>{f.text}</FeatureText>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* PRICING */}
      <Section id="pricing">
        <SectionLabel>Pricing</SectionLabel>
        <SectionTitle>Simple pricing.<br />No surprises.</SectionTitle>
        <SectionSub>Start free for 14 days. No credit card required.</SectionSub>
        <PricingGrid>
          {plans.map(p => (
            <PricingCard key={p.name} $featured={p.featured}>
              <PlanBadge $featured={p.featured}>{p.name}</PlanBadge>
              <PlanPrice $featured={p.featured}>
                <span className="amount">€{p.price}</span>
                <span className="period">{p.period}</span>
              </PlanPrice>
              <PlanFeatures>
                {p.features.map(f => (
                  <PlanFeature key={f} $featured={p.featured}>{f}</PlanFeature>
                ))}
              </PlanFeatures>
              <PlanCTA to="/register" $featured={p.featured}>Get started</PlanCTA>
            </PricingCard>
          ))}
        </PricingGrid>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Questions & answers</SectionTitle>
        <SectionSub style={{ marginBottom: '2.5rem' }}>Everything you need to know before signing up.</SectionSub>
        <FaqList>
          {faqs.map((f, i) => (
            <FaqItem key={i}>
              <FaqQ onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <span>{openFaq === i ? '−' : '+'}</span>
              </FaqQ>
              <FaqA $open={openFaq === i}>{f.a}</FaqA>
            </FaqItem>
          ))}
        </FaqList>
      </Section>

      {/* CTA BANNER */}
      <Section style={{ paddingTop: 0 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(99,207,255,0.05) 100%)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '24px',
          padding: '4rem 3rem',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Stop writing reports manually.
          </h2>
          <p style={{ color: '#8888AA', fontSize: '1.0625rem', marginBottom: '2rem', fontWeight: 300 }}>
            Join freelancers and agencies who automated their SEO reporting with RankBrief.
          </p>
          <BtnPrimary to="/register">Start your free trial →</BtnPrimary>
        </div>
      </Section>
    </Page>
  );
}
