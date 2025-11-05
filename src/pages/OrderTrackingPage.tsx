import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, CheckCircle, Home, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@shared/types';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
export function OrderTrackingPage() {
  const { orderId } = useParams();
  const user = useUserStore((s) => s.user);
  const localOrder = useUserStore((s) => s.orders.find((o) => o.id === orderId));
  const [order, setOrder] = useState<Order | null | undefined>(localOrder);
  const [isLoading, setIsLoading] = useState(!localOrder);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!localOrder && orderId) {
      const fetchOrder = async () => {
        try {
          setIsLoading(true);
          const data = await api<Order>(`/api/orders/${orderId}`);
          setOrder(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch order details.');
          setOrder(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, localOrder]);
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }
  if (error || !order) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 text-center">
            <h1 className="text-4xl font-bold font-display">Order Not Found</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {error || "We couldn't find the order you're looking for."}
            </p>
            <Button asChild className="mt-8">
              <Link to="/profile">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  const progressStatuses = ['placed', 'shipped', 'delivered'] as const;
  const currentStatusIndex = progressStatuses.indexOf(order.status as typeof progressStatuses[number]);
  const statusMap = [
    { name: 'Placed', icon: <Package className="h-6 w-6" />, date: order.date },
    { name: 'Shipped', icon: <Truck className="h-6 w-6" />, date: order.trackingNumber ? new Date(new Date(order.date).getTime() + 86400000).toISOString() : null },
    { name: 'Delivered', icon: <CheckCircle className="h-6 w-6" />, date: order.status === 'delivered' ? new Date(new Date(order.date).getTime() + 3 * 86400000).toISOString() : null },
  ];
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <header className="mb-12">
            <h1 className="text-4xl font-bold font-display text-foreground">Order Tracking</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Tracking for order <span className="font-semibold text-primary">{order.orderNumber}</span>
            </p>
          </header>
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>
                Placed on {format(new Date(order.date), 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative my-8">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -translate-y-1/2" />
                <div className="absolute left-0 top-1/2 h-0.5 bg-primary -translate-y-1/2" style={{ width: `${(currentStatusIndex / (progressStatuses.length - 1)) * 100}%` }} />
                <div className="relative flex justify-between">
                  {statusMap.map((status, index) => (
                    <div key={status.name} className="flex flex-col items-center text-center w-24">
                      <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background z-10",
                        index <= currentStatusIndex ? "border-primary text-primary" : "border-border text-muted-foreground"
                      )}>
                        {status.icon}
                      </div>
                      <p className={cn("mt-2 text-sm font-medium", index <= currentStatusIndex ? "text-foreground" : "text-muted-foreground")}>
                        {status.name}
                      </p>
                      {status.date && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(status.date), 'MMM d')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-8" />
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Product Details</h3>
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: 1</p>
                          <p className="text-sm font-semibold text-primary">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <Home className="h-6 w-6 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        123 Verdant Lane<br />
                        Farmville, AG 54321<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}