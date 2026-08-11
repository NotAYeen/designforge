import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { generateShadesAndTints, generateScale50to950, getColorFormats } from '../../utils/colorUtils';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-3.webp';

export default function ShadesTintsModule() {
  const { activeColor, setActiveColor, showToast } = useAppState();
  const { t } = useI18n();

  const { tints, shades, tones } = generateShadesAndTints(activeColor, 5);
  const scaleSystem = generateScale50to950(activeColor);

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copiado: ${hex}`);
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      
      {/* Header */}
      <div className="dt-card" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{t('shades.title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('shades.subtitle')}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="color"
            value={activeColor.startsWith('#') ? activeColor : '#8B5CF6'}
            onChange={e => setActiveColor(e.target.value.toUpperCase())}
            style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', background: 'transparent' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1rem' }}>{activeColor}</span>
        </div>
      </div>

      {/* Escala 50 to 950 (11 swatches grid) */}
      <div className="dt-card" style={{ padding: 0 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
          {t('shades.scaleTitle')}
        </span>
      <div className="scroll-x-mobile" style={{ paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', minWidth: '800px', gap: '0.35rem' }}>
          {Object.entries(scaleSystem).map(([key, hex]) => {
            const fmt = getColorFormats(hex);
            return (
              <div
                key={key}
                onClick={() => handleCopy(hex)}
                style={{
                  background: hex, padding: '0.35rem 0.4rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  color: fmt.isDark ? '#FFF' : '#000', cursor: 'pointer',
                  minHeight: '48px', transition: 'transform 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800' }}>{key}</div>
                <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)' }}>{hex}</div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* 3 Columns: Tints (+Blanco), Shades (+Negro), Tones (+Gris) */}
      <div className="grid-3" style={{ flex: 1, alignItems: 'center' }}>
        {/* Tints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('shades.tints')}</span>
          {tints.map((hex, i) => {
            const fmt = getColorFormats(hex);
            return (
              <div
                key={i}
                onClick={() => handleCopy(hex)}
                style={{
                  background: hex, padding: '0.35rem 0.6rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  color: fmt.isDark ? '#FFF' : '#000', cursor: 'pointer',
                  fontSize: '0.75rem', fontFamily: 'var(--font-mono)', border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                <span>{hex}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>+{(i + 1) * 10}%</span>
              </div>
            );
          })}
        </div>

        {/* Shades */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('shades.shades')}</span>
          {shades.map((hex, i) => {
            const fmt = getColorFormats(hex);
            return (
              <div
                key={i}
                onClick={() => handleCopy(hex)}
                style={{
                  background: hex, padding: '0.35rem 0.6rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  color: fmt.isDark ? '#FFF' : '#000', cursor: 'pointer',
                  fontSize: '0.75rem', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <span>{hex}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>+{(i + 1) * 10}%</span>
              </div>
            );
          })}
        </div>

        {/* Tones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('shades.tones')}</span>
          {tones.map((hex, i) => {
            const fmt = getColorFormats(hex);
            return (
              <div
                key={i}
                onClick={() => handleCopy(hex)}
                style={{
                  background: hex, padding: '0.35rem 0.6rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  color: fmt.isDark ? '#FFF' : '#000', cursor: 'pointer',
                  fontSize: '0.75rem', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <span>{hex}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>+{(i + 1) * 10}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
