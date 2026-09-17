# Football AI — PRD (Technischer Spec)

**Version:** 2.0
**Stand:** 26. Juli 2026
**Phase:** Phase 2, UI und Screens mit Dummy-Daten
**Repo:** github.com/azizayub/FootballAI

> [!info] Scope dieses Dokuments
> Diese PRD ist der technische Anker für Claude Code. Sie beschreibt Tech Stack, Screens, Datenmodell, Design-System, Datenquellen und Konventionen. Business-Kontext (Zielgruppe, Monetarisierung, Markt, Roadmap, Moat) lebt in Obsidian und ist die Single Source of Truth für alles Strategische.
>
> **Business-Kontext:** siehe Obsidian `Football AI/Business Model.md`
> **Kostenlogik und Sportmonks-Kalkulation:** siehe Obsidian `Football AI/Kostenstruktur.md` und `Datenstruktur.md`
> **Entwicklungs-Stack im Detail:** siehe Obsidian `Football AI/App Entwickelung.md`

---

## 1. Produkt in einem Satz

Football AI ist eine Mobile App (iOS und Android), in der Fußballfans in natürlicher Sprache Fragen zu Spielern stellen und Antworten als visuelle Stat-Karten, Split-Screen-Vergleiche und positionsbasierte Rankings bekommen. Kernprinzipien: Fan first, Mobile first, Visual first, MVP first.

Ausführliche Positionierung und USP siehe Obsidian `Business Model`.

---

## 2. Tech Stack

| Komponente | Technologie | Details |
|---|---|---|
| Framework | React Native + Expo | SDK 54, TypeScript |
| Navigation | Expo Router | File-based Routing |
| IDE | VS Code | mit Claude Code als Haupt-Coding-Assistent |
| Backend | Supabase | Region Frankfurt (`eu-central-1`), Project ID `tttahpvwxmtyeczfbmfk` |
| Fußball-Daten | Sportmonks | via REST API, Zugriff über Supabase Edge Functions |
| KI-Layer | Claude Haiku | via Anthropic API, Zugriff über Supabase Edge Functions |
| Auth | Supabase Auth | Email, Google, Apple Sign-In (Phase 4) |
| Sprache | TypeScript | im gesamten Projekt |
| Builds | Expo EAS | Cloud Builds für iOS und Android |
| Deployment | Expo Go (Dev) → TestFlight → App Store / Play Store | iOS zuerst, Android parallel |
| Git | GitHub | Repo `github.com/azizayub/FootballAI` |

> [!important] Wichtige Entscheidungen
> - Cursor wurde durch VS Code plus Claude Code ersetzt.
> - API-Football wurde durch Sportmonks ersetzt (Begründung siehe Obsidian `Datenstruktur.md`).
> - GPT-4o wurde durch Claude Haiku ersetzt (Kosteneffizienz bei hohem Anfragevolumen).
> - **Kein separater Node.js Backend-Server.** Alle Serverlogik läuft über Supabase Edge Functions.

### 2.1 Architektur-Übersicht

```
┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│   React Native   │────▶│  Supabase         │────▶│  Sportmonks API  │
│   (Expo SDK 54)  │     │  Edge Functions   │     │                  │
│                  │     │  Auth             │     └──────────────────┘
│                  │     │  Postgres         │
│                  │     │  player_cache     │────▶┌──────────────────┐
└──────────────────┘     └───────────────────┘     │  Claude Haiku    │
                                                    │  (Anthropic API) │
                                                    └──────────────────┘
```

---

## 3. Projektstruktur

```
FootballAI/
├── app/                          # Expo Router
│   ├── _layout.tsx               # Root Stack
│   ├── index.tsx                 # Splash Screen
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Custom Bottom Tab Bar
│   │   ├── index.tsx             # Home Screen
│   │   └── rankings.tsx          # Rankings Screen
│   ├── chat/[id].tsx             # Chat Screen (Single + Vergleich)
│   └── player/[id].tsx           # Player Detail Screen
│
├── components/
│   ├── common/
│   │   ├── Header.tsx            # App-Header (Logo + Profilbild)
│   │   ├── SearchBar.tsx         # Spieler-Suchleiste + Dropdown
│   │   ├── TabBar.tsx            # Custom Bottom-Tab-Leiste
│   │   └── PlayerAvatar.tsx      # Rundes Spielerbild
│   │
│   ├── chat/
│   │   ├── MessageBubble.tsx     # User- und AI-Nachrichten
│   │   ├── StatCard.tsx          # Single-Player Stat-Karte
│   │   ├── ComparisonCard.tsx    # Split-Screen Vergleich
│   │   ├── RadarChart.tsx        # Attributsranking (6 Achsen, Perzentile)
│   │   ├── ChatInput.tsx         # Eingabefeld mit „+ Spieler Vergleich" Toggle
│   │   └── FeedbackButtons.tsx   # Thumbs up / down
│   │
│   ├── rankings/
│   │   ├── PositionFilter.tsx    # Positions-Pill-Filter
│   │   ├── RankingCard.tsx       # Ranking-Eintrag (collapsed)
│   │   └── RankingCardExpanded.tsx # Score-Tabelle bei Tap auf Rang
│   │
│   └── player/
│       ├── PlayerHeader.tsx      # Spieler-Kopfbereich
│       ├── StatOverview.tsx      # „In allen Wettbewerben"-Karte
│       ├── CompetitionPicker.tsx # Wettbewerbs-Dropdown/Accordion
│       └── DetailedStats.tsx     # Stat-Gruppen (Offensive, Passspiel, Defensive)
│
├── lib/
│   ├── supabase.ts               # Supabase Client (Phase 1 fertig)
│   ├── sportmonks.ts             # Sportmonks Wrapper (Phase 3)
│   └── ai.ts                     # Claude-Haiku-Layer (Phase 3)
│
├── hooks/
│   ├── usePlayer.ts
│   ├── useChat.ts
│   └── useRankings.ts
│
├── types/
│   ├── player.ts
│   ├── chat.ts
│   └── stats.ts
│
├── constants/
│   ├── colors.ts                 # siehe §6
│   ├── theme.ts                  # Typografie und Radii
│   ├── positions.ts              # PlayerPosition-Mapping
│   └── dummyData.ts              # Dummy-Daten für Phase 2
│
├── assets/
│   └── images/
│
└── PRD.md                        # dieses Dokument
```

