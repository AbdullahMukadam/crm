
'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Block } from '@/types/proposal';


interface BlockRendererProps {
    block: Block;
    updateBlockProps: (blockId: string, newProps: Record<string, any>) => void;
    deleteBlock: (blockId: string) => void;
}

export function BlockRenderer({ block, updateBlockProps, deleteBlock }: BlockRendererProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
        data: { type: 'block', block },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const renderBlock = () => {
        switch (block.type) {
            case 'text':
                return (
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter text..."
                        value={block.props.text || ''}
                        onChange={(e) => updateBlockProps(block.id, { text: e.target.value })}
                    />
                );

            case 'image':
                return (
                    <div className="flex flex-col items-center">
                        {block.props.url ? (
                            <img src={block.props.url} alt="Block Image" className="max-w-full h-auto rounded mb-2" />
                        ) : (
                            <div className="w-full h-48 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center mb-2">
                                <span className="text-gray-400">No image URL provided</span>
                            </div>
                        )}
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter image URL..."
                            value={block.props.url || ''}
                            onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                        />
                    </div>
                );
            case 'video':
                return (
                    <div className="flex flex-col items-center">
                        {block.props.url ? (
                            <video controls className="max-w-full h-auto rounded mb-2">
                                <source src={block.props.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="w-full h-48 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center mb-2">
                                <span className="text-gray-400">No video URL provided</span>
                            </div>
                        )}
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter video URL..."
                            value={block.props.url || ''}
                            onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                        />
                    </div>
                );

                default:
                return <div className="p-4 border border-gray-300 rounded text-black">Unsupported block type: {block.type}</div>;
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group bg-white">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 p-1">
                    <GripVertical size={20} />
                </button>
                <button onClick={() => deleteBlock(block.id)} className="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 size={18} />
                </button>
            </div>
            {renderBlock()}
        </div>
    );
}

