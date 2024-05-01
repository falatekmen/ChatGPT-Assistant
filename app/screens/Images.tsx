import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  Dimensions,
  FlatList,
  Platform
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Message, Role, useApi } from '../hooks/useApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;

const ImagesPage = () => {

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const { generateImage, messages } = useApi();
  const flatListRef = useRef<FlatList>(null);

  // Handle image generation
  const onGenerateImage = async () => {
    if (text.trim().length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      const messageContent = text.trim();
      setText('');
      setLoading(true);
      await generateImage(messageContent);
      setLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Render a single message in the chat
  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.role === Role.User;

    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {isUserMessage ?
          <Text style={styles.messageText} selectable>{item.content}</Text>
          :
          item.content.startsWith('https') ?
            <Image style={styles.image} source={{ uri: item.content }} />
            :
            <Text style={styles.messageText} selectable>{item.content}</Text>
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          loading ? <ActivityIndicator style={styles.footerIndicator} /> : null
        }
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder='/imagine'
            placeholderTextColor={'#fff7'}
            editable={!loading}
            multiline
          />
        </View>
        <Pressable
          style={styles.sendButton}
          onPress={onGenerateImage}
          disabled={loading}
        >
          <Ionicons name='image' size={24} color='white' />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#2F2F2F',
    borderRadius: 16,
    minHeight: 40,
    backgroundColor: '#242424',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  textInput: {
    color: '#fff',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#18191a',
    borderRadius: 99,
    padding: 12,
    marginLeft: 8,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: '#2F2F2F',
  },
  messageContainer: {
    gap: 12,
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
  image: {
    width: Platform.OS === 'web' ? windowWidth / 1.5 : windowWidth - 24,
    height: Platform.OS === 'web' ? windowWidth / 1.5 : windowWidth - 24,
  },
  messageText: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    color: '#fff',
    alignSelf: 'center'
  },
  footerIndicator: {
    marginTop: 20,
  },
});

export default ImagesPage;
