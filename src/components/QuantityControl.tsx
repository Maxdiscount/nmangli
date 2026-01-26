import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantityControlProps {
  quantity: number;
  onUpdateQuantity: (newQuantity: number) => void;
  size?: 'sm' | 'default';
}

export function QuantityControl({ quantity, onUpdateQuantity, size = 'default' }: QuantityControlProps) {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  
  return (
    <div className="flex items-center justify-center bg-muted rounded-full">
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full ${buttonSize}`}
        onClick={() => onUpdateQuantity(quantity - 1)}
      >
        <Minus className={iconSize} />
      </Button>
      <span className={`font-bold w-8 text-center ${textSize}`}>{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full ${buttonSize}`}
        onClick={() => onUpdateQuantity(quantity + 1)}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
}
