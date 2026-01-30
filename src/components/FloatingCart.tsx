import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingCartProps {
  totalItems: number;
  total: number;
  onCheckout: () => void;
  isWithinOrderHours: boolean;
  isAfterOrderHours: boolean;
}

export function FloatingCart({
  totalItems,
  total,
  onCheckout,
  isWithinOrderHours,
  isAfterOrderHours,
}: FloatingCartProps) {
  if (totalItems === 0) {
    return null;
  }

  let buttonText = 'Proceed to Checkout';
  let buttonDisabled = false;
  if (!isWithinOrderHours && !isAfterOrderHours) {
    buttonText = "We're currently closed";
    buttonDisabled = true;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
      <div className="container mx-auto max-w-lg">
        <Button
          onClick={onCheckout}
          disabled={buttonDisabled}
          className="w-full h-auto rounded-2xl text-lg shadow-2xl shadow-primary/30 py-3"
        >
          {buttonDisabled ? (
            <span>{buttonText}</span>
          ) : (
            <div className="w-full flex flex-col items-center gap-1">
              <div className="w-full flex items-center justify-between">
                  <div className="flex items-center">
                      <div className="relative mr-3">
                          <ShoppingCart className="w-6 h-6" />
                          <span className="absolute -top-2 -right-2 bg-background text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {totalItems}
                          </span>
                      </div>
                      <span>View Cart</span>
                  </div>
                  <div className="flex items-center">
                      <span>₹{total.toFixed(2)}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
              </div>
              {isAfterOrderHours && (
                <span className="text-xs font-normal text-primary-foreground/90">
                  Your order will be delivered tomorrow morning
                </span>
              )}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
