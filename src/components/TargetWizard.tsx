import React, { useState, useEffect } from 'react';
import { PokeAPIService } from '../services/pokeapi';
import type { PokeAPIResource, EggGroupData } from '../services/pokeapi';
import { useStore } from '../store';
import { getPokemonSpecies } from '../data/pokemon';
import type { IVs, PokemonInstance } from '../types';
import './TargetWizard.css';

const STAT_ICONS: Record<keyof IVs, React.ReactNode> = {
  hp:             <svg viewBox="0 0 24 24" width="20" height="20" fill="#e53935"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  attack:         <svg viewBox="0 0 24 24" width="20" height="20" fill="#fb8c00"><path d="M19 3l-6 6 2 7L3 9l7 2 6-6z"/></svg>,
  defense:        <svg viewBox="0 0 24 24" width="20" height="20" fill="#1565c0"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
  specialAttack:  <svg viewBox="0 0 24 24" width="20" height="20" fill="#4caf50"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3C8.31 20.52 10.1 21 12 21c4.97 0 9-4.03 9-9-.01-2.75-1.25-5.21-3.15-6.87C17.6 5.6 17.13 4.85 17 8z"/></svg>,
  specialDefense: <svg viewBox="0 0 24 24" width="20" height="20" fill="#9c27b0"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65A2.5 2.5 0 0 1 14.5 15H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/></svg>,
  speed:          <svg viewBox="0 0 24 24" width="20" height="20" fill="#e91e63"><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44z"/><path d="M10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/></svg>,
};

const STAT_LABELS: Record<keyof IVs, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  specialAttack: 'SPA', specialDefense: 'SPD', speed: 'SPE'
};

// How many sprite tiles are appended each time you press "load more".
// 72 = 8 full rows of the 9-column PC-box grid.
const PAGE_SIZE = 72;

// Small party card for inventory Pokémon on the left panel
const PartyCard: React.FC<{ pokemon: PokemonInstance; isTarget?: boolean; onRemove?: () => void }> = ({ pokemon, isTarget, onRemove }) => {
  const db = getPokemonSpecies(pokemon.speciesId);
  const name = db?.name ?? `#${pokemon.speciesId}`;
  const spriteUrl = PokeAPIService.getGen5SpriteUrl(name);
  const fallback  = PokeAPIService.getFallbackSpriteUrl(pokemon.speciesId);

  const ivVals = Object.values(pokemon.ivs);
  const allPerfect = ivVals.every(v => v === 31);
  const ivStr = ivVals.map(v => v === 'X' ? 'X' : v).join('/');

  const displayName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  // Primary type, shown on the SwSh type chip. Fetched lazily and cached.
  const [types, setTypes] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    PokeAPIService.getPokemonTypes(pokemon.speciesId).then(t => { if (alive) setTypes(t); });
    return () => { alive = false; };
  }, [pokemon.speciesId]);
  const primaryType = types[0];

  return (
    <div className={`tw-party-card ${isTarget ? 'tw-party-target' : ''}`}>
      {isTarget && <span className="swsh-cursor swsh-cursor--dark tw-target-cursor" />}
      <div className="tw-party-sprite-wrapper">
        <img
          src={spriteUrl} alt={name}
          className="tw-party-sprite"
          onError={e => { const img = e.currentTarget; if (img.src !== fallback) { img.src = fallback; } else { img.style.display = 'none'; } }}
        />
        <div className="tw-sprite-shadow" />
      </div>
      <div className="tw-party-info">
        <div className="tw-party-name-row">
          <span className="tw-party-name">{displayName}</span>
          {pokemon.gender === 'Male'   && <span className="tw-gender-icon male">♂</span>}
          {pokemon.gender === 'Female' && <span className="tw-gender-icon female">♀</span>}
        </div>
        </div>
      {/* SwSh type badge — the game's own type sprite (coloured wedge + symbol + name) */}
      {primaryType && (
        <img
          className="tw-party-type"
          src={PokeAPIService.getTypeIconUrl(primaryType)}
          alt={primaryType}
          draggable={false}
        />
      )}
      {/* Dark value capsule — where the game prints a move's PP we print the IV spread */}
      <div className={`tw-party-value ${allPerfect ? 'perfect' : ''}`}>{ivStr}</div>
      {isTarget && onRemove && (
        <button className="tw-remove-target" onClick={onRemove} title="Eliminar objetivo">✕</button>
      )}
    </div>
  );
};

