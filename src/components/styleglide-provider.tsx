'use client';

import { KitViewProvider } from '@styleglide/kit-view-provider';

const STYLEGLIDE_PREVIEW_ORIGIN =
  'https://style-glide-monorepo-git-feature-ma-0f5cc9-shanedownes-projects.vercel.app';

export function StyleGlideProvider() {
  return <KitViewProvider origin={STYLEGLIDE_PREVIEW_ORIGIN} />;
}
