import { Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RepeatOrderButtonProps {
  onRepeat: () => void;
  hasLastOrder: boolean;
}

export function RepeatOrderButton({ onRepeat, hasLastOrder }: RepeatOrderButtonProps) {
  if (!hasLastOrder) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className="h-12 w-full sm:w-auto"
            onClick={onRepeat}
          >
            <Repeat className="w-5 h-5 mr-2" />
            <span className="sm:hidden">Repeat Last Order</span>
            <span className="hidden sm:inline">Repeat Order</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Quickly add items from your last order.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
