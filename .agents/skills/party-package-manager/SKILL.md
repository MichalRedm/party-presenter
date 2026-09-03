---
name: party-package-manager
description: Create, inspect, edit, validate, and package Party Presenter presentation files (.party / .zip bundles and party.json). Use this skill when working with birthday presentation data, preparing schedules, editing trivia/hot-seat questions, formatting slideshows, managing media assets, or importing/exporting presentations with AI assistance.
---

# Party Package Manager Skill (`party-package-manager`)

This skill defines the complete data format, file structure, module configuration schemas, and step-by-step procedures for AI agents to create, inspect, edit, and package Party Presenter presentations.

---

## 1. High-Level Package Architecture

A Party Presenter presentation can be exchanged in two formats:
1. **`.party` (or `.zip`) Bundle (Recommended)**: A standard ZIP archive containing clean JSON metadata and raw image files.
2. **`party.json`**: The standalone configuration file (can also be saved or imported directly).

### Directory & File Structure Inside `.party` / `.zip`

```text
my_birthday_event.party (standard ZIP)
├── party.json            # Pure metadata, slides, games, and presentation state (NO base64 bloat)
└── media/                # Folder containing raw binary images referenced by slides
    ├── img_001.jpg
    ├── img_002.png
    └── bg_welcome.webp
```

> [!IMPORTANT]
> **Zero Base64 in `party.json`**:
> Images in `party.json` MUST NEVER be embedded as base64 data URLs. Instead, they reference relative paths inside the archive (e.g. `"media/img_001.jpg"`), static public paths (e.g. `"/media/photo.jpg"`), or external HTTP URLs (`"https://..."`).
> This keeps `party.json` lightweight, human-readable, and 100% AI-friendly without wasting tokens or causing context overflows.

---

## 2. Complete `party.json` Specification

```json
{
  "version": 1,
  "activeProfileId": "profile_default",
  "soundEnabled": true,
  "soundVolume": 0.8,
  "isLiveSyncEnabled": true,
  "profiles": [
    {
      "id": "profile_default",
      "name": "30. Urodziny Michała",
      "date": "2026-09-05",
      "themeId": "midnight-velvet",
      "activeItemId": "item_agenda_start",
      "createdAt": "2026-09-03T18:00:00.000Z",
      "updatedAt": "2026-09-03T18:00:00.000Z",
      "items": [
        {
          "id": "item_agenda_start",
          "title": "Plan Imprezy",
          "time": "19:00",
          "durationMinutes": 15,
          "type": "agenda",
          "config": {
            "title": "Harmonogram Imprezy",
            "showEstimatedTimes": true,
            "showDescription": true,
            "highlightCurrent": true
          },
          "notes": "Slajd powitalny"
        }
      ]
    }
  ]
}
```

### Top-Level Schema (`PartyState`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `version` | `1` | Schema version constant (must be `1`). |
| `activeProfileId` | `string` | ID of the currently selected profile (matches `profiles[n].id`). |
| `soundEnabled` | `boolean` | Global sound effects toggle (`true` / `false`). |
| `soundVolume` | `number` | Global volume level from `0.0` to `1.0`. |
| `isLiveSyncEnabled`| `boolean` | Real-time BroadcastChannel sync toggle. |
| `profiles` | `PartyProfile[]` | Array of party profiles (usually at least 1). |

### Profile Schema (`PartyProfile`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique profile ID (e.g. `"profile_urodziny_30"`). |
| `name` | `string` | Human-readable title shown on the Projector & Admin (e.g. `"30. Urodziny Michała"`). |
| `date` | `string` | Date string (e.g. `"2026-09-05"`). |
| `themeId` | `string` | Theme ID preset (see Theme Registry below). |
| `activeItemId` | `string` | ID of the currently selected slide in `items`. |
| `items` | `PartyScheduleItem[]` | Chronological list of presentation items. |
| `createdAt` | `string` | ISO timestamp. |
| `updatedAt` | `string` | ISO timestamp. |

### Schedule Item Schema (`PartyScheduleItem`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique slide identifier (e.g. `"item_welcome"`, `"item_quiz"`). |
| `title` | `string` | Slide title displayed in Agenda, Admin list, and timelines. |
| `time` | `string` *(optional)* | Planned start time (e.g. `"19:00"`, `"21:30"`). |
| `durationMinutes`| `number` *(optional)* | Estimated duration in minutes (e.g. `15`, `45`). |
| `type` | `string` | Module type key: `'agenda'` \| `'text-slide'` \| `'slideshow'` \| `'countdown'` \| `'codenames'` \| `'hot-seat'`. |
| `config` | `object` | Module-specific configuration object (see Section 3). |
| `notes` | `string` *(optional)* | Private host notes visible only in the Admin panel. |

