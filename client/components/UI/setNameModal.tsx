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
    
    const submitHandler = ()=>controls.onSubmit();
    return(
        <FormModal controls={{isOpen:controls.isOpen,onSubmit:submitHandler,onClose:controls.onClose}} title="Please enter a name">
            <Input
                  autoFocus
                  label="User Name"
                  placeholder="Please Enter a username"
                  variant="bordered"
                />
        </FormModal>
    )
}