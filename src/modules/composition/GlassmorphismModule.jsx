import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { Copy, Check, Sparkles, Sliders } from 'lucide-react';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-10.webp';

export default function GlassmorphismModule() {
  const { activeColor, showToast } = useAppState();
  const { t } = useI18n();
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.25);
  const [borderOpacity, setBorderOpacity] = useState(0.18);
  const [saturate, setSaturate] = useState(140);
  const [brightness, setBrightness] = useState(100);
  const [shadowBlur, setShadowBlur] = useState(24);
  const [shadowOpacity, setShadowOpacity] = useState(0.35);
  const [tintColor, setTintColor] = useState('#FFFFFF');
  const [exportFormat, setExportFormat] = useState('css');
  const [copied, setCopied] = useState(false);

  // Hex to RGBA helper
  const hexToRgba = (hex, alpha) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getGlassCSS = () => {
    const bgRgba = hexToRgba(tintColor, opacity);
    const borderRgba = hexToRgba(tintColor, borderOpacity);
    return `background: ${bgRgba};
backdrop-filter: blur(${blur}px) saturate(${saturate}%) brightness(${brightness}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturate}%) brightness(${brightness}%);
border: 1px solid ${borderRgba};
box-shadow: 0 8px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity});`;
  };

  const getTailwindClasses = () => {
    return `backdrop-blur-[${blur}px] backdrop-saturate-[${saturate}%] backdrop-brightness-[${brightness}%] bg-[${hexToRgba(tintColor, opacity)}] border border-[${hexToRgba(tintColor, borderOpacity)}] shadow-[0_8px_${shadowBlur}px_rgba(0,0,0,${shadowOpacity})]`;
  };

  const getReactStyleObject = () => {
    const bgRgba = hexToRgba(tintColor, opacity);
    const borderRgba = hexToRgba(tintColor, borderOpacity);
    return `style={{
  background: '${bgRgba}',
  backdropFilter: 'blur(${blur}px) saturate(${saturate}%) brightness(${brightness}%)',
  WebkitBackdropFilter: 'blur(${blur}px) saturate(${saturate}%) brightness(${brightness}%)',
  border: '1px solid ${borderRgba}',
  boxShadow: '0 8px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})'
}}`;
  };

  const presets = [
    { name: 'Frosted Ice', blur: 20, opacity: 0.2, borderOpacity: 0.3, saturate: 150, brightness: 105, shadowBlur: 30, shadowOpacity: 0.3, tint: '#FFFFFF' },
    { name: 'Dark Velvet', blur: 16, opacity: 0.45, borderOpacity: 0.15, saturate: 120, brightness: 90, shadowBlur: 40, shadowOpacity: 0.6, tint: '#141816' },
    { name: 'Gold Renaissance', blur: 12, opacity: 0.25, borderOpacity: 0.4, saturate: 180, brightness: 110, shadowBlur: 25, shadowOpacity: 0.4, tint: '#C8A97E' },
    { name: 'Cyber Neon', blur: 24, opacity: 0.3, borderOpacity: 0.5, saturate: 220, brightness: 120, shadowBlur: 35, shadowOpacity: 0.5, tint: '#06B6D4' },
  ];

  const applyPreset = (p) => {
    setBlur(p.blur);
    setOpacity(p.opacity);
    setBorderOpacity(p.borderOpacity);
    setSaturate(p.saturate);
    setBrightness(p.brightness);
    setShadowBlur(p.shadowBlur);
    setShadowOpacity(p.shadowOpacity);
    setTintColor(p.tint);
    showToast(`Preset "${p.name}" aplicado`);
  };

  const getExportCode = () => {
    if (exportFormat === 'tailwind') return getTailwindClasses();
    if (exportFormat === 'react') return getReactStyleObject();
    return getGlassCSS();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    showToast('Código copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      
      {/* Header */}
      <div className="dt-card" style={{ padding: 0 }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{t('glass.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {t('glass.subtitle')}
        </p>
      </div>

      {/* Presets Bar */}
      <div className="flex-wrap-mobile" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('glass.presets')}</span>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => applyPreset(p)}
            className="dt-btn dt-btn-ghost dt-btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid-2" style={{ gap: '2rem', flex: 1, alignItems: 'stretch', margin: '0.25rem 0' }}>
        {/* Left Column Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* Grid 2 Sliders */}
          <div className="grid-2" style={{ gap: '0.6rem' }}>
            <div>
              <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>{t('glass.blur')}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{blur}px</span>
              </div>
              <input type="range" min="0" max="40" value={blur} onChange={e => setBlur(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div>
              <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>{t('glass.opacity')}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(opacity * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div>
              <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>{t('glass.saturate')}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{saturate}%</span>
              </div>
              <input type="range" min="100" max="250" value={saturate} onChange={e => setSaturate(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div>
              <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>{t('glass.brightness')}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{brightness}%</span>
              </div>
              <input type="range" min="80" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div>
              <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>{t('glass.borderOpacity')}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(borderOpacity * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={borderOpacity} onChange={e => setBorderOpacity(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div>
              <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>{t('glass.shadowBlur')}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{shadowBlur}px</span>
              </div>
              <input type="range" min="0" max="50" value={shadowBlur} onChange={e => setShadowBlur(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>

          {/* Color Tint Selector */}
          <div className="flex-col-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-main)', padding: '0.35rem 0.6rem', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('glass.tint')}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
              {['#FFFFFF', '#141816', '#C8A97E', '#06B6D4', '#8B5CF6'].map(c => (
                <div
                  key={c}
                  onClick={() => setTintColor(c)}
                  style={{
                    width: '18px', height: '18px', background: c, border: tintColor === c ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                />
              ))}
              <input type="color" value={tintColor} onChange={e => setTintColor(e.target.value.toUpperCase())} style={{ width: '22px', height: '22px', border: 'none', cursor: 'pointer', background: 'transparent', padding: 0 }} />
            </div>
          </div>

          {/* Export Code Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div className="flex-col-mobile" style={{ display: 'flex', gap: '0.4rem' }}>
              {['css', 'tailwind', 'react'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`dt-btn dt-btn-sm ${exportFormat === fmt ? 'dt-btn-primary' : 'dt-btn-ghost'}`}
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}
                >
                  {fmt}
                </button>
              ))}
            </div>
            <div className="flex-col-mobile" style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                readOnly
                value={getExportCode()}
                className="dt-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.35rem 0.5rem', flex: 1 }}
              />
              <button onClick={handleCopyCode} className="dt-btn dt-btn-primary dt-btn-sm" style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? t('glass.copied') : t('glass.copy')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Floating Glass Card Preview */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div style={{
            background: hexToRgba(tintColor, opacity),
            backdropFilter: `blur(${blur}px) saturate(${saturate}%) brightness(${brightness}%)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}%) brightness(${brightness}%)`,
            border: `1px solid ${hexToRgba(tintColor, borderOpacity)}`,
            padding: '2rem',
            width: '100%',
            maxWidth: '100%',
            color: '#FFFFFF',
            boxShadow: `0 8px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>Glassmorphism Studio</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.45, marginBottom: '1.25rem', fontFamily: 'var(--font-main)' }}>
              Efecto de refracción óptica multinivel flotando sobre la composición artística.
            </p>
            <div className="flex-col-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                background: hexToRgba(tintColor, 0.2), color: '#FFF', border: `1px solid ${hexToRgba(tintColor, 0.4)}`,
                padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer'
              }}>
                {t('glass.interact')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
