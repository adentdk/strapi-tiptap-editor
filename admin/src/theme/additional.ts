import { css } from 'styled-components';

export const additional = css`
  :root {
    --tiptap-editor-min-height: 200px;
    --tiptap-editor-max-height: 600px;
  }

  .ProseMirror {
    min-height: var(--tiptap-editor-min-height);
    max-height: var(--tiptap-editor-max-height);
    overflow-y: auto;
  }
`;
