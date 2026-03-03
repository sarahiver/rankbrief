import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Page = styled.div`
  min-height: 100vh;
  padding: 8rem 2rem 6rem;
`;

const Container = styled.div`
  max-width: 740px;
  margin: 0 auto;
`;

const Breadcrumb = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  a { color: ${({ theme }) => theme.colors.accent}; &:hover { text-decoration: underline; } }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: 100px;
  padding: 0.25rem 0.875rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 500;
  margin-bottom: 1.25rem;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 0.5rem;
  line-height: 1.05;
`;

const Meta = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textDim};
  margin-bottom: 3rem;
  font-weight: 300;
`;

const Content = styled.div`
  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 2.5rem 0 0.75rem;
    color: ${({ theme }) => theme.colors.text};
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
    color: ${({ theme }) => theme.colors.accent};
  }

  p {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.75;
    font-weight: 300;
    margin-bottom: 1rem;
  }

  ul {
    margin: 0.5rem 0 1rem 0;
    padding-left: 1.5rem;

    li {
      font-size: 0.9375rem;
      color: ${({ theme }) => theme.colors.textMuted};
      line-height: 1.7;
      margin-bottom: 0.4rem;
      font-weight: 300;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0 1.5rem;
    font-size: 0.875rem;

    th {
      text-align: left;
      padding: 0.625rem 1rem;
      background: ${({ theme }) => theme.colors.bgElevated};
      color: ${({ theme }) => theme.colors.textDim};
      font-weight: 500;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border: 1px solid ${({ theme }) => theme.colors.border};
    }

    td {
      padding: 0.625rem 1rem;
      color: ${({ theme }) => theme.colors.textMuted};
      border: 1px solid ${({ theme }) => theme.colors.border};
      font-weight: 300;
    }
  }

  .notice {
    background: ${({ theme }) => theme.colors.accentDim};
    border: 1px solid rgba(108,99,255,0.2);
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    margin: 1.5rem 0;
    line-height: 1.6;
    font-weight: 300;
  }
`;

