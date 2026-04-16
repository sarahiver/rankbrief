import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Layout ────────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
`;

const TopBar = styled.header`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: ${({ theme }) => theme.colors.bgCard};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const LogoDot = styled.div`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;

const LangToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const LangBtn = styled.button`
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all 0.2s;
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textDim};
  &:hover { color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.text}; }
`;

const Container = styled.div`
  max-width: 780px;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
  animation: ${fadeUp} 0.4s ease both;
`;

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = styled.div`
  margin-bottom: 4rem;
`;

const HeroLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 1rem;
`;

const HeroSub = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  line-height: 1.7;
  max-width: 560px;
`;

// ── Section ───────────────────────────────────────────────────────────────────
const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.625rem;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`;

const SectionSub = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin-bottom: 4rem;
`;

// ── Setup Steps ───────────────────────────────────────────────────────────────
const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Step = styled.div`
  display: flex;
  gap: 1.5rem;
  padding-bottom: 2rem;
  position: relative;

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 32px;
    bottom: 0;
    width: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const StepNum = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  margin-top: 2px;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.375rem;
`;

const StepText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  line-height: 1.7;
`;

const StepNote = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.375rem 0.75rem;
  background: ${({ theme }) => theme.colors.accentDim};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 400;
`;

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
`;

const FaqItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
`;

const FaqQuestion = styled.button`
  width: 100%;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ $open, theme }) => $open ? theme.colors.accentDim : 'transparent'};
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.accentDim}; }
`;

const FaqIcon = styled.div`
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.accent};
  transition: transform 0.2s;
  transform: ${({ $open }) => $open ? 'rotate(45deg)' : 'none'};
`;

const FaqAnswer = styled.div`
  overflow: hidden;
  max-height: ${({ $open }) => $open ? '400px' : '0'};
  transition: max-height 0.3s ease;
`;

const FaqAnswerInner = styled.div`
  padding: 0 1.5rem 1.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  line-height: 1.75;
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; &:hover { text-decoration: underline; } }
`;

// ── Pricing ───────────────────────────────────────────────────────────────────
const PricingTable = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
`;

const PricingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
  @media (max-width: 600px) { grid-template-columns: 1fr 1fr; }
`;

const PricingCell = styled.div`
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: ${({ $header, $highlight, theme }) =>
    $header ? theme.colors.textDim :
    $highlight ? theme.colors.accent :
    theme.colors.textMuted};
  font-weight: ${({ $header, $feature }) => $header ? '700' : $feature ? '500' : '300'};
  background: ${({ $highlight, theme }) => $highlight ? theme.colors.accentDim : 'transparent'};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-right: none; }
  text-transform: ${({ $header }) => $header ? 'uppercase' : 'none'};
  letter-spacing: ${({ $header }) => $header ? '0.08em' : 'normal'};
  font-size: ${({ $header }) => $header ? '0.6875rem' : '0.875rem'};
`;

const Check = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-weight: 700;
`;
const Cross = styled.span`
  color: ${({ theme }) => theme.colors.textDim};
`;

// ── CTA ───────────────────────────────────────────────────────────────────────
const CtaBox = styled.div`
  background: linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(99,207,255,0.05) 100%);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2.5rem 2rem;
  text-align: center;
`;

const CtaTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.625rem;
`;

const CtaSub = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  margin-bottom: 1.5rem;
`;

const BtnPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  padding: 0.75rem 1.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s;
  text-decoration: none;
  &:hover { background: ${({ theme }) => theme.colors.accentHover}; transform: translateY(-1px); }
`;


// ── Guide Tabs ────────────────────────────────────────────────────────────────
const GuideTabs = styled.div`
  display: flex;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const GuideTab = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  min-width: 120px;
  &:last-child { border-right: none; }
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textMuted};
  &:hover { color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.text}; }
`;

// ── Video Placeholder ─────────────────────────────────────────────────────────
const VideoWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const VideoIframe = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.bgElevated};
`;

const VideoPlaceholderIcon = styled.div`
  width: 56px; height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
`;

