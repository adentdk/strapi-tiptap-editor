import { forwardRef, useCallback, useState } from "react";
import { MonitorPlay } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/toolbar-button";
import { Checkbox, Popover } from "@strapi/design-system";
import styled from "styled-components";

// Styled Components
const IframeIcon = styled(MonitorPlay)`
  width: 20px;
  height: 20px;
`;

const PopoverContent = styled(Popover.Content)`
  width: 100%;
  min-width: 360px;
  padding: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.neutral700};
`;

const Input = styled.input`
  border: 1px solid ${(props) => props.theme.colors.neutral200};
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary500};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
`;

const SmallButton = styled.button<{ variant?: "primary" | "ghost" }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background-color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.primary600
      : theme.colors.neutral100};
  color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.neutral0
      : theme.colors.neutral700};

  &:hover {
    opacity: 0.9;
  }
`;

export const IframeToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    const [open, setOpen] = useState(false);
    const [src, setSrc] = useState("");
    const [width, setWidth] = useState("560");
    const [height, setHeight] = useState("315");
    const [allowFullscreen, setAllowFullscreen] = useState(true);

    const onInsertIframe = useCallback(() => {
      if (!src) return;
      editor
        ?.chain()
        .focus()
        .setIframe({
          src,
          width,
          height,
          allowfullscreen: allowFullscreen,
          frameborder: 0,
        })
        .run();
      setOpen(false);
      setSrc("");
    }, [editor, src, width, height, allowFullscreen]);

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <ToolbarButton
            tooltip="Insert Iframe"
            aria-label="Insert Iframe"
            isActive={editor?.isActive("iframe")}
            {...props}
            ref={ref}
          >
            <IframeIcon />
          </ToolbarButton>
        </Popover.Trigger>

        <PopoverContent align="end" side="bottom">
          <FormGroup>
            <Label>Iframe Source (URL)</Label>
            <Input
              type="url"
              placeholder="https://www.youtube.com/embed/xxxx"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
            />

            <Label>Width (px)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />

            <Label>Height (px)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />

            <label style={{ fontSize: "13px" }}>
              <input
                type="checkbox"
                checked={allowFullscreen}
                onChange={(e) => setAllowFullscreen(e.target.checked)}
                style={{ marginRight: "6px" }}
              />
              Allow Fullscreen
            </label>

            <ButtonRow>
              <SmallButton onClick={() => setOpen(false)}>Cancel</SmallButton>
              <SmallButton variant="primary" onClick={onInsertIframe}>
                Insert
              </SmallButton>
            </ButtonRow>
          </FormGroup>
        </PopoverContent>
      </Popover.Root>
    );
  },
);

IframeToolbar.displayName = "IframeToolbar";
