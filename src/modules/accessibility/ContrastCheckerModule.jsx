import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { getContrastRatio } from '../../utils/colorUtils';
import { loadStoredData, saveStoredData } from '../../utils/storageUtils';
import { Check, X, RefreshCw, Sparkles } from 'lucide-react';
import { colord } from 'colord';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-4.webp';

export default function ContrastCheckerModule() {
  const { activeColor, showToast } = useAppState();
  const { t } = useI18n();
  const [textColor, setTextColor] = useState(() => loadStoredData('dt_contrast_text', '#FFFFFF'));
  const [bgColor, setBgColor] = useState(() => loadStoredData('dt_contrast_bg', activeColor));

  useEffect(() => {
    saveStoredData('dt_contrast_text', textColor);
    saveStoredData('dt_contrast_bg', bgColor);
  }, [textColor, bgColor]);

  const result = getContrastRatio(textColor, bgColor);

  const swapColors = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  const autoFixContrast = () => {
    let current = colord(textColor);
    let bg = colord(bgColor);
    let isDarkBg = bg.isDark();
    let step = 0;
    while (current.contrast(bg) < 4.5 && step < 20) {
      current = isDarkBg ? current.lighten(0.08) : current.darken(0.08);
      step++;
    }
    setTextColor(current.toHex().toUpperCase());
    showToast('Color ajustado para cumplir WCAG AA (4.5:1)');
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      
      {/* Header */}
      <div className="dt-card" style={{ padding: 0 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{t('contrast.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {t('contrast.subtitle')}
        </p>
      </div>

      {/* Main 2 Column Compact Grid */}
      <div className="grid-2" style={{ gap: '2rem', flex: 1, alignItems: 'center', margin: '0.5rem 0' }}>
        {/* Left Controls & Score */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2 flex-col-mobile" style={{ gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>{t('contrast.fg')}</label>
              <div className="flex-wrap-mobile" style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={e => setTextColor(e.target.value.toUpperCase())}
                  style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={e => setTextColor(e.target.value.toUpperCase())}
                  className="dt-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>{t('contrast.bg')}</label>
              <div className="flex-wrap-mobile" style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value.toUpperCase())}
                  style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value.toUpperCase())}
                  className="dt-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.4rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={swapColors} className="dt-btn dt-btn-secondary dt-btn-sm" style={{ flex: 1, fontSize: '0.75rem' }}>
              <RefreshCw size={12} /> {t('contrast.swap')}
            </button>
            <button onClick={autoFixContrast} className="dt-btn dt-btn-primary dt-btn-sm" style={{ flex: 1, fontSize: '0.75rem' }}>
              <Sparkles size={12} /> {t('contrast.autofix')}
            </button>
          </div>

          {/* Ratio Score & WCAG Status */}
          <div style={{ background: 'var(--bg-main)', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('contrast.score')}</span>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: result.isAA ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                {result.ratio} : 1
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem' }}>
                <span>{t('contrast.normalText')}</span>
                <strong style={{ color: result.isAA ? 'var(--success)' : 'var(--danger)' }}>{result.isAA ? t('contrast.passAA') : t('contrast.failAA')}</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem' }}>
                <span>{t('contrast.largeText')}</span>
                <strong style={{ color: result.isAALarge ? 'var(--success)' : 'var(--danger)' }}>{result.isAALarge ? t('contrast.passAA') : t('contrast.failAA')}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live UI Preview Box */}
        <div style={{
          background: bgColor, color: textColor, padding: '1.5rem',
          height: '100%', maxHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: textColor, marginBottom: '0.2rem', fontFamily: 'var(--font-heading)' }}>{t('contrast.previewTitle')}</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.4 }}>
              {t('contrast.previewText')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ background: textColor, color: bgColor, border: 'none', padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
              {t('contrast.btnPrimary')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
