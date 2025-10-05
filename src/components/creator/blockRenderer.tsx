import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Button } from '../ui/button';

interface Block {
    id: string;
    type: string;
    props: Record<string, any>;
}

interface BlockRendererProps {
    block: Block;
    updateBlockProps: (blockId: string, newProps: Record<string, any>) => void;
    deleteBlock: (blockId: string) => void;
}

export function BlockRenderer({ block, updateBlockProps, deleteBlock }: BlockRendererProps) {
    const [isSelected, setIsSelected] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isImageUrlUpdating, setisImageUrlUpdating] = useState(false)
    const blockRef = useRef<HTMLDivElement>(null);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
        data: { type: 'canvas-block', block },
        disabled: isResizing,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: block.props.width || 'auto',
        height: block.props.height || 'auto',
    };

    const handleResize = (direction: string) => {
        const startResize = (e: React.MouseEvent) => {
            e.preventDefault();
            setIsResizing(true);
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = blockRef.current?.offsetWidth || 0;
            const startHeight = blockRef.current?.offsetHeight || 0;

            const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;

                if (direction.includes('e')) newWidth = startWidth + deltaX;
                if (direction.includes('w')) newWidth = startWidth - deltaX;
                if (direction.includes('s')) newHeight = startHeight + deltaY;
                if (direction.includes('n')) newHeight = startHeight - deltaY;

                updateBlockProps(block.id, {
                    width: Math.max(200, newWidth) + 'px',
                    height: Math.max(100, newHeight) + 'px',
                });
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        return startResize;
    };

    const renderContent = () => {
        switch (block.type) {
            case 'text':
                return (
                    <div className="space-y-2">
                        <textarea
                            className="w-full px-3 py-2.5 rounded-lg resize-none focus:outline-none focus:border-transparent transition-shadow text-sm"
                            placeholder="Enter your text here..."
                            value={block.props.text || ''}
                            onChange={(e) => updateBlockProps(block.id, { text: e.target.value })}
                            rows={4}
                            style={{ height: block.props.height ? '100%' : 'auto' }}
                        />
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-3 h-full flex flex-col">

                        {block.props.url ? (
                            <div className="relative flex-1 rounded-lg overflow-hidden">
                                <img
                                    src={block.props.url}
                                    alt="Block content"
                                    className="w-full h-full object-cover"
                                    style={{
                                        objectFit: block.props.objectFit || 'cover',
                                        objectPosition: block.props.objectPosition || 'center',
                                    }}
                                />
                                {isSelected && (
                                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Fit</label>
                                        <select
                                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                            value={block.props.objectFit || 'cover'}
                                            onChange={(e) => updateBlockProps(block.id, { objectFit: e.target.value })}
                                        >
                                            <option value="cover">Cover</option>
                                            <option value="contain">Contain</option>
                                            <option value="fill">Fill</option>
                                            <option value="none">None</option>
                                        </select>
                                        <Button
                                            onClick={() => setisImageUrlUpdating(!isImageUrlUpdating)}
                                            variant={"outline"}
                                            className='mt-2'
                                            title="Delete block"
                                        >
                                            {isImageUrlUpdating ? "Close URL Editor" : "Update Image URL"}
                                        </Button>

                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-gray-400">No image selected</span>
                                </div>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Paste image URL"
                                    value={block.props.url || ''}
                                    onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                                />
                            </>

                        )}
                        {isImageUrlUpdating && (
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500-500 text-sm"
                                placeholder="Paste image URL"
                                value={block.props.url || ''}
                                onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                            />
                        )}
                    </div>
                );

            case 'video':
                return (
                    <div className="space-y-3 h-full flex flex-col">
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Video Block</label>
                        {block.props.url ? (
                            <div className="relative flex-1 rounded-lg overflow-hidden border border-gray-200">
                                <video
                                    controls
                                    className="w-full h-full bg-black"
                                    src={block.props.url}
                                    style={{ objectFit: block.props.objectFit || 'contain' }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-gray-400">No video selected</span>
                            </div>
                        )}
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Paste video URL"
                            value={block.props.url || ''}
                            onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                        />
                    </div>
                );

            default:
                return (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-sm text-gray-500">Unsupported block type: {block.type}</span>
                    </div>
                );
        }
    };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                if (blockRef.current !== node) {
                    blockRef.current = node as HTMLDivElement;
                }
            }}
            style={style}
            className={`relative group bg-white rounded-lg p-5 transition-all ${isSelected
                ? 'border-gray-500 shadow-lg ring-2 ring-blue-200'
                : 'border-gray-200'
                }`}
            onClick={() => setIsSelected(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsSelected(false);
                }
            }}
            tabIndex={0}
        >
            {/* Drag Handle and Actions */}
            <div className="absolute -left-10 top-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    {...attributes}
                    {...listeners}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                        <circle cx="4" cy="3" r="1" />
                        <circle cx="8" cy="3" r="1" />
                        <circle cx="4" cy="8" r="1" />
                        <circle cx="8" cy="8" r="1" />
                        <circle cx="4" cy="13" r="1" />
                        <circle cx="8" cy="13" r="1" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200"
                    title="Delete block"
                >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>


            {/* Resize Handles - Only show when selected */}
            {isSelected && (
                <>
                    {/* Corner Handles */}
                    <div
                        className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full cursor-nw-resize"
                        onMouseDown={handleResize('nw')}
                    />
                    <div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full cursor-ne-resize"
                        onMouseDown={handleResize('ne')}
                    />
                    <div
                        className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full cursor-sw-resize"
                        onMouseDown={handleResize('sw')}
                    />
                    <div
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full cursor-se-resize"
                        onMouseDown={handleResize('se')}
                    />

                    {/* Edge Handles */}
                    <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full cursor-n-resize"
                        onMouseDown={handleResize('n')}
                    />
                    <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full cursor-s-resize"
                        onMouseDown={handleResize('s')}
                    />
                    <div
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full cursor-w-resize"
                        onMouseDown={handleResize('w')}
                    />
                    <div
                        className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full cursor-e-resize"
                        onMouseDown={handleResize('e')}
                    />

                    {/* Size Display */}
                    <div className="absolute -bottom-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        {blockRef.current?.offsetWidth || 0} × {blockRef.current?.offsetHeight || 0}
                    </div>
                </>
            )}

            {/* Block Content */}
            <div className="mt-1 h-full">
                {renderContent()}
            </div>
        </div>
    );
}