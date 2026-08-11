import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { 
  Home, Palette, Disc, Image, Eye, Layout, Type, Layers, 
  Grid, Box, Sparkles, FolderKanban, Star, ShieldCheck, X
} from 'lucide-react';

export default function MobileSidebar({ isOpen, onClose }) {
  const { activeModule, setActiveModule, favorites } = useAppState();
  const { t } = useI18n();

  const dockItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: Home },
    { id: 'palette-creator', label: t('sidebar.paletteCreator'), icon: Palette },
    { id: 'color-wheel', label: t('sidebar.colorWheel'), icon: Disc },
    { id: 'image-extractor', label: t('sidebar.imageExtractor'), icon: Image },
    { id: 'gradients', label: t('sidebar.gradients'), icon: Sparkles },
    { id: 'shades', label: t('sidebar.shades'), icon: Layers },
    { id: 'converter', label: t('sidebar.converter'), icon: Box },
    { id: 'contrast', label: t('sidebar.contrast'), icon: ShieldCheck },
    { id: 'daltonism', label: t('sidebar.daltonism'), icon: Eye },
    { id: 'font-pairing', label: t('sidebar.fontPairing'), icon: Type },
    { id: 'design-system', label: t('sidebar.designSystem'), icon: Layout },
    { id: 'glassmorphism', label: t('sidebar.glassmorphism'), icon: Grid },
    { id: 'projects', label: t('sidebar.projects'), icon: FolderKanban },
    { id: 'favorites', label: t('sidebar.favorites'), icon: Star, badge: favorites.length },
  ];

  const handleNavClick = (id) => {
    setActiveModule(id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-overlay mobile-only" 
        onClick={onClose}
        style={{ zIndex: 200, padding: 0 }}
      ></div>
      <div 
        className="mobile-sidebar mobile-only animate-fade-in"
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: '280px',
          background: 'rgba(20, 24, 22, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-color)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Menú</h2>
          <button onClick={onClose} className="dt-btn dt-btn-ghost dt-btn-sm" style={{ padding: '0.2rem' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {dockItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  background: isActive ? 'var(--accent-purple)' : 'transparent',
                  color: isActive ? '#000' : 'var(--text-main)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <IconComp size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span className="dt-badge" style={{ background: 'var(--danger)', color: '#FFF', padding: '0.15rem 0.4rem', border: 'none' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
