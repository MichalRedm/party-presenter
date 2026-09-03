import { PartyState, PartyProfile } from '../types/party';
import { generateCodenamesBoard } from './codenamesGenerator';
import { HotSeatConfig } from '../types/hotseat';
import JSZip from 'jszip';
import {
  getMediaBlob,
  saveMediaBlob,
  dataUrlToBlob,
  createMediaKey,
} from './mediaStorage';

export const STORAGE_KEY = 'party_presenter_state_v1';

export function createDefaultPartyProfile(): PartyProfile {
  const codenamesConfig = generateCodenamesBoard([
    'MICHAŁ', 'URODZINY', 'TRZYDZIESTKA', 'PREZENT', 'TOAST', 'SZAMPAN', 'IMPREZA', 'WSPOMNIENIA'
  ]);

  const defaultHotSeatConfig: HotSeatConfig = {
    categories: ['Pytania o solenizanta', 'Wyzwania i zadania', 'Wspomnienia i anegdoty', 'Pytania bez cenzury', 'Głupie pytania'],
    selectedCategory: 'all',
    activeQuestionId: null,
    blindImportMode: true,
    spinDurationMs: 2500,
    questions: [
      {
        id: 'q_sample_1',
        category: 'Pytania o solenizanta',
        question: 'Jaka jest Twoja najbardziej przypałowa historia z czasów szkolnych/studenckich?',
        author: 'Anonim',
        revealed: false,
        used: false,
      },
      {
        id: 'q_sample_2',
        category: 'Wyzwania i zadania',
        question: 'Wznieś toast rymowanką wymyśloną w 15 sekund!',
        author: 'Ekipa',
        revealed: false,
        used: false,
      },
      {
        id: 'q_sample_3',
        category: 'Wspomnienia i anegdoty',
        question: 'Opowiedz o najśmieszniejszym prezencie, jaki kiedykolwiek dostałeś.',
        author: 'Gość',
        revealed: false,
        used: false,
      },
      {
        id: 'q_sample_4',
        category: 'Pytania bez cenzury',
        question: 'Gdybyś mógł cofnąć jedną decyzję z ostatnich 5 lat, co by to było?',
        author: 'Ktoś ciekawy',
        revealed: false,
        used: false,
      },
    ],
  };

  const defaultItems = [
    {
      id: 'item_agenda_start',
      title: 'Plan Imprezy',
      time: '19:00',
      durationMinutes: 15,
      type: 'agenda',
      config: {
        title: 'Harmonogram Imprezy',
        showEstimatedTimes: true,
        showDescription: true,
        highlightCurrent: true,
      },
      notes: 'Slajd powitalny z przeglądem całego programu.',
    },
    {
      id: 'item_welcome_toast',
      title: 'Wielkie Powitanie i Toast',
      time: '19:15',
      durationMinutes: 45,
      type: 'text-slide',
      config: {
        title: 'Witajcie na Imprezie!',
        subtitle: 'Rozgośćcie się, napijcie czegoś dobrego i bawcie się świetnie!',
        body: 'Dziś świętujemy, wspominamy i gramy do białego rana.\nNiech ta noc będzie niezapomniana!',
        tag: 'START IMPREZY 🎉',
        backgroundImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1920&auto=format&fit=crop',
        bgOpacity: 0.35,
        textAlign: 'center',
      },
      notes: 'Czas na pierwsze powitania i otwarcie imprezy.',
    },
    {
      id: 'item_codenames_battle',
      title: 'Wielka Gra w Tajniaków',
      time: '20:00',
      durationMinutes: 60,
      type: 'codenames',
      config: codenamesConfig as unknown as Record<string, unknown>,
      notes: 'Czerwoni vs Niebiescy. Kapitanowie patrzą na /spymaster na telefonie.',
    },
    {
      id: 'item_memories_slideshow',
      title: 'Wspomnienia i Zdjęcia',
      time: '21:00',
      durationMinutes: 30,
      type: 'slideshow',
      config: {
        images: [
          {
            id: 'img_1',
            url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1920&auto=format&fit=crop',
            caption: 'Najlepsze wspomnienia z minionych lat ✨',
          },
          {
            id: 'img_2',
            url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop',
            caption: 'Niezapomniane wyjazdy z ekipą ✈️',
          },
          {
            id: 'img_3',
            url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1920&auto=format&fit=crop',
            caption: 'Wspólne chwile, które zostaną na zawsze 🥂',
          },
        ],
        intervalSeconds: 6,
        autoPlay: true,
        transitionEffect: 'fade',
      },
      notes: 'Pokaz slajdów na projektorze.',
    },
    {
      id: 'item_hot_seat_game',
      title: 'Gorące Krzesło',
      time: '21:30',
      durationMinutes: 60,
      type: 'hot-seat',
      config: defaultHotSeatConfig as unknown as Record<string, unknown>,
      notes: 'Pytania i wyzwania od gości z Formularza Google.',
    },
    {
      id: 'item_midnight_toast',
      title: 'Wielki Toast o Północy',
      time: '23:55',
      durationMinutes: 15,
      type: 'countdown',
      config: {
        targetTime: '00:00',
        label: 'Wielkie Odliczanie do Północy 🍾',
        celebrateOnZero: true,
        celebrationText: 'STO LAT! STO LAT! 🎂🎉🥂',
      },
      notes: 'Wielki licznik i konfetti o północy.',
    },
  ];

  return {
    id: 'profile_default_party',
    name: 'Urodziny (Domyślny Program)',
    date: new Date().toISOString().split('T')[0],
    themeId: 'midnight-velvet',
    items: defaultItems,
    activeItemId: defaultItems[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createInitialPartyState(): PartyState {
  const defaultProfile = createDefaultPartyProfile();
  return {
    version: 1,
    activeProfileId: defaultProfile.id,
    profiles: [defaultProfile],
    soundEnabled: true,
    soundVolume: 0.7,
    isLiveSyncEnabled: true,
  };
}

export function loadPartyState(): PartyState {
  if (typeof window === 'undefined') return createInitialPartyState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialPartyState();

    const parsed = JSON.parse(raw) as PartyState;
    if (parsed && parsed.version === 1 && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load party state from localStorage, falling back to default:', err);
  }

  return createInitialPartyState();
}

export function savePartyState(state: PartyState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save party state to localStorage:', err);
  }
}

export function exportPartyStateToFile(state: PartyState, filename?: string): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeFilename = filename || `party_presenter_backup_${new Date().toISOString().slice(0, 10)}.json`;

  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', safeFilename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Creates an AI-friendly ZIP package (.party or .zip) containing:
 * - party.json: Clean JSON state without huge Base64 strings, referencing relative "media/..." paths
 * - media/: Raw image files (JPG, PNG, WebP) extracted from IndexedDB or converted from base64
 */
export async function exportPartyPackage(state: PartyState, filename?: string): Promise<void> {
  const zip = new JSZip();
  const mediaFolder = zip.folder('media');

  // Deep clone state to rewrite media paths for the clean export
  const cleanState: PartyState = JSON.parse(JSON.stringify(state));

  let mediaCounter = 1;
  const mediaKeyToZipPath = new Map<string, string>();

  // Helper to process and bundle an image URL
  const bundleImage = async (imgUrl: string): Promise<string> => {
    if (!imgUrl) return '';

    // If already an external URL (http/https), keep as is
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      return imgUrl;
    }

    // Check if we've already mapped this key
    if (mediaKeyToZipPath.has(imgUrl)) {
      return mediaKeyToZipPath.get(imgUrl)!;
    }

    let blob: Blob | null = null;
    let ext = 'jpg';

    if (imgUrl.startsWith('media:')) {
      blob = await getMediaBlob(imgUrl);
      if (blob) {
        if (blob.type.includes('png')) ext = 'png';
        else if (blob.type.includes('webp')) ext = 'webp';
        else if (blob.type.includes('gif')) ext = 'gif';
        else if (blob.type.includes('svg')) ext = 'svg';
      }
    } else if (imgUrl.startsWith('data:image/')) {
      try {
        const converted = dataUrlToBlob(imgUrl);
        blob = converted.blob;
        if (converted.mimeType.includes('png')) ext = 'png';
        else if (converted.mimeType.includes('webp')) ext = 'webp';
        else if (converted.mimeType.includes('gif')) ext = 'gif';
        else if (converted.mimeType.includes('svg')) ext = 'svg';
      } catch (err) {
        console.warn('Could not convert base64 image during export:', err);
      }
    }

    if (blob && mediaFolder) {
      const zipFileName = `img_${String(mediaCounter++).padStart(3, '0')}.${ext}`;
      const zipPath = `media/${zipFileName}`;
      mediaFolder.file(zipFileName, blob);
      mediaKeyToZipPath.set(imgUrl, zipPath);
      return zipPath;
    }

    return imgUrl;
  };

  // Traverse all profiles and items to replace media references with clean paths
  for (const profile of cleanState.profiles) {
    for (const item of profile.items) {
      if (item.type === 'slideshow' && item.config) {
        const cfg = item.config as { images?: Array<{ id: string; url: string; caption?: string }> };
        if (Array.isArray(cfg.images)) {
          for (const img of cfg.images) {
            if (img.url) {
              img.url = await bundleImage(img.url);
            }
          }
        }
      } else if (item.type === 'text-slide' && item.config) {
        const cfg = item.config as { backgroundImage?: string };
        if (cfg.backgroundImage) {
          cfg.backgroundImage = await bundleImage(cfg.backgroundImage);
        }
      }
    }
  }

  // Add clean party.json
  zip.file('party.json', JSON.stringify(cleanState, null, 2));

  // Generate zip blob
  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });

  // Trigger download
  const downloadAnchor = document.createElement('a');
  const safeFilename = filename || `party_package_${new Date().toISOString().slice(0, 10)}.party`;

  const downloadUrl = URL.createObjectURL(zipBlob);
  downloadAnchor.setAttribute('href', downloadUrl);
  downloadAnchor.setAttribute('download', safeFilename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}

