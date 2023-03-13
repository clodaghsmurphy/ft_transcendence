import React from 'react';
import { useContext, createContext, useState } from 'react';

export type PromptProps =
{
    title:string,
    text:string,
    isInput: boolean,
    value?: string,
    onSubmit: (input : string) => void,
};

export type PromptContextValue =
{ 
    isOpen: boolean,
    props: PromptProps,
};

export type SetPromptContextValue = React.Dispatch<React.SetStateAction<PromptContextValue> >;

export const defaultValue: PromptContextValue = {
    isOpen: false,
    props:{
        title: "",
        text: "",
        isInput: false,
        value: "",
        onSubmit: () => null
    }
};

export const PromptContext = createContext<[PromptContextValue, SetPromptContextValue]>([defaultValue, () => {}]);
