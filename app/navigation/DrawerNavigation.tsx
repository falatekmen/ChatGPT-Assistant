import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
    createDrawerNavigator,
} from '@react-navigation/drawer';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import Chat from '../screens/Chat';
import Images from '../screens/Images';
import ApiKeyPage from '../screens/ApiKey';
import Whisper from '../screens/Whisper';


type DrawerParamList = {
    Chat: undefined;
    Images: undefined;
    Whisper: undefined;
    ApiKeyPage: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {

    const openUsagePage = () => {
        WebBrowser.openBrowserAsync('https://platform.openai.com/account/usage');
    };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label='ChatGPT'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='create-outline' size={24} color='white' />}
                    onPress={() => props.navigation.navigate('Chat')}
                />
                <DrawerItem
                    label='DALL·E'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='image-outline' size={24} color='white' />}
                    onPress={() => props.navigation.navigate('Images')}
                />
                <DrawerItem
                    label='Whisper'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='mic-outline' size={24} color='white' />}
                    onPress={() => props.navigation.navigate('Whisper')}
                />
            </DrawerContentScrollView>

            <View style={styles.footerContainer}>
                <DrawerItem
                    label='Usage'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='podium-outline' size={24} color='white' />}
                    onPress={openUsagePage}
                />
                <DrawerItem
                    label='API Key'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='key-outline' size={24} color='white' />}
                    onPress={() => props.navigation.navigate('ApiKeyPage')}
                />
            </View>
        </View>
    );
};


export default function DrawerNavigation() {

    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    return (
        <Drawer.Navigator
            initialRouteName='Chat'
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor: '#0D0D0D',
                },
                drawerType: isLargeScreen ? 'permanent' : 'front',
                headerLeft: isLargeScreen
                    ? () => null
                    : () => <Ionicons name='menu' size={24} color='white' style={styles.menuIcon} />
            }}
        >
            <Drawer.Screen name='Chat' component={Chat} />
            <Drawer.Screen name='Images' component={Images} />
            <Drawer.Screen name='Whisper' component={Whisper} />
            <Drawer.Screen name='ApiKeyPage' component={ApiKeyPage} options={{ headerTitle: "API Key" }} />
        </Drawer.Navigator >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717',
        padding: 8,
        paddingTop: 16,
    },
    drawerItemLabel: {
        color: '#fff',
    },
    footerContainer: {
        borderTopColor: '#ffffff33',
        borderTopWidth: 1,
        marginBottom: 20,
        paddingTop: 10,
    },
    menuIcon: {
        marginHorizontal: 14,
    },
});
