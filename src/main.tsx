import { AllCommunityModule as AgChartsAllCommunityModule, ModuleRegistry as AgChartsModuleRegistry } from 'ag-charts-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

ModuleRegistry.registerModules([AllCommunityModule]);
AgChartsModuleRegistry.registerModules([AgChartsAllCommunityModule]);

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
