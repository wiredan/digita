import { useUserStore } from '@/stores/userStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function Cart({ open, onOpenChange }: CartProps) {
  const cart = useUserStore(s => s.cart);
  const removeFromCart = useUserStore(s => s.removeFromCart);
  const subtotal = cart.reduce((acc, product) => acc + product.price, 0);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cart.length})</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6 py-4">
                {cart.map((product, index) => (
                  <div key={`${product.id}-${index}`}>
                    <div className="flex items-start justify-between py-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add items to your cart to see them here.</p>
            <SheetClose asChild>
              <Button asChild className="mt-6">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}