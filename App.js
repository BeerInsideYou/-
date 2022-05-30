import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as theme } from './styles/custom-theme.json';

import Splash  from './pages/Splash';
import Login from './pages/Login';

import Menu from "./pages/Menu";

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store/store';
import { Colors } from './styles'
import {Map} from './pages/Map'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Splash" screenOptions={{
                          headerStyle: {
                            backgroundColor: Colors.primary,
                          },
                          headerTintColor: '#fff'
                        }}>
                <Stack.Screen name="Splash" component={ Splash } options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={ Login } options={{ headerShown: false }} />
                <Stack.Screen name="Menu" component={Menu} options={{headerShown: false, title: 'Личный кабинет'}}/>
                <Stack.Screen name="Map" component={Map} options={{headerShown: true, title: 'Map'}}/>
              </Stack.Navigator>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </ApplicationProvider>
    </>
  );
}

export default App;
