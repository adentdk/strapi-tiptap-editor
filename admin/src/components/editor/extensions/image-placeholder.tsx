import { useState } from "react";
import type { NodeViewProps } from "@tiptap/core";
import {
  type CommandProps,
  type Editor,
  mergeAttributes,
  Node,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { LucideImage, LucideLink, Upload } from "lucide-react";
import { Input } from "../../ui/input";
import { isValidUrl, NODE_HANDLES_SELECTED_STYLE_CLASSNAME } from "../utils";
import { Popover, Tabs } from "@strapi/design-system";
import { Button } from "../../ui/button";
import styled from "styled-components";

export interface ImagePlaceholderOptions {
  HTMLAttributes: Record<string, any>;
  onDrop: (files: File[], editor: Editor) => void;
  onDropRejected?: (files: File[], editor: Editor) => void;
  onEmbed: (url: string, editor: Editor) => void;
  allowedMimeTypes?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      /**
       * Inserts an image placeholder
       */
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
    background-color: ${props => props.theme.colors.secondary500 || props.theme.colors.neutral200};
  }
  
  ${props => props.$selected && `
    background-color: ${props.theme.colors.primary500 + '1A'};
    &:hover {
      background-color: ${props.theme.colors.primary500 + '33'};
    }
  `}
`;

const DropZone = styled.div<{ $isDragActive?: boolean; $isDragReject?: boolean }>`
  margin: 8px 0;
  border-radius: 6px;
  border: 1px dashed ${props => props.theme.colors.neutral300};
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary500 || props.theme.colors.neutral100};
  }
  
  ${props => props.$isDragActive && `
    border-color: ${props.theme.colors.primary500};
    background-color: ${props.theme.colors.secondary500 || props.theme.colors.neutral100};
  `}
  
  ${props => props.$isDragReject && `
    border-color: ${props.theme.colors.danger500};
    background-color: ${props.theme.colors.danger500 + '1A'};
  `}
`;

const DropZoneLabel = styled.label`
  display: flex;
  height: 112px;
  width: 100%;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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
`;

const Icon = styled.div`
  &.image-icon {
    width: 24px;
    height: 24px;
  }
  
  &.upload-icon {
    width: 16px;
    height: 16px;
    margin-bottom: 8px;
  }
  
  &.link-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
`;

const TabTrigger = styled(Tabs.Trigger)`
  padding: 4px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin: 8px 0;
  height: 32px;
  width: 100%;
  padding: 8px;
  font-size: 12px;
`;

export const ImagePlaceholder = Node.create<ImagePlaceholderOptions>({
  name: "image-placeholder",

  addOptions() {
    return {
      HTMLAttributes: {},
      onDrop: () => { },
      onDropRejected: () => { },
      onEmbed: () => { },
    };
  },

  group: "block",

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes)];
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

export function ImagePlaceholderComponent(props: NodeViewProps) {
  const { editor, extension, selected } = props;

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragReject(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragReject(false);

    const { files } = e.dataTransfer;
    const acceptedFiles: File[] = [];
    const rejectedFiles: File[] = [];

    Array.from(files).map((file) => {
      if (
        extension.options.allowedMimeTypes &&
        !Object.keys(extension.options.allowedMimeTypes).some((type) =>
          file.type.match(type),
        )
      ) {
        rejectedFiles.push(file);
      } else if (
        extension.options.maxSize &&
        file.size > extension.options.maxSize
      ) {
        rejectedFiles.push(file);
      } else {
        acceptedFiles.push(file);
      }
    });

    if (rejectedFiles.length > 0) {
      setIsDragReject(true);
      extension.options.onDropRejected?.(rejectedFiles, editor);
    }

    if (acceptedFiles.length > 0) {
      handleAcceptedFiles(acceptedFiles);
    }
  };

  const handleAcceptedFiles = (acceptedFiles: File[]) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const src = reader.result as string;
        editor.chain().focus().setImage({ src }).run();
      };

      reader.readAsDataURL(file);
    });

    if (extension.options.onDrop) {
      extension.options.onDrop(acceptedFiles, editor);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleAcceptedFiles(files);
  };

  const handleInsertEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = isValidUrl(url);
    if (!valid) {
      setUrlError(true);
      return;
    }
    if (url !== "") {
      editor.chain().focus().setImage({ src: url }).run();
      extension.options.onEmbed(url, editor);
    }
  };

  return (
    <NodeViewWrapper style={{ width: "100%" }}>
      <Popover.Root modal open={open}>
        <Popover.Trigger
          onClick={() => {
            setOpen(true);
          }}
          style={{ width: "100%" }}
        >
          <TriggerContainer $selected={selected}>
            <Icon className="image-icon">
              <LucideImage width={24} height={24} />
            </Icon>
            Add an image
          </TriggerContainer>
        </Popover.Trigger>
        <Popover.Content
          style={{ width: "450px", padding: "8px 0" }}
          onPointerDownOutside={() => {
            setOpen(false);
          }}
          onEscapeKeyDown={() => {
            setOpen(false);
          }}
        >
          <Tabs.Root defaultValue="upload" style={{ padding: "0 12px" }}>
            <Tabs.List>
              <TabTrigger value="upload">
                <Icon className="upload-icon">
                  <Upload width={16} height={16} />
                </Icon>
                Upload
              </TabTrigger>
              <TabTrigger value="url">
                <Icon className="link-icon">
                  <LucideLink width={16} height={16} />
                </Icon>
                Embed link
              </TabTrigger>
            </Tabs.List>

            <Tabs.Content value="upload">
              <DropZone
                $isDragActive={isDragActive}
                $isDragReject={isDragReject}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept={Object.keys(
                    extension.options.allowedMimeTypes || {},
                  ).join(",")}
                  multiple={extension.options.maxFiles !== 1}
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                  id="file-input"
                />
                <DropZoneLabel htmlFor="file-input">
                  <Icon className="upload-icon">
                    <Upload width={24} height={24} />
                  </Icon>
                  Drag & drop or click to upload
                </DropZoneLabel>
              </DropZone>
            </Tabs.Content>
            <Tabs.Content value="url">
              <form onSubmit={handleInsertEmbed}>
                <Input
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (urlError) {
                      setUrlError(false);
                    }
                  }}
                  placeholder="Paste the image link..."
                />
                {urlError && (
                  <ErrorText>
                    Please enter a valid URL
                  </ErrorText>
                )}
                <StyledButton
                  onClick={handleInsertEmbed}
                  type="button"
                  size="sm"
                >
                  Embed Image
                </StyledButton>
                <InfoText>
                  Works with any image from the web
                </InfoText>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </Popover.Content>
      </Popover.Root>
    </NodeViewWrapper>
  );
}