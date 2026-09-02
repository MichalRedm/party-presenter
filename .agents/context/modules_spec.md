# Party Modules Specification

This document defines the schema, behavior, and design requirements for all built-in modules in Party Presenter.

---

## 1. `agenda` (Harmonogram / Agenda Overview)
- **Purpose**: Displays the complete party program, timeline, start times, highlights the active/upcoming item, and displays a countdown to the next event.
- **Config Schema**:
  ```ts
  interface AgendaConfig {
    showEstimatedTimes: boolean;
    showDescription: boolean;
    highlightCurrent: boolean;
    title: string;
  }
  ```

---

## 2. `text-slide` (Slajd Tekstowy / Ogłoszenie)
- **Purpose**: High-impact text slide for announcements, greetings, toasts, quotes, or instructions.
- **Config Schema**:
  ```ts
  interface TextSlideConfig {
    title: string;
    subtitle: string;
    body: string;
    tag?: string;
    backgroundImage?: string;
    bgOpacity: number; // 0.0 to 1.0
    textAlign: 'center' | 'left' | 'right';
  }
  ```

---

## 3. `slideshow` (Pokaz Zdjęć / Wspomnienia)
- **Purpose**: Photo gallery / carousel with automatic or manual transitions, captions, and zoom animations.
- **Config Schema**:
  ```ts
  interface SlideshowImage {
    id: string;
    url: string;
    caption?: string;
  }
  interface SlideshowConfig {
    images: SlideshowImage[];
    intervalSeconds: number;
    autoPlay: boolean;
    transitionEffect: 'fade' | 'slide' | 'zoom';
  }
  ```

---

## 4. `countdown` (Wielkie Odliczanie)
- **Purpose**: Large countdown timer targeting a specific time (e.g. 00:00, toast, cake arrival) with celebration fanfare when reaching zero.
- **Config Schema**:
  ```ts
  interface CountdownConfig {
    targetTime: string; // ISO or HH:mm
    label: string;
    celebrateOnZero: boolean;
    celebrationText: string;
  }
  ```

---

## 5. `codenames` (Wielka Gra w Tajniaków)
- **Purpose**: Interactive 5x5 Codenames board with Red vs Blue teams (9 vs 8 cards, 7 neutral, 1 assassin), turn timers, scores, Polish word dictionary, card flip animations, and `/spymaster` real-time sync.
- **Config Schema**:
  ```ts
  interface CodenamesCard {
    id: number;
    word: string;
    role: 'red' | 'blue' | 'neutral' | 'assassin';
    revealed: boolean;
  }
  interface CodenamesConfig {
    cards: CodenamesCard[];
    currentTurn: 'red' | 'blue';
    startingTeam: 'red' | 'blue';
    redScore: number;
    blueScore: number;
    winner?: 'red' | 'blue' | null;
    timerSeconds: number;
    isTimerRunning: boolean;
    customWordBank?: string[];
  }
  ```

---

## 6. `hot-seat` (Gorące Krzesło / Formularz Google)
- **Purpose**: Questions/challenges submitted by guests via Google Form. Features Blind Import (hides question content from host), category filtering, animated roulette/card draw, and answered status tracking.
- **Config Schema**:
  ```ts
  interface HotSeatQuestion {
    id: string;
    category: string;
    question: string;
    author?: string;
    revealed: boolean;
    used: boolean;
  }
  interface HotSeatConfig {
    questions: HotSeatQuestion[];
    categories: string[];
    selectedCategory: string; // 'all' or specific category
    activeQuestionId?: string | null;
    blindImportMode: boolean;
  }
  ```
