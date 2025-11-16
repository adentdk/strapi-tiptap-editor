// src/tiptap/extensions/custom-component/CustomComponentInsertPopover.tsx
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 320px;
  max-height: 400px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.colors.neutral300};
  background: ${p => p.theme.colors.neutral0};
  box-shadow: ${p => p.theme.shadows.popupShadow};
  overflow: hidden;
`;

const Header = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${p => p.theme.colors.neutral200};
  background: ${p => p.theme.colors.neutral100};
  font-weight: 600;
  font-size: 14px;
`;

const List = styled.div`
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const Item = styled.div<{ $selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  ${p => p.$selected && `background: ${p.theme.colors.primary100}; border-color: ${p.theme.colors.primary200};`}
  &:hover { background: ${p => p.theme.colors.neutral100}; }
`;

const Info = styled.div` flex: 1; `;
const Name = styled.div` font-weight: 500; font-size: 14px; `;
const Desc = styled.div` font-size: 12px; color: ${p => p.theme.colors.neutral600}; `;

const AddBtn = styled.button`
  padding: 4px 8px; font-size: 12px; border: 1px solid ${p => p.theme.colors.primary500};
  background: ${p => p.theme.colors.primary600}; color: white; border-radius: 4px; cursor: pointer;
`;

interface ItemType {
  type: string;
  label: string;
  description: string;
  icon: string;
}

interface Props {
  items: ItemType[];
  command: (props: any) => void;
}

export const CustomComponentInsertPopover = forwardRef((props: Props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) handleSelectComponent(item.type);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex(i => (i - 1 + props.items.length) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex(i => (i + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    // e.preventDefault();
  }, []);

  const handleSelectComponent = useCallback((type: string) => {
    // Saat command dipanggil, default:
    switch (type) {
      case 'customButton':
        props.command({
          type: 'customButton',
          buttons: [{ title: 'Click me', url: '', variant: 'primary', size: 'medium' }],
          align: 'center',
          fullWidth: false,
        });
        break;

      case 'customRelatedItem':
        props.command({
          type: 'customRelatedItem',
          itemId: '',
          label: 'Related items',
          layout: 'list',
          maxItems: 3,
        });
        break;

      case 'customBanner':
        props.command({
          type: 'customBanner',
          title: '',
          content: '',
          action: null,
        });
        break;

      case 'customEntity':
        props.command({
          type: 'customEntity',
          entity_name: '',
          entity_id: '',
          custom_attrs: {},
        });
        break;

    }
  }, [])

  return (
    <Container onMouseDown={stopPropagation}
      onClick={stopPropagation}
      onMouseUp={stopPropagation}>
      <Header>Insert Component</Header>
      <List ref={containerRef}>
        {props.items.map((item, i) => (
          <Item
            key={i}
            $selected={i === selectedIndex}
            onClick={() => handleSelectComponent(item.type)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <Info>
                <Name>{item.label}</Name>
                <Desc>{item.description}</Desc>
              </Info>
            </div>
            <AddBtn onClick={e => { e.stopPropagation(); handleSelectComponent(item.type); }}>
              Add
            </AddBtn>
          </Item>
        ))}
      </List>
    </Container>
  );
});