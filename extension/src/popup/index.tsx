import React from 'react';
import ReactDOM from 'react-dom/client';

import '@styles/popup/index.scss';
import ExtensionPopup from '@/components/popup/ExtensionPopup';

const rootElement = document.getElementById('second-view-popup-root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <ExtensionPopup />
  </React.StrictMode>
);
