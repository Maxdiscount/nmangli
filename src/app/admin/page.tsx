'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Package, Tags, ClipboardList, LogOut, Plus, Trash2, Edit2, Check, X, Upload, Sparkles, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { ADMIN_PASSWORD } from '@/lib/constants';
import type { Product, Category } from '@/types';
import { useProductStore } from '@/hooks/useProductStore';
import { validateProductImageUrls, ValidateProductImageUrlsOutput } from '@/ai/flows/validate-product-image-urls';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Tab = 'products' | 'categories' | 'orders';

function AdminPanel() {
  const searchParams = useSearchParams();
  const isDeliveryMode = searchParams.get('delivery') === 'true';
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>(isDeliveryMode ? 'orders' : 'products');

  const {
    products: productList,
    categories: categoryList,
    toggleProductEnabled,
    updateProduct,
    addProduct,
    deleteProduct,
    toggleCategoryEnabled,
    addCategory,
  } = useProductStore();
  
  const sortedProducts = useMemo(() => [...productList].sort((a,b) => a.name.localeCompare(b.name)), [productList]);
  const sortedCategories = useMemo(() => [...categoryList].filter(c => c.id !== 'all').sort((a,b) => a.name.localeCompare(b.name)), [categoryList]);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    unit: 'kg' as Product['unit'],
    category: 'vegetables',
    image: '',
  });

  const [validationStatus, setValidationStatus] = useState<ValidateProductImageUrlsOutput>([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin-authenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-authenticated');
    setPassword('');
  };

  const startEditPrice = (product: Product) => {
    setEditingProduct(product.id);
    setEditPrice(product.price.toString());
  };

  const savePrice = (productId: string) => {
    const price = parseFloat(editPrice);
    if (!isNaN(price) && price > 0) {
      updateProduct(productId, { price });
    }
    setEditingProduct(null);
    setEditPrice('');
  };

  const addNewProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill all product details.' });
      return;
    }
    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      category: newProduct.category,
      image: newProduct.image,
    });
    setNewProduct({ name: '', price: '', unit: 'kg', category: 'vegetables', image: '' });
    setShowAddProduct(false);
    toast({ title: 'Product Added', description: `${newProduct.name} has been added.` });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = addCategory(newCategoryName);
    if (newCat) {
      setNewCategoryName('');
      toast({ title: 'Category Added', description: `${newCat.name} has been added.` });
    } else {
      toast({ variant: 'destructive', title: 'Category exists', description: 'This category name is already taken.' });
    }
  };

  const handleValidateImages = async () => {
    setIsValidating(true);
    const productsToValidate = productList.map(p => ({ id: p.id, imageUrl: p.image }));
    try {
      const results = await validateProductImageUrls(productsToValidate);
      setValidationStatus(results);
      const invalidCount = results.filter(r => !r.isValid).length;
      if (invalidCount > 0) {
        toast({ variant: 'destructive', title: 'Validation Complete', description: `${invalidCount} invalid image URLs found.` });
      } else {
        toast({ title: 'Validation Complete', description: 'All image URLs are valid!' });
      }
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Validation Failed', description: 'An error occurred during validation.' });
    } finally {
      setIsValidating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <p className="text-muted-foreground pt-2">Enter password to access</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 h-12 text-center"
                autoFocus
              />
              {error && <p className="text-destructive text-sm mb-4">{error}</p>}
              <Button type="submit" className="w-full h-12 text-lg">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">Mangli.Store Admin</h1>
            {isDeliveryMode && <Badge variant="secondary">Delivery Mode</Badge>}
          </div>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground">
            <LogOut className="w-5 h-5" /> Logout
          </Button>
        </div>
        {!isDeliveryMode && (
          <div className="container pb-4 flex gap-2 overflow-x-auto hide-scrollbar">
            {(['products', 'categories', 'orders'] as Tab[]).map(tab => (
              <Button key={tab} variant={activeTab === tab ? 'default' : 'secondary'} onClick={() => setActiveTab(tab)}>
                {tab === 'products' && <Package className="w-4 h-4" />}
                {tab === 'categories' && <Tags className="w-4 h-4" />}
                {tab === 'orders' && <ClipboardList className="w-4 h-4" />}
                <span className="capitalize ml-2">{tab}</span>
              </Button>
            ))}
          </div>
        )}
      </header>

      <main className="container py-6">
        {activeTab === 'products' && !isDeliveryMode && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-semibold">Products ({productList.length})</h2>
              <div className="flex gap-2">
                <Button onClick={handleValidateImages} variant="outline" disabled={isValidating}>
                  <Sparkles className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
                  {isValidating ? 'Validating...' : 'Validate Images'}
                </Button>
                <Button onClick={() => setShowAddProduct(!showAddProduct)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>
            </div>

            {showAddProduct && (
              <Card className="mb-6">
                <CardHeader><CardTitle>New Product</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <Input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                    <Select value={newProduct.unit} onValueChange={(v) => setNewProduct({ ...newProduct, unit: v as Product['unit'] })}>
                      <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                      <SelectContent>
                        {['kg', 'g', 'pc', 'bunch', 'pack'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categoryList.filter(c => c.id !== 'all').map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="md:col-span-2">
                      <Input placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                      <p className="text-xs text-muted-foreground mt-1 flex items-center"><Upload className="w-3 h-3 inline mr-1" /> For now, use publicly accessible image URLs.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button onClick={addNewProduct}>Add Product</Button>
                  <Button variant="ghost" onClick={() => setShowAddProduct(false)}>Cancel</Button>
                </CardFooter>
              </Card>
            )}

            <div className="space-y-3">
              {sortedProducts.map(product => {
                const status = validationStatus.find(s => s.id === product.id);
                return (
                  <Card key={product.id} className={`transition-opacity ${!product.enabled ? 'opacity-50' : ''}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="relative">
                            <Image src={product.image} alt={product.name} width={64} height={64} className="rounded-lg object-cover bg-muted" />
                            {status && (
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="absolute -top-1 -right-1">
                                            {status.isValid ? <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" /> : <AlertCircle className="w-5 h-5 text-red-500 bg-white rounded-full" />}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{status.isValid ? 'Image URL is valid' : `Invalid: ${status.reason}`}</p>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge variant="outline" className="text-xs">{product.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingProduct === product.id ? (
                          <div className="flex items-center gap-1">
                            <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-20 h-9" autoFocus onBlur={() => savePrice(product.id)} onKeyDown={(e) => e.key === 'Enter' && savePrice(product.id)} />
                            <Button size="icon" variant="ghost" onClick={() => savePrice(product.id)}><Check className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditingProduct(null)}><X className="w-4 h-4" /></Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">₹{product.price}/{product.unit}</span>
                            <Button size="icon" variant="ghost" onClick={() => startEditPrice(product)}><Edit2 className="w-4 h-4" /></Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id={`enable-${product.id}`} checked={product.enabled} onCheckedChange={() => toggleProductEnabled(product.id)} />
                          <Label htmlFor={`enable-${product.id}`} className="text-xs">{product.enabled ? 'Active' : 'Disabled'}</Label>
                        </div>
                        <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteProduct(product.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                )})}
            </div>
          </div>
        )}

        {activeTab === 'categories' && !isDeliveryMode && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <Card className="mb-6">
              <CardHeader><CardTitle>Add Category</CardTitle></CardHeader>
              <CardContent className="flex gap-3">
                <Input placeholder="New category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCategory()} />
                <Button onClick={handleAddCategory}>Add</Button>
              </CardContent>
            </Card>
            <div className="space-y-3">
              {sortedCategories.map(category => (
                <Card key={category.id} className={`flex items-center justify-between p-4 ${!category.enabled ? 'opacity-50' : ''}`}>
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <Switch id={`enable-${category.id}`} checked={category.enabled} onCheckedChange={() => toggleCategoryEnabled(category.id)} />
                    <Label htmlFor={`enable-${category.id}`}>{category.enabled ? 'Active' : 'Disabled'}</Label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'orders' || isDeliveryMode) && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{isDeliveryMode ? 'Delivery Orders' : 'Order History'}</h2>
            <Card className="text-center py-20">
              <CardContent>
                <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Order management requires Firebase integration.</p>
                <p className="text-sm text-muted-foreground mt-2">Orders placed via WhatsApp will appear here once connected.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading Admin...</div>}>
      <AdminPanel />
    </Suspense>
  )
}
