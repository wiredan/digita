import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import type { EducationContent } from '@shared/types';
interface EducationCardProps {
  article: EducationContent;
}
export function EducationCard({ article }: EducationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Link to={`/education/${article.id}`} className="block h-full">
        <Card className="overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
          <CardHeader className="p-0">
            <AspectRatio ratio={16 / 9}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </CardHeader>
          <CardContent className="p-6 flex-grow flex flex-col">
            <Badge variant="secondary" className="w-fit">{article.category}</Badge>
            <h3 className="mt-4 text-xl font-bold font-display leading-tight text-foreground">
              {article.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground flex-grow">
              {article.excerpt}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {article.author} • {article.date}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}