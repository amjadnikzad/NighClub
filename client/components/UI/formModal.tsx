'use client'

import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal"
import { Spinner } from "@nextui-org/spinner";
import { Children, ReactElement } from "react";

interface Loaderprops {
    title:string;
    controls:{
        isOpen?:boolean,
        onOpen?:()=>void,
        onClose?:()=>void,
        onSubmit:()=>void
    };
    children: ReactElement
}

export default function FormModal({title,controls,children}:Loaderprops) {
    
    return (
          <Modal 
            isOpen={controls.isOpen} 
            onOpenChange={controls.onOpen}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                  <ModalBody>
                    {children}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={controls.onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={controls.onSubmit}>
                      Confirm
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        
      );
}