import axios from 'axios';
import { Pokemon, PokemonListItem } from '../types/Pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

export async function getPokemons(limit: number, offset: number = 0): Promise<PokemonListItem[]> {
  try {
    const res = await axios.get(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
    return res.data.results;
  } catch (error) {
    throw new Error("Falha ao carregar lista.");
  }
}

export async function getPokemonDetails(url: string): Promise<Pokemon> {
  try {
    const res = await axios.get(url);
    return {
      id: res.data.id,
      name: res.data.name,
      image: res.data.sprites.front_default,
      types: res.data.types.map((t: any) => t.type.name),
      height: res.data.height, 
      weight: res.data.weight,
    };
  } catch (error) {
    throw new Error("Falha ao carregar detalhes.");
  }
}

export async function getPokemonSpecies(id: number): Promise<string> {
  try {
    const res = await axios.get(`${API_BASE}/pokemon-species/${id}`);
    const entry = res.data.flavor_text_entries.find((e: any) => e.language.name === 'en');
    return entry ? entry.flavor_text.replace(/\n|\f/g, ' ') : "Descrição não disponível.";
  } catch (error) {
    return "Descrição não disponível.";
  }
}
