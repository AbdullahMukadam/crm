import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

export const EDITOR_TOOLS = {
    header: {
        class: Header,
        config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
        },
    },
    paragraph: {
        class: Paragraph,
        config: {
            placeholder: 'Start Writing!',
        },
    },
    list: {
        class: List,
        inlineToolbar: true,
        config: {
            defaultStyle: 'unordered',
        },
    }
};

export const EDITOR_CONFIG = {
    placeholder: 'Start Writing!',
    autofocus: true,
    minHeight: 300,
    logLevel: 'ERROR' as const,
};

export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const WORDS_PER_MINUTE = 200;