import React from 'react';
import ReactDOM from 'react-dom/client';

import '@styles/popup/index.scss';
import MainPopup from '@/components/popup/MainPopup';

const rootElement = document.getElementById('second-view-popup-root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <MainPopup />
  </React.StrictMode>
);
