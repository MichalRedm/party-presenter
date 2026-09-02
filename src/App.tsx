import React, { useState, useEffect } from 'react';
import { PartyProvider } from './context/PartyContext';
import { ProjectorPage } from './pages/ProjectorPage';
import { AdminPage } from './pages/AdminPage';
import { SpymasterPage } from './pages/SpymasterPage';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isProjector = currentPath === '/' || currentPath === '';
  const isAdmin = currentPath.startsWith('/admin');
  const isSpymaster = currentPath.startsWith('/spymaster');

  return (
    <PartyProvider isProjector={isProjector}>
      {isAdmin ? (
        <AdminPage />
      ) : isSpymaster ? (
        <SpymasterPage />
      ) : (
        <ProjectorPage />
      )}
    </PartyProvider>
  );
};

export default App;
