import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ── Layout ────────────────────────────────────────────────────────────────────
const Page = styled.div`min-height: 100vh; overflow-x: hidden;`;

// ── Hero ──────────────────────────────────────────────────────────────────────
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
    background: radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%);
    top: -100px; left: 50%;
    transform: translateX(-50%);
  }
  &.orb2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(99,207,255,0.08) 0%, transparent 70%);
    bottom: 100px; right: 10%;
    animation-delay: 2s;
  }
  &.orb3 {
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(255,99,180,0.06) 0%, transparent 70%);
    bottom: 200px; left: 5%;
    animation-delay: 4s;
  }
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px);
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

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(108,99,255,0.35);
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
  background: ${({ theme }) => theme.colors.bgCard};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.borderLight};
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
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
  background: radial-gradient(ellipse at 50% 50%, rgba(108,99,255,0.1) 0%, transparent 70%);
  pointer-events: none;
`;

const PreviewCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.1), 0 4px 20px rgba(108,99,255,0.08);
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
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
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
    color: ${({ up }) => up ? '#10B981' : '#EF4444'};
    &::before { content: '${({ up }) => up ? '▲' : '▼'} '; }
  }
`;

const ChartRow = styled.div`
  padding: 0 1.5rem 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const ChartPlaceholder = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem;
  height: 120px;
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

// ── Sections ──────────────────────────────────────────────────────────────────
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

// ── Features ──────────────────────────────────────────────────────────────────
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
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  }
`;

const FeatureIcon = styled.div`
  width: 44px; height: 44px;
  background: ${({ theme }) => theme.colors.accentDim};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex; align-items: center; justify-content: center;
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

// ── Steps ─────────────────────────────────────────────────────────────────────
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

const Step = styled.div`text-align: center; position: relative;`;

const StepNum = styled.div`
  width: 48px; height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex; align-items: center; justify-content: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.accent};
  margin: 0 auto 1.25rem;
  position: relative;
  z-index: 1;
  box-shadow: ${({ theme }) => theme.shadow.card};
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
  @media (max-width: 860px) { grid-template-columns: 1fr; max-width: 400px; }
`;

const PricingCard = styled.div`
  background: ${({ $featured, theme }) => $featured ? theme.colors.accent : theme.colors.bgCard};
  border: 1px solid ${({ $featured, theme }) => $featured ? 'transparent' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
  position: relative;
  transition: transform 0.2s;

  ${({ $featured }) => $featured && `
    box-shadow: 0 0 60px rgba(108,99,255,0.25);
    transform: scale(1.02);
  `}
  &:hover { transform: ${({ $featured }) => $featured ? 'scale(1.04)' : 'translateY(-3px)'}; }
`;

const PlanBadge = styled.div`
  display: inline-block;
  background: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.2)' : 'rgba(108,99,255,0.1)'};
  border-radius: 100px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
  color: ${({ $featured }) => $featured ? '#fff' : '#6C63FF'};
`;

const PlanPrice = styled.div`
  margin-bottom: 1.5rem;
  .amount {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${({ $featured }) => $featured ? '#fff' : 'inherit'};
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
    background: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.2)' : 'rgba(108,99,255,0.12)'};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
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
  background: ${({ $featured }) => $featured ? '#fff' : 'rgba(108,99,255,0.1)'};
  color: ${({ $featured }) => $featured ? '#6C63FF' : '#6C63FF'};
  border: 1px solid ${({ $featured }) => $featured ? 'transparent' : 'rgba(108,99,255,0.2)'};

  &:hover {
    background: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.9)' : 'rgba(108,99,255,0.18)'};
    transform: translateY(-1px);
  }
`;

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 720px;
`;

const FaqItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgCard};
`;

const FaqQ = styled.button`
  width: 100%;
  text-align: left;
  padding: 1.25rem 1.5rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  letter-spacing: -0.01em;
  &:hover { background: ${({ theme }) => theme.colors.bgElevated}; }
  span { color: ${({ theme }) => theme.colors.accent}; font-size: 1.25rem; font-weight: 300; flex-shrink: 0; }
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


