import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Node } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import scrollIntoView from 'scroll-into-view-if-needed';
import tippy from 'tippy.js';
import { NodeViewWrapper } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import styled from 'styled-components';
import { Edit3, Trash } from 'lucide-react';

export const EXTENSION_PRIORITY_HIGHEST = 200;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customComponents: {
      setCustomButton: (props: CustomButtonAttributes) => ReturnType;
      setCustomRelatedPost: (props: CustomRelatedPostAttributes) => ReturnType;
      setCustomBanner: (props: CustomBannerAttributes) => ReturnType;
    };
  }
}

declare global {
  interface Window {
    __editCustomComponent?: {
      node: any;
      pos: number;
      update: (attrs: any) => void;
      close: () => void;
    };
  }
}

export const CustomComponentPluginKey = new PluginKey('customComponents');

// === TYPE DEFINITIONS ===
interface CustomButtonAttributes {
  title: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  url?: string;
}

interface CustomRelatedPostAttributes {
  itemId: string;
  layout: 'grid' | 'list' | 'carousel';
  maxItems: number;
}

interface CustomBannerAttributes {
  bannerTitle: string;
  content: string;
  theme: 'light' | 'dark' | 'primary';
  closable: boolean;
}

type CustomComponentType = 'customButton' | 'customRelatedItem' | 'customBanner';

interface CustomComponentProps {
  type: CustomComponentType;
  [key: string]: any;
}

// === STYLED COMPONENTS ===
const SuggestionContainer = styled.div`
  width: 320px;
  max-height: 400px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  box-shadow: ${props => props.theme.shadows.popupShadow};
  overflow: hidden;
`;

const SuggestionHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.neutral200};
  background-color: ${props => props.theme.colors.neutral100};
`;

const SuggestionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral800};
  margin: 0;
`;

const SuggestionList = styled.div`
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  ${props => props.$selected && `
    background-color: ${props.theme.colors.primary100};
    border-color: ${props.theme.colors.primary200};
  `}

  &:hover {
    background-color: ${props => props.theme.colors.neutral100};
  }
`;

const ComponentIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.primary100};
  color: ${props => props.theme.colors.primary600};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const ComponentInfo = styled.div`
  flex: 1;
`;

const ComponentName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral800};
  margin-bottom: 2px;
`;

const ComponentDescription = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.neutral600};
`;

const FormContainer = styled.div`
  padding: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral700};
  margin-bottom: 6px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  border-radius: 4px;
  font-size: 14px;
  background-color: ${props => props.theme.colors.neutral0};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary500};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary100};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  border-radius: 4px;
  font-size: 14px;
  background-color: ${props => props.theme.colors.neutral0};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary500};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary100};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  border-radius: 4px;
  font-size: 14px;
  background-color: ${props => props.theme.colors.neutral0};
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary500};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary100};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.neutral200};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.$variant === 'primary' ? `
    background-color: ${props.theme.colors.primary600};
    border-color: ${props.theme.colors.primary600};
    color: ${props.theme.colors.neutral0};
    
    &:hover {
      background-color: ${props.theme.colors.primary700};
      border-color: ${props.theme.colors.primary700};
    }
  ` : `
    background-color: transparent;
    border-color: ${props.theme.colors.neutral300};
    color: ${props.theme.colors.neutral700};
    
    &:hover {
      background-color: ${props.theme.colors.neutral100};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  background: none;
  border: none;
  color: ${props => props.theme.colors.neutral600};
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover {
    color: ${props => props.theme.colors.neutral800};
  }
`;

// === CUSTOM COMPONENT NODE VIEW ===
const CustomComponentWrapper = styled(NodeViewWrapper) <{ $selected?: boolean }>`
  position: relative;
  display: block;
  margin: 16px 0;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 16px;
  background-color: ${props => props.theme.colors.neutral100};
  
  ${props => props.$selected && `
    border-color: ${props.theme.colors.primary500};
    background-color: ${props.theme.colors.primary100};
  `}
`;

const ComponentToolbar = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${CustomComponentWrapper}:hover & {
    opacity: 1;
  }
`;

const ToolbarButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid ${props => props.theme.colors.neutral300};
  background-color: ${props => props.theme.colors.neutral0};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.neutral600};
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral100};
    color: ${props => props.theme.colors.neutral800};
  }
