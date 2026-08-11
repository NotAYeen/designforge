import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { getColorFormats } from '../../utils/colorUtils';
import { Copy } from 'lucide-react';
import { colord } from 'colord';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-1.webp';

export default function ConverterModule() {
  const { activeColor, setActiveColor, showToast } = useAppState();
  const { t } = useI18n();
  const [colorA, setColorA] = useState('#8B5CF6');
  const [colorB, setColorB] = useState('#06B6D4');
  const [ratio, setRatio] = useState(50);

  const formats = getColorFormats(activeColor);
  const mixedColor = colord(colorA).mix(colorB, ratio / 100).toHex().toUpperCase();
  const mixedFormats = getColorFormats(mixedColor);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast(`Copiado: ${text}`);
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      
      {/* Header */}
      <div className="dt-card flex-col-mobile" style={{ padding: 0 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{t('converter.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {t('converter.subtitle')}
        </p>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid-2" style={{ gap: '2rem', flex: 1, alignItems: 'center', margin: '0.5rem 0' }}>
        {/* Left Formats List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="flex-wrap-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="color"
              value={activeColor.startsWith('#') ? activeColor : '#8B5CF6'}
              onChange={e => setActiveColor(e.target.value.toUpperCase())}
              style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', background: 'transparent' }}
            />
            <input
              type="text"
              value={activeColor}
              onChange={e => setActiveColor(e.target.value.toUpperCase())}
              className="dt-input"
              style={{ width: '100%', flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
            />
          </div>

          <div className="grid-2" style={{ gap: '0.4rem' }}>
            {[
              { label: 'HEX', val: formats.hex },
              { label: 'RGB', val: formats.rgb },
              { label: 'RGBA', val: formats.rgba },
              { label: 'HSL', val: formats.hsl },
              { label: 'HSV', val: formats.hsv },
              { label: 'CMYK', val: formats.cmyk },
            ].map((f, i) => (
              <div key={i} className="flex-col-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-main)', padding: '0.4rem 0.6rem', border: '1px solid var(--border-color)', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>{f.label}:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 'bold' }}>{f.val}</span>
                  <button onClick={() => handleCopy(f.val)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Mixer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="grid-2" style={{ gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>{t('converter.colorA')}</label>
              <div className="flex-wrap-mobile" style={{ display: 'flex', gap: '0.3rem' }}>
                <input type="color" value={colorA} onChange={e => setColorA(e.target.value.toUpperCase())} style={{ width: '28px', height: '28px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
                <input type="text" value={colorA} onChange={e => setColorA(e.target.value.toUpperCase())} className="dt-input" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.3rem', flex: 1, width: '100%' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>{t('converter.colorB')}</label>
              <div className="flex-wrap-mobile" style={{ display: 'flex', gap: '0.3rem' }}>
                <input type="color" value={colorB} onChange={e => setColorB(e.target.value.toUpperCase())} style={{ width: '28px', height: '28px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
                <input type="text" value={colorB} onChange={e => setColorB(e.target.value.toUpperCase())} className="dt-input" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.3rem', flex: 1, width: '100%' }} />
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <span>{t('converter.ratio')}</span>
              <span>{100 - ratio}% A / {ratio}% B</span>
            </div>
            <input type="range" min="0" max="100" value={ratio} onChange={e => setRatio(Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div className="flex-col-mobile" style={{ background: mixedColor, padding: '0.75rem 1rem', color: mixedFormats.isDark ? '#FFF' : '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{t('converter.result')}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>{mixedColor}</span>
            <button onClick={() => { setActiveColor(mixedColor); showToast('Color activo actualizado'); }} className="dt-btn dt-btn-sm" style={{ background: 'rgba(0,0,0,0.3)', color: '#FFF', border: 'none', fontSize: '0.7rem' }}>
              {t('converter.use')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
