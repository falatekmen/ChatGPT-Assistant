import { View, Text, Button } from 'react-native'
import React from 'react'
import { useApi } from '../hooks/useApi'


const ChatPage = () => {

  const { getCompletion, messages } = useApi();

  return (
    <View>
      <Button title='Get Completion' onPress={() => getCompletion('test')} />
      <Text>{messages?.length}</Text>
    </View>
  )
}

export default ChatPage