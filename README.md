# MH Consulting — Website

Statische Website (HTML/CSS/JS, kein Build-Schritt) für ein Ingenieurbüro
in der Wasserwirtschaft. Dreisprachig: **Deutsch · English · Español**.

Zum Ansehen genügt ein Doppelklick auf `index.html`. Für die Sprachumschaltung
und das Kontaktformular sollte die Seite über einen Server laufen:

```bash
cd "Huber Consulting"
python3 -m http.server 8000
# http://localhost:8000
```

---

## ⚠️ Vor der Veröffentlichung ausfüllen

Alle Platzhalter stehen in eckigen Klammern und sind im Browser sichtbar.
So findest du sie alle:

```bash
grep -rn "\[TELEFON\|\[VORNAME\|\[NOMBRE\|\[FIRST NAME\|\[STRASSE\|\[PLZ\|PLATZHALTER\|MARCADOR\|PLACEHOLDER\|todo" \
  index.html impressum.html datenschutz.html assets/js/i18n.js
```

| Was | Wo |
|---|---|
| Vorname (`[VORNAME] Huber`) | `assets/js/i18n.js` → `abt.name` in **allen drei** Sprachen |
| Telefonnummer | `index.html` (`tel:`) und der sichtbare Text über `ph.phone` in `i18n.js` |
| Büroanschrift | `assets/js/i18n.js` → `ph.addr` (alle drei Sprachen) |
| Projekte & Kennzahlen | `assets/js/i18n.js` → `prj.*` (alle drei Sprachen), danach den Hinweis `prj.note` **löschen** |
| Impressum | `impressum.html` — alle `todo`-Felder |
| Datenschutz | `datenschutz.html` — Hosting-Anbieter, Aufsichtsbehörde, Stand |
| Firmenname | Wortmarke in `index.html` (zweimal), `foot.note` und `meta.title` in `i18n.js`, beide Rechtstexte |

**Die Projektbeschreibungen sind aus dem Lebenslauf abgeleitet, nicht belegt.**
Sie müssen durch echte Referenzen ersetzt werden — und Auftraggeber müssen der
Nennung zustimmen, bevor die Seite online geht.

---

## Aufbau

```
index.html            Die gesamte Seite (Hero, Leistungen, Projekte, Profil, Kontakt)
impressum.html        Pflichtangaben § 5 DDG
datenschutz.html      Datenschutzerklärung Art. 13 DSGVO
assets/css/style.css  Alle Stile, Design-Tokens ganz oben in :root
assets/js/i18n.js     Sämtliche Texte in DE / EN / ES — hier wird Inhalt gepflegt
assets/js/main.js     Sprachumschaltung, Navigation, Pegel-Leiste, Formular
assets/fonts/         Archivo, Source Serif 4, IBM Plex Mono — selbst gehostet, wird geladen
Background/           Quellmaterial (LinkedIn-Screenshots), gehört nicht auf den Server
```

### Handlungsaufforderung (Call to Action)

Es gibt drei Stellen, an denen um Kontakt gebeten wird — bewusst gestaffelt:

1. **Hero** — „Projekt besprechen" (`hero.cta1`) öffnet direkt das
   Schreibfenster. Der schnelle Weg für alle, die schon wissen, worum es
   geht: beschreiben und abschicken.
2. **CTA-Sektion** zwischen Projekten und Profil (`cta.*`) — der eigentliche
   Konversionspunkt. Sie steht direkt hinter den Referenzen, also dort, wo
   Leserinnen und Leser am ehesten überzeugt sind. Es ist der einzige
   zentrierte Block der Seite, damit er als Unterbrechung gelesen wird.
3. **Kopfzeile** — „Erstgespräch" (`cta.mini`), ab 900 px sichtbar und beim
   Scrollen immer erreichbar. Auf dem Handy ausgeblendet, weil dort schon
   Wortmarke, Sprachwahl und Menü stehen; das Menü führt zu „Kontakt".

Die beiden Schaltflächen, die ausdrücklich ein Erstgespräch anbieten (2 und
3), öffnen ein eigenes Fenster (`#talk-modal`, Texte unter `talk.*`) statt
direkt zum Formular zu springen. Es erklärt in Ruhe, was in den 30 Minuten
passiert, nennt die drei möglichen Sprachen und schließt mit dem Satz, dass
es kein Angebot, keine Verpflichtung und keine Nachfass-E-Mails gibt.

Der Ton ist bewusst zurückhaltend: keine Dringlichkeit, keine Knappheit,
keine Superlative. Die Überschrift sagt ausdrücklich „kein Verkaufstermin",
und der Schlusssatz bietet an, weiterzuvermitteln, wenn es fachlich nicht
passt. Wer diese Texte ändert, sollte diese Haltung halten — bei einem
Ingenieurbüro ist Zurückhaltung das glaubwürdigere Verkaufsargument.

Der Sprachhinweis (`talk.langLabel`, `talk.langNote`) ist der Grund für das
Fenster: Er senkt die Hemmschwelle für Interessenten, die lieber auf
Englisch oder Spanisch schreiben. Die drei Namen in den Chips stehen fest im
HTML und werden **nicht** übersetzt — „Deutsch", „English", „Español" sind
Eigenbezeichnungen und in jeder Sprache verständlich.

Ohne JavaScript sind beide Schaltflächen weiterhin normale Links auf
`#kontakt`; das Fenster ist eine Verbesserung, keine Voraussetzung.

Das konkrete Angebot — 30 Minuten, kostenfrei, unverbindlich, mit ehrlicher
Einschätzung zur Größenordnung — steht in `cta.lede`. Es ist der Grund, aus
dem jemand klickt; wird es geändert, sollte es auch in der Kontaktsektion
(`ctc.lede`) stimmen, wo dieselbe Zusage wiederholt wird.

### Leistungs-Detailfenster und Vorbelegung

Ein Klick auf eine der sechs Leistungskarten öffnet ein Overlay (`<dialog>`)
mit der Beschreibung und der vollständigen Leistungsliste. Der Knopf darin
öffnet das Schreibfenster (siehe unten) und **belegt es vor**: Das Thema
wird auf die passende Leistung gesetzt, die Nachricht bekommt einen
Einstiegssatz, der mit einem offenen Doppelpunkt endet — der Cursor steht
direkt dahinter. Beide Felder bleiben frei änderbar; eine kurze Notiz über
dem Absenden weist darauf hin.

Die Vorbelegung überschreibt **nie** eigenen Text. Die Regel:

