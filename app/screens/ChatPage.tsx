import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { useApi } from '../hooks/useApi'


const ChatPage = () => {

  const { getCompletion, messages } = useApi();
  const [inputMessage, setInputMessage] = useState('Hello')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    setLoading(true)
    await getCompletion(inputMessage)
    setLoading(false)
  }

  return (
    <View>
      <Button title='Get Completion' onPress={handleSendMessage} />
      {messages?.map((message, index) => (
        <Text key={index}>{message.text}</Text>
      ))}
    </View>
  )
}

export default ChatPage