#!/usr/bin/env node
/* Erzeugt /en/index.html und /es/index.html aus index.html + i18n.js.
 *
 * Warum überhaupt: Solange die Übersetzungen erst im Browser eingesetzt
 * werden, sieht eine Suchmaschine nur die deutsche Fassung — Englisch und
 * Spanisch wären unauffindbar. Hier wird der Text fest ins HTML gebacken,
 * jede Sprache bekommt eine eigene URL.
 *
 * Einzige Quelle bleibt assets/js/i18n.js. Nach jeder Textänderung:
 *     node tools/build-langs.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://mh-consulting-wasser.de';
const LANGS = { en: 'en_GB', es: 'es_ES' };

global.window = {};
require(path.join(ROOT, 'assets/js/i18n.js'));
const I18N = global.window.I18N;

const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const escText = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function build(lang) {
  const pack = I18N[lang];
  if (!pack) throw new Error('Kein Sprachpaket: ' + lang);
  let h = src;
  let replaced = 0, missing = [];

  const val = key => {
    if (Object.prototype.hasOwnProperty.call(pack, key)) return pack[key];
    missing.push(key);
    return I18N.de[key];
  };

  // 1. Textinhalte:  data-i18n="key">…<
  h = h.replace(/(data-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/)/g, (m, open, key, _old, close) => {
    replaced++; return open + escText(val(key)) + close;
  });

  // 2. HTML-Inhalte: data-i18n-html="key">…<
  h = h.replace(/(data-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/)/g, (m, open, key, _old, close) => {
    replaced++; return open + val(key) + close;
  });

  // 3. Attribute:    data-i18n-attr="content:meta.desc,aria-label:nav.lang"
  h = h.replace(/<([a-zA-Z0-9-]+)([^>]*?)data-i18n-attr="([^"]+)"([^>]*)>/g,
    (m, tag, pre, spec, post) => {
      let attrs = pre + ' data-i18n-attr="' + spec + '" ' + post;
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(x => x.trim());
        if (!attr || !key) return;
        const re = new RegExp('\\s' + attr + '="[^"]*"');
        const rep = ' ' + attr + '="' + escAttr(val(key)) + '"';
        attrs = re.test(attrs) ? attrs.replace(re, rep) : attrs + rep;
        replaced++;
      });
      return '<' + tag + attrs.replace(/\s+/g, ' ').replace(/\s+$/, '') + '>';
    });

  // 4. Sprache des Dokuments
  h = h.replace('<html lang="de">', '<html lang="' + lang + '">');

  // 5. Relative Pfade: die Seite liegt eine Ebene tiefer
  h = h.replace(/(href|src)="assets\//g, '$1="../assets/');
  h = h.replace(/href="(impressum|datenschutz)\.html"/g, 'href="../$1.html"');
  h = h.replace(/href="site\.webmanifest"/g, 'href="../site.webmanifest"');

  // 6. Kanonisch, og:url, Sprachkennung
  h = h.replace(/<link rel="canonical" href="[^"]*">/,
                '<link rel="canonical" href="' + BASE + '/' + lang + '/">');
  h = h.replace(/<meta property="og:url" content="[^"]*">/,
                '<meta property="og:url" content="' + BASE + '/' + lang + '/">');
  h = h.replace(/<meta property="og:locale" content="[^"]*">/,
                '<meta property="og:locale" content="' + LANGS[lang] + '">');

  // 7. Sprachwahl komplett neu schreiben. Relative Pfade, damit die Seite
  //    sowohl unter einer eigenen Domain als auch unter
  //    benutzer.github.io/repo/ funktioniert.
  const HREF = { de: '../', en: '../en/', es: '../es/' };
  HREF[lang] = './';
  const links = ['de', 'en', 'es'].map(l =>
    '      <a href="' + HREF[l] + '" hreflang="' + l + '"' +
    (l === lang ? ' aria-current="true"' : '') + '>' + l.toUpperCase() + '</a>'
  ).join('\n');
  h = h.replace(/(<div class="lang"[^>]*>)([\s\S]*?)(<\/div>)/,
                (m, open, _inner, close) => open + '\n' + links + '\n    ' + close);

  // 8. JSON-LD: url und @id auf die Sprachfassung
  h = h.replace(/"@id": "[^"]*#organisation"/, '"@id": "' + BASE + '/#organisation"');

  return { html: h, replaced, missing: [...new Set(missing)] };
}

/* ── Wächter: nur eine Empfängeradresse im ganzen Haus ────────────────
   Die Adresse steht an sechzehn Stellen: im Formularversand, in den
   Kontaktangaben, im Impressum, in der Datenschutzerklärung und in den
   Formulartexten. Wird sie einmal geändert und irgendwo vergessen,
   schickt jemand seine Anfrage ins Leere, ohne dass es auffällt.
   Deshalb bricht der Bau ab, sobald zwei verschiedene auftauchen. */
const MAILTO = (fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8')
  .match(/var MAILTO = '([^']+)'/) || [])[1];
if (!MAILTO) {
  console.error('MAILTO in assets/js/main.js nicht gefunden — Wächter kann nicht prüfen.');
  process.exit(1);
}

const RE_MAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const fremde = new Map();
for (const datei of ['index.html', 'impressum.html', 'datenschutz.html', 'assets/js/i18n.js']) {
  const text = fs.readFileSync(path.join(ROOT, datei), 'utf8');
  for (const treffer of text.match(RE_MAIL) || []) {
    if (treffer !== MAILTO) {
      if (!fremde.has(treffer)) fremde.set(treffer, new Set());
      fremde.get(treffer).add(datei);
    }
  }
}
if (fremde.size) {
  console.error(`\nFremde E-Mail-Adressen gefunden (erwartet wird ${MAILTO}):`);
  for (const [adresse, dateien] of fremde) console.error(`  ${adresse} — in ${[...dateien].join(', ')}`);
  process.exit(1);
}

let fail = false;
for (const lang of Object.keys(LANGS)) {
  const { html, replaced, missing } = build(lang);
  const dir = path.join(ROOT, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`/${lang}/index.html — ${replaced} Stellen ersetzt` +
    (missing.length ? `, FEHLENDE SCHLÜSSEL: ${missing.join(', ')}` : ''));
  if (missing.length) fail = true;
}
if (fail) { console.error('\nFehlende Übersetzungen — bitte in i18n.js ergänzen.'); process.exit(1); }

console.log('Fertig.');
