/* MH Consulting — Einwilligung und Reichweitenmessung
 *
 * Google Analytics setzt Cookies und überträgt Daten in die USA. Nach
 * § 25 TDDDG braucht das eine aktive Zustimmung, und zwar BEVOR etwas
 * geladen wird. Deshalb steht hier kein gtag-Schnipsel im HTML: Das
 * Skript wird erst nach einem Klick auf „Einverstanden" nachgeladen.
 *
 * Ablehnen ist genauso leicht wie Zustimmen — das verlangt die DSGVO,
 * und ein Banner, das den Ausweg versteckt, ist ohnehin unwirksam.
 *
 * Gespeichert wird genau ein Wert: die Entscheidung selbst. Ohne ihn
 * müsste bei jedem Seitenaufruf erneut gefragt werden.
 */
(function () {
  'use strict';

  var GA_ID = 'G-0WRHW0K8TY';           // Mess-ID der Property
  var KEY   = 'hc.consent';
  var LANGS = window.I18N || {};
  var lang  = (document.documentElement.lang || 'de').slice(0, 2);
  var pack  = LANGS[lang] || LANGS.de || {};
  var t = function (k) { return pack[k] || (LANGS.de && LANGS.de[k]) || k; };

  function read()  { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v){ try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    // Zweite Sicherung: Ohne gültige Mess-ID wird nichts geladen. So kann
    // ein halb eingerichteter Zustand nicht versehentlich messen.
    if (window.__gaLoaded || !/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function close(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  function banner() {
    var box = document.createElement('div');
    box.className = 'consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', t('cns.title'));

    var h = document.createElement('p');
    h.className = 'consent__text';
    h.textContent = t('cns.text');

    var link = document.createElement('a');
    link.href = (lang === 'de' ? '' : '../') + 'datenschutz.html';
    link.textContent = t('cns.more');
    h.appendChild(document.createTextNode(' '));
    h.appendChild(link);

    var row = document.createElement('div');
    row.className = 'consent__actions';

    var no = document.createElement('button');
    no.type = 'button'; no.className = 'btn'; no.textContent = t('cns.deny');
    no.addEventListener('click', function () { write('denied'); close(box); });

    var yes = document.createElement('button');
    yes.type = 'button'; yes.className = 'btn btn--solid'; yes.textContent = t('cns.allow');
    yes.addEventListener('click', function () { write('granted'); loadGA(); close(box); });

    row.appendChild(no); row.appendChild(yes);
    box.appendChild(h); box.appendChild(row);
    document.body.appendChild(box);
    no.focus();
  }

  var state = read();
  if (state === 'granted') loadGA();
  else if (state !== 'denied') banner();

  // Widerruf: Der Link in der Fußzeile öffnet die Frage erneut.
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-consent-reset]');
    if (!trigger) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (err) {}
    if (!document.querySelector('.consent')) banner();
  });
})();
