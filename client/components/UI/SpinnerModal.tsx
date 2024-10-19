"use client"

import { Modal, ModalContent } from "@nextui-org/modal"
import { Spinner } from "@nextui-org/spinner";

interface Loaderprops {
    content:string;
    controls:{
        isOpen?:boolean,
        onOpen?:()=>void,
        onClose?:()=>void
    }
}

export default function SpinnerModal({content,controls}:Loaderprops) {
    
    return (
        <Modal
            className=" "
            classNames={{
                closeButton: 'hidden',
                base: 'shadow-none ',
            }} isDismissable={false} isOpen={controls.isOpen}  backdrop="blur" placement="bottom-center">
            <ModalContent className="bg-transparent border-transparent  ">
                <Spinner classNames={{ label: 'text-2xl text-white' }} label={content} color="primary" size="lg" />
            </ModalContent>

        </Modal>
    )
}