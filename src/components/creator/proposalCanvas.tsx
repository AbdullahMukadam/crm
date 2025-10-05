import { Block } from '@/types/proposal'
import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import { BlockRenderer } from './blockRenderer'

interface ProposalCanvasProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

function ProposalCanvas({ blocks, setBlocks }: any) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas'
    });

    const updateBlockProps = (blockId: string, newProps: Record<string, any>) => {
        setBlocks((prev: Block[]) => prev.map(b => 
            b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b
        ));
    };

    const deleteBlock = (blockId: string) => {
        setBlocks((prev: Block[]) => prev.filter(b => b.id !== blockId));
    };

    return (
        <div
            ref={setNodeRef}
            className={`bg-white text-black rounded-lg shadow-lg p-8 w-full min-h-[600px] transition-all ${
                isOver ? 'ring-4 ring-blue-400 bg-blue-50' : ''
            }`}
        >
            <div className="space-y-4">
                {blocks.length > 0 ? (
                    blocks.map((block: Block) => (
                        <BlockRenderer
                            block={block}
                            key={block.id}
                            updateBlockProps={updateBlockProps}
                            deleteBlock={deleteBlock}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-24 border-2 border-dashed rounded-lg">
                        <p className="text-lg"> Drag blocks from the sidebar to start building</p>
                        <p className="text-sm mt-2">Try dragging multiple blocks!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProposalCanvas;