import Image from 'next/image';
import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuantityControl } from './QuantityControl';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function ProductCard({
  product,
  quantity,
  onAdd,
  onUpdateQuantity,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      <div className="relative aspect-square w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={product.image.split('/').pop()}
        />
      </div>
      <CardContent className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-semibold text-sm leading-tight truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className="font-bold text-foreground">₹{product.price}</span> / {product.unit}
          </p>
        </div>
        <div className="mt-3">
          {quantity > 0 ? (
            <QuantityControl quantity={quantity} onUpdateQuantity={onUpdateQuantity} size="sm" />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full"
              onClick={onAdd}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
