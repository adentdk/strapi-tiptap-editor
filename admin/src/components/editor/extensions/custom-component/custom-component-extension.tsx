// src/tiptap/extensions/custom-component/CustomComponentExtension.ts
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { CustomComponentRenderer } from './custom-component-renderer';
import { CustomComponentInsertPopover } from './custom-component-insert-popover';

import tippy from 'tippy.js';

const CustomComponent = Node.create({
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

      label: { default: undefined },
      itemId: { default: undefined },
      layout: { default: undefined },
      maxItems: { default: undefined },

      title: { default: undefined },
      content: { default: undefined },
      variant: { default: undefined },
      action: { default: undefined },

      entity_name: { default: undefined },
      entity_id: { default: undefined },
      custom_attrs: { default: undefined },
    };
  },
  parseDOM: [  // Tambah ini juga, biar parsing HTML aman
    {
      tag: 'div[data-node-type="customComponent"]',
      getAttrs(dom: any) {
        return {
          type: dom.getAttribute('data-component-type'),
          // ... attrs lain
        };
      },
    },
  ],
  // INI YANG PALING PENTING BUAT type: "json"


  parseHTML() {
    return [
      {
        tag: 'div',
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { style: 'margin: 1em 0; text-align: center;' }
    ];

  },
  // INI YANG HARUS SELALU ADA & RETURN ARRAY YANG VALID
  toDOM(node: any) {
    return [
      'div', {
        'data-custom-component': 'true',
        'data-type': node.attrs.type || 'customButton',
        class: 'custom-component-nodeview', // biar bisa di-style
        // jangan kasih contenteditable: false di sini, biar Tiptap handle
      },
      0, // 0 = content slot (wajib untuk atom node)
    ];
  },
  addNodeView() {
    console.log('🔄 NodeView DILOAD!'); // Debug
    try {
      return ReactNodeViewRenderer(CustomComponentRenderer);
    } catch (error) {
      return ReactNodeViewRenderer(() => <div></div>)
    }
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
            { type: 'customButton', label: 'Button', description: 'Interactive button' },
            { type: 'customRelatedItem', label: 'Related Item', description: 'Show related item' },
            { type: 'customBanner', label: 'Banner', description: 'Show Banner' },
            { type: 'customEntity', label: 'Custom', description: 'Show custom related entity' },
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

export default CustomComponent