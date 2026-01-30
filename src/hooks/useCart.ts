'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  WHATSAPP_NUMBER, 
  STORE_NAME, 
  ORDER_START_HOUR, 
  ORDER_END_HOUR,
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD
} from '@/lib/constants';

const CART_KEY = 'mangli-cart';
const LAST_ORDER_KEY = 'mangli-last-order';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to parse stored cart:', e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0;
  const total = subtotal + deliveryCharge;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isWithinOrderHours = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= ORDER_START_HOUR && currentHour < ORDER_END_HOUR;
  }, []);

  const isAfterOrderHours = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= ORDER_END_HOUR;
  }, []);

  const openWhatsAppCheckout = useCallback(() => {
    if (cart.length === 0) return;

    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(cart));

    const orderDetails = cart.map(item => 
      `${item.name} - ${item.quantity} ${item.unit} x ₹${item.price} = ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const afterHoursMessage = isAfterOrderHours()
      ? `\n-----------------------------------\n*This is an after-hours order and will be delivered tomorrow morning.*`
      : '';

    const message = `
Hello ${STORE_NAME}, I'd like to place an order:
-----------------------------------
${orderDetails}
-----------------------------------
Subtotal: ₹${subtotal.toFixed(2)}
Delivery: ₹${deliveryCharge.toFixed(2)}
*Total: ₹${total.toFixed(2)}*${afterHoursMessage}

Thank you!
    `;

    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
  }, [cart, subtotal, deliveryCharge, total, clearCart, isAfterOrderHours]);

  const [hasLastOrder, setHasLastOrder] = useState(false);
  useEffect(() => {
    setHasLastOrder(!!localStorage.getItem(LAST_ORDER_KEY));
  }, [cart]);

  const repeatLastOrder = useCallback(() => {
    const lastOrder = localStorage.getItem(LAST_ORDER_KEY);
    if (lastOrder) {
      setCart(JSON.parse(lastOrder));
      toast({
        title: 'Last order repeated',
        description: 'Your previous order has been added to your cart.',
      });
    }
  }, [toast]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemQuantity,
    clearCart,
    subtotal,
    deliveryCharge,
    total,
    totalItems,
    isWithinOrderHours,
    isAfterOrderHours,
    openWhatsAppCheckout,
    repeatLastOrder,
    hasLastOrder,
  };
}