/**
 * Imports a ZIP package (.party or .zip) or JSON file:
 * - Unpacks media assets into IndexedDB
 * - Rewrites relative 'media/...' paths to 'media:img_...' references in state
 * - Returns clean PartyState
 */
export async function importPartyPackage(file: File): Promise<PartyState> {
  const isZip = file.name.endsWith('.party') || file.name.endsWith('.zip') || file.type.includes('zip');

  if (!isZip) {
    // Treat as JSON file
    const text = await file.text();
    return importPartyStateFromJson(text);
  }

  const zip = await JSZip.loadAsync(file);
  const partyJsonFile = zip.file('party.json');

  if (!partyJsonFile) {
    throw new Error('Paczka nie zawiera wymaganego pliku konfiguracyjnego party.json');
  }

  const jsonContent = await partyJsonFile.async('string');
  const parsedState = JSON.parse(jsonContent) as PartyState;

  if (!parsedState || !parsedState.profiles || !Array.isArray(parsedState.profiles)) {
    throw new Error('Nieprawidłowy format pliku party.json w paczce.');
  }

  // Map of zip relative path (e.g. "media/img_001.jpg") to IndexedDB mediaKey ("media:img_...")
  const zipPathToMediaKey = new Map<string, string>();

  // Extract all files in media/ folder and save them into IndexedDB
  const mediaFiles = zip.file(/^media\//);
  for (const zipEntry of mediaFiles) {
    if (zipEntry.dir) continue;
    const blob = await zipEntry.async('blob');
    const mediaKey = createMediaKey('imported');
    await saveMediaBlob(mediaKey, blob);
    zipPathToMediaKey.set(zipEntry.name, mediaKey);
    // Also map without leading path or with alternative slashes
    const baseName = zipEntry.name.replace(/^media\//, '');
    zipPathToMediaKey.set(baseName, mediaKey);
  }

  // Restore media references in state
  const restoreUrl = (url?: string): string => {
    if (!url) return '';
    if (zipPathToMediaKey.has(url)) {
      return zipPathToMediaKey.get(url)!;
    }
    const cleanName = url.replace(/^(\.\/|media\/|\/media\/)/, '');
    if (zipPathToMediaKey.has(cleanName)) {
      return zipPathToMediaKey.get(cleanName)!;
    }
    return url;
  };

  for (const profile of parsedState.profiles) {
    for (const item of profile.items) {
      if (item.type === 'slideshow' && item.config) {
        const cfg = item.config as { images?: Array<{ id: string; url: string; caption?: string }> };
        if (Array.isArray(cfg.images)) {
          for (const img of cfg.images) {
            img.url = restoreUrl(img.url);
          }
        }
      } else if (item.type === 'text-slide' && item.config) {
        const cfg = item.config as { backgroundImage?: string };
        if (cfg.backgroundImage) {
          cfg.backgroundImage = restoreUrl(cfg.backgroundImage);
        }
      }
    }
  }

  return {
    ...parsedState,
    version: 1,
  };
}

export function importPartyStateFromJson(jsonStr: string): PartyState {
  const parsed = JSON.parse(jsonStr) as PartyState;
  if (!parsed || !parsed.profiles || !Array.isArray(parsed.profiles)) {
    throw new Error('Nieprawidłowy format pliku kopii zapasowej imprezy.');
  }
  return {
    ...parsed,
    version: 1,
  };
}

