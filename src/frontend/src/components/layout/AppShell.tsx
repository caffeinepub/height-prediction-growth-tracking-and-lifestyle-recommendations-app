import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
