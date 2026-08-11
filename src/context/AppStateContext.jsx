import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRandomPalette, getRandomHex } from '../utils/colorUtils';
import { loadStoredData, saveStoredData, STORAGE_KEYS } from '../utils/storageUtils';

const AppStateContext = createContext(null);

const DEFAULT_PROJECT = {
  id: 'proj-demo',
  name: 'Proyecto Principal',
  description: 'Diseño de marca e interfaz predeterminada',
  palettes: [],
  typography: { headingFont: 'Outfit', bodyFont: 'Inter' },
  tokens: {},
  createdAt: new Date().toISOString(),
};

export function AppStateProvider({ children }) {
  const [theme, setTheme] = useState(() => loadStoredData(STORAGE_KEYS.THEME, 'dark'));
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeColor, setActiveColor] = useState(() => loadStoredData(STORAGE_KEYS.ACTIVE_COLOR, '#8B5CF6'));
  const [activePalette, setActivePalette] = useState(() => loadStoredData(STORAGE_KEYS.ACTIVE_PALETTE, getRandomPalette(5)));
  const [activeFont, setActiveFont] = useState(() => loadStoredData(STORAGE_KEYS.ACTIVE_FONT, { heading: 'Outfit', body: 'Inter' }));
  const [savedProjects, setSavedProjects] = useState(() => loadStoredData(STORAGE_KEYS.PROJECTS, [DEFAULT_PROJECT]));
  const [activeProject, setActiveProject] = useState(DEFAULT_PROJECT);
  const [favorites, setFavorites] = useState(() => loadStoredData(STORAGE_KEYS.FAVORITES, []));
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [globalThemeOverrides, setGlobalThemeOverrides] = useState(null);

  // Sync Theme with Body DOM
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.THEME, theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  // Persist Active States
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.ACTIVE_COLOR, activeColor);
  }, [activeColor]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.ACTIVE_PALETTE, activePalette);
    if (activePalette && activePalette.length > 0 && activePalette[0].hex) {
      setActiveColor(activePalette[0].hex);
    }
  }, [activePalette]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.PROJECTS, savedProjects);
  }, [savedProjects]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      let updated;
      if (exists) {
        updated = prev.filter(f => f.id !== item.id);
        showToast('Eliminado de favoritos');
      } else {
        updated = [item, ...prev];
        showToast('Guardado en favoritos ⭐');
      }
      return updated;
    });
  };

  const addPaletteToProject = (projectId, palette) => {
    setSavedProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          palettes: [...(proj.palettes || []), palette],
        };
      }
      return proj;
    }));
    showToast('Paleta añadida al proyecto');
  };

  const createNewProject = (name, description = '') => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      description,
      palettes: [],
      typography: activeFont,
      createdAt: new Date().toISOString(),
    };
    setSavedProjects(prev => [newProj, ...prev]);
    setActiveProject(newProj);
    showToast(`Proyecto "${name}" creado`);
  };

  return (
    <AppStateContext.Provider value={{
      theme,
      toggleTheme,
      activeModule,
      setActiveModule,
      activeColor,
      setActiveColor,
      activePalette,
      setActivePalette,
      activeFont,
      setActiveFont,
      savedProjects,
      activeProject,
      setActiveProject,
      createNewProject,
      addPaletteToProject,
      favorites,
      toggleFavorite,
      searchModalOpen,
      setSearchModalOpen,
      toastMessage,
      showToast,
      globalThemeOverrides,
      setGlobalThemeOverrides,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
