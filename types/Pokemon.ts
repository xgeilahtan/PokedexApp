export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number; 
  weight: number;
}

export interface PokemonListItem {
  name: string;
  url: string;
}
