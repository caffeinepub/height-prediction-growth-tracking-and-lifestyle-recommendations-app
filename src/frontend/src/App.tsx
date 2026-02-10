import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { isMaintenanceMode } from './config/maintenance';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { NormalApp } from './components/NormalApp';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {isMaintenanceMode ? (
        <MaintenanceScreen />
      ) : (
        <>
          <NormalApp />
          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}
