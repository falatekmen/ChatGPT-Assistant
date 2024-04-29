import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { OpenAI } from "openai";
import { STORAGE_API_KEY } from "../constants/constants";

export enum Creator {
    User = "user",
    Assistant = "assistant",
}

export interface Message {
    content: string;
    role: Creator;
}

// Main hook for API interaction
export const useApi = () => {
    // State for storing all chat messages
    const [messages, setMessages] = useState<Message[]>([]);

    // Function to get a completion from OpenAI
    const getCompletion = async (prompt: string) => {
        // Retrieve API key from storage
        const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

        // Display an alert if API key is not found
        if (!apiKey) {
            const errorMessage = 'No API key found';
            if (Platform.OS === 'web') {
                window.alert(errorMessage);
            } else {
                Alert.alert(errorMessage);
            }
            return false;
        }

        // Create a new user message with the prompt
        const newUserMessage: Message = {
            content: prompt,
            role: Creator.User,
        };

        // Update messages state with the new user message
        const chatHistory = [...messages, newUserMessage];
        setMessages(chatHistory);

        try {
            // Create OpenAI instance and request a chat completion
            // (Visit the website for a different models: https://platform.openai.com/docs/models.)
            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: chatHistory,
            });

            // Extract the AI's response text
            const responseText = completion.choices[0].message.content?.trim() || 'Something went wrong!';

            // Create a new AI message with the assistant's response
            const aiMessage: Message = {
                content: responseText,
                role: Creator.Assistant,
            };

            // Update messages state with the new AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

            return true;
        } catch (error) {
            // Handle any errors that occur during the completion request
            const errorMessage = error instanceof Error ? error.message : "An error occurred";

            // Create a new AI message with the error message
            const aiMessage: Message = {
                content: errorMessage,
                role: Creator.Assistant,
            };

            // Update messages state with the new AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

            return false;
        }
    };

    // Handle image generation based on user prompt
    const generateImage = async (prompt: string) => {

        // Retrieve API key from storage
        const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY)

        // Display an alert if API key is not found
        if (!apiKey) {
            if (Platform.OS === 'web') {
                window.alert('No API key found');
            } else {
                Alert.alert('No API key found')
            }
            return
        }

        // Create OpenAI instance and generate an image
        // (Visit the website for a different model: https://platform.openai.com/docs/models.)
        const openai = new OpenAI({ apiKey: apiKey });
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
        });

        // Return the URL of the generated image
        const image_url = response.data[0].url;
        return image_url
    }

    return {
        messages,
        getCompletion,
        generateImage
    };
};
