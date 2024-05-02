import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface ApiKeyContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
}

// Create API key context
const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

// API key context provider component
export const ApiKeyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [apiKey, setApiKeyState] = useState<string>('');

    // Load API key from storage on component mount
    useEffect(() => {
        const loadApiKey = async () => {
            const key = await AsyncStorage.getItem('apiKey');
            setApiKey(key || '');
        };

        loadApiKey();
    }, []);

    // Function to update the API key state and save it to storage
    const setApiKey = async (key: string) => {
        setApiKeyState(key);
        await AsyncStorage.setItem('apiKey', key);
    };


    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

// Custom hook to use the API key context
export const useApiKeyContext = (): ApiKeyContextType => {

    const context = useContext(ApiKeyContext);

    if (!context) {
        throw new Error('useApiKeyContext must be used within an ApiKeyContextProvider');
    }

    return context;
};