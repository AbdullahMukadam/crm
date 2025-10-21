import { Block } from "@/types/proposal";

export const ProposalBuilderBlocks : Block[] = [
    {
        id: '1',
        type: 'text',
        props: { content: 'This is a text block' },
        size : { width: 400, height: 200 },
        position : { x: 50, y: 50 }
    },
    {
        id: '2',
        type: 'image',
        props: { src: 'https://via.placeholder.com/150', alt: 'Placeholder Image' },
        size : { width: 400, height: 300 },
        position : { x: 50, y: 50 }
    },
    {
        id: '3',
        type: 'video',
        props: { src: 'https://www.w3schools.com/html/mov_bbb.mp4', controls: true },
        size : { width: 500, height: 350 },
        position : { x: 50, y: 50 }
    }
]