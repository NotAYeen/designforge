import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { Sparkles, Copy, Download, Plus, Trash2, Check } from 'lucide-react';
import manRight from '../../assets/layer-man-right.webp';

export default function GradientGeneratorModule() {
  const { activeColor, showToast } = useAppState();
  const { t } = useI18n();
  const [gradientType, setGradientType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { id: 1, color: '#8B5CF6', pos: 0 },
    { id: 2, color: '#3B82F6', pos: 50 },
    { id: 3, color: '#06B6D4', pos: 100 },
  ]);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  const getGradientCSS = () => {
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    const stopStr = sorted.map(s => `${s.color} ${s.pos}%`).join(', ');
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopStr})`;
    } else if (gradientType === 'radial') {
      return `radial-gradient(circle at center, ${stopStr})`;
    } else if (gradientType === 'conic') {
      return `conic-gradient(from ${angle}deg at 50% 50%, ${stopStr})`;
    }
    return `linear-gradient(${angle}deg, ${stopStr})`;
  };

  const handleAddStop = () => {
    if (stops.length >= 6) {
      showToast('Máximo 6 paradas de color');
      return;
    }
    setStops(prev => [
      ...prev,
      { id: Date.now(), color: activeColor, pos: 75 }
    ]);
  };

  const handleRemoveStop = (id) => {
    if (stops.length <= 2) {
      showToast('Mínimo 2 paradas de color');
      return;
    }
    setStops(prev => prev.filter(s => s.id !== id));
  };

  const updateStop = (id, key, val) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));
  };

  const handleCopyCSS = () => {
    const code = `background: ${getGradientCSS()};`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Código CSS de gradiente copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="module-container"
      onMouseMove={handleMouseMove}
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
            backgroundImage: `url(${manRight})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom',
            mixBlendMode: 'lighten', opacity: 0.25,
            transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
            transition: 'transform 0.1s ease-out'
          }} />
        </div>
      </div>

      <div className="dt-card">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{t('gradients.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {t('gradients.subtitle')}
        </p>
      </div>

      <div className="grid-2">
        {/* Left Live Preview Box */}
        <div className="dt-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>{t('gradients.previewTitle')}</h3>

          <div style={{
            flex: 1, minHeight: '260px', borderRadius: 'var(--radius-md)',
            background: getGradientCSS(), boxShadow: 'var(--shadow-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', color: '#FFF', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 'bold' }}>
              DesignTools Gradient
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem', display: 'block' }}>{t('gradients.codeLabel')}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                readOnly
                value={`background: ${getGradientCSS()};`}
                className="dt-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              />
              <button onClick={handleCopyCSS} className="dt-btn dt-btn-primary dt-btn-sm">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="dt-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              {t('gradients.typeLabel')}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['linear', 'radial', 'conic'].map(tType => (
                <button
                  key={tType}
                  onClick={() => setGradientType(tType)}
                  className={`dt-btn dt-btn-sm ${gradientType === tType ? 'dt-btn-primary' : 'dt-btn-secondary'}`}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                >
                  {tType === 'linear' ? t('gradients.typeLinear') : tType === 'radial' ? t('gradients.typeRadial') : t('gradients.typeConic')}
                </button>
              ))}
            </div>
          </div>

          {gradientType !== 'radial' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                <span>{t('gradients.angleLabel')}</span>
                <span>{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={e => setAngle(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{t('gradients.stopsLabel')} ({stops.length})</span>
              <button onClick={handleAddStop} className="dt-btn dt-btn-ghost dt-btn-sm">
                <Plus size={14} /> {t('gradients.addStop')}
              </button>
            </div>

            <div className="flex-col-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stops.map(s => (
                <div key={s.id} className="flex-wrap-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <input
                    type="color"
                    value={s.color}
                    onChange={e => updateStop(s.id, 'color', e.target.value.toUpperCase())}
                    style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={s.color}
                    onChange={e => updateStop(s.id, 'color', e.target.value.toUpperCase())}
                    className="dt-input"
                    style={{ flex: 1, padding: '0.3rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={s.pos}
                    onChange={e => updateStop(s.id, 'pos', Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', flex: 1 }}>{s.pos}%</span>
                  <button onClick={() => handleRemoveStop(s.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
