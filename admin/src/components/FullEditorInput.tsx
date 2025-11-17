import React from "react";
import { useIntl } from "react-intl";
import { FullEditor } from "./editor/full-editor";
import type { Content } from "@tiptap/react";
import { TiptapJSONInputProps } from "../types";
import { Field, Flex } from '@strapi/design-system';
import styled from "styled-components";
import { GlobalStyling } from "./GlobalStyling";
import { CustomComponentProvider } from "./editor/extensions/custom-component/store";
const Container = styled(Flex)`
  flex-direction: column;
  gap: 4px;
  align-items: stretch;
`;

const RequiredIndicator = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.neutral600};
  margin-top: 4px;
`;

const EditorContainer = styled.div`
  min-height: 300px;
`;

/**
 * Tiptap Editor custom field input (for Strapi v5)
 */
const FullEditorInput = React.forwardRef<{ focus: () => void }, TiptapJSONInputProps>(
  (
    {
      name,
      hint,
      error,
      placeholder,
      label,
      attribute,
      labelAction = null,
      disabled = false,
      required = false,
      onChange,
      value,
    }: TiptapJSONInputProps,
    forwardedRef
  ) => {
    const { formatMessage } = useIntl();

    const handleEditorChange = (content: Content) => {
      if (!onChange) return;

      // Construct a ChangeEvent-like object and cast it to satisfy the expected type
      const evt = {
        target: {
          name,
          value: content,
          type: "json",
        },
      } as unknown as React.ChangeEvent<any>;

      onChange(evt);
    };

    const isFieldLocalized = attribute?.pluginOptions?.i18n?.localized ?? false;

    return (
      <Field.Root
        name={name}
        id={name}
        error={error}
        hint={hint}
        required={required}
      >
        <Container>
          <Field.Label action={labelAction}>
            {label}
          </Field.Label>


          <GlobalStyling />

          <CustomComponentProvider>
            <EditorContainer>
              <FullEditor
                value={value}
                onChange={handleEditorChange}
                disabled={disabled}
                placeholder={placeholder}
              />
            </EditorContainer>
          </CustomComponentProvider>

          <Field.Hint />
          <Field.Error />

          {required && (
            <RequiredIndicator>* required</RequiredIndicator>
          )}
        </Container>
      </Field.Root>
    );
  },
);

FullEditorInput.displayName = "FullEditorInput";

export default FullEditorInput;