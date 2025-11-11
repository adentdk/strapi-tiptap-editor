// src/components/media-library/MediaLibraryModal.tsx
import { memo, useCallback } from "react";
import { useStrapiApp } from "@strapi/strapi/admin";
import { createPortal } from "react-dom";
import { safelyResetPointerEvents } from "../utils/dom";

export interface MediaFile {
  url: string;
  alt: string;
  name: string;
  mime: string;
  width?: number;
  height?: number;
  formats?: any;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: MediaFile) => void;
  multiple?: boolean;
}

export const MediaLibraryModal = memo(({
  isOpen,
  onClose,
  onSelect,
  multiple = false
}: MediaLibraryModalProps) => {
  const components = useStrapiApp('MediaLib', state => state.components);
  const MediaLibraryDialog = components['media-library'] as any;

  const handleSelectAssets = useCallback((files: any[]) => {
    if (!files || files.length === 0) return;

    const selectedFiles = multiple ? files : [files[0]];

    selectedFiles.forEach(file => {
      console.log(file)
      const formattedFile: MediaFile = {
        url: file.url.startsWith('http') ? file.url : `${window.strapi?.backendURL}${file.url}`,
        alt: file.alternativeText || file.name,
        name: file.name,
        mime: file.mime,
        width: file.width,
        height: file.height,
        formats: file.formats,
      };

      onSelect(formattedFile);
    });

    onClose();
  }, [onSelect, onClose, multiple]);

  if (!isOpen || !MediaLibraryDialog) return null;

  return createPortal(
    <MediaLibraryDialog
      onClose={() => {
        onClose();
        safelyResetPointerEvents();
      }}
      onSelectAssets={(f: any) => {
        handleSelectAssets(f);
        safelyResetPointerEvents();
      }}
      allowedTypes={['images']}
    />,
    document.body
  );
});

MediaLibraryModal.displayName = 'MediaLibraryModal';