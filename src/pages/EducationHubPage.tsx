import { MainLayout } from '@/components/layout/MainLayout';
import { MOCK_EDUCATION_CONTENT } from '@/lib/constants';
import { EducationCard } from '@/components/EducationCard';
export function EducationHubPage() {
  return (
    <MainLayout>
      <section className="bg-secondary py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-primary tracking-tight">
            Verdant Education Hub
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Your source for knowledge in modern agribusiness. Explore articles, best practices, and market insights to help you grow.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <h2 className="text-3xl font-bold font-display text-foreground mb-12 text-center md:text-left">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_EDUCATION_CONTENT.map((article) => (
              <EducationCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}