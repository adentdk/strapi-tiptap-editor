import { Fragment, memo, useMemo, lazy, Suspense } from "react";
import { Separator } from "../../ui/separator";
import styled from "styled-components";

// Styled Components
const FlexGap = styled.div`
  flex-grow: 1;
  min-width: 16px; /* optional */
`;

const StyledSeparator = styled(Separator)`
  height: 32px;
`;

// Lazy imports for toolbars (tanpa next/dynamic)
const toolbarsMap = {
  AlignmentToolbar: lazy(() =>
    import("../toolbars/alignment").then((mod) => ({
      default: mod.AlignmentTooolbar,
    })),
  ),
  BlockquoteToolbar: lazy(() =>
    import("../toolbars/blockquote").then((mod) => ({
      default: mod.BlockquoteToolbar,
    })),
  ),
  BoldToolbar: lazy(() =>
    import("../toolbars/bold").then((mod) => ({
      default: mod.BoldToolbar,
    })),
  ),
  BulletListToolbar: lazy(() =>
    import("../toolbars/bullet-list").then((mod) => ({
      default: mod.BulletListToolbar,
    })),
  ),
  CodeToolbar: lazy(() =>
    import("../toolbars/code").then((mod) => ({
      default: mod.CodeToolbar,
    })),
  ),
  CodeBlockToolbar: lazy(() =>
    import("../toolbars/code-block").then((mod) => ({
      default: mod.CodeBlockToolbar,
    })),
  ),
  HardBreakToolbar: lazy(() =>
    import("../toolbars/hard-break").then((mod) => ({
      default: mod.HardBreakToolbar,
    })),
  ),
  HorizontalRuleToolbar: lazy(() =>
    import("../toolbars/horizontal-rule").then((mod) => ({
      default: mod.HorizontalRuleToolbar,
    })),
  ),
  ItalicToolbar: lazy(() =>
    import("../toolbars/italic").then((mod) => ({
      default: mod.ItalicToolbar,
    })),
  ),
  OrderedListToolbar: lazy(() =>
    import("../toolbars/ordered-list").then((mod) => ({
      default: mod.OrderedListToolbar,
    })),
  ),
  RedoToolbar: lazy(() =>
    import("../toolbars/redo").then((mod) => ({
      default: mod.RedoToolbar,
    })),
  ),
  StrikeThroughToolbar: lazy(() =>
    import("../toolbars/strikethrough").then((mod) => ({
      default: mod.StrikeThroughToolbar,
    })),
  ),
  UndoToolbar: lazy(() =>
    import("../toolbars/undo").then((mod) => ({
      default: mod.UndoToolbar,
    })),
  ),
  ColorAndHighlightToolbar: lazy(() =>
    import("../toolbars/color-and-highlight").then((mod) => ({
      default: mod.ColorAndHighlightToolbar,
    })),
  ),
  ImagePlaceholderToolbar: lazy(() =>
    import("../toolbars/image-placeholder").then((mod) => ({
      default: mod.ImagePlaceholderToolbar,
    })),
  ),
  SearchAndReplaceToolbar: lazy(() =>
    import("../toolbars/search-and-replace").then((mod) => ({
      default: mod.SearchAndReplaceToolbar,
    })),
  ),
  LinkToolbar: lazy(() =>
    import("../toolbars/link").then((mod) => ({
      default: mod.LinkToolbar,
    })),
  ),
  HeadingTooolbar: lazy(() =>
    import("../toolbars/heading").then((mod) => ({
      default: mod.HeadingTooolbar,
    })),
  ),
};

export type ToolbarButtonsType =
  | keyof typeof toolbarsMap
  | "Separator"
  | "FlexGap";

const ToolbarButtons: React.FC<{ toolbars?: ToolbarButtonsType[] }> = memo(
  ({
    toolbars = [
      "UndoToolbar",
      "RedoToolbar",
      "Separator",
      "BoldToolbar",
      "ItalicToolbar",
      "BulletListToolbar",
      "OrderedListToolbar",
    ],
  }) => {
    const Components = useMemo<
      { Component: React.ComponentType<any>; props: Record<string, any> }[]
    >(
      () =>
        toolbars.map((toolbar) => {
          if (toolbar === "Separator") {
            return {
              Component: StyledSeparator,
              props: { orientation: "vertical" },
            };
          }

          if (toolbar === "FlexGap") {
            return {
              Component: FlexGap,
              props: {},
            };
          }

          return {
            Component:
              toolbarsMap[toolbar as keyof typeof toolbarsMap] || Fragment,
            props: {},
          };
        }),
      [toolbars],
    );

    return (
      <Fragment>
        {Components.map((c, index) => (
          <Suspense fallback={null} key={index}>
            <c.Component {...c.props} />
          </Suspense>
        ))}
      </Fragment>
    );
  },
);

ToolbarButtons.displayName = "ToolbarButtons";

export { ToolbarButtons };