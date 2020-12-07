import 'react-native-gesture-handler';
import React, { useContext, useEffect } from 'react';

import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';

import DashboardScreen from './src/screens/DashboardScreen';
import AddNoteScreen from './src/screens/AddNoteScreen';
import ImagesScreen from './src/screens/ImagesScreen';
import NotesScreen from './src/screens/NotesScreen';
import { SocketProvider } from './src/providers/SocketProvider';
import { NotesProvider } from './src/providers/NotesProvider';
import { Colors }  from './Colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator  screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
    <Tab.Screen name='Dashboard' component={DashboardScreen} />
    <Tab.Screen name='Notes' component={NotesScreen} />
    <Tab.Screen name='Images' component={ImagesScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <SocketProvider>
      <NotesProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={({ route }) => ({ headerTitle: getHeaderTitle(route) })} />

            <Stack.Screen
              name="Add Note"
              component={AddNoteScreen}
              options={{ title: 'Agregar Nota' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </NotesProvider>
    </SocketProvider>
  );
};

const getHeaderTitle = route => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';

  switch (routeName) {
    case 'Notes': return 'Notas';
    case 'Images': return 'Imágenes';
    default: return routeName;
  }
};

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    switch(route.name) {
      case 'Dashboard':
        iconName = 'dashboard'
        break;
      case 'Notes':
        iconName = 'filetext1';
        break;
      case 'Images':
        iconName = 'picture';
        break;
    }

    return <Icon name={iconName} size={24} color={focused ? Colors.primary : 'gray'} />
  }
});

const tabBarOptions = {
  activeTintColor: Colors.primary,
  inactiveTintColor: 'gray',
  showLabel: false
};

export default App;
