import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../analytics';

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
const Page = styled.div`min-height: 100vh; overflow-x: hidden; width: 100%;`;

// ── Hero ──────────────────────────────────────────────────────────────────────
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 2rem 8rem;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 480px) {
    padding: 7rem 1.25rem 4rem;
  }
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
  max-width: 90vw;
  text-align: center;
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
  font-size: clamp(1.75rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.04em;
  max-width: 720px;
  width: 100%;
  margin-bottom: 1.75rem;
  padding: 0 0.5rem 0.25rem;
  animation: ${fadeUp} 0.6s 0.1s ease both;

  .line1 {
    display: block;
  }
  .gradient {
    display: block;
    padding-bottom: 0.15em;
    background: linear-gradient(135deg, #6C63FF 0%, #A78BFA 40%, #63CFFF 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 4s linear infinite;
  }
  @media (max-width: 480px) {
    font-size: clamp(1.6rem, 8vw, 2.5rem);
  }
`;

const HeroSub = styled.p`
  font-size: clamp(1rem, 1.8vw, 1.125rem);
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

// ── Urgency Banner ────────────────────────────────────────────────────────────
const UrgencyBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.06) 100%);
  border: 1px solid rgba(245,158,11,0.35);
  border-radius: 16px;
  padding: 1rem 1.75rem;
  margin-top: 1.5rem;
  animation: ${fadeUp} 0.6s 0.45s ease both;
  max-width: 560px;
  width: 100%;
  @media (max-width: 480px) { padding: 0.875rem 1.25rem; }
`;

const UrgencyTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #B45309;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const UrgencySlots = styled.div`
  font-size: 0.8125rem;
  color: #92400E;
  font-weight: 500;
`;

const UrgencyCodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 360px) { flex-direction: column; }
`;

const UrgencyCode = styled.span`
  font-family: monospace;
  font-size: 1rem;
  font-weight: 800;
  color: #B45309;
  background: rgba(245,158,11,0.15);
  border: 1px dashed rgba(245,158,11,0.5);
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  letter-spacing: 0.05em;
`;

const CopyBtn = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  color: #B45309;
  background: rgba(245,158,11,0.15);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 6px;
  padding: 0.25rem 0.625rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(245,158,11,0.25); }
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
// ── Social Proof ──────────────────────────────────────────────────────────────
const SocialProofSection = styled.section`
  padding: 3rem 2rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const SocialProofInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SocialProofLabel = styled.div`
  text-align: center;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const TestimonialCard = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
`;

const TestimonialStars = styled.div`
  color: #F59E0B;
  font-size: 0.875rem;
  margin-bottom: 0.625rem;
  letter-spacing: 2px;
`;

const TestimonialText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.03em;
`;

const StatLabel2 = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  margin-top: 0.25rem;
`;

const Section = styled.section`
  overflow: hidden;
  max-width: 1100px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 6rem 2rem;
  @media (max-width: 480px) {
    padding: 4rem 1.25rem;
  }
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
  font-size: clamp(1.5rem, 3.5vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 1rem;
  max-width: 600px;
  padding-bottom: 0.1em;
  @media (max-width: 480px) {
    font-size: clamp(1.4rem, 7vw, 2rem);
    line-height: 1.25;
  }
`;

const SectionSub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.0625rem;
  max-width: 500px;
  line-height: 1.7;
  font-weight: 300;
  margin-bottom: 3rem;
`;

// ── Sample Reports ────────────────────────────────────────────────────────────
const SampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const SampleCard = styled.div`
  position: relative;
  border-radius: 14px;
  border: 1px solid ${({ $featured, theme }) => $featured ? 'rgba(108,99,255,0.4)' : theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s;
  ${({ $featured }) => $featured && `box-shadow: 0 6px 32px rgba(108,99,255,0.15); transform: scale(1.02);`}
  &:hover { transform: ${({ $featured }) => $featured ? 'scale(1.04)' : 'translateY(-3px)'}; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
`;

const SamplePopularBadge = styled.div`
  position: absolute; top: 12px; right: 12px;
  background: #6C63FF; color: white;
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 3px 9px; border-radius: 20px;
`;

const SampleCardHead = styled.div`
  display: flex; align-items: center; gap: 0.6rem;
`;

const SampleIcon = styled.div`font-size: 1.4rem; line-height: 1;`;

const SamplePlan = styled.div`
  font-size: 1.05rem; font-weight: 800; letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const SampleDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  flex: 1;
`;

const SampleBtn = styled.div`
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.85rem; font-weight: 600;
  color: #6C63FF;
  margin-top: 0.25rem;
  svg { transition: transform 0.15s; }
  ${SampleCard}:hover & svg { transform: translateX(3px); }
`;


const SampleSingleWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const SampleSingleBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid rgba(108,99,255,0.3);
  border-radius: 14px;
  padding: 1.25rem 1.75rem;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(108,99,255,0.10);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(108,99,255,0.18);
  }
`;

const SampleSingleIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
`;

const SampleSingleText = styled.div`
  flex: 1;
`;

const SampleSingleTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #6C63FF;
  margin-bottom: 3px;
`;

const SampleSingleSub = styled.div`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: monospace;
`;

const SampleHint = styled.p`
  font-size: 0.78rem; color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.55; text-align: center;
`;

// Lightbox
const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.15s ease;
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @media (max-width: 600px) { padding: 0.75rem; }
`;

const LightboxWrap = styled.div`
  position: relative;
  width: 100%; max-width: 860px;
  height: 90vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  @media (max-width: 600px) {
    height: 85vh;
    border-radius: 12px;
  }
`;

const LightboxHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background: #f8f8fc;
  border-bottom: 1px solid #e5e5f0;
  flex-shrink: 0;
  gap: 0.5rem;
  @media (max-width: 600px) {
    padding: 0.65rem 0.875rem;
    flex-wrap: wrap;
  }
`;

const LightboxTitle = styled.div`
  font-size: 0.875rem; font-weight: 700; color: #1a1a2e;
  display: flex; align-items: center; gap: 0.5rem;
  @media (max-width: 600px) { font-size: 0.8rem; }
`;

const LightboxActions = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
`;

const LightboxDownloadBtn = styled.button`
  font-size: 0.8rem; font-weight: 600; color: ${({ $loading }) => $loading ? '#aaa' : '#6C63FF'};
  background: none; border: 1px solid ${({ $loading }) => $loading ? '#ddd' : 'rgba(108,99,255,0.35)'};
  padding: 0.3rem 0.75rem; border-radius: 6px; cursor: ${({ $loading }) => $loading ? 'default' : 'pointer'};
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  &:hover:not(:disabled) { background: rgba(108,99,255,0.08); }
  &:disabled { opacity: 0.6; }
  @media (max-width: 600px) { font-size: 0.75rem; padding: 0.25rem 0.5rem; }
`;

const LightboxClose = styled.button`
  background: none; border: none; cursor: pointer;
  font-size: 1.3rem; color: #888; line-height: 1;
  padding: 0.2rem 0.4rem; border-radius: 4px;
  transition: color 0.15s, background 0.15s;
  &:hover { color: #1a1a2e; background: #eee; }
`;

const LightboxFrame = styled.div`
  flex: 1;
  width: 100%;
  border: none;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const LightboxFallback = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: #f4f4fa;
  padding: 3rem;
  text-align: center;
`;

const LightboxFallbackIcon = styled.div`font-size: 4rem; line-height: 1;`;

const LightboxFallbackTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1C1C2E;
`;

const LightboxFallbackSub = styled.div`
  font-size: 0.85rem;
  color: #7A7A96;
  max-width: 320px;
  line-height: 1.6;
`;

const LightboxOpenBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #6C63FF;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  &:hover { background: #5a52e0; }
`;


// ── Pricing Configurator ──────────────────────────────────────────────────────
const ConfigWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 860px;
  margin: 0 auto;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const ConfigLeft = styled.div`
  background: linear-gradient(135deg, #6C63FF 0%, #5a52e0 100%);
  border-radius: 20px;
  padding: 2rem;
  color: #fff;
`;

const ConfigRight = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 2rem;
`;

const ConfigTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
`;

const ConfigPrice = styled.div`
  font-size: 2.6rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
  margin: 0.75rem 0 0.25rem;
  span { font-size: 1rem; font-weight: 400; opacity: 0.7; }
`;

const ConfigFeatureList = styled.ul`
  list-style: none;
  padding: 0; margin: 1rem 0 0;
  display: flex; flex-direction: column; gap: 8px;
`;

const ConfigFeature = styled.li`
  font-size: 0.85rem;
  opacity: 0.92;
  display: flex; align-items: center; gap: 8px;
  &::before { content: '✓'; font-weight: 800; flex-shrink: 0; }
`;

const ConfigLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 10px;
`;

const SliderWrap = styled.div`
  margin-bottom: 1.5rem;
`;

const SliderTrack = styled.input`
  width: 100%;
  margin: 6px 0 8px;
  accent-color: #6C63FF;
`;

const SliderSteps = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SliderHint = styled.div`
  font-size: 0.75rem;
  color: #6C63FF;
  font-weight: 600;
  margin-top: 4px;
  min-height: 18px;
`;

const WLToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  &:hover { border-color: rgba(108,99,255,0.3); }
`;

const WLToggleInfo = styled.div``;
const WLToggleName = styled.div`font-size: 0.88rem; font-weight: 600; color: ${({ theme }) => theme.colors.text};`;
const WLToggleSub = styled.div`font-size: 0.72rem; color: ${({ theme }) => theme.colors.textMuted}; margin-top: 2px;`;

const ToggleSwitch = styled.div`
  width: 38px; height: 22px; border-radius: 11px;
  background: ${({ $on }) => $on ? '#6C63FF' : '#D0D0E0'};
  position: relative; flex-shrink: 0; transition: background 0.2s;
  &::after {
    content: '';
    position: absolute;
    width: 16px; height: 16px; border-radius: 8px;
    background: #fff; top: 3px;
    left: ${({ $on }) => $on ? '19px' : '3px'};
    transition: left 0.2s;
  }
`;

const ConfigTotal = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 1.25rem;
`;

const ConfigTotalPrice = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: 4px;
  span { font-size: 0.9rem; font-weight: 400; color: ${({ theme }) => theme.colors.textMuted}; }
`;

const ConfigTotalSub = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1rem;
  min-height: 18px;
