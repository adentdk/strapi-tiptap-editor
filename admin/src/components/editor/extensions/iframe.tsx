import { Node, NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useState } from "react";
import styled from "styled-components";
import { Edit3, Trash } from "lucide-react";
import { Button } from "../../ui/button";

export interface IframeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: {
    [key: string]: any;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: {
        src: string
        width?: string | number;
        height?: string | number;
        allowfullscreen?: boolean;
        frameborder?: number;
      }) => ReturnType;
    };
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: "iframe",

  group: "block",

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: "iframe-wrapper",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", this.options.HTMLAttributes, ["iframe", {
      ...HTMLAttributes,
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowfullscreen: HTMLAttributes.allowfullscreen ?? true,
      referrerpolicy: "strict-origin-when-cross-origin"
    }]];
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string }) =>
          ({ tr, dispatch }) => {
            const { selection } = tr;
            const node = this.type.create(options);

            if (dispatch) {
              tr.replaceRangeWith(selection.from, selection.to, node);
            }

            return true;
          },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(TiptapIframeComponent);
  },
});

// === React component untuk iframe node ===
function TiptapIframeComponent({ node, selected, deleteNode, updateAttributes }: NodeViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSrc, setTempSrc] = useState(node.attrs.src || "");

  const handleSave = () => {
    updateAttributes({ src: tempSrc });
    setIsEditing(false);
  };

  return (
    <IframeWrapper $selected={selected}>
      <div className="iframe-toolbar">
        {isEditing ? (
          <>
            <input
              value={tempSrc}
              onChange={(e) => setTempSrc(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
            />
            <Button onClick={handleSave} size="sm">Save</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit3 size={14} />
            </Button>
            <Button variant="ghost" onClick={deleteNode}>
              <Trash size={14} />
            </Button>
          </>
        )}
      </div>

      {node.attrs.src ? (
        <iframe
          src={node.attrs.src}
          width={node.attrs.width}
          height={node.attrs.height}
          title={node.attrs.title}
          allowFullScreen={node.attrs.allowfullscreen}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <Placeholder>Click edit to set iframe URL</Placeholder>
      )}
    </IframeWrapper>
  );
}

// === Styled Components ===
const IframeWrapper = styled(NodeViewWrapper) <{ $selected?: boolean }>`
  position: relative;
  border: 2px solid ${(p) => (p.$selected ? "#4f46e5" : "transparent")};
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  padding: 8px;
  margin: 1em 0;

  .iframe-toolbar {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    gap: 4px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 4px;
    z-index: 2;
  }

  iframe {
    display: block;
    width: 100%;
    min-height: 300px;
    border: none;
    border-radius: 6px;
  }

  input {
    width: 240px;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const Placeholder = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: italic;
  background: #fafafa;
  border-radius: 6px;
`;

