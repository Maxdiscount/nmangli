import type { Product, Category } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || `https://picsum.photos/seed/default/400/400`;

export const categories: Category[] = [
  { id: 'all', name: 'All', enabled: true },
  { id: 'vegetables', name: 'Vegetables', enabled: true },
  { id: 'fruits', name: 'Fruits', enabled: true },
  { id: 'dairy', name: 'Dairy & Eggs', enabled: true },
  { id: 'bakery', name: 'Bakery', enabled: false },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Tomato',
    price: 40,
    unit: 'kg',
    category: 'vegetables',
    image: getImage('tomato'),
    enabled: true,
  },
  {
    id: 'prod-2',
    name: 'Potato',
    price: 30,
    unit: 'kg',
    category: 'vegetables',
    image: getImage('potato'),
    enabled: true,
  },
  {
    id: 'prod-3',
    name: 'Onion',
    price: 35,
    unit: 'kg',
    category: 'vegetables',
    image: getImage('onion'),
    enabled: true,
  },
  {
    id: 'prod-4',
    name: 'Spinach',
    price: 20,
    unit: 'bunch',
    category: 'vegetables',
    image: getImage('spinach'),
    enabled: true,
  },
  {
    id: 'prod-5',
    name: 'Apple',
    price: 120,
    unit: 'kg',
    category: 'fruits',
    image: getImage('apple'),
    enabled: true,
  },
  {
    id: 'prod-6',
    name: 'Banana',
    price: 50,
    unit: 'kg',
    category: 'fruits',
    image: getImage('banana'),
    enabled: true,
  },
  {
    id: 'prod-7',
    name: 'Milk',
    price: 28,
    unit: 'pack',
    category: 'dairy',
    image: getImage('milk'),
    enabled: true,
  },
  {
    id: 'prod-8',
    name: 'Bread',
    price: 45,
    unit: 'pack',
    category: 'bakery',
    image: getImage('bread'),
    enabled: false,
  },
  {
    id: 'prod-9',
    name: 'Eggs',
    price: 7,
    unit: 'pc',
    category: 'dairy',
    image: getImage('eggs'),
    enabled: true,
  },
  {
    id: 'prod-10',
    name: 'Carrot',
    price: 60,
    unit: 'kg',
    category: 'vegetables',
    image: getImage('carrot'),
    enabled: true,
  },
  {
    id: 'prod-11',
    name: 'Invalid Image Product',
    price: 99,
    unit: 'pc',
    category: 'vegetables',
    image: getImage('invalid-image'),
    enabled: true,
  }
];
