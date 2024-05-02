import { View, Text, Alert, StyleSheet, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-root-toast';
import * as WebBrowser from 'expo-web-browser';
import { useApiKeyContext } from '../contexts/apiKeyContext';

const ApiKeyPage = () => {

  const { apiKey, setApiKey } = useApiKeyContext();
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);

  // Function to open the OpenAI API keys page in a browser
  const openApiKeysPage = () => {
    WebBrowser.openBrowserAsync('https://platform.openai.com/api-keys');
  };

  // Save API key to context
  const saveApiKey = async () => {
    if (apiKeyInput.trim().length > 0) {
      setApiKey(apiKeyInput);
      Toast.show('API key saved', { duration: Toast.durations.SHORT });
    } else {
      Alert.alert('Error', 'Please enter a valid API key');
    }
  };

  // Remove API key from context
  const removeApiKey = async () => {
    setApiKey('');
    setApiKeyInput('');
    Toast.show('API key removed', { duration: Toast.durations.SHORT });
  };

  // Function to handle button press
  const handleButtonPress = () => {
    if (apiKey) {
      removeApiKey();
    } else {
      saveApiKey();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        To connect with AI, add an API key. You can obtain an API key from
        {' '}
        <Text style={styles.linkText} onPress={openApiKeysPage}>
          https://platform.openai.com/api-keys
        </Text>
        .
      </Text>
      <TextInput
        value={apiKeyInput}
        onChangeText={setApiKeyInput}
        placeholder='Enter your API key'
        autoCorrect={false}
        autoCapitalize='none'
        style={styles.input}
        editable={!apiKey}
      />
      <Pressable onPress={handleButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>
          {apiKey ? 'Remove' : 'Save'}
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

export default ApiKeyPage;