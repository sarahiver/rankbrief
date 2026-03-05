// ── RankBrief Analytics ──────────────────────────────────────────────────────
// GA4 Measurement ID
const GA_ID = 'G-G5643ZGED3';
const CONSENT_KEY = 'rb_cookie_consent'; // 'granted' | 'denied' | null

// ── Consent helpers ───────────────────────────────────────────────────────────
export const getConsent = () => localStorage.getItem(CONSENT_KEY);

export const setConsent = (value) => {
  localStorage.setItem(CONSENT_KEY, value); // 'granted' | 'denied'
  if (value === 'granted') {
    initGA4();
  } else {
    // Revoke: update gtag consent state
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  }
};

// ── Load GA4 script dynamically ───────────────────────────────────────────────
const loadGA4Script = () => {
  if (document.getElementById('ga4-script')) return; // already loaded
  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
};

// ── Initialize GA4 ────────────────────────────────────────────────────────────
export const initGA4 = () => {
  loadGA4Script();
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied', // we never use ads
  });

  gtag('js', new Date());
  gtag('config', GA_ID, {
    send_page_view: false, // we send manually on route change
  });
};

// ── Track page view ───────────────────────────────────────────────────────────
export const trackPageView = (path) => {
  if (!window.gtag || getConsent() !== 'granted') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
};

// ── Track custom event ────────────────────────────────────────────────────────
export const trackEvent = (eventName, params = {}) => {
  if (!window.gtag || getConsent() !== 'granted') return;
  window.gtag('event', eventName, params);
};

// ── Auto-init if already consented ───────────────────────────────────────────
if (getConsent() === 'granted') {
  initGA4();
}
