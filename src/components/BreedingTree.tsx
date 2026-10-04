import React, { useState } from 'react';
import type { BreedingNode } from '../types';
import { PokeAPIService } from '../services/pokeapi';
import { getPokemonSpecies } from '../data/pokemon';
import './BreedingTree.css';

interface Props {
  tree: BreedingNode;
}

const getStatAbbr = (stat: string) => {
  const map: Record<string, string> = {
    hp: 'PS', attack: 'ATK', defense: 'DEF',
    specialAttack: 'SPA', specialDefense: 'SPD', speed: 'VEL'
  };
  return map[stat] || stat;
};



const getPowerItemName = (stat: string) => {
  const map: Record<string, string> = {
    hp: 'power-weight', attack: 'power-bracer', defense: 'power-belt',
    specialAttack: 'power-lens', specialDefense: 'power-band', speed: 'power-anklet'
  };
  return map[stat];
};

const TreeNode: React.FC<{ node: BreedingNode }> = ({ node }) => {
  const [completed, setCompleted] = useState(false);

  const db = getPokemonSpecies(node.speciesId);
  const name = db?.name ?? `#${node.speciesId}`;
  const spriteUrl = PokeAPIService.getGen5SpriteUrl(name);
  const fallback = PokeAPIService.getFallbackSpriteUrl(node.speciesId);
  
  const displayName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const braceItem = node.bracerStat ? getPowerItemName(node.bracerStat) : null;
  const braceSprite = braceItem ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${braceItem}.png` : null;

  return (
    <li className={completed ? 'step-completed' : ''}>
      <div className="tree-node tw-party-card tw-party-target" style={{ cursor: 'pointer', margin: '0 auto', minWidth: '180px' }} onClick={(e) => { e.stopPropagation(); setCompleted(!completed); }}>
        <div className="checkmark-hint">✓</div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
          <div className="tw-party-sprite-wrapper" style={{ width: '56px', height: '56px' }}>
            <img 
              src={spriteUrl} alt={name} className="tw-party-sprite"
              onError={e => { const img = e.currentTarget; if (img.src !== fallback) { img.src = fallback; } else { img.style.display = 'none'; } }} 
            />
            <div className="tw-sprite-shadow" style={{ width: '40px', height: '12px' }} />
          </div>
          {braceSprite && (
            <img src={braceSprite} alt={braceItem!} title={`Brazal: ${getStatAbbr(node.bracerStat!)}`} style={{ width: '24px', height: '24px', marginLeft: '-10px', zIndex: 2 }} />
          )}
        </div>
        
        <div className="tw-party-info" style={{ gap: '4px' }}>
          <div className="tw-party-name-row">
            <span className="tw-party-name" style={{ fontSize: '1rem' }}>{displayName}</span>
            {node.gender === 'Male' && <span className="tw-gender-icon male">♂</span>}
            {node.gender === 'Female' && <span className="tw-gender-icon female">♀</span>}
            {node.gender === 'Genderless' && <span className="tw-gender-icon" style={{ background: '#777' }}>⚲</span>}
          </div>
          <div className="tw-party-ivs" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>
              {['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']
                .map(stat => node.targetStats.includes(stat as any) ? '31' : 'X')
                .join('/')}
            </span>
          </div>
        </div>
      </div>
      {(node.left || node.right) && (
        <ul>
          {node.left && <TreeNode node={node.left} />}
          {node.right && <TreeNode node={node.right} />}
        </ul>
      )}
    </li>
  );
};

export const BreedingTree: React.FC<Props> = ({ tree }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.65);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const treeRef = React.useRef<HTMLDivElement>(null);

  // Center tree on mount
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!containerRef.current || !treeRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const tw = treeRef.current.offsetWidth * scale;
      setPosition({ x: (cw - tw) / 2, y: 40 });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.tree-node')) return; // don't drag when clicking nodes
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => Math.min(Math.max(0.2, prev - e.deltaY * 0.001), 2));
  };

  const zoomIn  = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.2));

  return (
    <div 
      ref={containerRef}
      className="poke-mmo-tree-container" 
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* SwSh-style background decoration */}
      <div className="tree-bg-deco" aria-hidden="true">
        {/* Main large Pokéball watermark */}
        <svg className="tree-bg-pokeball" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="97" stroke="rgba(160,180,220,0.45)" strokeWidth="6"/>
          <path d="M3 100 H197" stroke="rgba(160,180,220,0.45)" strokeWidth="6"/>
          {/* Top half fill */}
          <path d="M3 100 A97 97 0 0 1 197 100" fill="rgba(140,165,215,0.12)"/>
          {/* Center ring */}
          <circle cx="100" cy="100" r="30" stroke="rgba(160,180,220,0.5)" strokeWidth="6" fill="rgba(180,200,235,0.18)"/>
          <circle cx="100" cy="100" r="16" fill="rgba(160,180,220,0.5)"/>
          {/* Highlight arc */}
          <path d="M40 62 Q100 30 160 62" stroke="rgba(255,255,255,0.4)" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>

        {/* Corner sparkle dots */}
        <svg className="tree-bg-dots tree-bg-dots-tr" viewBox="0 0 120 120" fill="none">
          {[...Array(5)].map((_, r) =>
            [...Array(5)].map((_, c) => (
              <circle key={`${r}-${c}`} cx={12 + c * 24} cy={12 + r * 24} r="3" fill="rgba(160,180,220,0.35)"/>
            ))
          )}
        </svg>
        <svg className="tree-bg-dots tree-bg-dots-bl" viewBox="0 0 120 120" fill="none">
          {[...Array(5)].map((_, r) =>
            [...Array(5)].map((_, c) => (
              <circle key={`${r}-${c}`} cx={12 + c * 24} cy={12 + r * 24} r="3" fill="rgba(160,180,220,0.35)"/>
            ))
          )}
        </svg>

        {/* Small pokéballs - corner accents */}
        <svg className="tree-bg-pokeball-sm tree-bg-sm-1" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="47" stroke="rgba(150,170,215,0.4)" strokeWidth="6"/>
          <path d="M3 50 H97" stroke="rgba(150,170,215,0.4)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="16" stroke="rgba(150,170,215,0.45)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="7" fill="rgba(150,170,215,0.45)"/>
        </svg>
        <svg className="tree-bg-pokeball-sm tree-bg-sm-2" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="47" stroke="rgba(150,170,215,0.4)" strokeWidth="6"/>
          <path d="M3 50 H97" stroke="rgba(150,170,215,0.4)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="16" stroke="rgba(150,170,215,0.45)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="7" fill="rgba(150,170,215,0.45)"/>
        </svg>
        <svg className="tree-bg-pokeball-sm tree-bg-sm-3" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="47" stroke="rgba(150,170,215,0.3)" strokeWidth="6"/>
          <path d="M3 50 H97" stroke="rgba(150,170,215,0.3)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="16" stroke="rgba(150,170,215,0.3)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="7" fill="rgba(150,170,215,0.3)"/>
        </svg>

        {/* Shine overlay at top */}
        <div className="tree-bg-shine"/>
      </div>

      {/* Tree canvas */}
      <div 
        ref={treeRef}
        className="css-tree poke-mmo-tree"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.08s ease',
          width: 'max-content',
          position: 'absolute',
          top: 0, left: 0,
          userSelect: 'none'
        }}
      >
        <ul>
          <TreeNode node={tree} />
        </ul>
      </div>

      {/* HUD: zoom indicator + buttons */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'all' }}>
        <button className="tree-zoom-btn" onClick={zoomOut} title="Alejar">−</button>
        <div className="tree-zoom-label">{Math.round(scale * 100)}%</div>
        <button className="tree-zoom-btn" onClick={zoomIn} title="Acercar">+</button>
      </div>

      {/* Hint */}
      <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(30,35,60,0.5)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.72rem', pointerEvents: 'none', whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}>
        Rueda para Zoom · Arrastra para Mover · Clic en tarjeta para marcar
      </div>
    </div>
  );
};


