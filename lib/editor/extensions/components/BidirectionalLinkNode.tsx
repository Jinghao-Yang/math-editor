import { NodeViewProps } from '@tiptap/react';

interface BidirectionalLinkNodeProps extends NodeViewProps {
  targetDocId?: string;
  targetTitle?: string;
}

export default function BidirectionalLinkNode({ node }: BidirectionalLinkNodeProps) {
  const targetDocId = node.attrs.targetDocId as string | null;
  const targetTitle = node.attrs.targetTitle as string | null;

  if (!targetTitle) {
    return <span className="text-red-400">[[broken link]]</span>;
  }

  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 transition-colors text-sm font-medium"
      title={`Go to ${targetTitle}`}
    >
      [[{targetTitle}]]
    </span>
  );
}