import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';
import React, { useState } from 'react';
import { Creator, Message, useApi } from '../hooks/useApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import userImage from '../../assets/user.png';
import aiImage from '../../assets/ai.png';

const ChatPage = () => {

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { getCompletion, messages } = useApi();

  // Handle sending an user message
  const handleSendMessage = async () => {
    if (inputMessage.trim().length > 0) {
      const msg = inputMessage;
      setLoading(true);
      setInputMessage('');
      await getCompletion(msg);
      setLoading(false);
    }
  };

  // Render a single message in the chat
  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.role === Creator.User;

    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        <Image source={isUserMessage ? userImage : aiImage} style={styles.image} />
        <Text style={styles.messageText} selectable>{item.content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : null
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder='Message'
          placeholderTextColor={"#fff"}
          editable={!loading}
          multiline={true}
        />
        <Pressable
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D"
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#2F2F2F',
    borderRadius: 5,
    padding: 10,
    minHeight: 40,
    backgroundColor: '#242424',
    color:"#fff"
  },
  sendButton: {
    backgroundColor: '#18191a',
    borderRadius: 5,
    padding: 12,
    marginLeft: 10,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: '#2F2F2F',
  },
  sendButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  messageContainer: {
    gap: 10,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  userMessageContainer: {
    backgroundColor: '#212121',
  },
  aiMessageContainer: {
    backgroundColor: '#0D0D0D',
  },
  messageText: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    color:'#fff'
  },
});

export default ChatPage;