`;

const ComponentContent = styled.div`
  min-height: 40px;
`;

const ComponentBadge = styled.div<{ $type: string }>`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: ${props => {
    switch (props.$type) {
      case 'customButton': return props.theme.colors.primary500;
      case 'customRelatedItem': return props.theme.colors.success500;
      case 'customBanner': return props.theme.colors.warning500;
      default: return props.theme.colors.neutral500;
    }
  }};
  color: ${props => props.theme.colors.neutral0};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
`;

// Komponen untuk render custom component di editor
function CustomComponentRenderer(props: any) {
  const { node, selected, deleteNode, updateAttributes, editor } = props;
  const { type, ...componentProps } = node.attrs;

  const handleEdit = () => {
    const { node, editor, getPos } = props;
    if (!editor.isEditable) return;

    // Pilih node dulu
    const pos = getPos();
    editor.chain().focus().setNodeSelection(pos).run();

    // Simpan data ke state global atau context (kita pakai closure sederhana)
    window.__editCustomComponent = {
      node,
      pos,
      update: (newAttrs: any) => {
        editor
          .chain()
          .focus()
          .updateAttributes('customComponent', { ...node.attrs, ...newAttrs })
          .setNodeSelection(pos)
          .run();
      },
      close: () => {
        delete window.__editCustomComponent;
      }
    };

    // Trigger suggestion
    const event = new KeyboardEvent('keydown', {
      key: '/',
      bubbles: true,
      cancelable: true,
    });
    editor.view.dom.dispatchEvent(event);
  };

  const renderComponent = () => {
    switch (type) {
      case 'customButton':
        return (
          <div style={{
            display: 'inline-flex',
            padding: componentProps.size === 'small' ? '6px 12px' :
              componentProps.size === 'large' ? '12px 24px' : '8px 16px',
            backgroundColor: componentProps.variant === 'primary' ? '#3b82f6' :
              componentProps.variant === 'secondary' ? '#6b7280' : 'transparent',
            color: componentProps.variant === 'outline' ? '#3b82f6' : 'white',
            border: componentProps.variant === 'outline' ? '1px solid #3b82f6' : 'none',
            borderRadius: '6px',
            fontSize: componentProps.size === 'small' ? '12px' :
              componentProps.size === 'large' ? '16px' : '14px',
            fontWeight: '500',
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            {componentProps.title || 'Button'}
          </div>
        );

      case 'customRelatedItem':
        const itemId = componentProps.itemId ? componentProps.itemId.split(',').map((id: string) => id.trim()) : [];
        const displayIds = itemId.length > 0 ? itemId : ['1', '2', '3'];

        return (
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'white'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              Related Posts {componentProps.itemId && `(${itemId.length})`}
            </h4>
            <div style={{
              display: componentProps.layout === 'grid' ? 'grid' : 'block',
              gridTemplateColumns: componentProps.layout === 'grid' ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'none',
              gap: '12px'
            }}>
              {displayIds.slice(0, componentProps.maxItems || 3).map((id: string, i: number) => (
                <div key={i} style={{
                  padding: '12px',
                  border: '1px solid #f3f4f6',
                  borderRadius: '6px',
                  backgroundColor: '#f9fafb'
                }}>
                  Related post #{id}
                </div>
              ))}
            </div>
          </div>
        );

      case 'customBanner':
        return (
          <div style={{
            backgroundColor: componentProps.theme === 'dark' ? '#1f2937' :
              componentProps.theme === 'primary' ? '#3b82f6' : '#f3f4f6',
            color: componentProps.theme === 'dark' || componentProps.theme === 'primary' ? 'white' : '#1f2937',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
              {componentProps.bannerTitle || 'Banner Title'}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              {componentProps.content || 'Banner content goes here...'}
            </p>
            {componentProps.closable && (
              <button style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                opacity: 0.7,
                fontSize: '18px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ×
              </button>
            )}
          </div>
        );

      default:
        return <div>Unknown component: {type}</div>;
    }
  };

  return (
    <CustomComponentWrapper $selected={selected}>
      <ComponentBadge $type={type}>
        {type.replace('custom', '')}
      </ComponentBadge>

      <ComponentContent>
        {renderComponent()}
      </ComponentContent>

      {editor?.isEditable && (
        <ComponentToolbar>
          <ToolbarButton onClick={handleEdit}>
            <Edit3 size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={deleteNode}>
            <Trash size={14} />
          </ToolbarButton>
        </ComponentToolbar>
      )}
    </CustomComponentWrapper>
  );
}

const renderCustomComponent = (props: CustomComponentProps) => {
  return {
    type: 'customComponent',
    attrs: props
  };
};

export const CustomComponent = Node.create({
  name: 'customComponent',
  group: 'block',
  content: 'text*',
  atom: true,

  priority: EXTENSION_PRIORITY_HIGHEST,

  addAttributes() {
    return {
      type: { default: 'customButton' },
      // Button attributes
      title: { default: '' },
      variant: { default: 'primary' },
      size: { default: 'medium' },
      url: { default: '' },
      // Related Post attributes
      itemId: { default: '' },
      layout: { default: 'grid' },
      maxItems: { default: 3 },
      // Banner attributes
      bannerTitle: { default: '' },
      content: { default: '' },
      theme: { default: 'light' },
      closable: { default: false }
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
      suggestion: {
        char: '/',
        pluginKey: CustomComponentPluginKey,
        command: ({ editor, range, props }: any) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, renderCustomComponent(props))
            .run();
        },
      },
    };
  },

  addCommands() {
    return {
      setCustomButton:
        (props: CustomButtonAttributes) =>
          ({ commands }) => {
            return commands.insertContent(renderCustomComponent({ type: 'customButton', ...props }));
          },
      setCustomRelatedPost:
        (props: CustomRelatedPostAttributes) =>
          ({ commands }) => {
            return commands.insertContent(renderCustomComponent({ type: 'customRelatedItem', ...props }));
          },
      setCustomBanner:
        (props: CustomBannerAttributes) =>
          ({ commands }) => {
            return commands.insertContent(renderCustomComponent({ type: 'customBanner', ...props }));
          },
    };
  },

  renderHTML({ node }) {
    const attrs = Object.entries(node.attrs).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[`data-${key}`] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    return ['div', {
      'data-custom': 'true',
      ...attrs
    }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomComponentRenderer);
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
}).configure({
  suggestion: {
    items: async ({ query }: any) => {
      const components = [
        {
          type: 'customButton' as CustomComponentType,
          label: 'Button',
          description: 'Interactive button component',
          icon: '🔘'
        },
        {
          type: 'customRelatedItem' as CustomComponentType,
          label: 'Related Post',
          description: 'Show related articles',
          icon: '📰'
        },
        {
          type: 'customBanner' as CustomComponentType,
          label: 'Banner',
          description: 'Promotional banner',
          icon: '🪧'
        }
      ];

      if (!query) return components;

      return components.filter(component =>
        component.label.toLowerCase().includes(query.toLowerCase()) ||
        component.type.toLowerCase().includes(query.toLowerCase())
      );
    },
    render: () => {
      let component: any;
      let popup: any;
      let isEditable: any;

      return {
        onStart: (props: any) => {
          isEditable = props.editor.isEditable;
          if (!isEditable) return;

          component = new ReactRenderer(CustomComponentSuggestion, {
            props,
            editor: props.editor,
          });

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props: any) {
          if (!isEditable) return;

          component.updateProps(props);
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (!isEditable) return;

          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },

        onExit() {
          if (!isEditable) return;
          popup[0].destroy();
          component.destroy();
          if (window.__editCustomComponent) {
            window.__editCustomComponent.close();
          }
        },
      };
    },
  },
});

// === SUGGESTION COMPONENT ===
interface ComponentItem {
  type: CustomComponentType;
  label: string;
  description: string;
  icon: string;
}

interface CustomComponentSuggestionProps {
  items: ComponentItem[];
  command: any;
}

const CustomComponentSuggestion: React.FC<CustomComponentSuggestionProps> =
  forwardRef((props, ref) => {
    const $container = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
    const [formData, setFormData] = useState<any>({});

    const editData = (window as any).__editCustomComponent;
    const isEditing = !!editData;

    useEffect(() => {
      if (isEditing && editData) {
        const { node } = editData;
        const component = {
          type: node.attrs.type,
          label: node.attrs.type.replace('custom', '').replace(/([A-Z])/g, ' $1').trim(),
          description: '',
          icon: '✏️'
        } as ComponentItem;

        selectComponent(component);
        setFormData({ ...node.attrs });
      }
    }, []);

    useEffect(() => {
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && window.__editCustomComponent) {
          window.__editCustomComponent.close();
        }
      };
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }, []);

    const selectComponent = (component: ComponentItem) => {
      setSelectedComponent(component);
      // Set default values based on component type
      switch (component.type) {
        case 'customButton':
          setFormData({
            title: 'Click me',
            variant: 'primary',
            size: 'medium',
            url: ''
          });
          break;
        case 'customRelatedItem':
          setFormData({
            itemId: '',
            layout: 'grid',
            maxItems: 3
          });
          break;
        case 'customBanner':
          setFormData({
            bannerTitle: 'Banner Title',
            content: 'Banner content goes here...',
            theme: 'light',
            closable: false
          });
          break;
      }
    };

    const handleFormSubmit = () => {
      if (isEditing && window.__editCustomComponent) {
        window.__editCustomComponent.update(formData);
        window.__editCustomComponent.close();
      } else if (selectedComponent) {
        props.command({
          type: selectedComponent.type,
          ...formData
        });
      }
      setSelectedComponent(null);
      setFormData({});
    };

    const handleFormChange = (field: string, value: any) => {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value
      }));
    };

    const backToSelection = () => {
      setSelectedComponent(null);
      setFormData({});
      setSelectedIndex(0);
    };

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        selectComponent(item);
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      if (selectedComponent) {
        handleFormSubmit();
      } else {
        selectItem(selectedIndex);
      }
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useEffect(() => {
      if (!$container.current || Number.isNaN(selectedIndex + 1)) return;
      const el = $container.current.querySelector(
        `div:nth-of-type(${selectedIndex + 1})`,
      );
      el && scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' });
    }, [selectedIndex]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: any) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        if (event.key === 'Escape') {
          if (selectedComponent) {
            backToSelection();
          }
          return true;
        }

        return false;
      },
    }));

    const renderComponentForm = () => {
      if (!selectedComponent) return null;

      switch (selectedComponent.type) {
        case 'customButton':
          return (
            <FormContainer>
              <BackButton onClick={backToSelection}>
                ← Back to components
              </BackButton>

              <SuggestionTitle>Configure Button</SuggestionTitle>

              <FormGroup>
                <FormLabel>Title *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Button text"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Variant</FormLabel>
                <FormSelect
                  value={formData.variant || 'primary'}
                  onChange={(e) => handleFormChange('variant', e.target.value)}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Size</FormLabel>
                <FormSelect
                  value={formData.size || 'medium'}
                  onChange={(e) => handleFormChange('size', e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>URL (optional)</FormLabel>
                <FormInput
                  type="url"
                  value={formData.url || ''}
                  onChange={(e) => handleFormChange('url', e.target.value)}
                  placeholder="https://example.com"
                />
              </FormGroup>

              <FormActions>
                <Button $variant="secondary" onClick={backToSelection}>
                  Cancel
                </Button>
                <Button
                  $variant="primary"
                  onClick={handleFormSubmit}
                  disabled={!formData.title}
                >
                  Insert Button
                </Button>
              </FormActions>
            </FormContainer>
          );

        case 'customRelatedItem':
          return (
            <FormContainer>
              <BackButton onClick={backToSelection}>
                ← Back to components
              </BackButton>

              <SuggestionTitle>Configure Related Posts</SuggestionTitle>

              <FormGroup>
                <FormLabel>Post IDs</FormLabel>
                <FormInput
                  type="text"
                  value={formData.itemId || ''}
                  onChange={(e) => handleFormChange('itemId', e.target.value)}
                  placeholder="1,2,3 (comma separated)"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Layout</FormLabel>
                <FormSelect
                  value={formData.layout || 'grid'}
                  onChange={(e) => handleFormChange('layout', e.target.value)}
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="carousel">Carousel</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Max Items</FormLabel>
                <FormInput
                  type="number"
                  value={formData.maxItems || 3}
                  onChange={(e) => handleFormChange('maxItems', parseInt(e.target.value) || 3)}
                  min="1"
                  max="10"
                />
              </FormGroup>

              <FormActions>
                <Button $variant="secondary" onClick={backToSelection}>
                  Cancel
                </Button>
                <Button $variant="primary" onClick={handleFormSubmit}>
                  Insert Related Posts
                </Button>
              </FormActions>
            </FormContainer>
          );

        case 'customBanner':
          return (
            <FormContainer>
              <BackButton onClick={backToSelection}>
                ← Back to components
              </BackButton>

              <SuggestionTitle>Configure Banner</SuggestionTitle>

              <FormGroup>
                <FormLabel>Title *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.bannerTitle || ''}
                  onChange={(e) => handleFormChange('bannerTitle', e.target.value)}
                  placeholder="Banner title"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Content</FormLabel>
                <FormTextarea
                  value={formData.content || ''}
                  onChange={(e) => handleFormChange('content', e.target.value)}
                  placeholder="Banner content"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Theme</FormLabel>
                <FormSelect
                  value={formData.theme || 'light'}
                  onChange={(e) => handleFormChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="primary">Primary</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <input
                    type="checkbox"
                    checked={formData.closable || false}
                    onChange={(e) => handleFormChange('closable', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Show Close Button
                </FormLabel>
              </FormGroup>

              <FormActions>
                <Button $variant="secondary" onClick={backToSelection}>
                  Cancel
                </Button>
                <Button
                  $variant="primary"
                  onClick={handleFormSubmit}
                  disabled={!formData.bannerTitle}
                >
                  Insert Banner
                </Button>
              </FormActions>
            </FormContainer>
          );

        default:
          return null;
      }
    };

    // Jika component dipilih, tampilkan form
    if (selectedComponent) {
      return (
        <SuggestionContainer>
          {renderComponentForm()}
        </SuggestionContainer>
      );
    }

    // Tampilkan list components
    return (
      <SuggestionContainer>
        <SuggestionHeader>
          <SuggestionTitle>Insert Component</SuggestionTitle>
        </SuggestionHeader>

        <SuggestionList ref={$container}>
          {props.items.length ? (
            props.items.map((item, index) => (
              <SuggestionItem
                $selected={index === selectedIndex}
                key={`component-${index}`}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <ComponentIcon>{item.icon}</ComponentIcon>
                  <ComponentInfo>
                    <ComponentName>{item.label}</ComponentName>
                    <ComponentDescription>{item.description}</ComponentDescription>
                  </ComponentInfo>
                </div>
                <Button
                  $variant="primary"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.command({ type: item.type });
                  }}
                >
                  Add
                </Button>
              </SuggestionItem>
            ))
          ) : (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              No components found
            </div>
          )}
        </SuggestionList>
      </SuggestionContainer>
    );
  });