export const TargetWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { inventory, setTarget } = useStore();
  const [searchTerm, setSearchTerm]       = useState('');
  const [allPokemon, setAllPokemon]       = useState<PokeAPIResource[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<any>(null);
  const [eggGroupData, setEggGroupData]   = useState<EggGroupData[]>([]);
  const [desiredIVs, setDesiredIVs]       = useState<IVs>({
    hp: 'X', attack: 'X', defense: 'X', specialAttack: 'X', specialDefense: 'X', speed: 'X'
  });
  const [isLoading, setIsLoading] = useState(false);
  // How many dex entries of the current result set are currently listed.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => { PokeAPIService.getAllPokemon().then(setAllPokemon); }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSelectPokemon = async (name: string) => {
    setIsLoading(true);
    setSearchTerm('');
    setVisibleCount(PAGE_SIZE);
    const species = await PokeAPIService.getSpecies(name);
    setSelectedSpecies(species);
    const groups = await Promise.all(
      species.egg_groups.map((g: any) => PokeAPIService.getEggGroup(g.name))
    );
    setEggGroupData(groups);
    setIsLoading(false);
  };

  const toggleIV = (stat: keyof IVs) => {
    setDesiredIVs(prev => ({ ...prev, [stat]: prev[stat] === 31 ? 'X' : 31 }));
  };

  const handleConfirm = () => {
    if (!selectedSpecies) return;
    setTarget({
      id: `target-${Date.now()}`,
      speciesId: selectedSpecies.id,
      gender: 'Male',
      nature: 'Hardy',
      ivs: desiredIVs,
      state: 'TARGET'
    });
    onComplete();
  };

  const searchQuery = searchTerm.trim().toLowerCase();
  const isSearching = searchQuery.length > 1;
  const listLoading = allPokemon.length === 0;

  // Nothing typed yet → list the dex from the very first entry (Bulbasaur),
  // so the panel is never empty. PokeAPIService already returns the species in
  // national-dex order, so this is a plain Pokédex listing.
  const matches = isSearching
    ? allPokemon.filter(p => p.name.includes(searchQuery))
    : allPokemon;

  const visiblePokemon = matches.slice(0, visibleCount);
  const hasMore = matches.length > visibleCount;

  // Dummy target card for left panel when species selected
  const targetInstance: PokemonInstance | null = selectedSpecies ? {
    id: 'preview',
    speciesId: selectedSpecies.id,
    gender: 'Male',
    nature: 'Hardy',
    ivs: desiredIVs,
    state: 'TARGET'
  } : null;

  return (
    <div className="tw-root">

      {/* ══ LEFT PANEL ══ */}
      <div className="tw-left">
        <div className="tw-pokeball-watermark" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="14"/>
            <line x1="10" y1="100" x2="60" y2="100" stroke="white" strokeWidth="14"/>
            <line x1="140" y1="100" x2="190" y2="100" stroke="white" strokeWidth="14"/>
            <circle cx="100" cy="100" r="28" stroke="white" strokeWidth="14"/>
          </svg>
        </div>

        {/* Title */}
        <div className="tw-title-row">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="7" y2="12"/>
            <line x1="17" y1="12" x2="22" y2="12"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
          <h1 className="tw-title">OBJETIVO</h1>
        </div>
        <p className="tw-subtitle">pokémon añadidos</p>

        {/* Party list */}
        <div className="tw-party-list">
          {/* Selected target at top (highlighted) */}
          {targetInstance && (
            <div style={{ position: 'relative' }}>
              <PartyCard pokemon={targetInstance} isTarget onRemove={() => setSelectedSpecies(null)} />
            </div>
          )}

          {/* Inventory Pokémon below */}
          {inventory.map(p => (
            <PartyCard key={p.id} pokemon={p} />
          ))}

          {/* Empty state */}
          {inventory.length === 0 && !targetInstance && (
            <p className="tw-empty">Sin Pokémon añadidos</p>
          )}
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="tw-right">
        {!selectedSpecies ? (
          /* ── SEARCH PHASE ── */
          <div className="tw-search-phase">
            <div className="tw-search-bar-wrapper">
              <input
                type="text"
                className="tw-search-pill"
                placeholder="BUSCAR POKÉMON"
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                autoFocus
              />
            </div>

            {isLoading ? (
              <p className="tw-loading-center">Cargando...</p>
            ) : visiblePokemon.length > 0 ? (
              <>
                {/* Results grid */}
                <div className="tw-results-grid">
                  {visiblePokemon.map(p => {
                    const id = PokeAPIService.getIdFromUrl(p.url);
                    return (
                      <div
                        key={p.name}
                        className="tw-result-tile"
                        onClick={() => handleSelectPokemon(p.name)}
                        title={`#${id} ${p.name}`}
                      >
                        <img
                          src={PokeAPIService.getGen5SpriteUrl(p.name)}
                          alt={p.name}
                          loading="lazy"
                          draggable={false}
                          onError={e => { const img = e.currentTarget; const fb = PokeAPIService.getFallbackSpriteUrl(id); if (img.src !== fb) { img.src = fb; } else { img.style.display='none'; } }}
                        />
                      </div>
                    );
                  })}
                </div>

                {hasMore && (
                  <button
                    type="button"
                    className="tw-load-more"
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  >
                    <span className="swsh-triangle" />
                    CARGAR MÁS · {matches.length - visibleCount}
                  </button>
                )}
              </>
            ) : (
              <div className="swsh-notice tw-no-results">
                {listLoading ? 'Cargando Pokédex…' : 'Sin resultados'}
              </div>
            )}
          </div>
        ) : (
          /* ── CONFIG PHASE ── */
          <>
            <div className="tw-right-scroll">
              {/* IV Section */}
              <div className="tw-section">
                <div className="tw-section-header">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
                  </svg>
                  <span>CONFIGURA LOS IVs</span>
                </div>
                <div className="tw-iv-grid">
                  {(Object.keys(desiredIVs) as (keyof IVs)[]).map(stat => (
                    <div
                      key={stat}
                      className={`tw-iv-box ${desiredIVs[stat] === 31 ? 'tw-iv-perfect' : ''}`}
                      onClick={() => toggleIV(stat)}
                    >
                      <div className="tw-iv-icon">{STAT_ICONS[stat]}</div>
                      <span className="tw-iv-label">{STAT_LABELS[stat]}</span>
                      <span className="tw-iv-val">{desiredIVs[stat]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Egg Groups */}
              <div className="tw-section">
                <div className="tw-section-header">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>GRUPOS HUEVO</span>
                </div>
                {eggGroupData.map(group => (
                  <div key={group.name} className="tw-egg-group">
                    <div className="tw-egg-group-header">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2">
                        <ellipse cx="12" cy="13" rx="7" ry="9"/>
                      </svg>
                      <span>Grupo Huevo: {group.name.toUpperCase()}</span>
                      <span className="tw-egg-count">{group.pokemon_species.length} Pokémon</span>
                    </div>
                    <div className="tw-egg-sprites">
                      {group.pokemon_species.map(p => {
                        const id = PokeAPIService.getIdFromUrl(p.url);
                        return (
                          <div key={p.name} className="tw-egg-sprite" title={p.name}>
                            <img
                              src={PokeAPIService.getGen5SpriteUrl(p.name)}
                              alt={p.name}
                              loading="lazy"
                                                      onError={e => { const img = e.currentTarget; const fb = PokeAPIService.getFallbackSpriteUrl(id); if (img.src !== fb) { img.src = fb; } else { img.style.display='none'; } }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tw-confirm-bar">
              <button className="tw-confirm-btn" onClick={handleConfirm}>
                <span className="swsh-key">A</span>
                CONFIRMAR OBJETIVO
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
