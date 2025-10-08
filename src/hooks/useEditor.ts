import { useCallback, useEffect, useRef } from "react";
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EDITOR_CONFIG, EDITOR_TOOLS } from "@/config/editorConfig";


interface EditorProps {
    defaultData?: OutputData;
}

export function useEditor({ defaultData }: EditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const editorInstanceRef = useRef<EditorJS | null>(null);
    const {autofocus, minHeight} = EDITOR_CONFIG;

    // This function seems fine, no changes needed.
    const saveData = useCallback(async () => {
        if (!editorInstanceRef.current) return;
        const data = await editorInstanceRef.current.save();
        console.log('Data saved: ', data);
    }, []);

    useEffect(() => {
        // 1. Only initialize if an instance doesn't already exist
        if (!editorInstanceRef.current) {
            const editor = new EditorJS({
                holder: editorRef.current!,
                tools: EDITOR_TOOLS,
                data: defaultData,
                readOnly: false,
                placeholder: 'Start writing your content here...',
                autofocus,
                minHeight,
                onReady: () => {
                    console.log('Editor.js is ready to work!');
                },
                onChange: async () => {
                    await saveData()
                },
            });
            editorInstanceRef.current = editor;
        }

        // 2. Add the correct cleanup function
        return () => {
            if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
                console.log("Destroying editor instance.");
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, []);


    return {
        editorRef
    };
}