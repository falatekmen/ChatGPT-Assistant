import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  TextInput,
  FlatList,
  Alert,
  Platform
} from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Message, Role, useApi } from '../hooks/useApi';
import userImage from '../../assets/user.png';
import aiImage from '../../assets/ai.png';


const WhisperPage = () => {

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);

  const { speechToText, getCompletion, messages } = useApi();
  const flatListRef = useRef<FlatList>(null);

  // Start audio recording
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setAudioRecording(recording);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop audio recording and handle speech-to-text conversion
  const stopRecording = async () => {
    if (!audioRecording) return;

    setAudioRecording(null);
    await audioRecording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    handleAudioUpload();
  };

  // Handle audio file upload and speech-to-text conversion
  const handleAudioUpload = async () => {
    const uri = audioRecording?.getURI();
    if (!uri) return;

    setLoading(true);
    const result = await speechToText(uri);

    if (result?.error?.message) {
      if (Platform.OS === 'web') {
        window.alert(result.error.message);
      } else {
        Alert.alert('Error', result.error.message);
      }
    } else {
      result && setInputText(result.text);
    }

    setLoading(false);
  };

  // Handle sending a user message
  const handleSendMessage = async () => {
    if (inputText.trim().length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      const messageContent = inputText.trim();
      setInputText('');
      setLoading(true);
      await getCompletion(messageContent);
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
        isUserMessage ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}>
        <Image source={isUserMessage ? userImage : aiImage} style={styles.image} />
        <Text style={styles.messageText} selectable>{item.content}</Text>
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
        ListFooterComponent={loading ?
          <ActivityIndicator style={styles.footerIndicator} /> : null
        }
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Message'
            placeholderTextColor={'#fff7'}
            editable={!loading && !audioRecording}
            multiline
          />
        </View>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: audioRecording ? '#840f15' : '#18191a' },
          ]}
          onPress={audioRecording ? stopRecording : startRecording}
        >
          <Ionicons name='mic' size={24} color='white' />
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={handleSendMessage}
          disabled={loading || audioRecording != null}
        >
          <Ionicons name='send' size={24} color='white' />
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
  button: {
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
    width: 40,
    height: 40,
  },
  messageText: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    color: '#fff',
    alignSelf: 'center',
  },
  footerIndicator: {
    marginTop: 20,
  },
});

export default WhisperPage;
