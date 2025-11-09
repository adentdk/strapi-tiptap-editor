import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Repeat, X } from "lucide-react";
import { useEditorContext } from "../partials/editor-provider";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import ToolbarButton from "../partials/toolbar-button";
import { SearchAndReplaceStorage } from "../extensions/search-and-replace";
import { Checkbox, Popover } from "@strapi/design-system";
import styled from "styled-components";

const RepeatIcon = styled(Repeat)`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const ArrowIcon = styled.div`
  width: 16px;
  height: 16px;
`;

const CloseIcon = styled(X)`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const PopoverContent = styled(Popover.Content)`
  position: relative;
  display: flex;
  width: 400px;
  padding: 10px 12px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  gap: 6px;
  align-items: center;
`;

const SearchInput = styled(Input)`
  width: 192px;
`;

const ResultCount = styled.span`
  font-size: 14px;
`;

const IconButton = styled(Button)`
  width: 28px;
  height: 28px;
`;

const VerticalSeparator = styled(Separator)`
  height: 28px;
  margin: 0 2px;
`;

const ReplaceContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CloseButton = styled(CloseIcon)`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled(IconButton)`
  border-radius: 50%;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
`;

const FormSection = styled.div`
  margin: 8px 0;
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 12px;
`;

const InputLabel = styled(Label)`
  margin-bottom: 4px;
  font-size: 12px;
  color: ${props => props.theme.colors.neutral600};
`;

const CheckboxContainer = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled(Label)`
  font-size: 14px;
  font-weight: 500;
`;

const ActionsContainer = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavigationButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MainActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled(Button)`
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
`;

const TriggerButton = styled(ToolbarButton)`
  height: 32px;
  width: fit-content;
  min-width: 128px;
  padding: 0 12px;
  font-weight: 400;
  display: flex;
  align-items: center;
`;

export function SearchAndReplaceToolbar() {
  const { editor } = useEditorContext();

  const [open, setOpen] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [checked, setChecked] = useState(false);

  const results = editor?.storage?.searchAndReplace
    .results as SearchAndReplaceStorage["results"];
  const selectedResult = editor?.storage?.searchAndReplace
    .selectedResult as SearchAndReplaceStorage["selectedResult"];

  const replace = () => editor?.chain().replace().run();
  const replaceAll = () => editor?.chain().replaceAll().run();
  const selectNext = () => editor?.chain().selectNextResult().run();
  const selectPrevious = () => editor?.chain().selectPreviousResult().run();

  useEffect(() => {
    editor?.chain().setSearchTerm(searchText).run();
  }, [searchText, editor]);

  useEffect(() => {
    editor?.chain().setReplaceTerm(replaceText).run();
  }, [replaceText, editor]);

  useEffect(() => {
    editor?.chain().setCaseSensitive(checked).run();
  }, [checked, editor]);

  useEffect(() => {
    if (!open) {
      setReplaceText("");
      setSearchText("");
      setReplacing(false);
    }
  }, [open]);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger disabled={!editor}>
        <TriggerButton
          tooltip="Search & Replace"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <RepeatIcon />
          <p>Search & Replace</p>
        </TriggerButton>
      </Popover.Trigger>

      <PopoverContent
        align="end"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={() => {
          setOpen(false);
        }}
      >
        {!replacing ? (
          <SearchContainer>
            <SearchInput
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              placeholder="Search..."
            />
            <ResultCount>
              {results?.length === 0 ? selectedResult : selectedResult + 1}/
              {results?.length}
            </ResultCount>
            <IconButton
              onClick={selectPrevious}
              size="icon"
              variant="ghost"
            >
              <ArrowIcon as={ArrowLeft} />
            </IconButton>
            <IconButton
              onClick={selectNext}
              size="icon"
              variant="ghost"
            >
              <ArrowIcon as={ArrowRight} />
            </IconButton>
            <VerticalSeparator orientation="vertical" />
            <IconButton
              onClick={() => {
                setReplacing(true);
              }}
              size="icon"
              variant="ghost"
            >
              <ArrowIcon as={Repeat} />
            </IconButton>
            <IconButton
              onClick={() => {
                setOpen(false);
              }}
              size="icon"
              variant="ghost"
            >
              <ArrowIcon as={X} />
            </IconButton>
          </SearchContainer>
        ) : (
          <ReplaceContainer>
            <CloseButton
              onClick={() => {
                setOpen(false);
              }}
            />
            <Header>
              <BackButton
                size="icon"
                variant="ghost"
                onClick={() => {
                  setReplacing(false);
                }}
              >
                <ArrowIcon as={ArrowLeft} />
              </BackButton>
              <Title>Search and replace</Title>
            </Header>

            <FormSection>
              <InputGroup>
                <InputLabel>Search</InputLabel>
                <Input
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  placeholder="Search..."
                />
                <ResultCount>
                  {results?.length === 0 ? selectedResult : selectedResult + 1}/
                  {results?.length}
                </ResultCount>
              </InputGroup>
              <InputGroup>
                <InputLabel>Replace with</InputLabel>
                <Input
                  value={replaceText}
                  onChange={(e) => {
                    setReplaceText(e.target.value);
                  }}
                  placeholder="Replace..."
                />
              </InputGroup>
              <CheckboxContainer>
                <Checkbox
                  checked={checked}
                  onCheckedChange={(checked: boolean) => {
                    setChecked(checked);
                  }}
                  id="match_case"
                />
                <CheckboxLabel htmlFor="match_case">
                  Match case
                </CheckboxLabel>
              </CheckboxContainer>
            </FormSection>

            <ActionsContainer>
              <NavigationButtons>
                <IconButton
                  onClick={selectPrevious}
                  size="icon"
                  variant="secondary"
                >
                  <ArrowIcon as={ArrowLeft} />
                </IconButton>
                <IconButton
                  onClick={selectNext}
                  size="icon"
                  variant="secondary"
                >
                  <ArrowIcon as={ArrowRight} />
                </IconButton>
              </NavigationButtons>

              <MainActions>
                <ActionButton
                  variant="secondary"
                  onClick={replaceAll}
                >
                  Replace All
                </ActionButton>
                <ActionButton
                  onClick={replace}
                >
                  Replace
                </ActionButton>
              </MainActions>
            </ActionsContainer>
          </ReplaceContainer>
        )}
      </PopoverContent>
    </Popover.Root>
  );
}