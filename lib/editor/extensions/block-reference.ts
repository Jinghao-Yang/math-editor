import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import BlockReferenceNode from './components/BlockReferenceNode';

export interface BlockReferenceOptions {
  openOnClick?: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockReference: {
      setBlockReference: (options: { blockId: string; sourceDocId: string; sourceBlockContent: string }) => ReturnType;
    };
  }
}

export const BlockReference = Node.create<BlockReferenceOptions>({
  name: 'blockReference',
  inline: true,
  group: 'inline',
  selectable: true,
  atom: true,

  addOptions() {
    return {
      openOnClick: true,
    };
  },

  addAttributes() {
    return {
      blockId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-block-id'),
        renderHTML: (attributes) => {
          if (!attributes.blockId) return {};
          return { 'data-block-id': attributes.blockId };
        },
      },
      sourceDocId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-source-doc-id'),
        renderHTML: (attributes) => {
          if (!attributes.sourceDocId) return {};
          return { 'data-source-doc-id': attributes.sourceDocId };
        },
      },
      sourceBlockContent: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-source-content'),
        renderHTML: (attributes) => {
          if (!attributes.sourceBlockContent) return {};
          return { 'data-source-content': attributes.sourceBlockContent };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-block-reference]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-block-reference': '' }), 0];
  },

  addCommands() {
    return {
      setBlockReference:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              blockId: options.blockId,
              sourceDocId: options.sourceDocId,
              sourceBlockContent: options.sourceBlockContent,
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockReferenceNode);
  },
});