---

## 4. Navigation

```
App
├── Splash Screen
│
├── Tab Navigator (Bottom Tabs)
│   ├── Home Tab
│   │   ├── Home Screen
│   │   ├── Chat Screen (Push)
│   │   └── Player Detail Screen (Push)
│   │
│   └── Rankings Tab
│       ├── Rankings Screen
│       └── Player Detail Screen (Push)
│
└── Global Overlay
    └── Spieler-Suche (Dropdown über Suchleiste)
```

Bottom-Tab-Bar: pill-förmig, zentriert am unteren Rand. Aktiver Tab: weißer Hintergrund, schwarzer Text. Inaktiver Tab: transparent, grauer Text.

---

## 5. Screen-Spezifikationen

### 5.1 Splash Screen

Schwarzer Vollhintergrund. Zentriert: „Football" in hellgrauer dünner Schrift, „AI" in weißer fetter kursiver Schrift. Kein Interaktion. Auto-Übergang zum Home Screen nach 2 bis 3 Sekunden.

### 5.2 Home Screen

Header (Logo links, Profilbild rechts). Darunter Spieler-Suchleiste (Placeholder „Spieler suchen", vertikaler Divider, runder Pfeil-Button rechts). Bei Eingabe öffnet sich Dropdown (siehe 5.3).

Darunter Begrüßungsbereich: „Hi {Name}" in weißer fetter Schrift, darunter „Welche Debatte beenden wir heute?" in grauer Schrift.

Darunter das große Chat-Eingabefeld (mehrzeilig, Placeholder „Stelle deine Frage"). Unten links im Feld: Chip-Button „+ Spieler Vergleich". Unten rechts: Send-Button (runder Pfeil nach oben).

Darunter „Deine Chats" (weiße fette Überschrift) mit „Siehe alle"-Link rechts. Darunter vertikale Liste bisheriger Chats als abgerundete Karten mit Chat-Titel.

### 5.3 Spieler-Suche (Dropdown-Overlay)

Getriggert durch Texteingabe in die Suchleiste (Home und Rankings). Erscheint als Overlay direkt unter der Suchleiste, leicht heller Hintergrund als Base, dezente Border, Rest der Seite leicht unscharf.

Jeder Eintrag: Rundes Spielerbild links, Spielername (fett weiß) rechts, darunter Club-Logo plus Länderflagge.

Tap auf Eintrag → Navigation zum Player Detail Screen.

### 5.4 Chat Screen

Fixierter Header (gleich wie Home). Suchleiste darunter. Chat-Bereich scrollbar. Fixiertes Eingabefeld unten (identisch zum Home-Chat-Feld, plus Toggle-Zustand für „+ Spieler Vergleich" wird zu „✕ Spieler Vergleich" wenn aktiv).

**User-Nachrichten:** rechts ausgerichtet, dunkelgrauer Hintergrund, abgerundete Ecken, weißer Text.

**AI-Antwort Single Player:** links ausgerichtet. Spieler-Stat-Karte mit rundem Bild, Name (fett), Club-Emoji, Länderflagge. Darunter horizontale Stat-Leiste: Tore, Vorlagen, Spiele, xG, Erfolgr. Dribblings %, Rating (Rating als grüner Badge). Darunter Text-Antwort der KI. Darunter Feedback-Icons (Thumbs up / down).

**Follow-up-Fragen im Single-Player-Chat:** Multi-Turn wird unterstützt. Der User kann direkt eine Folge-Frage stellen („Kannst du mir sagen wie viele Chancen er kreiert hat und wie viele Ballkontakte er hat?"). Die AI antwortet dann ohne erneute Stat-Karte, nur mit Text-Antwort und Feedback-Icons. Kontext des aktuellen Spielers bleibt erhalten für die gesamte Session, bis der User explizit einen neuen Spieler sucht oder in einen Vergleich wechselt.

**AI-Antwort Spieler-Vergleich (Split-Screen):** Header oben zeigt Chip „Spieler A vs Spieler B". Zwei Spieler nebeneinander, je Bild, Name, Club-Emoji, Flagge. Darunter pro Spieler kompakte Stat-Grid in zwei Zeilen: Zeile 1 Tore, Vorlagen, Rating; Zeile 2 xG, Erfolgr. Dribblings, Spiele. Rating jeweils grüner Badge.

Unter der Split-Screen-Karte folgt Verdict-Text (opinionated Fazit der KI, z. B. „Basierend auf den Stats der letzten 5 Spiele, würde ich sagen dass **Mbappe besser ist.**"), darunter Feedback-Icons.

Bei Nachfrage nach mehr Details („Kannst du mir mehr Details geben?") wird zusätzlich das **Attributsranking (Radar/Spider Chart)** gerendert (siehe 5.4.1).

#### 5.4.1 Attributsranking (Radar/Spider Chart)

Sechseckiges Radar-Chart auf schwarzem Karten-Hintergrund. Titel oben links: „Attributsranking". Untertitel: „Perzentil-Vergleich (letzte 5 Spiele)".

**6 Achsen (positionsspezifisch, Beispiel für Offensivspieler):**
- Ballkontakte
- Herausgespielte Chancen
- Gewonnene Luftkämpfe
- Defensive Aktionen
- Tore
- Schuss-Versuche

Für andere Positionen (OM, DM, IV, LV, RV, TW) werden die 6 Achsen entsprechend gewechselt. Mapping siehe §7.2.

**Rendering:**
- Achsen als graue gepunktete Linien
- Spieler A: blaues Polygon (`#3B82F6`), Punkte blau
- Spieler B: rotes Polygon (`#EF4444`), Punkte rot
- Beide Polygone semi-transparent gefüllt
- Werte auf jeder Achse: `{Perzentil A}% · {Perzentil B}%` in Blau und Rot

Perzentil bezieht sich auf alle Spieler derselben Position in derselben Liga. Standard-Zeitraum letzte 5 Spiele.

### 5.5 Player Detail Screen

**Spieler-Header:** Rundes Bild (ca. 60 px), Name groß fett, Trikotnummer im abgerundeten Kasten rechts. Darunter Club-Logo plus Club-Name. Darunter Länderflagge plus Land.

**Meta-Reihe:** Position, Alter, Größe, Starker Fuß (horizontal nebeneinander mit Labels).

**Gesamtstatistik-Karte:** Label „In allen Wettbewerben". Horizontale Stat-Leiste: Tore, Vorlagen, xG, Erfolgr. Dribblings, Spiele, Rating (Rating als grüner Badge).

**Wettbewerbs-Auswahl (Accordion):** Aufklappbare Liste aller Wettbewerbe des Spielers. Jeder Eintrag: Wettbewerbs-Logo plus Name plus Saison (z. B. „LaLiga 25/26", „UEFA Champions League 25/26", „Copa del Rey 25/26", „Supercopa 25/26", „WM 2026"). Bei Auswahl: alle darunter angezeigten Detail-Stats filtern sich auf diesen Wettbewerb.

**Detaillierte Statistiken (scrollbar, gruppiert):** Aufteilung nach Offensive, Passspiel, Defensive. Angezeigte Kategorien variieren je nach Position (siehe §7.2).

### 5.6 Rankings Screen

Header (gleich wie Home). Suchleiste darunter.

**Positions-Filter:** Label „Position". Darunter horizontale Pill-Reihe mit 8 Positionen in dieser Reihenfolge: **ST, LF, RF, OM, DM, IV, LV, RV**. Aktiver Filter: weißer Hintergrund, schwarzer Text. Inaktiv: transparent, grauer Text. (TW ist Post-Launch und wird im Filter erst später ergänzt.)

**Rankings-Liste:** Label rechts „Rankings". Darunter nummerierte Karten 1 bis 10.

Plätze 1 bis 3: Farbverlauf-Hintergrund (rot bei Platz 1, abnehmende Intensität rot-orange bei 2 und 3). Plätze 4+: dunkelgrauer Standard-Karten-Hintergrund. Jede Karte: kleines rundes Spielerbild, Name fett weiß, Club-Logo plus Länderflagge (bei Platz 1 bis 3) oder Club-Name plus Land (bei Platz 4+), Platzierungsnummer rechts.

**Expanded State (bei Tap auf Karte, insbesondere Platz 1):** Karte vergrößert sich, zeigt Score-Tabelle mit Spalten Kategorien, Anzahl, Faktor, Score. Zeilen: Tore, Vorlagen, Kreierte Chancen, Erfolgr. Dribblings. Letzte Zeile Gesamt-Score fett. Beispiel-Berechnung siehe §7.4.

Bei Tap auf Karten-Body: Navigation zum Player Detail Screen.

---

## 6. Design-System

> **Single Source of Truth ist die Figma-Datei „Football AI":**
> https://www.figma.com/design/FhfNURvKqq9mkpc7y2feLg/Football-AI
> Opening Screen = Node `1:9`, Home Screen = Node `1:82`. Frame-Groesse 430x932
> (iPhone 15 Pro, logische Punkte). Alle Werte unten sind aus diesen Nodes
> ausgelesen und liegen im Code in `constants/colors.ts` und `constants/theme.ts`.
> Bei Abweichungen gilt Figma, nicht diese Tabelle.

### 6.1 Farbschema (Dark Mode only)

Das Design arbeitet mit **transluzenten Weiss-Overlays auf Schwarz**, nicht mit
festen Grautoenen. Deshalb sind mehrere Werte `rgba` statt Hex.

| Element | Farbe | Figma-Node |
|---|---|---|
| Hintergrund App | `#000000` | 1:82 |
| Suchleiste | `rgba(187,187,187,0.08)` | 1:176 |
| Frage-Karte | `rgba(255,255,255,0.08)` | 1:145 |
| Chat-Karten | `#1B1B1B` | 205:4, 205:10, 216:1334 |
| Primaertext | `#FFFFFF` | — |
| Sekundaertext | `#888888` | 1:131, 1:177, 205:166 |
| Logo „Football" | `rgba(255,255,255,0.11)` | 1:17, 202:13 |
| Logo „AI" | `#FFFFFF` | 202:9, 202:14 |
| Vergleich-Pill Flaeche | `rgba(0,0,0,0.85)` | 205:865 |
| Vergleich-Pill Text | `rgba(246,246,246,0.48)` | 205:868 |
| Icon-Button (rund) | `#FFFFFF`, Glyphe `#1A1A1A` | 205:156, 205:406 |
| Tab aktiv Flaeche | `#000000`, Text `#FFFFFF` | 216:1282 |
| Tab inaktiv Text | `#1A1A1A` | 216:1283 |
| Trenner Suchleiste | `rgba(255,255,255,0.18)` | 1:178 |

Die Vergleichs- und Ranking-Farben (Blau `#3B82F6`, Rot `#EF4444`, Ranking-Rot
`#FF3B30` bis Orange `#FF9500`) sind im Figma noch nicht designt und bleiben bis
dahin als Platzhalter in `constants/colors.ts`.

### 6.2 Typografie

Das Design nutzt vier Schriften. Inter, Instrument Serif und Roboto kommen ueber
`@expo-google-fonts/*` und werden in `app/_layout.tsx` per `useFonts` geladen;
SF Pro ist die iOS-Systemschrift und faellt auf Android auf Roboto zurueck.

| Element | Schrift | Groesse |
|---|---|---|
| Logo Splash | Inter Regular / Italic | 44 px |
| Logo Header | Inter Regular / Italic | 25 px |
| Begruessung „Hi {Name}" | **Instrument Serif Italic** | 40 px |
| Unterzeile Begruessung | Inter Medium | 16 px |
| Section-Titel („Deine Chats") | Inter SemiBold | 18 px |
| Chat-Karten-Titel | Inter SemiBold | 16 px |
| Frage-Platzhalter | Inter Medium | 16 px |
| Suchleiste, „Siehe alle" | Roboto Medium | 16 px |
| Vergleich-Pill | Inter Medium | 13 px, Tracking 0.1 |
| Tab-Label | SF Pro Medium | 14 px |

### 6.3 Masse und Abstaende

> **Geraetegroesse:** Der Figma-Frame ist 430x932 pt (iPhone Pro Max). Ein
> iPhone Pro hat nur 402x874 pt — 58 pt weniger Hoehe. Der Inhalt passt dort
> nicht 1:1. Das vertikale Raster wird deshalb ueber `constants/layout.ts`
> proportional gestaucht (`v()`), groessere Geraete bleiben bei 1:1.

Die Abstaende im Figma schwanken (28/33 px Seitenrand, 18/21/31 px Innenabstand).
Im Code sind sie auf ein **4er-Raster** normalisiert — optisch identisch, aber
konsistent fuer alle kuenftigen Screens.

| Token | Wert |
|---|---|
| Seitenrand Inhalt (auch Logo) | 28 px |
| Karten-Innenabstand | 20 px |
| Abstand zwischen Chat-Karten | 16 px |
| Suchleiste | H 58, Radius 39 |
| Frage-Karte | H 170, Radius 15 |
| Chat-Karte | H 64, Radius 15 |
| Runder Icon-Button | 36x36, Glyphe 18 px |
| Avatar Header | 50x50 |
| Tab-Bar | 210x56, Radius 28; aktive Pill 82x40, Radius 20 |

### 6.4 Allgemeine Design-Regeln

- Dark Mode only, kein Light Mode (`userInterfaceStyle: "dark"`)
- Transluzente Overlays statt fester Grautoene
- **Glasflaechen:** Suchleiste und Frage-Karte sind Liquid Glass
  (`expo-glass-effect`, ab iOS 26 nativ, sonst `expo-blur`). Liquid Glass ist
  adaptiv und waere auf Schwarz unsichtbar — deshalb bekommt jede Glasflaeche
  einen **Lichtsaum auf der Kante** (Verlauf von oben links hell nach unten
  rechts aus). Zentral in `components/common/GlassSurface.tsx`. Der Verlauf
  liegt dort hinter einer deckenden Ebene, sodass nur die 1-px-Kante sichtbar
  bleibt — sonst scheint er durch das durchsichtige Glas und graut die
  ganze Flaeche ein.
- **Tab-Bar** (Nodes 216:1280-1283): Die Kapsel ist **weiss** mit leichtem
  Verlauf (210x56). Darin liegen zwei getrennte Dinge, die nicht verwechselt
  werden duerfen:
  - die **schwarze Pille** (81x39, Node 216:1282) ist **fix** und gehoert zur
    Optik von „Home" — sie wandert nicht mit
  - der **Glas-Slider** (108x56 ueber volle Hoehe, Node 216:1281, Textebene im
    Figma ausgeblendet) wandert auf den aktiven Tab und zeigt an, wo man ist
  Die Textfarben haengen deshalb an der festen Pille, nicht an der Auswahl:
  „Home" steht immer weiss auf Schwarz, „Rankings" immer dunkel auf Weiss.
  **Stapelreihenfolge beachten:** die schwarze Pille liegt *vor* dem Slider
  (wie im Figma 216:1282 ueber 216:1281). Liquid Glass bricht und vergroessert
  alles dahinter — liegt die Pille darunter, wird sie auf Slider-Groesse
  aufgezogen und grau.
  Siehe `components/common/TabBar.tsx`.
- **`isInteractive` nur auf Flaechen**, die selbst Eingaben entgegennehmen
  (Suchleiste, Frage-Karte) — nicht auf dekorative Flaechen wie den
  Tab-Slider. Entspricht Apples Regel fuer `.interactive()`.
- **Kein opaker Hintergrund direkt hinter Glas.** Glas bricht, was dahinter
  liegt; auf reinem Schwarz hat es nichts zu brechen. Genau deshalb braucht
  jede Flaeche den Lichtsaum an der Kante.
- **Runde Icon-Buttons sind immer weiss** — auch wenn die Aktion gerade nicht
  moeglich ist. Kein ausgegrauter Disabled-Zustand.
- Minimalistisch, viel Blackspace, keine ueberfluessigen Elemente
- Kein Scout-Jargon in Labels, alle Stats in fanverstaendlicher Sprache

### 6.5 Bekannte Abweichungen vom Figma

Bewusste Entscheidungen, die vom File abweichen:

1. **Safe Area:** Im Figma sitzt die Kopfzeile bei y=34 und damit in der
   Statusleiste. Im Code beginnt sie bei `insets.top` (auf aktuellen iPhones
   ~62 px). Um die Differenz aufzufangen, ist das vertikale Raster gegenueber
   dem Figma leicht verdichtet (Abstaende 36/28/32/44 statt 58/36/36/52) —
   sonst wuerde der Inhalt scrollen, obwohl er im Design auf einen Screen passt.
2. **„Siehe alle"** ist im Figma ~10 px tiefer als „Deine Chats"; im Code sind
   beide auf einer Mittelachse.
3. **`Ellipse 19`** (Node 205:293) liegt unterhalb des Frames und ist nicht
   sichtbar — als Leftover verworfen.
4. **Zweites Icon** (`StarsFilled`) in der Vergleich-Pill liegt im Figma ueber
   dem Label und ist nicht sichtbar — weggelassen.
5. **Avatar** ist im Figma ein Pexels-Stockfoto in rotierter Maske — im Code ein
   Platzhalterkreis, bis es echte Profilbilder gibt.
6. **Glas-Tint:** Liquid Glass hellt von sich aus auf. Die Fill-Farben aus dem
   Figma als Tint zu verwenden macht die Flaechen viel zu hell — fuers Glas
   gilt deshalb `Colors.glassTint` (dunkel), die Figma-Fills nur noch fuer den
   Fallback ohne Liquid Glass.
7. **Der Pfeil-Button der Suchleiste** liegt im Figma bei x=378 und ragt damit
   rechnerisch aus der Pill heraus; im Code sitzt er wie im Screenshot 12 px
   innerhalb des rechten Rands (analog zum Senden-Button der Frage-Karte).

---

## 7. Datenmodell und Statistiken

### 7.1 Spieler-Datenobjekt

```typescript
interface Player {
  id: number;                    // Sportmonks Player ID
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;           // z. B. „Frankreich"
  nationalityFlag: string;       // Flaggen-Emoji oder URL
  height: string;                // z. B. „1,78"
  preferredFoot: 'Rechts' | 'Links' | 'Beidfüßig';
  photo: string;
  position: PlayerPosition;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  number: number;                // Trikotnummer
}

type PlayerPosition =
  | 'ST'   // Stürmer
  | 'LF'   // Linksaußen
  | 'RF'   // Rechtsaußen
  | 'OM'   // Offensives Mittelfeld
  | 'DM'   // Defensives Mittelfeld
  | 'IV'   // Innenverteidiger
  | 'LV'   // Linksverteidiger
  | 'RV'   // Rechtsverteidiger
  | 'TW';  // Torhüter (Post-Launch)
```

### 7.2 Statistiken pro Position

**Offensivspieler (ST, LF, RF)**
- Tore, Vorlagen
- xG, xA
- Chancen kreiert, Große Chancen kreiert
- Schüsse, Schussgenauigkeit %, Tore pro 90 min
- Dribblings, Erfolgreiche Dribblings %
- Rating

**Offensives Mittelfeld (OM)**
- Chancen kreiert, Große Chancen kreiert
- Ballkontakte
- Vorlagen, xA
- Progressive Aktionen (vereinfacht)
- Pässe, Erfolgreiche Pässe %
- Rating

**Defensives Mittelfeld (DM)**
- Zweikämpfe, Gewonnene Zweikämpfe %
- Interceptions, Tackles
- Ballkontakte
- Pässe, Erfolgreiche Pässe %
- Progressive Aktionen (vereinfacht)
- Rating

**Verteidiger (IV, LV, RV)**
- Zweikämpfe gewonnen
- Interceptions, Tackles
- Klärungen
- Fehler die zu Chancen führten
- Rating

**Torhüter (TW, Post-Launch)**
- Paraden
- Gegentore
- Clean Sheets
- Prevented Goals (vereinfacht)
- Rating

**Radar-Chart-Achsen pro Position:**

| Position | Achse 1 | Achse 2 | Achse 3 | Achse 4 | Achse 5 | Achse 6 |
|---|---|---|---|---|---|---|
| ST / LF / RF | Ballkontakte | Herausgespielte Chancen | Gewonnene Luftkämpfe | Defensive Aktionen | Tore | Schuss-Versuche |
| OM | Ballkontakte | Chancen kreiert | Pass-Genauigkeit | Progressive Pässe | Vorlagen | Tore |
| DM | Zweikämpfe gewonnen | Interceptions | Pass-Genauigkeit | Progressive Pässe | Ballkontakte | Tackles |
| IV | Zweikämpfe gewonnen | Klärungen | Interceptions | Pass-Genauigkeit | Luftkämpfe | Blocks |
| LV / RV | Zweikämpfe gewonnen | Interceptions | Flanken | Progressive Läufe | Tackles | Pass-Genauigkeit |
| TW | Paraden % | Prevented Goals | Clean Sheets | Pass-Genauigkeit | Abschläge | Herausgespielte Chancen verhindert |

### 7.3 Zeiträume

- **Standard:** letzte 5 Spiele (aktuelle Form)
- **Optional (Free):** aktuelle Saison
- **Optional (Pro):** All-Time

### 7.4 Rankings-Score

Vereinfachte, transparente Formel. Bei Tap auf einen Ranking-Eintrag wird die Rechnung offengelegt.

**Beispiel Stürmer:**
```
Score = (Tore × 2) + (Vorlagen × 1) + (Kreierte Chancen × 0,5) + (Erfolgr. Dribblings × 0,25)
```

Gewichtungsfaktoren variieren je nach Position. Faktoren für OM, DM, IV, LV, RV und TW werden in `constants/positions.ts` gepflegt.

Rankings werden 1x täglich pro Position batch-vorberechnet und aus der Supabase-DB serviert (siehe §10.2).

---

## 8. KI-Layer (Claude Haiku)

### 8.1 Zweck

Der KI-Layer übersetzt natürliche Sprache in strukturierte Stat-Abfragen und generiert opinionated Verdicts.

### 8.2 Sprachverarbeitung

- Kein Prompt-Zwang, freie Formulierung wie ChatGPT
- Umgangssprache verstehen (z. B. „Wer ist krasser?")
- Multi-Language mindestens Deutsch und Englisch, Antwort in Sprache der Frage

### 8.3 Antwort-Typen

| Trigger-Beispiel | Antwort-Typ | Rendering |
|---|---|---|
| „Wie ist die Form von Mbappé?" | Single-Player-Analyse | Stat-Karte + Text |
| „Wer ist besser, Mbappé oder Kane?" | Vergleich | Split-Screen + Verdict |
| „Kannst du mir mehr Details geben?" (nach Vergleich) | Vergleich + Radar | Split-Screen + Verdict + Radar-Chart |
| „Wer hat die meisten Tore in 2026?" | Ranking-Query | Text-Antwort mit Ranking-Verweis |
| „Wie viele Chancen hat er kreiert?" (Follow-up) | Text-Follow-up | reiner Text, Kontext bleibt beim aktuellen Spieler |

### 8.4 Antwortstruktur

Jede KI-Antwort besteht aus (je nach Typ):
1. **Structured Output** (JSON): Stat-Karten-Daten, Vergleichs-Daten, Radar-Werte
2. **Text-Block**: opinionated Analyse oder Verdict
3. **Feedback-UI**: Thumbs up / down auf Nachricht-Ebene

Die KI gibt klare Meinungen ab. Beispiel-Formulierung: „Basierend auf den Stats der letzten 5 Spiele würde ich sagen dass **Mbappe besser ist.**"

### 8.5 Kontext-Management

- Chat-Kontext: pro Chat werden User-Fragen plus AI-Antworten in `messages`-Tabelle gespeichert
- Aktueller Spieler-Kontext bleibt für die gesamte Chat-Session erhalten, bis explizit gewechselt wird
- Sprachwechsel ist innerhalb einer Session möglich

---

## 8b. Builds, Geraetetests und Apple-Konto

### 8b.1 Wo die App laeuft

| Weg | Apple-Konto noetig? | Anmerkung |
|---|---|---|
| Expo Go (aktueller Entwicklungsstand) | nein | schnellster Weg, kostenlos |
| iOS-Simulator auf dem Mac | nein | gut fuer Optik-Checks ohne Geraet |
| Eigenes iPhone, lokal per Kabel gebaut | kostenloser Apple-ID reicht | einziger kostenloser Weg aufs Geraet; Zertifikat laeuft nach wenigen Tagen ab |
| Eigenes iPhone ueber EAS Build | **ja, 99 $/Jahr** | Apple verlangt Signierung fuer jedes Geraet |
| Verteilung an Tester (Ad Hoc / TestFlight) | **ja** | max. 100 iPhones pro Jahr |
| App Store | **ja** | |

> [!important] Haeufiges Missverstaendnis
> Der bezahlte Apple Developer Account wird **nicht erst zum Veroeffentlichen**
> gebraucht. Apple verlangt eine Signierung, sobald eine App auf einem echten
> iPhone laeuft — auch beim eigenen Testgeraet. Expo-Doku dazu: „All builds that
> run on an iPhone device require a paid Apple Developer account for build
> signing." Der lokale Xcode-Build mit kostenloser Apple-ID ist laut Expo „the
> only way to install a development build on an iPhone without a paid Apple
> Developer account".
>
> Praktisch heisst das: Schon der erste Freund, der die App auf seinem iPhone
> ausprobieren soll, kostet 99 $/Jahr — nicht erst der App Store.

### 8b.2 Expo Go und Liquid Glass

`expo-glass-effect` **ist** in Expo Go enthalten, wir sind also nicht blockiert.
Fuer dieses Modul und `@expo/ui` gilt Expo Go aber als nicht voll zuverlaessig —
was dort zu sehen ist, muss nicht exakt dem entsprechen, was ein echter Build
zeigt. Solange nur das Layout beurteilt wird, ist das unkritisch. Beim
Feinschliff von Glas-Optik im Zweifel mit einem Dev Build gegenpruefen.

Passender Skill, falls ein Dev Build gebraucht wird:
`npx skills add expo/skills@expo-dev-client` (offizielles Expo-Org).

---

## 9. Supabase-Datenbankschema

### 9.1 Tabellen

**users**
- `id` (UUID, PK)
- `email`
- `display_name`
- `avatar_url`
- `subscription_tier` (`'free'` | `'pro'`)
- `created_at`

**chats**
- `id` (UUID, PK)
- `user_id` (FK → users)
- `title` (auto-generiert, z. B. „Mbappe vs Kane")
- `created_at`
- `updated_at`

**messages**
- `id` (UUID, PK)
- `chat_id` (FK → chats)
- `role` (`'user'` | `'assistant'`)
- `content` (Text)
- `structured_output` (JSONB, für Stat-Karten und Radar-Daten)
- `created_at`

**player_cache**
- `player_sportmonks_id` (Integer, PK)
- `timeframe` (`'last5'` | `'season'` | `'alltime'`)
- `data` (JSONB, gecachte Sportmonks-Response inkl. Perzentile)
- `last_updated` (Timestamp)

**rankings_cache**
- `position` (PlayerPosition)
- `data` (JSONB, Top-N mit Score-Breakdown)
- `last_computed` (Timestamp)

### 9.2 Row Level Security

- `users`, `chats`, `messages`: RLS erzwingt `user_id = auth.uid()`
- `player_cache`, `rankings_cache`: read-only für authentifizierte User, Write nur Edge Functions

---

## 10. Sportmonks-Integration

### 10.1 Benötigte Endpoints (Phase 3)

- `GET /players/search/{name}` — Spielersuche
- `GET /players/{id}` — Spieler-Details
- `GET /players/{id}/statistics/seasons/{seasonId}` — Saison-Stats
- `GET /fixtures/between/{startDate}/{endDate}` — für „letzte X Spiele"
- `GET /leagues` — Liga-Informationen
- `GET /players/{id}/percentiles` — für Radar-Chart

Alle Aufrufe laufen über Supabase Edge Functions, nicht direkt aus der App.

### 10.2 Caching-Strategie

Ziel: Sportmonks-Requests minimieren, Kosten kontrollieren, Antwortzeit senken.

| Datentyp | TTL |
|---|---|
| Spieler-Stammdaten | 24 h |
| Player-Stats (letzte 5) | 6 h während Spieltagen, 24 h sonst |
| Player-Stats (Saison, All-Time) | 24 h |
| Vergleichs-Ergebnisse | 24 h, gehasht per `playerA + playerB + timeframe` |
| Rankings pro Position | 24 h, batch-vorberechnet 1x pro Tag |
| Wettbewerbs-Daten | 7 Tage |

KI-Antworten: Structured Output speichern, nicht Freitext (siehe 8.4).

### 10.3 Rate-Limiting

Sportmonks-Plan Beta: 5 Ligen (Starter, ca. 24 €/Monat yearly). Rate-Limit-Tracking client-seitig plus in Edge Functions. Details zur Plan-Kalkulation siehe Obsidian `Datenstruktur.md` und `Kostenstruktur.md`.

---

## 11. Pro-Gating

Nur die für Claude Code relevante Feature-Gating-Logik. Vollständiges Pricing und Revenue-Modell siehe Obsidian `Business Model.md`.

**Free:**
- Spieler A vs. Spieler B (unbegrenzt in Beta, ggf. Rate-Limit ab Launch)
- Single-Player-Analysen
- Aktuelle Form (letzte 5 Spiele) und aktuelle Saison
- Rankings Top-10 pro Position
- Volle Visuals inklusive Radar-Chart
- Native Ads eingebettet in Feed und Rankings

**Pro (4,99 €/Monat oder 39,99 €/Jahr):**
- Werbefrei
- Unbegrenzte Vergleiche (falls Free rate-limited wird)
- All-Time-Zeitraum verfügbar
- Erweiterte Rankings (Top 25+)
- Prioritäts-Queue für schnellere KI-Antworten

Feature-Flag via `users.subscription_tier`. Gating clientseitig plus serverseitig in Edge Functions durchsetzen.

---

## 12. Nicht im MVP (bewusst weggelassen)

Damit Claude Code diese Features nicht spekulativ mitbaut:

- Gegnerstärke-Gewichtung
- Heim / Auswärts-Gewichtung
- Diskussionsmodus, Argumentkarten
- Profi-Analyse-Tools
- Web-App
- Sharing (Stat-Karten als Bild teilen)
- Sponsoring von Rankings, Brand-Placements als Feature
- Creator-Kooperationen als App-Feature
- Torhüter-Ranking (kommt post-launch)

Business-Priorisierung dieser Future-Features lebt in Obsidian.

---

## 13. Dummy-Daten für Phase 2

Zentralisiert in `constants/dummyData.ts`. Realistisch, aber statisch. Wird in Phase 3 durch echte Sportmonks-Daten ersetzt.

**Kylian Mbappé**
- Team: Real Madrid, Nummer 10, Position ST, Alter 27, Größe 1,78, Fuß Rechts, Land Frankreich
- Saison-Stats: 30 Tore, 7 Vorlagen, 28 xG, 56,4 % Dribblings, 25 Spiele, Rating 7,90
- Letzte 5 Spiele: 8 Tore, 1 Vorlage, 6 xG, 56,4 % Dribblings, 5 Spiele, Rating 8,50

**Harry Kane**
- Team: Bayern München, Nummer 9, Position ST, Alter 32, Größe 1,88, Fuß Rechts, Land England
- Letzte 5 Spiele: 5 Tore, 2 Vorlagen, 6 xG, 45,8 % Dribblings, 5 Spiele, Rating 7,00

**Beispiel-Chat-Titel:**
- „Meisten Tore in 2026"
- „Vinicius vs Olise in 25/26"
- „Ronaldo vs Messi All Time"

**Beispiel-Rankings (ST):**
- Platz 1: Kylian Mbappé (Score 152)
- Platz 2: Harry Kane
- Platz 3 bis 10: Platzhalter

**Beispiel Radar-Chart (Mbappé blau vs. Kane rot):**
- Ballkontakte 95 % · 42 %
- Herausgespielte Chancen 92 % · 55 %
- Gewonnene Luftkämpfe 32 % · 88 %
- Defensive Aktionen 18 % · 46 %
- Tore 99 % · 78 %
- Schuss-Versuche 100 % · 65 %

---

## 14. Nicht-funktionale Anforderungen

- **Performance:** flüssig auf iPhone 11+ und vergleichbaren Android-Geräten
- **Offline:** Grundnavigation offline, Daten aus letztem Cache
- **Sprache:** UI initial Deutsch, KI-Antworten in Sprache der Frage
- **Ladezeiten:** Stat-Karten 2 bis 3 Sekunden, Radar-Chart max. 3 Sekunden
- **Accessibility:** WCAG AA Kontraste, Screen-Reader-Labels für Stat-Karten

---

## 15. Konventionen für Claude Code

- Alle neuen Files in TypeScript
- Komponenten mit `PascalCase`, Hooks mit `useXxx`
- Farben und Radii nie inline, immer aus `constants/colors.ts` und `constants/theme.ts`
- Text-Strings nie inline, sondern in einer separaten Konstante pro Screen (bereitet i18n vor)
- Keine externen UI-Libraries ohne Rücksprache (kein NativeBase, kein Gluestack, kein Tamagui)
- Sportmonks-Aufrufe niemals direkt aus dem Client, ausschließlich über Supabase Edge Functions
- Bei Widerspruch zwischen dieser PRD und Obsidian-Docs: Obsidian gewinnt bei Business-Themen, PRD gewinnt bei technischen Themen. Bei technischem Widerspruch mit dem User rückfragen, nicht raten.

---

*Änderungshistorie: Version 2.0 vom 26. Juli 2026 ersetzt Version 1.0 vom 17. März 2026. Wesentliche Änderungen: Tech-Stack-Update (Cursor → VS Code + Claude Code, API-Football → Sportmonks, GPT-4o → Claude Haiku), Positions-Split (MI → OM + DM), Radar-Chart als eigene Sektion, Farbcodes Blau/Rot für Vergleiche, Follow-up-Chat-Flow, Business-Kapitel rausgezogen und auf Obsidian verwiesen.*