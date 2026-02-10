import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { AppShell } from './components/layout/AppShell';
import { HeroSection } from './components/HeroSection';
import { ProfileSetupDialog } from './features/profile/ProfileSetupDialog';
import { MainContent } from './components/MainContent';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  // Show profile setup dialog only when authenticated, profile is fetched, and no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppShell>
        <HeroSection />
        <MainContent />
        {showProfileSetup && <ProfileSetupDialog />}
        <Toaster />
      </AppShell>
    </ThemeProvider>
  );
}
