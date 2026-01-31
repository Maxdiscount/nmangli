'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, Category } from '@/types';
import { products as initialProducts, categories as initialCategories } from '@/data/products';

const PRODUCTS_KEY = 'mangli-products';
const CATEGORIES_KEY = 'mangli-categories';

const getStoredData = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    console.error(`Failed to parse stored data for key "${key}":`, e);
    // If parsing fails, it's safer to reset to the default state.
    localStorage.removeItem(key);
    return fallback;
  }
};

export function useProductStore() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // This effect runs only on the client, after initial render
  useEffect(() => {
    // Now we can safely get data from localStorage and update state
    setProducts(getStoredData(PRODUCTS_KEY, initialProducts));
    setCategories(getStoredData(CATEGORIES_KEY, initialCategories));

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PRODUCTS_KEY) {
        setProducts(getStoredData(PRODUCTS_KEY, initialProducts));
      }
      if (e.key === CATEGORIES_KEY) {
        setCategories(getStoredData(CATEGORIES_KEY, initialCategories));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Effect to write 'products' to localStorage whenever it changes.
  useEffect(() => {
    // We need to check if we are on the client before writing to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products]);
  
  // Effect to write 'categories' to localStorage whenever it changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories]);

  const toggleProductEnabled = useCallback((productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, enabled: !p.enabled } : p))
    );
  }, []);

  const updateProduct = useCallback((productId: string, updatedProduct: Partial<Omit<Product, 'id'>>) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updatedProduct } : p))
    );
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'enabled'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      enabled: true,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggleCategoryEnabled = useCallback((categoryId: string) => {
    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, enabled: !c.enabled } : c))
    );
  }, []);

  const addCategory = useCallback((name: string) => {
    if (!name.trim() || categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
        return null;
    }
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newCategory: Category = { id, name, enabled: true };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, [categories]);

  const enabledProducts = products.filter(p => p.enabled);
  const enabledCategories = categories.filter(c => c.enabled);

  return {
    products,
    categories,
    enabledProducts,
    enabledCategories,
    toggleProductEnabled,
    updateProduct,
    addProduct,
    deleteProduct,
    toggleCategoryEnabled,
    addCategory,
  };
}
