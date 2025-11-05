import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ShoppingCart, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import type { Product } from '@shared/types';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const placeOrder = useUserStore((s) => s.placeOrder);
  const addToCart = useUserStore((s) => s.addToCart);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await api<Product>(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to your cart.', {
        action: { label: 'Log In', onClick: () => navigate('/auth') },
      });
      return;
    }
    if (user.kycStatus !== 'verified') {
      toast.error('Please complete KYC verification to trade.', {
        action: { label: 'Verify Now', onClick: () => navigate('/kyc') },
      });
      return;
    }
    if (!product) return;
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };
  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please log in to make a purchase.', {
        action: { label: 'Log In', onClick: () => navigate('/auth') },
      });
      return;
    }
    if (user.kycStatus !== 'verified') {
      toast.error('Please complete KYC verification to trade.', {
        action: { label: 'Verify Now', onClick: () => navigate('/kyc') },
      });
      return;
    }
    if (!product) return;
    try {
      const newOrder = await placeOrder([product], product.price);
      toast.success(`Purchase successful for ${product.name}!`, {
        description: 'Redirecting to your order details...',
      });
      setTimeout(() => {
        navigate(`/order/${newOrder.id}`);
      }, 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place order.");
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>
      );
    }
    if (error || !product) {
      return (
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display">Product Not Found</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {error || "We couldn't find the product you're looking for."}
          </p>
          <Button asChild className="mt-8">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="w-full">
          <AspectRatio ratio={1} className="bg-muted rounded-lg overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
          </AspectRatio>
        </div>
        <div className="space-y-6">
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold font-display text-foreground">{product.name}</h1>
          <p className="text-lg text-muted-foreground">
            Sold by <span className="font-semibold text-primary">{product.sellerName}</span>
          </p>
          <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleBuyNow}>
              <ShieldCheck className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
          {renderContent()}
        </div>
      </div>
      <Toaster richColors />
    </>
  );
}