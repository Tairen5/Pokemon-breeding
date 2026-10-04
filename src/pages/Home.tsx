import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BookOpen, Layers } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'pokedex', label: 'POKÉDEX', icon: BookOpen, color: '#e53935' },
  { id: 'pokemon', label: 'POKÉMON', isCustomIcon: true, iconSrc: './pokeicon.png', color: '#e53935' },
  { id: 'planner', label: 'PLANIFICADOR', icon: Layers, color: '#fb8c00' },
  { id: 'options', label: 'OPCIONES', icon: Settings, color: '#3949ab' }
];

export const Home = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('planner');
  const [activeTab, setActiveTab] = useState('home');

  const handleSelect = (id: string) => {
    if (id === 'planner') {
      navigate('/planner');
    }
  };

  return (
    <div className="swsh-container">
      {/* Top Navigation Tabs (Sw/Sh Style) */}
      <div className="swsh-top-tabs">
        <div className="swsh-bumper">L</div>
        <div className="swsh-tabs-list">
          <div 
            className={`swsh-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            INICIO
          </div>
          <div 
            className={`swsh-tab ${activeTab === 'crianza' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('crianza');
              navigate('/planner');
            }}
          >
            CRIANZA
          </div>
          <div 
            className={`swsh-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ABOUT
          </div>
        </div>
        <div className="swsh-bumper">R</div>
      </div>

      {/* Background with diagonal cut */}
      <div className="swsh-bg-red"></div>
      <div className="swsh-bg-white"></div>
      
      {/* Main Menu Grid */}
      <div className="swsh-menu-grid">
        {MENU_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          
          return (
            <div 
              key={item.id}
              className="swsh-menu-item-wrapper"
              onMouseEnter={() => setActiveItem(item.id)}
              onClick={() => handleSelect(item.id)}
            >
              {isActive && <div className="swsh-cursor swsh-menu-cursor" />}
              
              <div className="swsh-menu-item-container">
                <div 
                  className={`swsh-icon-circle ${isActive ? 'active' : ''}`}
                  style={{ borderColor: isActive ? '#f7c948' : item.color }}
                >
                  {item.isCustomIcon ? (
                    <img 
                      src={item.iconSrc} 
                      alt={item.label} 
                      style={{ width: '45px', height: '45px', filter: isActive ? 'brightness(0) invert(1)' : 'none' }}
                      onError={(e) => {
                        // Fallback if the extension is not .png
                        (e.target as HTMLImageElement).src = './pokeicon.svg';
                      }}
                    />
                  ) : (
                    Icon && <Icon 
                      size={40} 
                      color={isActive ? '#ffffff' : item.color} 
                      strokeWidth={2.5}
                    />
                  )}
                </div>
                <span className="swsh-menu-label">{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected item name plate — black pill + diagonal colour tag (SwSh motif) */}
      {activeItem && (() => {
        const sel = MENU_ITEMS.find(i => i.id === activeItem);
        if (!sel) return null;
        return (
          <div className="swsh-menu-plate">
            <span className="swsh-menu-plate__name">{sel.label}</span>
            <span className="swsh-menu-plate__tag" style={{ background: sel.color }}>›</span>
          </div>
        );
      })()}

      {/* Info Box — dark SwSh "notice" with the ▼ indicator */}
      <div className="swsh-info-box">
        <div className="swsh-notice">
          {activeItem === 'planner' 
            ? '¡Planifica la crianza de tus Pokémon de forma exacta y visual!'
            : 'Función no disponible en esta demo.'}
        </div>
      </div>

      {/* Bottom Button Prompts — black action band */}
      <div className="swsh-bottom-bar">
        <div className="swsh-action-bar">
          <div className="swsh-prompt">
            <span className="swsh-key">A</span> Confirmar
          </div>
          <div className="swsh-prompt">
            <span className="swsh-key">B</span> Atrás
          </div>
        </div>
      </div>
    </div>
  );
};
