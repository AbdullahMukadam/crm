import { useEditor } from '@/hooks/useEditor'
import { Block } from '@/types/proposal'
import { OutputData } from '@editorjs/editorjs'
import React, { memo, useEffect, useRef } from 'react'


interface EditorProps {
    block: Block,
    updateBlockProps: (blockId: string, newProps: Record<string, any>) => void
}
function Editor({ block, updateBlockProps }: EditorProps) {
    console.log(block, "in the editor component")

    const defaultData: OutputData = {
        time: Date.now(),
        blocks: [
            {
                id: "initial-block",
                type: "paragraph",
                data: { text: "Start writing!" },
            },
        ],
    };

    const hasInitializedRef = useRef(false);
    const editorDataRef = useRef<OutputData>(block.props.data || defaultData);

    useEffect(() => {
        if (defaultData && !hasInitializedRef.current) {
            editorDataRef.current = defaultData;
            hasInitializedRef.current = true;
        }
    }, [defaultData]);

    const { editorRef } = useEditor({
        defaultData: editorDataRef.current,
        updateBlockProps,
        block
    })


    return (
        <div className='editor'>
            <div ref={editorRef} />
        </div>
    )
}

export default memo(Editor)