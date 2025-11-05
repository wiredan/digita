import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowLeft, User, Calendar, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { EducationContent } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
export function EducationDetailPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<EducationContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!articleId) return;
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const data = await api<EducationContent>(`/api/education/${articleId}`);
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-8">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="w-full aspect-video rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      );
    }
    if (error || !article) {
      return (
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display">Article Not Found</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {error || "We couldn't find the article you're looking for."}
          </p>
          <Button asChild className="mt-8">
            <Link to="/education">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Education Hub
            </Link>
          </Button>
        </div>
      );
    }
    return (
      <article>
        <header className="space-y-4">
          <Badge variant="secondary">{article.category}</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
          </div>
        </header>
        <div className="my-8">
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-p:leading-relaxed">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-lg text-foreground/80 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    );
  };
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Education Hub
          </Button>
          {renderContent()}
        </div>
      </div>
    </MainLayout>
  );
}