`;

const ConfigCTA = styled(Link)`
  display: block;
  text-align: center;
  background: #6C63FF;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 13px 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.18s;
  &:hover { background: #5a52e0; }
`;

const ConfigTrust = styled.div`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 8px;
  line-height: 1.5;
`;

// ── Features ──────────────────────────────────────────────────────────────────
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    padding-bottom: 1rem;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const FeatureCardMobile = styled.div`
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
  @media (max-width: 600px) {
    min-width: min(260px, 75vw);
    max-width: min(260px, 75vw);
    flex-shrink: 0;
    scroll-snap-align: start;
    word-break: break-word;
    overflow-wrap: break-word;
  }
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

// ── Scroll hint ───────────────────────────────────────────────────────────────
const ScrollHint = styled.p`
  display: none;
  @media (max-width: 600px) {
    display: block;
    text-align: center;
    font-size: 0.75rem;
    color: #aaa;
    margin-top: 0.75rem;
    letter-spacing: 0.05em;
  }
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
  @media (max-width: 860px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    padding-bottom: 1rem;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
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

  @media (max-width: 860px) {
    min-width: min(280px, 78vw);
    max-width: min(280px, 78vw);
    flex-shrink: 0;
    scroll-snap-align: center;
  }
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

// ── Billing Toggle ────────────────────────────────────────────────────────────
const BillingToggleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

const BillingToggleTrack = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 100px;
  padding: 4px;
  gap: 2px;
`;

const BillingToggleBtn = styled.button`
  padding: 0.4rem 1.1rem;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textDim};
`;

const AnnualBadge = styled.span`
  background: linear-gradient(135deg, #10B981, #059669);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 100px;
  letter-spacing: 0.04em;
  white-space: nowrap;
`;

const PriceStrike = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textDim};
  text-decoration: line-through;
  margin-right: 0.25rem;
  font-weight: 400;
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

