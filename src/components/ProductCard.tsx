import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Product } from '@shared/types';
import { Button } from './ui/button';
interface ProductCardProps {
  product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="p-0">
          <Link to={`/product/${product.id}`}>
            <AspectRatio ratio={4 / 3}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </Link>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <CardTitle className="mt-1 text-lg font-semibold leading-tight">
            <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
              {product.name}
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">by {product.sellerName}</p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <Button size="sm" asChild>
            <Link to={`/product/${product.id}`}>View</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}