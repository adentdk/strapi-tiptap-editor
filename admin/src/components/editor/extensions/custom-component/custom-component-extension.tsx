// src/tiptap/extensions/custom-component/CustomComponentExtension.ts
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { CustomComponentRenderer } from './custom-component-renderer';
import { CustomComponentInsertPopover } from './custom-component-insert-popover';

import tippy from 'tippy.js';

export const CustomComponent = Node.create({
  name: 'customComponent',
  group: 'block',
  atom: true,
  priority: 200,

  addAttributes() {
    return {
      type: { default: 'customButton' },

      buttons: { default: undefined },
      align: { default: undefined },
      fullWidth: { default: undefined },

      itemId: { default: undefined },
      layout: { default: undefined },
      maxItems: { default: undefined },

      title: { default: undefined },
      content: { default: undefined },
      variant: { default: undefined },
      action: { default: undefined },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomComponentRenderer);
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }) => {
          editor.chain().focus().insertContentAt(range, { type: this.name, attrs: props }).run();
        },
        items: ({ query }) => {
          const items = [
            { type: 'customButton', label: 'Button', icon: 'Button', description: 'Interactive button' },
            { type: 'customRelatedItem', label: 'Related Post', icon: 'Newspaper', description: 'Show related item' },
            { type: 'customBanner', label: 'Banner', icon: 'Rectangle', description: 'banner' },
          ];
          return query ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : items;
        },
        render: () => {
          let reactRenderer: any;
          let popup: any;

          return {
            onStart: props => {
              if (!props.editor.isEditable) return;
              reactRenderer = new ReactRenderer(CustomComponentInsertPopover, { props, editor: props.editor });
              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: reactRenderer.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },
            onUpdate: props => {
              reactRenderer.updateProps(props);
              popup[0].setProps({ getReferenceClientRect: props.clientRect });
            },
            onExit: () => {
              popup?.[0].destroy();
              reactRenderer?.destroy();
            },
            onKeyDown: () => false,
          };
        },
      }),
    ];
  },
});