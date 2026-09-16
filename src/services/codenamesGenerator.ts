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
  startingTeamOverride?: 'red' | 'blue' | 'green',
  gameMode: CodenamesConfig['gameMode'] = 'standard',
  hasAssassin: boolean = true
): CodenamesConfig {
  const combinedBank = Array.from(new Set([...customWords.map(w => w.toUpperCase().trim()), ...DEFAULT_POLISH_WORD_BANK])).filter(
    w => w.length > 0
  );

  const shuffledWords = shuffleArray(combinedBank);
  const totalCards = gameMode === '3-team-epic' ? 36 : 25;
  const selectedWords = shuffledWords.slice(0, totalCards);

  // If words bank is too small, fallback
  while (selectedWords.length < totalCards) {
    selectedWords.push(`HASŁO_${selectedWords.length + 1}`);
  }

  // Determine starting team
  const availableTeams: ('red' | 'blue' | 'green')[] = gameMode === 'standard' ? ['red', 'blue'] : ['red', 'blue', 'green'];
  const startingTeam = startingTeamOverride || availableTeams[Math.floor(Math.random() * availableTeams.length)];

  let roles: CodenamesRole[] = [];

  if (gameMode === '3-team-epic') {
    // 36 cards: 10, 9, 8, neutral/assassin
    const t1 = startingTeam;
    const t2 = t1 === 'red' ? 'blue' : (t1 === 'blue' ? 'green' : 'red');
    const t3 = availableTeams.find(t => t !== t1 && t !== t2)!;
    const neutralCount = hasAssassin ? 8 : 9;
    roles = [
      ...Array(10).fill(t1),
      ...Array(9).fill(t2),
      ...Array(8).fill(t3),
      ...Array(neutralCount).fill('neutral'),
      ...(hasAssassin ? ['assassin' as CodenamesRole] : []),
    ];
  } else if (gameMode === '3-team-elegant') {
    // 25 cards: 9, 8, 7. If assassin enabled: 1 assassin, 0 neutral. If disabled: 0 assassin, 1 neutral.
    const t1 = startingTeam;
    const t2 = t1 === 'red' ? 'blue' : (t1 === 'blue' ? 'green' : 'red');
    const t3 = availableTeams.find(t => t !== t1 && t !== t2)!;
    roles = [
      ...Array(9).fill(t1),
      ...Array(8).fill(t2),
      ...Array(7).fill(t3),
      ...(hasAssassin ? ['assassin' as CodenamesRole] : ['neutral' as CodenamesRole]),
    ];
  } else {
    // standard: 9, 8. If assassin enabled: 7 neutral, 1 assassin. If disabled: 8 neutral.
    const secondTeam = startingTeam === 'red' ? 'blue' : 'red';
    const neutralCount = hasAssassin ? 7 : 8;
    roles = [
      ...Array(9).fill(startingTeam),
      ...Array(8).fill(secondTeam),
      ...Array(neutralCount).fill('neutral'),
      ...(hasAssassin ? ['assassin' as CodenamesRole] : []),
    ];
  }

  const shuffledRoles = shuffleArray(roles);

  const cards: CodenamesCard[] = selectedWords.map((word, index) => ({
    id: index,
    word,
    role: shuffledRoles[index],
    revealed: false,
  }));

  return {
    gameMode,
    hasAssassin,
    cards,
    startingTeam,
    currentTurn: startingTeam,
    redScore: 0,
    blueScore: 0,
    greenScore: gameMode === 'standard' ? undefined : 0,
    winner: null,
    assassinTriggered: false,
    eliminatedTeams: [],
    timerSeconds: 90,
    initialTimerSeconds: 90,
    isTimerRunning: false,
    customWordBank: customWords,
    currentClue: null,
  };
}
