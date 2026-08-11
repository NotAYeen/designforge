import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';
import { Menu, Globe, Palette, User, ChevronDown } from 'lucide-react';

export default function Header({ setMobileOpen }) {
  const { activeColor, setActiveModule } = useAppState();
  const { lang, toggleLanguage, t } = useI18n();

  return (
    <header className="app-header">
      
      {/* LEFT: Branding Pill */}
      <div className="header-pill">
        <button 
          className="dt-btn dt-btn-ghost hamburger-btn" 
          onClick={() => setMobileOpen(prev => !prev)}
          style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}
        >
          <Menu size={24} color="#FFFFFF" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', paddingRight: '0.5rem' }} onClick={() => setActiveModule('dashboard')}>
          <img 
            src={`${import.meta.env.BASE_URL}favicon.webp`} 
            alt="DesignForge Logo" 
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain' }}
          />
          <div className="desktop-only" style={{ flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', fontWeight: '400', lineHeight: 1, margin: 0 }}>DESIGNFORGE</h2>
            <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('sidebar.studio')}</span>
          </div>
        </div>
      </div>

      {/* CENTER: Empty (No search bar) */}
      <div style={{ flex: 1 }} />

      {/* RIGHT: Controls Pill */}
      <div className="header-pill" style={{ padding: '0.35rem 0.5rem' }}>
        
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="dt-btn dt-btn-ghost dt-btn-sm"
          style={{ borderRadius: '50%', padding: '0 0.5rem', height: '32px', display: 'flex', gap: '0.35rem', fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-main)' }}
        >
          <Globe size={14} /> {lang.toUpperCase()}
        </button>

        {/* Active Color Quick Indicator */}
        <div 
          onClick={() => setActiveModule('converter')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)' }}
        >
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: activeColor }} />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{activeColor}</span>
        </div>

        {/* User Profile / Projects */}
        <button 
          onClick={() => setActiveModule('projects')}
          className="dt-btn dt-btn-ghost dt-btn-sm" 
          style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <User size={14} style={{ opacity: 0.8 }} />
          <ChevronDown size={14} style={{ opacity: 0.5 }} />
        </button>
        
      </div>
    </header>
  );
}
