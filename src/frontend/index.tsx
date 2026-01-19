import './index.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ContextFiltersProvider } from './global/contexts/ContextFiltersProvider';
import { ContextStateRunnerProvider } from './global/contexts/ContextStateRunnerProvider';
import { ContextUserDataProvider } from './global/contexts/ContextUserDataProvider';
import { App } from './app';
import { ContextGlobalDataProvider } from './global/contexts/ContextGlobalUtiLDataProvider';
import { ContextInLoadingProvider } from '@/global/contexts/ContextInLoadingProvider';
import { ContextPaginationProvider } from '@/global/contexts/ContextPaginationProvider';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ContextGlobalDataProvider>
      <ContextFiltersProvider>
        <ContextStateRunnerProvider>
          <ContextUserDataProvider>
            <ContextInLoadingProvider>
              <ContextPaginationProvider>
                <App />
              </ContextPaginationProvider>
            </ContextInLoadingProvider>
          </ContextUserDataProvider>
        </ContextStateRunnerProvider>
      </ContextFiltersProvider>
    </ContextGlobalDataProvider>
  </React.StrictMode>,
);
