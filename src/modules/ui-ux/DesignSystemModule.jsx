import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { Copy } from 'lucide-react';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-7.webp';

export default function DesignSystemModule() {
  const { activePalette, activeFont, activeColor, showToast } = useAppState();
  const { t } = useI18n();

  const cssVariables = `
:root {
  --font-heading: '${activeFont.heading}', sans-serif;
  --font-body: '${activeFont.body}', sans-serif;
  --color-primary: ${activePalette[0]?.hex || activeColor};
  --color-secondary: ${activePalette[1]?.hex || '#06B6D4'};
  --color-accent: ${activePalette[2]?.hex || '#EAB308'};
  --color-background: #0D0F0E;
  --color-surface: #141816;
  --color-text: #FFFFFF;
}
  `.trim();

  const handleCopyTokens = () => {
    navigator.clipboard.writeText(cssVariables);
    showToast('Tokens copiados');
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />

      {/* Header */}
      <div className="dt-card" style={{ padding: 0 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{t('design.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {t('design.subtitle')}
        </p>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid-2" style={{ gap: '2rem', flex: 1, alignItems: 'center', margin: '0.5rem 0' }}>
        {/* Left Column CSS Variables Tokens Code Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('design.cssTokens')}</span>
            <button onClick={handleCopyTokens} className="dt-btn dt-btn-primary dt-btn-sm" style={{ fontSize: '0.75rem' }}>
              <Copy size={12} /> {t('design.copyTokens')}
            </button>
          </div>
          <pre style={{
            background: 'var(--bg-main)', padding: '1rem', border: '1px solid var(--border-color)',
            fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)',
            lineHeight: 1.4, margin: 0, overflow: 'hidden'
          }}>
            {cssVariables}
          </pre>
        </div>

        {/* Right Active System Tokens Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>{t('design.primaryColors')}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {activePalette.slice(0, 3).map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => { navigator.clipboard.writeText(item.hex); showToast(`Copiado: ${item.hex}`); }}
                  title="Click para copiar"
                  style={{ flex: 1, background: item.hex, height: '42px', padding: '0.3rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: '#FFF', textShadow: '0 1px 3px #000' }}>{item.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '0.75rem 1rem', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('design.activeTypography')}</span>
            <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.85rem' }}>
              <div>Heading: <strong style={{ fontFamily: activeFont.heading }}>{activeFont.heading}</strong></div>
              <div>Body: <strong style={{ fontFamily: activeFont.body }}>{activeFont.body}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
