"use client";

import dynamic from "next/dynamic";
import { Fragment, memo, useMemo } from "react";

import { Separator } from "../../ui/separator";

// Dynamic imports for toolbars
const toolbarsMap = {
  AlignmentToolbar: dynamic(
    () => import("../toolbars/alignment").then((mod) => mod.AlignmentTooolbar),
    { loading: () => null, ssr: false },
  ),
  BlockquoteToolbar: dynamic(
    () => import("../toolbars/blockquote").then((mod) => mod.BlockquoteToolbar),
    { loading: () => null, ssr: false },
  ),
  BoldToolbar: dynamic(
    () => import("../toolbars/bold").then((mod) => mod.BoldToolbar),
    { loading: () => null, ssr: false },
  ),
  BulletListToolbar: dynamic(
    () =>
      import("../toolbars/bullet-list").then((mod) => mod.BulletListToolbar),
    { loading: () => null, ssr: false },
  ),
  CodeToolbar: dynamic(
    () => import("../toolbars/code").then((mod) => mod.CodeToolbar),
    { loading: () => null, ssr: false },
  ),
  CodeBlockToolbar: dynamic(
    () => import("../toolbars/code-block").then((mod) => mod.CodeBlockToolbar),
    { loading: () => null, ssr: false },
  ),
  HardBreakToolbar: dynamic(
    () => import("../toolbars/hard-break").then((mod) => mod.HardBreakToolbar),
    { loading: () => null, ssr: false },
  ),
  HorizontalRuleToolbar: dynamic(
    () =>
      import("../toolbars/horizontal-rule").then(
        (mod) => mod.HorizontalRuleToolbar,
      ),
    { loading: () => null, ssr: false },
  ),
  ItalicToolbar: dynamic(
    () => import("../toolbars/italic").then((mod) => mod.ItalicToolbar),
    { loading: () => null, ssr: false },
  ),
  OrderedListToolbar: dynamic(
    () =>
      import("../toolbars/ordered-list").then((mod) => mod.OrderedListToolbar),
    { loading: () => null, ssr: false },
  ),
  RedoToolbar: dynamic(
    () => import("../toolbars/redo").then((mod) => mod.RedoToolbar),
    { loading: () => null, ssr: false },
  ),
  StrikeThroughToolbar: dynamic(
    () =>
      import("../toolbars/strikethrough").then(
        (mod) => mod.StrikeThroughToolbar,
      ),
    { loading: () => null, ssr: false },
  ),
  UndoToolbar: dynamic(
    () => import("../toolbars/undo").then((mod) => mod.UndoToolbar),
    { loading: () => null, ssr: false },
  ),
  ColorAndHighlightToolbar: dynamic(
    () =>
      import("../toolbars/color-and-highlight").then(
        (mod) => mod.ColorAndHighlightToolbar,
      ),
    { loading: () => null, ssr: false },
  ),
  ImagePlaceholderToolbar: dynamic(
    () =>
      import("../toolbars/image-placeholder").then(
        (mod) => mod.ImagePlaceholderToolbar,
      ),
    { loading: () => null, ssr: false },
  ),
  SearchAndReplaceToolbar: dynamic(
    () =>
      import("../toolbars/search-and-replace").then(
        (mod) => mod.SearchAndReplaceToolbar,
      ),
    { loading: () => null, ssr: false },
  ),
  LinkToolbar: dynamic(
    () => import("../toolbars/link").then((mod) => mod.LinkToolbar),
    { loading: () => null, ssr: false },
  ),
  HeadingTooolbar: dynamic(
    () => import("../toolbars/heading").then((mod) => mod.HeadingTooolbar),
    { loading: () => null, ssr: false },
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
              Component: Separator,
              props: { orientation: "vertical", className: "h-8" },
            };
          }

          if (toolbar === "FlexGap") {
            return {
              Component: () => <div className="flex-1 w-full" />,
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
          <c.Component {...c.props} key={index} />
        ))}
      </Fragment>
    );
  },
);

ToolbarButtons.displayName = "ToolbarButtons";

export { ToolbarButtons };
