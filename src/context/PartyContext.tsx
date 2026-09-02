/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { PartyState, PartyProfile, PartyScheduleItem, SyncMessage } from '../types/party';
import { loadPartyState, savePartyState, createInitialPartyState, exportPartyStateToFile } from '../services/storage';
import { getThemeById } from '../themes/presets';
import { ThemeDefinition } from '../types/theme';
import { soundEngine } from '../services/soundEngine';
import { firePartyConfetti } from '../components/effects/ConfettiOverlay';
import { CodenamesConfig } from '../types/codenames';
import { HotSeatConfig } from '../types/hotseat';
import { generateCodenamesBoard } from '../services/codenamesGenerator';

interface PartyContextValue {
  state: PartyState;
  activeProfile: PartyProfile;
  activeItem: PartyScheduleItem | null;
  activeTheme: ThemeDefinition;
  isProjector: boolean;
  // Actions
  setActiveItem: (itemId: string) => void;
  nextItem: () => void;
  prevItem: () => void;
  updateItemConfig: (itemId: string, config: Record<string, unknown>) => void;
  updateItemMetadata: (itemId: string, meta: Partial<Omit<PartyScheduleItem, 'id' | 'type' | 'config'>>) => void;
  reorderItems: (itemIds: string[]) => void;
  addItem: (item: PartyScheduleItem, index?: number) => void;
  deleteItem: (itemId: string) => void;
  setTheme: (themeId: string) => void;
  setSoundConfig: (enabled: boolean, volume: number) => void;
  triggerConfetti: (options?: { count?: number; spread?: number }) => void;
  triggerSound: (sound: 'fanfare' | 'buzzer' | 'ding' | 'drumroll' | 'tick' | 'victory' | 'click') => void;
  // Module-specific high-level actions
  codenamesAction: (itemId: string, action: 'reveal' | 'next_turn' | 'toggle_timer' | 'reset_timer' | 'new_game' | 'update_clue', payload?: { cardId?: number; clueWord?: string; clueCount?: number }) => void;
  hotseatAction: (itemId: string, action: 'draw' | 'reveal' | 'mark_used' | 'reset_used' | 'select_category', payload?: { category?: string; questionId?: string }) => void;
  // Profile & Data Management
  loadProfile: (profileId: string) => void;
  createNewProfile: (name: string) => void;
  deleteProfile: (profileId: string) => void;
  exportState: () => void;
  importState: (newState: PartyState) => void;
  resetToDefault: () => void;
}

const PartyContext = createContext<PartyContextValue | null>(null);

const CHANNEL_NAME = 'party_presenter_sync_v1';