---

## 3. Module Configurations Reference

### 3.1. `agenda` (Harmonogram / Agenda Overview)
Displays the full party timeline, highlighting current & upcoming activities.
```json
{
  "type": "agenda",
  "config": {
    "title": "Harmonogram Imprezy",
    "showEstimatedTimes": true,
    "showDescription": true,
    "highlightCurrent": true
  }
}
```

### 3.2. `text-slide` (Slajd Tekstowy / Ogłoszenia / Toasty)
Fullscreen announcement or toast slide with high-contrast typography, optional badge, and ambient background.
```json
{
  "type": "text-slide",
  "config": {
    "title": "Witajcie na 30. Urodzinach!",
    "subtitle": "Cieszymy się, że jesteście z nami!",
    "body": "Rozgośćcie się, napełnijcie kieliszki i przygotujcie się na dobrą zabawę.\nO 20:00 startujemy z grami!",
    "tag": "START IMPREZY 🥂",
    "backgroundImage": "media/bg_welcome.jpg",
    "bgOpacity": 0.4,
    "bgBlur": 0,
    "textAlign": "center"
  }
}
```
* `textAlign`: `'center'` (recommended for projector), `'left'`, or `'right'`.
* `bgOpacity`: `0.05` to `1.0` (default `0.4`).
* `bgBlur`: `0` to `15` pixels.

### 3.3. `slideshow` (Pokaz Zdjęć / Wspomnienia)
Automated or manual photo memories carousel with ambient blurred backdrop.
```json
{
  "type": "slideshow",
  "config": {
    "intervalSeconds": 6,
    "autoPlay": true,
    "transitionEffect": "fade",
    "images": [
      {
        "id": "img_childhood_1",
        "url": "media/childhood_1.jpg",
        "caption": "Pierwsze kroki i rower górski 🚲 (1998)"
      },
      {
        "id": "img_trip_2",
        "url": "media/trip_2.jpg",
        "caption": "Wyprawa w Tatry z najlepszą ekipą ⛰️"
      }
    ]
  }
}
```
* `transitionEffect`: `'fade'` \| `'slide'` \| `'zoom'`.
* `images[].url`: Relative path inside `media/` (e.g. `"media/photo.jpg"`), local public path (`"/media/photo.jpg"`), or external URL.

### 3.4. `countdown` (Wielkie Odliczanie)
Big-screen countdown timer targeting a specific hour with celebratory confetti and sounds at zero.
```json
{
  "type": "countdown",
  "config": {
    "targetTime": "00:00",
    "label": "Do Wielkiego Toastu Noworocznego / Urodzinowego",
    "celebrateOnZero": true,
    "celebrationText": "STO LAT MICHAŁ! 🎉🍾"
  }
}
```
* `targetTime`: Format `"HH:mm"` (e.g. `"00:00"`, `"23:55"`) or full ISO string.

### 3.5. `codenames` (Wielka Gra w Tajniaków)
5x5 board game with 25 cards (red, blue, neutral, assassin) and synchronized Spymaster view (`/spymaster`).
```json
{
  "type": "codenames",
  "config": {
    "startingTeam": "red",
    "currentTurn": "red",
    "redScore": 0,
    "blueScore": 0,
    "winner": null,
    "assassinTriggered": false,
    "timerSeconds": 60,
    "initialTimerSeconds": 60,
    "isTimerRunning": false,
    "cards": [
      { "id": 0, "word": "SOLENIZANT", "role": "red", "revealed": false },
      { "id": 1, "word": "SZAMPAN", "role": "blue", "revealed": false },
      { "id": 2, "word": "BOMBA", "role": "assassin", "revealed": false },
      { "id": 3, "word": "PARASOL", "role": "neutral", "revealed": false }
    ],
    "customWordBank": ["MICHAŁ", "URODZINY", "SZAMPAN", "PREZENT", "IMPREZA"]
  }
}
```
* Team card counts: Starting team has 9 cards, opponent has 8 cards, 7 neutral cards, 1 assassin card (total = 25).
* Roles: `'red'` \| `'blue'` \| `'neutral'` \| `'assassin'`.

