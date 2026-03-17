# Football AI — Product Requirements Document (PRD)

**Version:** 1.0
**Datum:** 17. März 2026
**Status:** Phase 2 — UI Development
**Projekt:** FootballAI5

---

## 1. Produktvision

Football AI ist die erste KI-gestützte Mobile App, die Fußball-Fan-Diskussionen in Sekunden mit klaren Stat-Vergleichen und starken Visuals entscheidet. Die App verbindet natürliche Sprache mit Echtzeit-Fußballstatistiken und liefert visuell ansprechende Spielervergleiche, Einzelspieler-Analysen und positionsbasierte Rankings.

### 1.1 Kernproblem

Fußballfans diskutieren täglich in WhatsApp-Gruppen, auf Twitter/X, TikTok und am Stammtisch über Spieler — „Wer ist aktuell besser: Mbappé oder Kane?" — aber es gibt kein Tool, das diese Fragen sofort, visuell und datenbasiert beantwortet. ChatGPT kann zwar Fragen beantworten, liefert aber keine visuellen Stat-Vergleiche. Stat-Websites wie WhoScored oder FBref sind zu komplex für Casual-Fans.

### 1.2 Lösung

Eine Chat-basierte App, in der Fans Fragen in natürlicher Sprache stellen. Die KI versteht die Frage, holt die relevanten Statistiken und liefert das Ergebnis als visuellen Split-Screen-Vergleich oder Stat-Karte zurück — minimalistisch, intuitiv, sofort teilbar.

### 1.3 Hauptunterscheidungsmerkmal (USP)

Die visuellen Stat-Karten und Split-Screen-Vergleiche. Kein anderes Tool liefert Fußball-Statistiken so visuell aufbereitet und fanfreundlich.

---

## 2. Zielgruppe

### 2.1 Primäre Zielgruppe

Fußballfans im Alter von 16–45 Jahren, die aktiv diskutieren:
- Social-Media-Nutzer (Twitter/X, TikTok, Instagram)
- WhatsApp-Gruppen-Teilnehmer
- Stammtisch-Diskutierer
- Typische Fragen: „Wer ist aktuell besser?", „Wie war die Form der letzten 5 Spiele?"

### 2.2 Sekundäre Zielgruppe

- Fantasy-Football-Spieler, die schnelle Stat-Checks brauchen
- Casual-Fans, die Zahlen einfach erklärt haben wollen
- Content-Creator (Fußball-TikTok, YouTube, Instagram), die Visuals für ihre Inhalte nutzen

### 2.3 Bewusst ausgeschlossen

Scouts, Analysten und Vereine — die App ist kein Profi-Tool, sondern ein Fan-Tool.

---

## 3. Tech Stack

| Komponente | Technologie | Details |
|---|---|---|
| Framework | React Native + Expo | SDK 54, TypeScript |
| Database & Auth | Supabase | Projekt „Football AI", Region Frankfurt (eu-central-1), Project ID: `tttahpvwxmtyeczfbmfk` |
| Fußball-Daten | API-Football | via RapidAPI |
| KI-Layer | Claude API / GPT-4o API | Für natürliche Sprachverarbeitung und Antwort-Generierung |
| IDE | Cursor | Pro Plan, mit Claude Code Plugin |
| Sprache | TypeScript | Durchgehend im gesamten Projekt |
| Deployment | Expo Go (Dev) → App Store / Play Store (Prod) | iOS + Android |

### 3.1 Architektur-Übersicht

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   React Native   │────▶│  Supabase        │────▶│  API-Football    │
│   (Expo SDK 54)  │     │  (Edge Functions) │     │  (RapidAPI)      │
│                  │     │  (Auth)           │     │                  │
│                  │     │  (Database)       │     └──────────────────┘
│                  │     │                   │
│                  │     │                   │────▶┌──────────────────┐
└──────────────────┘     └──────────────────┘     │  Claude / GPT-4o │
                                                   │  (KI-Layer)      │
                                                   └──────────────────┘
```

**Kein separater Node.js-Backend-Server.** Alle Serverlogik läuft über Supabase Edge Functions.

---

## 4. App-Struktur & Navigation

### 4.1 Navigationsstruktur

```
App
├── Splash Screen (Opening Screen)
│
├── Tab Navigator (Bottom Tabs)
│   ├── Home Tab
│   │   ├── Home Screen (Hauptscreen)
│   │   ├── Chat Screen (Push-Navigation)
│   │   └── Player Detail Screen (Push-Navigation)
│   │
│   └── Rankings Tab
│       ├── Rankings Screen
│       └── Player Detail Screen (Push-Navigation)
│
└── Global Overlay
    └── Player Search (Dropdown über Suchleiste)
