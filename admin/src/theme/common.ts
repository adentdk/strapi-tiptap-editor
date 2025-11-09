import { css } from 'styled-components';

export const common = css`
  ${({ theme }) => css`
    .ProseMirror {
      display: flex;
      flex-direction: column;
      max-width: 100%;
      padding: 8px 12px;
      cursor: text;
      z-index: 0;
      background-color: var(--tiptap-color-bg);
      color: var(--tiptap-color-body);
      font-size: ${theme.fontSizes[2]};
      line-height: 1.7;
    }

    .ProseMirror.ProseMirror-focused {
      outline: none;
      box-shadow: 0 0 0 1px var(--tiptap-color-ring);
    }

    /* Placeholder */
    .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: var(--tiptap-color-muted);
      float: left;
      height: 0;
      pointer-events: none;
    }

    /* Typography rules */
    .ProseMirror h1,
    .ProseMirror h2,
    .ProseMirror h3,
    .ProseMirror h4 {
      color: var(--tiptap-color-heading);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }

    .ProseMirror h1 {
      font-size: 1.875rem;
    }
    .ProseMirror h2 {
      font-size: 1.5rem;
    }
    .ProseMirror h3 {
      font-size: 1.25rem;
    }
    .ProseMirror h4 {
      font-size: 1.125rem;
    }

    .ProseMirror p {
      margin: 0.75rem 0;
      color: var(--tiptap-color-body);
    }

    .ProseMirror blockquote {
      border-left: 3px solid var(--tiptap-color-border);
      color: var(--tiptap-color-muted);
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
    }

    .ProseMirror code {
      background-color: var(--tiptap-color-code-bg);
      border-radius: ${theme.borderRadius};
      padding: 0.15em 0.3em;
      font-size: 0.9em;
      font-family: monospace;
    }

    .ProseMirror pre {
      background-color: var(--tiptap-color-code-bg);
      padding: 1rem;
      border-radius: ${theme.borderRadius};
      overflow-x: auto;
      font-family: monospace;
    }

    .ProseMirror ul,
    .ProseMirror ol {
      margin: 1rem 0 1rem 2rem;
      padding: 0;
    }

    .ProseMirror li {
      margin: 0.25rem 0;
    }

    .ProseMirror hr {
      border: none;
      border-top: 1px solid var(--tiptap-color-border);
      margin: 2rem 0;
    }

    .ProseMirror a {
      color: var(--tiptap-color-primary);
      text-decoration: underline;
    }

    .ProseMirror img {
      max-width: 100%;
      border-radius: ${theme.borderRadius};
      margin: 1rem 0;
    }

    .ProseMirror figure {
      margin: 1.5rem 0;
    }

    .ProseMirror figcaption {
      font-size: 0.875rem;
      color: var(--tiptap-color-muted);
      margin-top: 0.25rem;
      text-align: center;
    }
  `}
`;
