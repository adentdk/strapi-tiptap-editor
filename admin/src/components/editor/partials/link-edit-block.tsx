import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "@strapi/design-system";
import styled from "styled-components";

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const StyledLabel = styled(Label)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral800};
  margin-bottom: 4px;
`;

export const LinkEditBlock = forwardRef<HTMLDivElement, LinkEditorProps>(
  ({ onSave, defaultIsNewTab, defaultUrl, defaultText, ...props }, ref) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [url, setUrl] = useState(defaultUrl || "");
    const [text, setText] = useState(defaultText || "");
    const [isNewTab, setIsNewTab] = useState(defaultIsNewTab || false);

    const handleSave = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (formRef.current) {
          const isValid = Array.from(
            formRef.current.querySelectorAll("input"),
          ).every((input) => input.checkValidity());

          if (isValid) {
            onSave(url, text, isNewTab);
          } else {
            formRef.current.querySelectorAll("input").forEach((input) => {
              if (!input.checkValidity()) {
                input.reportValidity();
              }
            });
          }
        }
      },
      [onSave, url, text, isNewTab],
    );

    useImperativeHandle(ref, () => formRef.current as HTMLDivElement);

    return (
      <div ref={formRef} {...props}>
        <Container>
          <FormGroup>
            <StyledLabel>URL</StyledLabel>
            <Input
              type="url"
              required
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <StyledLabel>Display Text (optional)</StyledLabel>
            <Input
              type="text"
              placeholder="Enter display text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </FormGroup>

          <SwitchContainer>
            <StyledLabel>Open in New Tab</StyledLabel>
            <Switch 
              checked={isNewTab} 
              onCheckedChange={setIsNewTab} 
            />
          </SwitchContainer>

          <ButtonContainer>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </ButtonContainer>
        </Container>
      </div>
    );
  },
);

LinkEditBlock.displayName = "LinkEditBlock";

export default LinkEditBlock;