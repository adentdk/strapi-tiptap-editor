// src/tiptap/extensions/custom-component/CustomComponentEditPopover.tsx
import { useCustomComponentEdit } from './store';
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Popover = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  z-index: 9999;
  overflow: hidden;
  padding: 20px;
`;

const Header = styled.div`
  margin: -20px -20px 16px -20px;
  padding: 16px 20px;
  background: ${p => p.theme.colors.neutral100};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.colors.neutral200};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${p => p.theme.colors.neutral300};
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: ${p => p.theme.colors.primary500};
    box-shadow: 0 0 0 2px ${p => p.theme.colors.primary100};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${p => p.theme.colors.neutral300};
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${p => p.theme.colors.primary500};
    box-shadow: 0 0 0 2px ${p => p.theme.colors.primary100};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${p => p.theme.colors.neutral300};
  border-radius: 6px;
  min-height: 80px;
  resize: vertical;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${p => p.theme.colors.primary500};
    box-shadow: 0 0 0 2px ${p => p.theme.colors.primary100};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const Btn = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;

  ${p => p.$primary
    ? `
      background: ${p.theme.colors.primary600};
      color: white;
      &:hover { background: ${p.theme.colors.primary700}; }
    `
    : `
      background: transparent;
      border-color: ${p.theme.colors.neutral300};
      color: ${p.theme.colors.neutral700};
      &:hover { background: ${p.theme.colors.neutral100}; }
    `
  }
`;

export const CustomComponentEditPopover = () => {
  const { isOpen, attrs, close, update } = useCustomComponentEdit();
  const [form, setForm] = useState<any>(attrs);

  useEffect(() => {
    if (attrs) setForm(attrs);
  }, [attrs]);

  // STOP ALL EVENTS FROM BUBBLING TO EDITOR
  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    // e.preventDefault();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (form) update(form);
  };

  if (!isOpen || !attrs || !form) return null;

  return (
    <Popover
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
      onMouseUp={stopPropagation}
      onKeyDown={stopPropagation}
    >
      <Header>
        <span>Edit {attrs.type.replace('custom', '').replace(/([A-Z])/g, ' $1').trim()}</span>
        <button
          onClick={close}
          onMouseDown={stopPropagation}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 0 }}
        >
          ×
        </button>
      </Header>

      <Body>
        {attrs.type === 'customButton' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Title *
              </label>
              <Input
                type="text"
                placeholder="Button text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Variant
              </label>
              <Select
                value={form.variant}
                onChange={e => handleChange('variant', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Size
              </label>
              <Select
                value={form.size}
                onChange={e => handleChange('size', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                URL (optional)
              </label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={form.url || ''}
                onChange={e => handleChange('url', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>
          </>
        )}

        {attrs.type === 'customRelatedPost' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Post IDs
              </label>
              <Input
                type="text"
                placeholder="1,2,3"
                value={form.postIds}
                onChange={e => handleChange('postIds', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Layout
              </label>
              <Select
                value={form.layout}
                onChange={e => handleChange('layout', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
                <option value="carousel">Carousel</option>
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Max Items
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={form.maxItems}
                onChange={e => handleChange('maxItems', parseInt(e.target.value) || 3)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>
          </>
        )}

        {attrs.type === 'customBanner' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Title *
              </label>
              <Input
                type="text"
                placeholder="Banner title"
                value={form.bannerTitle}
                onChange={e => handleChange('bannerTitle', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Content
              </label>
              <Textarea
                placeholder="Banner content..."
                value={form.content}
                onChange={e => handleChange('content', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Theme
              </label>
              <Select
                value={form.theme}
                onChange={e => handleChange('theme', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="primary">Primary</option>
              </Select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={form.closable}
                onChange={e => handleChange('closable', e.target.checked)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
              <label style={{ fontSize: 14, cursor: 'pointer' }} onMouseDown={stopPropagation}>
                Show Close Button
              </label>
            </div>
          </>
        )}

        <Actions>
          <Btn onClick={close} onMouseDown={stopPropagation}>
            Cancel
          </Btn>
          <Btn
            $primary
            onClick={handleSubmit}
            onMouseDown={stopPropagation}
            disabled={
              attrs.type === 'customButton' ? !form.title
              : attrs.type === 'customBanner' ? !form.bannerTitle
              : false
            }
          >
            Update
          </Btn>
        </Actions>
      </Body>
    </Popover>
  );
};