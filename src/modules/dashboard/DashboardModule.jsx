import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { 
  Palette, Disc, Image, Sparkles, ShieldCheck, Type
} from 'lucide-react';
import bgBase from '../../assets/bg-base.webp';
import manCenter from '../../assets/layer-man-center.webp';
import manRight from '../../assets/layer-man-right.webp';
import womanRight from '../../assets/layer-woman-right.webp';
import womanLeft from '../../assets/layer-woman-left.webp';

export default function DashboardModule() {
  const { setActiveModule } = useAppState();
  const { t } = useI18n();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Normalizar a valores entre -1 y 1
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  const quickTools = [
    { id: 'palette-creator', title: t('tool.paletteCreator.title'), icon: Palette, color: 'var(--accent-purple)' },
    { id: 'color-wheel', title: t('tool.colorWheel.title'), icon: Disc, color: 'var(--accent-cyan)' },
    { id: 'contrast', title: t('tool.contrast.title'), icon: ShieldCheck, color: '#10B981' },
    { id: 'gradients', title: t('tool.gradients.title'), icon: Sparkles, color: 'var(--accent-pink)' },
    { id: 'image-extractor', title: t('tool.imageExtractor.title'), icon: Image, color: '#F59E0B' },
    { id: 'font-pairing', title: t('tool.fontPairing.title'), icon: Type, color: '#3B82F6' },
  ];

  return (
    <div 
      className="dashboard-layout" 
      style={{ 
        width: '100%', 
        height: '100%',
        background: 'transparent' 
      }}
      onMouseMove={handleMouseMove}
    >
      
      {/* 3D Parallax Background Collage */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none'
      }}>
        <div className="animate-helicopter" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <div 
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              backgroundImage: `url(${bgBase})`, backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(2px)', opacity: 0.4, mixBlendMode: 'luminosity',
              transform: `translate3d(${mousePos.x * 15}px, ${mousePos.y * 15}px, 0)`,
              transition: 'transform 0.1s ease-out'
            }} 
          />
        </div>
        <div className="animate-helicopter" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <div 
            style={{
              position: 'absolute', bottom: 0, right: 0, width: '45vw', height: '100%',
              backgroundImage: `url(${manCenter})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom right',
              mixBlendMode: 'lighten', opacity: 0.9, filter: 'blur(1px)',
              transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0)`,
              transition: 'transform 0.1s ease-out'
            }} 
          />
        </div>
      </div>  


      {/* Foreground Content - Adjusted organically to not block the center art */}
      <div style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="dashboard-content">
        
        {/* Top Text Section - Aligned Center Left */}
        <div style={{ maxWidth: '650px' }}>
          <span style={{ 
            fontFamily: 'var(--font-main)', fontSize: '0.8rem', letterSpacing: '0.5em', 
            color: 'var(--accent-purple)', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {t('dashboard.hero.subtitle')}
          </span>
          
          <h1 style={{ 
            fontSize: 'clamp(4rem, 9vw, 8.5rem)', 
            lineHeight: 0.85, 
            marginBottom: '2rem', 
            color: 'var(--text-main)', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 400,
            textShadow: '0 10px 40px rgba(0,0,0,0.9)'
          }}>
            DESIGN <br/>
            <span style={{ fontStyle: 'italic', color: 'var(--accent-purple)' }}>FORGE</span>
          </h1>
          
          <p 
            style={{ 
              color: 'var(--text-main)', 
              fontSize: '1.6rem', 
              lineHeight: 1.3, 
              fontFamily: 'var(--font-script)',
              fontWeight: 400,
              letterSpacing: '0.03em',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              maxWidth: '550px'
            }}
            dangerouslySetInnerHTML={{ __html: t('dashboard.hero.desc') }}
          />
        </div>

      </div>
    </div>
  );
}
