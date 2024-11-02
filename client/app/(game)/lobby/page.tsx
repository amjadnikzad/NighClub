"use client";

import { Button } from "@nextui-org/button"

import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal"
import { Spinner } from "@nextui-org/spinner"
import { useState } from "react"
import SpinnerModal from "@/components/UI/SpinnerModal"
import { useLocalStorage } from "@uidotdev/usehooks"
import FormModal from "@/components/UI/formModal"
import SetNameModal from "@/components/UI/setNameModal"
import { getFromLocalStorage, setToLocalStorage } from "@/components/utils/utils";
import { useRouter } from "next/navigation";



export default function Component() {
    const router = useRouter();
    const { isOpen: setNameIsOPen, onOpen: setNameOnOpen, onClose: setNameOnClose } = useDisclosure();
    const createGameHandler = async () => {
        const name = getFromLocalStorage('Uname');
        if (!name) setNameOnOpen();
        else {
            onOpen();
            const res = await fetch('http://localhost:3000/games/create', {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    "gameMode": "4",
                    "name": name,
                    "gameType": "H"
                })
            });
            if (res.ok) {
                const response = await res.json();
                localStorage.setItem('JWT', response.accessToken);
                console.log('JWT saved');
                router.push('/board')
            }


        }


    };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const nameModalSubmit = () => {
        setToLocalStorage('Uname','amjad');
        setNameOnClose();
    };
    return (
        <>
            <SetNameModal controls={{ isOpen: setNameIsOPen, onOpen: setNameOnOpen, onClose: setNameOnClose, onSubmit: nameModalSubmit }} />
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
            <SpinnerModal controls={{ isOpen }} content="Connecting" />
        </>

    )
};


