# Rankings-Score: Begruendung der Faktoren

**Stand:** 29. September 2026
**Status:** 1.0 — ST und Fluegel abgestimmt und im Code (`constants/positions.ts`)
**Gehoert zu:** PRD §7.4

> Jeder Faktor in diesem Dokument muss begruendet sein. Ein Faktor, der nur
> gewaehlt wurde, damit das Ergebnis "richtig aussieht", gehoert hier nicht
> hinein. Die App legt die Rechnung offen (PRD §5.6) — spaeter soll sie auch
> diese Begruendung zeigen.

---

## 1. Die Grundregel: Torwert

Jede Aktion wird danach bewertet, **wie viel sie in Toren wert ist**. Ein Tor
ist 1,0. Damit in der App keine Kommazahlen stehen, wird alles mit 10
multipliziert: ein Tor sind 10 Punkte.

---

## 2. Warum die Quote nicht direkt der Faktor ist

Die naheliegende Rechnung waere: "Ein Schuss aufs Tor geht zu 33 % rein, also
ist er 0,33 Tore wert, Faktor 3,3." Das waere zu hoch — und der Grund dafuer
ist der wichtigste Gedanke dieses Dokuments.

**Schuesse aufs Tor enthalten die Tore bereits.** Es gilt:

```
Schuesse aufs Tor = Tore + Schuesse aufs Tor, die nicht reingingen
```

Eine Kategorie zu gewichten, die die Tore enthaelt, ist deshalb dasselbe wie:

```
Faktor × Schuesse aufs Tor  =  Faktor × Tore  +  Faktor × Fehlschuesse
```

Das Mitzaehlen der Tore ist also **unproblematisch** — es hebt nur den
Tor-Faktor leicht an (bei ×0,2 von 10 auf 10,2) und trifft alle Spieler gleich.

**Die eigentliche Frage ist eine andere: Was ist ein Schuss aufs Tor wert, der
nicht reingeht?** Denn nur der unterscheidet die Spieler voneinander. Die
Quote 33 % beantwortet diese Frage nicht — ein Fehlschuss hat per Definition
kein Tor gebracht.

Warum die Hoehe des Faktors trotzdem entscheidet, zeigen zwei Stuermer mit je
20 Toren, einer eiskalt (40 Schuesse aufs Tor), einer vergeudend (80):

| Faktor | Eiskalt | Vergeuder | Ergebnis |
|---|---|---|---|
| ×3,3 (volle Quote) | 332 | **464** | Vergeuder liegt 4 Tore vorn — kaputt |
| ×0,2 (gewaehlt) | 208 | **216** | Vergeuder liegt 0,8 Tore vorn — vertretbar |

---

## 3. Warum trotzdem fuenf Stats — und mit welcher Begruendung

Ein Fehlschuss aufs Tor bringt kein Tor, ist aber nicht wertlos: Wer regelmaessig
zum Abschluss kommt und den Ball aufs Tor bringt, steht richtig, ist schwer zu
decken und gefaehrlich. Wer das 60-mal pro Saison schafft, tut es nicht
zufaellig. Dasselbe gilt fuer Praesenz im Strafraum. Dazu kommt: ueber den
Standard-Zeitraum von 5 Spielen (PRD §7.3) sind Tore stark vom Zufall
abhaengig, Schussvolumen und Strafraumpraesenz schwanken viel weniger.

Deshalb hat der Score zwei Bloecke mit **unterschiedlicher Begruendung**:

| Block | Was er misst | Begruendung | Anteil |
|---|---|---|---|
| **Ergebnis** | Tore, Torvorlagen | Torwert (siehe §4) | ~90 % |
| **Gefahr** | Grosschancen, Schuesse aufs Tor, Praesenz | Wert der Aktion, die (noch) kein Tor wurde | ~10 % |

**Die 10 % sind eine Produktentscheidung, kein Messwert.** Das muss so
dastehen. Sie sind so gewaehlt, dass der Gefahr-Block die Rangliste spuerbar
mitformt, aber nie einen Spieler ueber einen besseren Torschuetzen hebt.

In einem Satz fuer den Nutzer: **Ein Schuss aufs Tor, der nicht reingeht, zaehlt
1/50 Tor.**

---

## 4. Herleitung Block 1 — Ergebnis

| Stat | Wert | Herleitung |
|---|---|---|
| **Tor** | 1,0 → **×10** | Definition, der Anker des Modells |
| **Torvorlage** | 0,7 → **×7** | Konvention, kein Messwert. Ohne den Abschluss faellt kein Tor, aber die Vorlage erzeugt die Chance. 0,7 haelt das Tor klar vorn und bewertet die Vorlage hoeher als reine Kreativstats. |

Die 0,7 sind der einzige Wert im Modell, der auf Setzung statt auf Daten
beruht. Ueblich sind in der Analytik Werte zwischen 0,5 und 0,75.

---

## 5. Herleitung Block 2 — Gefahr

Innerhalb des Blocks stehen die Faktoren **im Verhaeltnis ihrer echten
Verwertungsquoten**, der ganze Block wird dann gemeinsam auf ~10 % gedaempft.

Die Faktoren stehen **im Verhaeltnis der echten Quoten** — eine Grosschance ist
mehr wert als ein Schuss aufs Tor, dieser mehr als ein Ballkontakt. Der ganze
Block wird dann gemeinsam so gedaempft, dass er rund 10 % des Scores ausmacht.

| Stat | Echte Quote | Quelle | Verhaeltnis | Faktor |
|---|---|---|---|---|
| Grosschance kreiert | 38 % werden zum Tor | Opta | 3,8 | **×0,3** |
| Schuss aufs Tor | 33 % gehen rein | Premier League, Schnitt | 3,3 | **×0,2** |
| Ballkontakt im gegn. Strafraum | ~9 % (25 Tore / 270 Kontakte, Mbappé) | eigene Daten | 0,9 | **×0,05** |

