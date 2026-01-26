'use client';

import { useState, useMemo, Suspense } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { FloatingCart } from '@/components/FloatingCart';
import { RepeatOrderButton } from '@/components/RepeatOrderButton';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { useCart } from '@/hooks/useCart';
import { useProductStore } from '@/hooks/useProductStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Storefront() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const { enabledProducts, enabledCategories } = useProductStore();
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get('dev') === 'true';

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemQuantity,
    subtotal,
    deliveryCharge,
    total,
    totalItems,
    isWithinOrderHours,
    isAfterOrderHours,
    openWhatsAppCheckout,
    repeatLastOrder,
    hasLastOrder,
  } = useCart();

  const handleCheckout = () => {
    if (totalItems > 0) {
      setIsOrderDialogOpen(true);
    }
  };

  const handleConfirmOrder = () => {
    openWhatsAppCheckout();
    setIsOrderDialogOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return enabledProducts.filter(product => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [enabledProducts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-40">
      <Header />

      <main className="container py-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 h-12 rounded-xl bg-card focus:ring-primary/50"
            />
          </div>
          <RepeatOrderButton onRepeat={repeatLastOrder} hasLastOrder={hasLastOrder} />
        </div>

        <CategoryFilter
          categories={[{ id: 'all', name: 'All', enabled: true }, ...enabledCategories.filter(c => c.id !== 'all')]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mt-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getItemQuantity(product.id)}
              onAdd={() => addToCart(product)}
              onUpdateQuantity={(qty) => updateQuantity(product.id, qty)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found</p>
            <Button
              variant="link"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      <FloatingCart
        totalItems={totalItems}
        total={total}
        onCheckout={handleCheckout}
        isWithinOrderHours={isWithinOrderHours() || isDevMode}
        isAfterOrderHours={isAfterOrderHours() && !isDevMode}
      />

      <OrderConfirmation
        isOpen={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
        cart={cart}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onConfirmOrder={handleConfirmOrder}
        isAfterOrderHours={isAfterOrderHours() && !isDevMode}
      />
    </div>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Storefront />
    </Suspense>
  );
}
