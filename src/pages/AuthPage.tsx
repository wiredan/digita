import { MainLayout } from '@/components/layout/MainLayout';
export function AuthPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <h1 className="text-4xl font-bold font-display">Authentication Page</h1>
          <p className="mt-4 text-lg text-muted-foreground">Login and Registration forms will be here.</p>
        </div>
      </div>
    </MainLayout>
  );
}