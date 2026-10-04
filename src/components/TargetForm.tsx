import React, { useEffect } from 'react';
import { useStore } from '../store';
import { PokemonCard } from './PokemonCard';

export const TargetForm: React.FC = () => {
  const { target, setTarget } = useStore();

  useEffect(() => {
    // Set a default target for demonstration
    if (!target) {
      setTarget({
        id: 'target-1',
        speciesId: 443, // Gible
        gender: 'Male',
        nature: 'Jolly',
        ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 'X', specialDefense: 31, speed: 31 },
        state: 'TARGET'
      });
    }
  }, [target, setTarget]);

  return (
    <div className="target-form">
      {target ? (
        <PokemonCard pokemon={target} />
      ) : (
        <p>Selecciona un Pokémon objetivo</p>
      )}
    </div>
  );
};
