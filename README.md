# 🎉 Party Presenter (urodziny)

Interaktywna aplikacja webowa stworzona do prowadzenia i wyświetlania prezentacji multimedialnych na projektorze podczas imprez urodzinowych i okolicznościowych.

Działa w 100% w przeglądarce (offline-first), bez wymogu instalowania serwera ani baz danych. Wykorzystuje **BroadcastChannel API** do natychmiastowej synchronizacji w czasie rzeczywistym (< 1 ms) pomiędzy ekranem projektora (`/`), panelem sterowania na laptopie (`/admin`) oraz tajnym widokiem dla kapitanów w Tajniakach (`/spymaster`).

---

## 🚀 Szybki Start

```bash
# 1. Instalacja zależności
npm install

# 2. Uruchomienie serwera deweloperskiego
npm run dev
```

Po uruchomieniu przejdź pod adres:
- **`http://localhost:5173/`** – Widok na projektor (pełny ekran, naciśnij `F` lub `F11`)
- **`http://localhost:5173/admin`** – Panel administracyjny i pilot sterowania
- **`http://localhost:5173/spymaster`** – Tajny podgląd kart dla kapitanów w grze w Tajniaków (można otworzyć na telefonie)

---

## 🎯 Główne Moduły i Funkcje

| Moduł | Identyfikator | Opis |
| :--- | :--- | :--- |
| **Harmonogram (Agenda)** | `agenda` | Przegląd całego programu imprezy, estymowane godziny, wyróżnienie aktualnego punktu. |
| **Slajd Tekstowy** | `text-slide` | Tytuł, podtytuł, treść, etykieta oraz **obsługa zdjęcia w tle z suwakami przezroczystości i rozmycia**. |
| **Pokaz Zdjęć** | `slideshow` | Galeria wspomnień z automatycznym lub ręcznym przewijaniem i podpisami. |
| **Wielkie Odliczanie** | `countdown` | Wielki stoper odliczający do danej godziny (np. 00:00 / toast) z dźwiękowym odliczaniem, fanfarą i konfetti. |
| **Wielka Gra w Tajniaków** | `codenames` | Siatka 5x5 (25 kart), podział Czerwoni vs Niebiescy, obrót kart 3D, stoper, punktacja, polski słownik (250+ słów) oraz edytor własnych haseł. |
| **Gorące Krzesło** | `hot-seat` | Losowanie pytań/wyzwań od gości z Formularza Google, ruletka losowania, **Tryb Ślepego Importu** (chroniący niespodziankę). |

---

## 📝 Instrukcja Formularza Google dla „Gorącego Krzesła”

Utwórz formularz w Google Forms z następującymi polami:
1. **`Kategoria`** (Wybór jednokrotny lub lista rozwijana):
   - Np.: *Pytania o solenizanta*, *Wyzwania i zadania*, *Wspomnienia i anegdoty*, *Pytania bez cenzury*, *Głupie pytania*.
2. **`Treść pytania / wyzwania`** (Długa odpowiedź tekstowa / Paragraf) - wymagane.
3. **`Autor / Podpis`** (Krótka odpowiedź) - opcjonalne.

**Import do aplikacji:**
- W arkuszu Google Sheets powiązanym z formularzem kliknij *Plik ➔ Pobierz ➔ Wartości rozdzielane przecinkami (.csv)* i wgraj plik w panelu admina, lub po prostu zaznacz i skopiuj całą tabelę i wklej w polu importu.
- **Tryb Ślepego Importu**: Solenizant widzi jedynie liczbę zaimportowanych pytań per kategoria, bez zdradzania treści!

---

## ⌨️ Skróty Klawiszowe na Projektorze

| Klawisz | Akcja |
| :--- | :--- |
| `Spacja` / `Strzałka w prawo` / `PageDown` | Następny punkt programu |
| `Strzałka w lewo` / `PageUp` | Poprzedni punkt programu |
| `F` / `F11` | Włącz / Wyłącz tryb pełnoekranowy |
| `C` | Wystrzel wielokolorowe konfetti 🎉 |
| `M` | Wycisz / Włącz syntezator dźwięków 🔊 |
| `T` | Zmień motyw wizualny (Midnight, Cyberpunk, Gold, Retro, Emerald, Minimal) 🎨 |
| `H` | Wyświetl okno pomocy ze skrótami |

---

## 🧩 Dodawanie Nowych Modułów i Motywów

### Nowy Moduł:
1. Utwórz katalog w `src/modules/twoj-modul/`.
2. Zaimplementuj komponenty `ProjectorComponent` i `AdminEditorComponent`.
3. Zarejestruj moduł w `src/modules/registry.ts`.

### Nowy Motyw:
1. Otwórz `src/themes/presets.ts`.
2. Dodaj nowy obiekt z kolorami gradientu, tokenami CSS i rodzajem cząsteczek tła do tablicy `THEMES`.

---

## 🛠️ Polecenia Budowania

```bash
# Typecheck i kompilacja produkcyjna
npm run build

# Walidacja lintera
npm run lint

# Podgląd wersji produkcyjnej
npm run preview
```