* Feld leer → Einstiegssatz wird eingesetzt.
* Feld enthält noch eine Vorbelegung (auch aus einer anderen Leistung oder
  einer anderen Sprache) → wird ersetzt, damit kein veralteter Text
  stehenbleibt.
* Feld enthält selbst getippten Text → bleibt unangetastet, nur das Thema
  wechselt.

Texte pflegen in `assets/js/i18n.js`, je Leistung `1`–`6`:

| Schlüssel | Inhalt |
|---|---|
| `svc.Nt` | Titel (Karte und Detailfenster) |
| `svc.Nd` | Beschreibungsabsatz (Karte und Detailfenster) |
| `svc.Na`–`svc.Nc` | Drei Schlagworte auf der Karte |
| `svc.Nl1`, `svc.Nl2`, … | Die Punkte unter „Leistungen" |
| `svc.Npre` | Einstiegssatz für das Formular (`\n\n` = Absatz) |

**Die Listen sind unterschiedlich lang** (6 bis 9 Punkte). `fillModal` in
`main.js` zählt deshalb hoch, bis ein Schlüssel fehlt, statt eine feste
Anzahl anzunehmen — ein Punkt mehr oder weniger ist eine Zeile in
`i18n.js`, sonst nichts. Maßgeblich ist dabei das **deutsche** Sprachpaket
(`has()` prüft nur `de`): Fehlt dort `svc.3l8`, bricht die Liste ab, auch
wenn Englisch oder Spanisch den Schlüssel hätten. Neue Punkte also immer
zuerst auf Deutsch anlegen und lückenlos durchnummerieren.

Die Zuordnung Karte → Thema steckt in `index.html` im Attribut `data-topic`
der Karten-Schaltfläche und muss zu einem `value` der Themenauswahl passen.
Die Liste steht **zweimal** im HTML, im Seitenformular und im Schreibfenster:

| `value` | Schlüssel | Wofür |
|---|---|---|
| `erstgespraech` | `frm.o0` | **Voreinstellung.** Wer über „Erstgespräch" kommt, landet hier |
| `grundwasser` | `frm.o1` | Leistungskarte 1 — Grundwasserschutz & Wasserversorgung |
| `klima` | `frm.o2` | Leistungskarte 2 — Klimaanpassung & nachhaltiges Wassermanagement |
| `analysen` | `frm.o3` | Leistungskarte 3 — Analysen, Fachkonzepte & technische Bewertung |
| `projekt` | `frm.o4` | Leistungskarte 4 — Projektbegleitung, Beratung & Wissenstransfer |
| `bildung` | `frm.o5` | Leistungskarte 5 — Bildung, Workshops & Wissenstransfer |
| `international` | `frm.o6` | Leistungskarte 6 — Internationale Wasserberatung & Technologietransfer |
| `sonstiges` | `frm.o7` | Rest |

Wird eine Leistung umbenannt oder ergänzt, alle Stellen mitziehen: beide
`<select>`, das `data-topic` der Karte und die Schlüssel in `i18n.js`.

**Herkunft der Texte:** Titel, Beschreibungen und Leistungslisten der sechs
Karten stammen wörtlich aus `Background/Leistungsangebot.pages`. Wer sie
ändert, sollte das Dokument mitziehen — sonst driften Angebot und Website
auseinander. Die drei Schlagworte je Karte (`svc.Na`–`Nc`) stehen nicht im
Dokument; sie sind aus dessen eigenen Begriffen gezogen. Englisch und
Spanisch sind Übersetzungen des deutschen Originals und bewusst nah daran
gehalten.

Welches Thema beim Öffnen des Schreibfensters steht, regelt `openWrite`:

* Über eine **Leistungskarte** → deren Thema, immer.
* Über **Erstgespräch** → `erstgespraech` (`DEFAULT_TOPIC` in `main.js`).
* Hat der Besucher das Thema **selbst** im Auswahlfeld geändert, bleibt
  seine Wahl stehen (`topicTouched`) — außer eine Leistungskarte gibt
  ausdrücklich ein neues Thema vor.

Bedienung: Die ganze Karte ist klickbar, technisch aber ein echter
`<button>` — Tastatur und Screenreader funktionieren. `Esc` schließt, der
Fokus springt auf die Karte zurück, und ein Sprachwechsel bei offenem
Fenster übersetzt den Inhalt sofort mit.

### Projekte-Sektion

Die vier Einträge sind **leere Vorlagen**, keine echten Referenzen — die
früheren Beschreibungen waren aus dem Lebenslauf abgeleitet und nicht belegt.
Je Eintrag zu füllen (in `i18n.js`, alle drei Sprachen):

| Schlüssel | Inhalt |
|---|---|
| `prj.Np` | Ort und Land |
| `prj.Nt` | Titel — der Platzhalter nennt das passende Leistungsfeld |
| `prj.Nd` | Zwei bis drei Sätze: Ausgangslage, Aufgabe, Ergebnis |
| `prj.Nk1` / `prj.Nk2` | Die beiden Kennzahlen-Beschriftungen |
| `prj.year` / `prj.val` | Gemeinsame Platzhalter für Zeitraum und Zahlenwert |

`prj.year` und `prj.val` sind **je einmal** vergeben und werden zwölfmal
verwendet. Sobald echte Zahlen feststehen, gehören sie direkt ins HTML —
dann das `data-i18n` am `<span class="case__year">` bzw. am `<dd>`
entfernen, sonst überschreibt der Sprachwechsel den Wert wieder.

Zahlen und Auftraggebernamen brauchen die **Freigabe der Auftraggeber**.
Liegt sie nicht vor, ist es besser, die Sektion samt Navigationspunkt zu
entfernen, als sie mit Platzhaltern online zu stellen.

### Wortmarke und Claim

Die Wortmarke lautet **MH Consulting**, der Claim **„Einfach Wasser."** Beide
stehen zusammen in der Kopfzeile und im Fuß. Der Name ist fest im HTML
(er wird nicht übersetzt), der Claim liegt unter `brand.claim` in
`assets/js/i18n.js`:

```js
de: "Einfach Wasser."
en: "Simply water."
es: "Simplemente agua."
```

**Entscheidung, die euch gehört:** Ein Claim ist ein Markenzeichen — viele
Büros lassen ihn in der Originalsprache stehen, auch auf fremdsprachigen
Seiten. Ich habe ihn übersetzt, weil „Einfach Wasser." für englisch- oder
spanischsprachige Leser sonst nur ein Klang ohne Bedeutung ist. Wollt ihr
ihn überall deutsch, setzt einfach in allen drei Sprachpaketen denselben
Text ein — eine Zeile pro Sprache, sonst ändert sich nichts.

