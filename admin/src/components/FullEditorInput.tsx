import React from "react";
import { useIntl } from "react-intl";
import { FullEditor } from "./editor/full-editor";
import type { Content } from "@tiptap/react";
import { StrapiInputProps } from "src/types";

/**
 * Tiptap Editor custom field input (for Strapi v5)
 */
const FullEditorInput = React.forwardRef<HTMLInputElement, StrapiInputProps>(
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
      <div>
        <label className="mb-2 block font-medium text-sm text-gray-700">
          {formatMessage(intlLabel)}
        </label>

        <FullEditor
          value={content}
          onChange={handleEditorChange}
          disabled={disabled}
          className="min-h-[300px]"
        />

        {required && (
          <span className="text-xs text-gray-500">* required</span>
        )}
      </div>
    );
  },
);

FullEditorInput.displayName = "FullEditorInput";

export default FullEditorInput;
