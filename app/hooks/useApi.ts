import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { OpenAI } from 'openai';
import { useApiKeyContext } from '../contexts/apiKeyContext';


// Enum for message roles
export enum Role {
    User = 'user',
    Assistant = 'assistant',
}

// Interface for messages
export interface Message {
    content: string;
    role: Role;
}

// Main hook for API interaction
export const useApi = () => {

    // State to store all chat messages
    const [messages, setMessages] = useState<Message[]>([]);

    // Retrieve API key from useApiKey hook
    const { apiKey } = useApiKeyContext();

    // Function to get a completion from OpenAI
    const getCompletion = async (prompt: string) => {

        // Check if API key is not found
        if (!apiKey) {
            const errorMessage = 'No API key found';
            if (Platform.OS === 'web') {
                window.alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
            return;
        }

        // Create a new user message with the prompt
        const userMessage: Message = {
            content: prompt,
            role: Role.User,
        };

        // Update messages state with the new user message
        const chatHistory = [...messages, userMessage];
        setMessages(chatHistory);

        try {
            // Create OpenAI instance and request a chat completion
            // (For different models: https://platform.openai.com/docs/models)
            // Using `dangerouslyAllowBrowser: true` option only for web environments
            // to enable API key usage in the browser.
            const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: chatHistory,
            });

            // Extract the AI's response text
            const aiResponse = completion.choices[0].message.content?.trim() || 'An error occurred';

            // Create a new AI message with the AI's response
            const aiMessage: Message = {
                content: aiResponse,
                role: Role.Assistant,
            };

            // Update messages state with the new AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

        } catch (error) {
            // Handle any errors that occur during the completion request
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';

            // Create a new AI message with the error message
            const aiMessage: Message = {
                content: errorMessage,
                role: Role.Assistant,
            };

            // Update messages state with the new AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
    };

    // Function to generate an image based on the user prompt
    const generateImage = async (prompt: string) => {

        // Check if API key is not found
        if (!apiKey) {
            const errorMessage = 'No API key found';
            if (Platform.OS === 'web') {
                window.alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
            return;
        }

        // Create a new user message with the prompt
        const newUserMessage: Message = {
            content: prompt,
            role: Role.User,
        };

        // Update messages state with the new user message
        const chatHistory = [...messages, newUserMessage];
        setMessages(chatHistory);

        try {
            // Create OpenAI instance and generate an image
            // (For a different model: https://platform.openai.com/docs/models)
            // Using `dangerouslyAllowBrowser: true` option only for web environments
            // to enable API key usage in the browser.
            const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
            const response = await openai.images.generate({
                model: 'dall-e-3',
                prompt,
                n: 1,
                size: '1024x1024',
            });

            // Return the URL of the generated image
            const imageUrl = response.data[0]?.url || 'An error occurred';

            // Create a new AI message with the AI's response
            const aiMessage: Message = {
                content: imageUrl,
                role: Role.Assistant,
            };

            // Update messages state with the new AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

        } catch (error) {
            // Handle any errors that occur during the image generation request
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';

            const aiMessage: Message = {
                content: errorMessage,
                role: Role.Assistant,
            };

            // Update messages state with the error AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
    };

    // Function to convert speech to text using OpenAI
    const speechToText = async (audioUri: string) => {

        // Check if API key is not found
        if (!apiKey) {
            const errorMessage = 'No API key found';
            if (Platform.OS === 'web') {
                window.alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
            return;
        }

        try {
            // Prepare form data for the request
            const formData = new FormData();
            const audioData = {
                uri: audioUri,
                type: 'audio/mp4',
                name: 'audio/m4a',
            };

            // (For a different model: https://platform.openai.com/docs/models)
            formData.append('model', 'whisper-1');
            formData.append('file', audioData as unknown as Blob);

            // Make a POST request to the OpenAI Whisper API
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            return response.json();

        } catch (error) {
            console.error('Error in speechToText:', error);
        }
    };


    return {
        messages,
        getCompletion,
        generateImage,
        speechToText
    };
};