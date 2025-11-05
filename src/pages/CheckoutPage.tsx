import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useUserStore } from '@/stores/userStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';
import type { Order } from '@shared/types';
const shippingSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP code is required"),
});
const paymentSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvc: z.string().length(3, "CVC must be 3 digits"),
});
type Step = 'shipping' | 'payment' | 'review' | 'confirmation';
export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const cart = useUserStore(s => s.cart);
  const addOrder = useUserStore(s => s.addOrder);
  const clearCart = useUserStore(s => s.clearCart);
  const [step, setStep] = useState<Step>('shipping');
  const shippingForm = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { address: "123 Verdant Lane", city: "Farmville", zip: "54321" },
  });
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { cardNumber: "", expiry: "", cvc: "" },
  });
  if (!user) return <Navigate to="/auth" replace />;
  if (cart.length === 0 && step !== 'confirmation') return <Navigate to="/" replace />;
  const subtotal = cart.reduce((acc, p) => acc + p.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const handlePlaceOrder = () => {
    cart.forEach(product => {
      const newOrder: Order = {
        id: `order_${Date.now()}_${product.id}`,
        orderNumber: `VD-${Math.floor(Math.random() * 900000) + 100000}`,
        product,
        buyerId: user!.id,
        status: 'placed',
        date: new Date().toISOString(),
      };
      addOrder(newOrder);
    });
    clearCart();
    setStep('confirmation');
    toast.success("Order placed successfully!");
  };
  const renderStep = () => {
    switch (step) {
      case 'shipping':
        return (
          <Form {...shippingForm}>
            <form onSubmit={shippingForm.handleSubmit(() => setStep('payment'))} className="space-y-6">
              <FormField name="address" control={shippingForm.control} render={({ field }) => (
                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField name="city" control={shippingForm.control} render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="zip" control={shippingForm.control} render={({ field }) => (
                  <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" className="w-full">Continue to Payment</Button>
            </form>
          </Form>
        );
      case 'payment':
        return (
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(() => setStep('review'))} className="space-y-6">
              <FormField name="cardNumber" control={paymentForm.control} render={({ field }) => (
                <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField name="expiry" control={paymentForm.control} render={({ field }) => (
                  <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="cvc" control={paymentForm.control} render={({ field }) => (
                  <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="•••" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('shipping')}>Back</Button>
                <Button type="submit">Continue to Review</Button>
              </div>
            </form>
          </Form>
        );
      case 'review':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Shipping Address</h4>
              <p className="text-sm text-muted-foreground">{shippingForm.getValues('address')}, {shippingForm.getValues('city')}, {shippingForm.getValues('zip')}</p>
            </div>
            <div>
              <h4 className="font-semibold">Payment Method</h4>
              <p className="text-sm text-muted-foreground">Card ending in •••• {paymentForm.getValues('cardNumber').slice(-4)}</p>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('payment')}>Back</Button>
              <Button onClick={handlePlaceOrder}>Place Order</Button>
            </div>
          </div>
        );
      case 'confirmation':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Thank you for your order!</h2>
            <p className="text-muted-foreground mt-2">Your order has been placed and you will receive a confirmation email shortly.</p>
            <Button className="mt-6" onClick={() => navigate('/profile')}>View My Orders</Button>
          </div>
        );
    }
  };
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold font-display text-foreground">Checkout</h1>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{step} Information</CardTitle>
                  <CardDescription>
                    {step === 'review' ? 'Please review your order details before placing.' : 'Please fill out the details below.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderStep()}</CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((p, i) => (
                    <div key={`${p.id}-${i}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{p.name}</span>
                      <span>${p.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </MainLayout>
  );
}