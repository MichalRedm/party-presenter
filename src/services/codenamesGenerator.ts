import { CodenamesCard, CodenamesRole, CodenamesConfig } from '../types/codenames';

export const DEFAULT_POLISH_WORD_BANK: string[] = [
  'IMPREZA', 'TORT', 'SZAMPAN', 'PREZENT', 'TOAST', 'MUZYKA', 'PARKIET', 'DJ',
  'BALON', 'KONFETTI', 'ŚWIECA', 'NIESPODZIANKA', 'KLUB', 'KOKTAJL', 'KARAOKE', 'TAŃCE',
  'KOMPAS', 'LUSTRO', 'ZAMEK', 'PIRAMIDA', 'KORONA', 'DIAMENT', 'SZPIEG', 'MASKA',
  'APARAT', 'FOTO', 'PRZEBRANIE', 'KAPELUSZ', 'WINO', 'PÓŁNOC', 'GWIAZDA', 'OGIEŃ',
  'PODRÓŻ', 'SAMOLOT', 'STATEK', 'WYSPA', 'PLAŻA', 'GÓRY', 'LAS', 'RZEKA',
  'PIZZA', 'CZEKOLADA', 'KAWA', 'HERBATA', 'CYTRYNA', 'TRUSKAWKA', 'LODY', 'BURGER',
  'TELEFON', 'INTERNET', 'EKRAN', 'KAMERA', 'MIKROFON', 'GŁOŚNIK', 'KONSOLA', 'GRA',
  'KINO', 'FILM', 'OSCAR', 'SCENA', 'AKTOR', 'TEATR', 'BILET', 'POPCORN',
  'KSIĄŻKA', 'LIST', 'PIÓRO', 'TAJEMNICA', 'ZAGADKA', 'KLUCZ', 'SEJF', 'SKARB',
  'KOT', 'PIES', 'WILK', 'LEW', 'TYGRYS', 'ORZEŁ', 'SOKÓŁ', 'DELFIN',
  'KOSMOS', 'KSIĘŻYC', 'SŁOŃCE', 'RAKIETA', 'PLANETA', 'KOMETA', 'SATELITA', 'ASTRONAUTA',
  'SAMOCHÓD', 'MOTOR', 'ROWER', 'POCIĄG', 'METRO', 'HELM', 'SILNIK', 'RADAR',
  'DOKTOR', 'SZPITAL', 'APTEKA', 'SERCE', 'PULS', 'MIŁOŚĆ', 'ŚMIECH', 'RADOŚĆ',
  'POLICJA', 'DETEKTYW', 'LUPA', 'ŚLAD', 'ALIBI', 'AGENCJA', 'MISJA', 'SZYFR',
  'ZŁOTO', 'SREBRO', 'BRĄZ', 'MEDAL', 'PUCHAR', 'REKORD', 'STADION', 'BRAMKA',
  'DESZCZ', 'ŚNIEG', 'BURZA', 'TĘCZA', 'CHMURA', 'WIATR', 'LÓD', 'WULKAN',
  'GITARA', 'PIANINO', 'PERKUSJA', 'SKRZYPCE', 'NUTY', 'KONCERT', 'FESTIWAL', 'SCENARIUSZ',
  'ZEGARY', 'MINUTA', 'SEKUNDA', 'GODZINA', 'WIEK', 'PRZESZŁOŚĆ', 'PRZYSZŁOŚĆ', 'CHWILA',
  'RODZINA', 'PRZYJACIELE', 'EKIPA', 'GOŚCIE', 'TOASTMASTER', 'KRÓL', 'KRÓLOWA', 'VIP',
];

/**
 * Fisher-Yates array shuffle
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a brand new 5x5 Codenames board configuration
 */
export function generateCodenamesBoard(
  customWords: string[] = [],
  startingTeamOverride?: 'red' | 'blue'
): CodenamesConfig {
  const combinedBank = Array.from(new Set([...customWords.map(w => w.toUpperCase().trim()), ...DEFAULT_POLISH_WORD_BANK])).filter(
    w => w.length > 0
  );

  const shuffledWords = shuffleArray(combinedBank);
  const selectedWords = shuffledWords.slice(0, 25);

  // If words bank is too small, fallback
  while (selectedWords.length < 25) {
    selectedWords.push(`HASŁO_${selectedWords.length + 1}`);
  }

  // Determine starting team
  const startingTeam: 'red' | 'blue' = startingTeamOverride || (Math.random() > 0.5 ? 'red' : 'blue');
  const secondTeam: 'red' | 'blue' = startingTeam === 'red' ? 'blue' : 'red';

  // Role distribution: 9 for starter, 8 for second, 7 neutral, 1 assassin
  const roles: CodenamesRole[] = [
    ...Array(9).fill(startingTeam),
    ...Array(8).fill(secondTeam),
    ...Array(7).fill('neutral'),
    'assassin',
  ];

  const shuffledRoles = shuffleArray(roles);

  const cards: CodenamesCard[] = selectedWords.map((word, index) => ({
    id: index,
    word,
    role: shuffledRoles[index],
    revealed: false,
  }));

  return {
    cards,
    startingTeam,
    currentTurn: startingTeam,
    redScore: 0,
    blueScore: 0,
    winner: null,
    assassinTriggered: false,
    timerSeconds: 90,
    initialTimerSeconds: 90,
    isTimerRunning: false,
    customWordBank: customWords,
    currentClue: null,
  };
}
