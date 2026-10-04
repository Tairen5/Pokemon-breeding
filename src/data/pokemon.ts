import type { PokemonSpecies } from '../types';

export const POKEMON_DB: PokemonSpecies[] = [
  {
    id: 25,
    name: 'Pikachu',
    displayName: 'Pikachu',
    eggGroups: ['Field', 'Fairy'],
    genderRatio: { male: 50, female: 50 },
    spriteUrl: ''
  },
  {
    id: 133,
    name: 'Eevee',
    displayName: 'Eevee',
    eggGroups: ['Field'],
    genderRatio: { male: 87.5, female: 12.5 },
    spriteUrl: ''
  },
  {
    id: 443,
    name: 'Gible',
    displayName: 'Gible',
    eggGroups: ['Monster', 'Dragon'],
    genderRatio: { male: 50, female: 50 },
    spriteUrl: ''
  },
  {
    id: 444,
    name: 'Gabite',
    displayName: 'Gabite',
    eggGroups: ['Monster', 'Dragon'],
    genderRatio: { male: 50, female: 50 },
    spriteUrl: ''
  },
  {
    id: 445,
    name: 'Garchomp',
    displayName: 'Garchomp',
    eggGroups: ['Monster', 'Dragon'],
    genderRatio: { male: 50, female: 50 },
    spriteUrl: ''
  },
  {
    id: 132,
    name: 'Ditto',
    displayName: 'Ditto',
    eggGroups: ['Ditto'],
    genderRatio: { male: 0, female: 0 },
    spriteUrl: ''
  }
];

export const getPokemonSpecies = (id: number): PokemonSpecies | undefined => {
  return POKEMON_DB.find(p => p.id === id);
};
