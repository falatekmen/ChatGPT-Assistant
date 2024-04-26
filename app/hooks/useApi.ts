import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import OpenAI from "openai";
import { BehaviorSubject } from "rxjs";
import { STORAGE_API_KEY } from "../constants/constants";

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
            text: 'JavaScript is a high-level, interpreted programming language primarily used for creating dynamic and interactive content on the web. It was first developed by Netscape in the mid-1990s to enhance web pages with interactivity and client-side functionality. JavaScript allows developers to add features such as animations, form validation, user interface components, and event handling to websites.',
            from: Creator.Bot
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
        const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY)
        if (!apiKey) {
            if (Platform.OS === 'web') {
                window.alert('No API key found');
            } else {
                Alert.alert('No API key found')
            }
            return
        }

        const newMessage: Message = {
            text: prompt,
            from: Creator.Me
        }

        messageSubject.next([...messageSubject.value, newMessage])

        try {
            const openai = new OpenAI({ apiKey: apiKey });
            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-3.5-turbo',
            };

            const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
            const response = chatCompletion.choices[0].message.content?.trim() || 'Something went wrong!'

            const botMessage: Message = {
                text: response,
                from: Creator.Bot
            }

            messageSubject.next([...messageSubject.value, botMessage])
            return true

        } catch (error) {
            if (error instanceof Error) {
                const botMessage: Message = {
                    text: error.message,
                    from: Creator.Bot
                }
                messageSubject.next([...messageSubject.value, botMessage])
                return false

            } else {
                const botMessage: Message = {
                    text: "An error occured",
                    from: Creator.Bot
                }
                messageSubject.next([...messageSubject.value, botMessage])
                return false
            }
        }
    }

    const generateImage = async (prompt: string) => {
        const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY)
        if (!apiKey) {
            if (Platform.OS === 'web') {
                window.alert('No API key found');
            } else {
                Alert.alert('No API key found')
            }
            return
        }

        const openai = new OpenAI({ apiKey: apiKey });
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
        });

        const image_url = response.data[0].url;
        return image_url
    }

    return {
        messages,
        getCompletion,
        generateImage
    }
}