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
  Edit3,
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

// === EXTENSION IMAGE DENGAN FITUR BARU ===
export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      caption: { default: null }, // BARU
      title: { default: null },
      width: { default: "90%" },
      pixelWidth: { default: null }, // BARU
      pixelHeight: { default: null }, // BARU
      height: { default: 'auto' },
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
        tag: 'figure',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const img = dom.querySelector('img');
          const figcaption = dom.querySelector('figcaption');
          if (!img) return false;

          const width = img.getAttribute('width');
          const height = img.getAttribute('height');

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            caption: figcaption?.textContent || null,
            pixelWidth: width && !isNaN(+width) ? +width : null,
            pixelHeight: height && !isNaN(+height) ? +height : null,
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLImageElement;
          const width = element.getAttribute('width');
          const height = element.getAttribute('height');

          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            caption: null,
            pixelWidth: width && !isNaN(+width) ? +width : null,
            pixelHeight: height && !isNaN(+height) ? +height : null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, pixelWidth, pixelHeight, ...imgAttrs } = HTMLAttributes;

    if (pixelWidth) imgAttrs.width = pixelWidth;
    if (pixelHeight) imgAttrs.height = pixelHeight;

    const img = ['img', imgAttrs];
    if (caption) {
      return [
        'figure',
        { style: 'margin: 1em 0; text-align: center;' },
        img,
        ['figcaption', { style: 'font-size: 0.9em; color: #666; margin-top: 0.5em; font-style: italic;' }, caption]
      ];
    }
    return img as any;
  },
});

// === STYLED COMPONENTS ===
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

const ImageContainer = styled.div<{ $objectFit?: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
`;

const StyledImage = styled.img<{ $aspectRatio?: string }>`
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  ${props => props.$aspectRatio && `aspect-ratio: ${props.$aspectRatio};`}
`;

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
    if (props.$type === 'featured') return props.$active ? props.theme.colors.warning500 : props.theme.colors.neutral500;
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
  &:hover { opacity: 1; }
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
  &:hover { opacity: 1; }
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
  ${ImageWrapper}:hover & { opacity: 0.8; }
`;

const SizePresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  &:hover { background-color: ${props => props.theme.colors.primary100}; border-color: ${props => props.theme.colors.primary500}; }
`;

const CaptionText = styled.div`
  text-align: center;
  font-size: 0.9em;
  color: #666;
  margin-top: 0.5em;
  padding: 0 8px;
  font-style: italic;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

// === HELPER ===
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
  return normalized;
};

