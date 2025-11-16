// src/tiptap/extensions/custom-component/CustomComponentRenderer.tsx
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Edit3, Trash } from 'lucide-react';
import { useCustomComponentEdit } from './store';
import styled from 'styled-components';
import { CustomComponentAttributes } from './types';

const Wrapper = styled(NodeViewWrapper) <{ $selected?: boolean }>`
  position: relative;
  margin: 16px 0;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 16px;
  background-color: ${p => p.theme.colors.neutral100};
  ${p => p.$selected && `border-color: ${p.theme.colors.primary500}; background-color: ${p.theme.colors.primary100};`}
`;

const Toolbar = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  ${Wrapper}:hover & { opacity: 1; }
`;

const Badge = styled.div<{ $type: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${p => {
    switch (p.$type) {
      case 'customButton': return p.theme.colors.primary500;
      case 'customRelatedItem': return p.theme.colors.success500;
      case 'customBanner': return p.theme.colors.warning500;
      default: return p.theme.colors.neutral500;
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const CustomComponentRenderer = (props: any) => {
  const { node, editor, getPos, deleteNode, selected } = props;
  const { open } = useCustomComponentEdit();

  const handleEdit = () => {
    if (!editor.isEditable) return;
    open(editor, getPos(), node.attrs);
  };

  const renderPreview = () => {
    const attrs = node.attrs as CustomComponentAttributes;
    switch (attrs.type) {
      case 'customButton':
        return (
          <div style={{
            display: 'flex',
            justifyContent: attrs.align === 'left' ? 'flex-start' : attrs.align === 'right' ? 'flex-end' : 'center',
            width: attrs.fullWidth ? '100%' : 'auto',
            gap: 12,
            flexWrap: 'wrap' as const,
          }}>
            {attrs.buttons.map((btn: any, i: number) => (
              <div
                key={i}
                style={{
                  padding: btn.size === 'small' ? '6px 12px' : btn.size === 'large' ? '12px 24px' : '8px 16px',
                  backgroundColor: btn.variant === 'primary' ? '#3b82f6' : btn.variant === 'secondary' ? '#6b7280' : 'transparent',
                  color: btn.variant === 'outline' ? '#3b82f6' : 'white',
                  border: btn.variant === 'outline' ? '1px solid #3b82f6' : 'none',
                  borderRadius: 6,
                  fontSize: btn.size === 'small' ? 12 : btn.size === 'large' ? 16 : 14,
                  fontWeight: 500,
                  textAlign: 'center' as const,
                  minWidth: 80,
                }}
              >
                {btn.title}
              </div>
            ))}
            {attrs.buttons.length === 0 && <div style={{ opacity: 0.5 }}>No buttons</div>}
          </div>
        );

      case 'customRelatedItem':
        const ids = attrs.itemId ? attrs.itemId.split(',').map((s: string) => s.trim()) : ['1', '2', '3'];
        return (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: 'white' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>
              {attrs.label} {attrs.itemId && `(${ids.length})`}
            </h4>
            <div style={{ display: attrs.layout === 'grid' ? 'grid' : 'block', gap: 12, gridTemplateColumns: attrs.layout === 'grid' ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'none' }}>
              {ids.slice(0, attrs.maxItems || 1).map((id: string, i: number) => (
                <div key={i} style={{ padding: 12, border: '1px solid #f3f4f6', borderRadius: 6, background: '#f9fafb' }}>
                  Related item #{id}
                </div>
              ))}
            </div>
          </div>
        );

      case 'customBanner':
        return (
          <div style={{
            padding: 24,
            borderRadius: 12,
            textAlign: 'center' as const,
            position: 'relative' as const,
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600 }}>
              {attrs.title || 'Title Here'}
            </h3>
            <p style={{ margin: 0, opacity: 0.85, fontSize: 15 }}>
              {attrs.content || 'Content here...'}
            </p>
            {attrs.action && (
              <div style={{ marginTop: 16 }}>
                <a
                  href={attrs.action.url}
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    borderRadius: 6,
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  {attrs.action.text}
                </a>
              </div>
            )}
          </div>
        );

      case 'customEntity':
        return (
          <span
            style={{
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 12,
              fontFamily: 'monospace',
              display: 'inline-block',
            }}
          >
            Entity: {attrs.entity_name}#{attrs.entity_id}
            {Object.keys(attrs.custom_attrs || {}).length > 0 && (
              <span style={{ marginLeft: 8, opacity: 0.8 }}>
                ({Object.keys(attrs.custom_attrs).length} props)
              </span>
            )}
          </span>
        );

      default:
        return <div>Unknown</div>;
    }
  };

  return (
    <Wrapper $selected={selected}>
      <Badge $type={node.attrs.type}>
        {node.attrs.type.replace('custom', '')}
      </Badge>
      <NodeViewContent>
        {renderPreview()}
      </NodeViewContent>
      {editor.isEditable && (
        <Toolbar>
          <button onClick={handleEdit} style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 4, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Edit3 size={14} />
          </button>
          <button onClick={deleteNode} style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 4, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash size={14} />
          </button>
        </Toolbar>
      )}
    </Wrapper>
  );
};