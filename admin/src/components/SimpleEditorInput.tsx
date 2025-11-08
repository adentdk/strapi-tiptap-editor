import React from "react";
import { useIntl } from "react-intl";
import { SimpleEditor } from "./editor/simple-editor";
import type { Content } from "@tiptap/react";
import { StrapiInputProps } from "src/types";
import { Field, Flex } from "@strapi/design-system";

/**
 * Tiptap Editor custom field input (for Strapi v5)
 */
const SimpleEditorInput = React.forwardRef<HTMLInputElement, StrapiInputProps>(
  (props, ref) => {
    const {
      attribute,
      disabled = false,
      intlLabel,
      name,
      onChange,
      required = false,
      value,
    } = props;

    const { formatMessage } = useIntl();

    const content = value ?? null;

    const handleEditorChange = (newValue: Content) => {
      onChange({
        target: {
          name,
          type: attribute.type,
          value: newValue,
        },
      });
    };

    return (
      <Field.Root
        name={name}
        id={name}>
        <Flex gap={1} alignItems="normal" style={{ 'flexDirection': 'column' }}>
          <label className="mb-2 block font-medium text-sm text-gray-700">
            {formatMessage(intlLabel)}
          </label>

          <SimpleEditor
            value={content}
            onChange={handleEditorChange}
            disabled={disabled}
            className="min-h-[300px]"
          />

          {required && (
            <span className="text-xs text-gray-500">* required</span>
          )}
        </Flex>
      </Field.Root>
    );
  },
);

SimpleEditorInput.displayName = "SimpleEditorInput";

export default SimpleEditorInput;
