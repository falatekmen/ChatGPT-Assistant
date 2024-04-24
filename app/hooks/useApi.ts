import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export enum Creator {
    Me = 0,
    Bot = 1,
}

export interface Message {
    text: string;
    from: Creator
}

let messageSubject: BehaviorSubject<Message[]>;

export const useApi = () => {
    const dumyMessage = [
        {
            text: 'What is Javascript?',
            from: Creator.Me
        },
        {
            text: 'What is Javascript?',
            from: Creator.Me
        }
    ]

    const [messages, setMessages] = useState<Message[]>()

    if (!messageSubject) {
        messageSubject = new BehaviorSubject(dumyMessage)
    }

    useEffect(() => {
        const subscription = messageSubject.subscribe((message) => {
            setMessages(message)
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const getCompletion = async (prompt: string) => {
        const newMessage = {
            text: prompt,
            from: Creator.Me
        }

        messageSubject.next([...messageSubject.value, newMessage])
    }

    return {
        messages,
        getCompletion
    }
}