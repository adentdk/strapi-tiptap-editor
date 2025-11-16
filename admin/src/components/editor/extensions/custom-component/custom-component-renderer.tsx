// src/tiptap/extensions/custom-component/CustomComponentRenderer.tsx
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Edit3, Trash } from 'lucide-react';
import { useCustomComponentEdit } from './store';
import styled from 'styled-components';

const Wrapper = styled(NodeViewWrapper)<{ $selected?: boolean }>`
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
  left: 8px;
  background: ${p => {
    switch (p.$type) {
      case 'customButton': return p.theme.colors.primary500;
      case 'customRelatedPost': return p.theme.colors.success500;
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
    const { type, ...attrs } = node.attrs;
    switch (type) {
      case 'customButton':
        return (
          <div style={{
            display: 'inline-flex',
            padding: attrs.size === 'small' ? '6px 12px' : attrs.size === 'large' ? '12px 24px' : '8px 16px',
            backgroundColor: attrs.variant === 'primary' ? '#3b82f6' : attrs.variant === 'secondary' ? '#6b7280' : 'transparent',
            color: attrs.variant === 'outline' ? '#3b82f6' : 'white',
            border: attrs.variant === 'outline' ? '1px solid #3b82f6' : 'none',
            borderRadius: '6px',
            fontSize: attrs.size === 'small' ? '12px' : attrs.size === 'large' ? '16px' : '14px',
            fontWeight: 500,
          }}>
            {attrs.title || 'Button'}
          </div>
        );

      case 'customRelatedPost':
        const ids = attrs.postIds ? attrs.postIds.split(',').map((s: string) => s.trim()) : ['1', '2', '3'];
        return (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: 'white' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>
              Related Posts {attrs.postIds && `(${ids.length})`}
            </h4>
            <div style={{ display: attrs.layout === 'grid' ? 'grid' : 'block', gap: 12, gridTemplateColumns: attrs.layout === 'grid' ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'none' }}>
              {ids.slice(0, attrs.maxItems || 3).map((id: string, i: number) => (
                <div key={i} style={{ padding: 12, border: '1px solid #f3f4f6', borderRadius: 6, background: '#f9fafb' }}>
                  Related post #{id}
                </div>
              ))}
            </div>
          </div>
        );

      case 'customBanner':
        return (
          <div style={{
            backgroundColor: attrs.theme === 'dark' ? '#1f2937' : attrs.theme === 'primary' ? '#3b82f6' : '#f3f4f6',
            color: attrs.theme === 'dark' || attrs.theme === 'primary' ? 'white' : '#1f2937',
            padding: 20,
            borderRadius: 8,
            textAlign: 'center',
            position: 'relative',
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>
              {attrs.bannerTitle || 'Banner Title'}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>{attrs.content || 'Content...'}</p>
            {attrs.closable && (
              <button style={{
                position: 'absolute', top: 8, right: 8, background: 'none', border: 'none',
                color: 'inherit', fontSize: 18, cursor: 'pointer'
              }}>×</button>
            )}
          </div>
        );

      default:
        return <div>Unknown: {type}</div>;
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