// ── Billing Toggle ─────────────────────────────────────────────────────────────
const BillingToggleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

const ToggleTrack = styled.button`
  width: 52px; height: 28px;
  border-radius: 99px;
  background: ${({ $on, theme }) => $on ? theme.colors.accent : theme.colors.bgElevated};
  border: 1px solid ${({ $on, theme }) => $on ? 'transparent' : theme.colors.border};
  position: relative;
  transition: all 0.25s;
  cursor: pointer;
  flex-shrink: 0;
  &::after {
    content: '';
    position: absolute;
    top: 3px; left: ${({ $on }) => $on ? '25px' : '3px'};
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.25s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
`;

const ToggleLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: ${({ $active }) => $active ? 600 : 300};
  color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textDim};
  transition: all 0.2s;
`;

const YearlySaveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: rgba(16,185,129,0.12);
  color: #10B981;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
  border: 1px solid rgba(16,185,129,0.2);
`;

const PlanSaveTag = styled.div`
  font-size: 0.75rem;
  color: #10B981;
  font-weight: 600;
  margin-top: 0.25rem;
`;

const PriceStrike = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textDim};
  text-decoration: line-through;
  margin-right: 0.25rem;
  font-weight: 300;
`;

const FeatureCheck = styled.span`
  color: ${({ $ok, $featured }) => $ok ? ($featured ? '#fff' : '#10B981') : 'rgba(128,128,160,0.5)'};
  font-size: 0.75rem;
  flex-shrink: 0;
