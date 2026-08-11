import React, { useState, Suspense, lazy } from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { I18nProvider } from './context/I18nContext';
import Dock from './components/layout/Dock';
import Header from './components/layout/Header';
import MobileSidebar from './components/layout/MobileSidebar';
import DesktopSidebar from './components/layout/DesktopSidebar';
import GlobalSearchModal from './components/layout/GlobalSearchModal';
import Toast from './components/layout/Toast';

const DashboardModule = lazy(() => import('./modules/dashboard/DashboardModule'));
const PaletteCreator = lazy(() => import('./modules/color/PaletteCreator'));
const ColorWheelModule = lazy(() => import('./modules/color/ColorWheelModule'));
const ImageExtractorModule = lazy(() => import('./modules/color/ImageExtractorModule'));
const GradientGeneratorModule = lazy(() => import('./modules/color/GradientGeneratorModule'));
const ShadesTintsModule = lazy(() => import('./modules/color/ShadesTintsModule'));
const ConverterModule = lazy(() => import('./modules/color/ConverterModule'));
const ContrastCheckerModule = lazy(() => import('./modules/accessibility/ContrastCheckerModule'));
const DaltonismSimulatorModule = lazy(() => import('./modules/accessibility/DaltonismSimulatorModule'));
const FontPairingModule = lazy(() => import('./modules/typography/FontPairingModule'));
const DesignSystemModule = lazy(() => import('./modules/ui-ux/DesignSystemModule'));
const GlassmorphismModule = lazy(() => import('./modules/composition/GlassmorphismModule'));
const BrandKitModule = lazy(() => import('./modules/branding/BrandKitModule'));
const ProjectsModule = lazy(() => import('./modules/projects/ProjectsModule'));

function MainContent() {
  const { activeModule, globalThemeOverrides } = useAppState();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDynamicStyles = () => {
    if (!globalThemeOverrides || globalThemeOverrides.length === 0) return null;
    return (
      <style>
        {`
          :root, body.light-theme, body.dark-theme {
            --bg-main: ${globalThemeOverrides[0]?.hex || 'var(--bg-main)'};
            --bg-sidebar: ${globalThemeOverrides[0]?.hex || 'var(--bg-main)'};
            --bg-surface: ${globalThemeOverrides[1]?.hex || 'var(--bg-surface)'};
            --bg-card: ${globalThemeOverrides[1]?.hex || 'var(--bg-card)'};
            --bg-input: ${globalThemeOverrides[1]?.hex || 'var(--bg-input)'};
            --accent-purple: ${globalThemeOverrides[2]?.hex || 'var(--accent-purple)'};
            --accent-pink: ${globalThemeOverrides[2]?.hex || 'var(--accent-pink)'};
            --border-highlight: ${globalThemeOverrides[2]?.hex || 'var(--border-highlight)'};
            --text-main: ${globalThemeOverrides[3]?.hex || '#FFFFFF'};
            --text-muted: ${globalThemeOverrides[4]?.hex || '#CCCCCC'};
          }
        `}
      </style>
    );
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'palette-creator':
        return <PaletteCreator />;
      case 'color-wheel':
        return <ColorWheelModule />;
      case 'image-extractor':
        return <ImageExtractorModule />;
      case 'gradients':
        return <GradientGeneratorModule />;
      case 'shades':
        return <ShadesTintsModule />;
      case 'converter':
        return <ConverterModule />;
      case 'contrast':
        return <ContrastCheckerModule />;
      case 'daltonism':
        return <DaltonismSimulatorModule />;
      case 'font-pairing':
        return <FontPairingModule />;
      case 'design-system':
        return <DesignSystemModule />;
      case 'glassmorphism':
        return <GlassmorphismModule />;
      case 'projects':
      case 'favorites':
        return <ProjectsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="app-layout">
      {getDynamicStyles()}
      <DesktopSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative' }}>
        <Header setMobileOpen={setMobileOpen} />
        <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        
        <main className="content-area">
          <div key={activeModule} className="animate-fade-in animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100%', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Cargando módulo...</div>}>
              {renderModule()}
            </Suspense>
          </div>
        </main>

        <div className="mobile-only">
          <Dock />
        </div>
      </div>

      <GlobalSearchModal />
      <Toast />
    </div>
  );
}


export default function App() {
  return (
    <AppStateProvider>
      <I18nProvider>
        <MainContent />
      </I18nProvider>
    </AppStateProvider>
  );
}