Der Claim steht bewusst **nicht** im Seitentitel: dort trägt
„Ingenieurbüro für Wasser & Umwelt" mehr zur Auffindbarkeit bei als ein
Wortspiel.

### Schreibfenster

Alle Wege aus den Fenstern enden im Schreibfenster (`#write-modal`, Texte
unter `write.*`) — niemand wird zurück auf die Seite geschickt, um das
Formular zu suchen. Es enthält dieselben Felder wie das Formular unten auf
der Seite.

    Hero „Projekt besprechen" ──────┐
    Erstgespräch-Fenster ───────────┤
                                    ├─→ Schreibfenster ─→ E-Mail-Programm
    Leistungs-Fenster ──────────────┘        (vorbelegt)

Im Schreibfenster steht über den Feldern noch einmal der Sprachhinweis
(`write.langNote`) mit den drei Chips — genau an der Stelle, an der jemand
zögert, ob er auf Englisch oder Spanisch schreiben darf.

Beide Formulare — das im Fenster und das auf der Seite — teilen sich **eine**
Implementierung (`wireForm` in `main.js`). Die Felder werden über
`name="…"` gefunden, nicht über IDs; wer ein Feld ergänzt, ergänzt es in
beiden Formularen und die Logik zieht automatisch mit. Die Empfängeradresse
steht genau einmal, als `MAILTO` oben im Abschnitt „Enquiry forms".

Das Formular auf der Seite bleibt bewusst bestehen: für Besucher, die
einfach nach unten scrollen, und als Rückfallebene ohne JavaScript.

### Texte ändern

Fast alle sichtbaren Texte stehen in `assets/js/i18n.js`, nicht im HTML.
Ein Eintrag pro Sprache, gleicher Schlüssel:

```js
de: { "svc.1t": "Gewässer & Hochwasserschutz", … }
en: { "svc.1t": "Rivers & flood protection",   … }
es: { "svc.1t": "Ríos y protección contra crecidas", … }
```

Das HTML verweist über `data-i18n="svc.1t"` darauf. Der Text im HTML ist nur
der Startwert, bevor JavaScript lädt — beim Ändern **beide** Stellen anpassen
oder einfach nur `i18n.js` und den HTML-Fallback gleich mitziehen.

Prüfen, ob alle Schlüssel in allen Sprachen existieren:

```bash
node -e 'global.window={};require("./assets/js/i18n.js");const I=window.I18N;
const h=require("fs").readFileSync("index.html","utf8");const k=new Set();
for(const m of h.matchAll(/data-i18n(?:-html)?="([^"]+)"/g))k.add(m[1]);
for(const m of h.matchAll(/data-i18n-attr="([^"]+)"/g))m[1].split(",").forEach(p=>k.add(p.split(":")[1].trim()));
["ui.errRequired","ui.errMail","ui.errPrivacy","ui.ok"].forEach(x=>k.add(x));
for(const l of["de","en","es"]){const miss=[...k].filter(x=>!(x in I[l]));
console.log(l,miss.length?"FEHLT: "+miss.join(", "):"vollständig");}'
```

### Gestaltung

