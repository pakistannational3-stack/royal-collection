import React from 'react';
import ReactDOM from 'react-dom/client';
import * as AppModule from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const App = (AppModule as any).App ?? (AppModule as any).default;
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
