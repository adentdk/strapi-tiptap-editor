// src/tiptap/extensions/custom-component/types.ts
export type CustomComponentType = 'customButton' | 'customRelatedPost' | 'customBanner';

export interface CustomButtonAttributes {
  title: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  url?: string;
}

export interface CustomRelatedPostAttributes {
  postIds: string;
  layout: 'grid' | 'list' | 'carousel';
  maxItems: number;
}

export interface CustomBannerAttributes {
  bannerTitle: string;
  content: string;
  theme: 'light' | 'dark' | 'primary';
  closable: boolean;
}

export type CustomComponentAttributes =
  | ({ type: 'customButton' } & CustomButtonAttributes)
  | ({ type: 'customRelatedPost' } & CustomRelatedPostAttributes)
  | ({ type: 'customBanner' } & CustomBannerAttributes);