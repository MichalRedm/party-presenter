import React from 'react';
import { Link } from 'react-router-dom';
import { useParty } from '../context/PartyContext';
import { ProjectorLayout } from '../components/layout/ProjectorLayout';
import { getModuleDefinition } from '../modules/registry';

export const ProjectorPage: React.FC = () => {
  const { activeItem } = useParty();

  if (!activeItem) {
    return (
      <ProjectorLayout>
        <div className="text-center space-y-4 max-w-lg p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
          <h2 className="text-4xl font-black text-white">Party Presenter</h2>
          <p className="text-slate-400">
            Brak zaplanowanych punktów programu. Otwórz panel{' '}
            <Link to="/admin" className="text-purple-400 underline font-bold">
              /admin
            </Link>
            , aby dodać punkty programu.
          </p>
        </div>
      </ProjectorLayout>
    );
  }

  const moduleDef = getModuleDefinition(activeItem.type);
  const ProjectorComponent = moduleDef.ProjectorComponent;

  return (
    <ProjectorLayout>
      <ProjectorComponent config={activeItem.config} isActive={true} />
    </ProjectorLayout>
  );
};
