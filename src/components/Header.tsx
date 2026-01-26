import Link from 'next/link';
import { ShoppingBasket } from 'lucide-react';
import { STORE_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBasket className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            {STORE_NAME}
          </span>
        </Link>
      </div>
    </header>
  );
}
