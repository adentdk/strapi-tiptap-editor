// src/tiptap/extensions/custom-component/CustomComponentEditPopover.tsx
import { useCustomComponentEdit } from './store';
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CustomButtonAttributes, CustomComponentAttributes } from './types';
import { Checkbox } from '@strapi/design-system';
import { Label } from '../../../../components/ui/label';

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

const CheckboxContainer = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled(Label)`
  font-size: 14px;
  font-weight: 500;
`;

export const CustomComponentEditPopover = () => {
  const { isOpen, attrs, close, update } = useCustomComponentEdit();
  const [form, setForm] = useState<CustomComponentAttributes | null>(null);


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

  useEffect(() => {
    if (!attrs) return;

    const clone = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(clone);
      if (obj instanceof Object) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, clone(v)])
        );
      }
      return obj;
    };

    let defaultAttrs = clone(attrs);

    if (attrs.type === 'customButton' && !attrs.buttons) {
      defaultAttrs.buttons = [{ title: 'Click me', url: '', variant: 'primary', size: 'medium' }];
      defaultAttrs.align = 'center';
      defaultAttrs.fullWidth = false;
    }

    if (attrs.type === 'customRelatedItem' && !attrs.layout) {
      defaultAttrs.postIds = '';
      defaultAttrs.layout = 'grid';
      defaultAttrs.maxItems = 3;
    }

    if (attrs.type === 'customBanner' && !attrs.title) {
      defaultAttrs.title = '';
      defaultAttrs.content = '';
      defaultAttrs.variant = 'primary';
      defaultAttrs.action = null;
    }

    setForm(defaultAttrs);
  }, [attrs]);

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
        {form.type === 'customButton' && (
          <>
            <div>
              <Label>Buttons</Label>
              {form.buttons.map((btn: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <Input
                    placeholder="Text"
                    value={btn.title}
                    onChange={e => {
                      setForm(prev => ({
                        ...prev,
                        buttons: (prev as CustomButtonAttributes).buttons.map((b, idx) =>
                          idx === i ? { ...b, title: e.target.value } : b
                        ),
                      }) as any);
                    }}
                    onMouseDown={stopPropagation}
                    onClick={stopPropagation}
                  />
                  <Input
                    placeholder="URL"
                    value={btn.url}
                    onChange={e => {
                      setForm(prev => ({
                        ...prev,
                        buttons: (prev as CustomButtonAttributes).buttons.map((b, idx) =>
                          idx === i ? { ...b, url: e.target.value } : b
                        ),
                      }) as any);
                    }}
                    onMouseDown={stopPropagation}
                    onClick={stopPropagation}
                  />
                  <Select
                    value={btn.variant}
                    onChange={e => {
                      setForm(prev => ({
                        ...prev,
                        buttons: (prev as CustomButtonAttributes).buttons.map((b, idx) =>
                          idx === i ? { ...b, variant: e.target.value as any } : b
                        ),
                      }) as any);
                    }}
                    onMouseDown={stopPropagation}
                    onClick={stopPropagation}
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                  </Select>
                  <button
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        buttons: (prev as CustomButtonAttributes).buttons.filter((_, idx) => idx !== i),
                      }) as any);
                    }}
                    onMouseDown={stopPropagation}
                    style={{ padding: '0 8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4 }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    buttons: [...(prev as CustomButtonAttributes).buttons, { title: 'Button', url: '', variant: 'primary', size: 'medium' }],
                  }) as any);
                }}
                onMouseDown={stopPropagation}
                style={{ marginTop: 8, fontSize: 12, color: '#3b82f6', background: 'none', border: '1px dashed #3b82f6', padding: '4px 8px', borderRadius: 4 }}
              >
                + Add Button
              </button>
            </div>

            <div>
              <Label>Alignment</Label>
              <Select
                value={form.align}
                onChange={e => setForm(prev => ({ ...prev, align: e.target.value }) as any)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </Select>
            </div>

            <div>
              <CheckboxContainer>
                <Checkbox
                  checked={form.fullWidth}
                  onCheckedChange={(checked: boolean) => {
                    setForm(prev => ({ ...prev, fullWidth: checked }) as any);
                  }}
                  id="btn-full-width"
                />
                <CheckboxLabel htmlFor="btn-full-width">
                  Full Width
                </CheckboxLabel>
              </CheckboxContainer>
            </div>
          </>
        )}

        {form.type === 'customRelatedItem' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Post IDs
              </label>
              <Input
                type="text"
                placeholder="1,2,3"
                value={form.itemId ?? ""}
                onChange={e => handleChange('itemId', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Layout
              </label>
              <Select
                value={form.layout ?? "list"}
                onChange={e => handleChange('layout', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
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
                value={form.maxItems ?? 3}
                onChange={e => handleChange('maxItems', parseInt(e.target.value) || 3)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>
          </>
        )}

        {form.type === 'customBanner' && (
          <>
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                placeholder="Banner title"
                value={form.title ?? ""}
                onChange={e => handleChange('title', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
                autoFocus
              />
            </div>

            <div>
              <Label>Content</Label>
              <Textarea
                placeholder="Banner content..."
                value={form.content ?? ""}
                onChange={e => handleChange('content', e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>

            <div>
              <Label>Action Button (optional)</Label>
              <Input
                placeholder="Button text"
                value={form.action?.text || ''}
                onChange={e => handleChange('action', { ...form.action, text: e.target.value })}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
              <Input
                placeholder="Button URL"
                value={form.action?.url || ''}
                onChange={e => handleChange('action', { ...form.action, url: e.target.value })}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
                style={{ marginTop: 4 }}
              />
              {form.action && (
                <button
                  onClick={() => handleChange('action', null)}
                  onMouseDown={stopPropagation}
                  style={{ marginTop: 4, fontSize: 12, color: '#dc2626' }}
                >
                  Remove Action
                </button>
              )}
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
              form.type === 'customButton' ? form.buttons.length === 0
                : form.type === 'customBanner' ? !form.title
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