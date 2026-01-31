import Image from 'next/image';
import { Trash2, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/types';
import { QuantityControl } from './QuantityControl';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onConfirmOrder: () => void;
  isAfterOrderHours: boolean;
}

export function OrderConfirmation({
  isOpen,
  onClose,
  cart,
  subtotal,
  deliveryCharge,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmOrder,
  isAfterOrderHours,
}: OrderConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">Confirm Your Order</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] px-6">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} / {item.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <QuantityControl quantity={item.quantity} onUpdateQuantity={(q) => onUpdateQuantity(item.id, q)} size="sm" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-6 space-y-3">
          <Separator />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Delivery Charge</span>
            <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground pt-2 italic">
            *Please send:*<br/>1. Full delivery address<br/>2. Live Google Maps location
          </p>
        </div>

        {isAfterOrderHours && (
            <div className="px-6">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>After-hours Order</AlertTitle>
                    <AlertDescription>
                    Your order will be delivered tomorrow morning.
                    </AlertDescription>
                </Alert>
            </div>
        )}

        <DialogFooter className="p-6 bg-secondary/50 flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={onConfirmOrder}>
            Confirm & Order on WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
