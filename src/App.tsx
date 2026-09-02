import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PartyProvider } from './context/PartyContext';
import { ProjectorPage } from './pages/ProjectorPage';
import { AdminPage } from './pages/AdminPage';
import { SpymasterPage } from './pages/SpymasterPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PartyProvider>
        <Routes>
          <Route path="/" element={<ProjectorPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/spymaster" element={<SpymasterPage />} />
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PartyProvider>
    </BrowserRouter>
  );
};

export default App;
