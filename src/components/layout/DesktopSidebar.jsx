import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { 
  Home, Palette, Disc, Image, Eye, Layout, Type, Layers, 
  Grid, Box, Sparkles, FolderKanban, Star, ShieldCheck
} from 'lucide-react';

export default function DesktopSidebar() {
  const { activeModule, setActiveModule, favorites } = useAppState();
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div 
      className="desktop-only"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        height: '100vh',
        position: 'relative',
        zIndex: 100
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: isExpanded ? '260px' : 'var(--sidebar-width)',
        height: '100vh',
        background: 'rgba(20, 24, 22, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow: isExpanded ? '10px 0 30px rgba(0,0,0,0.5)' : 'none'
      }}>
        <div style={{ padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'calc(var(--header-height) - 1.5rem)' }}>
          {dockItems.map(item => {
          const IconComp = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: isExpanded ? '0.75rem 1rem' : '0.75rem',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                margin: '0 0.5rem',
                width: 'calc(100% - 1rem)',
                overflow: 'hidden',
                background: isActive ? 'var(--accent-purple)' : 'transparent',
                color: isActive ? '#000' : 'var(--text-main)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.2s ease',
                opacity: isActive ? 1 : 0.8,
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
            >
              <div style={{ minWidth: '18px', display: 'flex', justifyContent: 'center' }}>
                <IconComp size={18} />
              </div>
              <span style={{ flex: 1, opacity: isExpanded ? 1 : 0, display: isExpanded ? 'block' : 'none', transition: 'opacity 0.2s ease', transitionDelay: isExpanded ? '0.1s' : '0s' }}>
                {item.label}
              </span>
              {(item.badge > 0 && isExpanded) && (
                <span className="dt-badge" style={{ background: 'var(--danger)', color: '#FFF', padding: '0.15rem 0.4rem', border: 'none' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
