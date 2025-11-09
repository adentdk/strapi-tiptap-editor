import React from "react";
import { useIntl } from "react-intl";
import { SimpleEditor } from "./editor/simple-editor";
import type { Content } from "@tiptap/react";
import { TiptapJSONInputProps } from "src/types";
import { Field, Flex } from '@strapi/design-system';
import styled from "styled-components";

const Container = styled(Flex)`
  flex-direction: column;
  gap: 4px;
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
const SimpleEditorInput = React.forwardRef<{ focus: () => void }, TiptapJSONInputProps>(
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
          
          <EditorContainer>
            <SimpleEditor
              value={value}
              onChange={handleEditorChange}
              disabled={disabled}
              placeholder={placeholder}
            />
          </EditorContainer>

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

SimpleEditorInput.displayName = "SimpleEditorInput";

export default SimpleEditorInput;