import { Block } from '@/types/proposal'
import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import { BlockRenderer } from './blockRenderer'

interface ProposalCanvasProps {
    blocks: Block[],
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
}



function ProposalCanvas({ blocks, setBlocks }: ProposalCanvasProps) {
    const { setNodeRef } = useDroppable({
        id: 'canvas'
    })

    const updateBlockProps = (blockId: string, newProps: Record<string, any>) => {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b));
      };
      const deleteBlock = (blockId: string) => {
        setBlocks(prev => prev.filter(b => b.id !== blockId));
      };

    return (
        <div
            ref={setNodeRef}
            className="bg-white text-black rounded-lg shadow-lg p-8 md:p-12 w-[70vw] h-full overflow-y-auto overflow-x-hidden"
        >
            <div className="space-y-4">
                {blocks.length > 0 ? (
                    blocks.map((block) => (
                        <BlockRenderer
                            block={block}
                            key={block.id}
                            updateBlockProps={updateBlockProps}
                            deleteBlock={deleteBlock}

                        />
                    ))
                ) : (
                    <div className="text-center text-black py-24 border-2 border-dashed rounded-lg">
                        <p>Drag blocks from the sidebar to start building.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProposalCanvas