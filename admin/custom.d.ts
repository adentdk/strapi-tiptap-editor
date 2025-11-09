export { };

declare global {
  interface Window {
    strapi: {
      backendURL: string;
      token?: string;
      mediaLibrary?: {
        open: (options: {
          multiple?: boolean;
          onSelect: (files: Array<{
            id: number;
            name: string;
            alternativeText?: string;
            url: string;
            mime: string;
            width?: number;
            height?: number;
          }>) => void;
        }) => void;
      };
    };
  }
}