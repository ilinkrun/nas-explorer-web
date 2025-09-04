import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import AppHeader from './AppHeader';
import NavigationSidebar from './NavigationSidebar';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex h-[calc(100vh-4rem)]">
        <NavigationSidebar />
        <main className={cn('flex-1 overflow-hidden', className)}>
          <div className="h-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}