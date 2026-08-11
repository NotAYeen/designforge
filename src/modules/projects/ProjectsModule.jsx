import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../context/I18nContext';

import ParallaxBackground from '../../components/common/ParallaxBackground';
import bgImage from '../../assets/bg-art-9.webp';

export default function ProjectsModule() {
  const { savedProjects, activeProject, setActiveProject, createNewProject, favorites, toggleFavorite, showToast } = useAppState();
  const { t } = useI18n();
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = () => {
    if (!newProjName.trim()) {
      showToast('Por favor introduce un nombre de proyecto');
      return;
    }
    createNewProject(newProjName, newProjDesc);
    setNewProjName('');
    setNewProjDesc('');
    setModalOpen(false);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedProjects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `designtools_proyectos_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Proyectos exportados a JSON');
  };

  return (
    <div className="module-container">
      <ParallaxBackground image={bgImage} />
      <div className="dt-card mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{t('projects.title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {t('projects.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleExportJSON} className="dt-btn dt-btn-secondary">
            {t('projects.exportBtn')}
          </button>
          <button onClick={() => setModalOpen(true)} className="dt-btn dt-btn-primary">
            {t('projects.newBtn')}
          </button>
        </div>
      </div>

      {/* Active Projects Grid */}
      <div className="grid-3">
        {savedProjects.map(p => {
          const isActive = activeProject && activeProject.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => { setActiveProject(p); showToast(`Proyecto activo: ${p.name}`); }}
              className="dt-card"
              style={{
                cursor: 'pointer',
                borderColor: isActive ? 'var(--accent-purple)' : undefined,
                boxShadow: isActive ? 'var(--shadow-glow)' : undefined
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.75rem' }}>
                {isActive && <span className="dt-badge dt-badge-purple">{t('projects.activeBadge')}</span>}
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{p.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
                {p.description || t('projects.noDesc')}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                {p.palettes ? p.palettes.length : 0} {t('projects.savedPalettes')}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem' }}>{t('projects.modalTitle')}</h3>
              <button onClick={() => setModalOpen(false)} className="dt-btn dt-btn-ghost dt-btn-sm">✕</button>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>{t('projects.nameLabel')}</label>
                <input
                  type="text"
                  placeholder={t('projects.namePlaceholder')}
                  value={newProjName}
                  onChange={e => setNewProjName(e.target.value)}
                  className="dt-input"
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>{t('projects.descLabel')}</label>
                <textarea
                  rows={3}
                  placeholder={t('projects.descPlaceholder')}
                  value={newProjDesc}
                  onChange={e => setNewProjDesc(e.target.value)}
                  className="dt-input"
                />
              </div>

              <button onClick={handleCreate} className="dt-btn dt-btn-primary" style={{ marginTop: '0.5rem' }}>
                {t('projects.createSubmit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
