import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { capitalize } from '../utils/format';
import { getPokemonSpecies } from '../services/api';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'PokemonDetail'>;

export const PokemonDetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { pokemon } = route.params;

  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExtraInfo = async () => {
      setIsLoading(true);
      const desc = await getPokemonSpecies(pokemon.id);
      setDescription(desc);
      setIsLoading(false);
    };
    fetchExtraInfo();
  }, [pokemon.id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

        <View style={styles.typeContainer}>
          {pokemon.types.map((type, index) => (
            <Text key={index} style={styles.typeBadge}>
              {capitalize(type)}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
          <Text style={styles.statLabel}>Peso</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
          <Text style={styles.statLabel}>Altura</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Sobre</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  image: { width: 220, height: 220 },
  name: { fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  typeContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
  typeBadge: {
    backgroundColor: '#444',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    fontWeight: 'bold'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 20
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 14, color: '#666' },
  infoContainer: { padding: 25 },
  infoTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#333', lineHeight: 24, textAlign: 'justify' }
});
