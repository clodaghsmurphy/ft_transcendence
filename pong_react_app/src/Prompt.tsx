import React from 'react';
import { useState, useContext, useEffect,  Component } from 'react';
import Modal from './Modal';
import { defaultValue, PromptContext, PromptProps } from './store/reducer/Prompt/PromptContext';



export const Prompt = () =>
{
    const [prompt, setPrompt] = useContext(PromptContext);
    const [input, setInput] = useState("");
    const {
        isOpen,
        props: { text, title, value, isInput, onSubmit}
    } = prompt;

    const closePrompt = () => setPrompt({...prompt, isOpen: false,});
    useEffect(() =>
    {
        value && setInput(value);
    }, [isOpen, value]);

    return (
        <>
        {isOpen ? <Modal isOpen={isOpen}/>
        : null };
        </>
    );
}

export default Prompt;