import React, { useState, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { Image as ImageIcon, Upload, Sparkles, Copy, Check } from 'lucide-react';
import { getColorFormats } from '../../utils/colorUtils';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-2.webp';

export default function ImageExtractorModule() {
  const { setActivePalette, setActiveModule, showToast } = useAppState();
  const { t } = useI18n();
  const [imageSrc, setImageSrc] = useState(null);
  const [extractedColors, setExtractedColors] = useState([
    '#6750A4', '#D0BCFF', '#49454F', '#1C1B1F', '#E8DEF8'
  ]);
  const [hoverColor, setHoverColor] = useState(null);
  const canvasRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        processImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (src) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      const colorMap = {};
      const step = Math.floor(imageData.length / 4000) * 4;

      for (let i = 0; i < imageData.length; i += step) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1).toUpperCase()}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      const sorted = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a]);
      const top5 = sorted.slice(0, 5);
      if (top5.length > 0) {
        setExtractedColors(top5);
        showToast('Paleta extraída de la imagen');
      }
    };
    img.src = src;
  };

  const handleApplyToPalette = () => {
    const formatted = extractedColors.map((hex, idx) => ({
      id: `img-${idx}-${Date.now()}`,
      hex,
      isLocked: false,
      name: getColorFormats(hex).name,
    }));
    setActivePalette(formatted);
    setActiveModule('palette-creator');
    showToast('Paleta enviada al Creador de Paletas');
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      
      {/* Header */}
      <div className="dt-card" style={{ padding: 0 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{t('extractor.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {t('extractor.subtitle')}
        </p>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid-2" style={{ flex: 1, alignItems: 'center', margin: '0.5rem 0' }}>
        {/* Upload & Canvas Box */}
        <div className="dt-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {!imageSrc ? (
            <label style={{
              width: '100%', height: '240px', border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.75rem',
              background: 'var(--bg-main)'
            }}>
              <Upload size={32} color="var(--accent-purple)" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{t('extractor.uploadLabel')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG, WEBP</div>
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: 'var(--radius-sm)', objectFit: 'contain' }}
              />
              <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'flex-end' }}>
                <label className="dt-btn dt-btn-ghost dt-btn-sm" style={{ cursor: 'pointer', fontSize: '0.75rem' }}>
                  {t('extractor.selectBtn')}
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Extracted Swatches */}
        <div className="dt-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('extractor.extractedTitle')}</span>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${extractedColors.length}, 1fr)`, gap: '0.4rem' }}>
            {extractedColors.map((hex, idx) => {
              const fmt = getColorFormats(hex);
              return (
                <div
                  key={idx}
                  onClick={() => { navigator.clipboard.writeText(hex); showToast(`Copiado: ${hex}`); }}
                  style={{
                    background: hex, height: '70px', padding: '0.4rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    color: fmt.isDark ? '#FFF' : '#000', cursor: 'pointer',
                    fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span>{hex}</span>
                </div>
              );
            })}
          </div>

          <button onClick={handleApplyToPalette} className="dt-btn dt-btn-primary dt-btn-sm" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={14} /> {t('extractor.sendBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
