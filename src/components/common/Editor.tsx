import { useEditor } from '@/hooks/useEditor'
import { OutputData } from '@editorjs/editorjs'
import React, { memo, useEffect, useRef } from 'react'


function Editor() {

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
    const editorDataRef = useRef<OutputData>(defaultData);
    console.log("editor component rendering")

    useEffect(() => {
        // Update editor data ref when initialData changes
        if (defaultData && !hasInitializedRef.current) {
            editorDataRef.current = defaultData;
            hasInitializedRef.current = true;
            console.log("Editor data initialized", editorDataRef.current)
        }
    }, [defaultData]);

    const { editorRef } = useEditor({
        defaultData: defaultData,
    })


    return (
        <div className='editor'>
            <div ref={editorRef} />
        </div>
    )
}

export default memo(Editor)