import { Content, JSONContent } from "@tiptap/core";
import { MessageDescriptor } from "react-intl";

export interface StrapiInputProps {
  attribute: {
    type: string;
    [key: string]: any;
  };
  intlLabel: MessageDescriptor;
  name: string;
  onChange: (event: {
    target: {
      name: string;
      type: string;
      value: any;
    };
  }) => void;
  required?: boolean;
  disabled?: boolean;
  value?: JSONContent | JSONContent[] | null;
}