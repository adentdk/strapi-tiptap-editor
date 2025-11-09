import { useEffect, useRef, useState } from "react";
import { NodeViewProps } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  MoreVertical,
  Trash,
  Replace,
  Smartphone,
  Monitor,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Separator } from "../../ui/separator";
import { duplicateContent } from "../utils";
import { Button } from "../../ui/button";
import styled from "styled-components";
import { MediaFile, MediaLibraryModal } from "../../../components/MediaLibraryModal";

// Extended attributes untuk responsive dan featured image
export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "90%" },
      height: { default: null },
      align: { default: "center" },
      srcset: { default: null },
      maxWidth: { default: "100%" },
      aspectRatio: { default: null },
      objectFit: { default: "contain" },
      mobileWidth: { default: "100%" },
      mobileMaxWidth: { default: "100%" },
      useResponsive: { default: true },
      isFeatured: { default: false },
    };
  },

  addNodeView: () => ReactNodeViewRenderer(TiptapImageComponent),

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {}
          const element = dom as HTMLImageElement
          
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width') || "90%",
            height: element.getAttribute('height'),
            align: "center",
            srcset: element.getAttribute('srcset'),
            maxWidth: "100%",
            objectFit: "contain",
            mobileWidth: "100%",
            mobileMaxWidth: "100%",
            useResponsive: true,
            isFeatured: false,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes]
  },
});

// Styled Components yang disederhanakan
const ImageWrapper = styled(NodeViewWrapper)<{
  $selected?: boolean;
  $align?: string;
  $width?: string;
  $maxWidth?: string;
  $mobileWidth?: string;
  $mobileMaxWidth?: string;
  $useResponsive?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: 2px solid transparent;
  width: ${props => props.$width || "90%"};
  max-width: ${props => props.$maxWidth || "100%"};
  margin: 0 auto;
  
  ${props => props.$selected && `
    border-color: ${props.theme.colors.primary500};
  `}
  
  ${props => {
    switch (props.$align) {
      case "left": return `margin-left: 0; margin-right: auto;`;
      case "right": return `margin-left: auto; margin-right: 0;`;
      default: return `margin-left: auto; margin-right: auto;`;
    }
  }}

  @media (max-width: 768px) {
    ${props => props.$useResponsive && `
      width: ${props.$mobileWidth || "100%"} !important;
      max-width: ${props.$mobileMaxWidth || "100%"} !important;
    `}
  }
`;

const ImageContainer = styled.div<{ 
  $objectFit?: string;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
`;

const StyledImage = styled.img<{
  $aspectRatio?: string;
}>`
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  ${props => props.$aspectRatio && `aspect-ratio: ${props.$aspectRatio};`}
`;

// Container untuk badge yang menggunakan flex
const BadgesContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  z-index: 10;
`;

const Badge = styled.div<{ $active?: boolean; $type?: 'responsive' | 'featured' }>`
  background-color: ${props => {
    if (props.$type === 'featured') {
      return props.$active ? props.theme.colors.warning500 : props.theme.colors.neutral500;
    }
    return props.$active ? props.theme.colors.success500 : props.theme.colors.neutral500;
  }};
  color: ${props => props.theme.colors.neutral0};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const AltTextBadge = styled.div<{ $isHovered?: boolean }>`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  max-width: calc(100% - 24px);
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  opacity: ${props => props.$isHovered ? 1 : 0.2};
  transition: opacity 0.2s ease-in-out;
  
  &:hover {
    opacity: 1;
  }
`;

const Toolbar = styled.div<{ $openedMore?: boolean }>`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  padding: 6px;
  opacity: ${props => props.$openedMore ? 1 : 0.5};
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    opacity: 1;
  }
`;

const ToolbarButton = styled(Button)<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  padding: 0;
  
  ${props => props.$active && `
    background-color: ${props.theme.colors.primary100};
    color: ${props.theme.colors.primary600};
  `}
`;

const SizeIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: ${props => props.theme.colors.neutral800};
  color: ${props => props.theme.colors.neutral0};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${ImageWrapper}:hover & {
    opacity: 0.8;
  }
`;

// Komponen untuk dropdown yang lebih ringkas
const SizePresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 8px;
`;

const SizePresetButton = styled.button<{ $active?: boolean }>`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.$active ? props.theme.colors.primary100 : props.theme.colors.neutral0};
  color: ${props => props.$active ? props.theme.colors.primary600 : props.theme.colors.neutral700};
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
    border-color: ${props => props.theme.colors.primary500};
  }