```

### 4.2 Tab-Leiste

Zwei Tabs am unteren Bildschirmrand:
- **Home** — Hauptscreen mit Chat-Eingabe und Chat-Historie
- **Rankings** — Positionsbasierte Spieler-Rankings

Design: Pill-förmige Tab-Leiste, zentriert, mit abgerundeten Ecken. Weißer Hintergrund für aktiven Tab, transparenter Hintergrund für inaktiven Tab. Text in schwarz (aktiv) und grau (inaktiv).

---

## 5. Screen-Spezifikationen

### 5.1 Splash Screen (Opening Screen)

**Zweck:** App-Branding beim Start.

**Layout:**
- Vollständig schwarzer Hintergrund
- Zentrierter Text: „Football" in hellgrauer, dünner Schrift + „AI" in weißer, fetter, kursiver Schrift
- Keine Buttons, keine weiteren Elemente
- Automatischer Übergang zum Home Screen nach 2–3 Sekunden

---

### 5.2 Home Screen

**Zweck:** Zentraler Einstiegspunkt der App. Von hier aus stellen Nutzer Fragen, starten Vergleiche und greifen auf ihre Chat-Historie zu.

**Layout (von oben nach unten):**

#### Header-Bereich
- Links: App-Logo „Football AI" (gleicher Style wie Splash Screen, aber kleiner)
- Rechts: Profilbild des Nutzers (rund, ca. 40px)

#### Spieler-Suchleiste
- Vollbreite, abgerundete Suchleiste mit Placeholder „Spieler suchen"
- Rechts in der Leiste: ein vertikaler Divider-Strich und ein runder Pfeil-Button (→) zum Bestätigen
- Hintergrund: dunkelgrau (#1C1C1E oder ähnlich)
- Bei Eingabe: Dropdown mit Suchergebnissen (siehe 5.3)

#### Begrüßungsbereich
- Fettgedruckt: „Hi {Name}"
- Darunter in grauer Schrift: „Welche Debatte beenden wir heute?"

#### Chat-Eingabefeld
- Großes, mehrzeiliges Textfeld mit Placeholder „Stelle deine Frage"
- Hintergrund: dunkelgrau, abgerundete Ecken
- Unten links im Feld: Button „+ Spieler Vergleich" (Chip/Pill-Design)
- Unten rechts im Feld: Sende-Button (runder Pfeil nach oben ↑)

#### Chat-Historie-Bereich
- Überschrift links: „Deine Chats" (fett, weiß)
- Rechts daneben: „Siehe alle" (grauer Link-Text)
- Darunter: Liste bisheriger Chats als Karten
  - Jede Karte: abgerundete Ecken, dunkelgrauer Hintergrund
  - Text: Chat-Titel (z.B. „Meisten Tore in 2026", „Vinicius vs Olise in 25/26", „Ronaldo vs Messi All Time")
  - Karten sind vertikal gestapelt mit kleinem Abstand

---

### 5.3 Spieler-Suche (Dropdown)

**Zweck:** Globale Spielersuche, erreichbar über die Suchleiste auf Home Screen und Rankings Screen.

**Verhalten:**
- Triggered durch Texteingabe in die Suchleiste
- Dropdown erscheint direkt unter der Suchleiste als Overlay über dem restlichen Content
- Hintergrund: etwas heller als der Haupthintergrund, mit dezenter Border

**Suchergebnis-Einträge:**
- Spielerbild (rund, klein)
- Spielername (fett, weiß)
- Darunter: Club-Logo + Länderflagge
- Oder: Club-Name + Land (als Text)

**Aktion bei Tap auf Spieler:** Navigation zum Player Detail Screen.

---

### 5.4 Chat Screen

**Zweck:** KI-gestützte Konversation über Spieler-Statistiken mit visuellen Stat-Karten.

**Layout:**

#### Header (gleich wie Home Screen)
- App-Logo links, Profilbild rechts
- Spieler-Suchleiste darunter

#### Chat-Bereich (scrollbar)
Nachrichten-Verlauf zwischen Nutzer und KI:

**Nutzer-Nachrichten:**
- Rechts ausgerichtet
- Dunkelgrauer Hintergrund, abgerundete Ecken
- Weißer Text

**KI-Antworten (Single Player):**
- Links ausgerichtet
- Spieler-Stat-Karte:
  - Spielerbild (rund) + Name (fett) + Club-Emoji + Länderflagge
  - Darunter: Stat-Leiste mit Key-Stats als horizontale Reihe
    - Tore, Vorlagen, Spiele, xG, Erfolgr. Dribblings (%), Rating
    - Rating hervorgehoben (grüner Hintergrund)
  - Darunter: Text-Antwort der KI
  - Darunter: Thumbs-up / Thumbs-down Icons für Feedback

**KI-Antworten (Spieler-Vergleich / Split-Screen):**
- Zwei Spieler nebeneinander:
  - Links: Spieler A — Bild, Name, Club-Emoji, Flagge
  - Rechts: Spieler B — Bild, Name, Club-Emoji, Flagge
- Darunter für jeden Spieler (zwei Spalten):
  - Tore, Vorlagen, Rating (Zeile 1)
  - xG, Erfolgr. Dribblings, Spiele (Zeile 2)
  - Rating jeweils farbig hervorgehoben (grün)
- Darunter: KI-Text-Antwort mit Fazit (z.B. „Basierend auf den Stats der letzten 5 Spiele, würde ich sagen dass **Mbappe besser ist.**")
- Thumbs-up / Thumbs-down

#### Eingabebereich (fixiert am unteren Rand)
- Textfeld: „Stelle deine Frage"
- Links unten: „+ Spieler Vergleich" Button (toggle: wenn aktiv → „✕ Spieler Vergleich")
- Rechts unten: Sende-Button (↑)

---

### 5.5 Player Detail Screen

**Zweck:** Vollständige Statistik-Übersicht eines einzelnen Spielers mit Wettbewerbsfilter.

**Layout (von oben nach unten):**

#### Spieler-Header
- Spielerbild (rund, groß, ca. 60px)
- Name: groß, fett, weiß
- Trikotnummer in einem abgerundeten Kasten (z.B. „10")
- Darunter: Club-Logo + Club-Name
- Darunter: Länderflagge + Land

#### Meta-Informationen (horizontale Reihe)
- Position (z.B. „ST")
- Alter (z.B. „27")
- Größe (z.B. „1,78")
- Starker Fuß (z.B. „Rechts")

#### Gesamtstatistik-Leiste
- Label: „In allen Wettbewerben"
- Horizontale Stat-Reihe: Tore, Vorlagen, xG, Erfolgr. Dribblings, Spiele, Rating
- Rating: grüner Badge

#### Wettbewerbs-Auswahl (Dropdown/Accordion)
- Aufklappbare Liste aller Wettbewerbe in denen der Spieler spielt
- Jeder Eintrag: Wettbewerbs-Logo + Name + Saison (z.B. „LaLiga 25/26")
- Beispiele: LaLiga 25/26, UEFA Champions League 25/26, Copa del Rey 25/26, Supercopa 25/26, WM 2026
- Bei Auswahl: Stats darunter filtern sich auf diesen Wettbewerb

#### Detaillierte Statistiken (scrollbare Liste)

**Offensive:**
- Schüsse
- Schussgenauigkeit %
- Tore
- Erwartete Tore (xG)
- Tore pro 90min
- Dribblings
- Erfolgreiche Dribblings %

**Passspiel:**
- Pässe
- Erfolgreiche Pässe %
- Vorlagen
- Erwartete Vorlagen (xA)
- Chancen kreiert
- Große Chancen kreiert

**Defensive:**
- Zweikämpfe
- Gewonnene Zweikämpfe %
- Abgefangene Bälle

**Hinweis:** Die angezeigten Statistik-Kategorien variieren je nach Position des Spielers (Stürmer, Mittelfeld, Verteidiger, Torhüter — siehe Abschnitt 7.2).

---

### 5.6 Rankings Screen

**Zweck:** Positionsbasierte Top-10-Rankings der besten Spieler nach aktueller Form.

**Layout (von oben nach unten):**

#### Header (gleich wie andere Screens)
- App-Logo + Profilbild
- Suchleiste

#### Positions-Filter
- Label: „Position"
- Horizontale Pill/Chip-Reihe mit Positionen: ST, LF, RF, MI, IV, LV, RV
- Aktiver Filter: weißer Hintergrund mit schwarzem Text (Pill-Design)
- Inaktive Filter: transparenter Hintergrund mit grauem Text

#### Rankings-Liste
- Label rechts: „Rankings"
- Liste von Spieler-Karten, nummeriert 1–10 (oder mehr)

**Spieler-Karten (collapsed):**
- Plätze 1–3: Farbverlauf-Hintergrund (rot → orange, abnehmende Intensität)
- Plätze 4+: dunkelgrauer Hintergrund
- Jede Karte zeigt:
  - Spielerbild (rund, klein)
  - Name (fett, weiß)
  - Club-Logo + Länderflagge
  - Platzierung (Nummer rechts)

**Spieler-Karte (expanded / bei Tap auf Platz 1):**
- Gleicher Farbverlauf-Hintergrund, aber vergrößert
- Zeigt Scoring-Tabelle:
  - Spalten: Kategorien, Anzahl, Faktor, Score
  - Zeilen: Tore (Anzahl × Faktor = Score), Vorlagen, Kreierte Chancen, Erfolgr. Dribblings
  - Letzte Zeile: Gesamt-Score (fett, hervorgehoben)
- Bei Tap auf Karte: Navigation zum Player Detail Screen

---

## 6. Design-System

### 6.1 Farbschema

| Element | Farbe | Hex (geschätzt) |
|---|---|---|
| Hintergrund (App) | Schwarz | `#000000` |
| Karten-Hintergrund | Dunkelgrau | `#1C1C1E` |
| Suchleiste-Hintergrund | Dunkelgrau | `#2C2C2E` |
| Primärtext | Weiß | `#FFFFFF` |
| Sekundärtext | Grau | `#8E8E93` |
| Akzent (Rating-Badge) | Grün | `#34C759` |
| Rankings Platz 1 | Rot | `#FF3B30` |
| Rankings Gradient | Rot → Orange → Transparent | `#FF3B30` → `#FF9500` → transparent |
| Tab aktiv (Hintergrund) | Weiß | `#FFFFFF` |
| Tab aktiv (Text) | Schwarz | `#000000` |
| Tab inaktiv (Text) | Grau | `#8E8E93` |

