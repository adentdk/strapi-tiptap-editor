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
      type: { default: undefined },

      buttons: { default: undefined },
      align: { default: undefined },
      fullWidth: { default: undefined },

      label: { default: undefined },
      itemId: { default: undefined },
      layout: { default: undefined },
      maxItems: { default: undefined },

      entity_name: { default: undefined },
      entity_id: { default: undefined },
      custom_attrs: { default: undefined },
    };
  },
  parseDOM: [
    {
      tag: 'div[data-custom-component="true"]',
      getAttrs: (dom: any) => {
        const attrs: any = {
          type: dom.getAttribute('data-type'),
          align: dom.getAttribute('data-align') || undefined,
          fullWidth: dom.getAttribute('data-full-width') === 'true',
          label: dom.getAttribute('data-label') || undefined,
          itemId: dom.getAttribute('data-item-id') || undefined,
          layout: dom.getAttribute('data-layout') || undefined,
          maxItems: dom.getAttribute('data-max-items') ? parseInt(dom.getAttribute('data-max-items'), 10) : undefined,
          entity_name: dom.getAttribute('data-entity-name') || undefined,
          entity_id: dom.getAttribute('data-entity-id') || undefined,
        };

        const buttonsAttr = dom.getAttribute('data-buttons');
        if (buttonsAttr) {
          try {
            attrs.buttons = JSON.parse(buttonsAttr);
          } catch (e) {
            console.error('Failed to parse buttons attribute', e);
          }
        }

        const customAttrsAttr = dom.getAttribute('data-custom-attrs');
        if (customAttrsAttr) {
          try {
            attrs.custom_attrs = JSON.parse(customAttrsAttr);
          } catch (e) {
            console.error('Failed to parse custom_attrs attribute', e);
          }
        }

        return attrs;
      },
    },
  ],

  parseHTML() {
    return [
      {
        tag: 'div[data-custom-component="true"]',
        getAttrs: (dom: string | HTMLElement) => {
          if (typeof dom === 'string') return {};

          const attrs: any = {
            type: dom.getAttribute('data-type'),
            align: dom.getAttribute('data-align') || undefined,
            fullWidth: dom.getAttribute('data-full-width') === 'true',
            label: dom.getAttribute('data-label') || undefined,
            itemId: dom.getAttribute('data-item-id') || undefined,
            layout: dom.getAttribute('data-layout') || undefined,
            maxItems: dom.getAttribute('data-max-items') ? parseInt(dom.getAttribute('data-max-items') || "3", 10) : undefined,
            entity_name: dom.getAttribute('data-entity-name') || undefined,
            entity_id: dom.getAttribute('data-entity-id') || undefined,
          };

          const buttonsAttr = dom.getAttribute('data-buttons');
          if (buttonsAttr) {
            try {
              attrs.buttons = JSON.parse(buttonsAttr);
            } catch (e) {
              console.error('Failed to parse buttons attribute', e);
            }
          }

          const customAttrsAttr = dom.getAttribute('data-custom-attrs');
          if (customAttrsAttr) {
            try {
              attrs.custom_attrs = JSON.parse(customAttrsAttr);
            } catch (e) {
              console.error('Failed to parse custom_attrs attribute', e);
            }
          }

          return attrs;
        },
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { type, buttons, align, fullWidth, label, itemId, layout, maxItems, entity_name, entity_id, custom_attrs } = HTMLAttributes;

    return [
      'div',
      {
        'data-custom-component': 'true',
        'data-type': type,
        'data-align': align,
        'data-full-width': fullWidth,
        'data-label': label,
        'data-item-id': itemId,
        'data-layout': layout,
        'data-max-items': maxItems,
        'data-entity-name': entity_name,
        'data-entity-id': entity_id,
        'data-buttons': buttons ? JSON.stringify(buttons) : undefined,
        'data-custom-attrs': custom_attrs ? JSON.stringify(custom_attrs) : undefined,
        class: 'custom-component-nodeview',
      },
    ];
  },

  toDOM(node: any) {
    const { type, buttons, align, fullWidth, label, itemId, layout, maxItems, entity_name, entity_id, custom_attrs } = node.attrs;

    return [
      'div', {
        'data-custom-component': 'true',
        'data-type': type || 'unknown',
        'data-align': align,
        'data-full-width': fullWidth,
        'data-label': label,
        'data-item-id': itemId,
        'data-layout': layout,
        'data-max-items': maxItems,
        'data-entity-name': entity_name,
        'data-entity-id': entity_id,
        'data-buttons': buttons ? JSON.stringify(buttons) : undefined,
        'data-custom-attrs': custom_attrs ? JSON.stringify(custom_attrs) : undefined,
        class: 'custom-component-nodeview',
      },
    ];
  },
  addNodeView() {
    console.log('🔄 NodeView DILOAD!');
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