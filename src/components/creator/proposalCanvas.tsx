import { Block, ImageUploadRequest } from '@/types/proposal'
import { useDroppable } from '@dnd-kit/core'
import React, { useCallback, useEffect } from 'react'
import { BlockRenderer } from './blockRenderer'
import imageService from '@/lib/api/imageService';
import { useAutoSave } from '@/features/Proposals/hooks/useAutoSave';
import { cn } from '@/lib/utils'; // Assuming you have this, if not, standard class strings work too


interface ProposalCanvasProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
    proposalId: string;
    isAutosaveOn: boolean
}

function ProposalCanvas({ blocks, setBlocks, proposalId, isAutosaveOn }: ProposalCanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas'
    });

    const { saveProposalData } = useAutoSave({
        AutoSaveInterval: 10000,
        autoSave: isAutosaveOn
    })

    useEffect(() => {
        saveProposalData(blocks, proposalId)
    }, [blocks])

    const updateBlockProps = (blockId: string, newProps: Record<string, any>) => {
        setBlocks((prev: Block[]) => prev.map(b =>
            b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b
        ));
    };

    const updateBlockPosition = (blockId: string, position: { x: number; y: number }) => {
        setBlocks((prev: Block[]) => prev.map(b =>
            b.id === blockId ? { ...b, position } : b
        ));
    };

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
        <div className="flex flex-col w-full h-full gap-4">

            {/* --- CANVAS AREA --- */}
            <div
                ref={setNodeRef}
                className={cn(
                    // Base Layout & Sizing
                    "w-full min-h-[800px] relative transition-all duration-300",
                    "rounded-none overflow-hidden", // Sharp corners for Swiss look

                    // Colors & Borders (Default)
                    "bg-white border border-neutral-200",

                    // Drag Over State (Replaces Blue Ring with Black Border)
                    isOver && "bg-neutral-50 border-neutral-900 border-dashed"
                )}
                style={{
                    position: 'relative',
                    overflow: 'auto', // Allow scrolling
                    backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)', // Optional: Very subtle dot grid
                    backgroundSize: '24px 24px'
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
                    // Empty State
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className={`text-center py-24 px-12 border border-dashed transition-colors duration-300 ${isOver ? 'border-neutral-900' : 'border-neutral-300'}`}>
                            <p className="text-sm font-bold uppercase tracking-widest text-neutral-900">
                                Canvas Empty
                            </p>
                            <p className="text-xs text-neutral-500 mt-2">
                                Drag blocks here to initialize
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProposalCanvas;