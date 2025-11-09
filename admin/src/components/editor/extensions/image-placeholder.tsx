// src/editor/extensions/image-placeholder.tsx
import { useState, useCallback, memo } from "react";
import type { NodeViewProps } from "@tiptap/core";
import {
  type CommandProps,
  mergeAttributes,
  Node,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { Image as LucideImage, Link2, Library } from "lucide-react";
import { Input } from "../../ui/input";
import { isValidUrl, NODE_HANDLES_SELECTED_STYLE_CLASSNAME } from "../utils";
import { Popover, Tabs } from "@strapi/design-system";
import { Button } from "../../ui/button";
import { useStrapiApp } from "@strapi/strapi/admin";
import { createPortal } from "react-dom";
import styled from "styled-components";

export interface ImagePlaceholderOptions {
  HTMLAttributes: Record<string, any>;
  onEmbed: (url: string, editor: any) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      insertImagePlaceholder: () => ReturnType;
    };
  }
}

// Styled Components
const TriggerContainer = styled.div<{ $selected?: boolean }>`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 12px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.neutral100};
  padding: 8px 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.neutral700};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.colors.neutral200};
  }

  ${props => props.$selected && `
    background-color: ${props.theme.colors.primary500 + '1A'};
    &:hover {
      background-color: ${props.theme.colors.primary500 + '33'};
    }
  `}
`;

const ErrorText = styled.p`
  padding: 6px 0;
  font-size: 12px;
  color: ${props => props.theme.colors.danger500};
`;

const InfoText = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${props => props.theme.colors.neutral600};
  margin-top: 8px;
`;

const Icon = styled.div`
  &.image-icon {
    width: 24px;
    height: 24px;
  }

  &.tab-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
`;

const TabTrigger = styled(Tabs.Trigger)`
  padding: 4px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledButton = styled(Button)`
  margin: 8px 0;
  height: 36px;
  width: 100%;
  font-size: 13px;
`;

// === MEDIA LIBRARY MODAL (FIXED) ===
const MediaLib = memo(({ isOpen, onClose, onSelect }: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: any) => void;
}) => {
  const components = useStrapiApp('MediaLib', state => state.components);
  const MediaLibraryDialog = components['media-library'] as any;

  const handleSelectAssets = useCallback((files: any[]) => {
    const file = files[0];
    if (!file) return;

    const formattedFile = {
      url: file.url.startsWith('http') ? file.url : `${window.strapi?.backendURL}${file.url}`,
      alt: file.alternativeText || file.name,
      name: file.name,
      mime: file.mime,
      width: file.width,
      height: file.height,
      formats: file.formats,
    };

    onSelect(formattedFile);
  }, [onSelect]);

  if (!isOpen || !MediaLibraryDialog) return null;

  return <MediaLibraryDialog
      onClose={onClose}
      onSelectAssets={handleSelectAssets}
    />;
});

MediaLib.displayName = 'MediaLib';

// === IMAGE PLACEHOLDER NODE ===
export const ImagePlaceholder = Node.create<ImagePlaceholderOptions>({
  name: "image-placeholder",

  addOptions() {
    return {
      HTMLAttributes: {},
      onEmbed: () => { },
    };
  },

  group: "block",

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": this.name })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderComponent, {
      className: NODE_HANDLES_SELECTED_STYLE_CLASSNAME,
    });
  },

  addCommands() {
    return {
      insertImagePlaceholder: () => (props: CommandProps) => {
        return props.commands.insertContent({
          type: "image-placeholder",
        });
      },
    };
  },
});

// === IMAGE PLACEHOLDER COMPONENT ===
export function ImagePlaceholderComponent(props: NodeViewProps) {
  const { editor, selected } = props;
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [mediaLibOpen, setMediaLibOpen] = useState(false);

  // === HANDLE MEDIA SELECT ===
  const handleMediaSelect = useCallback((file: any) => {
    if (!file) return;

    let srcset = undefined;
    if (file.formats) {
      const sets = Object.keys(file.formats)
        .sort((a, b) => file.formats[a].width - file.formats[b].width)
        .map(k => {
          const f = file.formats[k];
          const url = f.url.startsWith('http') ? f.url : `${window.strapi?.backendURL}${f.url}`;
          return `${url} ${f.width}w`;
        });
      srcset = sets.join(', ');
    }

    editor.chain().focus().setImage({
      src: file.url,
      alt: file.alt,
      title: file.name,
      width: '90%',
      align: 'center',
      srcset,
    } as any).run();

    setMediaLibOpen(false);
    setOpen(false);
  }, [editor]);

  // === HANDLE EMBED URL ===
  const handleInsertEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl(url)) {
      setUrlError(true);
      return;
    }

    editor.chain().focus().setImage({
      src: url,
      width: '90%',
      align: 'center',
    } as any).run();

    props.extension.options.onEmbed(url, editor);
    setOpen(false);
    setUrl("");
  };

  return (
    <NodeViewWrapper style={{ width: "100%" }}>
      {/* Media Library Modal - Render di ROOT */}
      <MediaLib
        isOpen={mediaLibOpen}
        onClose={() => setMediaLibOpen(false)}
        onSelect={handleMediaSelect}
      />

      {/* Main Trigger */}
      <Popover.Root modal open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <div style={{ width: "100%" }}>
            <TriggerContainer $selected={selected}>
              <Icon className="image-icon">
                <LucideImage width={24} height={24} />
              </Icon>
              Add an image
            </TriggerContainer>
          </div>
        </Popover.Trigger>

        <Popover.Content style={{ width: "460px", padding: "12px" }}>
          <Tabs.Root defaultValue="media">
            <Tabs.List>
              <TabTrigger value="media">
                <Icon className="tab-icon"><Library size={16} /></Icon>
                Media Library
              </TabTrigger>
              <TabTrigger value="url">
                <Icon className="tab-icon"><Link2 size={16} /></Icon>
                Embed Link
              </TabTrigger>
            </Tabs.List>

            {/* Media Library Tab */}
            <Tabs.Content value="media" style={{ marginTop: 16, textAlign: 'center' }}>
              <Button
                variant="secondary"
                onClick={() => { setMediaLibOpen(true); setOpen(false) }}
                fullWidth
              >
                <Library size={18} />
                Open Media Library
              </Button>
              <InfoText>
                Pilih gambar dari koleksi Strapi. Drag & drop tersedia di modal.
              </InfoText>
            </Tabs.Content>

            {/* Embed URL Tab */}
            <Tabs.Content value="url" style={{ marginTop: 16 }}>
              <form onSubmit={handleInsertEmbed}>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    urlError && setUrlError(false);
                  }}
                  autoFocus
                />
                {urlError && <ErrorText>URL tidak valid</ErrorText>}
                <StyledButton type="submit" variant="default">
                  Insert Image
                </StyledButton>
                <InfoText>
                  Bekerja dengan gambar dari internet
                </InfoText>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </Popover.Content>
      </Popover.Root>
    </NodeViewWrapper >
  );
}