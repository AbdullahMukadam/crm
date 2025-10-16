import { Block, ImageUploadRequest } from '@/types/proposal'
import { useDroppable } from '@dnd-kit/core'
import React, { useCallback, useEffect } from 'react'
import { BlockRenderer } from './blockRenderer'
import imageService from '@/lib/api/imageService';
import { useAutoSave } from '@/features/Proposals/hooks/useAutoSave';

interface ProposalCanvasProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
    proposalId: string
}

function ProposalCanvas({ blocks, setBlocks, proposalId }: ProposalCanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas'
    });
    const { saveProposalData } = useAutoSave({
        AutoSaveInterval: 3000
    })

    useEffect(() => {
        saveProposalData(blocks, proposalId)
    }, [blocks])

    const updateBlockProps = (blockId: string, newProps: Record<string, any>) => {
        setBlocks((prev: Block[]) => prev.map(b =>
            b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b
        ));
    };

    // New function to update position
    const updateBlockPosition = (blockId: string, position: { x: number; y: number }) => {
        setBlocks((prev: Block[]) => prev.map(b =>
            b.id === blockId ? { ...b, position } : b
        ));
    };

    // New function to update size
    const updateBlockSize = (blockId: string, size: { width: number; height: number }) => {
        setBlocks((prev: Block[]) => prev.map(b =>
            b.id === blockId ? { ...b, size } : b
        ));
    };

    const deleteBlock = (blockId: string) => {
        setBlocks((prev: Block[]) => prev.filter(b => b.id !== blockId));
    };

    const uploadImage = useCallback(async (data: ImageUploadRequest) => {
        if (!data) return;
        try {
            const response = await imageService.uploadImage(data);
            return response;
        } catch (error) {
            throw error;
        }
    }, [])

    return (
        <div
            ref={setNodeRef}
            className={`bg-white text-black rounded-lg shadow-lg w-full min-h-[600px] transition-all relative ${isOver ? 'ring-4 ring-blue-400 bg-blue-50' : ''
                }`}
            style={{
                minHeight: '800px', // Give enough space for positioning
                position: 'relative',
                overflow: 'auto' // Allow scrolling if blocks go beyond
            }}
        >
            {blocks.length > 0 ? (
                blocks.map((block: Block) => (
                    <BlockRenderer
                        block={block}
                        key={block.id}
                        updateBlockProps={updateBlockProps}
                        updateBlockPosition={updateBlockPosition}
                        updateBlockSize={updateBlockSize}
                        deleteBlock={deleteBlock}
                        uploadImage={uploadImage}
                    />
                ))
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500 py-24 border-2 border-dashed rounded-lg px-12">
                        <p className="text-lg">Drag blocks from the sidebar to start building</p>
                        <p className="text-sm mt-2">Position them anywhere on the canvas!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProposalCanvas;