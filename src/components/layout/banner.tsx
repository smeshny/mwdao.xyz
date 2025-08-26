'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useBannerVisibility } from '@/hooks/use-banner-visibility';

const Banner = ({ url = 'https://shadcnblocks.com' }: { url?: string }) => {
  const { isVisible, dismissBanner } = useBannerVisibility();

  // Don't render anything until client-side hydration is complete
  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-primary">
      <div className="relative container flex items-center justify-between gap-4 py-3 pr-12">
        <div className="flex flex-1 items-center justify-center gap-3 sm:gap-4">
          <span className="text-primary-foreground text-center text-sm font-medium">
            Purchase this theme on{' '}
            <span className="font-semibold">shadcnblocks.com</span>
          </span>
          <Button size="sm" variant="secondary" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Get Template
            </a>
          </Button>
        </div>
        <Button onClick={dismissBanner} aria-label="Close banner">
          <X className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Banner;
