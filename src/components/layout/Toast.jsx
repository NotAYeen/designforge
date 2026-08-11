import React from 'react';
import { useAppState } from '../../context/AppStateContext';

export default function Toast() {
  const { toastMessage } = useAppState();

  if (!toastMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      background: 'var(--bg-card)',
      color: 'var(--text-main)',
      border: '1px solid var(--accent-purple)',
      borderRadius: 'var(--radius-md)',
      padding: '0.75rem 1.25rem',
      boxShadow: 'var(--shadow-glow)',
      zIndex: 200,
      fontWeight: '600',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      animation: 'slideUp 0.2s ease'
    }}>
      <span>{toastMessage}</span>
    </div>
  );
}
