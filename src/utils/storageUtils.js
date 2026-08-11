const STORAGE_KEYS = {
  PROJECTS: 'dt_saved_projects',
  FAVORITES: 'dt_favorites',
  THEME: 'dt_theme',
  ACTIVE_PALETTE: 'dt_active_palette',
  ACTIVE_COLOR: 'dt_active_color',
  ACTIVE_FONT: 'dt_active_font',
};

export function loadStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
}

export function saveStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export { STORAGE_KEYS };
