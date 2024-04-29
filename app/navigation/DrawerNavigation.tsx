import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
    createDrawerNavigator
} from '@react-navigation/drawer';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatPage from '../screens/ChatPage';
import ImagesPage from '../screens/ImagesPage';
import SettingsPage from '../screens/SettingsPage';
import WhisperPage from '../screens/WhisperPage';
import { STORAGE_API_KEY } from '../constants/constants';


type DrawerParamList = {
    Chat: undefined;
    Settings: undefined;
    Images: undefined;
    Whisper: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const openAccount = () => {
        WebBrowser.openBrowserAsync('https://platform.openai.com/account/usage');
    };

    const openHelp = () => {
        WebBrowser.openBrowserAsync('https://help.openai.com/en/collections/3742473-chatgpt');
    };

    const signOut = async () => {
        await AsyncStorage.removeItem(STORAGE_API_KEY);
        props.navigation.navigate('Settings');
    };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label="New chat"
                    labelStyle={styles.drawerItemLabel}
                    style={styles.drawerItem}
                    icon={() => <Ionicons name='add-outline' size={24} color="white" />}
                    onPress={() => props.navigation.navigate('Chat')}
                />
                <DrawerItem
                    label="Generate image"
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='camera-outline' size={24} color="white" />}
                    onPress={() => props.navigation.navigate('Images')}
                />
                <DrawerItem
                    label="Speech to text"
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='mic-outline' size={24} color="white" />}
                    onPress={() => props.navigation.navigate('Whisper')}
                />
            </DrawerContentScrollView>

            <View style={styles.footerContainer}>
                <DrawerItem
                    label="My account"
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='person-outline' size={24} color="white" />}
                    onPress={openAccount}
                />
                <DrawerItem
                    label="Get help"
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='share-outline' size={24} color="white" />}
                    onPress={openHelp}
                />
                <DrawerItem
                    label="Settings"
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='settings-outline' size={24} color="white" />}
                    onPress={() => props.navigation.navigate('Settings')}
                />
                <DrawerItem
                    label="Log out"
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='log-out-outline' size={24} color="white" />}
                    onPress={signOut}
                />
            </View>
        </View>
    );
};

export default function DrawerNavigation() {
    // The drawer is fixed for large screens
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    return (
        <Drawer.Navigator
            initialRouteName='Settings'
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor: '#0D0D0D'
                },
                drawerType: isLargeScreen ? 'permanent' : 'front',
            }}
        >
            <Drawer.Screen name='Chat' component={ChatPage} />
            <Drawer.Screen name='Settings' component={SettingsPage} />
            <Drawer.Screen name='Images' component={ImagesPage} />
            <Drawer.Screen name='Whisper' component={WhisperPage} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717',
        padding: 6,
    },
    drawerItemLabel: {
        color: '#fff',
    },
    drawerItem: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    footerContainer: {
        height: 240,
        borderTopColor: '#ffffff33',
        borderTopWidth: 1,
    },
});
