import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { BreedingTree } from '../components/BreedingTree';
import { TargetWizard } from '../components/TargetWizard';
import { PageTransition } from '../components/PageTransition';

export const Planner = () => {
  const { target, setTarget } = useStore();
  const [tree, setTree] = useState<any>(null);

  useEffect(() => {
    if (target) {
      import('../breeding/treeBuilder').then(({ buildPokeMMOTree }) => {
        setTree(buildPokeMMOTree(target));
      });
    } else {
      setTree(null);
    }
  }, [target]);

  if (!target) {
    return (
      <PageTransition sweep>
        <div className="planner-page" style={{ overflow: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <TargetWizard onComplete={() => {}} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="planner-page" style={{
      background: 'linear-gradient(135deg, #eef0f5 0%, #e8eaf0 50%, #f0f1f5 100%)'
    }}>
      {/* SwSh-style back pill button */}
      <button
        title="Cambiar objetivo"
        className="swsh-btn planner-back-btn"
        onClick={() => { setTarget(null); setTree(null); }}
      >
        <span className="swsh-key">B</span>
        <span>ATRÁS</span>
      </button>
      
      <main className="planner-content" style={{ padding: '0', display: 'flex' }}>
        <div className="planner-tree-wrapper swsh-tree-panel" style={{ flex: 1 }}>
          <div className="tree-container" style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}>
             {tree ? <BreedingTree tree={tree} /> : <p className="placeholder">Calculando...</p>}
          </div>
        </div>
      </main>
    </div>
    </PageTransition>
  );
};
