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
          a: 'Yes – depending on your plan: Basic tracks 1 domain, Pro tracks up to 3, Agency up to 10. Each domain gets its own monthly report.',
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
      headers: ['Feature', 'Basic', 'Pro', 'Agency'],
      rows: [
        ['Price', '€19/mo', '€39/mo', '€79/mo'],
        ['Domains', '1', '3', '10'],
        ['Monthly PDF report', '✓', '✓', '✓'],
        ['GSC data', '✓', '✓', '✓'],
        ['GA4 data', '✓', '✓', '✓'],
        ['AI summary', '✓', '✓', '✓'],
        ['Email delivery', '✓', '✓', '✓'],
        ['White-label reports', '–', '✓', '✓'],
        ['Custom logo in PDF', '–', '✓', '✓'],
        ['Client management', '–', '–', '✓'],
        ['Bulk reporting', '–', '–', '✓'],
        ['First month free', '✓', '✓', '✓'],
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
          a: 'Ja – je nach Plan: Basic trackt 1 Domain, Pro bis zu 3, Agency bis zu 10. Jede Domain erhält ihren eigenen monatlichen Report.',
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
      headers: ['Funktion', 'Basic', 'Pro', 'Agency'],
      rows: [
        ['Preis', '19€/Monat', '39€/Monat', '79€/Monat'],
        ['Domains', '1', '3', '10'],
        ['Monatlicher PDF-Report', '✓', '✓', '✓'],
        ['GSC-Daten', '✓', '✓', '✓'],
        ['GA4-Daten', '✓', '✓', '✓'],
        ['KI-Zusammenfassung', '✓', '✓', '✓'],
        ['Email-Versand', '✓', '✓', '✓'],
        ['White-Label Reports', '–', '✓', '✓'],
        ['Eigenes Logo im PDF', '–', '✓', '✓'],
        ['Client Management', '–', '–', '✓'],
        ['Bulk Reporting', '–', '–', '✓'],
        ['Erster Monat kostenlos', '✓', '✓', '✓'],
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function Docs() {
  const [lang, setLang] = useState('de');
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

          <PricingTable>
            <PricingRow>
              {t.pricing.headers.map((h, i) => (
                <PricingCell key={i} $header $highlight={i === 2}>{h}</PricingCell>
              ))}
            </PricingRow>
            {t.pricing.rows.map((row, i) => (
              <PricingRow key={i}>
                {row.map((cell, j) => (
                  <PricingCell key={j} $feature={j === 0} $highlight={j === 2}>
                    {cell === '✓' ? <Check>✓</Check> : cell === '–' ? <Cross>–</Cross> : cell}
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
