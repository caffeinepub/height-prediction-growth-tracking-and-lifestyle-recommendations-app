import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Ruler, LogOut, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Logged out successfully');
    } else {
      try {
        await login();
        toast.success('Logged in successfully');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="h-6 w-6 text-chart-1" />
          <span className="font-bold text-lg">GrowthTracker</span>
        </div>

        <Button
          onClick={handleAuth}
          disabled={disabled}
          variant={isAuthenticated ? 'outline' : 'default'}
          size="sm"
        >
          {loginStatus === 'logging-in' ? (
            'Logging in...'
          ) : isAuthenticated ? (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
