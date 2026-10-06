"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '../ui/button';
import Editor from '../common/Editor';
import { Block, ImageUploadRequest } from '@/types/proposal';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';
import { GripVertical, Plus, Trash2, X } from 'lucide-react';

interface BlockRendererProps {
    block: Block;
    updateBlockProps: (blockId: string, newProps: Record<string, any>) => void;
    updateBlockPosition: (blockId: string, position: { x: number; y: number }) => void;
    updateBlockSize: (blockId: string, size: { width: number; height: number }) => void;
    deleteBlock: (blockId: string) => void;
    uploadImage: (data: ImageUploadRequest) => Promise<any>;
}

export function BlockRenderer({
    block,
    updateBlockProps,
    updateBlockPosition,
    updateBlockSize,
    deleteBlock,
    uploadImage,
}: BlockRendererProps) {
    const { id } = useAppSelector((state) => state.auth)
    const [isSelected, setIsSelected] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isImageUrlUpdating, setisImageUrlUpdating] = useState(false)
    const blockRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setisUploading] = useState(false)


    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    }

    const handleFileUpload = async () => {
        const files = fileInputRef.current?.files;
        if (!files || files.length === 0 || !id) return;
        try {
            setisUploading(true)
            const response = await uploadImage({
                imageFile: files[0],
                userId: id
            })
            if (response && response.data) {
                updateBlockProps(block.id, { url: response.data.secure_url });
                toast.success("Image uploaded successfully")
            }
        } catch (error) {
            console.error("Image upload failed", error);
            toast.error("Image upload failed. Please try again.")
        } finally {
            setisUploading(false)
        }
    }

    // Use draggable instead of sortable for free positioning
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: block.id,
        data: { type: 'canvas-block', block },
        disabled: isResizing,
    });

    const prevIsDragging = useRef(isDragging);
    const lastTransform = useRef(transform);

    // Update position when drag ends
    useEffect(() => {
        // Store the current transform
        if (transform) {
            lastTransform.current = transform;
        }

        // Detect when dragging stops (was dragging, now not dragging)
        if (prevIsDragging.current && !isDragging && lastTransform.current) {
            console.log("Drag ended, updating position", lastTransform.current);
            updateBlockPosition(block.id, {
                x: block.position.x + lastTransform.current.x,
                y: block.position.y + lastTransform.current.y
            });
            lastTransform.current = null; // Reset after updating
        }

        // Update the previous state
        prevIsDragging.current = isDragging;
    }, [isDragging, transform, block.id, block.position.x, block.position.y, updateBlockPosition]);

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${block.position.x}px`,
        top: `${block.position.y}px`,
        width: `${block.size.width}px`,
        height: `${block.size.height}px`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: isSelected ? 100 : 1,
    };

    const handleResize = (direction: string) => {
        const startResize = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = block.size.width;
            const startHeight = block.size.height;
            const startPosX = block.position.x;
            const startPosY = block.position.y;

            const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newX = startPosX;
                let newY = startPosY;

                // Handle width changes
                if (direction.includes('e')) {
                    newWidth = Math.max(200, startWidth + deltaX);
                }
                if (direction.includes('w')) {
                    newWidth = Math.max(200, startWidth - deltaX);
                    newX = startPosX + (startWidth - newWidth);
                }

                // Handle height changes
                if (direction.includes('s')) {
                    newHeight = Math.max(100, startHeight + deltaY);
                }
                if (direction.includes('n')) {
                    newHeight = Math.max(100, startHeight - deltaY);
                    newY = startPosY + (startHeight - newHeight);
                }

                updateBlockSize(block.id, { width: newWidth, height: newHeight });

                // Update position if resizing from top or left
                if (direction.includes('w') || direction.includes('n')) {
                    updateBlockPosition(block.id, { x: newX, y: newY });
                }
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
                    <div className="space-y-2 w-full h-full">
                        <Editor block={block} updateBlockProps={updateBlockProps} />
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
                                        <label className="text-xs font-medium text-neutral-700 mb-1 block">Fit</label>
                                        <select
                                            className="w-full text-xs border border-neutral-300 rounded px-2 py-1"
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
                                            title="Toggle URL editor"
                                        >
                                            {isImageUrlUpdating ? "Close URL Editor" : "Update Image URL"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col items-center justify-center" onClick={handleFileUploadClick}>
                                    <svg className="w-12 h-12 text-neutral-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-neutral-400">No image selected</span>
                                    {isUploading ? (
                                        <p className='text-xl text-neutral-700 animate-bounce'>Image uploading, Please Wait</p>
                                    ) : (
                                        <span className="text-sm text-neutral-400">Paste a URL below or Click to upload</span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 text-sm"
                                    placeholder="Paste image URL"
                                    value={block.props.url || ''}
                                    onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                                />
                                <input
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    max={1}
                                />
                            </>
                        )}
                        {isImageUrlUpdating && (
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 text-sm"
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
                        <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">Video Block</label>
                        {block.props.url ? (
                            <div className="relative flex-1 rounded-lg overflow-hidden border border-neutral-200">
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
                            <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 text-neutral-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-neutral-400">No video selected</span>
                            </div>
                        )}
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 text-sm"
                            placeholder="Paste video URL"
                            value={block.props.url || ''}
                            onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                        />
                    </div>
                );

            case 'pricing': {
                const items: { name: string; qty: number; price: number }[] = block.props.items ?? [];
                const currency = block.props.currency ?? '$';
                const setItems = (next: typeof items) => updateBlockProps(block.id, { items: next });
                const setItem = (i: number, patch: Partial<(typeof items)[number]>) =>
                    setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
                const money = (n: number) =>
                    `${currency}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                const total = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
                const cell = "w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-neutral-200 focus:border-neutral-400 focus:outline-none";

                return (
                    <div className="h-full flex flex-col text-sm">
                        <div className="grid grid-cols-[1fr_60px_100px_100px_24px] gap-2 pb-2 border-b border-neutral-200 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            <span>Item</span><span>Qty</span><span>Price</span><span className="text-right">Amount</span><span />
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {items.map((it, i) => (
                                <div key={i} className="grid grid-cols-[1fr_60px_100px_100px_24px] gap-2 py-1.5 border-b border-neutral-100 items-center">
                                    <input className={cell} value={it.name} placeholder="Item" onChange={(e) => setItem(i, { name: e.target.value })} />
                                    <input className={cell} type="number" min={0} value={it.qty} onChange={(e) => setItem(i, { qty: Number(e.target.value) })} />
                                    <input className={cell} type="number" min={0} value={it.price} onChange={(e) => setItem(i, { price: Number(e.target.value) })} />
                                    <span className="text-right">{money((Number(it.qty) || 0) * (Number(it.price) || 0))}</span>
                                    {isSelected ? (
                                        <button className="text-neutral-400 hover:text-red-600" title="Remove row" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                                            <X className="size-4" />
                                        </button>
                                    ) : <span />}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-300">
                            {isSelected ? (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setItems([...items, { name: '', qty: 1, price: 0 }])}>
                                        <Plus className="size-4" /> Add row
                                    </Button>
                                    <input
                                        className="w-14 px-2 py-1 border border-neutral-300 rounded text-xs"
                                        value={currency}
                                        title="Currency symbol"
                                        onChange={(e) => updateBlockProps(block.id, { currency: e.target.value })}
                                    />
                                </div>
                            ) : <span />}
                            <span className="font-semibold">Total: {money(total)}</span>
                        </div>
                    </div>
                );
            }

            case 'button': {
                // Only allow http(s)/mailto links, so a javascript: URL can't run on the client's viewer page
                const safeUrl = /^(https?:\/\/|mailto:)/i.test(block.props.url ?? '') ? block.props.url : undefined;
                return (
                    <div className="h-full flex flex-col items-center justify-center gap-2">
                        <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto inline-flex items-center justify-center rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
                            onClick={(e) => isSelected && e.preventDefault()}
                        >
                            {block.props.label || 'Button'}
                        </a>
                        {isSelected && (
                            <div className="w-full flex gap-2">
                                <input
                                    className="flex-1 px-2 py-1 border border-neutral-300 rounded text-xs"
                                    placeholder="Label"
                                    value={block.props.label || ''}
                                    onChange={(e) => updateBlockProps(block.id, { label: e.target.value })}
                                />
                                <input
                                    className="flex-[2] px-2 py-1 border border-neutral-300 rounded text-xs"
                                    placeholder="https://..."
                                    value={block.props.url || ''}
                                    onChange={(e) => updateBlockProps(block.id, { url: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                );
            }

            case 'signature':
                return (
                    <div className="h-full flex flex-col justify-end gap-1">
                        {block.props.signedName ? (
                            <>
                                <span className="text-3xl italic font-serif text-neutral-800">{block.props.signedName}</span>
                                <div className="border-t border-neutral-400" />
                                <span className="text-xs text-neutral-500">
                                    {block.props.label} &bull; Signed {new Date(block.props.signedAt).toLocaleDateString()}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-neutral-400 italic">Signed when the client accepts the proposal</span>
                                <div className="border-t border-dashed border-neutral-400" />
                                {isSelected ? (
                                    <input
                                        className="px-2 py-1 border border-neutral-300 rounded text-xs"
                                        value={block.props.label || ''}
                                        onChange={(e) => updateBlockProps(block.id, { label: e.target.value })}
                                    />
                                ) : (
                                    <span className="text-xs text-neutral-500">{block.props.label}</span>
                                )}
                            </>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <span className="text-sm text-neutral-500">Unsupported block type: {block.type}</span>
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
            // Borderless blocks show an outline only on hover so they're still findable while editing
            className={`flex flex-col bg-white text-neutral-900 rounded-lg border p-5 transition-all ${['text', 'button', 'signature'].includes(block.type) ? 'border-transparent hover:border-neutral-200' : 'border-neutral-200'} ${isSelected
                && 'border-primary/40 shadow-sm ring-2 ring-primary/25'
                }`}
            onClick={(e) => {
                e.stopPropagation();
                setIsSelected(true);
            }}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsSelected(false);
                }
            }}
            tabIndex={0}
        >
            {/* Drag Handle and Actions */}
{isSelected && (
                    <div className="absolute -left-11 top-4 flex flex-col gap-1.5">
                        <button
                            {...attributes}
                            {...listeners}
                            className="size-8 flex items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 cursor-grab active:cursor-grabbing text-neutral-500"
                            title="Drag to reposition"
                        >
                            <GripVertical className="size-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(block.id);
                            }}
                            className="size-8 flex items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm text-neutral-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            title="Delete block"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                )}

                {/* Resize Handles - Only show when selected */}
                {isSelected && (
                    <>
                        {/* Corner Handles */}
                        <div
                            className="absolute -top-1.5 -left-1.5 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-nw-resize z-10"
                            onMouseDown={handleResize('nw')}
                        />
                        <div
                            className="absolute -top-1.5 -right-1.5 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-ne-resize z-10"
                            onMouseDown={handleResize('ne')}
                        />
                        <div
                            className="absolute -bottom-1.5 -left-1.5 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-sw-resize z-10"
                            onMouseDown={handleResize('sw')}
                        />
                        <div
                            className="absolute -bottom-1.5 -right-1.5 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-se-resize z-10"
                            onMouseDown={handleResize('se')}
                        />

                        {/* Edge Handles */}
                        <div
                            className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-n-resize z-10"
                            onMouseDown={handleResize('n')}
                        />
                        <div
                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-s-resize z-10"
                            onMouseDown={handleResize('s')}
                        />
                        <div
                            className="absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-w-resize z-10"
                            onMouseDown={handleResize('w')}
                        />
                        <div
                            className="absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 bg-primary rounded-full ring-2 ring-white shadow-sm cursor-e-resize z-10"
                            onMouseDown={handleResize('e')}
                        />

                        {/* Position & Size Display */}
                        <div className="absolute -bottom-9 left-0 bg-neutral-900 text-white text-[11px] font-mono px-2.5 py-1 rounded-md shadow-sm whitespace-nowrap">
                            Position: ({Math.round(block.position.x)}, {Math.round(block.position.y)}) • Size: {Math.round(block.size.width)} × {Math.round(block.size.height)}
                        </div>
                    </>
                )}

            {/* Block Content */}
            <div className="h-full overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
}