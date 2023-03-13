import React from 'react';
import { useState, useContext } from 'react';

interface ModalProps
{
    isOpen: boolean,
    children: React.ReactNode
}

export const Modal = (props: ModalProps) => 
return (props.isOpen ? <div className="Modal" >{children} </div> : null);


export default Modal;