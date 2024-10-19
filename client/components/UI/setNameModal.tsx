"use client"

import { Input } from "@nextui-org/input";
import FormModal from "./formModal";
import { useLocalStorage } from "@uidotdev/usehooks";

interface Loaderprops {
    controls:{
        isOpen?:boolean,
        onOpen?:()=>void,
        onClose?:()=>void,
        onSubmit:()=>void
    };
}

export default function SetNameModal({controls}:Loaderprops){
    
    const submitHandler = ()=>console.log('submit clicked')
    return(
        <FormModal controls={{isOpen:controls.isOpen,onSubmit:submitHandler,onClose:controls.onClose}} title="Please enter a name">
            <Input
                  autoFocus
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
        </FormModal>
    )
}