import { type Content, Editor, EditorContent } from "@tiptap/react";
import "./styles.css";
import { LinkBubbleMenu } from "./partials/link-bubble-menu";
import { useEditor, type UseEditorOptions } from "./use-editor";
import { forwardRef, useImperativeHandle } from "react";
import { EditorProvider } from "./partials/editor-provider";
import styled from "styled-components";
import { TooltipProvider } from "../ui/tooltip";

export interface BaseEditorProps
  extends Omit<UseEditorOptions, "onUpdate" | "editable"> {
  onChange?: (value: Content) => void;
  toolbar?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const EditorContainer = styled.div<{ $hasToolbar?: boolean }>`
  border: 1px solid ${props => props.theme.colors.neutral300};
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  
  &:focus-within {
    border-color: ${props => props.theme.colors.primary500};
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 8px;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.neutral200};
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.colors.neutral0};
  z-index: 20;
`;

const ToolbarContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  max-height: 100%;
  width: 100%;
  flex-direction: column;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  background-color: ${props => props.theme.colors.neutral0};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.neutral100};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.neutral300};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.neutral400};
  }
`;

const EditorContentStyled = styled(EditorContent)`
  outline: none;
  border: none;
`;

export const BaseEditor = forwardRef<Editor | null, BaseEditorProps>(
  (
    { toolbar, onChange, value, className, disabled = false, ...options },
    ref,
  ) => {
    const editor = useEditor({
      ...options,
      onUpdate: onChange,
      value,
      editable: !disabled,
      output: "json"
    });

    useImperativeHandle(ref, () => editor as Editor, [editor]);

    if (!editor) {
      return null;
    }

    return (
      <TooltipProvider>
        <EditorProvider editor={editor}>
          <EditorContainer 
            $hasToolbar={!!toolbar}
            className={className}
          >
            {typeof toolbar !== "undefined" ? (
              <ToolbarContainer>
                <ToolbarContent>
                  {toolbar}
                </ToolbarContent>
              </ToolbarContainer>
            ) : null}
            <ContentContainer
              onClick={() => {
                editor?.chain().focus().run();
              }}
            >
              <EditorContentStyled editor={editor} />
              <LinkBubbleMenu />
            </ContentContainer>
          </EditorContainer>
        </EditorProvider>
      </TooltipProvider>
    );
  },
);

BaseEditor.displayName = "BaseEditor";