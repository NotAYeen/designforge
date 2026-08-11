import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { ArrowRight } from 'lucide-react';
import { generateHarmony, getColorFormats } from '../../utils/colorUtils';
import { colord } from 'colord';
import womanLeft from '../../assets/layer-woman-left.webp';

export default function ColorWheelModule() {
  const { activeColor, setActiveColor, setActivePalette, setActiveModule, showToast } = useAppState();
  const { t } = useI18n();
  const [harmonyType, setHarmonyType] = useState('triadic');
  const [copiedHex, setCopiedHex] = useState(null);

  const harmonyColors = generateHarmony(activeColor, harmonyType);

  const harmonyDescriptions = {
    monochromatic: t('wheel.desc.monochromatic'),
    analogous: t('wheel.desc.analogous'),
    complementary: t('wheel.desc.complementary'),
    'split-complementary': t('wheel.desc.split-complementary'),
    triadic: t('wheel.desc.triadic'),
    tetradic: t('wheel.desc.tetradic'),
  };

  const fmt = getColorFormats(activeColor);
  const activeHue = fmt.hslObj ? fmt.hslObj.h : 265;

  const R = 82; // SVG Circle Radius
  const CX = 110;
  const CY = 110;

  // Derive coordinates for SVG nodes directly from the ACTUAL HSL HUE of each harmony color
  const nodes = harmonyColors.map((hex, idx) => {
    const hslObj = colord(hex).toHsl();
    const hueDeg = Math.round(hslObj.h);
    const rad = (hueDeg - 90) * (Math.PI / 180);
    const x = CX + R * Math.cos(rad);
    const y = CY + R * Math.sin(rad);
    return { hueDeg, x, y, hex, isBase: idx === 0 };
  });

  const polygonPoints = nodes.map(n => `${n.x},${n.y}`).join(' ');

  const handleWheelClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    const newHex = `hsl(${Math.round(angle)}, 85%, 55%)`;
    setActiveColor(newHex);
  };

  const handleApplyToPalette = () => {
    const formatted = harmonyColors.map((hex, idx) => ({
      id: `harmony-${idx}-${Date.now()}`,
      hex,
      isLocked: false,
      name: getColorFormats(hex).name,
    }));
    setActivePalette(formatted);
    setActiveModule('palette-creator');
    showToast('Armonía aplicada al Creador de Paletas');
  };

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copiado: ${hex}`);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="module-container">
      {/* Background Artwork */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div className="animate-helicopter" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <div 
            style={{
              position: 'absolute', top: '10%', left: '-5%', width: '40vw', height: '100%',
              backgroundImage: `url(${womanLeft})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center',
              mixBlendMode: 'lighten', opacity: 0.15
            }} 
          />
        </div>
      </div>

      {/* Header */}
      <div className="dt-card" style={{ padding: 0 }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>{t('wheel.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {t('wheel.subtitle')}
        </p>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid-2" style={{ flex: 1, alignItems: 'center', margin: '0.25rem 0' }}>
        {/* Left Column: Geometric SVG Color Wheel Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            onClick={handleWheelClick}
            style={{
              position: 'relative', width: '100%', maxWidth: '240px', aspectRatio: '1 / 1', borderRadius: '50%',
              background: 'conic-gradient(from 0deg, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 12px 35px rgba(0,0,0,0.65)', cursor: 'crosshair',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
            }}
          >
            {/* SVG Geometric Overlay Layer */}
            <svg 
              viewBox="0 0 220 220" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {/* Connecting Geometric Polygon (Lines / Triangles / Rectangles) */}
              {nodes.length > 1 && (
                <polygon 
                  points={polygonPoints} 
                  fill="rgba(200, 169, 126, 0.15)" 
                  stroke="var(--accent-purple)" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                />
              )}

              {/* Center Connection Spoke Lines to nodes */}
              {nodes.map((n, i) => (
                <line 
                  key={i} 
                  x1={CX} y1={CY} x2={n.x} y2={n.y} 
                  stroke={n.isBase ? 'var(--accent-purple)' : 'rgba(255,255,255,0.3)'} 
                  strokeWidth={n.isBase ? 2 : 1}
                />
              ))}

              {/* Vertex Handle Nodes */}
              {nodes.map((n, i) => (
                <circle 
                  key={i} 
                  cx={n.x} cy={n.y} r={n.isBase ? 9 : 7} 
                  fill={n.hex} 
                  stroke="#FFFFFF" 
                  strokeWidth={n.isBase ? 2.5 : 1.5}
                />
              ))}
            </svg>

            {/* Inner Center Active Color Display */}
            <div style={{
              width: '100%', maxWidth: '110px', aspectRatio: '1 / 1', borderRadius: '50%', background: 'var(--bg-main)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.85)', zIndex: 2
            }}>
              <input
                type="color"
                value={activeColor.startsWith('#') ? activeColor : '#8B5CF6'}
                onChange={e => setActiveColor(e.target.value.toUpperCase())}
                style={{ width: '28px', height: '28px', border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'transparent' }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.2rem' }}>{activeColor}</span>
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
            {t('wheel.instruction')}
          </span>
        </div>

        {/* Right Column: Harmony Types & Result Swatches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>{t('wheel.harmonyTitle')}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {[
                { id: 'triadic', label: 'Triádico (▲ 120°)' },
                { id: 'complementary', label: 'Complementario (180°)' },
                { id: 'analogous', label: 'Análogo (30°)' },
                { id: 'split-complementary', label: 'Split Comp.' },
                { id: 'tetradic', label: 'Tetrádico (■ 90°)' },
                { id: 'monochromatic', label: 'Monocromático' },
              ].map(h => (
                <button
                  key={h.id}
                  onClick={() => setHarmonyType(h.id)}
                  className={`dt-btn dt-btn-sm ${harmonyType === h.id ? 'dt-btn-primary' : 'dt-btn-ghost'}`}
                  style={{ flex: '1 1 100px', fontSize: '0.7rem', padding: '0.25rem 0.4rem', whiteSpace: 'nowrap' }}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ background: 'var(--bg-main)', padding: '0.6rem 0.8rem', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', lineHeight: 1.4, color: 'var(--text-muted)' }}>
              {harmonyDescriptions[harmonyType]}
            </span>
          </div>

          {/* Result Swatches */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>{t('wheel.verticesTitle')}</span>
            <div className="scroll-x-mobile" style={{ paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', minWidth: 'max-content' }}>
              {harmonyColors.map((hex, i) => {
                const colorFmt = getColorFormats(hex);
                return (
                  <div
                    key={i}
                    onClick={() => handleCopy(hex)}
                    style={{
                      flex: 1, minWidth: '60px',
                      background: hex, height: '55px', padding: '0.35rem',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      color: colorFmt.isDark ? '#FFF' : '#000', cursor: 'pointer',
                      fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span>{copiedHex === hex ? '✓' : hex}</span>
                  </div>
                );
              })}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button onClick={handleApplyToPalette} className="dt-btn dt-btn-primary dt-btn-sm" style={{ alignSelf: 'flex-start' }}>
            <ArrowRight size={14} /> {t('wheel.applyBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
