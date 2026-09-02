import React from 'react';

export interface ModuleDefinition<TConfig = Record<string, unknown>> {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultConfig: TConfig;
  ProjectorComponent: React.FC<{
    config: TConfig;
    isActive: boolean;
    onAction?: (action: string, payload?: unknown) => void;
  }>;
  AdminEditorComponent: React.FC<{
    config: TConfig;
    onChange: (updatedConfig: TConfig) => void;
  }>;
  AdminRemoteComponent?: React.FC<{
    config: TConfig;
    onChange: (updatedConfig: TConfig) => void;
    onAction?: (action: string, payload?: unknown) => void;
  }>;
  SpymasterComponent?: React.FC<{
    config: TConfig;
  }>;
}

export type ModuleRegistry = Record<string, ModuleDefinition<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
