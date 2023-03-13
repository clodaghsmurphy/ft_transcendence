import React, { useContext } from 'react';
import { PromptContext, PromptProps } from './store/reducer/Prompt/PromptContext';

export const usePrompt = () =>
{
    const [, setPrompt] = useContext(PromptContext);

    const triggerPrompt = (props: PromptProps) =>
    {
        setPrompt({isOpen: true, props});
    }
    return { triggerPrompt} ;
}