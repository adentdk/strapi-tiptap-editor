import { css } from 'styled-components';
import { colors } from './colors';

export const light = css`
  ${colors}
`;

export const dark = css`
  ${colors}

  :root {
    --tiptap-color-body: hsl(0, 0%, 95%);
    --tiptap-color-heading: hsl(0, 0%, 100%);
    --tiptap-color-muted: hsl(0, 0%, 70%);
    --tiptap-color-bg: hsl(0, 0%, 12%);
    --tiptap-color-border: hsl(0, 0%, 25%);
    --tiptap-color-code-bg: hsl(0, 0%, 18%);
  }
`;
