import { useCallback, useState } from "react";

import { Copy, ExternalLink, Unlink2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

import ToolbarButton from "./toolbar-button";

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

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
    <div className="flex h-10 overflow-hidden rounded bg-background p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton tooltip="Edit link" className="w-auto" onClick={onEdit}>
          Edit link
        </ToolbarButton>
        <Separator orientation="vertical" />

        <ToolbarButton
          tooltip="Open link in a new tab"
          onClick={handleOpenLink}
        >
          <ExternalLink className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onClear}>
              <Unlink2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Clear link</span>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleCopy}>
              <Copy className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            onPointerDownOutside={(e) =>
              e.target === e.currentTarget && e.preventDefault()
            }
          >
            <span>{copyTitle}</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
