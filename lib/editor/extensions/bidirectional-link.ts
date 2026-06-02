import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import BidirectionalLinkNode from './components/BidirectionalLinkNode';

export interface BidirectionalLinkOptions {
  openOnClick?: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bidirectionalLink: {
      setBidirectionalLink: (options: { targetDocId: string; targetTitle: string }) => ReturnType;
    };
  }
}

export const BidirectionalLink = Node.create<BidirectionalLinkOptions>({
  name: 'bidirectionalLink',
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
      targetDocId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-target-doc-id'),
        renderHTML: (attributes) => {
          if (!attributes.targetDocId) return {};
          return { 'data-target-doc-id': attributes.targetDocId };
        },
      },
      targetTitle: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-target-title'),
        renderHTML: (attributes) => {
          if (!attributes.targetTitle) return {};
          return { 'data-target-title': attributes.targetTitle };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-bidirectional-link]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-bidirectional-link': '' }), 0];
  },

  addCommands() {
    return {
      setBidirectionalLink:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              targetDocId: options.targetDocId,
              targetTitle: options.targetTitle,
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(BidirectionalLinkNode);
  },
});