import { Box, Columns2, Heading, Image as ImageIcon, LayoutTemplate, Type, Video } from 'lucide-react';
import type { ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
    text: <Type size={18} />,
    heading: <Heading size={18} />,
    image: <ImageIcon size={18} />,
    video: <Video size={18} />,
    columns: <Columns2 size={18} />,
    hero: <LayoutTemplate size={18} />,
};

export function getBlockIcon(type: string) {
    return ICONS[type.toLowerCase()] ?? <Box size={18} />;
}