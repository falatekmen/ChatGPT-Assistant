import { RootSiblingParent } from 'react-native-root-siblings'
import RootNavigator from './app/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';


export default function App() {
  return (
    <RootSiblingParent>
      <StatusBar style="light" />
      <RootNavigator />
    </RootSiblingParent>
  );
}