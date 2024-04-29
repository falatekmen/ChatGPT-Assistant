import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';


export default function RootNavigator() {
  return (
      <NavigationContainer >
        <DrawerNavigation />
      </NavigationContainer>
  );
}