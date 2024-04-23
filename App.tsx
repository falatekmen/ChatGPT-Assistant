import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { RootSiblingParent } from 'react-native-root-siblings'
import ChatPage from './app/screens/ChatPage';
import ImagesPage from './app/screens/ImagesPage';
import SettingsPage from './app/screens/SettingsPage';
import WhisperPage from './app/screens/WhisperPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_API_KEY } from './app/constants/constants';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {

  const openAccount = () => {
    WebBrowser.openBrowserAsync('https://platform.openai.com/account/usage')
  }

  const openHelp = () => {
    WebBrowser.openBrowserAsync('https://help.openai.com/en/collections/3742473-chatgpt')
  }
  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_API_KEY)
    props.navigation.navigate('Settings')
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#18191a', padding: 6 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="New chat"
          labelStyle={{ color: '#fff' }}
          style={{ borderRadius: 6, borderWidth: 1, borderColor: '#ffffff33' }}
          icon={() => <Ionicons name='add-outline' size={24} color="white" />}
          onPress={() => { props.navigation.navigate('Chat') }}
        />
        <DrawerItem
          label="Generate image"
          labelStyle={{ color: '#fff' }}
          icon={() => <Ionicons name='camera-outline' size={24} color="white" />}
          onPress={() => { props.navigation.navigate('Images') }}
        />
        <DrawerItem
          label="Speech to text"
          labelStyle={{ color: '#fff' }}
          icon={() => <Ionicons name='mic-outline' size={24} color="white" />}
          onPress={() => { props.navigation.navigate('Whisper') }}
        />
      </DrawerContentScrollView>
      <View style={{ height: 240, borderTopColor: '#ffffff33', borderTopWidth: 1 }}>
        <DrawerItem
          label="My account"
          labelStyle={{ color: '#fff' }}
          icon={() => <Ionicons name='person-outline' size={24} color="white" />}
          onPress={openAccount}
        />
        <DrawerItem
          label="Get help"
          labelStyle={{ color: '#fff' }}
          icon={() => <Ionicons name='share-outline' size={24} color="white" />}
          onPress={openHelp}
        />
        <DrawerItem
          label="Settings"
          labelStyle={{ color: '#fff' }}
          icon={() => <Ionicons name='settings-outline' size={24} color="white" />}
          onPress={() => { props.navigation.navigate('Settings') }}
        />
        <DrawerItem
          label="Log out"
          labelStyle={{ color: '#fff' }}
          icon={() => <Ionicons name='log-out-outline' size={24} color="white" />}
          onPress={signOut}
        />
      </View>
    </View>
  )
}


type DrawerParamList = {
  Chat: undefined;
  Settings: undefined;
  Images: undefined;
  Whisper: undefined;
}

const Drawer = createDrawerNavigator<DrawerParamList>()

const DrawerNavigation = () => {
  const dimensions = useWindowDimensions()
  const isLargeScreen = dimensions.width >= 768

  return (
    <Drawer.Navigator
      initialRouteName='Settings'
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerTintColor: '#18191a',
        drawerType: isLargeScreen ? 'permanent' : 'front'
      }}
    >
      <Drawer.Screen name='Chat' component={ChatPage} />
      <Drawer.Screen name='Settings' component={SettingsPage} />
      <Drawer.Screen name='Images' component={ImagesPage} />
      <Drawer.Screen name='Whisper' component={WhisperPage} />
    </Drawer.Navigator>
  )
}

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer >
        <DrawerNavigation />
      </NavigationContainer>
    </RootSiblingParent>
  );
}

