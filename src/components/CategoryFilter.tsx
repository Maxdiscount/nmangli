import type { Category } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'secondary'}
          onClick={() => onSelectCategory(category.id)}
          className="shrink-0 rounded-full px-5 py-2 h-auto text-sm font-medium transition-all duration-200"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
