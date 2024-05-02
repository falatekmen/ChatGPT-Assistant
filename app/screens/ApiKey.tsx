import { View, Text, Alert, StyleSheet, TextInput, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import { useIsFocused } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { STORAGE_API_KEY } from '../constants/constants';


const KeyPage = () => {

  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiKeyExists, setApiKeyExists] = useState(false);

  const isFocused = useIsFocused();

  // Function to open the OpenAI API keys page in a browser
  const openApiKeysPage = () => {
    WebBrowser.openBrowserAsync('https://platform.openai.com/api-keys');
  };

  // Load API key when the page is focused
  useEffect(() => {
    loadApiKey();
  }, [isFocused]);

  // Load API key from storage
  const loadApiKey = async () => {
    try {
      const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

      if (apiKey !== null) {
        setApiKeyValue(apiKey);
        setApiKeyExists(true);
      } else {
        setApiKeyValue('');
        setApiKeyExists(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load API key');
    }
  };

  // Save API key to storage
  const saveApiKey = async () => {
    if (apiKeyValue.trim().length > 0) {
      try {
        await AsyncStorage.setItem(STORAGE_API_KEY, apiKeyValue);
        setApiKeyExists(true);
        Toast.show('API key saved', { duration: Toast.durations.SHORT });
      } catch (error) {
        Alert.alert('Error', 'Could not save API key');
      }
    }
  };

  // Remove API key from storage
  const removeApiKey = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_API_KEY);
      setApiKeyExists(false);
      setApiKeyValue('');
      Toast.show('API key removed', { duration: Toast.durations.SHORT });
    } catch (error) {
      Alert.alert('Error', 'Could not remove API key');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        You need to add an API key to connect to the AI. You can obtain the key by visiting
        {' '}
        <Text style={styles.linkText} onPress={openApiKeysPage}>
          https://platform.openai.com/api-keys
        </Text>
      </Text>
      <TextInput
        value={apiKeyValue}
        onChangeText={setApiKeyValue}
        placeholder='Enter your API key'
        autoCorrect={false}
        autoCapitalize='none'
        style={styles.input}
        editable={!apiKeyExists}
      />
      <Pressable
        onPress={apiKeyExists ? removeApiKey : saveApiKey}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {apiKeyExists ? 'Remove' : 'Save'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#0D0D0D',
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  linkText: {
    color: '#0F66CC',
    textDecorationLine: 'underline',
  },
  input: {
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#2F2F2F',
    borderRadius: 8,
    padding: 8,
    marginVertical: 24,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#18191a',
    borderColor: '#2F2F2F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'center',
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default KeyPage;