const VideoPlaceholderText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  text-align: center;
  a { color: ${({ theme }) => theme.colors.accent}; font-weight: 600; }
`;

// ── Guide Step extras ─────────────────────────────────────────────────────────
const StepScreenshot = styled.div`
  margin-top: 0.875rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const TipBox = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(245,158,11,0.06);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  color: #d97706;
  line-height: 1.6;
  font-weight: 300;
`;

const GuideIntro = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.radius.lg};
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
`;

// ── Content ───────────────────────────────────────────────────────────────────
const content = {
  en: {
    hero: {
      label: 'Documentation',
      title: 'How RankBrief works',
      sub: 'Everything you need to know to set up RankBrief and get your first automated SEO report.',
    },
    setup: {
      label: 'Getting Started',
      title: 'Setup in 3 minutes',
      sub: 'Connect your Google properties once – RankBrief takes care of the rest automatically.',
      steps: [
        {
          title: 'Create your account',
          text: 'Register with your email address. You\'ll receive a confirmation email – click the link to activate your account.',
          note: '✓ First month free, no credit card required',
        },
        {
          title: 'Connect Google Search Console',
          text: 'Click "Connect Google Search Console" in your dashboard and grant RankBrief read-only access to your GSC data. We never write or modify your data.',
          note: '🔒 Read-only access, revocable anytime',
        },
        {
          title: 'Select your property',
          text: 'Choose which website you want to track from your GSC properties. If you manage multiple domains, you can add more later.',
        },
        {
          title: 'Add your GA4 Property ID (optional)',
          text: 'Find your GA4 Property ID in Google Analytics → Admin → Property Settings. It\'s a plain number (e.g. 123456789) – not the Measurement ID (G-XXXXXXXX). This adds sessions, users and engagement rate to your reports.',
          note: '💡 Can be added later in settings',
        },
        {
          title: 'Done – your first report is on its way',
          text: 'On the 1st of next month at 6:00 AM UTC, RankBrief automatically generates your PDF report and sends it to your inbox. The first report is free.',
          note: '📬 Automatic every 1st of the month',
        },
      ],
    },
    guides: {
      label: 'Setup Guides',
      title: 'Step-by-step instructions',
      sub: 'Three guides to get you from zero to your first automated SEO report.',
      tabs: ['1. Set up GSC', '2. Set up GA4', '3. Connect to RankBrief'],
      gsc: {
        title: 'Set up Google Search Console',
        intro: 'Google Search Console (GSC) is a free Google tool that shows you how your website appears in Google Search – clicks, impressions, rankings, and more. You need it for RankBrief to work.',
        videoUrl: 'https://www.youtube.com/embed/uoQ-0xREQgQ',
        videoLabel: 'GSC setup tutorial',
        videoLink: null,
        steps: [
          { title: 'Go to Google Search Console', text: 'Open search.google.com/search-console and sign in with your Google Account.', path: '→ search.google.com/search-console' },
          { title: 'Add a property', text: 'Click "Add property". Choose "Domain" to track all versions of your site (recommended), or "URL prefix" for a specific version.', tip: 'Tip: "Domain" tracking covers http, https, www and non-www automatically.' },
          { title: 'Verify ownership', text: 'Google needs to confirm you own the website. The easiest method is via your domain registrar or by adding a DNS TXT record.', tip: 'Tip: If your site uses WordPress, the Google Site Kit plugin verifies automatically.' },
          { title: 'Wait for data', text: 'After verification, GSC starts collecting data. It takes 2–3 days for the first data to appear.', path: '→ Status: Verified ✓' },
          { title: "You're done", text: 'GSC is set up. Follow Guide 3 to connect it to RankBrief.', tip: '✓ GSC is free and takes about 10 minutes to set up.' },
        ],
      },
      ga4: {
        title: 'Set up Google Analytics 4',
        intro: 'Google Analytics 4 (GA4) is a free tool that shows what visitors do on your website. Optional but recommended for Pro and Agency plans.',
        videoUrl: 'https://www.youtube.com/embed/HMUOVj9yxjc',
        videoLabel: 'GA4 setup tutorial',
        videoLink: null,
        steps: [
          { title: 'Go to Google Analytics', text: "Open analytics.google.com and sign in. If you've never used Analytics before, click \"Start measuring\".", path: '→ analytics.google.com' },
          { title: 'Create an account', text: 'Enter an account name (e.g. your company name). Click "Next".' },
          { title: 'Create a property', text: 'Enter a property name, select your time zone and currency (Euro). Click "Create".', tip: 'Select your correct time zone to match your reporting period.' },
          { title: 'Add a data stream', text: 'Choose "Web". Enter your website URL. Click "Create stream". Google gives you a Measurement ID (G-XXXXXXXX) – this is NOT the Property ID.' },
          { title: 'Install the tracking code', text: 'Paste the code into the <head> of your website, or use Google Tag Manager / a WordPress plugin like "Site Kit".', tip: 'Tip: Google Site Kit (free WordPress plugin) installs both GSC and GA4 in one step.' },
          { title: 'Find your GA4 Property ID', text: "Go to Admin → Property Settings. You'll see \"Property ID\" – a plain number like 123456789. This is what you enter in RankBrief.", path: '→ Admin → Property Settings → Property ID', tip: 'Important: The Property ID is a plain number (e.g. 123456789). Not the Measurement ID (G-XXXXXXXX).' },
        ],
      },
      connect: {
        title: 'Connect your properties to RankBrief',
        intro: 'Once GSC is set up, connecting to RankBrief takes about 2 minutes. RankBrief only requests read-only access – we never modify your data.',
        videoUrl: 'NONE',
        videoLabel: '',
        videoLink: null,
        steps: [
          { title: 'Register or log in', text: 'Go to rankbrief.com and create a free account with your email address.', path: '→ rankbrief.com/register' },
          { title: 'Click "Connect Google Search Console"', text: 'In your dashboard, click the button and grant RankBrief read-only access.', tip: '🔒 Read-only access only. Your data is never modified.' },
          { title: 'Select your GSC property', text: 'After connecting, your verified GSC properties will appear. Select the website you want to track.' },
          { title: 'Add your GA4 Property ID (optional)', text: 'In Settings → Properties, enter your GA4 Property ID (the plain number from Guide 2, Step 6).', path: '→ Settings → Properties → GA4 Property ID', tip: 'You can add the GA4 ID at any time. It will appear in your next monthly report.' },
          { title: 'Choose your plan', text: 'Your first month is completely free. The base plan (€19) includes 1 property and all features. Add more properties or White-Label as needed.' },
          { title: 'Wait for your first report', text: "Reports are generated on the 1st of each month at 6:00 AM. You'll receive an email with your PDF.", path: '→ 1st of the month · 06:00 AM · PDF in your inbox', tip: '✓ All reports are also available in your RankBrief dashboard.' },
        ],
      },
    },
    faq: {
      label: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        {
          q: 'When will I receive my first report?',
          a: 'Reports are generated automatically on the 1st of each month at 6:00 AM UTC. If you sign up in March, your first report will arrive on April 1st – covering March\'s data.',
        },
        {
          q: 'What data does RankBrief access?',
          a: 'RankBrief requests read-only access to Google Search Console (clicks, impressions, CTR, average position, top keywords, top pages) and optionally Google Analytics 4 (sessions, users, engagement rate). We never modify your data.',
        },
        {
          q: 'What happens after my free month?',
          a: 'After your first free report, you\'ll receive 3 reminder emails before the next report cycle. If you don\'t choose a plan, your account will be paused – your data stays saved for 90 days. You can reactivate anytime.',
        },
        {
          q: 'Can I cancel at any time?',
          a: 'Yes, you can cancel your subscription at any time via the customer portal. Cancellation takes effect at the end of the current billing period. No partial refunds.',
        },
        {
          q: 'How is my Google data stored?',
          a: 'Your OAuth tokens are encrypted with AES-256-GCM before being stored. RankBrief is hosted entirely in the EU (Frankfurt). You can revoke access at any time in your Google Account → Security → Third-party access.',
        },
        {
          q: 'What is the GA4 Property ID and where do I find it?',
          a: 'The GA4 Property ID is a plain number (e.g. 123456789) found in Google Analytics → Admin → Property Settings. It is not the Measurement ID (G-XXXXXXXX). Without it, your reports will only contain GSC data.',
        },
        {
          q: 'Can I connect multiple domains?',
          a: 'Yes – the base plan includes 1 property. You can add more with the +3, +5, or +10 property add-ons. Each property gets its own monthly report.',
        },
        {
          q: 'What does the PDF report contain?',
          a: 'Each report includes: KPI overview (clicks, impressions, CTR, average position), month-over-month comparison, top 10 keywords, top 10 pages, GA4 data (if connected), and an AI-generated summary in plain language with one actionable recommendation.',
        },
      ],
    },
    pricing: {
      label: 'Pricing',
      title: 'Plans explained',
      sub: 'All plans include automatic monthly PDF reports, AI summary and email delivery. The first month is free.',
      note: 'Every plan includes the full report. You only pay for additional properties or white-label.',
      headers: ['What you get', 'Included'],
      rows: [
        ['Complete 6-page strategy report', '✓ always'],
        ['AI analysis & market radar', '✓ always'],
        ['Top keywords, pages & recommendations', '✓ always'],
        ['GA4: sessions, users & engagement', '✓ always'],
        ['Business impact & priorities', '✓ always'],
        ['Automatic monthly email delivery', '✓ always'],
        ['1 property', '€19 / month'],
        ['+3 properties', '+€24 / month'],
        ['+5 properties', '+€30 / month'],
        ['+10 properties', '+€50 / month'],
        ['White-label (your logo, no RankBrief footer)', '+€5 / month'],
        ['First month free', '✓ always'],
      ],
    },
    cta: {
      title: 'Ready to automate your SEO reporting?',
      sub: 'First month free. No credit card required.',
      btn: 'Get started for free →',
    },
  },
  de: {
    hero: {
      label: 'Dokumentation',
      title: 'Wie RankBrief funktioniert',
      sub: 'Alles, was du wissen musst, um RankBrief einzurichten und deinen ersten automatischen SEO-Report zu erhalten.',
    },
    setup: {
      label: 'Erste Schritte',
      title: 'Einrichtung in 3 Minuten',
      sub: 'Verbinde deine Google-Properties einmalig – RankBrief erledigt alles weitere automatisch.',
      steps: [
        {
          title: 'Konto erstellen',
          text: 'Registriere dich mit deiner E-Mail-Adresse. Du erhältst eine Bestätigungsmail – klicke auf den Link um dein Konto zu aktivieren.',
          note: '✓ Erster Monat kostenlos, keine Kreditkarte nötig',
        },
        {
          title: 'Google Search Console verbinden',
          text: 'Klicke im Dashboard auf "Google Search Console verbinden" und erteile RankBrief lesenden Zugriff auf deine GSC-Daten. Wir schreiben oder verändern deine Daten niemals.',
          note: '🔒 Nur Lesezugriff, jederzeit widerrufbar',
        },
        {
          title: 'Property auswählen',
          text: 'Wähle aus deinen GSC-Properties aus, welche Website du tracken möchtest. Falls du mehrere Domains verwaltest, kannst du später weitere hinzufügen.',
        },
        {
          title: 'GA4 Property ID hinzufügen (optional)',
          text: 'Deine GA4 Property ID findest du in Google Analytics → Admin → Property-Einstellungen. Es handelt sich um eine reine Zahl (z.B. 123456789) – nicht die Measurement ID (G-XXXXXXXX). Sie ergänzt deine Reports um Sessions, Nutzer und Engagement Rate.',
          note: '💡 Kann später in den Einstellungen ergänzt werden',
        },
        {
          title: 'Fertig – dein erster Report kommt automatisch',
          text: 'Am 1. des nächsten Monats um 06:00 Uhr UTC generiert RankBrief automatisch deinen PDF-Report und schickt ihn an dein Postfach. Der erste Report ist kostenlos.',
          note: '📬 Automatisch jeden 1. des Monats',
        },
      ],
    },
    guides: {
      label: 'Einrichtungs-Anleitungen',
      title: 'Schritt-für-Schritt-Anleitungen',
      sub: 'Drei Anleitungen – von null bis zu deinem ersten automatischen SEO-Report.',
      tabs: ['1. GSC einrichten', '2. Analytics einrichten', '3. Mit RankBrief verbinden'],
      gsc: {
        title: 'Google Search Console einrichten',
        intro: 'Die Google Search Console (GSC) ist ein kostenloses Google-Tool, das dir zeigt wie deine Website in der Google-Suche erscheint – Klicks, Impressionen, Rankings und mehr. Du brauchst sie damit RankBrief funktioniert.',
        videoUrl: 'https://www.youtube.com/embed/y37uYyzKmro',
        videoLabel: 'GSC einrichten – Tutorial',
        videoLink: null,
        steps: [
          { title: 'Google Search Console öffnen', text: 'Gehe auf search.google.com/search-console und melde dich mit deinem Google-Konto an.', path: '→ search.google.com/search-console' },
          { title: 'Property hinzufügen', text: 'Klicke auf "Property hinzufügen". Wähle "Domain" (empfohlen) oder "URL-Präfix" für eine bestimmte Version.', tip: 'Tipp: "Domain"-Tracking deckt http, https, www und non-www automatisch ab.' },
          { title: 'Eigentumsrecht bestätigen', text: 'Google muss bestätigen dass dir die Website gehört. Am einfachsten über deinen Domain-Anbieter (IONOS, Strato, GoDaddy) oder per DNS-TXT-Eintrag.', tip: 'Tipp: Das WordPress-Plugin "Google Site Kit" verifiziert automatisch.' },
          { title: 'Auf Daten warten', text: 'Nach der Bestätigung beginnt GSC Daten zu sammeln. Es dauert 2–3 Tage bis erste Daten erscheinen.', path: '→ Status: Bestätigt ✓' },
          { title: 'Fertig', text: 'GSC ist eingerichtet. Folge Anleitung 3 um sie mit RankBrief zu verbinden.', tip: '✓ GSC ist kostenlos und braucht ca. 10 Minuten.' },
        ],
      },
      ga4: {
        title: 'Google Analytics 4 einrichten',
        intro: 'Google Analytics 4 (GA4) zeigt was Besucher auf deiner Website tun. Optional, aber sehr empfohlen ab dem Pro-Plan.',
        videoUrl: 'https://www.youtube.com/embed/Fu_BKpzKIW4',
        videoLabel: 'GA4 einrichten – Tutorial',
        videoLink: null,
        steps: [
          { title: 'Google Analytics öffnen', text: 'Gehe auf analytics.google.com und melde dich mit deinem Google-Konto an.', path: '→ analytics.google.com' },
          { title: 'Konto erstellen', text: 'Gib einen Kontonamen ein (z.B. deinen Firmennamen). Klicke auf "Weiter".' },
          { title: 'Property erstellen', text: 'Property-Name eingeben, Zeitzone (Europa/Berlin) und Währung (Euro) wählen. Klicke auf "Erstellen".', tip: 'Wähle "Deutschland" als Zeitzone damit deine Reporting-Zeiträume stimmen.' },
          { title: 'Datenstream hinzufügen', text: 'Wähle "Web". Website-URL eingeben. "Stream erstellen" klicken. Google gibt dir eine Mess-ID (G-XXXXXXXX) – das ist NICHT die Property ID.' },
          { title: 'Tracking-Code installieren', text: 'Code in den <head>-Bereich deiner Website einfügen, oder Google Tag Manager / "Google Site Kit" (WordPress) nutzen.', tip: 'Das kostenlose Plugin "Google Site Kit" installiert GSC und GA4 in einem Schritt.' },
          { title: 'GA4 Property ID finden', text: 'Admin (Zahnrad unten links) → Property-Einstellungen → "Property-ID". Das ist eine reine Zahl wie 123456789. Diese trägst du in RankBrief ein.', path: '→ Admin → Property-Einstellungen → Property-ID', tip: 'Wichtig: Die Property-ID ist eine reine Zahl (z.B. 123456789). Nicht die Mess-ID (G-XXXXXXXX).' },
        ],
      },
      connect: {
        title: 'Google Properties mit RankBrief verbinden',
        intro: 'Sobald GSC eingerichtet ist, dauert die Verbindung mit RankBrief ca. 2 Minuten. Nur lesender Zugriff – deine Daten werden niemals verändert.',
        videoUrl: 'NONE',
        videoLabel: '',
        videoLink: null,
        steps: [
          { title: 'Bei RankBrief registrieren', text: 'Gehe auf rankbrief.com und erstelle ein kostenloses Konto mit deiner E-Mail.', path: '→ rankbrief.com/register' },
          { title: '"Google Search Console verbinden" klicken', text: 'Im Dashboard auf den Button klicken und RankBrief lesenden Zugriff erlauben.', tip: '🔒 Nur lesender Zugriff. Deine Daten werden niemals verändert.' },
          { title: 'GSC-Property auswählen', text: 'Nach der Verbindung erscheinen deine bestätigten GSC-Properties. Die gewünschte Website auswählen.' },
          { title: 'GA4 Property ID hinzufügen (optional)', text: 'In Einstellungen → Properties die GA4 Property ID eintragen (die reine Zahl aus Anleitung 2, Schritt 6).', path: '→ Einstellungen → Properties → GA4 Property ID', tip: 'Die GA4 ID kann jederzeit ergänzt werden. Sie erscheint im nächsten Report.' },
          { title: 'Plan wählen', text: 'Der erste Monat ist komplett kostenlos. Basis (€19) inkl. 1 Property und allen Features. Weitere Properties oder White-Label jederzeit hinzubuchbar.' },
          { title: 'Auf den ersten Report warten', text: 'Reports werden am 1. jeden Monats um 06:00 Uhr generiert. Du erhältst eine E-Mail mit deinem PDF.', path: '→ 1. des Monats · 06:00 Uhr · PDF im Postfach', tip: '✓ Alle Reports sind auch direkt im RankBrief-Dashboard einsehbar.' },
        ],
      },
    },
    faq: {
      label: 'FAQ',
      title: 'Häufig gestellte Fragen',
      items: [
        {
          q: 'Wann erhalte ich meinen ersten Report?',
          a: 'Reports werden automatisch am 1. jeden Monats um 06:00 Uhr UTC generiert. Meldest du dich im März an, erhältst du deinen ersten Report am 1. April – mit den Daten aus März.',
        },
        {
          q: 'Auf welche Daten greift RankBrief zu?',
          a: 'RankBrief fordert lesenden Zugriff auf Google Search Console (Klicks, Impressionen, CTR, durchschnittliche Position, Top-Keywords, Top-Seiten) und optional Google Analytics 4 (Sessions, Nutzer, Engagement Rate) an. Wir verändern deine Daten niemals.',
        },
        {
          q: 'Was passiert nach meinem Freimonat?',
          a: 'Nach deinem ersten kostenlosen Report erhältst du 3 Erinnerungsmails vor dem nächsten Report-Zyklus. Wählst du keinen Plan, wird dein Account pausiert – deine Daten bleiben 90 Tage gespeichert. Du kannst jederzeit reaktivieren.',
        },
        {
          q: 'Kann ich jederzeit kündigen?',
          a: 'Ja, du kannst dein Abonnement jederzeit über das Kundenportal kündigen. Die Kündigung wird zum Ende des laufenden Abrechnungszeitraums wirksam. Keine anteiligen Rückerstattungen.',
        },
        {
          q: 'Wie werden meine Google-Daten gespeichert?',
          a: 'Deine OAuth-Tokens werden vor der Speicherung mit AES-256-GCM verschlüsselt. RankBrief wird vollständig in der EU (Frankfurt) gehostet. Du kannst den Zugriff jederzeit in deinem Google-Konto → Sicherheit → Drittanbieter-Zugriff widerrufen.',
        },
        {
          q: 'Was ist die GA4 Property ID und wo finde ich sie?',
          a: 'Die GA4 Property ID ist eine reine Zahl (z.B. 123456789) und findet sich in Google Analytics → Admin → Property-Einstellungen. Es ist nicht die Measurement ID (G-XXXXXXXX). Ohne sie enthält dein Report nur GSC-Daten.',
        },
        {
          q: 'Kann ich mehrere Domains verbinden?',
          a: 'Ja – der Basis-Plan enthält 1 Property. Weitere können mit den +3-, +5- oder +10-Property-Paketen hinzugefügt werden. Jede Property erhält ihren eigenen monatlichen Report.',
        },
        {
          q: 'Was enthält der PDF-Report?',
          a: 'Jeder Report beinhaltet: KPI-Übersicht (Klicks, Impressionen, CTR, durchschnittliche Position), Vormonatsvergleich, Top 10 Keywords, Top 10 Seiten, GA4-Daten (wenn verbunden) sowie eine KI-generierte Zusammenfassung in einfacher Sprache mit einer konkreten Handlungsempfehlung.',
        },
      ],
    },
    pricing: {
      label: 'Preise',
      title: 'Tarife im Überblick',
      sub: 'Alle Tarife beinhalten automatische monatliche PDF-Reports, KI-Zusammenfassung und Email-Versand. Der erste Monat ist kostenlos.',
      note: 'Jeder Plan enthält den vollständigen Report. Du zahlst nur für weitere Properties oder White-Label.',
      headers: ['Was du bekommst', 'Inklusive'],
      rows: [
        ['Vollständiger 6-Seiten Strategie-Report', '✓ immer'],
        ['KI-Analyse & Markt-Radar', '✓ immer'],
        ['Top Keywords, Seiten & Empfehlungen', '✓ immer'],
        ['GA4: Sessions, Nutzer & Engagement', '✓ immer'],
        ['Business Impact & Top Prioritäten', '✓ immer'],
        ['Automatischer monatlicher Versand', '✓ immer'],
        ['1 Property', '€19 / Monat'],
        ['+3 Properties', '+€24 / Monat'],
        ['+5 Properties', '+€30 / Monat'],
        ['+10 Properties', '+€50 / Monat'],
        ['White-Label (eigenes Logo, kein RankBrief-Footer)', '+€5 / Monat'],
        ['Erster Monat kostenlos', '✓ immer'],
      ],
    },
    cta: {
      title: 'Bereit für automatisches SEO-Reporting?',
      sub: 'Erster Monat kostenlos. Keine Kreditkarte erforderlich.',
      btn: 'Kostenlos starten →',
    },
  },
};

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItemComponent({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <FaqItem>
      <FaqQuestion onClick={() => setOpen(o => !o)} $open={open}>
        {q}
        <FaqIcon $open={open}>+</FaqIcon>
      </FaqQuestion>
      <FaqAnswer $open={open}>
        <FaqAnswerInner dangerouslySetInnerHTML={{ __html: a }} />
      </FaqAnswer>
    </FaqItem>
  );
}