export const PartyProvider: React.FC<{ children: React.ReactNode; isProjector?: boolean }> = ({
  children,
  isProjector = false,
}) => {
  const [state, setState] = useState<PartyState>(() => loadPartyState());
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);

  // Sync soundEngine configuration with state
  useEffect(() => {
    soundEngine.setMuted(!state.soundEnabled);
    soundEngine.setVolume(state.soundVolume);
  }, [state.soundEnabled, state.soundVolume]);

  // Persist state changes
  useEffect(() => {
    savePartyState(state);
  }, [state]);

  // Handle incoming broadcast messages
  const handleBroadcastMessage = useCallback((msg: SyncMessage) => {
    switch (msg.type) {
      case 'STATE_REPLACE':
        setState(msg.payload);
        break;

      case 'SET_ACTIVE_ITEM':
        setState(prev => {
          const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
          if (!profile) return prev;
          const updatedProfile = { ...profile, activeItemId: msg.payload.itemId, updatedAt: new Date().toISOString() };
          return {
            ...prev,
            profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
          };
        });
        break;

      case 'UPDATE_ITEM_CONFIG':
        setState(prev => {
          const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
          if (!profile) return prev;
          const updatedItems = profile.items.map(item =>
            item.id === msg.payload.itemId
              ? { ...item, config: { ...item.config, ...msg.payload.config } }
              : item
          );
          const updatedProfile = { ...profile, items: updatedItems, updatedAt: new Date().toISOString() };
          return {
            ...prev,
            profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
          };
        });
        break;

      case 'REORDER_ITEMS':
        setState(prev => {
          const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
          if (!profile) return prev;
          const itemMap = new Map(profile.items.map(i => [i.id, i]));
          const reordered = msg.payload.itemIds
            .map(id => itemMap.get(id))
            .filter((item): item is PartyScheduleItem => item !== undefined);
          const updatedProfile = { ...profile, items: reordered, updatedAt: new Date().toISOString() };
          return {
            ...prev,
            profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
          };
        });
        break;

      case 'ADD_ITEM':
        setState(prev => {
          const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
          if (!profile) return prev;
          const items = [...profile.items];
          const insertIdx = msg.payload.index ?? items.length;
          items.splice(insertIdx, 0, msg.payload.item);
          const updatedProfile = { ...profile, items, updatedAt: new Date().toISOString() };
          return {
            ...prev,
            profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
          };
        });
        break;

      case 'DELETE_ITEM':
        setState(prev => {
          const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
          if (!profile) return prev;
          const filtered = profile.items.filter(i => i.id !== msg.payload.itemId);
          let newActiveId = profile.activeItemId;
          if (newActiveId === msg.payload.itemId && filtered.length > 0) {
            newActiveId = filtered[0].id;
          }
          const updatedProfile = { ...profile, items: filtered, activeItemId: newActiveId, updatedAt: new Date().toISOString() };
          return {
            ...prev,
            profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
          };
        });
        break;

      case 'SET_THEME':
        setState(prev => {
          const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
          if (!profile) return prev;
          const updatedProfile = { ...profile, themeId: msg.payload.themeId, updatedAt: new Date().toISOString() };
          return {
            ...prev,
            profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
          };
        });
        break;

      case 'SET_SOUND_CONFIG':
        setState(prev => ({
          ...prev,
          soundEnabled: msg.payload.enabled,
          soundVolume: msg.payload.volume,
        }));
        break;

      case 'TRIGGER_CONFETTI':
        firePartyConfetti(msg.payload);
        break;

      case 'TRIGGER_SOUND':
        switch (msg.payload.sound) {
          case 'fanfare':
            soundEngine.playFanfare();
            break;
          case 'buzzer':
            soundEngine.playBuzzer();
            break;
          case 'ding':
            soundEngine.playDing();
            break;
          case 'drumroll':
            soundEngine.playDrumroll();
            break;
          case 'tick':
            soundEngine.playTick();
            break;
          case 'victory':
            soundEngine.playVictory();
            break;
          case 'click':
            soundEngine.playClick();
            break;
        }
        break;

      case 'CODENAMES_ACTION':
      case 'HOTSEAT_ACTION':
        // These are handled by their respective state update logic
        break;
    }
  }, []);

  // Initialize BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    setBroadcastChannel(channel);

    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      if (event.data) {
        handleBroadcastMessage(event.data);
      }
    };

    // Fallback localStorage sync for tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'party_presenter_state_v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(parsed);
        } catch {
          // safe ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [handleBroadcastMessage]);

  // Broadcast helper
  const broadcast = useCallback(
    (msg: SyncMessage) => {
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage(msg);
        } catch (err) {
          console.error('Broadcast post error:', err);
        }
      }
    },
    [broadcastChannel]
  );

  // Active Profile & Active Item computation
  const activeProfile = useMemo(() => {
    return state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0];
  }, [state.profiles, state.activeProfileId]);

  const activeItem = useMemo(() => {
    if (!activeProfile || !activeProfile.items.length) return null;
    return activeProfile.items.find(i => i.id === activeProfile.activeItemId) || activeProfile.items[0];
  }, [activeProfile]);

  const activeTheme = useMemo(() => {
    return getThemeById(activeProfile?.themeId || 'midnight-velvet');
  }, [activeProfile?.themeId]);

  // State mutation actions with broadcast
  const setActiveItem = useCallback(
    (itemId: string) => {
      setState(prev => {
        const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
        if (!profile) return prev;
        const updated = { ...profile, activeItemId: itemId, updatedAt: new Date().toISOString() };
        return { ...prev, profiles: prev.profiles.map(p => (p.id === profile.id ? updated : p)) };
      });
      broadcast({ type: 'SET_ACTIVE_ITEM', payload: { itemId } });
      soundEngine.playClick();
    },
    [broadcast]
  );

  const nextItem = useCallback(() => {
    if (!activeProfile || !activeProfile.items.length) return;
    const currIdx = activeProfile.items.findIndex(i => i.id === activeProfile.activeItemId);
    if (currIdx < activeProfile.items.length - 1) {
      setActiveItem(activeProfile.items[currIdx + 1].id);
    }
  }, [activeProfile, setActiveItem]);

  const prevItem = useCallback(() => {
    if (!activeProfile || !activeProfile.items.length) return;
    const currIdx = activeProfile.items.findIndex(i => i.id === activeProfile.activeItemId);
    if (currIdx > 0) {
      setActiveItem(activeProfile.items[currIdx - 1].id);
    }
  }, [activeProfile, setActiveItem]);

  const updateItemConfig = useCallback(
    (itemId: string, configUpdates: Record<string, unknown>) => {
      setState(prev => {
        const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
        if (!profile) return prev;
        const updatedItems = profile.items.map(item =>
          item.id === itemId
            ? { ...item, config: { ...item.config, ...configUpdates } }
            : item
        );
        const updatedProfile = { ...profile, items: updatedItems, updatedAt: new Date().toISOString() };
        return {
          ...prev,
          profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
        };
      });
      broadcast({ type: 'UPDATE_ITEM_CONFIG', payload: { itemId, config: configUpdates } });
    },
    [broadcast]
  );

  const updateItemMetadata = useCallback(
    (itemId: string, meta: Partial<Omit<PartyScheduleItem, 'id' | 'type' | 'config'>>) => {
      setState(prev => {
        const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
        if (!profile) return prev;
        const updatedItems = profile.items.map(item =>
          item.id === itemId ? { ...item, ...meta } : item
        );
        const updatedProfile = { ...profile, items: updatedItems, updatedAt: new Date().toISOString() };
        const newState = {
          ...prev,
          profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
        };
        broadcast({ type: 'STATE_REPLACE', payload: newState });
        return newState;
      });
    },
    [broadcast]
  );

  const reorderItems = useCallback(
    (itemIds: string[]) => {
      setState(prev => {
        const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
        if (!profile) return prev;
        const map = new Map(profile.items.map(i => [i.id, i]));
        const reordered = itemIds
          .map(id => map.get(id))
          .filter((i): i is PartyScheduleItem => i !== undefined);
        const updatedProfile = { ...profile, items: reordered, updatedAt: new Date().toISOString() };
        return {
          ...prev,
          profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
        };
      });
      broadcast({ type: 'REORDER_ITEMS', payload: { itemIds } });
    },
    [broadcast]
  );

  const addItem = useCallback(
    (item: PartyScheduleItem, index?: number) => {
      setState(prev => {
        const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
        if (!profile) return prev;
        const items = [...profile.items];
        const insertIdx = index ?? items.length;
        items.splice(insertIdx, 0, item);
        const updatedProfile = { ...profile, items, updatedAt: new Date().toISOString() };
        return {
          ...prev,
          profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
        };
      });
      broadcast({ type: 'ADD_ITEM', payload: { item, index } });
    },
    [broadcast]
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      setState(prev => {
        const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
        if (!profile) return prev;
        const filtered = profile.items.filter(i => i.id !== itemId);
        let newActiveId = profile.activeItemId;
        if (newActiveId === itemId && filtered.length > 0) {
          newActiveId = filtered[0].id;
        }
        const updatedProfile = { ...profile, items: filtered, activeItemId: newActiveId, updatedAt: new Date().toISOString() };
        return {
          ...prev,
          profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
        };
      });
      broadcast({ type: 'DELETE_ITEM', payload: { itemId } });
    },
    [broadcast]
  );

  const setTheme = useCallback(
    (themeId: string) => {
      setState(prev => {
        const profile = prev.profiles.find(p => p.id === prev.activeProfileId);
        if (!profile) return prev;
        const updatedProfile = { ...profile, themeId, updatedAt: new Date().toISOString() };
        return {
          ...prev,
          profiles: prev.profiles.map(p => (p.id === profile.id ? updatedProfile : p)),
        };
      });
      broadcast({ type: 'SET_THEME', payload: { themeId } });
    },
    [broadcast]
  );

  const setSoundConfig = useCallback(
    (enabled: boolean, volume: number) => {
      setState(prev => ({
        ...prev,
        soundEnabled: enabled,
        soundVolume: volume,
      }));
      broadcast({ type: 'SET_SOUND_CONFIG', payload: { enabled, volume } });
    },
    [broadcast]
  );

  const triggerConfetti = useCallback(
    (options?: { count?: number; spread?: number }) => {
      firePartyConfetti(options);
      broadcast({ type: 'TRIGGER_CONFETTI', payload: options });
    },
    [broadcast]
  );

  const triggerSound = useCallback(
    (sound: 'fanfare' | 'buzzer' | 'ding' | 'drumroll' | 'tick' | 'victory' | 'click') => {
      switch (sound) {
        case 'fanfare':
          soundEngine.playFanfare();
          break;
        case 'buzzer':
          soundEngine.playBuzzer();
          break;
        case 'ding':
          soundEngine.playDing();
          break;
        case 'drumroll':
          soundEngine.playDrumroll();
          break;
        case 'tick':
          soundEngine.playTick();
          break;
        case 'victory':
          soundEngine.playVictory();
          break;
        case 'click':
          soundEngine.playClick();
          break;
      }
      broadcast({ type: 'TRIGGER_SOUND', payload: { sound } });
    },
    [broadcast]
  );

  // Codenames action engine
  const codenamesAction = useCallback(
    (
      itemId: string,
      action: 'reveal' | 'next_turn' | 'toggle_timer' | 'reset_timer' | 'new_game' | 'update_clue',
      payload?: { cardId?: number; clueWord?: string; clueCount?: number }
    ) => {
      const item = activeProfile?.items.find(i => i.id === itemId);
      if (!item || item.type !== 'codenames') return;

      const currentConfig = item.config as unknown as CodenamesConfig;

      if (action === 'reveal' && payload?.cardId !== undefined) {
        const cardId = payload.cardId;
        const targetCard = currentConfig.cards.find(c => c.id === cardId);
        if (!targetCard || targetCard.revealed || currentConfig.winner) return;

        const updatedCards = currentConfig.cards.map(c =>
          c.id === cardId ? { ...c, revealed: true } : c
        );

        // Sound feedback
        if (targetCard.role === 'assassin') {
          soundEngine.playBuzzer();
        } else if (targetCard.role === currentConfig.currentTurn) {
          soundEngine.playDing();
        } else {
          soundEngine.playClick();
        }

        // Count scores
        const redScore = updatedCards.filter(c => c.role === 'red' && c.revealed).length;
        const blueScore = updatedCards.filter(c => c.role === 'blue' && c.revealed).length;
        const totalRed = updatedCards.filter(c => c.role === 'red').length;
        const totalBlue = updatedCards.filter(c => c.role === 'blue').length;

        let winner: 'red' | 'blue' | null = null;
        let assassinTriggered = false;

        if (targetCard.role === 'assassin') {
          assassinTriggered = true;
          winner = currentConfig.currentTurn === 'red' ? 'blue' : 'red';
          soundEngine.playBuzzer();
        } else if (redScore >= totalRed) {
          winner = 'red';
          soundEngine.playVictory();
          firePartyConfetti();
        } else if (blueScore >= totalBlue) {
          winner = 'blue';
          soundEngine.playVictory();
          firePartyConfetti();
        }

        // Turn change if wrong role picked
        let nextTurn = currentConfig.currentTurn;
        if (targetCard.role !== currentConfig.currentTurn && !winner) {
          nextTurn = currentConfig.currentTurn === 'red' ? 'blue' : 'red';
        }

        const newConfig: CodenamesConfig = {
          ...currentConfig,
          cards: updatedCards,
          redScore,
          blueScore,
          winner,
          assassinTriggered,
          currentTurn: nextTurn,
        };

        updateItemConfig(itemId, newConfig as unknown as Record<string, unknown>);
      } else if (action === 'next_turn') {
        const nextTurn = currentConfig.currentTurn === 'red' ? 'blue' : 'red';
        soundEngine.playDing();
        updateItemConfig(itemId, {
          ...currentConfig,
          currentTurn: nextTurn,
          timerSeconds: currentConfig.initialTimerSeconds || 90,
          currentClue: null,
        } as unknown as Record<string, unknown>);
      } else if (action === 'toggle_timer') {
        updateItemConfig(itemId, {
          ...currentConfig,
          isTimerRunning: !currentConfig.isTimerRunning,
        } as unknown as Record<string, unknown>);
      } else if (action === 'reset_timer') {
        updateItemConfig(itemId, {
          ...currentConfig,
          timerSeconds: currentConfig.initialTimerSeconds || 90,
          isTimerRunning: false,
        } as unknown as Record<string, unknown>);
      } else if (action === 'new_game') {
        const freshBoard = generateCodenamesBoard(currentConfig.customWordBank || []);
        soundEngine.playFanfare();
        updateItemConfig(itemId, freshBoard as unknown as Record<string, unknown>);
      } else if (action === 'update_clue' && payload?.clueWord) {
        updateItemConfig(itemId, {
          ...currentConfig,
          currentClue: { word: payload.clueWord, count: payload.clueCount || 1 },
        } as unknown as Record<string, unknown>);
      }
    },
    [activeProfile?.items, updateItemConfig]
  );

  // Hot Seat action engine
  const hotseatAction = useCallback(
    (
      itemId: string,
      action: 'draw' | 'reveal' | 'mark_used' | 'reset_used' | 'select_category',
      payload?: { category?: string; questionId?: string }
    ) => {
      const item = activeProfile?.items.find(i => i.id === itemId);
      if (!item || item.type !== 'hot-seat') return;

      const currentConfig = item.config as unknown as HotSeatConfig;

      if (action === 'select_category' && payload?.category !== undefined) {
        updateItemConfig(itemId, {
          ...currentConfig,
          selectedCategory: payload.category,
        } as unknown as Record<string, unknown>);
        soundEngine.playClick();
      } else if (action === 'draw') {
        // Filter eligible questions
        const filtered = currentConfig.questions.filter(q => {
          if (q.used) return false;
          if (currentConfig.selectedCategory === 'all') return true;
          return q.category.toLowerCase() === currentConfig.selectedCategory.toLowerCase();
        });

        if (filtered.length === 0) {
          soundEngine.playBuzzer();
          return;
        }

        // Random pick
        const picked = filtered[Math.floor(Math.random() * filtered.length)];
        soundEngine.playDrumroll(1.5);

        setTimeout(() => {
          soundEngine.playDing();
        }, 1500);

        updateItemConfig(itemId, {
          ...currentConfig,
          activeQuestionId: picked.id,
          questions: currentConfig.questions.map(q =>
            q.id === picked.id ? { ...q, revealed: true, drawnAt: new Date().toISOString() } : q
          ),
        } as unknown as Record<string, unknown>);
      } else if (action === 'mark_used' && payload?.questionId) {
        soundEngine.playDing();
        updateItemConfig(itemId, {
          ...currentConfig,
          questions: currentConfig.questions.map(q =>
            q.id === payload.questionId ? { ...q, used: true } : q
          ),
        } as unknown as Record<string, unknown>);
      } else if (action === 'reset_used') {
        soundEngine.playFanfare();
        updateItemConfig(itemId, {
          ...currentConfig,
          questions: currentConfig.questions.map(q => ({ ...q, used: false, revealed: false })),
          activeQuestionId: null,
        } as unknown as Record<string, unknown>);
      }
    },
    [activeProfile?.items, updateItemConfig]
  );

  // Profile Management
  const loadProfile = useCallback(
    (profileId: string) => {
      setState(prev => ({
        ...prev,
        activeProfileId: profileId,
      }));
      broadcast({
        type: 'STATE_REPLACE',
        payload: { ...state, activeProfileId: profileId },
      });
    },
    [broadcast, state]
  );

  const createNewProfile = useCallback(
    (name: string) => {
      const newProfile: PartyProfile = {
        id: `profile_${Date.now()}`,
        name: name.trim() || 'Nowa Impreza',
        date: new Date().toISOString().split('T')[0],
        themeId: 'midnight-velvet',
        items: [],
        activeItemId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setState(prev => ({
        ...prev,
        activeProfileId: newProfile.id,
        profiles: [...prev.profiles, newProfile],
      }));
    },
    []
  );

  const deleteProfile = useCallback(
    (profileId: string) => {
      setState(prev => {
        if (prev.profiles.length <= 1) return prev; // Keep at least one
        const filtered = prev.profiles.filter(p => p.id !== profileId);
        const newActiveId = prev.activeProfileId === profileId ? filtered[0].id : prev.activeProfileId;
        return {
          ...prev,
          activeProfileId: newActiveId,
          profiles: filtered,
        };
      });
    },
    []
  );

  const exportState = useCallback(() => {
    exportPartyStateToFile(state, `party_config_${activeProfile.name.toLowerCase().replace(/\s+/g, '_')}.json`);
  }, [state, activeProfile]);

  const importState = useCallback(
    (newState: PartyState) => {
      setState(newState);
      broadcast({ type: 'STATE_REPLACE', payload: newState });
    },
    [broadcast]
  );

  const resetToDefault = useCallback(() => {
    const initialState = createInitialPartyState();
    setState(initialState);
    broadcast({ type: 'STATE_REPLACE', payload: initialState });
  }, [broadcast]);

  return (
    <PartyContext.Provider
      value={{
        state,
        activeProfile,
        activeItem,
        activeTheme,
        isProjector,
        setActiveItem,
        nextItem,
        prevItem,
        updateItemConfig,
        updateItemMetadata,
        reorderItems,
        addItem,
        deleteItem,
        setTheme,
        setSoundConfig,
        triggerConfetti,
        triggerSound,
        codenamesAction,
        hotseatAction,
        loadProfile,
        createNewProfile,
        deleteProfile,
        exportState,
        importState,
        resetToDefault,
      }}
    >
      {children}
    </PartyContext.Provider>
  );
};

export function useParty(): PartyContextValue {
  const ctx = useContext(PartyContext);
  if (!ctx) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return ctx;
}
