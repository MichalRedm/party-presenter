import React, { useState, useEffect } from 'react';
import { PartyProvider } from './context/PartyContext';
import { ProjectorPage } from './pages/ProjectorPage';
import { AdminPage } from './pages/AdminPage';
import { SpymasterPage } from './pages/SpymasterPage';

function resolveView(): 'admin' | 'spymaster' | 'projector' {
  if (typeof window === 'undefined') return 'projector';

  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/$/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const viewParam = searchParams.get('view')?.toLowerCase();

  if (path === '/admin' || path.startsWith('/admin/') || hash === 'admin' || viewParam === 'admin') {
    return 'admin';
  }

  if (path === '/spymaster' || path.startsWith('/spymaster/') || hash === 'spymaster' || viewParam === 'spymaster') {
    return 'spymaster';
  }

  return 'projector';
}

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'admin' | 'spymaster' | 'projector'>(resolveView);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentView(resolveView());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isProjector = currentView === 'projector';

  return (
    <PartyProvider isProjector={isProjector}>
      {currentView === 'admin' ? (
        <AdminPage />
      ) : currentView === 'spymaster' ? (
        <SpymasterPage />
      ) : (
        <ProjectorPage />
      )}
    </PartyProvider>
  );
};

export default App;
