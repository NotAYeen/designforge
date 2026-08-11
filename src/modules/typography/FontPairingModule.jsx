import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-6.webp';

export default function FontPairingModule() {
  const { activeFont, setActiveFont, showToast } = useAppState();
  const { t } = useI18n();
  const [baseSize, setBaseSize] = useState(15);
  const [ratioType, setRatioType] = useState('1.333');
  const [headingFont, setHeadingFont] = useState(activeFont.heading || 'Outfit');
  const [bodyFont, setBodyFont] = useState(activeFont.body || 'Inter');

  const fontOptions = [
    { name: 'Outfit', category: 'Sans-serif' },
    { name: 'Inter', category: 'Sans-serif' },
    { name: 'Plus Jakarta Sans', category: 'Sans-serif' },
    { name: 'Playfair Display', category: 'Serif' },
    { name: 'Fira Code', category: 'Monospace' },
    { name: 'Roboto Mono', category: 'Monospace' },
  ];

  const fontPresets = [
    { name: 'Modern UI/UX', heading: 'Outfit', body: 'Inter' },
    { name: 'Editorial Elegante', heading: 'Playfair Display', body: 'Inter' },
    { name: 'Tech Dashboard', heading: 'Plus Jakarta Sans', body: 'Fira Code' },
    { name: 'Clean Corporate', heading: 'Inter', body: 'Plus Jakarta Sans' },
  ];

  const ratioMap = {
    '1.125': 'Minor Second (1.125)',
    '1.200': 'Minor Third (1.200)',
    '1.250': 'Major Third (1.250)',
    '1.333': 'Perfect Fourth (1.333)',
    '1.618': 'Golden Ratio (1.618)',
  };

  const scaleRatio = parseFloat(ratioType);
  const scale = [
    { label: 'h1', size: Math.round(baseSize * Math.pow(scaleRatio, 4)) },
    { label: 'h2', size: Math.round(baseSize * Math.pow(scaleRatio, 3)) },
    { label: 'h3', size: Math.round(baseSize * Math.pow(scaleRatio, 2)) },
    { label: 'h4', size: Math.round(baseSize * scaleRatio) },
    { label: 'base', size: baseSize },
    { label: 'small', size: Math.round(baseSize / scaleRatio) },
  ];

  const handleApplyPreset = (h, b) => {
    setHeadingFont(h);
    setBodyFont(b);
    setActiveFont({ heading: h, body: b });
    showToast(`Combinación aplicada: ${h} + ${b}`);
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      
      {/* Header */}
      <div className="dt-card" style={{ padding: 0 }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{t('font.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {t('font.subtitle')}
        </p>
      </div>

      {/* Presets Grid */}
      <div className="grid-4" style={{ gap: '0.75rem' }}>
        {fontPresets.map((p, i) => (
          <div
            key={i}
            onClick={() => handleApplyPreset(p.heading, p.body)}
            style={{
              cursor: 'pointer', padding: '0.4rem 0.75rem', background: 'var(--bg-main)',
              borderLeft: '3px solid var(--accent-purple)', borderTop: '1px solid var(--border-color)',
              borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)'
            }}
          >
            <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>{p.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-purple)' }}>{p.heading} + {p.body}</div>
          </div>
        ))}
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid-2" style={{ gap: '1.5rem', flex: 1, alignItems: 'center', margin: '0.25rem 0' }}>
        {/* Left Column: Selectors & Scale Calculation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="grid-2" style={{ gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>{t('font.heading')}</label>
              <select
                value={headingFont}
                onChange={e => { setHeadingFont(e.target.value); setActiveFont({ heading: e.target.value, body: bodyFont }); }}
                className="dt-input"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
              >
                {fontOptions.map(f => <option key={f.name} value={f.name}>{f.name} ({f.category})</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>{t('font.body')}</label>
              <select
                value={bodyFont}
                onChange={e => { setBodyFont(e.target.value); setActiveFont({ heading: headingFont, body: e.target.value }); }}
                className="dt-input"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
              >
                {fontOptions.map(f => <option key={f.name} value={f.name}>{f.name} ({f.category})</option>)}
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                <span>{t('font.baseSize')}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{baseSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="22"
                value={baseSize}
                onChange={e => setBaseSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>{t('font.harmonicScale')}</label>
              <select value={ratioType} onChange={e => setRatioType(e.target.value)} className="dt-input" style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}>
                {Object.entries(ratioMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Computed Scale List */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>{t('font.calculatedScale')}</span>
            <div className="grid-3" style={{ gap: '0.35rem' }}>
              {scale.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-main)', padding: '0.25rem 0.5rem', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-purple)' }}>{s.label.toUpperCase()}</span>
                  <span>{s.size}px</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Web Preview Box */}
        <div style={{
          background: 'var(--bg-main)', padding: '1.25rem 1.5rem', border: '1px solid var(--border-color)',
          display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: '250px', justifyContent: 'center'
        }}>
          <h1 style={{ fontFamily: headingFont, fontSize: `${Math.min(scale[0].size, 36)}px`, lineHeight: 1.2, wordBreak: 'break-word' }}>
            {t('font.previewHeading')}
          </h1>
          <h3 style={{ fontFamily: headingFont, fontSize: `${Math.min(scale[2].size, 20)}px`, color: 'var(--text-muted)', lineHeight: 1.2 }}>
            {t('font.previewSub')} ({ratioType})
          </h3>
          <p style={{ fontFamily: bodyFont, fontSize: `${scale[4].size}px`, lineHeight: 1.45, opacity: 0.95 }}>
            {t('font.previewBody')}
          </p>
          <div style={{ fontSize: `${scale[5].size}px`, fontFamily: bodyFont, color: 'var(--text-dim)' }}>
            {t('font.previewFooter')} {scale[5].size}px.
          </div>
        </div>
      </div>
    </div>
  );
}
