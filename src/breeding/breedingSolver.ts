import type { BreedingPlan, PokemonInstance, BreedingStep } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class BreedingSolver {
  static solve(_inventory: PokemonInstance[], target: PokemonInstance): BreedingPlan {
    // Si no tenemos inventario o no encontramos cruces, "inventamos" los padres
    // Para simplificar (0.5), vamos a generar siempre 2 padres virtuales que teóricos
    // que al cruzarlos te den tu objetivo.
    
    // Padre A (La misma especie que el target)
    const pA: PokemonInstance = {
      id: uuidv4(),
      speciesId: target.speciesId,
      gender: 'Female', 
      nature: target.nature,
      ivs: { ...target.ivs }, // En un caso real, dividiríamos los IVs
      state: 'AVAILABLE'
    };

    // Padre B (Ditto) - speciesId 132 es Ditto
    const pB: PokemonInstance = {
      id: uuidv4(),
      speciesId: 132, 
      gender: 'Genderless',
      nature: 'Hardy',
      ivs: { ...target.ivs },
      state: 'AVAILABLE'
    };

    const step: BreedingStep = {
      id: uuidv4(),
      parentA: pA.id,
      parentB: pB.id,
      offspring: {
        ...target,
        id: uuidv4(),
        state: 'TARGET'
      },
      consumedParents: [pA.id, pB.id]
    };

    return {
      success: true,
      target,
      steps: [step],
      consumedPokemonIds: [pA.id, pB.id],
      totalSteps: 1,
      virtualInventory: [pA, pB]
    };
  }
}
