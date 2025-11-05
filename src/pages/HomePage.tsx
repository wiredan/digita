import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await api<Product[]>('/api/products');
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-secondary py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-4xl md:text-6xl font-extrabold font-display text-primary tracking-tight">
            DECENTRALIZED AGRIBUSINESS NETWORK
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            A full-stack agribusiness marketplace that allows farmers and agribusiness participants to trade crops, manage orders, interact with AI, and handle payments securely.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base">
              Start Exploring
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Become a Seller
            </Button>
          </div>
        </div>
      </section>
      {/* Marketplace Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground">Fresh on the Market</h2>
            <div className="relative w-full max-w-sm">
              <Input placeholder="Search for products..." className="pr-10" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}