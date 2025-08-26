import { useEffect, useState } from 'react';

export function useBannerVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Check localStorage to see if banner was previously dismissed
  useEffect(() => {
    setIsClient(true);
    const bannerDismissed = localStorage.getItem('banner-dismissed');
    if (bannerDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('banner-dismissed', 'true');
  };

  return {
    isVisible: isClient && isVisible,
    isClient,
    dismissBanner,
  };
}
