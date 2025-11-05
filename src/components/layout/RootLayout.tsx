import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
export function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}