`;

// ── i18n content ──────────────────────────────────────────────────────────────
const i18n = {
  en: {
    badge: 'Automated SEO reporting for agencies & freelancers',
    heroTitle1: 'Your SEO report,',
    heroTitle2: 'delivered automatically.',
    heroSub: 'Connect Google Search Console once. Every month, RankBrief generates a professional PDF report and sends it to your inbox – powered by AI, zero manual work.',
    heroCta: 'Start your first month free',
    heroSeeHow: 'See how it works',
    trust1: 'First month free',
    trust2: 'GDPR compliant · EU servers',
    trust3: 'Cancel anytime',
    howLabel: 'How it works',
    howTitle: 'Set it up once.\nReports run forever.',
    howSub: 'Four steps between you and automated monthly SEO reporting.',
    featLabel: 'Features',
    featTitle: 'Everything you need.\nNothing you don\'t.',
    featSub: 'Built for freelancers and small agencies who bill hourly and hate manual reporting.',
    pricingLabel: 'Pricing',
    pricingTitle: 'Simple pricing.\nNo surprises.',
    pricingSub: 'First month free. No credit card required.',
    faqLabel: 'FAQ',
    faqTitle: 'Questions & answers',
    faqSub: 'Everything you need to know before signing up.',
    ctaTitle: 'Stop writing reports manually.',
    ctaSub: 'Join freelancers and agencies who automated their SEO reporting with RankBrief.',
    ctaBtn: 'Start your first month free →',
    planCta: 'Get started',
    steps: [
      { n: '01', title: 'Connect Google', text: 'Sign in with Google and select your Search Console and GA4 properties.' },
      { n: '02', title: 'Choose a plan', text: 'Pick Basic, Pro, or Agency depending on how many domains you manage.' },
      { n: '03', title: 'Receive your report', text: 'On the 1st of every month, your PDF report lands in your inbox automatically.' },
      { n: '04', title: 'Share with clients', text: 'Forward or white-label the report. Your clients get professional insights without any effort.' },
    ],
    features: [
      { icon: '⚡', title: 'Fully Automated', text: 'Connect once. Every month, your report is generated and delivered automatically – no manual work required.' },
      { icon: '🤖', title: 'AI-Powered Summaries', text: 'Each report includes a plain-language summary written by Claude. No SEO jargon, just clear insights your clients understand.' },
      { icon: '🏷️', title: 'White-Label Ready', text: 'Upload your logo and send reports under your own brand. Your clients see your name, not ours.' },
      { icon: '📊', title: 'GSC + GA4 Combined', text: 'Clicks, impressions, sessions, engagement – all in one clean report. No switching between tools.' },
      { icon: '📈', title: 'Month-over-Month Trends', text: 'Every metric comes with a comparison to the previous month. See what\'s improving and what needs attention.' },
      { icon: '🔒', title: 'GDPR Compliant', text: 'EU servers, AES-256 token encryption, minimal data retention. Built for European privacy requirements from day one.' },
    ],
    plans: [
      {
        name: 'Basic', slug: 'basic', price: '19', yearlyPrice: '15', yearlyTotal: '180', yearlySave: '48', period: '/mo',
        features: [
          { t: '1 domain', ok: true },
          { t: 'Monthly PDF report', ok: true },
          { t: 'GSC data (clicks, rankings, keywords)', ok: true },
          { t: 'GA4 data (sessions, conversions)', ok: false },
          { t: 'AI summary & SEO recommendations', ok: false },
          { t: 'White-label branding', ok: false },
        ],
      },
      {
        name: 'Pro', slug: 'pro', price: '39', yearlyPrice: '29', yearlyTotal: '348', yearlySave: '120', period: '/mo', featured: true,
        features: [
          { t: '3 domains', ok: true },
          { t: 'Monthly PDF report', ok: true },
          { t: 'GSC data (clicks, rankings, keywords)', ok: true },
          { t: 'GA4 data (sessions, conversions)', ok: true },
          { t: 'AI summary & SEO recommendations', ok: true },
          { t: 'White-label branding', ok: false },
        ],
      },
      {
        name: 'Agency', slug: 'agency', price: '79', yearlyPrice: '65', yearlyTotal: '780', yearlySave: '168', period: '/mo',
        features: [
          { t: '10 domains', ok: true },
          { t: 'Monthly PDF report', ok: true },
          { t: 'GSC data (clicks, rankings, keywords)', ok: true },
          { t: 'GA4 data (sessions, conversions)', ok: true },
          { t: 'AI summary & SEO recommendations', ok: true },
          { t: 'White-label branding + custom logo', ok: true },
        ],
      },
    ],
    billingToggle: ['Monthly', 'Yearly'],
    yearlySaveLabel: 'Save',
    faqs: [
      { q: 'Is my Google data safe?', a: 'Yes. We request read-only access to your Search Console and Analytics data. OAuth tokens are encrypted using AES-256-GCM and stored on EU servers (Frankfurt). We never access your data beyond what\'s needed to generate your report.' },
      { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your dashboard at any time. Your subscription remains active until the end of the billing period. No questions asked, no hidden fees.' },
      { q: 'Do I need to be technical to use RankBrief?', a: 'Not at all. Setup takes about 3 minutes: sign in with Google, select your website, choose a plan. After that, everything is automatic.' },
      { q: 'What does the report include?', a: 'Each report covers clicks, impressions, CTR, average position, sessions, engagement rate, top 10 keywords, top 10 pages, month-over-month comparison, and an AI-written plain-language summary.' },
      { q: 'Can I use my own logo?', a: 'Yes, on Pro and Agency plans. Upload your logo and your clients will receive reports branded with your company name and logo – no RankBrief branding.' },
      { q: 'Which Google properties are supported?', a: 'Any verified Google Search Console property. GA4 support is available for all standard properties. We support both domain and URL-prefix GSC properties.' },
    ],
  },
  de: {
    badge: 'Automatisches SEO-Reporting für Agenturen & Freelancer',
    heroTitle1: 'Dein SEO-Report,',
    heroTitle2: 'automatisch geliefert.',
    heroSub: 'Google Search Console einmal verbinden. Jeden Monat erstellt RankBrief automatisch einen professionellen PDF-Report und schickt ihn in dein Postfach – KI-gestützt, kein manueller Aufwand.',
    heroCta: 'Ersten Monat kostenlos starten',
    heroSeeHow: 'So funktioniert\'s',
    trust1: 'Erster Monat kostenlos',
    trust2: 'DSGVO-konform · EU-Server',
    trust3: 'Jederzeit kündbar',
    howLabel: 'So funktioniert\'s',
    howTitle: 'Einmal einrichten.\nReports laufen automatisch.',
    howSub: 'Vier Schritte bis zu deinem automatischen monatlichen SEO-Report.',
    featLabel: 'Features',
    featTitle: 'Alles was du brauchst.\nNichts was du nicht brauchst.',
    featSub: 'Gebaut für Freelancer und kleine Agenturen, die stundensatz abrechnen und manuelle Reports hassen.',
    pricingLabel: 'Preise',
    pricingTitle: 'Einfache Preise.\nKeine Überraschungen.',
    pricingSub: 'Erster Monat kostenlos. Keine Kreditkarte erforderlich.',
    faqLabel: 'FAQ',
    faqTitle: 'Fragen & Antworten',
    faqSub: 'Alles was du vor der Anmeldung wissen musst.',
    ctaTitle: 'Hör auf, Reports manuell zu schreiben.',
    ctaSub: 'Schließ dich Freelancern und Agenturen an, die ihr SEO-Reporting mit RankBrief automatisiert haben.',
    ctaBtn: 'Ersten Monat kostenlos starten →',
    planCta: 'Jetzt starten',
    steps: [
      { n: '01', title: 'Google verbinden', text: 'Mit Google anmelden und Search Console sowie GA4-Properties auswählen.' },
      { n: '02', title: 'Plan wählen', text: 'Basic, Pro oder Agency – je nachdem wie viele Domains du verwaltest.' },
      { n: '03', title: 'Report erhalten', text: 'Am 1. jeden Monats landet dein PDF-Report automatisch im Postfach.' },
      { n: '04', title: 'Mit Kunden teilen', text: 'Report weiterleiten oder white-label versenden. Deine Kunden erhalten professionelle Einblicke.' },
    ],
    features: [
      { icon: '⚡', title: 'Vollautomatisch', text: 'Einmal verbinden. Jeden Monat wird dein Report automatisch erstellt und geliefert – kein manueller Aufwand.' },
      { icon: '🤖', title: 'KI-Zusammenfassung', text: 'Jeder Report enthält eine verständliche KI-Zusammenfassung. Kein SEO-Jargon, klare Einblicke die deine Kunden verstehen.' },
      { icon: '🏷️', title: 'White-Label-fähig', text: 'Eigenes Logo hochladen und Reports unter deiner Marke versenden. Deine Kunden sehen deinen Namen.' },
      { icon: '📊', title: 'GSC + GA4 kombiniert', text: 'Klicks, Impressionen, Sessions, Engagement – alles in einem Report. Kein Wechseln zwischen Tools.' },
      { icon: '📈', title: 'Monatsvergleich', text: 'Jede Kennzahl wird mit dem Vormonat verglichen. Sofort sichtbar was sich verbessert und was Aufmerksamkeit braucht.' },
      { icon: '🔒', title: 'DSGVO-konform', text: 'EU-Server, AES-256 Token-Verschlüsselung, minimale Datenspeicherung. Von Anfang an für europäische Datenschutzanforderungen gebaut.' },
    ],
    plans: [
      {
        name: 'Basic', slug: 'basic', price: '19', yearlyPrice: '15', yearlyTotal: '180', yearlySave: '48', period: '/Monat',
        features: [
          { t: '1 Domain', ok: true },
          { t: 'Monatlicher PDF-Report', ok: true },
          { t: 'GSC-Daten (Klicks, Rankings, Keywords)', ok: true },
          { t: 'GA4-Daten (Sessions, Conversions)', ok: false },
          { t: 'KI-Zusammenfassung & SEO-Empfehlungen', ok: false },
          { t: 'White-Label-Branding', ok: false },
        ],
      },
      {
        name: 'Pro', slug: 'pro', price: '39', yearlyPrice: '29', yearlyTotal: '348', yearlySave: '120', period: '/Monat', featured: true,
        features: [
          { t: '3 Domains', ok: true },
          { t: 'Monatlicher PDF-Report', ok: true },
          { t: 'GSC-Daten (Klicks, Rankings, Keywords)', ok: true },
          { t: 'GA4-Daten (Sessions, Conversions)', ok: true },
          { t: 'KI-Zusammenfassung & SEO-Empfehlungen', ok: true },
          { t: 'White-Label-Branding', ok: false },
        ],
      },
      {
        name: 'Agency', slug: 'agency', price: '79', yearlyPrice: '65', yearlyTotal: '780', yearlySave: '168', period: '/Monat',
        features: [
          { t: '10 Domains', ok: true },
          { t: 'Monatlicher PDF-Report', ok: true },
          { t: 'GSC-Daten (Klicks, Rankings, Keywords)', ok: true },
          { t: 'GA4-Daten (Sessions, Conversions)', ok: true },
          { t: 'KI-Zusammenfassung & SEO-Empfehlungen', ok: true },
          { t: 'White-Label-Branding + eigenes Logo', ok: true },
        ],
      },
    ],
    billingToggle: ['Monatlich', 'Jährlich'],
    yearlySaveLabel: 'Spare',
    faqs: [
      { q: 'Sind meine Google-Daten sicher?', a: 'Ja. Wir fordern nur lesenden Zugriff auf deine Search Console und Analytics-Daten. OAuth-Tokens werden mit AES-256-GCM verschlüsselt und auf EU-Servern (Frankfurt) gespeichert.' },
      { q: 'Kann ich jederzeit kündigen?', a: 'Ja. Jederzeit im Dashboard kündigen. Dein Abo bleibt bis Ende des Abrechnungszeitraums aktiv. Keine versteckten Gebühren.' },
      { q: 'Muss ich technisches Wissen haben?', a: 'Nein. Die Einrichtung dauert ca. 3 Minuten: mit Google anmelden, Website auswählen, Plan wählen. Danach läuft alles automatisch.' },
      { q: 'Was enthält der Report?', a: 'Klicks, Impressionen, CTR, durchschnittliche Position, Sessions, Engagement Rate, Top 10 Keywords, Top 10 Seiten, Vormonatsvergleich und eine KI-generierte Zusammenfassung.' },
      { q: 'Kann ich mein eigenes Logo verwenden?', a: 'Ja, ab dem Pro-Plan. Logo hochladen und deine Kunden erhalten Reports mit deinem Firmenname und Logo – ohne RankBrief-Branding.' },
      { q: 'Welche Google-Properties werden unterstützt?', a: 'Jede verifizierte Google Search Console Property. GA4 wird für alle Standard-Properties unterstützt. Wir unterstützen Domain- und URL-Prefix-GSC-Properties.' },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Landing({ lang = 'en' }) {
  const [openFaq, setOpenFaq] = React.useState(null);
  const [yearly, setYearly]   = React.useState(false);
  const t = i18n[lang] || i18n.en;

  // Reset open FAQ when language changes
  React.useEffect(() => { setOpenFaq(null); }, [lang]);

  return (
    <Page>
      {/* HERO */}
      <HeroSection>
        <GlowOrb className="orb1" />
        <GlowOrb className="orb2" />
        <GlowOrb className="orb3" />
        <GridBg />

        <HeroBadge>{t.badge}</HeroBadge>

        <HeroTitle>
          {t.heroTitle1}<br />
          <span className="gradient">{t.heroTitle2}</span>
        </HeroTitle>

        <HeroSub>{t.heroSub}</HeroSub>

        <HeroCTA>
          <BtnPrimary to="/register">
            {t.heroCta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BtnPrimary>
          <BtnGhost to="#features">{t.heroSeeHow}</BtnGhost>
        </HeroCTA>

        <TrustRow>
          {[t.trust1, t.trust2, t.trust3].map(item => (
            <TrustItem key={item}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0l1.8 5.4H14l-4.6 3.3 1.8 5.5L7 11l-4.2 3.2 1.8-5.5L0 5.4h5.2z"/></svg>
              {item}
            </TrustItem>
          ))}
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
                      <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.2"/>
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
        <SectionLabel>{t.howLabel}</SectionLabel>
        <SectionTitle>{t.howTitle.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}</SectionTitle>
        <SectionSub>{t.howSub}</SectionSub>
        <StepsGrid>
          {t.steps.map(s => (
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
        <SectionLabel>{t.featLabel}</SectionLabel>
        <SectionTitle>{t.featTitle.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}</SectionTitle>
        <SectionSub>{t.featSub}</SectionSub>
        <FeaturesGrid>
          {t.features.map(f => (
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
        <SectionLabel>{t.pricingLabel}</SectionLabel>
        <SectionTitle>{t.pricingTitle.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}</SectionTitle>
        <SectionSub>{t.pricingSub}</SectionSub>

        {/* Billing Toggle */}
        <BillingToggleWrap>
          <ToggleLabel $active={!yearly}>{t.billingToggle[0]}</ToggleLabel>
          <ToggleTrack $on={yearly} onClick={() => setYearly(y => !y)} aria-label="Toggle yearly billing" />
          <ToggleLabel $active={yearly}>{t.billingToggle[1]}</ToggleLabel>
          {yearly && <YearlySaveBadge>🎉 {t.yearlySaveLabel} bis zu {lang === 'de' ? '168 €' : '€168'}</YearlySaveBadge>}
        </BillingToggleWrap>

        <PricingGrid>
          {t.plans.map(p => (
            <PricingCard key={p.name} $featured={p.featured}>
              <PlanBadge $featured={p.featured}>{p.name}</PlanBadge>
              <PlanPrice $featured={p.featured}>
                {yearly && <PriceStrike>€{p.price}</PriceStrike>}
                <span className="amount">€{yearly ? p.yearlyPrice : p.price}</span>
                <span className="period">{p.period}</span>
              </PlanPrice>
              {yearly && (
                <PlanSaveTag>{t.yearlySaveLabel} {lang === 'de' ? p.yearlySave + ' €' : '€' + p.yearlySave} · {lang === 'de' ? p.yearlyTotal + ' €/Jahr' : '€' + p.yearlyTotal + '/yr'}</PlanSaveTag>
              )}
              <PlanFeatures>
                {p.features.map(f => (
                  <PlanFeature key={f.t} $featured={p.featured} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', opacity: f.ok ? 1 : 0.45 }}>
                    <FeatureCheck $ok={f.ok} $featured={p.featured}>{f.ok ? '✓' : '✕'}</FeatureCheck>
                    {f.t}
                  </PlanFeature>
                ))}
              </PlanFeatures>
              <PlanCTA to={`/register?plan=${p.slug}&billing=${yearly ? 'yearly' : 'monthly'}`} $featured={p.featured}>{t.planCta}</PlanCTA>
            </PricingCard>
          ))}
        </PricingGrid>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <SectionLabel>{t.faqLabel}</SectionLabel>
        <SectionTitle>{t.faqTitle}</SectionTitle>
        <SectionSub style={{ marginBottom: '2.5rem' }}>{t.faqSub}</SectionSub>
        <FaqList>
          {t.faqs.map((f, i) => (
            <FaqItem key={`${lang}-${i}`}>
              <FaqQ onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <span>{openFaq === i ? '−' : '+'}</span>
              </FaqQ>
              <FaqA $open={openFaq === i}>{f.a}</FaqA>
            </FaqItem>
          ))}
        </FaqList>
      </Section>

      {/* CTA */}
      <Section style={{ paddingTop: 0 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(99,207,255,0.04) 100%)',
          border: '1px solid rgba(108,99,255,0.15)',
          borderRadius: '24px',
          padding: '4rem 3rem',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            {t.ctaTitle}
          </h2>
          <p style={{ color: '#52526E', fontSize: '1.0625rem', marginBottom: '2rem', fontWeight: 300 }}>
            {t.ctaSub}
          </p>
          <BtnPrimary to="/register">{t.ctaBtn}</BtnPrimary>
        </div>
      </Section>
    </Page>
  );
}
