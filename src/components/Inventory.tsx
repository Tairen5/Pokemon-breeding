import React from 'react';
import { useStore } from '../store';
import { PokemonCard } from './PokemonCard';
import { v4 as uuidv4 } from 'uuid';

export const Inventory: React.FC = () => {
  const { inventory, addPokemon } = useStore();

  const handleAddDemo = () => {
    // Add dummy Gible and Ditto for demo
    addPokemon({
      id: uuidv4(),
      speciesId: 443, // Gible
      gender: 'Male',
      nature: 'Adamant',
      ivs: { hp: 'X', attack: 31, defense: 'X', specialAttack: 'X', specialDefense: 'X', speed: 31 },
      state: 'AVAILABLE'
    });
    addPokemon({
      id: uuidv4(),
      speciesId: 132, // Ditto
      gender: 'Genderless',
      nature: 'Hardy',
      ivs: { hp: 31, attack: 'X', defense: 31, specialAttack: 'X', specialDefense: 'X', speed: 'X' },
      state: 'AVAILABLE'
    });
  };

  return (
    <div className="inventory-section">
      <button onClick={handleAddDemo} style={{marginBottom: '1rem'}}>
        + Añadir Pokémon de Prueba (Gible & Ditto)
      </button>
      <div className="inventory-list">
        {inventory.map(p => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>
    </div>
  );
};
