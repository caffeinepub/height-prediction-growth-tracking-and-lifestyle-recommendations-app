import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { AppShell } from './layout/AppShell';
import { HeroSection } from './HeroSection';
import { ProfileSetupDialog } from '../features/profile/ProfileSetupDialog';
import { MainContent } from './MainContent';

export function NormalApp() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  // Show profile setup dialog only when authenticated, profile is fetched, and no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AppShell>
      <HeroSection />
      <MainContent />
      {showProfileSetup && <ProfileSetupDialog />}
    </AppShell>
  );
}
