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

Fuer den ganzen Block gilt **eine Regel, an jeder Position dieselbe**:

```
Faktor = 0,6 × Quote, mit der die Aktion zum Tor fuehrt
```

Herkunft der 0,6: Eine Aktion mit Quote q ist q Tore wert, also 10q Punkte.
Davon bleiben 6 % — die Daempfung, weil der Block Aktionen mitzaehlt, die schon
in den Toren stecken (§2). Sie ist so gewaehlt, dass der Block bei einem
Stuermer rund 10 % des Scores ausmacht.

**Dieselbe Aktion ist damit ueberall gleich viel wert.** Eine Grosschance zaehlt
beim Stuermer wie beim Fluegelspieler 0,25 — was ein Nutzer zu Recht erwartet.

| Stat | Quote → Tor | Quelle | 0,6 × Quote | Faktor |
|---|---|---|---|---|
| Grosschance kreiert | 38 % | Opta | 0,23 | **×0,25** |
| Schuss aufs Tor | 33 % | Premier League, Schnitt | 0,20 | **×0,2** |
| Ballkontakt im gegn. Strafraum | ~9 % | eigene Daten (Mbappé) | 0,054 | **×0,05** |
| Erfolgreiche Flanke | ~7 % | hergeleitet, siehe unten | 0,042 | **×0,05** |
| Erfolgreiche Dribblings | ~5 % | xT-Literatur, siehe unten | 0,030 | **×0,03** |

**Herleitung erfolgreiche Flanke:** Nur 1 bis 2 % **aller** Flanken fuehren zu
einem Tor (Premier League: 1,09 % aus dem Spiel, europaweit 1,76 %; rund 73
Flanken pro Tor). Unsere Stat zaehlt aber nur die **angekommenen** Flanken, und
das sind je nach Spieler 15 bis 28 % der Versuche. Rechnet man das um:
1,4 % ÷ 20 % ≈ **7 %** pro angekommener Flanke.

**Herleitung erfolgreiche Dribblings:** Hier gibt es keine veroeffentlichte
Quote. Ein gelungenes Dribbling ist eine Fortschritts-Aktion wie ein
Strafraumkontakt (~9 %), findet aber oft weit vom Tor statt und ist deshalb
niedriger anzusetzen. Die xT-Literatur bewertet einzelne Progressions-Aktionen
mit 0,02 bis 0,03 Toren. Angesetzt: **5 %**. Unsicherster Wert im Modell,
gleichzeitig der kleinste Faktor.

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
| Grosschancen kreiert | ×0,25 |
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
| Grosschancen kreiert | ×0,25 |
| Erfolgreiche Flanken | ×0,05 |
| Erfolgreiche Dribblings | ×0,03 |

**Probe an vier Fluegelspielern** (Saisonzahlen 25/26, Fotmob):

| | Tore | Vorlagen | Grosschancen | Flanken | Dribblings | Score |
|---|---|---|---|---|---|---|
| Olise | 15 → 150 | 19 → 133 | 27 → 6,75 | 31 → 1,55 | 65 → 1,95 | **293,3** |
| Yamal | 16 → 160 | 11 → 77 | 26 → 6,5 | 23 → 1,15 | 133 → 3,99 | **248,6** |
| Vinícius | 16 → 160 | 5 → 35 | 7 → 1,75 | 9 → 0,45 | 87 → 2,61 | **199,8** |
| Gordon | 6 → 60 | 2 → 14 | 5 → 1,25 | 15 → 0,75 | 33 → 0,99 | **77,0** |

Die Reihenfolge ist plausibel, und die drei Top-Spieler liegen deutlich vor
Gordon — so, wie es der fachlichen Einschaetzung entspricht.

**Wichtig zu wissen:** Der Gefahr-Block macht bei Fluegelspielern nur 2 bis 5 %
aus, beim Stuermer sind es ~10 %. Das ist kein Fehler, sondern das Ergebnis der
Regel: Flanken und Dribblings sind nun einmal weiter vom Tor entfernt als
Schuesse und Strafraumkontakte. Wer will, dass sie staerker ins Gewicht fallen,
muesste die Regel fuer Fluegel brechen — das waere dann eine Produktentscheidung
und keine Herleitung mehr.

Praktisch heisst das: **Fluegelspieler werden fast ausschliesslich ueber Tore und
Vorlagen sortiert.** Flanken und Dribblings entscheiden nur, wenn zwei Spieler
dicht beieinanderliegen. Yamal zieht mit 133 Dribblings gegenueber Vinícius mit
87 nur 1,4 Punkte heraus — ein Siebtel eines Tores.

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

- Flankenquote (1,09 % Premier League, 1,76 % Europa, ~73 Flanken pro Tor): [Power of Goals](http://thepowerofgoals.blogspot.com/2012/08/the-case-for-crosses.html), [American Soccer Analysis](https://www.americansocceranalysis.com/home/2021/3/11/where-goals-come-from-putting-balls-into-the-box), [StatsBomb](https://blogarchive.statsbomb.com/articles/soccer/how-low-can-you-go-assorted-thoughts-about-crosses/)
- Expected Threat (Wert einzelner Progressions-Aktionen): [Hudl](https://www.hudl.com/blog/possession-value-models-explained)
- Spielerdaten Fluegel (Vinícius, Yamal, Olise, Gordon, 25/26): Fotmob
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
| 30.09.2026 | Regel "Faktor = 0,6 × Quote" formuliert. Flanken von 0,3 auf 0,05 und Dribblings von 0,05 auf 0,03 korrigiert (waren geschaetzt, jetzt hergeleitet). Grosschancen von 0,3 auf 0,25 (Rundung an die Regel angepasst). Geprueft an Olise, Yamal, Vinícius und Gordon. |
