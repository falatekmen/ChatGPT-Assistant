import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-root-toast'
import { useIsFocused } from '@react-navigation/native'
import { STORAGE_API_KEY } from '../constants/constants'


const SettingsPage = () => {

  const [apiKey, setApiKey] = useState('')
  const [hasKey, setHasKey] = useState(false)

  const isFocused = useIsFocused()

  useEffect(() => {
    loadApiKey()
  }, [isFocused])

  const loadApiKey = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_API_KEY)
      if (value !== null) {
        setApiKey(value)
        setHasKey(true)
      } else {
        setApiKey('')
        setHasKey(false)
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load API key')
    }
  }

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_API_KEY, apiKey)
      setHasKey(true)
      Toast.show('API key saved', { duration: Toast.durations.SHORT })
    } catch (error) {
      Alert.alert('Error', 'Could not save API key')
    }
  }

  const removeApiKey = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_API_KEY)
      setHasKey(false)
      setApiKey('')
    } catch (error) {
      Alert.alert('Error', 'Could not save API key')
    }
  }

  return (
    <View style={styles.container}>
      {hasKey && (
        <>
          <Text style={styles.label}>You are all set!</Text>
          <TouchableOpacity style={styles.button} onPress={removeApiKey}>
            <Text style={styles.buttonText} >Remove API Key</Text>
          </TouchableOpacity>
        </>
      )}
      {!hasKey && (
        <>
          <Text style={styles.label}>API key:</Text>
          <TextInput
            value={apiKey}
            onChangeText={setApiKey}
            placeholder='Enter your API key'
            autoCorrect={false}
            autoCapitalize='none'
            style={styles.input}
          />
          <TouchableOpacity onPress={saveApiKey} style={styles.button} >
            <Text style={styles.buttonText} >Save API Key</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#18191a',
    borderRadius: 5,
    padding: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
})


export default SettingsPage