'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, Category } from '@/types';
import { products as initialProducts, categories as initialCategories } from '@/data/products';

const PRODUCTS_KEY = 'mangli-products';
const CATEGORIES_KEY = 'mangli-categories';

export function useProductStore() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
      const storedCategories = localStorage.getItem(CATEGORIES_KEY);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (e) {
      console.error('Failed to parse stored data:', e);
    }
    setIsInitialized(true);
  }, []);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products, isInitialized]);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories, isInitialized]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PRODUCTS_KEY && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
      if (e.key === CATEGORIES_KEY && e.newValue) {
        setCategories(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
