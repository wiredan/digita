import { MainLayout } from '@/components/layout/MainLayout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ShoppingCart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import type { Order } from '@shared/types';
export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const addOrder = useUserStore((s) => s.addOrder);
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please log in to make a purchase.', {
        action: {
          label: 'Log In',
          onClick: () => navigate('/auth'),
        },
      });
      return;
    }
    if (user.kycStatus !== 'verified') {
      toast.error('Please complete KYC verification to trade.', {
        action: {
          label: 'Verify Now',
          onClick: () => navigate('/kyc'),
        },
      });
      return;
    }
    if (!product) return;
    // Create a new mock order
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNumber: `VD-${Math.floor(Math.random() * 900000) + 100000}`,
      product: product,
      buyerId: user.id,
      status: 'placed',
      date: new Date().toISOString(),
    };
    addOrder(newOrder);
    toast.success(`Purchase successful for ${product.name}!`, {
      description: 'Redirecting to your order details...',
    });
    setTimeout(() => {
      navigate(`/order/${newOrder.id}`);
    }, 1500);
  };
  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 text-center">
            <h1 className="text-4xl font-bold font-display">Product Not Found</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We couldn't find the product you're looking for.
            </p>
            <Button asChild className="mt-8">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="w-full">
              <AspectRatio ratio={1} className="bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            <div className="space-y-6">
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold font-display text-foreground">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Sold by <span className="font-semibold text-primary">{product.sellerName}</span>
              </p>
              <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="w-full sm:w-auto" onClick={handleBuyNow}>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </MainLayout>
  );
}