import { useCallback, useState } from "react";
import { Copy, ExternalLink, Unlink2 } from "lucide-react";
import { Separator } from "../../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";
import ToolbarButton from "./toolbar-button";
import { Button } from "../../ui/button";
import styled from "styled-components";

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  height: 40px;
  overflow: hidden;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.neutral0};
  padding: 8px;
  box-shadow: ${props => props.theme.shadows.popupShadow};
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const IconButton = styled(Button)`
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral100};
  }
`;

const StyledTooltipContent = styled(TooltipContent)`
  background-color: ${props => props.theme.colors.neutral800};
  color: ${props => props.theme.colors.neutral0};
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit,
}) => {
  const [copyTitle, setCopyTitle] = useState<string>("Copy");

  const handleCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle("Copied!");
          setTimeout(() => setCopyTitle("Copy"), 1000);
        })
        .catch(console.error);
    },
    [url],
  );

  const handleOpenLink = useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <Container>
      <ButtonGroup>
        <ToolbarButton tooltip="Edit link" onClick={onEdit}>
          Edit link
        </ToolbarButton>
        <Separator orientation="vertical" />

        <ToolbarButton
          tooltip="Open link in a new tab"
          onClick={handleOpenLink}
        >
          <ExternalLink width={16} height={16} />
        </ToolbarButton>
        
        <Separator orientation="vertical" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton onClick={onClear}>
              <Unlink2 width={16} height={16} />
            </IconButton>
          </TooltipTrigger>
          <StyledTooltipContent>
            <span>Clear link</span>
          </StyledTooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton onClick={handleCopy}>
              <Copy width={16} height={16} />
            </IconButton>
          </TooltipTrigger>
          <StyledTooltipContent
            onPointerDownOutside={(e) =>
              e.target === e.currentTarget && e.preventDefault()
            }
          >
            <span>{copyTitle}</span>
          </StyledTooltipContent>
        </Tooltip>
      </ButtonGroup>
    </Container>
  );
};