import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PokedexScreen } from './screens/PokedexScreen';
import { PokemonDetailScreen } from './screens/PokemonDetailScreen';
import { Pokemon } from './types/Pokemon';
import { capitalize } from './utils/format';

export type RootStackParamList = {
  Pokedex: undefined;
  PokemonDetail: { pokemon: Pokemon };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Pokedex">
          <Stack.Screen
            name="Pokedex"
            component={PokedexScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PokemonDetail"
            component={PokemonDetailScreen}
            options={({ route }) => ({
              title: capitalize(route.params.pokemon.name),
              headerBackTitleVisible: false
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
