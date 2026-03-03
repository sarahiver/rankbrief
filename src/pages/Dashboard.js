import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserEmail = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: 600px) { display: none; }
`;

const BtnSignOut = styled.button`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textDim};
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;

const Main = styled.main`
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
  animation: ${fadeUp} 0.4s ease both;
`;

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(99,207,255,0.05) 100%);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2.5rem;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`;

const WelcomeSub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9375rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
`;

const BtnConnect = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(108,99,255,0.4);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
`;

const CardIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9375rem;
  margin-bottom: 0.375rem;
  letter-spacing: -0.02em;
`;

const CardText = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  font-weight: 300;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(251,191,36,0.1);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 100px;
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  color: #FBBF24;
  font-weight: 500;
  margin-bottom: 1.5rem;

  &::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #FBBF24;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 3rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
`;

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleConnectGoogle = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = 'https://ubexqxxkqjzhsgidsseh.supabase.co/functions/v1/google-oauth-callback';
    const SCOPES = [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
    ].join(' ');

    const state = encodeURIComponent(`${user.id}|Meine Website|`);

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    window.location.href = authUrl.toString();
  };

  return (
    <Layout>
      <TopBar>
        <Logo to="/"><LogoDot />Rank<span>Brief</span></Logo>
        <TopBarRight>
          <UserEmail>{user?.email}</UserEmail>
          <BtnSignOut onClick={handleSignOut}>Sign out</BtnSignOut>
        </TopBarRight>
      </TopBar>

      <Main>
        <StatusBadge>Setup in progress</StatusBadge>

        <WelcomeBanner>
          <WelcomeTitle>Welcome to RankBrief 👋</WelcomeTitle>
          <WelcomeSub>
            You're in. The next step is connecting your Google Search Console so we can start generating your automated monthly reports.
          </WelcomeSub>
          <BtnConnect onClick={handleConnectGoogle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Connect Google Search Console
          </BtnConnect>
        </WelcomeBanner>

        <Grid>
          <Card>
            <CardIcon>📊</CardIcon>
            <CardTitle>Monthly Reports</CardTitle>
            <CardText>Automated PDF reports delivered on the 1st of every month.</CardText>
          </Card>
          <Card>
            <CardIcon>🤖</CardIcon>
            <CardTitle>AI Summaries</CardTitle>
            <CardText>Plain-language insights generated by Claude for every report.</CardText>
          </Card>
          <Card>
            <CardIcon>🏷️</CardIcon>
            <CardTitle>White-Label</CardTitle>
            <CardText>Add your logo and brand. Available on Pro and Agency plans.</CardText>
          </Card>
        </Grid>

        <SectionTitle>Your Reports</SectionTitle>
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyTitle>No reports yet</EmptyTitle>
          <EmptyText>Connect your Google Search Console to start receiving automated monthly reports.</EmptyText>
        </EmptyState>
      </Main>
    </Layout>
  );
}
