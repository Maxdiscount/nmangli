export type Product = {
  id: string;
  name: string;
  price: number;
  unit: 'kg' | 'g' | 'pc' | 'bunch' | 'pack';
  category: string;
  image: string;
  enabled: boolean;
};

export type Category = {
  id: string;
  name: string;
  enabled: boolean;
};

export interface CartItem extends Product {
  quantity: number;
}
