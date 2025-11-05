import { MainLayout } from '@/components/layout/MainLayout';
export function KycPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <h1 className="text-4xl font-bold font-display">KYC Verification</h1>
          <p className="mt-4 text-lg text-muted-foreground">The multi-step KYC process will be here.</p>
        </div>
      </div>
    </MainLayout>
  );
}