`;

// Helper function untuk mendeteksi dan menormalisasi atribut gambar
const normalizeImageAttributes = (attrs: any) => {
  const normalized = { ...attrs };
  
  if (attrs.src && !attrs.width && !attrs.align) {
    normalized.width = "90%";
    normalized.align = "center";
    normalized.maxWidth = "100%";
    normalized.objectFit = "contain";
    normalized.mobileWidth = "100%";
    normalized.mobileMaxWidth = "100%";
    normalized.useResponsive = true;
    normalized.isFeatured = false;
  }
  
  if (typeof normalized.width === 'number') {
    normalized.width = `${normalized.width}px`;
  }
  
  return normalized;
};

export function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [openedMore, setOpenedMore] = useState(false);
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [isAltHovered, setIsAltHovered] = useState(false);

  // Normalize attributes ketika komponen mount
  useEffect(() => {
    const normalizedAttrs = normalizeImageAttributes(node.attrs);
    const needsUpdate = Object.keys(normalizedAttrs).some(
      key => normalizedAttrs[key] !== node.attrs[key]
    );
    
    if (needsUpdate) {
      updateAttributes(normalizedAttrs);
    }
  }, [node.attrs, updateAttributes]);

  // Preset yang disederhanakan
  const sizePresets = [
    { label: "Small", value: "30%" },
    { label: "Medium", value: "60%" },
    { label: "Large", value: "90%" },
    { label: "Full", value: "100%" },
  ];

  const mobileSizePresets = [
    { label: "Full", value: "100%" },
    { label: "90%", value: "90%" },
    { label: "80%", value: "80%" },
    { label: "Auto", value: "auto" },
  ];

  // Handle replace image dengan media library
  const handleReplaceImage = () => {
    setMediaLibOpen(true);
    setOpenedMore(false);
  };

  const handleMediaSelect = (file: MediaFile) => {
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

    updateAttributes({
      src: file.url,
      alt: file.alt || node.attrs.alt,
      title: file.name || node.attrs.title,
      srcset,
    });
  };

  // Toggle functions
  const toggleResponsive = () => {
    updateAttributes({ useResponsive: !node.attrs.useResponsive });
  };

  const toggleFeaturedImage = () => {
    const newIsFeatured = !node.attrs.isFeatured;
    
    if (newIsFeatured) {
      const transaction = editor.state.tr;
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.isFeatured) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            isFeatured: false
          });
        }
      });
      editor.view.dispatch(transaction);
    }
    
    updateAttributes({ isFeatured: newIsFeatured });
  };

  const { alt, width, align, mobileWidth, useResponsive, isFeatured } = node.attrs;

  const onEditAlt = () => {
    const newAlt = prompt("Set alt text:", alt || "");
    if (newAlt !== null) {
      updateAttributes({ alt: newAlt });
    }
  };

  const getDisplayWidth = () => {
    if (typeof width === 'string') return width;
    if (typeof width === 'number') return `${width}px`;
    return 'auto';
  };

  return (
    <>
      <ImageWrapper
        $selected={selected}
        $align={align}
        $width={getDisplayWidth()}
        $maxWidth={node.attrs.maxWidth}
        $mobileWidth={mobileWidth}
        $mobileMaxWidth={node.attrs.mobileMaxWidth}
        $useResponsive={useResponsive}
      >
        <ImageContainer $objectFit={node.attrs.objectFit}>
          <StyledImage
            ref={imageRef}
            src={node.attrs.src}
            alt={alt}
            title={node.attrs.title}
            $aspectRatio={node.attrs.aspectRatio}
          />
          
          {/* Badges Container */}
          {editor?.isEditable && (
            <BadgesContainer>
              <Badge 
                $active={useResponsive} 
                $type="responsive"
                onClick={toggleResponsive}
                title={useResponsive ? "Disable responsive" : "Enable responsive"}
              >
                {useResponsive ? <Smartphone size={10} /> : <Monitor size={10} />}
                {useResponsive ? "Responsive" : "Fixed"}
              </Badge>
              
              <Badge 
                $active={isFeatured} 
                $type="featured"
                onClick={toggleFeaturedImage}
                title={isFeatured ? "Unset as featured" : "Set as featured"}
              >
                <Star size={10} fill={isFeatured ? "currentColor" : "none"} />
                {isFeatured ? "Featured" : "Feature"}
              </Badge>
            </BadgesContainer>
          )}
          
          {editor?.isEditable && (
            <AltTextBadge 
              $isHovered={isAltHovered}
              onMouseEnter={() => setIsAltHovered(true)}
              onMouseLeave={() => setIsAltHovered(false)}
            >
              <span style={{ color: alt ? "green" : "red" }}>
                {alt ? "✔" : "!"}
              </span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {alt ? `Alt: "${alt}"` : `Alt text missing`}
              </span>
              <button 
                type="button" 
                onClick={onEditAlt}
                style={{
                  border: 0,
                  padding: "4px 8px",
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                  color: "var(--primary-500)",
                  cursor: "pointer",
                  borderRadius: "3px",
                  fontSize: "12px"
                }}
              >
                Edit
              </button>
            </AltTextBadge>
          )}

          <SizeIndicator>
            {getDisplayWidth()}
          </SizeIndicator>

          <NodeViewContent as="div" style={{ textAlign: "center", padding: "8px" }}>
            {node.attrs.title}
          </NodeViewContent>

          {editor?.isEditable && (
            <Toolbar $openedMore={openedMore}>
              {/* Alignment Controls */}
              <ToolbarButton
                $active={align === "left"}
                variant="ghost"
                onClick={() => updateAttributes({ align: "left" })}
                title="Align Left"
              >
                <AlignLeft width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton
                $active={align === "center"}
                variant="ghost"
                onClick={() => updateAttributes({ align: "center" })}
                title="Align Center"
              >
                <AlignCenter width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton
                $active={align === "right"}
                variant="ghost"
                onClick={() => updateAttributes({ align: "right" })}
                title="Align Right"
              >
                <AlignRight width={16} height={16} />
              </ToolbarButton>
              
              <Separator orientation="vertical" style={{ height: "20px" }} />
              
              {/* Featured Image Toggle */}
              <ToolbarButton
                $active={isFeatured}
                variant="ghost"
                onClick={toggleFeaturedImage}
                title={isFeatured ? "Unset as Featured Image" : "Set as Featured Image"}
              >
                <Star 
                  width={16} 
                  height={16} 
                  fill={isFeatured ? "currentColor" : "none"} 
                />
              </ToolbarButton>
              
              <Separator orientation="vertical" style={{ height: "20px" }} />
              
              {/* More Options */}
              <DropdownMenu open={openedMore} onOpenChange={setOpenedMore}>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton variant="ghost" title="More options">
                    <MoreVertical width={16} height={16} />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" alignOffset={-90} style={{ minWidth: "200px", fontSize: "14px" }}>
                  
                  <DropdownMenuItem onClick={toggleFeaturedImage} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px" }}>
                    <Star width={16} height={16} fill={isFeatured ? "currentColor" : "none"} />
                    {isFeatured ? "Unset as Featured Image" : "Set as Featured Image"}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleReplaceImage} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px" }}>
                    <Replace width={16} height={16} />
                    Replace Image
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Size Settings */}
                  <div style={{ padding: "8px 12px 4px", fontSize: "12px", fontWeight: "600", color: "var(--neutral-600)" }}>
                    {useResponsive ? "Desktop Size" : "Size Presets"}
                  </div>
                  
                  <SizePresetGrid>
                    {sizePresets.map((preset) => (
                      <SizePresetButton
                        key={preset.value}
                        $active={width === preset.value}
                        onClick={() => updateAttributes({ width: preset.value })}
                      >
                        {preset.label}
                      </SizePresetButton>
                    ))}
                  </SizePresetGrid>

                  {useResponsive && (
                    <>
                      <div style={{ padding: "8px 12px 4px", fontSize: "12px", fontWeight: "600", color: "var(--neutral-600)" }}>
                        Mobile Size
                      </div>
                      <SizePresetGrid>
                        {mobileSizePresets.map((preset) => (
                          <SizePresetButton
                            key={preset.value}
                            $active={mobileWidth === preset.value}
                            onClick={() => updateAttributes({ mobileWidth: preset.value })}
                          >
                            {preset.label}
                          </SizePresetButton>
                        ))}
                      </SizePresetGrid>
                    </>
                  )}

                  <div style={{ padding: "8px 12px 4px", fontSize: "12px", fontWeight: "600", color: "var(--neutral-600" }}>
                    Responsive
                  </div>
                  <SizePresetButton
                    $active={useResponsive}
                    onClick={toggleResponsive}
                    style={{ width: "calc(100% - 16px)", margin: "0 8px 8px" }}
                  >
                    {useResponsive ? "✓ Responsive On" : "Responsive Off"}
                  </SizePresetButton>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => duplicateContent(editor)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px" }}>
                    <Copy width={16} height={16} />
                    Duplicate
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={deleteNode}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px", 
                      padding: "8px 12px",
                      color: "var(--danger-500)"
                    }}
                  >
                    <Trash width={16} height={16} />
                    Delete Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Toolbar>
          )}
        </ImageContainer>
      </ImageWrapper>

      <MediaLibraryModal
        isOpen={mediaLibOpen}
        onClose={() => setMediaLibOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  );
}