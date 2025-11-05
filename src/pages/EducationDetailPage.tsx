import { MainLayout } from '@/components/layout/MainLayout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_EDUCATION_CONTENT } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowLeft, User, Calendar } from 'lucide-react';
export function EducationDetailPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = MOCK_EDUCATION_CONTENT.find((a) => a.id === articleId);
  if (!article) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 text-center">
            <h1 className="text-4xl font-bold font-display">Article Not Found</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We couldn't find the article you're looking for.
            </p>
            <Button asChild className="mt-8">
              <Link to="/education">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Education Hub
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Education Hub
          </Button>
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
        </div>
      </div>
    </MainLayout>
  );
}