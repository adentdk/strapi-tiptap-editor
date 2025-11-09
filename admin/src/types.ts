import { JSONContent } from "@tiptap/core";
import type { InputProps, FieldValue } from '@strapi/strapi/admin';
export type TiptapJSONInputProps = Readonly<
  InputProps &
  FieldValue & {
    value?: JSONContent | JSONContent[] | null;
    labelAction?: React.ReactNode;
    attribute: {
      options: {
      };
      pluginOptions?: {
        i18n?: {
          localized?: boolean;
        };
      };
    };
  }
>;