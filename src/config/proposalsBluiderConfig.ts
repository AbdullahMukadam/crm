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
    },
    {
        id: '5',
        type: 'code',
        props: { language: 'javascript', code: 'console.log("Hello, world!");' },
        size : { width: 400, height: 300 },
        position : { x: 50, y: 50 }
    },
    {
        id: '6',
        type: 'chart',
        props: { chartType: 'bar', data: [5, 10, 15, 20], labels: ['Q1', 'Q2', 'Q3', 'Q4'] },
        size : { width: 400, height: 300 },
        position : { x: 50, y: 50 }
    }, 
    {
        id: '4',
        type: 'file',
        props: { fileName: 'example.pdf', fileSize: '2MB', fileUrl: '#' },
        size : { width: 400, height: 300 },
        position : { x: 50, y: 50 }
    },
]