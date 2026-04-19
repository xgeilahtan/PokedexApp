import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const list = await getPokemons(30, 0);
        const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
        
        setPokemons(details);
      } catch (err) {
        setError('Falha ao carregar Pokémons. Verifique sua conexão.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const loadMorePokemons = async () => {
    if (isFetchingMore || isLoading || search.length > 0) return;

    try {
      setIsFetchingMore(true);
      const newOffset = offset + 30;
      
      const list = await getPokemons(30, newOffset);
      const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
      
      setPokemons(prevPokemons => [...prevPokemons, ...details]);
      setOffset(newOffset);
    } catch (err) {
      console.error("Erro ao carregar mais Pokémons", err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando Pokémons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <TextInput
        placeholder="Buscar pokémon..."
        style={styles.input}
        onChangeText={setSearch}
        value={search}
      />
      <FlatList
        data={filtered || []}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search ? `Nenhum Pokémon encontrado para '${search}'.` : 'Nenhum Pokémon para exibir no momento.'}
            </Text>
          </View>
        }
        onEndReached={loadMorePokemons}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.footerLoader} />
          ) : null
        }
        scrollEnabled={filtered.length > 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#555' },
  errorText: { color: '#d9534f', fontSize: 16, textAlign: 'center', fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footerLoader: {
    marginVertical: 20,
  }
});