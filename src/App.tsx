import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { DANAIChat } from './components/DANAIChat';
import { router } from './main';
import { useAppStore } from './stores/appStore';
export function App() {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  return (
    <>
      <RouterProvider router={router} />
      <DANAIChat />
    </>
  );
}