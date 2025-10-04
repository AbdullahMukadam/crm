import { Block } from "@/types/proposal";

export const ProposalBuilderBlocks : Block[] = [
    {
        id: '1',
        type: 'text',
        props: { content: 'This is a text block' },
    },
    {
        id: '2',
        type: 'image',
        props: { src: 'https://via.placeholder.com/150', alt: 'Placeholder Image' },
    },
    {
        id: '3',
        type: 'video',
        props: { src: 'https://www.w3schools.com/html/mov_bbb.mp4', controls: true },
    },
    {
        id: '5',
        type: 'code',
        props: { language: 'javascript', code: 'console.log("Hello, world!");' },
    }
]