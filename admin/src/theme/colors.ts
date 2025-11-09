import { css } from 'styled-components';

export const colors = css`
  ${({ theme }) => css`
    :root {
      --tiptap-color-body: ${theme.colors.neutral800};
      --tiptap-color-heading: ${theme.colors.neutral900};
      --tiptap-color-muted: ${theme.colors.neutral500};
      --tiptap-color-border: ${theme.colors.neutral200};
      --tiptap-color-bg: ${theme.colors.neutral0};
      --tiptap-color-code-bg: ${theme.colors.neutral100};
      --tiptap-color-primary: ${theme.colors.primary600};
      --tiptap-color-ring: ${theme.colors.primary200};
    }
  `}
`;
