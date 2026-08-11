import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { 
  Lock, Unlock, RefreshCw, Plus, Trash2, Copy, Download, 
  Sparkles, ShieldCheck, Star, Layers, Code, Check
} from 'lucide-react';
import { 
  getRandomPalette, getRandomHex, generateHarmony, getColorFormats 
} from '../../utils/colorUtils';
import womanRight from '../../assets/layer-woman-right.webp';

export default function PaletteCreator() {
  const { activePalette, setActivePalette, setActiveColor, setActiveModule, showToast, toggleFavorite, addPaletteToProject, activeProject, globalThemeOverrides, setGlobalThemeOverrides } = useAppState();
  const { t } = useI18n();
  const [harmonyType, setHarmonyType] = useState('random');
  const [displayMode, setDisplayMode] = useState('radial'); // 'radial', 'classic', 'stripes'
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewMapping, setPreviewMapping] = useState({ bgMain: 0, bgSurface: 1, accent: 2, textMain: 3, textMuted: 4 });
  const [exportFormat, setExportFormat] = useState('css');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedColorId, setCopiedColorId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleRegenerate = () => {
    if (harmonyType === 'random') {
      setActivePalette(prev => prev.map(c => {
        if (c.isLocked) return c;
        const newHex = getRandomHex();
        return { ...c, hex: newHex, name: getColorFormats(newHex).name };
      }));
    } else {
      // Siempre usamos un nuevo color base aleatorio para que los colores generados varíen en cada "Regenerar"
      const baseHex = getRandomHex();
      const newColors = generateHarmony(baseHex, harmonyType);
      
      setActivePalette(prev => prev.map((c, idx) => {
        if (c.isLocked) return c;
        const hex = newColors[idx % newColors.length] || getRandomHex();
        return { ...c, hex, name: getColorFormats(hex).name };
      }));
    }
    showToast('Paleta regenerada');
  };

  const toggleLockColor = (id) => {
    setActivePalette(prev => prev.map(c => c.id === id ? { ...c, isLocked: !c.isLocked } : c));
  };

  const updateColorHex = (id, newHex) => {
    setActivePalette(prev => prev.map(c => c.id === id ? { ...c, hex: newHex, name: getColorFormats(newHex).name } : c));
  };

  const addColor = () => {
    if (activePalette.length >= 8) {
      showToast('Máximo 8 colores por paleta');
      return;
    }
    const newHex = getRandomHex();
    setActivePalette(prev => [...prev, {
      id: `color-${Date.now()}`,
      hex: newHex,
      isLocked: false,
      name: getColorFormats(newHex).name
    }]);
  };

  const removeColor = (id) => {
    if (activePalette.length <= 2) {
      showToast('Mínimo 2 colores por paleta');
      return;
    }
    setActivePalette(prev => prev.filter(c => c.id !== id));
  };

  const handleCopyHex = (id, hex) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copiado: ${hex}`);
    setCopiedColorId(id);
    setTimeout(() => setCopiedColorId(null), 1500);
  };

  const getExportCode = () => {
    switch (exportFormat) {
      case 'css':
        return `:root {\n${activePalette.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`).join('\n')}\n}`;
      case 'tailwind':
        return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${activePalette.map((c, i) => `        'brand-${i + 1}': '${c.hex}',`).join('\n')}\n      }\n    }\n  }\n}`;
      case 'json':
        return JSON.stringify(activePalette.map((c, i) => ({ name: c.name, hex: c.hex, role: `color-${i + 1}` })), null, 2);
      case 'scss':
        return activePalette.map((c, i) => `$color-${i + 1}: ${c.hex}; // ${c.name}`).join('\n');
      default:
        return '';
    }
  };

  return (
    <div 
      className="module-container"
      onMouseMove={handleMouseMove}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}
    >
      {/* Background Parallax Image */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div className="animate-helicopter" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <div 
            style={{
            position: 'absolute', top: '-10%', right: '-5%', width: '45vw', height: '120%',
            backgroundImage: `url(${womanRight})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center',
            mixBlendMode: 'lighten', opacity: 0.15,
            transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
            transition: 'transform 0.1s ease-out'
          }} />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid-palette" style={{ flex: 1, gap: '1rem', overflow: 'hidden', height: '100%' }}>
        
        {/* LEFT COLUMN: Controls & Connections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {/* Header Controls */}
          <div className="dt-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>{t('palette.title')}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {t('palette.subtitle')}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.2rem', display: 'block' }}>Vista</label>
                <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(0,0,0,0.1)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                  <button onClick={() => setDisplayMode('radial')} className={`dt-btn dt-btn-sm ${displayMode === 'radial' ? 'dt-btn-primary' : 'dt-btn-ghost'}`} style={{ flex: 1, padding: '0.4rem 0' }}>Orbes</button>
                  <button onClick={() => setDisplayMode('classic')} className={`dt-btn dt-btn-sm ${displayMode === 'classic' ? 'dt-btn-primary' : 'dt-btn-ghost'}`} style={{ flex: 1, padding: '0.4rem 0' }}>Clásica</button>
                  <button onClick={() => setDisplayMode('stripes')} className={`dt-btn dt-btn-sm ${displayMode === 'stripes' ? 'dt-btn-primary' : 'dt-btn-ghost'}`} style={{ flex: 1, padding: '0.4rem 0' }}>Franjas</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.2rem', display: 'block' }}>Tipo de Armonía</label>
                <select 
                  value={harmonyType} 
                  onChange={e => setHarmonyType(e.target.value)}
                  className="dt-input"
                  style={{ width: '100%' }}
                >
                  <option value="random">{t('palette.harmony.random')}</option>
                  <option value="analogous">{t('palette.harmony.analogous')}</option>
                  <option value="complementary">{t('palette.harmony.complementary')}</option>
                  <option value="split-complementary">{t('palette.harmony.splitComplementary')}</option>
                  <option value="triadic">{t('palette.harmony.triadic')}</option>
                  <option value="tetradic">{t('palette.harmony.tetradic')}</option>
                  <option value="monochromatic">{t('palette.harmony.monochromatic')}</option>
                </select>

                <div className="flex-wrap-mobile" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={handleRegenerate} className="dt-btn dt-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <RefreshCw size={16} /> {t('palette.btn.regenerate')}
                  </button>
                  <button onClick={addColor} className="dt-btn dt-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    <Plus size={16} /> {t('palette.btn.addColor')}
                  </button>
                </div>

                <button onClick={() => setExportModalOpen(true)} className="dt-btn dt-btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
                  <Code size={16} /> {t('palette.btn.export')}
                </button>
              </div>
            </div>
          </div>

          {/* Connection Quick Bar */}
          <div className="dt-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{t('palette.connect.title')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Vincula esta paleta con otras herramientas del sistema.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {globalThemeOverrides ? (
                <button onClick={() => { setGlobalThemeOverrides(null); showToast('Tema original restaurado'); }} className="dt-btn dt-btn-ghost" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', justifyContent: 'center' }}>
                  {t('palette.connect.restore')}
                </button>
              ) : (
                <button onClick={() => setPreviewModalOpen(true)} className="dt-btn dt-btn-primary" style={{ background: '#000', color: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', justifyContent: 'center' }}>
                  <Layers size={16} /> {t('palette.connect.apply')}
                </button>
              )}
              
              <div className="flex-wrap-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setActiveModule('contrast')} className="dt-btn dt-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  <ShieldCheck size={16} /> {t('palette.connect.wcag')}
                </button>
                <button onClick={() => addPaletteToProject(activeProject?.id, activePalette)} className="dt-btn dt-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Star size={16} /> {t('palette.connect.save')}
                </button>
              </div>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Main Palette Display */}
        <div className="dt-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', height: '100%' }}>
          
          {displayMode === 'radial' && (
            <div className="palette-radial-wrapper">
              
              {/* Orbit Rings Background */}
              <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.06)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: '40%', height: '40%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.03)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
              
              {/* Central Hub Core */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 'clamp(50px, 8vw, 70px)', height: 'clamp(50px, 8vw, 70px)', borderRadius: '50%',
                background: 'var(--bg-surface)', border: '2px solid var(--accent-purple)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)', zIndex: 10
              }}>
                <Sparkles size={16} color="var(--accent-purple)" />
                <span style={{ fontSize: '0.45rem', marginTop: '0.2rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>CORE</span>
              </div>

              {activePalette.map((item, idx) => {
                const fmt = getColorFormats(item.hex);
                const angle = (idx / activePalette.length) * 2 * Math.PI - Math.PI / 2;
                const radiusPercent = 40;
                const left = 50 + radiusPercent * Math.cos(angle);
                const top = 50 + radiusPercent * Math.sin(angle);

                return (
                  <div
                    key={item.id || idx}
                    style={{
                      position: 'absolute', top: `${top}%`, left: `${left}%`, transform: 'translate(-50%, -50%)',
                      background: item.hex, borderRadius: '50%', width: 'clamp(65px, min(12vw, 12vh), 90px)', height: 'clamp(65px, min(12vw, 12vh), 90px)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: fmt.isDark ? '#FFFFFF' : '#000000',
                      boxShadow: item.isLocked ? '0 0 0 4px var(--accent-purple), 0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.4)',
                      transition: 'top 0.5s ease-out, left 0.5s ease-out, transform 0.2s ease, box-shadow 0.2s ease', zIndex: 5
                    }}
                    className="bubble-node"
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)'; e.currentTarget.style.zIndex = 20; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.0)'; e.currentTarget.style.zIndex = 5; }}
                  >
                    <input type="color" value={item.hex} onChange={e => updateColorHex(item.id, e.target.value.toUpperCase())} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 1 }} />
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', pointerEvents: 'none', padding: '0.2rem' }}>
                      <span onClick={(e) => { e.stopPropagation(); handleCopyHex(item.id, item.hex); }} title="Click para copiar" style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)', textShadow: '0 2px 4px rgba(0,0,0,0.2)', pointerEvents: 'auto', cursor: 'pointer' }}>{item.hex}</span>
                      <div className="desktop-only" style={{ fontSize: '0.55rem', opacity: 0.9, fontWeight: '600', marginTop: '0.1rem', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{item.name}</div>
                    </div>
                    <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.1rem', zIndex: 10, background: 'rgba(20, 24, 22, 0.9)', padding: '0.15rem 0.3rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backdropFilter: 'blur(8px)' }} className="bubble-actions">
                      <button aria-label={item.isLocked ? "Desbloquear" : "Bloquear"} onClick={(e) => { e.stopPropagation(); toggleLockColor(item.id); }} className="touch-target" style={{ background: 'transparent', border: 'none', padding: '0.2rem', color: 'var(--text-main)', cursor: 'pointer' }}>{item.isLocked ? <Lock size={14} color="#10B981" /> : <Unlock size={14} />}</button>
                      <button aria-label="Copiar" onClick={(e) => { e.stopPropagation(); handleCopyHex(item.id, item.hex); }} className="touch-target" style={{ background: 'transparent', border: 'none', padding: '0.2rem', color: copiedColorId === item.id ? '#10B981' : 'var(--text-main)', cursor: 'pointer', transition: 'color 0.2s' }}>{copiedColorId === item.id ? <Check size={14} /> : <Copy size={14} />}</button>
                      <button aria-label="Eliminar" onClick={(e) => { e.stopPropagation(); removeColor(item.id); }} className="touch-target" style={{ background: 'transparent', border: 'none', padding: '0.2rem', color: 'var(--text-main)', cursor: 'pointer' }}><Trash2 size={14} color="var(--danger)" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {displayMode === 'classic' && (
            <div className="palette-classic-wrapper">
              {activePalette.map((item, idx) => {
                const fmt = getColorFormats(item.hex);
                return (
                  <div key={item.id || idx} style={{ background: item.hex, borderRadius: 'var(--radius-md)', padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: fmt.isDark ? '#FFFFFF' : '#000000', boxShadow: item.isLocked ? '0 0 0 3px var(--accent-purple)' : 'none', flex: '1 1 120px', minHeight: '160px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button aria-label={item.isLocked ? "Desbloquear" : "Bloquear"} onClick={() => toggleLockColor(item.id)} className="touch-target" style={{ background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '6px', color: '#FFF', cursor: 'pointer' }}>{item.isLocked ? <Lock size={16} color="#10B981" /> : <Unlock size={16} />}</button>
                      <button aria-label="Eliminar" onClick={() => removeColor(item.id)} className="touch-target" style={{ background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '6px', color: '#FFF', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                      <input type="color" value={item.hex} onChange={e => updateColorHex(item.id, e.target.value.toUpperCase())} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'transparent' }} />
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: '#FFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span onClick={(e) => { e.stopPropagation(); handleCopyHex(item.id, item.hex); }} title="Click para copiar" style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', pointerEvents: 'auto' }}>{item.hex}</span>
                        <button aria-label="Copiar" onClick={() => handleCopyHex(item.id, item.hex)} className="touch-target" style={{ background: 'transparent', border: 'none', color: copiedColorId === item.id ? '#10B981' : '#FFF', cursor: 'pointer', minHeight: '32px', minWidth: '32px' }}>{copiedColorId === item.id ? <Check size={14} /> : <Copy size={14} />}</button>
                      </div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.9, fontWeight: '500', marginTop: '0.2rem' }}>{item.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {displayMode === 'stripes' && (
            <div className="palette-stripes-wrapper">
              {activePalette.map((item, idx) => {
                const fmt = getColorFormats(item.hex);
                return (
                  <div key={item.id || idx} className="stripe-node" style={{ flex: 1, background: item.hex, transition: 'flex 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: fmt.isDark ? '#FFFFFF' : '#000000', position: 'relative' }}>
                    <input type="color" value={item.hex} onChange={e => updateColorHex(item.id, e.target.value.toUpperCase())} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 1 }} />
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', pointerEvents: 'none' }}>
                      <span onClick={(e) => { e.stopPropagation(); handleCopyHex(item.id, item.hex); }} title="Click para copiar" style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.8rem, 2vw, 1.2rem)', writingMode: 'vertical-rl', textOrientation: 'mixed', textShadow: '0 2px 4px rgba(0,0,0,0.3)', pointerEvents: 'auto', cursor: 'pointer' }}>{item.hex}</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10, background: 'rgba(20, 24, 22, 0.9)', padding: '0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backdropFilter: 'blur(8px)' }} className="bubble-actions">
                      <button aria-label={item.isLocked ? "Desbloquear" : "Bloquear"} onClick={(e) => { e.stopPropagation(); toggleLockColor(item.id); }} className="touch-target" style={{ background: 'transparent', border: 'none', padding: '0.2rem', color: 'var(--text-main)', cursor: 'pointer' }}>{item.isLocked ? <Lock size={14} color="#10B981" /> : <Unlock size={14} />}</button>
                      <button aria-label="Copiar" onClick={(e) => { e.stopPropagation(); handleCopyHex(item.id, item.hex); }} className="touch-target" style={{ background: 'transparent', border: 'none', padding: '0.2rem', color: copiedColorId === item.id ? '#10B981' : 'var(--text-main)', cursor: 'pointer' }}>{copiedColorId === item.id ? <Check size={14} /> : <Copy size={14} />}</button>
                      <button aria-label="Eliminar" onClick={(e) => { e.stopPropagation(); removeColor(item.id); }} className="touch-target" style={{ background: 'transparent', border: 'none', padding: '0.2rem', color: 'var(--text-main)', cursor: 'pointer' }}><Trash2 size={14} color="var(--danger)" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Export Modal */}
      {exportModalOpen && (
        <div className="modal-overlay" onClick={() => setExportModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>{t('modal.export.title')}</h3>
              <button onClick={() => setExportModalOpen(false)} className="dt-btn dt-btn-ghost dt-btn-sm">✕</button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {['css', 'tailwind', 'json', 'scss'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`dt-btn dt-btn-sm ${exportFormat === fmt ? 'dt-btn-primary' : 'dt-btn-secondary'}`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>

              <textarea
                readOnly
                rows={10}
                value={getExportCode()}
                className="dt-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', whiteSpace: 'pre' }}
              />

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getExportCode());
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="dt-btn dt-btn-primary"
                >
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                  {copiedCode ? t('modal.export.copied') : t('modal.export.copy')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Mapping Modal */}
      {previewModalOpen && (
        <div className="modal-overlay" onClick={() => setPreviewModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>{t('modal.preview.title')}</h3>
              <button onClick={() => setPreviewModalOpen(false)} className="dt-btn dt-btn-ghost dt-btn-sm">✕</button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {t('modal.preview.desc')}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'bgMain', label: t('modal.preview.bgMain') },
                  { key: 'bgSurface', label: t('modal.preview.bgSurface') },
                  { key: 'accent', label: t('modal.preview.accent') },
                  { key: 'textMain', label: t('modal.preview.textMain') },
                  { key: 'textMuted', label: t('modal.preview.textMuted') },
                ].map(prop => (
                  <div key={prop.key} className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{prop.label}</span>
                    <select
                      className="dt-input"
                      style={{ width: '100%', maxWidth: '180px', flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
                      value={previewMapping[prop.key]}
                      onChange={(e) => setPreviewMapping(prev => ({ ...prev, [prop.key]: parseInt(e.target.value) }))}
                    >
                      {activePalette.map((c, i) => (
                        <option key={c.id} value={i}>Color {i + 1} ({c.hex})</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button onClick={() => setPreviewModalOpen(false)} className="dt-btn dt-btn-ghost">{t('modal.preview.cancel')}</button>
                <button
                  onClick={() => {
                    const overrides = [
                      activePalette[previewMapping.bgMain] || activePalette[0],
                      activePalette[previewMapping.bgSurface] || activePalette[0],
                      activePalette[previewMapping.accent] || activePalette[0],
                      activePalette[previewMapping.textMain] || activePalette[0],
                      activePalette[previewMapping.textMuted] || activePalette[0]
                    ];
                    setGlobalThemeOverrides(overrides);
                    setPreviewModalOpen(false);
                    showToast('Tema global aplicado (Preview)');
                  }}
                  className="dt-btn dt-btn-primary"
                >
                  {t('modal.preview.apply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