function VideoBlock({ guide }) {
  if (!guide.videoUrl || guide.videoUrl === 'NONE') return null;
  return (
    <VideoWrap>
      <VideoIframe
        src={guide.videoUrl}
        title={guide.videoLabel}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </VideoWrap>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Docs() {
  const [lang, setLang] = useState('de');
  const [guideTab, setGuideTab] = useState(0);
  React.useEffect(() => setGuideTab(0), [lang]);
  const t = content[lang];

  return (
    <Page>
      <TopBar>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
        <LangToggle>
          <LangBtn $active={lang === 'de'} onClick={() => setLang('de')}>DE</LangBtn>
          <LangBtn $active={lang === 'en'} onClick={() => setLang('en')}>EN</LangBtn>
        </LangToggle>
      </TopBar>

      <Container>
        {/* Hero */}
        <Hero>
          <HeroLabel>{t.hero.label}</HeroLabel>
          <HeroTitle>{t.hero.title}</HeroTitle>
          <HeroSub>{t.hero.sub}</HeroSub>
        </Hero>

        <Divider />

        {/* Setup Guide */}
        <Section>
          <SectionLabel>{t.setup.label}</SectionLabel>
          <SectionTitle>{t.setup.title}</SectionTitle>
          <SectionSub>{t.setup.sub}</SectionSub>

          <StepList>
            {t.setup.steps.map((step, i) => (
              <Step key={i}>
                <StepNum>{i + 1}</StepNum>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepText>{step.text}</StepText>
                  {step.note && <StepNote>{step.note}</StepNote>}
                </StepContent>
              </Step>
            ))}
          </StepList>
        </Section>

        <Divider />

        {/* ── Guides ─────────────────────────────────────────────── */}
        <Section>
          <SectionLabel>{t.guides.label}</SectionLabel>
          <SectionTitle>{t.guides.title}</SectionTitle>
          <SectionSub>{t.guides.sub}</SectionSub>

          <GuideTabs>
            {t.guides.tabs.map((tab, i) => (
              <GuideTab key={i} $active={guideTab === i} onClick={() => setGuideTab(i)}>{tab}</GuideTab>
            ))}
          </GuideTabs>

          {[t.guides.gsc, t.guides.ga4, t.guides.connect].map((guide, idx) => guideTab === idx && (
            <div key={idx}>
              <GuideIntro>{guide.intro}</GuideIntro>
              <VideoBlock guide={guide} />
              <StepList>
                {guide.steps.map((step, i) => (
                  <Step key={i}>
                    <StepNum>{i + 1}</StepNum>
                    <StepContent>
                      <StepTitle>{step.title}</StepTitle>
                      <StepText>{step.text}</StepText>
                      {step.path && <StepScreenshot>📍 {step.path}</StepScreenshot>}
                      {step.tip  && <TipBox>💡 {step.tip}</TipBox>}
                      {step.note && <StepNote>{step.note}</StepNote>}
                    </StepContent>
                  </Step>
                ))}
              </StepList>
            </div>
          ))}
        </Section>

        <Divider />

        {/* FAQ */}
        <Section>
          <SectionLabel>{t.faq.label}</SectionLabel>
          <SectionTitle>{t.faq.title}</SectionTitle>

          <FaqList>
            {t.faq.items.map((item, i) => (
              <FaqItemComponent key={`${lang}-${i}`} q={item.q} a={item.a} />
            ))}
          </FaqList>
        </Section>

        <Divider />

        {/* Pricing */}
        <Section>
          <SectionLabel>{t.pricing.label}</SectionLabel>
          <SectionTitle>{t.pricing.title}</SectionTitle>
          <SectionSub>{t.pricing.sub}</SectionSub>

          {t.pricing.note && (
            <div style={{ background:'rgba(108,99,255,0.06)', border:'1px solid rgba(108,99,255,0.15)', borderRadius:10, padding:'10px 14px', marginBottom:'1rem', fontSize:'0.82rem', color:'#5A5A78', fontStyle:'italic' }}>
              {t.pricing.note}
            </div>
          )}
          <PricingTable>
            <PricingRow>
              {t.pricing.headers.map((h, i) => (
                <PricingCell key={i} $header $highlight={i === 1}>{h}</PricingCell>
              ))}
            </PricingRow>
            {t.pricing.rows.map((row, i) => (
              <PricingRow key={i}>
                {row.map((cell, j) => (
                  <PricingCell key={j} $feature={j === 0} $highlight={j === 1}>
                    {cell === '✓ immer' || cell === '✓ always'
                      ? <span style={{color:'#10B981',fontWeight:700}}>✓</span>
                      : cell === '✓' ? <Check>✓</Check>
                      : cell === '–' ? <Cross>–</Cross>
                      : cell}
                  </PricingCell>
                ))}
              </PricingRow>
            ))}
          </PricingTable>
        </Section>

        {/* CTA */}
        <CtaBox>
          <CtaTitle>{t.cta.title}</CtaTitle>
          <CtaSub>{t.cta.sub}</CtaSub>
          <BtnPrimary to="/register">{t.cta.btn}</BtnPrimary>
        </CtaBox>
      </Container>
    </Page>
  );
}