Neo-Minimalismus: viel Weißraum, Haarlinien statt Rahmen, eine dominante
Farbe (#00666D) und ein einziger Akzent (Dunkelblau). Tiefe entsteht über
weiche, in der Markenfarbe getönte Schatten — nicht über Konturen.
Alle Stellschrauben stehen oben in `assets/css/style.css`:

```css
--brand:      #00666D;  /* dominante Farbe */
--brand-deep: #00666D;  /* dieselbe Farbe, texttauglich */
--brand-soft: #E8F1EE;  /* ruhige Flächentönung */
--navy:       #16385A;  /* Akzent: Marker, Linien, Zahlen */
--ink:        #17211D;  /* Überschriften und Fließtext */
--muted:      #5A6A64;  /* Sekundärtext */
--paper:      #F7F9F8;  --white:#FFFFFF;
--on-dark:    #FFFFFF;  /* Text auf dunkler Fläche: Buttons, Sprachwahl */

--r:16px;               /* Eckenradius */
--line:      rgba(23,33,29,.10);   /* Haarlinie */

--sh: 84,155,140;       /* --brand als RGB — färbt alle Schatten ein */
--shadow-sm: 0 2px 8px -2px    rgba(var(--sh),.20);
--shadow:    0 10px 28px -10px rgba(var(--sh),.28);
--shadow-lg: 0 22px 48px -16px rgba(var(--sh),.34);
```

Drei Regeln halten das Bild zusammen: Struktur entsteht durch **Abstand und
Haarlinien**, nie durch kräftige Rahmen. **Jeder** Schatten ist weich und in
der Markenfarbe getönt — nie grau, nie schwarz. Und der Akzent bleibt
sparsam: Dunkelblau markiert Kennzahlen, Rubrikenlabels und Links, sonst
nichts.

Auf der grünen Projekte-Sektion wäre ein grüner Schatten unsichtbar; dort
wird `--sh` auf einen dunkelblauen Ton gesetzt. Auf dieser Fläche erreicht
außerdem nur `--ink` den Kontrastwert 4,5:1 — Hierarchie entsteht dort über
Schriftgröße und -schnitt, nicht über Farbe.

### Weiß auf dunklen Flächen

`--on-dark` ist die Textfarbe für alles, was auf einer gefüllten dunklen
Fläche sitzt: gefüllte Buttons, die aktive Sprache, der Skip-Link und die
gesamte grüne Projekte-Sektion. Es ist bewusst ein eigenes Token und nicht
`--white` — `--white` bezeichnet Flächen (Karten, Dialog, Eingabefelder),
`--on-dark` bezeichnet Schrift. Wer später einmal ein gebrochenes Weiß
möchte, ändert nur eines von beiden.

Gefüllte Buttons stehen auf `--brand-deep`, nicht auf `--brand`. Grund ist
der Kontrast: Weiß auf `--brand-deep` erreicht 7,1:1, auf dem alten helleren
Markenton wären es nur 3,3:1 gewesen — zu wenig für Beschriftungen.

**Achtung bei Änderungen an `--brand`:** Drei Werte hängen daran und ziehen
*nicht* automatisch mit.

| Token | Wofür | Bei Markenwechsel |
|---|---|---|
| `--sh` | RGB-Tripel für alle Schatten | muss auf denselben Farbwert gesetzt werden, sonst sind die Schatten nicht mehr markenfarbig |
| `--brand-deep` | Buttons, farbiger Text | dunklere Variante derselben Farbe wählen |
| `--brand-soft` | Flächentönung, Tags, CTA-Band | sehr helle Variante derselben Farbe wählen |

Ebenso zu prüfen: Auf der grünen Sektion trägt der Text `--on-dark`. Wird
`--brand` heller gesetzt, kippt das — dann ist wieder `--ink` richtig. Die
Grenze liegt ungefähr dort, wo Weiß 4,5:1 erreicht.

### Kontraste

Geprüft gegen WCAG AA (4,5:1 für Fließtext):

| Kombination | Verhältnis |
|---|---|
| `--muted` auf `--paper` | 5,4:1 |
| `--muted` auf Weiß | 5,7:1 |
| `--ink` auf `--paper` | 15,6:1 |
| `--navy` auf `--paper` | 11,4:1 |
| `--brand-deep` auf `--paper` | 6,7:1 |
| `--ink` auf `--brand` (grüne Sektion) | 5,1:1 |

`--brand` selbst ist als Textfarbe **nicht** geeignet (2,7:1 auf `--paper`).
Für farbigen Text ist `--brand-deep` da.

### Der Pegel

Die Signatur der Seite: eine Pegellatte am linken Rand, an der die
Scrolltiefe als Wasserstand abzulesen ist. 0,00 m am Seitenanfang, 4,00 m
am Ende; Dezimeter-Striche aus einem `repeating-linear-gradient`, die
Meterzahlen aus `data-mark` der `<li>` in `index.html`.

Sie ist die **eine** Stelle, an der die Seite laut sein darf — deshalb ist
alles andere bewusst zurückgenommen. Wer hier etwas hinzufügt, sollte an
anderer Stelle etwas wegnehmen.

Sichtbar ab 1180 px (`--rail` schafft die Spalte, `body:has(.gauge)` rückt
den Inhalt ein). Darunter entfällt sie ersatzlos: Ein Fortschrittsbalken
oben am Bildrand wäre das generische Gegenteil dessen, was sie ist.

Die Füllung setzt `readLevel()` in `main.js` als `--fill` in Prozent.

### Scrollen zu den Abschnitten

Klicks auf Navigation, Buttons und Wortmarke scrollen nicht sprunghaft,
sondern mit einer eigenen Animation in `main.js` (`glideTo`): sanft
anfahren, in der Mitte zügig, weich auslaufen. Die Dauer richtet sich nach
der Entfernung (460–1150 ms), und die Höhe der klebenden Kopfzeile wird
abgezogen, damit die Überschrift nicht darunter verschwindet.

Wichtig für das Gefühl: Sobald jemand das Mausrad dreht, den Bildschirm
berührt oder eine Scrolltaste drückt, bricht die Animation sofort ab. Nichts
ist unangenehmer, als gegen eine laufende Bewegung anzuscrollen.

**Sprungziele müssen normale Elemente im Textfluss sein.** Ein `sticky` oder
`fixed` positioniertes Element meldet seine *gezeichnete* Position — die
festgeklebte Kopfzeile wandert also mit dem Scrollen mit, und eine Messung
daran ergibt immer nur den Kopfzeilen-Versatz. Deshalb sitzt `#top` als
eigenes, null Pixel hohes `<div>` **über** der Kopfzeile und nicht auf ihr.
(`offsetTop` hilft übrigens nicht: Chrome rechnet die Sticky-Verschiebung
dort ebenfalls ein.)

Bei `prefers-reduced-motion: reduce` wird ohne Animation gesprungen. Ohne
JavaScript übernimmt `scroll-behavior:smooth` aus dem CSS — deshalb steht
die Regel dort unter `html:not(.js)`: Sonst würde der Browser jeden
einzelnen Schritt der eigenen Animation noch einmal weichzeichnen.

### Gestalterische Grundregeln

Drei Entscheidungen halten das Bild zusammen; wer sie aufweicht, landet
wieder bei einer Seite, die aussieht wie jede andere:

1. **Keine Rubriken-Etiketten.** Über einer Überschrift „Ausgewählte
   Referenzen" steht kein „PROJEKTE". Die einzige verbliebene Vorzeile ist
   die Standortangabe im Hero, und die trägt eine Information.
2. **Keine Versalien.** Nirgends. Kleine Labels werden leise durch
   kursive Serife und graue Farbe, nicht durch gesperrte Großbuchstaben.
3. **Radius und Schatten sind keine Dekoration.** Sie sind gestaffelt
   (`--r` 10 px für Flächen, `--r-xs` 4 px für Bedienelemente) und werden
   sparsam gesetzt. Als jede Karte denselben Radius und denselben Schatten
   trug, war nichts mehr wichtiger als irgendetwas anderes.

Ebenfalls bewusst entfernt: der Pfeil hinter „Details ansehen", das
eingefärbte Einzelwort in der Hero-Überschrift und die Kapselform der
Schlagworte — ein Stichwort ist kein Bedienelement.

**Entfernt: die Referenzleiste unter dem Hero.** Dort standen
„Wasserwirtschaftsamt Rosenheim · Stadtwerke Böhmetal · GIZ Perú" — an
genau der Stelle, an der Websites eine Kundenliste zeigen. Es sind aber
frühere **Arbeitgeber**, keine Auftraggeber, und dieselben drei Namen
stehen weiter unten korrekt unter „Stationen" mit Jahreszahlen. Dazu
benennt das Venn daneben dieselben drei Welten. Die Information stand
also dreimal auf der Seite, und ausgerechnet an der prominentesten Stelle
behauptete sie etwas Falsches. Wer eine Referenzleiste zurückholen will,
braucht echte Auftraggeber und deren Freigabe.

### Die Venn-Diagramme

Zwei Diagramme tragen je ein Argument:

1. **Hero** — Behörde ∩ Betrieb ∩ Internationale Zusammenarbeit. Die Mitte
   ist das Arbeitsfeld. Deckt sich mit den drei Referenzen darunter.
2. **Leistungen** — die sechs Leistungsfelder als **Ring**, nicht als Venn.
   Sechs Kreise überlappen jeweils ihre Nachbarn; in der Mitte bleibt
   Weißraum für „Ressource Wasser". Aussage: sechs Felder, eine Ressource.

   Warum kein Venn mit sechs Mengen: Ein echtes 6-Mengen-Venn müsste 63
   Regionen zeigen und ist mit Kreisen **mathematisch nicht darstellbar**.
   Der Ring behauptet deshalb gar nicht erst, alle Schnittmengen zu zeigen
   — er zeigt Nachbarschaft und eine gemeinsame Mitte.

Das **Hero-Diagramm** ist inzwischen eine von der Auftraggeberin
gestaltete Bilddatei (`assets/img/venn-arbeit.png`) und kein Inline-SVG
mehr. Drei abgerundete Quadrate in der Formensprache der Bildmarke, mit
einer gemeinsamen Mitte, in der „wir" steht.

**Was das kostet:** Der Text im Bild wird **nicht übersetzt** — auf `/en/`
und `/es/` stehen die deutschen Beschriftungen. Der Alternativtext
(`venn1.desc`) wird übersetzt und trägt die Aussage vollständig, das hilft
aber nur Screenreadern und Suchmaschinen. Wer das beheben will, exportiert
die Grafik dreimal; der Generator kann dann je Sprache die passende Datei
einsetzen.

Neu erzeugen nach einer Änderung der Quelldatei:

```bash
cd assets/img && python3 -c "
from PIL import Image
im = Image.open('Unsere Arbeit@300x.png').convert('RGBA')
im = im.crop(im.getbbox()); im.thumbnail((1200,1200), Image.LANCZOS)
im.save('venn-arbeit.png', optimize=True)"
```

Die Farbtoken `--venn-1` bis `--venn-3` gelten nur noch für den Fall, dass
wieder ein SVG-Diagramm eingesetzt wird.

### Der Sechser-Ring (Leistungen)

Geometrie in `index.html`, fest im SVG: Mittelpunkt (280, 280), Ringradius
148, Kreisradius 88, sechs Positionen im 60°-Abstand ab oben, im
Uhrzeigersinn in der Reihenfolge der sechs Karten. Aus `148 − 88 = 60`
ergibt sich das freie Mittelfeld; dort steht `venn2.core1` / `core2`.

Eigene Farbtoken (`--venn6-1` bis `--venn6-6`), **nicht** die des
Hero-Diagramms. Es ist eine **analoge Harmonie** um die Markenfarbe:
sechs Farbtöne im Abstand von 15°, von Grün über die Marke bis Blau,
dazu eine gleichmäßige Helligkeitsrampe. Der Ring liest sich dadurch als
ein Verlauf und nicht als sechs Einzelfarben.

| Token | Wert | Farbton | Feld |
|---|---|---|---|
| `--venn6-1` | `#07872F` | 139° | Grundwasser — hellster |
| `--venn6-2` | `#2B7A57` | 154° | Klima |
| `--venn6-3` | `#207061` | 169° | Analysen |
| `--venn6-4` | `#00666D` | 184° | Projekte — **die Markenfarbe** |
| `--venn6-5` | `#035880` | 199° | Bildung |
| `--venn6-6` | `#0B4898` | 214° | International — dunkelster |

**Bewusster Tausch:** Vorher standen hier sechs Töne im 60°-Abstand (drei
Komplementärpaare). Die waren maximal unterscheidbar, aber laut — Magenta
und Rot direkt neben der Marke. Analoge Töne gehören sichtbar zusammen.
Der Preis: Die Grauwerte liegen enger beieinander (Abstand 8 statt 20+),
im Schwarzweißdruck sind die Nachbarn also kaum zu trennen. Vertretbar,
weil jeder Kreis seine eigene Beschriftung trägt und über seine
**Position** erkennbar bleibt — anders als beim Drei-Mengen-Venn, wo man
Regionen zurückverfolgen muss.

Kontraste mit `--ink`: 9,2–10,4:1 auf den einzelnen Lappen, 6,4–7,8:1 in
den Überlappungen der Nachbarn.

Die Beschriftungen sind **einzelne Wörter** (`venn2.a` bis `venn2.f`) und
müssen in ihren Kreis passen — bei 22 px (Mobil-Schriftgröße) liegt die
Grenze bei etwa 13 Zeichen. Geprüft wird das im Browser mit:

```js
// Konsole auf der Seite
const R=88, cs=[...document.querySelectorAll('.venn--ring .venn__c')]
  .map(c=>({x:+c.getAttribute('cx'),y:+c.getAttribute('cy')}));
document.querySelectorAll('.venn--ring .venn__labels text').forEach((t,i)=>{
  const b=t.getBBox(), d=(p,c)=>Math.hypot(p[0]-c.x,p[1]-c.y);
  const pts=[[b.x,b.y+b.height/2],[b.x+b.width,b.y+b.height/2]];
  if(!pts.every(p=>d(p,cs[i])<R)) console.warn(`"${t.textContent}" ragt heraus`);
  cs.forEach((c,j)=>{ if(j!==i && pts.some(p=>d(p,c)<R))
    console.warn(`"${t.textContent}" ragt in Kreis ${j+1}`); });
});
```

Beschriftungen ändert man in `assets/js/i18n.js` (`venn1.*`, `venn2.*`).
**Achtung:** Die Wörter müssen in ihre Kreisregion passen. Die schmalen
Lappen fassen etwa 9–10 Zeichen, der untere Lappen und die Mitte etwas
mehr. Zu lange Wörter ragen sichtbar heraus. Prüfen lässt sich das im
Browser mit:

```js
// in der Konsole auf der Seite ausführen
const A=[204,190],B=[316,190],C=[260,287],R=130,S={0:A,1:B,2:C};
const d=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
document.querySelectorAll('.venn').forEach((v,vi)=>{
  v.querySelectorAll('.venn__labels text').forEach((t,i)=>{
    const b=t.getBBox(), c=[[b.x,b.y+b.height/2],[b.x+b.width,b.y+b.height/2]];
    const ok=c.every(p=>d(p,S[i])<R)&&[0,1,2].filter(k=>k!==i).every(k=>c.every(p=>d(p,S[k])>R));
    if(!ok) console.warn(`v${vi+1} "${t.textContent}" passt nicht`);
  });
});
```

### Logo

Quelle: `assets/img/Logo Cuadrado@300x.png` (2363 × 2363, freigestellt).
Daraus erzeugt sind alle Ableitungen — beim Austausch des Logos neu bauen:

```bash
cd assets/img && python3 - <<'EOF'
from PIL import Image
src = Image.open('Logo Cuadrado@300x.png').convert('RGBA')
src = src.crop(src.getbbox())          # transparenten Rand wegschneiden
def save(px, name, bg=None):
    im = src.resize((px, px), Image.LANCZOS)
    if bg:
        flat = Image.new('RGBA', (px, px), bg); flat.alpha_composite(im); im = flat
    im.save(name, optimize=True)
save(1024, 'logo.png')
save(180, 'apple-touch-icon.png', (29, 29, 27, 255))   # iOS füllt sonst schwarz
save(192, 'icon-192.png'); save(512, 'icon-512.png')
save(32, 'favicon-32.png'); save(16, 'favicon-16.png')
EOF
```

**Wo es auftaucht:** Kopfzeile (34 px), Fußzeile (72 px), Favicon,
Apple-Touch-Icon, Web-Manifest, OG-Vorschaubild, JSON-LD (`logo`).

**Die Größe ist keine Geschmacksfrage.** Das Logo trägt „consulting" und
„Einfach Wasser" in feiner Kursiver mit. Ab etwa 120 px sind beide lesbar,
bei 64 px wird es knapp, bei 32–40 px sind sie reine Textur — nur „MH"
bleibt erkennbar. Deshalb:

* **Kopfzeile 34 px** — dort steht der Name daneben in Schrift, das Zeichen
  muss ihn nicht wiederholen können.
* **Fußzeile 72 px** — groß genug, dass die Beschriftung mitspielt.
* **Favicon 16/32 px** — „MH" reicht, mehr braucht ein Favicon nie.

Wer das Zeichen kleiner als 64 px einsetzt, sollte wissen, dass zwei
Drittel seines Inhalts dann nicht mehr lesbar sind.

**Farbe:** Das Quadrat ist `#1D1D1B`, die Textfarbe der Seite `--ink`
(`#17211D`). Praktisch nicht zu unterscheiden, aber nicht identisch — wer
das Logo je auf `--ink` legt, sollte einen der beiden Werte angleichen.

### Porträtfoto

`assets/img/portrait.jpg` — 490 × 764 px, aus `CV.png` erzeugt (JPEG, Qualität
88; 627 kB → 103 kB). Die Quelldatei `CV.png` wird nicht mehr gebraucht und
kann gelöscht werden.

Das Bild ist hochformatiger als der Rahmen (`aspect-ratio:4/5`), wird also
beschnitten. Der Anschnitt ist über `object-position:50% 12%` nach oben
gezogen — ein zentrierter Schnitt würde den Kopf abschneiden. Wer das Foto
austauscht, prüft diesen Wert neu: kleiner = mehr Luft über dem Kopf.

Der Alternativtext liegt unter `abt.photoAlt` in allen drei Sprachen und
beschreibt, was zu sehen ist. Sobald der Name feststeht, gehört er
sinnvollerweise hinein („Porträtfoto von … ").

### Schrift

Drei Familien mit je einer klaren Aufgabe, alle selbst gehostet unter
`assets/fonts/` (SIL Open Font License, keine Anfrage an fremde Server):

| Token | Familie | Wofür |
|---|---|---|
| `--sans` | Archivo 500/700 | Überschriften, Wortmarke, alles Bedienbare |
| `--serif` | Source Serif 4 400/400i/600 | Ledes, Fließtext, beschreibende Kleinlabels |
| `--mono` | IBM Plex Mono 400/500 | **nur** echte Messwerte — Pegel, Kennzahlen |

**Die wichtigste Regel: Prosa trägt die Serife, Bedienung trägt die
Grotesk.** Was man liest, ist Source Serif; was man anklickt oder tippt,
ist Archivo. Ohne diese Trennung sieht die Seite beliebig aus.

Praktische Falle: `body` steht auf `--serif`, also erbt **jedes**
`font-family:inherit` die Serife — auch Schaltflächen und Eingabefelder.
Deshalb steht die Zuordnung in **einer** Regel weit oben in `style.css`
(Selektorliste `.nav a, .btn, …`) und in den Einzelregeln darunter darf
kein `font-family:inherit` mehr stehen, sonst gewinnt die spätere Regel.

Die Größen kommen aus einer modularen Skala (Quart, 1,333) und liegen als
`--t-xs` bis `--t-h1` in `:root`. Wer eine Größe ändert, ändert den Token,
nicht die Einzelregel.

Der Mono-Schnitt ist bewusst knapp gehalten: Er bezeichnet Zahlen, die
gemessen wurden. Sobald er für gewöhnliche Kleinlabels benutzt wird,
verliert er diese Bedeutung.

---

## Kontaktformular

Es gibt **kein Backend**. Das Formular prüft die Eingaben im Browser und öffnet
danach das E-Mail-Programm der Besucherin mit fertig ausgefüllter Nachricht.
Vorteil: keine Serverkosten, kein Formular-Dienstleister, keine Cookies.
Nachteil: es verschickt sich nicht von allein — die Besucherin muss die
fertige E-Mail in ihrem Programm noch abschicken.

Empfängeradresse setzen in `assets/js/main.js`:

```js
var MAILTO = 'consulting_mhuber@gmx.net';
```

Die Adresse steht an **neun** Stellen und ist überall eingetragen: drei
`mailto:`-Links samt sichtbarem Text in `index.html`, `MAILTO` in
`main.js`, `ph.mail` in allen drei Sprachpaketen, sowie Impressum und
Datenschutzerklärung. Bei einem Wechsel alle neun mitziehen:

```bash
grep -rn "consulting_mhuber@gmx.net" index.html impressum.html \
  datenschutz.html assets/js/
```

### Entscheidung: kein Formulardienst

Anfragen kommen **direkt per E-Mail** an. Ein Formulardienst (Formspree,
Netlify Forms oder ähnliches) ist ausdrücklich **nicht** vorgesehen. Das ist
in Abschnitt 4 der Datenschutzerklärung so zugesichert — wer daran etwas
ändert, muss den Abschnitt mitziehen: Anbieter, Rechtsgrundlage,
Auftragsverarbeitungsvertrag und gegebenenfalls Drittlandübermittlung.

Was das praktisch heißt:

* Die Angaben verlassen das Gerät der Besucherin erst, wenn sie die
  vorbereitete E-Mail **selbst abschickt**. Wer das Fenster schließt,
  hinterlässt keine Spur — auch bei uns nicht.
* Abgebrochene Anfragen sind unsichtbar. Es gibt keine Statistik darüber,
  wie viele Leute das Formular ausgefüllt und dann doch nicht gesendet
  haben.
* Es gibt keinen Spam-Filter vor dem Postfach und kein Rate-Limit — die
  Adresse steht offen auf der Seite. Falls das später zum Problem wird, ist
  der richtige Hebel der Spam-Filter des E-Mail-Anbieters, nicht ein
  Formulardienst.

### Zu klären: Auftragsverarbeitung für das Postfach

Die Anfragen landen in einem GMX-Postfach (1&1 Mail & Media GmbH). Für die
kostenfreien GMX-Produkte gibt es in der Regel **keinen
Auftragsverarbeitungsvertrag** nach Art. 28 DSGVO. Wer damit geschäftliche
Korrespondenz mit personenbezogenen Daten von Auftraggebern führt, sollte
das prüfen und gegebenenfalls auf ein Geschäftskundenprodukt mit AVV oder
ein Postfach auf eigener Domain wechseln. Beim Wechsel ändern sich die neun
oben genannten Stellen und Abschnitt 4 der Datenschutzerklärung.

---

## Datenschutz

Die Seite lädt **nichts** von fremden Servern: keine Web-Schriften, keine
Analytics, keine Cookies, keine Consent-Banner. Es werden ausschließlich
Systemschriften verwendet. (Die Einbindung von Google Fonts über deren CDN
gilt in Deutschland seit dem Urteil des LG München I von 2022 als
abmahnfähig — deshalb wird sie hier bewusst vermieden.)

Wird später etwas Externes eingebunden — Karten, Videos, Schriftdienste,
Analytics — muss die Datenschutzerklärung angepasst werden, und je nach Dienst
ist eine Einwilligung vor dem Laden nötig.

---

## Wo die Seite liegt

**Live:** <https://chrixco.github.io/mh-consulting/>
**Repository:** <https://github.com/Chrixco/mh-consulting> (öffentlich, Branch `main`)

GitHub Pages liefert direkt aus `main`, Wurzelverzeichnis. Jeder `git push`
ist eine Veröffentlichung — es gibt keine Vorschau-Stufe.

Weil `Chrixco.github.io` schon vergeben ist, läuft die Seite als
**Projektseite** unter einem Unterpfad. Deshalb sind alle internen Verweise
relativ (`./`, `en/`, `../assets/`) und nicht wurzel-absolut — sonst bricht
alles, was nicht im Domain-Wurzelverzeichnis liegt. Beim Umzug auf die echte
Domain funktioniert das unverändert weiter.

---

## ⚠️ Vor dem echten Start abarbeiten

Die Seite steht bewusst auf **`noindex,nofollow`**, solange Platzhalter
drinstehen. Ohne das würde Google „[TELEFON EINTRAGEN]" und die leeren
Referenz-Vorlagen indexieren.

| # | Zu tun | Wo |
|---|---|---|
| 1 | `noindex`-Zeile löschen | `index.html`, danach `node tools/build-langs.js` |
| 2 | Telefon, Straße, PLZ eintragen | `i18n.js` → `ph.*`, beide Rechtstexte |
| 3 | Echte Referenzen statt Vorlagen | `i18n.js` → `prj.*`, danach `prj.note` löschen |
| 4 | Impressum vervollständigen | Umsatzsteuer, Berufsbezeichnung, Kammer, Haftpflicht |
| 5 | Aufsichtsbehörde eintragen | `datenschutz.html` |
| 6 | **Google-Mess-ID** eintragen | `assets/js/consent.js` → `G-XXXXXXXXXX` |
| 7 | **AVV mit Google** abschließen | sonst ist die Messung nicht zulässig |
| 8 | **Cal.com-Link** eintragen | `index.html` → `id="talk-book"` |
| 9 | **AVV mit Cal.com** abschließen | plus Anbieter in `datenschutz.html` benennen |
| 10 | Echte Domain setzen | siehe unten, danach `CNAME` anlegen |
| 11 | Search Console verifizieren | Meta im `<head>` ist auskommentiert vorbereitet |

**Zu 6:** Solange `G-XXXXXXXXXX` drinsteht, lädt Google Analytics
**gar nicht** — auch nach Zustimmung nicht. Das ist Absicht: Ein Banner,
das Zustimmung einsammelt und dann nichts lädt, ist harmloser als eines,
das versehentlich vor Vertragsschluss misst.

### Wie die Einwilligung funktioniert

`assets/js/consent.js` fragt beim ersten Besuch. Erst nach Klick auf
„Einverstanden" wird das Google-Skript nachgeladen — vorher steht kein
`gtag`-Schnipsel im HTML. Ablehnen ist gleich groß und gleich erreichbar
(alles andere wäre unwirksam), und der Fußzeilen-Link *Messung-Einstellung*
(`data-consent-reset`) öffnet die Frage jederzeit erneut.

Gespeichert wird genau ein Wert: `hc.consent` = `granted` | `denied`. Ohne
ihn müsste bei jedem Aufruf neu gefragt werden; er ist damit nach
§ 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei.

### Terminbuchung

Der Knopf im Erstgespräch-Fenster ist ein **ausgehender Link**, keine
Einbettung. Das ist der Grund, warum dafür keine Einwilligung nötig ist:
Es werden erst Daten übertragen, wenn jemand dem Link folgt. Eingebettet
wäre Cal.com ein Drittanbieter im Seitenkontext — dann bräuchte es das
Banner auch dafür.

Der kostenlose Einzelplatz-Tarif reicht für ein Erstgespräch; die
Buchungsseite trägt dann Cal.com-Branding und liegt unter `cal.com/…`.

---

## Domain und Sprach-URLs

### Die Platzhalter-Domain

Überall steht **`https://www.mh-consulting.de`** als Platzhalter. Sobald die
echte Domain feststeht, an genau diesen Stellen ersetzen:

```bash
grep -rln "www.mh-consulting.de" --include="*.html" --include="*.xml" \
  --include="*.txt" --include="*.js" . \
  | xargs sed -i '' 's|www\.mh-consulting\.de|ECHTE-DOMAIN\.de|g'
node tools/build-langs.js      # Sprachseiten neu erzeugen
```

Betroffen sind `index.html` (canonical, hreflang, og:url, JSON-LD),
`sitemap.xml`, `robots.txt` und `tools/build-langs.js`.

**Die Datei `CNAME` ist bewusst noch nicht angelegt.** GitHub Pages liefert
die Seite nur noch unter der dort eingetragenen Domain aus — steht die DNS
nicht, ist die Seite gar nicht erreichbar. Also erst DNS setzen, dann
`CNAME` mit der Domain anlegen.

`.nojekyll` liegt bereits im Wurzelverzeichnis: Ohne die Datei ignoriert
GitHub Pages Ordner, deren Name mit einem Unterstrich beginnt.

### Warum es /en/ und /es/ als eigene Seiten gibt

Vorher wurden die Übersetzungen erst im Browser eingesetzt. Eine
Suchmaschine sieht kein JavaScript-Ergebnis, sondern das ausgelieferte
HTML — sie hat also **nur die deutsche Fassung** gesehen. Englisch und
Spanisch waren nicht auffindbar, obwohl das Leistungsangebot ausdrücklich
mit Arbeit in Lateinamerika und drei Arbeitssprachen wirbt.

Jetzt hat jede Sprache eine eigene Adresse mit fest eingebautem Text:

| URL | Sprache | Datei |
|---|---|---|
| `/` | Deutsch | `index.html` — **die Quelle** |
| `/en/` | Englisch | erzeugt |
| `/es/` | Spanisch | erzeugt |

**`index.html` und `assets/js/i18n.js` bleiben die einzige Quelle.** Nach
jeder Text- oder Struktur­änderung neu erzeugen:

```bash
node tools/build-langs.js
```

Das Skript meldet fehlende Übersetzungsschlüssel und bricht dann ab — eine
halb übersetzte Seite entsteht so nicht. Es braucht nur Node, keine
Abhängigkeiten.

Die Sprachwahl in der Kopfzeile besteht jetzt aus **echten Links**, nicht
mehr aus Schaltflächen. Folgen: Jede Sprache ist teilbar und verlinkbar,
funktioniert ohne JavaScript — und die Seite muss sich die Sprachwahl
nicht mehr merken. Deshalb steht in der Datenschutzerklärung jetzt, dass
auf dem Gerät **nichts** gespeichert wird.

### Was für Suchmaschinen sonst noch da ist

* `sitemap.xml` mit `hreflang`-Verweisen zwischen allen drei Fassungen
* `robots.txt` mit Verweis auf die Sitemap
* `<link rel="canonical">` und `hreflang`-Alternativen in jeder Fassung
* **JSON-LD** (`ProfessionalService`) mit Leistungskatalog, Arbeitssprachen,
  Einzugsgebiet und LinkedIn-Profil
* Open-Graph- und Twitter-Karte samt Vorschaubild `assets/img/og.jpg`
  (1200 × 630) — ohne das Bild erscheint beim Teilen eine leere Karte
* `404.html`
* **Platzhalter für die Google Search Console:** auskommentiertes
  `google-site-verification`-Meta im `<head>` von `index.html`

---

## Veröffentlichen

Der Ordner ist direkt hochladbar — kein Build.

* **Netlify / Cloudflare Pages:** Ordner ins Fenster ziehen, fertig.
* **GitHub Pages:** Repository anlegen, Pages auf den Branch stellen.
* **Klassisches Webhosting:** per FTP hochladen.

Nicht mitveröffentlichen: `Background/` (Quellmaterial), `README.md`,
`.DS_Store`. **`assets/fonts/` gehört mit hoch** — ohne den Ordner fällt die
Seite auf Systemschriften zurück.

```bash
# .DS_Store entfernen
find . -name ".DS_Store" -delete
```

---

## Responsive Verhalten

Kein CSS-Framework. Die Seite benutzt Grid, `clamp()` und Design-Tokens —
also genau das, was Bootstrap oder Tailwind kapseln. Ein Framework würde
entweder einen Build-Schritt erzwingen (den es hier bewusst nicht gibt),
ein fremdes Erscheinungsbild mitbringen oder über ein CDN die
Datenschutz-Zusage brechen. Bei einer Seite dieser Größe ist der Nutzen
negativ.

### Haltepunkte

| Breite | Was passiert |
|---|---|
| ≤ 380 px | Kopfzeile geschnürt: kleinere Wortmarke, Trennstrich weg, `--pad` auf 1rem |
| ≤ 520 px | Kontaktliste stapelt Label über Wert |
| ≤ 760 px | Burger-Menü, Projektzeilen einspaltig, Formular einspaltig, Claim weg |
| ≤ 1000 px | Kontaktbereich einspaltig |
| ≥ 720 px | Leistungskarten zweispaltig |
| ≥ 900 px | „Erstgespräch" in der Kopfzeile sichtbar |
| ≥ 1080 px | Hero zweispaltig |
| ≥ 1180 px | **Pegel** erscheint, `body` rückt um `--rail` ein |

Alles andere skaliert stufenlos über `clamp()` — Schriftgrößen (`--t-*`)
und Innenabstand (`--pad`). Wer eine Größe ändert, ändert den Token.

### Wie geprüft wurde

Eine Wegwerf-Seite mit `<iframe>`s in zwölf Breiten (320 bis 1920) im
Projektordner, die je Rahmen Überlauf, Schriftgrößen unter 11 px und
Tap-Ziele unter 32 px meldet. Das ist zuverlässiger als Augenmaß und
findet genau die Fälle, die man beim Durchscrollen übersieht.

**Gefunden und behoben:**

* **38 px Überlauf bei 320 px.** Die Kontaktliste hatte eine feste
  6,5rem-Spalte, daneben zwang die unumbrechbare Adresse
  `consulting_mhuber@gmx.net` eine 218-px-Spalte — zusammen 338 px in
  einem 320-px-Fenster. Jetzt `minmax(0,1fr)`, `overflow-wrap:anywhere`
  und unter 520 px gestapelt.
* **Schrift unter 11 px** bei den Kontakt-Labels und in der Fußzeile:
  Spätere Regeln hatten die Größe wieder auf ~10 px gedrückt.
* **Tap-Ziele:** Einwilligungs-Kästchen von 18 auf 24 px, Sprachwahl auf
  mindestens 32 px Höhe, Wortmarke auf 48 px, Fußzeilenlinks mit Polster.

**Eine Einschränkung:** Das Aufklappen des Mobilmenüs ließ sich nicht auf
einem echten schmalen Viewport prüfen — im iframe stehen CSS-Übergänge
still (`currentTime:0`), und das Browserfenster ließ sich nicht
verkleinern. Mit abgeschaltetem Übergang springt `.nav.is-open` korrekt
auf `transform:none`, die Regel stimmt also. Ein Test auf einem echten
Gerät wäre trotzdem sinnvoll.

---

## Barrierefreiheit & Technik

* Tastaturbedienbar, sichtbarer Fokus, Skip-Link.
* `prefers-reduced-motion` wird respektiert — Animationen entfallen dann.
* Sprache wird aus `?lang=de|en|es`, `localStorage` oder der Browsersprache
  gewählt und setzt `<html lang>` korrekt.
* Getestet in Chrome bei 390 px und 1440 px Breite.
