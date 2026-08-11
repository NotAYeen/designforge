import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Sparkles, Download, Printer, Check, Star, Layers } from 'lucide-react';
import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-8.webp';


export default function BrandKitModule() {
  const { activeProject, activePalette, activeFont, showToast } = useAppState();
  const [brandName, setBrandName] = useState(activeProject ? activeProject.name : 'Mi Marca Profesional');
  const [tagline, setTagline] = useState('Innovación y Elegancia Digital');

  const handleExportPDF = () => {
    window.print();
    showToast('Abriendo cuadro de diálogo de impresión / PDF');
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      <div className="dt-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Brand Kit & Guía de Marca (Guidelines)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Genera automáticamente el manual de identidad de marca completo para exportación en PDF e impresión.
          </p>
        </div>

        <button onClick={handleExportPDF} className="dt-btn dt-btn-primary">
          <Printer size={16} /> Imprimir / Exportar a PDF
        </button>
      </div>

      {/* Editable Brand Inputs */}
      <div className="dt-card grid-2">
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Nombre de la Marca</label>
          <input
            type="text"
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
            className="dt-input"
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Lema / Eslogan (Tagline)</label>
          <input
            type="text"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            className="dt-input"
          />
        </div>
      </div>

      {/* Printable Brand Guidelines Page Container */}
      <div className="dt-card" style={{ background: '#FFFFFF', color: '#0F172A', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        {/* Cover Header */}
        <div style={{ borderBottom: '3px solid #0F172A', paddingBottom: '2rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', color: 'var(--accent-purple)', textTransform: 'uppercase' }}>Manual de Identidad Visual</span>
            <h1 style={{ fontSize: '3rem', color: '#0F172A', fontFamily: activeFont.heading, lineHeight: 1, marginTop: '0.5rem' }}>{brandName}</h1>
            <p style={{ fontSize: '1.1rem', color: '#64748B', marginTop: '0.5rem' }}>{tagline}</p>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>V 1.0 • DesignTools</div>
        </div>

        {/* Section 1: Color Palette */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: '#0F172A' }}>
            1. Identidad Cromática Principal
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activePalette.length}, 1fr)`, gap: '1rem' }}>
            {activePalette.map((c, i) => (
              <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: c.hex, height: '80px' }} />
                <div style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 'bold' }}>Color {i + 1}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#475569' }}>{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Typography */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: '#0F172A' }}>
            2. Sistema Tipográfico
          </h3>
          <div className="grid-2" style={{ gap: '2rem' }}>
            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 'bold' }}>ENCABEZADOS (TITLES)</div>
              <div style={{ fontSize: '1.8rem', fontFamily: activeFont.heading, fontWeight: 'bold', marginTop: '0.5rem', color: '#0F172A' }}>{activeFont.heading}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>Aa Bb Cc Dd Ee Ff Gg 1234567890</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 'bold' }}>CUERPO DE TEXTO (BODY)</div>
              <div style={{ fontSize: '1.8rem', fontFamily: activeFont.body, fontWeight: 'bold', marginTop: '0.5rem', color: '#0F172A' }}>{activeFont.body}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>Aa Bb Cc Dd Ee Ff Gg 1234567890</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
