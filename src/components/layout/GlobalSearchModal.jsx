import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Search, X, Palette, Disc, ShieldCheck, Eye, Type, Sparkles, FolderKanban, Box } from 'lucide-react';

export default function GlobalSearchModal() {
  const { searchModalOpen, setSearchModalOpen, setActiveModule, setActiveColor } = useAppState();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const toolsIndex = [
    { id: 'palette-creator', name: 'Creador de Paletas', category: 'Color', icon: Palette, keywords: ['paleta', 'colores', 'generador', 'harmony', 'random'] },
    { id: 'color-wheel', name: 'Teoría del Color & Rueda', category: 'Color', icon: Disc, keywords: ['circulo', 'cromático', 'monocromático', 'análogo', 'complementario', 'triádico'] },
    { id: 'image-extractor', name: 'Extractor de Imagen', category: 'Color', icon: Palette, keywords: ['imagen', 'extraer', 'foto', 'upload', 'dropper', 'picker'] },
    { id: 'gradients', name: 'Generador de Gradientes', category: 'Color', icon: Sparkles, keywords: ['gradiente', 'mesh', 'css', 'radial', 'linear', 'conic'] },
    { id: 'shades', name: 'Shades, Tints & Tones', category: 'Color', icon: Box, keywords: ['shades', 'tints', 'tonos', 'escala', 'oscuro', 'claro'] },
    { id: 'converter', name: 'Conversor de Color', category: 'Color', icon: Box, keywords: ['hex', 'rgb', 'hsl', 'cmyk', 'lab', 'conversor', 'transformar'] },
    { id: 'contrast', name: 'Contrast Checker (WCAG)', category: 'Accesibilidad', icon: ShieldCheck, keywords: ['contraste', 'wcag', 'aa', 'aaa', 'accesibilidad', 'ratio'] },
    { id: 'daltonism', name: 'Simulador de Daltonismo', category: 'Accesibilidad', icon: Eye, keywords: ['daltonismo', 'protanopia', 'deuteranopia', 'tritanopia', 'visión'] },
    { id: 'font-pairing', name: 'Font Pairing & Escala Tipográfica', category: 'Tipografía', icon: Type, keywords: ['fuente', 'font', 'google fonts', 'escala', 'pairing', 'tipografía'] },
    { id: 'design-system', name: 'Design Tokens & Componentes UI', category: 'UI/UX', icon: Box, keywords: ['tokens', 'css variables', 'tailwind', 'botones', 'cards', 'ui'] },
    { id: 'brand-kit', name: 'Brand Kit & Guía de Marca', category: 'Branding', icon: Sparkles, keywords: ['brand', 'marca', 'logo', 'manual', 'guidelines', 'pdf'] },
    { id: 'projects', name: 'Mis Proyectos Guardados', category: 'Gestión', icon: FolderKanban, keywords: ['proyecto', 'guardar', 'favoritos', 'historial'] },
  ];

  let filtered = toolsIndex;
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = toolsIndex.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    );
  }

  // Handle direct hex code search
  const isHexSearch = /^#?([0-9A-F]{3}){1,2}$/i.test(query.trim());

  const handleSelectTool = (id) => {
    setActiveModule(id);
    setSearchModalOpen(false);
    setQuery('');
  };

  const handleApplyHex = () => {
    let cleanHex = query.trim();
    if (!cleanHex.startsWith('#')) cleanHex = '#' + cleanHex;
    setActiveColor(cleanHex);
    setActiveModule('converter');
    setSearchModalOpen(false);
    setQuery('');
  };

  return (
    <div className="modal-overlay" onClick={() => setSearchModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={20} color="var(--accent-purple)" />
          <input
            type="text"
            placeholder="Buscar herramienta, teoría, color HEX (ej. #8B5CF6)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: 'var(--text-main)', fontSize: '1rem', outline: 'none',
              fontFamily: 'var(--font-main)'
            }}
          />
          <button onClick={() => setSearchModalOpen(false)} className="dt-btn dt-btn-ghost dt-btn-sm">
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.5rem' }}>
          {isHexSearch && (
            <div 
              onClick={handleApplyHex}
              style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-gradient-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: query.startsWith('#') ? query : '#' + query, border: '1px solid #FFF' }} />
                <span>Explorar color <strong>{query}</strong> en el Conversor & Armonías</span>
              </div>
              <span className="dt-badge dt-badge-purple">Ir a color</span>
            </div>
          )}

          {filtered.length === 0 && !isHexSearch ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No se encontraron herramientas para "{query}"
            </div>
          ) : (
            filtered.map(t => {
              const IconComp = t.icon;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTool(t.id)}
                  style={{
                    padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'background 0.15s ease',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--accent-purple)' }}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t.category}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Abrir →</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