// ── i18n content ──────────────────────────────────────────────────────────────
const i18n = {
  en: {
    badge: 'Automated SEO reporting for agencies & freelancers',
    heroTitle1: 'Client-ready SEO Reports',
    heroTitle2: 'in 3 min, not 2 hours.',
    heroSub: 'Stop spending 3 hours on monthly SEO reports. Connect Google Search Console once – RankBrief automatically generates a branded PDF report and delivers it to your inbox on the 1st of every month.',
    heroCta: 'Get your first report free',
    heroSeeHow: '▶ See a real client report',
    trust1: 'First report free',
    trust2: 'GDPR · EU servers',
    trust3: 'No credit card',
    howLabel: 'How it works',
    howTitle: 'Set it up once.\nReports run forever.',
    howSub: 'Four steps between you and automated monthly SEO reporting.',
    featLabel: 'Features',
    featTitle: 'Everything you need.\nNothing you don\'t.',
    featSub: 'No more time wasted on manual reports. Connect Google once, and RankBrief takes care of the rest.',
    sampleLabel: 'Sample Report',
    sampleTitle: 'See exactly what your clients receive.',
    sampleSub: 'A real RankBrief report — automatically generated, professionally formatted, ready to send.',
    samplePopular: 'Most popular',
    sampleFile: 'https://ubexqxxkqjzhsgidsseh.supabase.co/storage/v1/object/public/reports/00000000-0000-0000-0000-000000000002/RankBrief_naturkosmetik-shop-de_Maerz-2026.pdf',
    sampleCta: 'Open sample report →',
    sampleClose: 'Close',
    sampleHint: 'This is an automatically generated report — exactly what your clients receive every month.',
    pricingLabel: 'Pricing',
    pricingTitle: 'One plan. All features.\nPay only for more properties.',
    pricingSub: 'First month free. No credit card required. Cancel anytime.',
    faqLabel: 'FAQ',
    faqTitle: 'Questions & answers',
    faqSub: 'Everything you need to know before signing up.',
    ctaTitle: 'Stop writing reports manually.',
    ctaSub: 'Join freelancers and agencies who automated their SEO reporting with RankBrief.',
    ctaBtn: 'Get my first report free – no credit card →',
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
      { name: 'Base', price: '19', period: '/mo', featured: false, features: ['1 property included', 'Full report: AI, GA4, market radar', 'Recommendations + priorities', 'Automatic monthly email', 'RankBrief footer'] },
      { name: '+3 Properties', price: '24', period: '/mo', featured: false, addon: true, features: ['3 additional properties', '= 4 properties total', 'All features included'] },
      { name: '+5 Properties', price: '30', period: '/mo', featured: true, addon: true, features: ['5 additional properties', '= 6 properties total', '€6 per property'] },
      { name: '+10 Properties', price: '50', period: '/mo', featured: false, addon: true, features: ['10 additional properties', '= 11 properties total', '€5 per property'] },
      { name: 'White-Label', price: '5', period: '/mo', featured: false, addon: true, features: ['Remove RankBrief footer', 'Your logo + brand colors', 'For your entire account'] },
    ],
    faqs: [
      { q: 'Is my Google data safe?', a: 'Yes. We request read-only access to your Search Console and Analytics data. OAuth tokens are encrypted using AES-256-GCM and stored on EU servers (Frankfurt). We never access your data beyond what\'s needed to generate your report.' },
      { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your dashboard at any time. Your subscription remains active until the end of the billing period. No questions asked, no hidden fees.' },
      { q: 'Do I need to be technical to use RankBrief?', a: 'Not at all. Setup takes about 3 minutes: sign in with Google, select your website, choose a plan. After that, everything is automatic.' },
      { q: 'What does the report include?', a: 'Each report covers clicks, impressions, CTR, average position, sessions, engagement rate, top 10 keywords, top 10 pages, month-over-month comparison, and an AI-written plain-language summary.' },
      { q: 'Can I use my own logo?', a: 'Yes — add the White-Label add-on for €5/month. This removes the RankBrief footer and lets you upload your own logo and brand colors for all reports.' },
      { q: 'Which Google properties are supported?', a: 'Any verified Google Search Console property. GA4 support is available for all standard properties. We support both domain and URL-prefix GSC properties.' },
    ],
  },
  de: {
    badge: 'Automatisches SEO-Reporting für Agenturen & Freelancer',
    heroTitle1: 'Client-ready SEO Reports',
    heroTitle2: 'in 3 Min statt 2h.',
    heroSub: 'Schluss mit 3 Stunden manuellem Reporting. Google Search Console einmal verbinden – RankBrief erstellt jeden 1. des Monats automatisch einen professionellen PDF-Report mit KI-Analyse – automatisch per Mail, ohne weiteres Zutun.',
    heroCta: 'Ersten Report kostenlos erhalten',
    heroSeeHow: '▶ Echten Kunden-Report sehen',
    trust1: 'Erster Report kostenlos',
    trust2: 'DSGVO · EU-Server',
    trust3: 'Keine Kreditkarte',
    howLabel: 'So funktioniert\'s',
    howTitle: 'Einmal einrichten.\nReports laufen automatisch.',
    howSub: 'Vier Schritte bis zu deinem automatischen monatlichen SEO-Report.',
    featLabel: 'Features',
    featTitle: 'Alles was du brauchst.\nNichts was du nicht brauchst.',
    featSub: 'Schluss mit stundenlanger Report-Arbeit. Verbinde einmal Google, und RankBrief erledigt den Rest.',
    sampleLabel: 'Beispiel-Report',
    sampleTitle: 'Sieh genau was deine Kunden erhalten.',
    sampleSub: 'Ein echter RankBrief-Report — automatisch generiert, professionell aufbereitet, bereit zum Versand.',
    samplePopular: 'Am beliebtesten',
    sampleFile: 'https://ubexqxxkqjzhsgidsseh.supabase.co/storage/v1/object/public/reports/00000000-0000-0000-0000-000000000002/RankBrief_naturkosmetik-shop-de_Maerz-2026.pdf',
    sampleCta: 'Beispiel-Report öffnen →',
    sampleClose: 'Schließen',
    sampleHint: 'Automatisch generiert — genau so kommt der Report jeden Monat bei deinen Kunden an.',
    pricingLabel: 'Preise',
    pricingTitle: 'Ein Plan. Alles drin.\nNur weitere Properties kosten extra.',
    pricingSub: 'Erster Monat kostenlos. Keine Kreditkarte erforderlich. Jederzeit kündbar.',
    faqLabel: 'FAQ',
    faqTitle: 'Fragen & Antworten',
    faqSub: 'Alles was du vor der Anmeldung wissen musst.',
    ctaTitle: 'Hör auf, Reports manuell zu schreiben.',
    ctaSub: 'Schließ dich Freelancern und Agenturen an, die ihr SEO-Reporting mit RankBrief automatisiert haben.',
    ctaBtn: 'Ersten Report kostenlos – ohne Kreditkarte →',
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
      { name: 'Basis', price: '19', period: '/Monat', featured: false, features: ['1 Property inklusive', 'Vollständiger Report: KI, GA4, Markt-Radar', 'Empfehlungen + Top-Prioritäten', 'Automatischer monatlicher Versand', 'RankBrief-Fußzeile'] },
      { name: '+3 Properties', price: '24', period: '/Monat', featured: false, addon: true, features: ['3 weitere Properties', '= 4 Properties gesamt', 'Alle Features inklusive'] },
      { name: '+5 Properties', price: '30', period: '/Monat', featured: true, addon: true, features: ['5 weitere Properties', '= 6 Properties gesamt', '€6 pro Property'] },
      { name: '+10 Properties', price: '50', period: '/Monat', featured: false, addon: true, features: ['10 weitere Properties', '= 11 Properties gesamt', '€5 pro Property'] },
      { name: 'White-Label', price: '5', period: '/Monat', featured: false, addon: true, features: ['RankBrief-Fußzeile entfernen', 'Eigenes Logo + Brandfarben', 'Für alle Properties im Account'] },
    ],
    faqs: [
      { q: 'Sind meine Google-Daten sicher?', a: 'Ja. Wir fordern nur lesenden Zugriff auf deine Search Console und Analytics-Daten. OAuth-Tokens werden mit AES-256-GCM verschlüsselt und auf EU-Servern (Frankfurt) gespeichert.' },
      { q: 'Kann ich jederzeit kündigen?', a: 'Ja. Jederzeit im Dashboard kündigen. Dein Abo bleibt bis Ende des Abrechnungszeitraums aktiv. Keine versteckten Gebühren.' },
      { q: 'Muss ich technisches Wissen haben?', a: 'Nein. Die Einrichtung dauert ca. 3 Minuten: mit Google anmelden, Website auswählen, Plan wählen. Danach läuft alles automatisch.' },
      { q: 'Was enthält der Report?', a: 'Klicks, Impressionen, CTR, durchschnittliche Position, Sessions, Engagement Rate, Top 10 Keywords, Top 10 Seiten, Vormonatsvergleich und eine KI-generierte Zusammenfassung.' },
      { q: 'Kann ich mein eigenes Logo verwenden?', a: 'Ja — füge das White-Label Add-on für €5/Monat hinzu. Das entfernt die RankBrief-Fußzeile und ermöglicht eigenes Logo und Brandfarben für alle Reports.' },
      { q: 'Welche Google-Properties werden unterstützt?', a: 'Jede verifizierte Google Search Console Property. GA4 wird für alle Standard-Properties unterstützt. Wir unterstützen Domain- und URL-Prefix-GSC-Properties.' },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
const PROMO_CODE = 'EARLY2026';
const PROMO_MAX  = 50;

export default function Landing({ lang = 'de' }) {
  const [openFaq, setOpenFaq] = React.useState(null);
  const [annual, setAnnual] = React.useState(false);
  const [sampleOpen, setSampleOpen] = React.useState(null);
  const [configProps, setConfigProps] = React.useState(1);
  const [configWL, setConfigWL] = React.useState(false);
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 700);
  const [promoUsed, setPromoUsed] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/validate-promo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ code: PROMO_CODE }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.uses_count !== undefined) setPromoUsed(data.uses_count);
      })
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMO_CODE).then(() => {
      setCopied(true);
      trackEvent('promo_code_copy', { code: PROMO_CODE });
      setTimeout(() => setCopied(false), 2000);
    });
  };
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const t = i18n[lang] || i18n.en;

  const downloadSamplePdf = async (sample) => {
    trackEvent('sample_pdf_open', { plan: sample.slug || sample.plan.toLowerCase() });
    // Direct link to pre-generated PDF in Storage
    const a = document.createElement('a');
    a.href = sample.file;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

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
          <span className="line1">{t.heroTitle1}</span>
          <span className="gradient">{t.heroTitle2}</span>
        </HeroTitle>

        <HeroSub>{t.heroSub}</HeroSub>

        <HeroCTA>
          <BtnPrimary to="/register" onClick={() => trackEvent('cta_click', { button: 'hero_register', lang })}>
            {t.heroCta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BtnPrimary>
          <BtnGhost to="#features" onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>{t.heroSeeHow}</BtnGhost>
        </HeroCTA>

        <TrustRow>
          {[t.trust1, t.trust2, t.trust3].map(item => (
            <TrustItem key={item}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0l1.8 5.4H14l-4.6 3.3 1.8 5.5L7 11l-4.2 3.2 1.8-5.5L0 5.4h5.2z"/></svg>
              {item}
            </TrustItem>
          ))}
        </TrustRow>

        <UrgencyBanner>
          <UrgencyTop>
            <span>⚡</span>
            {lang === 'de'
              ? 'Early Access: Ersten Report + 3 Monate kostenlos'
              : 'Early Access: First report + 3 months free'}
          </UrgencyTop>
          {promoUsed !== null && (
            <UrgencySlots>
              {lang === 'de'
                ? `Noch ${Math.max(0, PROMO_MAX - promoUsed)} von ${PROMO_MAX} Plätzen verfügbar`
                : `${Math.max(0, PROMO_MAX - promoUsed)} of ${PROMO_MAX} spots remaining`}
            </UrgencySlots>
          )}
          <UrgencyCodeRow>
            <span style={{ fontSize: '0.8125rem', color: '#92400E' }}>
              {lang === 'de' ? 'Code bei Registrierung eingeben:' : 'Enter code at signup:'}
            </span>
            <UrgencyCode>{PROMO_CODE}</UrgencyCode>
            <CopyBtn onClick={handleCopy}>
              {copied ? (lang === 'de' ? '✓ Kopiert' : '✓ Copied') : (lang === 'de' ? 'Kopieren' : 'Copy')}
            </CopyBtn>
          </UrgencyCodeRow>
        </UrgencyBanner>

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

      {/* SOCIAL PROOF */}
      <SocialProofSection>
        <SocialProofInner>
          <SocialProofLabel>
            {lang === 'de' ? 'Was unsere Nutzer sagen' : 'What our users say'}
          </SocialProofLabel>
          <TestimonialGrid>

            <TestimonialCard>
              <TestimonialStars>★★★★★</TestimonialStars>
              <TestimonialText>
                {lang === 'de'
                  ? `"Ehrlich gesagt? Das Reporting war der Grund, warum ich Sonntage gehasst habe. Diese ewige Copy-Paste-Hölle aus der Search Console in Excel... Damit ist jetzt Schluss. RankBrief liefert meinen Kunden eine Qualität, für die ich früher ein ganzes Wochenende geopfert hätte. Jetzt gehe ich sonntags wandern und das PDF geht trotzdem pünktlich raus."`
                  : `"Honestly? Reporting was the reason I dreaded Sundays. That endless copy-paste hell from Search Console into Excel... That's over now. RankBrief delivers a quality I used to sacrifice whole weekends for. Now I go hiking on Sundays and the PDF still goes out on time."`}
              </TestimonialText>
              <TestimonialAuthor>M. S. · {lang === 'de' ? 'SEO-Freelancer · 6 Kunden' : 'SEO Freelancer · 6 clients'}</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialStars>★★★★★</TestimonialStars>
              <TestimonialText>
                {lang === 'de'
                  ? `"In Pitch-Gesprächen ist das Reporting oft mein wichtigstes Argument. Während die Konkurrenz mit kryptischen Tabellen um sich wirft, kriegen meine Kunden ein Dokument, das sie tatsächlich verstehen. Die KI-Zusammenfassung trifft den Nagel immer auf den Kopf. Das lässt mich als Consultant extrem professionell dastehen, ohne dass ich eine Minute tippen muss."`
                  : `"In pitch meetings, reporting is often my strongest argument. While competitors throw cryptic spreadsheets around, my clients get a document they actually understand. The AI summary always hits the nail on the head. It makes me look extremely professional – without typing a single minute."`}
              </TestimonialText>
              <TestimonialAuthor>T. B. · {lang === 'de' ? 'SEO-Consultant · 9 Kunden · Hamburg' : 'SEO Consultant · 9 clients · Hamburg'}</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialStars>★★★★★</TestimonialStars>
              <TestimonialText>
                {lang === 'de'
                  ? `"Ich war skeptisch, ob eine KI meine Analysen wirklich ersetzen kann. Aber der Algorithmus erkennt Trends, die ich beim manuellen Drüberschauen glatt übersehen hätte. Es ist kein stumpfes Tool, sondern eher wie ein kleiner, sehr smarter Junior-Berater, der nie schläft und keine Tippfehler macht. Die Einrichtung war in der Kaffeepause erledigt."`
                  : `"I was skeptical whether an AI could really replace my analysis. But the algorithm catches trends I would have glossed over manually. It's not a dumb tool – it's more like a very smart junior consultant who never sleeps and never makes typos. Setup was done before my coffee got cold."`}
              </TestimonialText>
              <TestimonialAuthor>J. K. · {lang === 'de' ? 'Online-Marketing-Agentur · Berlin' : 'Online Marketing Agency · Berlin'}</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialStars>★★★★★</TestimonialStars>
              <TestimonialText>
                {lang === 'de'
                  ? `"Unser Problem war nicht das SEO, sondern die Skalierbarkeit. Ab dem zehnten Kunden wurde das Reporting zum Flaschenhals. RankBrief hat diesen Prozess komplett entkoppelt. Wir konnten unser Portfolio in drei Monaten verdoppeln, ohne neues Personal für die Verwaltung einstellen zu müssen. Das Tool refinanziert sich allein durch die gewonnene Kapazität."`
                  : `"Our problem wasn't the SEO – it was scalability. From the tenth client onwards, reporting became the bottleneck. RankBrief completely decoupled that process. We doubled our portfolio in three months without hiring anyone new for admin. The tool pays for itself through the capacity it frees up."`}
              </TestimonialText>
              <TestimonialAuthor>P. W. · {lang === 'de' ? 'Digitalagentur, 14 Kunden · München' : 'Digital Agency, 14 clients · Munich'}</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialStars>★★★★★</TestimonialStars>
              <TestimonialText>
                {lang === 'de'
                  ? `"Vergessen Sie Data Studio Gebastel. Ich habe Jahre damit verbracht, Dashboards zu bauen, die am Ende doch niemand gelesen hat. RankBrief ist das erste Tool, bei dem meine Kunden tatsächlich auf die Reports antworten, weil die Insights so greifbar sind. Kein Schnicksack, nur Ergebnisse."`
                  : `"Forget the Data Studio tinkering. I spent years building dashboards that nobody actually read. RankBrief is the first tool where my clients reply to the reports – because the insights are so tangible. No fluff, just results."`}
              </TestimonialText>
              <TestimonialAuthor>L. R. · {lang === 'de' ? 'SEO-Consultant · 11 Kunden · Frankfurt' : 'SEO Consultant · 11 clients · Frankfurt'}</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialStars>★★★★★</TestimonialStars>
              <TestimonialText>
                {lang === 'de'
                  ? `"Reporting war mein Endgegner. Jetzt ist es ein Autopilot. Einmal aufgesetzt, läuft das Ding einfach. Die Kunden sind glücklich, mein Kopf ist frei für die eigentliche Strategie. Wer noch manuell Reports baut, bestraft sich selbst."`
                  : `"Reporting was my final boss. Now it's on autopilot. Set it up once, it just runs. Clients are happy, my head is free for actual strategy. Anyone still building reports manually is punishing themselves."`}
              </TestimonialText>
              <TestimonialAuthor>A. F. · {lang === 'de' ? 'Freelance SEO · 8 Kunden · Köln' : 'Freelance SEO · 8 clients · Cologne'}</TestimonialAuthor>
            </TestimonialCard>

          </TestimonialGrid>
          <StatsRow>
            <StatItem>
              <StatNumber>8–12h</StatNumber>
              <StatLabel2>{lang === 'de' ? 'Zeitersparnis pro Monat' : 'saved per month'}</StatLabel2>
            </StatItem>
            <StatItem>
              <StatNumber>0</StatNumber>
              <StatLabel2>{lang === 'de' ? 'Manuelle Schritte nach Setup' : 'manual steps after setup'}</StatLabel2>
            </StatItem>
            <StatItem>
              <StatNumber>1.</StatNumber>
              <StatLabel2>{lang === 'de' ? 'Automatisch geliefert — jeden Monat' : 'Delivered automatically, every month'}</StatLabel2>
            </StatItem>
            <StatItem>
              <StatNumber>€0</StatNumber>
              <StatLabel2>{lang === 'de' ? 'Für den ersten Report' : 'For the first report'}</StatLabel2>
            </StatItem>
          </StatsRow>
        </SocialProofInner>
      </SocialProofSection>

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
            <FeatureCardMobile key={f.title}>
              <FeatureIcon>{f.icon}</FeatureIcon>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureText>{f.text}</FeatureText>
            </FeatureCardMobile>
          ))}
        </FeaturesGrid>
        <ScrollHint className="mobile-only">← {lang === 'de' ? 'Wischen zum Erkunden' : 'Swipe to explore'} →</ScrollHint>
      </Section>

      {/* SAMPLE REPORT */}
      <Section>
        <SectionLabel>{t.sampleLabel}</SectionLabel>
        <SectionTitle>{t.sampleTitle}</SectionTitle>
        <SectionSub>{t.sampleSub}</SectionSub>
        <SampleSingleWrap>
          <SampleSingleBtn onClick={() => {
            if (isMobile) {
              const a = document.createElement('a');
              a.href = t.sampleFile;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.click();
            } else {
              trackEvent('sample_pdf_open', { plan: 'pro' });
              setSampleOpen({ plan: 'Pro', icon: '📄', file: t.sampleFile });
            }
          }}>
            <SampleSingleIcon>📄</SampleSingleIcon>
            <SampleSingleText>
              <SampleSingleTitle>{t.sampleCta}</SampleSingleTitle>
              <SampleSingleSub>naturkosmetik-shop.de · {lang === 'de' ? 'März 2026' : 'March 2026'} · Pro Plan</SampleSingleSub>
            </SampleSingleText>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="#6C63FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SampleSingleBtn>
        </SampleSingleWrap>
        <SampleHint>💡 {t.sampleHint}</SampleHint>
      </Section>

      {/* LIGHTBOX */}
      {sampleOpen && (
        <Overlay onClick={() => setSampleOpen(null)}>
          <LightboxWrap onClick={e => e.stopPropagation()}>
            <LightboxHeader>
              <LightboxTitle>
                <span>{sampleOpen.icon}</span>
                <span>{t.sampleLabel} · {sampleOpen.plan}</span>
              </LightboxTitle>
              <LightboxActions>
                <LightboxDownloadBtn
                  onClick={() => downloadSamplePdf(sampleOpen)}
                >
                  {lang === 'de' ? '↓ Als PDF herunterladen' : '↓ Download as PDF'}
                </LightboxDownloadBtn>
                <LightboxClose onClick={() => setSampleOpen(null)} aria-label={t.sampleClose}>✕</LightboxClose>
              </LightboxActions>
            </LightboxHeader>
            <LightboxFrame>
              <LightboxFallback>
                <LightboxFallbackIcon>📄</LightboxFallbackIcon>
                <LightboxFallbackTitle>
                  {lang === 'de' ? 'PDF-Vorschau im Browser öffnen' : 'Open PDF preview in browser'}
                </LightboxFallbackTitle>
                <LightboxFallbackSub>
                  {lang === 'de'
                    ? 'Der Report öffnet sich in einem neuen Tab. Du siehst genau, was deine Kunden erhalten.'
                    : 'The report opens in a new tab. See exactly what your clients receive.'}
                </LightboxFallbackSub>
                <LightboxOpenBtn href={sampleOpen.file} target="_blank" rel="noopener noreferrer">
                  {lang === 'de' ? '↗ Report öffnen' : '↗ Open report'}
                </LightboxOpenBtn>
              </LightboxFallback>
            </LightboxFrame>
          </LightboxWrap>
        </Overlay>
      )}

      {/* PRICING */}
      <Section id="pricing">
        <SectionLabel>{t.pricingLabel}</SectionLabel>
        <SectionTitle>{t.pricingTitle.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}</SectionTitle>
        <SectionSub>{t.pricingSub}</SectionSub>

        {(() => {
          const isDE = lang === 'de';
          // Price calculation
          const tierPrices = { 1:19, 4:43, 6:49, 11:69, 16:99, 21:119 };
          const basePrice = tierPrices[configProps] || 19;
          const total = basePrice + (configWL ? 5 : 0);

          // Build register URL from selected tier
          const tierAddons = {
            1: [], 4: ['prop_3'], 6: ['prop_5'], 11: ['prop_10'],
            16: ['prop_10','prop_5'], 21: ['prop_10','prop_10']
          };
          const buildUrl = () => {
            const pkgs = [...(tierAddons[configProps] || [])];
            if (configWL) pkgs.push('whitelabel');
            return `/register?addons=${pkgs.join(',')}&props=${configProps}`;
          };

          const features = isDE ? [
            { title: 'Vollständiger 6-Seiten Strategie-Report', desc: 'Keine Lücken mehr – du erhältst sofort den vollen Einblick inkl. KI-Analyse.' },
            { title: 'KI-Radar: Findet deine Goldgruben', desc: 'Die KI sortiert deine Keywords automatisch in Revier, Angriff und Potenzial.' },
            { title: 'Echte Business-Insights (GA4)', desc: 'Wir zeigen dir nicht nur Rankings, sondern Klicks, Engagement und echten Impact.' },
            { title: 'Konkrete Tasks statt Rätselraten', desc: 'Du bekommst klare Prioritäten für die nächsten 30 Tage – direkt umsetzbar.' },
            { title: 'Vollautomatisch & Pünktlich', desc: 'Am 1. des Monats landet der Report in deinem Postfach. Einmal einrichten, fertig.' },
            { title: 'White-Label Option (+€5)', desc: 'Entferne unser Branding und nutze dein eigenes Logo für alle Reports im Account.' },
          ] : [
            { title: 'Complete 6-page strategy report', desc: 'No gaps — you get full insight immediately, including AI analysis.' },
            { title: 'AI radar: finds your goldmines', desc: 'AI automatically sorts your keywords into territory, attack and potential.' },
            { title: 'Real business insights (GA4)', desc: "We don't just show rankings — clicks, engagement and real impact." },
            { title: 'Concrete tasks, not guesswork', desc: 'Clear priorities for the next 30 days — ready to act on immediately.' },
            { title: 'Fully automated & on time', desc: 'Report lands in your inbox on the 1st. Set up once, done forever.' },
            { title: 'White-label option (+€5)', desc: 'Remove our branding and use your own logo for all reports in your account.' },
          ];

          return (
            <ConfigWrap>
              {/* LEFT: What you always get */}
              <ConfigLeft>
                <ConfigTitle>{isDE ? 'Der ultimative SEO-Report. Für jede Webseite.' : 'The ultimate SEO report. For every website.'}</ConfigTitle>
                <div style={{ display:'flex', alignItems:'baseline', gap:6, margin:'1rem 0 0.25rem' }}>
                  <ConfigPrice style={{margin:0}}>€19<span>{isDE ? ' /Monat' : ' /month'}</span></ConfigPrice>
                </div>
                <div style={{ fontSize:'0.75rem', opacity:0.7, marginBottom:'1.25rem', lineHeight:1.4 }}>
                  {isDE ? '1 Property inklusive · Alle Features freigeschaltet.' : '1 property included · All features unlocked.'}
                </div>
                <ConfigFeatureList>
                  {features.map(f => (
                    <ConfigFeature key={f.title}>
                      <div>
                        <div style={{fontWeight:700, marginBottom:2}}>{f.title}</div>
                        <div style={{opacity:0.72, fontSize:'0.78rem', lineHeight:1.45}}>{f.desc}</div>
                      </div>
                    </ConfigFeature>
                  ))}
                </ConfigFeatureList>
              </ConfigLeft>

              {/* RIGHT: Configurator */}
              <ConfigRight>
                <SliderWrap>
                  <ConfigLabel>{isDE ? 'Wie viele Webseiten betreust du?' : 'How many websites do you manage?'}</ConfigLabel>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:8 }}>
                    {[
                      { props:1,  price:19,  addons:[],                     label:isDE?'1 Webseite':'1 website',         sub:isDE?'Perfekt zum Starten':'Perfect to start' },
                      { props:4,  price:43,  addons:['prop_3'],              label:isDE?'4 Webseiten':'4 websites',       sub:isDE?'Basis + 3er Paket':'Base + 3 pack' },
                      { props:6,  price:49,  addons:['prop_5'],              label:isDE?'6 Webseiten':'6 websites',       sub:isDE?'Basis + 5er Paket':'Base + 5 pack' },
                      { props:11, price:69,  addons:['prop_10'],             label:isDE?'11 Webseiten':'11 websites',     sub:isDE?'Basis + 10er Paket':'Base + 10 pack' },
                      { props:16, price:99,  addons:['prop_10','prop_5'],    label:isDE?'16 Webseiten':'16 websites',     sub:isDE?'Basis + 10er + 5er':'Base + 10 + 5 pack' },
                      { props:21, price:119, addons:['prop_10','prop_10'],   label:isDE?'21 Webseiten':'21 websites',     sub:isDE?'Basis + 2x 10er Paket':'Base + 2x 10 pack' },
                    ].map(tier => {
                      const selected = configProps === tier.props;
                      const pppTier = (tier.price / tier.props).toFixed(2);
                      return (
                        <div key={tier.props} onClick={() => setConfigProps(tier.props)}
                          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, border: selected ? '2px solid #6C63FF' : '1px solid rgba(0,0,0,0.1)', background: selected ? 'rgba(108,99,255,0.06)' : 'transparent', cursor:'pointer', transition:'all 0.15s' }}>
                          <div>
                            <div style={{ fontWeight:700, fontSize:'0.88rem', color: selected?'#6C63FF':'inherit' }}>{tier.label}</div>
                            <div style={{ fontSize:'0.70rem', color:'#888', marginTop:1 }}>{tier.sub}</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontWeight:800, fontSize:'1rem', color: selected?'#6C63FF':'inherit' }}>€{tier.price}<span style={{ fontWeight:400, fontSize:'0.72rem', color:'#888' }}>/mo</span></div>
                            <div style={{ fontSize:'0.65rem', color:'#10B981', fontWeight:600 }}>€{pppTier}/{isDE?'Seite':'site'}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SliderWrap>

                <WLToggleRow onClick={() => setConfigWL(w => !w)}>
                  <WLToggleInfo>
                    <WLToggleName>
                      {isDE ? 'Professionelles Branding' : 'Professional branding'}
                      <span style={{ marginLeft:8, fontSize:'0.72rem', fontWeight:600, color:'#6C63FF' }}>+ €5</span>
                    </WLToggleName>
                    <WLToggleSub>
                      {isDE ? 'Eigenes Logo, kein RankBrief-Branding in Reports' : 'Your logo, no RankBrief branding in reports'}
                    </WLToggleSub>
                  </WLToggleInfo>
                  <ToggleSwitch $on={configWL} />
                </WLToggleRow>

                <ConfigTotal>
                  <ConfigTotalPrice>€{total}<span>{isDE ? ' / Monat' : ' / month'}</span></ConfigTotalPrice>
                  <ConfigTotalSub>
                    {isDE
                      ? `${configProps} ${configProps === 1 ? 'Property' : 'Properties'} · Voller Report · ${configWL ? 'White-Label inklusive' : 'RankBrief-Branding'}`
                      : `${configProps} ${configProps === 1 ? 'property' : 'properties'} · Full report · ${configWL ? 'White-label included' : 'RankBrief branding'}`}
                  </ConfigTotalSub>
                  <ConfigCTA to={buildUrl()}>
                    {isDE ? 'Ersten Report kostenlos →' : 'Get your first report free →'}
                  </ConfigCTA>
                  <ConfigTrust>
                    {isDE
                      ? 'Erster Report kostenlos · Kein Abo · Keine Kreditkarte erforderlich'
                      : 'First report free · No subscription · No credit card required'}
                  </ConfigTrust>
                </ConfigTotal>
              </ConfigRight>
            </ConfigWrap>
          );
        })()}
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
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            {t.ctaTitle}
          </h2>
          <p style={{ color: '#52526E', fontSize: '1.0625rem', marginBottom: '2rem', fontWeight: 300 }}>
            {t.ctaSub}
          </p>
          <BtnPrimary to="/register" onClick={() => trackEvent('cta_click', { button: 'bottom_register', lang })}>{t.ctaBtn}</BtnPrimary>
        </div>
      </Section>
    </Page>
  );
}
