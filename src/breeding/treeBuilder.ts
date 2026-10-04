import type { IVs, PokemonInstance, BreedingNode } from '../types';

let nodeIdCounter = 0;

/**
 * Builds a PokeMMO optimal breeding tree for a target Pokemon.
 * PokeMMO Breeding Rules:
 * - Parents are consumed.
 * - Braces guarantee 1 stat from that parent. Max 2 braces per breed (one per parent).
 * - Overlapping 31 IVs are passed down naturally if BOTH parents have 31.
 */
export function buildPokeMMOTree(target: PokemonInstance): BreedingNode | null {
  // 1. Identify which stats are desired (31)
  const desiredStats = (Object.keys(target.ivs) as (keyof IVs)[]).filter(
    (stat) => target.ivs[stat] === 31
  );

  if (desiredStats.length === 0) {
    return null; // No perfect IVs requested
  }

  nodeIdCounter = 0;
  
  // We make the left spine the "mother" side to ensure species passes down.
  const root = generateNode(desiredStats, target.speciesId, true);
  root.gender = target.gender; // The final product should be whatever gender the user requested
  return root;
}

function generateNode(stats: (keyof IVs)[], targetSpeciesId: number, isMotherSpine: boolean): BreedingNode {
  const id = `node-${nodeIdCounter++}`;
  
  // Base case: 1 IV breeder
  if (stats.length === 1) {
    return {
      id,
      targetStats: [...stats],
      gender: isMotherSpine ? 'Female' : 'Any',
      speciesId: targetSpeciesId, // In reality right side can be compatible egg group, but we'll use target species for simplicity
    };
  }

  // Recursive case: N IVs
  // Left parent gets stats [0 ... N-2]
  // Right parent gets stats [1 ... N-1]
  const leftStats = stats.slice(0, stats.length - 1);
  const rightStats = stats.slice(1, stats.length);

  const leftNode = generateNode(leftStats, targetSpeciesId, true); // Left is always Female
  const rightNode = generateNode(rightStats, targetSpeciesId, false); // Right is always Male

  leftNode.bracerStat = stats[0];
  rightNode.bracerStat = stats[stats.length - 1];

  return {
    id,
    targetStats: [...stats],
    gender: isMotherSpine ? 'Female' : 'Male', // This node's required gender
    speciesId: targetSpeciesId,
    left: leftNode,
    right: rightNode,
  };
}
