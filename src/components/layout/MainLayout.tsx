import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DANAIChat } from '../DANAIChat';
interface MainLayoutProps {
  children: React.ReactNode;
}
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <DANAIChat />
    </div>
  );
}