const LangSwitch = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const LangBtn = styled(Link)`
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textDim};
  background: ${({ $active, theme }) => $active ? theme.colors.accentDim : 'transparent'};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

// ── Privacy EN ────────────────────────────────────────────────────────────────
export function PrivacyEN() {
  return (
    <Page>
      <Container>
        <Breadcrumb><Link to="/">Home</Link> › Privacy Policy</Breadcrumb>
        <LangSwitch>
          <LangBtn to="/privacy" $active={true}>English</LangBtn>
          <LangBtn to="/de/privacy">Deutsch</LangBtn>
        </LangSwitch>
        <Tag>Legal</Tag>
        <Title>Privacy Policy</Title>
        <Meta>Last updated: March 2025 · Operator: S&I. – Iver Gentz, Hamburg</Meta>
        <Content>
          <p>This Privacy Policy explains how RankBrief collects, uses, and protects your data. RankBrief is operated by S&I. (sole trader, owner: Iver Gentz), Große Freiheit 82, 22767 Hamburg, Germany.</p>

          <h2>1. Who We Are</h2>
          <p>RankBrief is a SaaS product operated by S&I. (Einzelunternehmen, Inhaber: Iver Gentz), Große Freiheit 82, 22767 Hamburg. Contact: support@rankbrief.com</p>

          <h2>2. What Data We Collect</h2>
          <h3>2.1 Account Data</h3>
          <p>When you register, we collect your email address and a hashed password. We use Supabase Auth for authentication.</p>

          <h3>2.2 Google OAuth Data</h3>
          <p>When you connect your Google account, we request the following permissions:</p>
          <ul>
            <li><strong>webmasters.readonly</strong> – to read your Google Search Console data (clicks, impressions, keywords, pages)</li>
            <li><strong>analytics.readonly</strong> – to read your Google Analytics 4 data (sessions, users, engagement rate)</li>
          </ul>
          <p>We store your Google OAuth Refresh Token, encrypted using AES-256-GCM. We store aggregated Search Console and Analytics data required to generate your monthly report. We do NOT store your Google account password. We do NOT access any data beyond what is listed above.</p>

          <h3>2.3 Payment Data</h3>
          <p>Payments are processed by Stripe. We do not store credit card numbers. We store your Stripe Customer ID to manage your subscription.</p>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To generate and deliver your automated monthly SEO report</li>
            <li>To send you your report by email via Brevo</li>
            <li>To manage your subscription and billing via Stripe</li>
            <li>To notify you of authentication errors or account issues</li>
          </ul>

          <h2>4. Legal Basis (GDPR)</h2>
          <ul>
            <li>Contract performance (Art. 6(1)(b) GDPR)</li>
            <li>Legitimate interest (Art. 6(1)(f) GDPR) – basic operational logging</li>
            <li>Consent (Art. 6(1)(a) GDPR) – when you connect your Google account</li>
          </ul>

          <h2>5. Google API Data</h2>
          <div className="notice">
            RankBrief's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. See: https://developers.google.com/terms/api-services-user-data-policy
          </div>
          <ul>
            <li>We only request the minimum scopes necessary (readonly access)</li>
            <li>We do not share Google user data with third parties except as necessary to operate the service</li>
            <li>We do not use Google user data for advertising purposes</li>
          </ul>

          <h2>6. Data Storage & Security</h2>
          <p>Your data is stored on Supabase infrastructure hosted in Frankfurt, Germany (eu-central-1), within the European Union.</p>
          <ul>
            <li>OAuth Refresh Tokens are encrypted using AES-256-GCM before being stored</li>
            <li>All data is transmitted over HTTPS</li>
            <li>Access to your data is restricted via Row Level Security policies</li>
          </ul>

          <h2>7. Data Sharing</h2>
          <table>
            <thead><tr><th>Processor</th><th>Purpose</th><th>Location</th></tr></thead>
            <tbody>
              <tr><td>Supabase</td><td>Database & authentication</td><td>EU (Frankfurt)</td></tr>
              <tr><td>Brevo (Sendinblue)</td><td>Email delivery</td><td>EU (France)</td></tr>
              <tr><td>Stripe</td><td>Payment processing</td><td>USA (SCCs apply)</td></tr>
              <tr><td>Anthropic (Claude)</td><td>AI summary generation</td><td>USA (SCCs apply)</td></tr>
              <tr><td>Vercel</td><td>Frontend hosting</td><td>EU edge nodes</td></tr>
            </tbody>
          </table>

          <h2>8. Your Rights (GDPR)</h2>
          <ul>
            <li>Right of access – request a copy of your personal data</li>
            <li>Right to rectification – correct inaccurate data</li>
            <li>Right to erasure – request deletion of your account and data</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent – disconnect Google at any time</li>
          </ul>
          <p>To exercise any of these rights, contact us at support@rankbrief.com. We will respond within 30 days.</p>

          <h2>9. Revoking Google Access</h2>
          <ul>
            <li>In RankBrief: Dashboard → Settings → Disconnect Google</li>
            <li>Via Google: myaccount.google.com → Security → Third-party apps with account access</li>
          </ul>
          <p>Upon disconnection, we will delete your stored Refresh Token immediately.</p>

          <h2>10. Data Retention</h2>
          <ul>
            <li>Account data: retained until account deletion</li>
            <li>Report data: retained for 24 months, then automatically deleted</li>
            <li>OAuth tokens: deleted immediately upon disconnection or account deletion</li>
            <li>Billing data: retained as required by German tax law (10 years)</li>
          </ul>

          <h2>11. Cookies</h2>
          <p>RankBrief uses only technically necessary cookies for session management (Supabase Auth). We do not use advertising or tracking cookies.</p>

          <h2>12. Contact & Supervisory Authority</h2>
          <p>S&I. – Iver Gentz · Große Freiheit 82, 22767 Hamburg · support@rankbrief.com</p>
          <p>Supervisory authority: Hamburgischer Beauftragter für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Str. 22, 20459 Hamburg, www.datenschutz.hamburg.de</p>
        </Content>
      </Container>
    </Page>
  );
}

// ── Privacy DE ────────────────────────────────────────────────────────────────
export function PrivacyDE() {
  return (
    <Page>
      <Container>
        <Breadcrumb><Link to="/">Home</Link> › Datenschutzerklärung</Breadcrumb>
        <LangSwitch>
          <LangBtn to="/privacy">English</LangBtn>
          <LangBtn to="/de/privacy" $active={true}>Deutsch</LangBtn>
        </LangSwitch>
        <Tag>Rechtliches</Tag>
        <Title>Datenschutz&shy;erklärung</Title>
        <Meta>Zuletzt aktualisiert: März 2025 · Betreiber: S&I. – Iver Gentz, Hamburg</Meta>
        <Content>
          <p>Diese Datenschutzerklärung erläutert, wie RankBrief Ihre Daten erhebt, verwendet und schützt. RankBrief wird betrieben von S&I. (Einzelunternehmen, Inhaber: Iver Gentz), Große Freiheit 82, 22767 Hamburg.</p>

          <h2>1. Verantwortlicher</h2>
          <p>S&I. (Einzelunternehmen, Inhaber: Iver Gentz) · Große Freiheit 82, 22767 Hamburg · E-Mail: support@rankbrief.com</p>

          <h2>2. Welche Daten wir erheben</h2>
          <h3>2.1 Accountdaten</h3>
          <p>Bei der Registrierung erheben wir Ihre E-Mail-Adresse und ein verschlüsseltes Passwort. Wir nutzen Supabase Auth zur Authentifizierung.</p>

          <h3>2.2 Google OAuth-Daten</h3>
          <p>Wenn Sie Ihr Google-Konto verbinden, fordern wir folgende Berechtigungen an:</p>
          <ul>
            <li><strong>webmasters.readonly</strong> – zum Lesen Ihrer Google Search Console-Daten (Klicks, Impressionen, Keywords, Seiten)</li>
            <li><strong>analytics.readonly</strong> – zum Lesen Ihrer Google Analytics 4-Daten (Sitzungen, Nutzer, Engagement-Rate)</li>
          </ul>
          <p>Wir speichern Ihren Google OAuth Refresh Token, verschlüsselt mit AES-256-GCM. Wir speichern NICHT Ihr Google-Passwort und greifen auf keine Daten zu, die über das oben Genannte hinausgehen.</p>

          <h3>2.3 Zahlungsdaten</h3>
          <p>Zahlungen werden über Stripe abgewickelt. Wir speichern keine Kreditkartennummern, sondern nur Ihre Stripe Customer ID.</p>

          <h2>3. Zweck der Datenverarbeitung</h2>
          <ul>
            <li>Erstellung und Zustellung Ihres automatischen monatlichen SEO-Reports</li>
            <li>Versand des Reports per E-Mail über Brevo</li>
            <li>Verwaltung Ihres Abonnements und der Abrechnung über Stripe</li>
            <li>Benachrichtigung bei Authentifizierungsfehlern oder Kontoproblemen</li>
          </ul>

          <h2>4. Rechtsgrundlage (DSGVO)</h2>
          <ul>
            <li>Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO)</li>
            <li>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) – bei der Verbindung Ihres Google-Kontos</li>
          </ul>

          <h2>5. Google API-Daten</h2>
          <div className="notice">
            Die Nutzung und Weitergabe von Informationen aus Google APIs durch RankBrief entspricht der Google API Services User Data Policy, einschließlich der Limited Use-Anforderungen: https://developers.google.com/terms/api-services-user-data-policy
          </div>

          <h2>6. Datenspeicherung & Sicherheit</h2>
          <p>Ihre Daten werden auf Supabase-Infrastruktur in Frankfurt, Deutschland (eu-central-1), gespeichert.</p>
          <ul>
            <li>OAuth Refresh Tokens werden mit AES-256-GCM verschlüsselt gespeichert</li>
            <li>Alle Daten werden über HTTPS übertragen</li>
            <li>Zugriff via Row Level Security beschränkt</li>
          </ul>

          <h2>7. Auftragsverarbeiter</h2>
          <table>
            <thead><tr><th>Anbieter</th><th>Zweck</th><th>Standort</th></tr></thead>
            <tbody>
              <tr><td>Supabase</td><td>Datenbank & Authentifizierung</td><td>EU (Frankfurt)</td></tr>
              <tr><td>Brevo (Sendinblue)</td><td>E-Mail-Versand</td><td>EU (Frankreich)</td></tr>
              <tr><td>Stripe</td><td>Zahlungsabwicklung</td><td>USA (SCC vereinbart)</td></tr>
              <tr><td>Anthropic (Claude)</td><td>KI-Zusammenfassung</td><td>USA (SCC vereinbart)</td></tr>
              <tr><td>Vercel</td><td>Frontend-Hosting</td><td>EU Edge Nodes</td></tr>
            </tbody>
          </table>

          <h2>8. Ihre Rechte (DSGVO)</h2>
          <ul>
            <li>Auskunftsrecht</li>
            <li>Berichtigungsrecht</li>
            <li>Recht auf Löschung</li>
            <li>Recht auf Datenübertragbarkeit</li>
            <li>Widerspruchsrecht</li>
            <li>Recht auf Widerruf der Einwilligung – Google-Verbindung jederzeit trennbar</li>
          </ul>
          <p>Kontakt: support@rankbrief.com – Wir antworten innerhalb von 30 Tagen.</p>

          <h2>9. Google-Zugriff widerrufen</h2>
          <ul>
            <li>In RankBrief: Dashboard → Einstellungen → Google trennen</li>
            <li>Direkt bei Google: myaccount.google.com → Sicherheit → Drittanbieter-Apps</li>
          </ul>

          <h2>10. Speicherdauer</h2>
          <ul>
            <li>Kontodaten: bis zur Kontolöschung</li>
            <li>Reportdaten: 24 Monate, dann automatische Löschung</li>
            <li>OAuth-Token: unverzügliche Löschung bei Trennung</li>
            <li>Abrechnungsdaten: 10 Jahre (HGB/AO)</li>
          </ul>

          <h2>11. Cookies</h2>
          <p>RankBrief verwendet ausschließlich technisch notwendige Cookies (Supabase Auth). Kein Cookie-Banner erforderlich.</p>

          <h2>12. Kontakt & Aufsichtsbehörde</h2>
          <p>S&I. – Iver Gentz · Große Freiheit 82, 22767 Hamburg · support@rankbrief.com</p>
          <p>Aufsichtsbehörde: Hamburgischer Beauftragter für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Str. 22, 20459 Hamburg, www.datenschutz.hamburg.de</p>
        </Content>
      </Container>
    </Page>
  );
}

// ── Terms EN ─────────────────────────────────────────────────────────────────
export function TermsEN() {
  return (
    <Page>
      <Container>
        <Breadcrumb><Link to="/">Home</Link> › Terms of Service</Breadcrumb>
        <LangSwitch>
          <LangBtn to="/terms" $active={true}>English</LangBtn>
          <LangBtn to="/de/terms">Deutsch</LangBtn>
        </LangSwitch>
        <Tag>Legal</Tag>
        <Title>Terms of Service</Title>
        <Meta>Last updated: March 2025 · Operator: S&I. – Iver Gentz, Hamburg</Meta>
        <Content>
          <h2>1. Service Description</h2>
          <p>RankBrief is a SaaS tool that automatically generates monthly SEO reports based on data from Google Search Console and Google Analytics 4, and delivers them by email. Operated by S&I. (sole trader, owner: Iver Gentz), Große Freiheit 82, 22767 Hamburg.</p>

          <h2>2. Eligibility</h2>
          <p>You must be at least 18 years old and have the authority to connect the Google properties you use with RankBrief.</p>

          <h2>3. Account & Access</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must provide accurate information when registering</li>
            <li>You may not share your account with others</li>
          </ul>

          <h2>4. Subscription & Payment</h2>
          <h3>4.1 Plans</h3>
          <p>RankBrief offers Basic (1 domain, €19/mo), Pro (3 domains, €39/mo), and Agency (10 domains, €79/mo). Prices may change with 30 days notice.</p>

          <h3>4.2 Billing</h3>
          <p>Subscriptions are billed monthly in advance via Stripe. By subscribing, you authorize recurring charges.</p>

          <h3>4.3 Cancellation</h3>
          <p>You may cancel at any time. Cancellation takes effect at the end of the billing period. No refunds for partial periods.</p>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to use RankBrief for any illegal purpose, reverse engineer the service, connect properties you don't own, or resell RankBrief without written agreement.</p>

          <h2>6. Service Availability</h2>
          <p>We aim for high availability but do not guarantee 100% uptime. Report generation depends on Google API availability. We are not responsible for delays caused by Google API outages.</p>

          <h2>7. Intellectual Property</h2>
          <p>RankBrief and all associated software is owned by S&I. (Iver Gentz). Your report data belongs to you.</p>

          <h2>8. Disclaimer of Warranties</h2>
          <p>RankBrief is provided "as is". We do not guarantee the accuracy of SEO data or that reports will result in improved rankings.</p>

          <h2>9. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, our total liability shall not exceed the amount you paid in the 3 months preceding the claim.</p>

          <h2>10. Governing Law</h2>
          <p>These Terms are governed by German law. Place of jurisdiction: Hamburg, Germany.</p>

          <h2>11. Contact</h2>
          <p>S&I. – Iver Gentz · Große Freiheit 82, 22767 Hamburg · support@rankbrief.com · www.rankbrief.com</p>
        </Content>
      </Container>
    </Page>
  );
}

// ── Terms DE ─────────────────────────────────────────────────────────────────
export function TermsDE() {
  return (
    <Page>
      <Container>
        <Breadcrumb><Link to="/">Home</Link> › Nutzungsbedingungen</Breadcrumb>
        <LangSwitch>
          <LangBtn to="/terms">English</LangBtn>
          <LangBtn to="/de/terms" $active={true}>Deutsch</LangBtn>
        </LangSwitch>
        <Tag>Rechtliches</Tag>
        <Title>Nutzungs&shy;bedingungen</Title>
        <Meta>Zuletzt aktualisiert: März 2025 · Betreiber: S&I. – Iver Gentz, Hamburg</Meta>
        <Content>
          <h2>1. Leistungsbeschreibung</h2>
          <p>RankBrief ist ein SaaS-Tool, das automatisch monatliche SEO-Reports auf Basis von Google Search Console- und Google Analytics 4-Daten erstellt und per E-Mail zustellt. Betrieben von S&I. (Einzelunternehmen, Inhaber: Iver Gentz), Große Freiheit 82, 22767 Hamburg.</p>

          <h2>2. Nutzungsvoraussetzungen</h2>
          <p>Sie müssen mindestens 18 Jahre alt sein und berechtigt sein, die verbundenen Google-Properties zu nutzen.</p>

          <h2>3. Konto & Zugang</h2>
          <ul>
            <li>Sie sind für die Vertraulichkeit Ihrer Zugangsdaten verantwortlich</li>
            <li>Sie müssen bei der Registrierung korrekte Angaben machen</li>
            <li>Eine Weitergabe des Kontos ist nicht gestattet</li>
          </ul>

          <h2>4. Abonnement & Zahlung</h2>
          <h3>4.1 Tarife</h3>
          <p>RankBrief bietet Basic (1 Domain, 19 €/Monat), Pro (3 Domains, 39 €/Monat) und Agency (10 Domains, 79 €/Monat). Preise können mit 30 Tagen Vorankündigung angepasst werden.</p>

          <h3>4.2 Abrechnung</h3>
          <p>Abonnements werden monatlich im Voraus über Stripe abgerechnet.</p>

          <h3>4.3 Kündigung</h3>
          <p>Jederzeit kündbar. Die Kündigung wird zum Ende des laufenden Abrechnungszeitraums wirksam. Keine Rückerstattung anteiliger Beträge.</p>

          <h2>5. Zulässige Nutzung</h2>
          <p>Sie verpflichten sich, RankBrief nicht für rechtswidrige Zwecke zu nutzen, den Dienst nicht zu dekompilieren, keine nicht autorisierten Properties zu verbinden und RankBrief nicht ohne schriftliche Vereinbarung weiterzuverkaufen.</p>

          <h2>6. Verfügbarkeit</h2>
          <p>Wir streben hohe Verfügbarkeit an, garantieren aber keine 100%ige Betriebszeit. Wir sind nicht verantwortlich für Ausfälle der Google APIs.</p>

          <h2>7. Geistiges Eigentum</h2>
          <p>RankBrief ist Eigentum von S&I. (Iver Gentz). Ihre Reportdaten gehören Ihnen.</p>

          <h2>8. Haftungsausschluss</h2>
          <p>RankBrief wird "wie besehen" bereitgestellt. Wir garantieren nicht die Richtigkeit der SEO-Daten.</p>

          <h2>9. Haftungsbeschränkung</h2>
          <p>Soweit gesetzlich zulässig ist die Haftung auf den Betrag begrenzt, den Sie in den 3 Monaten vor dem Anspruch gezahlt haben. Gesetzliche Haftungsregelungen bleiben unberührt.</p>

          <h2>10. Anwendbares Recht & Gerichtsstand</h2>
          <p>Es gilt deutsches Recht. Gerichtsstand ist Hamburg.</p>

          <h2>11. Kontakt</h2>
          <p>S&I. – Iver Gentz · Große Freiheit 82, 22767 Hamburg · support@rankbrief.com · www.rankbrief.com</p>
        </Content>
      </Container>
    </Page>
  );
}
