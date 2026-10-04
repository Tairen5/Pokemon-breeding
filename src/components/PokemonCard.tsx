import React from 'react';
import type { PokemonInstance } from '../types';
import { getPokemonSpecies } from '../data/pokemon';
import { PokeAPIService } from '../services/pokeapi';
import './PokemonCard.css';

interface Props {
  pokemon: PokemonInstance;
  isUsed?: boolean;
}

export const PokemonCard: React.FC<Props> = ({ pokemon, isUsed }) => {
  const dbSpecies = getPokemonSpecies(pokemon.speciesId);
  const [apiName, setApiName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!dbSpecies) {
      PokeAPIService.getSpecies(pokemon.speciesId).then(data => {
        setApiName(data.name);
      }).catch(console.error);
    }
  }, [dbSpecies, pokemon.speciesId]);

  const rawName = dbSpecies?.name || apiName;
  const name = rawName ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : `Pokémon #${pokemon.speciesId}`;
  
  // Use Gen 5 sprite if we know the name, otherwise fallback to id-based gen-8 or default
  const spriteUrl = dbSpecies?.spriteUrl || 
    (rawName ? PokeAPIService.getGen5SpriteUrl(rawName) : PokeAPIService.getSpriteUrl(pokemon.speciesId));

  const { hp, attack, defense, specialAttack, specialDefense, speed } = pokemon.ivs;
  const ivDisplay = [hp, attack, defense, specialAttack, specialDefense, speed]
    .map(v => v === 'X' ? 'X' : v)
    .join('/');

  // Check if all IVs are 31 to decide color
  const allPerfect = [hp, attack, defense, specialAttack, specialDefense, speed].every(v => v === 31);

  return (
    <div className={`swsh-pill-card ${isUsed ? 'used' : ''}`}>

      {/* LEFT: sprite + oval shadow floor */}
      <div className="pill-left">
        <img
          src={spriteUrl}
          alt={name}
          className="pill-sprite"
          onError={(e) => {
            const img = e.currentTarget;
            const fb = PokeAPIService.getFallbackSpriteUrl(pokemon.speciesId);
            if (img.src !== fb) { img.src = fb; } else { img.style.display = 'none'; }
          }}
        />
        <div className="pill-floor-shadow" />
      </div>

      {/* RIGHT: name, gender, IVs */}
      <div className="pill-right">
        <div className="pill-header">
          <span className="pill-name">{name}</span>
          {pokemon.gender === 'Male'   && <span className="pill-gender male">♂</span>}
          {pokemon.gender === 'Female' && <span className="pill-gender female">♀</span>}
        </div>

        <div className={`pill-iv-string ${allPerfect ? 'perfect' : ''}`}>
          {ivDisplay}
        </div>
      </div>
    </div>
  );
};
