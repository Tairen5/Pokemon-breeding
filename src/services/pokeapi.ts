export interface PokeAPIResource {
  name: string;
  url: string;
}

export interface PokemonSpeciesData {
  id: number;
  name: string;
  egg_groups: PokeAPIResource[];
}

export interface EggGroupData {
  id: number;
  name: string;
  pokemon_species: PokeAPIResource[];
}

const BASE_URL = 'https://pokeapi.co/api/v2';

// Cache de tipos por Pokémon (evita repetir la petición en cada re-render).
const typeCache: Record<string, string[]> = {};

// ID de cada tipo en los sprites oficiales de Espada/Escudo.
const TYPE_IDS: Record<string, number> = {
  normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5, rock: 6, bug: 7,
  ghost: 8, steel: 9, fire: 10, water: 11, grass: 12, electric: 13,
  psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18,
};

export const PokeAPIService = {
  // Lista completa de especies para el buscador.
  // PokeAPI ya las devuelve en orden de Pokédex nacional (id ascendente),
  // pero la ordenamos igualmente por seguridad. El dex nacional tiene más de
  // 1000 entradas, así que el límite debe ser holgado para no truncar.
  getAllPokemon: async (): Promise<PokeAPIResource[]> => {
    const response = await fetch(`${BASE_URL}/pokemon-species?limit=2000`);
    const data = await response.json();
    const results: PokeAPIResource[] = data.results ?? [];
    return results
      .slice()
      .sort(
        (a, b) =>
          Number(PokeAPIService.getIdFromUrl(a.url)) -
          Number(PokeAPIService.getIdFromUrl(b.url))
      );
  },

  // Obtener info específica de la especie (como sus grupos huevo)
  getSpecies: async (nameOrId: string | number): Promise<PokemonSpeciesData> => {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
    return await response.json();
  },

  // Obtener todos los Pokémon que pertenecen a un grupo huevo (para la cajita)
  getEggGroup: async (nameOrId: string | number): Promise<EggGroupData> => {
    const response = await fetch(`${BASE_URL}/egg-group/${nameOrId}`);
    return await response.json();
  },
  
  // Tipos de un Pokémon (para la chapita de tipo estilo Espada/Escudo).
  // /pokemon-form es mucho más ligero que /pokemon (no trae movimientos) y ya
  // incluye "types" en orden de slot (el primero es el tipo primario).
  // Se cachea en memoria: cada Pokémon se pide una sola vez por sesión.
  getPokemonTypes: async (nameOrId: string | number): Promise<string[]> => {
    const key = String(nameOrId).toLowerCase();
    const cached = typeCache[key];
    if (cached) return cached;
    try {
      const response = await fetch(`${BASE_URL}/pokemon-form/${key}`);
      const data = await response.json();
      const types: string[] = (data.types ?? []).map(
        (t: { type: { name: string } }) => t.type.name
      );
      typeCache[key] = types;
      return types;
    } catch {
      typeCache[key] = [];
      return [];
    }
  },

  // Helper para sacar el ID de la URL de PokeAPI y poder cargar el sprite
  getIdFromUrl: (url: string): string => {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  },
  
  // Sprite estilo Gen 5 (pixelado completo, incluyendo Gen 9)
  getGen5SpriteUrl: (name: string): string => {
    return `https://raw.githubusercontent.com/remokon/gen-9-sprites/main/gen-5-style/${name.toLowerCase()}.png`;
  },

  // Sprite pequeño (icono de caja) — solo cubre Pokémon de Espada/Escudo
  getSpriteUrl: (id: string | number): string => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${id}.png`;
  },

  // Fallback: icono pequeño de gen-viii (si tampoco existe, se ocultará la imagen)
  getFallbackSpriteUrl: (id: string | number): string => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${id}.png`;
  },

  // Icono oficial del tipo: el símbolo que el juego dibuja dentro del círculo
  // blanco de la chapita de tipo (la llama delante de "FIRE", la gota delante
  // de "WATER"...). IDs según el orden canónico de tipos de PokeAPI.
  getTypeIconUrl: (type: string): string => {
    const id = TYPE_IDS[type.toLowerCase()] ?? 1;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${id}.png`;
  }
};
