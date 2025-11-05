import { Outlet } from 'react-router-dom';

import { DANAIChat } from '@/components/DANAIChat';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
      <DANAIChat />
    </div>
  );
}