import { type EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";

const uploadKey = new PluginKey("upload-image");

export const UploadImagesPlugin = ({ imageClass }: { imageClass: string }) =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        const action = tr.getMeta(this);
        if (action?.add) {
          const { id, pos, src } = action.add;

          const placeholder = document.createElement("div");
          placeholder.setAttribute("class", "img-placeholder");
          const image = document.createElement("img");
          image.setAttribute("class", imageClass);
          image.src = src as string;
          placeholder.appendChild(image);
          const deco = Decoration.widget(pos + 1, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action?.remove) {
          set = set.remove(set.find(undefined, undefined, (spec) => spec.id === action.remove.id));
        }
        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state) ?? DecorationSet.empty;
      },
    },
  });

function findPlaceholder(state: EditorState, id: object): number | null {
  const decos = uploadKey.getState(state) as DecorationSet | undefined;
  if (!decos) return null;
  const found = decos.find(undefined, undefined, (spec) => spec.id === id);
  return found.length ? (found[0]?.from as number) : null;
}

export interface ImageUploadOptions {
  validateFn?: (file: File) => boolean;
  onUpload: (file: File) => Promise<string | File>;
}

export const createImageUpload =
  ({ validateFn, onUpload }: ImageUploadOptions): UploadFn =>
  (file, view, pos) => {
    if (validateFn) {
      const validated = validateFn(file);
      if (!validated) return;
    }
    const id = {};
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();

    const reader = new FileReader();
    let localImageSrc: string | null = null;
    reader.readAsDataURL(file);
    reader.onload = () => {
      localImageSrc = reader.result as string;
      tr.setMeta(uploadKey, {
        add: {
          id,
          pos,
          src: localImageSrc,
        },
      });
      view.dispatch(tr);
    };

    onUpload(file).then((src) => {
      const { schema } = view.state;
      const foundPos = findPlaceholder(view.state, id);

      if (foundPos === null) return;

      const imageSrc = typeof src === "string" ? src : localImageSrc;
      const node = schema.nodes.image?.create({ src: imageSrc });
      if (!node) return;

      const transaction = view.state.tr.replaceWith(foundPos, foundPos, node).setMeta(uploadKey, { remove: { id } });
      view.dispatch(transaction);
    }, () => {
      const transaction = view.state.tr.setMeta(uploadKey, { remove: { id } });
      view.dispatch(transaction);
    });
  };

export type UploadFn = (file: File, view: EditorView, pos: number) => void;

export const handleImagePaste = (view: EditorView, event: ClipboardEvent, uploadFn: UploadFn) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.clipboardData.files);
    const insertPos = view.state.selection.from;

    if (file) uploadFn(file, view, insertPos);
    return true;
  }
  return false;
};

export const handleImageDrop = (view: EditorView, event: DragEvent, moved: boolean, uploadFn: UploadFn) => {
  if (!moved && event.dataTransfer?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.dataTransfer.files);
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    if (file) {
      const dropPos = coordinates?.pos ?? 0;
      uploadFn(file, view, Math.max(0, dropPos - 1));
    }
    return true;
  }
  return false;
};