Zum Vergleich: ein Schuss **insgesamt** (nicht nur aufs Tor) geht nur zu rund
10 % rein, eine herausgespielte Chance wird zu rund 10 % zur Vorlage.

**Gegenprobe an echten Daten:** Mbappé hat 65 herausgespielte Chancen und 5
Torvorlagen — 7,7 %. Der Literaturwert von ~10 % passt also zu unseren Daten.

Fuer Ballkontakte im Strafraum gibt es keine veroeffentlichte Quote; der Wert
stammt aus unseren eigenen Zahlen und ist entsprechend unsicher. Er ist mit
Abstand der kleinste Faktor, ein Fehler wirkt sich also kaum aus.

---

## 6. Die Faktoren

### Stuermer (ST)

| Kategorie | Faktor |
|---|---|
| Tore | ×10 |
| Torvorlagen | ×7 |
| Grosschancen kreiert | ×0,3 |
| Schuesse aufs Tor | ×0,2 |
| Ballkontakte im gegnerischen Strafraum | ×0,05 |

**Was das in Worten heisst:** Ein Tor ist 1,4 Torvorlagen wert, 33
Grosschancen, 50 Schuesse aufs Tor oder 200 Strafraumkontakte.

**Probe mit den Dummy-Daten** (Saison 25/26, Mbappé und Kane echt):

| | Tore | Vorlagen | Grosschancen | Schuesse aufs Tor | Strafraum | Score |
|---|---|---|---|---|---|---|
| Kane | 360 | 35 | 5,4 | 13,6 | 11,5 | **425,5** |
| Haaland | 290 | 21 | 1,8 | 11,8 | 12,75 | **337,4** |
| Mbappé | 250 | 35 | 2,4 | 12,6 | 13,5 | **313,5** |
| … | | | | | | |
| Guirassy | 140 | 28 | 1,8 | **15,0** | 12,0 | **196,8** |

Guirassy hat in diesen Daten mit 75 die **meisten** Schuesse aufs Tor und landet
trotzdem auf Platz 10. Genau so soll der Gefahr-Block wirken.

### Fluegel (LF, RF)

| Kategorie | Faktor |
|---|---|
| Tore | ×10 |
| Torvorlagen | ×7 |
| Grosschancen kreiert | ×0,3 |
| Erfolgreiche Flanken | ×0,3 |
| Erfolgreiche Dribblings | ×0,05 |

Die beiden letzten Faktoren sind **vorlaeufig**. Mbappé ist kein Fluegelspieler
und hat nur 6 erfolgreiche Flanken — fuer eine saubere Herleitung fehlen Daten
von echten Fluegelspielern (z. B. Vinícius, Salah).

---

## 7. Gleichstand

Bei gleichem Score entscheidet:

1. weniger **Spiele** ist besser
2. dann weniger **gespielte Minuten** ist besser

Begruendung: Wer dieselbe Leistung in weniger Zeit bringt, war effizienter.
Beim Standard-Zeitraum (letzte 5 Spiele) haben in der Regel alle dieselbe
Spielzahl, dort greift Stufe 2.

---

## 8. Offene Punkte

- **Elfmeter:** Mbappé hat 8 seiner 25 Tore per Elfmeter erzielt — ein Drittel.
  Ein Elfmeter geht zu ~76 % rein, ein Tor aus dem Spiel ist also die
  schwerere Leistung. Moegliche Loesung: Elfmetertore ×6 statt ×10. Nicht im
  MVP.
- **Datenverfuegbarkeit:** Die Zahlen oben stammen von Fotmob. Ob Sportmonks
  "Ballkontakte im gegnerischen Strafraum" und "Erfolgreiche Flanken" liefert,
  ist **ungeprueft**. Muss vor der Umsetzung geklaert werden (PRD §9).
- **Restliche Positionen:** OM, ZM, DM, IV, LV, RV, TW fehlen noch. Fuer den
  Torwart passt keine der fuenf Kategorien, er braucht eigene.
- **Liga-Staerke:** Die Testdaten kommen aus drei Ligen. Eine Gewichtung nach
  Gegnerstaerke steht in der PRD als kuenftiges Feature.
- **In der App zeigen:** Diese Begruendung soll spaeter im Ranking abrufbar
  sein, nicht nur die Rechnung.

---

## 9. Quellen

- Grosschancen-Definition und -Quote (~38 %): [Opta / The Analyst](https://theanalyst.com/articles/opta-football-stats-definitions), [Sportmonks Glossar](https://www.sportmonks.com/glossary/big-chance-conversion-rate/)
- Schuesse aufs Tor, ~33 % Verwertung; Schuesse gesamt ~10 %: [Sofascore](https://www.sofascore.com/news/a-statistical-breakdown-of-shots-shots-on-target-and-big-chances), [Premier League](https://www.premierleague.com/en/news/4027257)
- Key Passes und Vorlagen: [StatsBomb](https://blogarchive.statsbomb.com/articles/soccer/assessing-key-passes/), [Sportmonks Glossar](https://www.sportmonks.com/glossary/key-passes/)
- Spielerdaten Mbappé (LaLiga 25/26): Fotmob; Kane und Lautaro: Sofascore

---

## 10. Aenderungen

| Datum | Aenderung |
|---|---|
| 29.09.2026 | Erste Fassung: ST und Fluegel, Zwei-Bloecke-Modell |
| 29.09.2026 | Begruendung fuer den Gefahr-Block geschaerft (Wert eines Fehlschusses statt "Stabilitaet"); im Code umgesetzt |
