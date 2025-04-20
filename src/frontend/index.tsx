import './index.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ContextFiltersProvider } from './global/contexts/ContextFiltersProvider';
import { ContextStateRunnerProvider } from './global/contexts/ContextStateRunnerProvider';
import { ContextUserDataProvider } from './global/contexts/ContextUserDataProvider';
import { App } from './app';
import { ContextGlobalDataProvider } from './global/contexts/ContextGlobalUtiLDataProvider';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ContextFiltersProvider>
      <ContextStateRunnerProvider>
        <ContextUserDataProvider>
          <ContextGlobalDataProvider>
            <App />
          </ContextGlobalDataProvider>
        </ContextUserDataProvider>
      </ContextStateRunnerProvider>
    </ContextFiltersProvider>
  </React.StrictMode>,
);
