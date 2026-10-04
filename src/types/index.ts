export type Gender = 'Male' | 'Female' | 'Genderless';

export type Nature = 
  | 'Hardy' | 'Lonely' | 'Brave' | 'Adamant' | 'Naughty'
  | 'Bold' | 'Docile' | 'Relaxed' | 'Impish' | 'Lax'
  | 'Timid' | 'Hasty' | 'Serious' | 'Jolly' | 'Naive'
  | 'Bashful' | 'Mild' | 'Quiet' | 'Rash' | 'Quirky'
  | 'Calm' | 'Gentle' | 'Sassy' | 'Careful';

export interface IVs {
  hp: number | 'X';
  attack: number | 'X';
  defense: number | 'X';
  specialAttack: number | 'X';
  specialDefense: number | 'X';
  speed: number | 'X';
}

export type EggGroup = 
  | 'Monster' | 'Water 1' | 'Bug' | 'Flying' | 'Field' | 'Fairy'
  | 'Grass' | 'Human-Like' | 'Water 3' | 'Mineral' | 'Amorphous'
  | 'Water 2' | 'Ditto' | 'Dragon' | 'Undiscovered';

export interface PokemonForm {
  id: string;
  name: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  displayName: string;
  eggGroups: EggGroup[];
  genderRatio: {
    male: number; // percentage 0-100
    female: number; // percentage 0-100
  };
  forms?: PokemonForm[];
  spriteUrl: string;
}

export interface PokemonInstance {
  id: string;
  speciesId: number;
  formId?: string;
  nickname?: string;
  gender: Gender;
  nature: Nature;
  ability?: string;
  ivs: IVs;
  state: 'AVAILABLE' | 'USED' | 'CREATED' | 'TARGET' | 'IMPOSSIBLE';
}

export interface BreedingItem {
  name: string;
  effect: string;
}

export interface BreedingStep {
  id: string;
  parentA: string; // id of PokemonInstance
  parentB: string; // id of PokemonInstance
  offspring: PokemonInstance;
  items?: BreedingItem[];
  consumedParents: string[]; // ids of consumed parents
}

export interface BreedingPlan {
  success: boolean;
  target?: PokemonInstance;
  steps: BreedingStep[];
  consumedPokemonIds: string[];
  totalSteps: number;
  errors?: string[];
  virtualInventory?: PokemonInstance[]; // parents invented by the solver
}

// Tree node representing a step in the PokeMMO breeding process
export interface BreedingNode {
  id: string;
  targetStats: (keyof IVs)[]; // e.g. ['hp', 'attack']
  gender: 'Male' | 'Female' | 'Any' | 'Genderless';
  speciesId: number; // The target species, or a compatible egg group member
  pokemon?: PokemonInstance; // The actual assigned pokemon if user matched one, undefined otherwise
  bracerStat?: keyof IVs; // The stat this node passes down via Power Item
  left?: BreedingNode;
  right?: BreedingNode;
}
