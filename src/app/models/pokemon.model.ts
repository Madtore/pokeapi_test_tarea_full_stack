export interface PokemonEvolution {
    id: number;
    name: string;
    image: string;
  }
  

 export interface PokemonOption {
    name: string;
    url : string;
    id: number;
  }


  export interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: string[];
    abilities: Ability[];
    evolutionChainId: number;
    weight?: number;
    height?: number;
    stats?: {
      name: string;
      base: number;
    }[];
  }
  
  export interface Ability {
    name: string;
    description: string;
    isHidden: boolean;
  }
  