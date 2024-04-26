import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native'
import React, { useState } from 'react'
import { useApi } from '../hooks/useApi'


const ImagesPage = () => {

  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const { generateImage } = useApi()

  const onGenerateImage = async () => {
    setLoading(true)
    const image = await generateImage(text)
    setImage(image || '')
    setLoading(false)
    setText('')
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder='Type your message'
        editable={!loading}
      />
      <Pressable
        style={styles.button}
        onPress={onGenerateImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Generate Image</Text>
      </Pressable>
      {
        loading && <ActivityIndicator style={styles.indicator} size={'large'} />
      }
      {
        image && <Image style={styles.image} source={{ uri: image }} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  button: {
    backgroundColor: '#18191a',
    borderRadius: 5,
    padding: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  },
  indicator: {
    marginTop: 20
  },
  image: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").width - 40,
    marginTop: 20
  },
})

export default ImagesPage