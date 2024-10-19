"use client";

import { Button } from "@nextui-org/button"

import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal"
import { useState } from "react"
import SpinnerModal from '../../../components/UI/SpinnerModal';
import SetNameModal from '../../../components/UI/setNameModal';
import { getFromLocalStorage } from "../../../components/utils/utils";
// enum panels {
//     lobby = 'LOBBY ',
//     join = 'JOIN',
//     create = 'CREATE'
// }
// interface LobbyProps {
//     searchParams: {
//         panel: panels,
//     }
// }


export default function Component() {
   
    // const createGameHandler = ()=>{
    //     if (!name)
    // };
    const { isOpen:setNameIsOPen, onOpen:setNameOnOpen, onClose:seNameOnClose } = useDisclosure();
    const [directed,setDirected] = useState<string>('');
    const createGameHandler = ()=>{
        const name = getFromLocalStorage('name');
        if(!name) {
            setDirected('CG');
            setNameOnOpen();
        } else ;
    };
    const joinGameHandler = ()=>{};

    const setNameSubmitHandler = ()=>{
        if(directed === 'CG'){
            setDirected('');
            createGameHandler();
        }else joinGameHandler();
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <SetNameModal controls={{isOpen:setNameIsOPen,onOpen:setNameOnOpen,onClose:seNameOnClose,onSubmit:setNameSubmitHandler}} />
            <div className="flex min-h-screen items-center justify-center bg-background p-4 ">
                <div className="w-full max-w-sm space-y-4 rounded-lg border border-border  p-6 shadow-sm ">

                    <Button onClick={createGameHandler} className="w-full text-xl" size="lg" color="success" variant="ghost" >
                        Create game
                    </Button>
                    <Button className="w-full  text-xl" size="lg" color="danger" >
                        Join game
                    </Button>
                </div>

            </div>
            <SpinnerModal controls={{isOpen}} content="Connecting" />
        </>

    )
};