// === KOMPONEN UTAMA ===
export function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [openedMore, setOpenedMore] = useState(false);
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [isAltHovered, setIsAltHovered] = useState(false);
  const [renderedSize, setRenderedSize] = useState<{ width: number; height: number } | null>(null);

  // Normalize attrs
  useEffect(() => {
    const normalizedAttrs = normalizeImageAttributes(node.attrs);
    const needsUpdate = Object.keys(normalizedAttrs).some(k => normalizedAttrs[k] !== node.attrs[k]);
    if (needsUpdate) updateAttributes(normalizedAttrs);
  }, [node.attrs, updateAttributes]);

  // Update rendered size
  useEffect(() => {
    const img = imageRef.current;
    if (!img || !img.complete) return;

    const updateSize = () => {
      const rect = img.getBoundingClientRect();
      setRenderedSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (img.parentElement) ro.observe(img.parentElement);
    return () => ro.disconnect();
  }, [node.attrs.src]);

  // Presets
  const sizePresets = [
    { label: "Small", value: "30%" },
    { label: "Medium", value: "60%" },
    { label: "Large", value: "90%" },
    { label: "Full", value: "100%" },
    { label: "Auto", value: "auto" },
  ];

  const mobileSizePresets = [
    { label: "Full", value: "100%" },
    { label: "90%", value: "90%" },
    { label: "80%", value: "80%" },
    { label: "Auto", value: "auto" },
  ];

  const pixelPresets = [
    { label: "Original", value: null },
    { label: "400px", value: 400 },
    { label: "600px", value: 600 },
    { label: "800px", value: 800 },
    { label: "1200px", value: 1200 },
  ];

  // Handle media select
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

    const fullUrl = file.url.startsWith('http') ? file.url : `${window.strapi?.backendURL}${file.url}`;
    updateAttributes({
      src: fullUrl,
      alt: file.alt,
      caption: file.caption,
      title: file.name,
      pixelWidth: file.width,
      pixelHeight: file.height,
      width: "auto",
      aspectRatio: file.width && file.height ? `${file.width}/${file.height}` : null,
      srcset,
    });
  };

  // Toggle
  const toggleResponsive = () => updateAttributes({ useResponsive: !node.attrs.useResponsive });
  const toggleFeaturedImage = () => {
    const newIsFeatured = !node.attrs.isFeatured;
    if (newIsFeatured) {
      const tr = editor.state.tr;
      editor.state.doc.descendants((n, pos) => {
        if (n.type.name === 'image' && n.attrs.isFeatured) {
          tr.setNodeMarkup(pos, undefined, { ...n.attrs, isFeatured: false });
        }
      });
      editor.view.dispatch(tr);
    }
    updateAttributes({ isFeatured: newIsFeatured });
  };

  // Edit alt & caption
  const onEditAlt = () => {
    const newAlt = prompt("Set alt text:", node.attrs.alt || "");
    if (newAlt !== null) updateAttributes({ alt: newAlt });
  };

  const onEditCaption = () => {
    const newCaption = prompt("Set caption:", node.attrs.caption || "");
    if (newCaption !== null) updateAttributes({ caption: newCaption });
  };

  // Pixel size dengan aspect ratio
  const updatePixelSize = (width?: number | null, height?: number | null) => {
    const originalW = node.attrs.pixelWidth;
    const originalH = node.attrs.pixelHeight;
    if (!originalW || !originalH) return;

    let newW = width ?? originalW;
    let newH = height ?? originalH;

    if (width !== undefined && width !== null) {
      newH = Math.round((originalH / originalW) * width);
    } else if (height !== undefined && height !== null) {
      newW = Math.round((originalW / originalH) * height);
    }

    updateAttributes({
      pixelWidth: newW,
      pixelHeight: newH,
      width: `${newW}px`,
    });
  };

  // Display width
  const getDisplayWidth = () => {
    if (node.attrs.pixelWidth) return `${node.attrs.pixelWidth}px`;
    if (typeof node.attrs.width === 'string') return node.attrs.width;
    return 'auto';
  };

  const { alt, caption, width, align, mobileWidth, useResponsive, isFeatured, pixelWidth, pixelHeight } = node.attrs;

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

          {/* Badges */}
          {editor?.isEditable && (
            <BadgesContainer>
              <Badge $active={useResponsive} $type="responsive" onClick={toggleResponsive}>
                {useResponsive ? <Smartphone size={10} /> : <Monitor size={10} />}
                {useResponsive ? "Responsive" : "Fixed"}
              </Badge>
              <Badge $active={isFeatured} $type="featured" onClick={toggleFeaturedImage}>
                <Star size={10} fill={isFeatured ? "currentColor" : "none"} />
                {isFeatured ? "Featured" : "Feature"}
              </Badge>
            </BadgesContainer>
          )}

          {/* Alt Badge */}
          {editor?.isEditable && (
            <AltTextBadge $isHovered={isAltHovered} onMouseEnter={() => setIsAltHovered(true)} onMouseLeave={() => setIsAltHovered(false)}>
              <span style={{ color: alt ? "green" : "red" }}>{alt ? "Check" : "!"}</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {alt ? `Alt: "${alt}"` : "Alt text missing"}
              </span>
              <button type="button" onClick={onEditAlt} style={{ border: 0, padding: "4px 8px", background: "transparent", textDecoration: "underline", color: "var(--primary-500)", cursor: "pointer", borderRadius: "3px", fontSize: "12px" }}>
                Edit
              </button>
            </AltTextBadge>
          )}

          {/* Rendered Size */}
          {renderedSize && (
            <SizeIndicator>
              {renderedSize.width} × {renderedSize.height}
            </SizeIndicator>
          )}

          {/* Caption */}
          {caption && (
            <CaptionText onClick={editor?.isEditable ? onEditCaption : undefined}>
              {caption}
              {editor?.isEditable && <Edit3 size={12} style={{ marginLeft: 4, opacity: 0.5 }} />}
            </CaptionText>
          )}

          {/* Toolbar */}
          {editor?.isEditable && (
            <Toolbar $openedMore={openedMore}>
              <ToolbarButton $active={align === "left"} variant="ghost" onClick={() => updateAttributes({ align: "left" })}>
                <AlignLeft width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton $active={align === "center"} variant="ghost" onClick={() => updateAttributes({ align: "center" })}>
                <AlignCenter width={16} height={16} />
              </ToolbarButton>
              <ToolbarButton $active={align === "right"} variant="ghost" onClick={() => updateAttributes({ align: "right" })}>
                <AlignRight width={16} height={16} />
              </ToolbarButton>

              <Separator orientation="vertical" style={{ height: "20px" }} />

              <ToolbarButton $active={isFeatured} variant="ghost" onClick={toggleFeaturedImage}>
                <Star width={16} height={16} fill={isFeatured ? "currentColor" : "none"} />
              </ToolbarButton>

              <Separator orientation="vertical" style={{ height: "20px" }} />

              <DropdownMenu open={openedMore} onOpenChange={setOpenedMore}>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton variant="ghost">
                    <MoreVertical width={16} height={16} />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" alignOffset={-90} style={{ minWidth: "220px" }}>
                  <DropdownMenuItem onClick={toggleFeaturedImage}>
                    <Star width={16} height={16} fill={isFeatured ? "currentColor" : "none"} />
                    {isFeatured ? "Unset as Featured" : "Set as Featured"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setMediaLibOpen(true); setOpenedMore(false); }}>
                    <Replace width={16} height={16} />
                    Replace Image
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {/* Size Presets */}
                  <div style={{ padding: "8px 12px 4px", fontWeight: 600, fontSize: "12px", color: "var(--neutral-600)" }}>
                    {useResponsive ? "Desktop Size" : "Percent Size"}
                  </div>
                  <SizePresetGrid>
                    {sizePresets.map(p => (
                      <SizePresetButton
                        key={p.value}
                        $active={width === p.value}
                        onClick={() => updateAttributes({ width: p.value, pixelWidth: null, pixelHeight: null })}
                      >
                        {p.label}
                      </SizePresetButton>
                    ))}
                  </SizePresetGrid>

                  {/* Mobile Size */}
                  {useResponsive && (
                    <>
                      <div style={{ padding: "8px 12px 4px", fontWeight: 600, fontSize: "12px", color: "var(--neutral-600)" }}>
                        Mobile Size
                      </div>
                      <SizePresetGrid>
                        {mobileSizePresets.map(p => (
                          <SizePresetButton
                            key={p.value}
                            $active={mobileWidth === p.value}
                            onClick={() => updateAttributes({ mobileWidth: p.value })}
                          >
                            {p.label}
                          </SizePresetButton>
                        ))}
                      </SizePresetGrid>
                    </>
                  )}

                  {/* Pixel Size (Fixed Mode) */}
                  {!useResponsive && pixelWidth && (
                    <>
                      <div style={{ padding: "8px 12px 4px", fontWeight: 600, fontSize: "12px", color: "var(--neutral-600)" }}>
                        Pixel Width
                      </div>
                      <SizePresetGrid>
                        {pixelPresets.map(p => (
                          <SizePresetButton
                            key={p.value ?? 'orig'}
                            $active={pixelWidth === p.value}
                            onClick={() => updatePixelSize(p.value, undefined)}
                          >
                            {p.label}
                          </SizePresetButton>
                        ))}
                      </SizePresetGrid>
                      <div style={{ padding: "0 12px 8px", fontSize: "11px", color: "var(--neutral-500)" }}>
                        Current: {pixelWidth} × {pixelHeight}
                      </div>
                    </>
                  )}

                  {/* Responsive Toggle */}
                  <div style={{ padding: "8px 12px 4px", fontWeight: 600, fontSize: "12px", color: "var(--neutral-600)" }}>
                    Mode
                  </div>
                  <SizePresetButton
                    $active={useResponsive}
                    onClick={toggleResponsive}
                    style={{ width: "calc(100% - 16px)", margin: "0 8px 8px" }}
                  >
                    {useResponsive ? "Responsive On" : "Fixed Size"}
                  </SizePresetButton>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => duplicateContent(editor)}>
                    <Copy width={16} height={16} />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={deleteNode} style={{ color: "var(--danger-500)" }}>
                    <Trash width={16} height={16} />
                    Delete
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