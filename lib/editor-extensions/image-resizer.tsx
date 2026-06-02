import { useCurrentEditor } from "@tiptap/react";
import { useEffect, useState, type FC } from "react";
import Moveable from "react-moveable";

export const ImageResizer: FC = () => {
  const { editor } = useCurrentEditor();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (editor?.isActive("image")) {
      const selected = document.querySelector(".ProseMirror-selectednode") as HTMLElement;
      setTargetElement(selected);
    } else {
      setTargetElement(null);
    }
  }, [editor, editor?.state.selection]);

  if (!targetElement || !editor) return null;

  const updateMediaSize = (width: number, height: number) => {
    const imageElement = targetElement as HTMLImageElement;
    editor.commands.setImage({
      src: imageElement.src,
    } as any);
  };

  return (
    <Moveable
      target={targetElement}
      container={null}
      origin={false}
      edge={false}
      throttleDrag={0}
      keepRatio={true}
      resizable={true}
      scalable={false}
      throttleResize={0}
      renderDirections={["n", "s", "e", "w", "ne", "nw", "se", "sw"]}
      onResize={({ target, width, height, delta }) => {
        if (delta[0]) target.style.width = `${width}px`;
        if (delta[1]) target.style.height = `${height}px`;
      }}
      onResizeEnd={(params) => {
        const { width, height } = params as any;
        updateMediaSize(width, height);
      }}
    />
  );
};
