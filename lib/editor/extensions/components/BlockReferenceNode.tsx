import { NodeViewProps } from '@tiptap/react';

interface BlockReferenceNodeProps extends NodeViewProps {
  blockId?: string;
  sourceDocId?: string;
  sourceBlockContent?: string;
}

export default function BlockReferenceNode({ node }: BlockReferenceNodeProps) {
  const blockId = node.attrs.blockId as string | null;
  const sourceDocId = node.attrs.sourceDocId as string | null;
  const sourceBlockContent = node.attrs.sourceBlockContent as string | null;

  if (!blockId) {
    return <span className="text-red-400">((broken reference))</span>;
  }

  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-100 text-green-700 cursor-pointer hover:bg-green-200 transition-colors text-sm font-medium"
      title={sourceBlockContent ? `Reference: ${sourceBlockContent.substring(0, 50)}...` : 'Go to referenced block'}
    >
      (({blockId.substring(0, 8)}))
    </span>
  );
}