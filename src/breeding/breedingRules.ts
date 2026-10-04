import type { PokemonSpecies, PokemonInstance } from '../types';
import { getPokemonSpecies } from '../data/pokemon';

export class BreedingRules {
  static canBreed(parentA: PokemonInstance, parentB: PokemonInstance): boolean {
    const speciesA = getPokemonSpecies(parentA.speciesId);
    const speciesB = getPokemonSpecies(parentB.speciesId);
    if (!speciesA || !speciesB) return false;

    const isDittoA = speciesA.eggGroups.includes('Ditto');
    const isDittoB = speciesB.eggGroups.includes('Ditto');

    // Two dittos cannot breed
    if (isDittoA && isDittoB) return false;

    // Undiscovered cannot breed
    if (speciesA.eggGroups.includes('Undiscovered') || speciesB.eggGroups.includes('Undiscovered')) {
      return false;
    }

    // Ditto can breed with anything (except Undiscovered/Ditto)
    if (isDittoA || isDittoB) return true;

    // Must be opposite genders
    if (parentA.gender === 'Genderless' || parentB.gender === 'Genderless') return false;
    if (parentA.gender === parentB.gender) return false;

    // Must share at least one egg group
    return speciesA.eggGroups.some(g => speciesB.eggGroups.includes(g));
  }

  static getOffspringSpecies(parentA: PokemonInstance, parentB: PokemonInstance): PokemonSpecies | undefined {
    const speciesA = getPokemonSpecies(parentA.speciesId);
    const speciesB = getPokemonSpecies(parentB.speciesId);
    if (!speciesA || !speciesB) return undefined;

    const isDittoA = speciesA.eggGroups.includes('Ditto');
    const isDittoB = speciesB.eggGroups.includes('Ditto');

    if (isDittoA) return speciesB;
    if (isDittoB) return speciesA;

    return parentA.gender === 'Female' ? speciesA : speciesB;
  }
}
