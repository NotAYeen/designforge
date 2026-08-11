import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { 
  Home, Palette, Disc, Image, Eye, Layout, Type, Layers, 
  Grid, Box, Sparkles, FolderKanban, Star, ShieldCheck
} from 'lucide-react';

export default function Dock() {
  const { activeModule, setActiveModule, favorites } = useAppState();
  const { t } = useI18n();
  const [hoveredIndex, setHoveredIndex] = useState(null);
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

  const handleNavClick = (id) => {
    setActiveModule(id);
  };

  return (
    <div 
      className="dock-container"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => { setIsExpanded(false); setHoveredIndex(null); }}
    >
      <div 
        className="dock-glass"
        style={{
          gap: isExpanded ? '0.5rem' : '0',
          padding: isExpanded ? '0.75rem 1rem' : '0.5rem',
          transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {dockItems.map((item, idx) => {
          const IconComp = item.icon;
          const isActive = activeModule === item.id;
          const isVisible = isExpanded || isActive;
          
          // Calcular la escala basada en la distancia al elemento hovereado
          let scale = 1;
          let translateY = 0;
          if (hoveredIndex !== null && isExpanded) {
            const distance = Math.abs(hoveredIndex - idx);
            if (distance === 0) {
              scale = 1.4;
              translateY = -10;
            } else if (distance === 1) {
              scale = 1.2;
              translateY = -5;
            } else if (distance === 2) {
              scale = 1.1;
              translateY = -2;
            }
          }

          return (
            <div 
              key={item.id}
              className="dock-item"
              onMouseEnter={() => isExpanded && setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleNavClick(item.id)}
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                zIndex: hoveredIndex === idx ? 10 : 1,
                width: isVisible ? '44px' : '0px',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                overflow: 'visible',
                transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {/* Tooltip */}
              <div 
                className="dock-tooltip"
                style={{
                  opacity: (hoveredIndex === idx && isExpanded) ? 1 : 0,
                  transform: (hoveredIndex === idx && isExpanded) ? 'translateY(-10px) scale(1)' : 'translateY(0px) scale(0.8)',
                  pointerEvents: 'none'
                }}
              >
                {item.label}
              </div>

              {/* Icon Container */}
              <div 
                className={`dock-icon-wrapper ${isActive ? 'active' : ''}`}
                style={{
                  minWidth: '44px',
                  transform: isVisible ? 'scale(1)' : 'scale(0.5)'
                }}
              >
                <IconComp size={20} />
                {item.badge > 0 && (
                  <div className="dock-badge">{item.badge}</div>
                )}
                {isActive && <div className="dock-indicator" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
