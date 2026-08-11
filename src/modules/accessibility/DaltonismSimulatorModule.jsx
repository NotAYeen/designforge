import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';

import { getColorFormats } from '../../utils/colorUtils';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-5.webp';

export default function DaltonismSimulatorModule() {
  const { activePalette, showToast } = useAppState();
  const { t } = useI18n();
  const [filterMode, setFilterMode] = useState('protanopia');

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copiado: ${hex}`);
  };

  const filters = [
    { id: 'normal', name: t('daltonism.filter.normal.name'), desc: t('daltonism.filter.normal.desc') },
    { id: 'protanopia', name: t('daltonism.filter.protanopia.name'), desc: t('daltonism.filter.protanopia.desc') },
    { id: 'deuteranopia', name: t('daltonism.filter.deuteranopia.name'), desc: t('daltonism.filter.deuteranopia.desc') },
    { id: 'tritanopia', name: t('daltonism.filter.tritanopia.name'), desc: t('daltonism.filter.tritanopia.desc') },
    { id: 'achromatopsia', name: t('daltonism.filter.achromatopsia.name'), desc: t('daltonism.filter.achromatopsia.desc') },
  ];

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      {/* SVG Colorblind Filters Injection */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.56667 0.43333 0 0 0  0.55833 0.44167 0 0 0  0 0.24167 0.75833 0 0  0 0 0 1 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.43333 0.56667 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <div className="dt-card">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{t('daltonism.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {t('daltonism.subtitle')}
        </p>
      </div>

      <div className="grid-2">
        {/* Mode Selector Panel */}
        <div className="dt-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem' }}>{t('daltonism.typeTitle')}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filters.map(f => (
              <div
                key={f.id}
                onClick={() => setFilterMode(f.id)}
                style={{
                  padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)',
                  background: filterMode === f.id ? 'var(--accent-purple)' : 'var(--bg-input)',
                  color: filterMode === f.id ? '#FFF' : 'var(--text-main)',
                  border: '1px solid var(--border-color)', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{f.name}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.2rem' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtered Preview Panel */}
        <div className="dt-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem' }}>{t('daltonism.previewTitle')}</h3>

          {/* Paleta simulada */}
          <div style={{ filter: filterMode === 'normal' ? 'none' : `url(#${filterMode})` }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('daltonism.paletteTitle')}</div>
            <div className="scroll-x-mobile" style={{ paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', minWidth: 'max-content', height: '90px' }}>
              {activePalette.map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleCopy(c.hex)}
                  title="Click para copiar"
                  style={{
                    background: c.hex, borderRadius: 'var(--radius-sm)', padding: '0.5rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    color: getColorFormats(c.hex).isDark ? '#FFF' : '#000',
                    fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)',
                    cursor: 'pointer'
                  }}
                >
                  {c.hex}
                </div>
              ))}
              </div>
            </div>

            {/* UI Card Simulada */}
            <div style={{
              marginTop: '1.5rem', background: activePalette[0] ? activePalette[0].hex : '#1C2536',
              color: activePalette[1] ? activePalette[1].hex : '#FFFFFF', padding: '1.5rem',
              borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <h4 style={{ fontSize: '1.3rem' }}>{t('daltonism.componentTitle')}</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {t('daltonism.componentDesc')}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button style={{ background: activePalette[2]?.hex || '#10B981', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold' }}>
                  {t('daltonism.btnAccept')}
                </button>
                <button style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold' }}>
                  {t('daltonism.btnCancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