### 3.6. `hot-seat` (Gorące Krzesło / Pytania od Gości)
Guest question drawing game (Google Form import support) with random roulette spinner and category filters.
```json
{
  "type": "hot-seat",
  "config": {
    "categories": [
      "Pytania o solenizanta",
      "Wyzwania i zadania",
      "Wspomnienia i anegdoty",
      "Pytania bez cenzury"
    ],
    "selectedCategory": "all",
    "activeQuestionId": null,
    "blindImportMode": true,
    "spinDurationMs": 2500,
    "questions": [
      {
        "id": "q_1",
        "category": "Pytania o solenizanta",
        "question": "Jaka jest Twoja najbardziej przypałowa historia ze studiów?",
        "author": "Kolega z roku",
        "revealed": false,
        "used": false
      },
      {
        "id": "q_2",
        "category": "Wyzwania i zadania",
        "question": "Zatańcz Macarenę bez muzyki przez 30 sekund!",
        "author": "Anonim",
        "revealed": false,
        "used": false
      }
    ]
  }
}
```

---

## 4. Theme Registry Reference

Assign any of these preset IDs to `profiles[].themeId`:

| Theme ID | Style / Vibe | Primary Colors | Particle Effect |
| :--- | :--- | :--- | :--- |
| `midnight-velvet` *(default)* | Deep purple, indigo, starry night | Violet `#a855f7`, Gold `#eab308` | `stars` |
| `cyberpunk-neon` | Futuristic club vibe, glowing cyan & pink | Cyan `#06b6d4`, Pink `#ec4899` | `cyber` |
| `golden-glamour` | Warm anniversary luxury, black & gold | Gold `#eab308`, Orange `#f97316` | `confetti` |
| `retro-sunset` | 80s synthwave sunset, magenta & orange | Pink `#f43f5e`, Amber `#f59e0b` | `stars` |
| `emerald-luxury` | Sophisticated Gatsby emerald green & champagne | Emerald `#10b981`, Amber `#fbbf24`| `confetti` |
| `minimal-dark` | Clean modern dark presentation mode | Slate `#94a3b8`, Indigo `#818cf8` | `none` |

---

## 5. Agent Workflow: Creating & Editing Presentations

When the user asks to generate, refine, or reorganize presentation data:

### Workflow A: Working in an Unpacked Workspace (Easiest & Cleanest)
1. **Unpack / Create Workspace Folder:**
   Work inside a dedicated folder (e.g. `party_event/` or `data/`):
   ```text
   party_event/
   ├── party.json
   └── media/
       ├── photo1.jpg
       └── photo2.png
   ```
2. **Draft / Update `party.json`:**
   - Read the existing `party.json`.
   - Add new schedule items, questions, or slides using the JSON schemas above.
   - Assign images to relative paths: `"url": "media/photo1.jpg"`.
3. **Inspect Images:**
   - Verify image files exist in `media/`.
   - Ensure clean filenames without special characters or spaces.
4. **Validate Schema:**
   - Verify `activeItemId` points to an item present in `items`.
   - Verify all items have unique `id` strings.
   - Verify module configs match the exact required fields.

### Workflow B: Packaging into `.party` / `.zip`
When the user wants an importable file for the app:
* Use PowerShell or a Node script to bundle into a ZIP archive:
  ```powershell
  Compress-Archive -Path "party_event\party.json", "party_event\media" -DestinationPath "my_event.party" -Force
  ```
  *(Or rename `.zip` to `.party` — Party Presenter natively accepts both extensions!)*

### Workflow C: Extracting an Existing `.party` / `.zip` Export
When the user provides an exported `.party` file from the app:
* Unpack using PowerShell:
  ```powershell
  Expand-Archive -Path "exported_file.party" -DestinationPath "unpacked_party" -Force
  ```
* Open and edit `unpacked_party/party.json`.

---

## 6. Safety & Validation Checklist for Agents

Before completing any presentation changes, ensure:
- [ ] **No Base64 Binaries in `party.json`**: All uploaded/local photos are stored in `media/` and referenced via `"media/<name>.<ext>"`.
- [ ] **Valid Module Types**: Every item `type` is one of: `'agenda'`, `'text-slide'`, `'slideshow'`, `'countdown'`, `'codenames'`, `'hot-seat'`.
- [ ] **Valid Active Item**: `activeProfile.activeItemId` exists in `activeProfile.items`.
- [ ] **Legible Projector Text**: Slide titles and messages are concise and punchy (readable from across the room).
- [ ] **Correct Codenames Balance**: 25 cards total (9 starting team, 8 second team, 7 neutral, 1 assassin).
- [ ] **Clean Polish Diacritics & Spelling**: All Polish characters (`ą, ć, ę, ł, ń, ó, ś, ź, ż`) properly encoded in UTF-8.