### 6.2 Typografie

| Element | Gewicht | Größe (geschätzt) |
|---|---|---|
| App-Logo „Football" | Light/Thin | 20–24px |
| App-Logo „AI" | Bold Italic | 20–24px |
| Begrüßung „Hi Name" | Bold | 24–28px |
| Section-Titel (z.B. „Deine Chats") | Bold | 18–20px |
| Spielername (Karten) | Bold | 16–18px |
| Body-Text | Regular | 14–16px |
| Stat-Label (z.B. „Tore", „Vorlagen") | Regular | 10–12px |
| Stat-Werte | Bold | 16–20px |

### 6.3 Allgemeine Design-Regeln

- **Dark Mode only** — die App hat keinen Light Mode
- **Abgerundete Ecken** — alle Karten, Buttons, Eingabefelder: border-radius ca. 12–16px
- **Minimalistisch** — viel Whitespace (bzw. Blackspace), keine überflüssigen Elemente
- **Kein Scout-Jargon** — alle Stats in fanverständlicher Sprache
- **System Font** — SF Pro (iOS) / Roboto (Android) via React Native Defaults, oder eine ähnliche saubere Sans-Serif

---

## 7. Datenmodell & Statistiken

### 7.1 Spieler-Datenobjekt

```typescript
interface Player {
  id: number;                    // API-Football Player ID
  name: string;                  // Vollständiger Name
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;           // z.B. „Frankreich"
  nationalityFlag: string;       // Flaggen-Emoji oder URL
  height: string;                // z.B. „1,78"
  preferredFoot: string;         // „Rechts" | „Links" | „Beidfüßig"
  photo: string;                 // URL zum Spielerbild
  position: PlayerPosition;
  team: {
    id: number;
    name: string;               // z.B. „Real Madrid"
    logo: string;               // URL zum Club-Logo
  };
  number: number;               // Trikotnummer
}

type PlayerPosition = 'ST' | 'LF' | 'RF' | 'MI' | 'IV' | 'LV' | 'RV' | 'TW';
```

### 7.2 Statistiken nach Position

**Offensivspieler (ST, LF, RF):**
- Tore, Assists
- xG, xA
- Chancen kreiert, Große Chancen kreiert
- Schüsse, Schüsse aufs Tor
- Dribblings, Erfolgreiche Dribblings %
- Rating

**Mittelfeld (MI):**
- Chancen kreiert
- Ballkontakte
- Assists, xA
- Progressive Aktionen (vereinfacht)
- Pässe, Erfolgreiche Pässe %
- Rating

**Defensive Spieler (IV, LV, RV):**
- Zweikämpfe gewonnen
- Interceptions / Tackles
- Klärungen
- Fehler, die zu Chancen führten
- Rating

**Torhüter (TW):**
- Paraden
- Gegentore
- Clean Sheets
- Prevented Goals (vereinfacht)
- Rating

### 7.3 Ranking-Score-Berechnung

Die Rankings basieren auf einer internen Punkte-Logik (dem User nicht direkt sichtbar, aber bei Tap auf Platz 1 einsehbar):

```
Score = (Tore × 2) + (Vorlagen × 1) + (Kreierte Chancen × 0.5) + (Erfolgr. Dribblings × 0.25)
```

Die Gewichtungsfaktoren variieren je nach Position. Diese Logik ist vereinfacht und wird nicht als „wissenschaftlich" dargestellt — es ist ein fanfreundlicher Score.

### 7.4 Zeiträume

- **Standard:** Aktuelle Form (letzte 5 Spiele)
- **Optional:** Gesamte Saison
- **Optional (Pro):** All-Time

---

## 8. KI-Layer

### 8.1 Zweck

Der KI-Layer übersetzt natürliche Sprache der Fans in strukturierte Stat-Abfragen und generiert verständliche, opinionated Antworten.

### 8.2 Sprachverarbeitung

- Kein Prompt-Zwang — Nutzer können frei formulieren wie bei ChatGPT/Gemini
- Umgangssprache wird verstanden (z.B. „Wer ist aktuell krasser?" funktioniert)
- Multi-Language-Support (mindestens Deutsch und Englisch)

### 8.3 Antwort-Typen

**Single-Player-Analyse:**
- Trigger: „Wie ist die aktuelle Form von Mbappé?"
- Output: Spieler-Stat-Karte + Text-Analyse

**Spieler-Vergleich:**
- Trigger: „Wer ist besser, Mbappé oder Kane?" / „Vergleich Mbappé Kane letzte 5 Spiele"
- Output: Split-Screen-Vergleich + Fazit-Text

**Allgemeine Fußball-Frage:**
- Trigger: „Wer hat die meisten Tore in 2026?"
- Output: Text-Antwort (ggf. mit Ranking-Verweis)

### 8.4 KI-Antwortstruktur

Die KI liefert eine Antwort bestehend aus:
1. **Visueller Block** — Stat-Karte oder Split-Screen (strukturierte Daten)
2. **Text-Block** — Natürlichsprachliche Analyse/Fazit
3. **Feedback** — Thumbs-up/Thumbs-down für die Antwort

Die KI gibt opinionated Antworten ab — sie sagt klar, wer ihrer Meinung nach besser ist, basierend auf den Daten.

---

## 9. Supabase-Datenbankschema (geplant)

### 9.1 Tabellen

**users**
- id (UUID, PK)
- email
- display_name
- avatar_url
- created_at
- subscription_tier ('free' | 'pro')

**chats**
- id (UUID, PK)
- user_id (FK → users)
- title (z.B. „Mbappe vs Kane letzte 5 Spiele")
- created_at
- updated_at

**messages**
- id (UUID, PK)
- chat_id (FK → chats)
- role ('user' | 'assistant')
- content (Text der Nachricht)
- stat_card (JSONB — strukturierte Stat-Daten für visuelle Karten)
- created_at

**player_cache**
- player_api_id (Integer, PK)
- data (JSONB — gecachte Spielerdaten von API-Football)
- last_updated (Timestamp)

### 9.2 Row Level Security (RLS)

Alle Tabellen mit RLS gesichert:
- Users sehen nur ihre eigenen Chats und Messages
- player_cache ist read-only für authentifizierte User

---

## 10. API-Integration (API-Football via RapidAPI)

### 10.1 Benötigte Endpoints

- `GET /players` — Spielersuche nach Name
- `GET /players/{id}` — Spieler-Details
- `GET /players/{id}/statistics` — Spieler-Statistiken pro Saison/Wettbewerb
- `GET /fixtures` — Spieldaten (für „letzte X Spiele")
- `GET /leagues` — Liga-Informationen

### 10.2 Caching-Strategie

- Spieler-Stammdaten: Cache für 24 Stunden
- Statistiken: Cache für 1–6 Stunden (abhängig davon ob gerade Spieltag ist)
- Wettbewerbs-Daten: Cache für 7 Tage
- Cache in Supabase `player_cache`-Tabelle

### 10.3 Rate-Limiting

API-Football hat Request-Limits je nach Plan. Die App sollte:
- Anfragen über Supabase Edge Functions bündeln
- Caching aggressiv nutzen
- Rate-Limits clientseitig tracken

---

## 11. Monetarisierung

### 11.1 Free Version (Hauptfokus)

Ziel: Maximale Nutzerzahl → Werbeumsatz

Enthalten:
- Spieler A vs. Spieler B Vergleiche
- Single-Player-Analysen
- Aktuelle Form (letzte Spiele)
- Rankings (Top 10 nach Position/Form)
- Volle Visuals

Monetarisierung:
- Native Ads (nahtlos ins Design integriert)
- Kleine Werbeflächen in Feed und Rankings
- Keine Pop-ups, kein Autoplay

### 11.2 Pro Version

Preis: 4,99 € / Monat oder 39,99 € / Jahr

Enthalten:
- Werbefrei
- Unbegrenzte Vergleiche
- Alle Zeiträume inkl. All-Time
- Erweiterte Rankings
- Schnellere Antworten (Prioritäts-Queue)

---

## 12. Entwicklungs-Roadmap

### Phase 1 — Setup & Grundlagen ✅ ABGESCHLOSSEN
- Expo-Projekt erstellt (FootballAI5, SDK 54, TypeScript)
- App läuft auf iPhone via Expo Go
- Supabase-Projekt verbunden (Frankfurt)
- Cursor IDE konfiguriert
- Supabase-Client (`lib/supabase.ts`) eingerichtet

### Phase 2 — UI & Screens (AKTUELL)
- Navigation Setup (Tab-Navigator: Home + Rankings)
- Splash Screen
- Home Screen (mit Dummy-Daten)
- Chat Screen (mit Dummy-Daten)
- Player Detail Screen (mit Dummy-Daten)
- Rankings Screen (mit Dummy-Daten)
- Spieler-Suche (Dropdown, mit Dummy-Daten)
- Globale Design-Komponenten (Stat-Karten, Split-Screen, Ranking-Cards)

### Phase 3 — Daten & KI-Integration
- API-Football Anbindung (über Supabase Edge Functions)
- Spielersuche mit echten Daten
- Stat-Abruf und -Aufbereitung
- KI-Layer Integration (Claude/GPT-4o)
- Chat-Funktionalität mit echten Antworten
- Ranking-Berechnung mit echten Daten
- Caching-System

### Phase 4 — Auth, Profile & Launch
- Supabase Auth (Email, Google, Apple Sign-In)
- User-Profile
- Chat-Persistenz (Speichern und Laden von Chats)
- Pro-Version / Subscription-System
- Native Ads Integration
- App Store / Play Store Submission
- Beta-Testing

---

## 13. Bewusst nicht im Launch (Future Features)

- Gegnerstärke-Gewichtung (wie stark waren die Gegner?)
- Heim/Auswärts-Gewichtung
- Diskussionsmodus / Argumentkarten
- Profi-Analyse-Tools
- Web-App Version
- Sponsoring von Rankings / Brand-Placements
- Creator-Kooperationen
- Sharing-Features (Stat-Karten als Bild teilen)

---

## 14. Ligen

**Technisch:** Alle von API-Football unterstützten Ligen sind verfügbar.

**Marketing-Fokus:**
- Top-5-Ligen (Premier League, La Liga, Bundesliga, Serie A, Ligue 1)
- Champions League / Europa League
- MLS
- Saudi Pro League

Kommunikation: „Auch deine Liga ist drin" als Bonus-Feature.

---

## 15. Projektstruktur (empfohlen)

```
FootballAI5/
├── app/                          # Expo Router oder Navigation
│   ├── (tabs)/                   # Tab-Navigator
│   │   ├── index.tsx             # Home Screen
│   │   └── rankings.tsx          # Rankings Screen
│   ├── chat/[id].tsx             # Chat Screen
│   └── player/[id].tsx           # Player Detail Screen
│
├── components/                   # Wiederverwendbare UI-Komponenten
│   ├── common/                   # Allgemeine Komponenten
│   │   ├── Header.tsx            # App-Header (Logo + Profilbild)
│   │   ├── SearchBar.tsx         # Spieler-Suchleiste
│   │   ├── TabBar.tsx            # Custom Tab-Leiste
│   │   └── PlayerAvatar.tsx      # Rundes Spielerbild
│   │
│   ├── chat/                     # Chat-spezifische Komponenten
│   │   ├── MessageBubble.tsx     # Chat-Nachrichten
│   │   ├── StatCard.tsx          # Single-Player Stat-Karte
│   │   ├── ComparisonCard.tsx    # Split-Screen Vergleich
│   │   ├── ChatInput.tsx         # Eingabefeld mit Vergleich-Toggle
│   │   └── FeedbackButtons.tsx   # Thumbs up/down
│   │
│   ├── rankings/                 # Rankings-spezifische Komponenten
│   │   ├── PositionFilter.tsx    # Positions-Pill-Filter
│   │   ├── RankingCard.tsx       # Ranking-Eintrag
│   │   └── RankingCardExpanded.tsx # Expandierte Scoring-Tabelle
│   │
│   └── player/                   # Player-Detail-Komponenten
│       ├── PlayerHeader.tsx      # Spieler-Kopfbereich
│       ├── StatOverview.tsx      # Gesamtstatistik-Leiste
│       ├── CompetitionPicker.tsx # Wettbewerbs-Dropdown
│       └── DetailedStats.tsx     # Ausführliche Stat-Liste
│
├── lib/                          # Utility & Konfiguration
│   ├── supabase.ts               # Supabase Client (existiert bereits)
│   ├── api-football.ts           # API-Football Wrapper
│   └── ai.ts                     # KI-Layer (Claude/GPT-4o)
│
├── hooks/                        # Custom React Hooks
│   ├── usePlayer.ts
│   ├── useChat.ts
│   └── useRankings.ts
│
├── types/                        # TypeScript Typen
│   ├── player.ts
│   ├── chat.ts
│   └── stats.ts
│
├── constants/                    # Konstanten
│   ├── colors.ts                 # Farbschema
│   ├── dummyData.ts              # Dummy-Daten für Phase 2
│   └── positions.ts              # Positions-Mapping
│
├── assets/                       # Statische Assets
│   └── images/
│
└── PRD.md                        # Dieses Dokument
```

---

## 16. Dummy-Daten für Phase 2

Da in Phase 2 noch keine API-Anbindung erfolgt, werden alle Screens mit realistischen Dummy-Daten befüllt. Die Dummy-Daten sollten in `constants/dummyData.ts` zentralisiert werden.

### Beispiel-Spieler für Dummy-Daten:

**Kylian Mbappé:**
- Team: Real Madrid, Nummer: 10, Position: ST, Alter: 27, Größe: 1,78, Fuß: Rechts, Land: Frankreich
- Stats (Saison): 30 Tore, 7 Vorlagen, 28 xG, 56.4% Dribblings, 25 Spiele, Rating 7.90
- Stats (letzte 5): 8 Tore, 1 Vorlage, Rating 8.50

**Harry Kane:**
- Team: Bayern München, Nummer: 9, Position: ST, Alter: 32, Größe: 1,88, Fuß: Rechts, Land: England
- Stats (letzte 5): 5 Tore, 2 Vorlagen, Rating 7.00

### Beispiel-Chats:
- „Meisten Tore in 2026"
- „Vinicius vs Olise in 25/26"
- „Ronaldo vs Messi All Time"

### Beispiel-Rankings (ST):
1. Kylian Mbappé (Score: 152)
2. Harry Kane
3–10: Platzhalter-Spieler

---

## 17. Nicht-funktionale Anforderungen

- **Performance:** App soll flüssig laufen auf iPhones ab iPhone 11 und vergleichbaren Android-Geräten
- **Offline:** Grundlegende Navigation funktioniert offline, Daten werden gecacht
- **Barrierefreiheit:** Grundlegendes Accessibility-Support (Labels, Kontraste)
- **Sprache:** App-UI initial auf Deutsch, KI-Antworten in der Sprache der Frage
- **Ladezeiten:** Stat-Karten sollten innerhalb von 2–3 Sekunden laden

---

*Dieses Dokument ist die zentrale Referenz für die Entwicklung von Football AI. Bei jedem neuen Feature oder Screen: zuerst die PRD konsultieren.*
