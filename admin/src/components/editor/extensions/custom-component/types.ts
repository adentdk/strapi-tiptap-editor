// src/tiptap/extensions/custom-component/types.ts
export type CustomComponentType = 'customButton' | 'customRelatedItem' | 'customBanner' | 'customEntity';

export interface CustomEntityAttributes {
  entity_name: string;
  entity_id: string;
  custom_attrs: Record<string, string>; // JSON object
}

export interface CustomButtonItem {
  title: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  arrow: 'none' | 'left' | 'right'
}

export interface CustomButtonAttributes {
  buttons: CustomButtonItem[];
  align: 'left' | 'center' | 'right';
  fullWidth: boolean;
}

export interface CustomRelatedPostAttributes {
  label: string;
  itemId: string;
  layout: 'list' | 'grid';
  maxItems: number;
}

export interface CustomBannerAttributes {
  title: string;
  content: string;
  action?: {
    text: string;
    url: string;
  };
}

export type CustomComponentAttributes =
  | ({ type: 'customButton' } & CustomButtonAttributes)
  | ({ type: 'customRelatedItem' } & CustomRelatedPostAttributes)
  | ({ type: 'customBanner' } & CustomBannerAttributes)
  | ({ type: 'customEntity' } & CustomEntityAttributes);