import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EducationCard } from '@/components/EducationCard';
import { api } from '@/lib/api-client';
import type { EducationContent } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
export function EducationHubPage() {
  const [articles, setArticles] = useState<EducationContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const data = await api<EducationContent[]>('/api/education');
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);
  return (
    <MainLayout>
      <section className="bg-secondary py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-primary tracking-tight">
            DAN Education Hub
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <EducationCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}