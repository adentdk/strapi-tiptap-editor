import {
  Table,
  Rows3,
  Columns3,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Check,
  ChevronDown,
} from "lucide-react";
import styled from "styled-components";
import { useEditorContext } from "../partials/editor-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Button } from "../../ui/button";

// Styled Components
const TriggerButton = styled(Button)`
  height: 32px;
  width: auto;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const ChevronIcon = styled(ChevronDown)`
  margin-left: 8px;
  width: 16px;
  height: 16px;
`;

const DropdownMenuGroupStyled = styled(DropdownMenuGroup)`
  width: 200px;
`;

const DropdownMenuItemStyled = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral100};
  }

  &:focus {
    background-color: ${(props) => props.theme.colors.neutral100};
  }
`;

const CheckIcon = styled(Check)`
  margin-left: auto;
  width: 16px;
  height: 16px;
  color: ${(props) => props.theme.colors.primary500};
`;

const StyledTooltipContent = styled(TooltipContent)`
  background-color: ${(props) => props.theme.colors.neutral800};
  color: ${(props) => props.theme.colors.neutral0};
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const OptionIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TableToolbar = () => {
  const { editor } = useEditorContext();

  if (!editor) return null;

  const handleAction = (action: string) => {
    const chain = editor.chain().focus();
    switch (action) {
      case "insert":
        chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
      case "add-row-before":
        chain.addRowBefore().run();
        break;
      case "add-row-after":
        chain.addRowAfter().run();
        break;
      case "add-col-before":
        chain.addColumnBefore().run();
        break;
      case "add-col-after":
        chain.addColumnAfter().run();
        break;
      case "delete-row":
        chain.deleteRow().run();
        break;
      case "delete-col":
        chain.deleteColumn().run();
        break;
      case "delete-table":
        chain.deleteTable().run();
        break;
    }
  };

  const tableActions = [
    { label: "Insert Table", value: "insert", icon: <Table width={16} height={16} /> },
    { label: "Add Row Before", value: "add-row-before", icon: <ArrowUp width={16} height={16} /> },
    { label: "Add Row After", value: "add-row-after", icon: <ArrowDown width={16} height={16} /> },
    { label: "Add Column Before", value: "add-col-before", icon: <ArrowLeft width={16} height={16} /> },
    { label: "Add Column After", value: "add-col-after", icon: <ArrowRight width={16} height={16} /> },
    { label: "Delete Row", value: "delete-row", icon: <Rows3 width={16} height={16} /> },
    { label: "Delete Column", value: "delete-col", icon: <Columns3 width={16} height={16} /> },
    { label: "Delete Table", value: "delete-table", icon: <Trash2 width={16} height={16} /> },
  ];

  const isTableActive = editor.isActive("table");

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <TriggerButton variant="ghost" size="sm">
              <IconWrapper>
                <Table width={16} height={16} />
              </IconWrapper>
              Table
              <ChevronIcon />
            </TriggerButton>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <StyledTooltipContent>Table Actions</StyledTooltipContent>
      </Tooltip>

      <DropdownMenuContent
        loop
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuGroupStyled>
          {tableActions.map((action, idx) => (
            <DropdownMenuItemStyled
              key={idx}
              onSelect={() => handleAction(action.value)}
              disabled={
                action.value !== "insert" && !isTableActive // disable opsional kalau belum ada tabel
              }
            >
              <OptionIcon>{action.icon}</OptionIcon>
              {action.label}
            </DropdownMenuItemStyled>
          ))}
        </DropdownMenuGroupStyled>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
