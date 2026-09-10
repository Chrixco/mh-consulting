/* MH Consulting — behaviour
   Language switching, Pegel scroll rail, reveals, contact form. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var DICT   = window.I18N || {};
  var LANGS  = ['de', 'en', 'es'];
  /* Die Sprache steht in <html lang> und wird nicht mehr im Browser
     gemerkt: Jede Sprache hat eine eigene URL (/, /en/, /es/). Das ist
     teilbar, indexierbar — und die Seite legt nichts mehr auf dem Gerät ab. */
  var current = (document.documentElement.lang || 'de').slice(0, 2).toLowerCase();
  if (LANGS.indexOf(current) === -1) current = 'de';

  /* ── i18n ─────────────────────────────────────────────── */
  function t(key) {
    var pack = DICT[current] || {};
    return Object.prototype.hasOwnProperty.call(pack, key) ? pack[key] : (DICT.de[key] || key);
  }

  // Does a key exist at all? German is the reference, so a key missing there
  // counts as absent even if a translation happens to carry it.
  function has(key) {
    return Object.prototype.hasOwnProperty.call(DICT.de || {}, key);
  }

  function applyLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = 'de';
    current = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    // data-i18n-attr="content:meta.desc" or several, comma separated
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });

    document.title = t('meta.title');
    if (typeof openService !== 'undefined' && openService) fillModal(openService);
  }

  /* Der Text steht bereits in der richtigen Sprache im HTML. Der Lauf hier
     ist nur die Rückfallebene, falls eine Seite ohne gebackenen Text
     ausgeliefert wird — und er setzt die übersetzten Attribute. */
  applyLang(current);

  /* ── Mobile navigation ────────────────────────────────── */
  var burger = document.getElementById('burger');
  var nav    = document.getElementById('nav');

  function closeNav() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ── Cozy in-page scrolling ───────────────────────────────
     Native smooth scrolling is quick and uniform. This eases in and
     settles out, takes longer for longer trips, offsets for the sticky
     header, and hands control straight back the moment the user
     touches the wheel, a key or the screen. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var scrollRAF = null;
  var pendingGlide = null;   // {target, done} while an animation is in flight

  function headerOffset() {
    var m = document.querySelector('.masthead');
    return (m ? m.getBoundingClientRect().height : 0) + 18;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function cancelRAF() {
    if (scrollRAF) { cancelAnimationFrame(scrollRAF); scrollRAF = null; }
  }

  // The user took over: abandon the trip, do not yank them to the target.
  function stopScroll() { cancelRAF(); pendingGlide = null; }

  // requestAnimationFrame is frozen in a background tab, which would strand
  // the scroll half-way and never run its callback. Land it immediately.
  function finishGlide() {
    if (!pendingGlide) return;
    var p = pendingGlide;
    pendingGlide = null;
    cancelRAF();
    window.scrollTo(0, p.target);
    if (p.done) p.done();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) finishGlide();
  });

  function glideTo(targetY, done) {
    stopScroll();
    var max = document.documentElement.scrollHeight - window.innerHeight;
    targetY = Math.max(0, Math.min(targetY, max));
    var startY = window.scrollY;
    var dist = targetY - startY;

    if (Math.abs(dist) < 2 || reduceMotion.matches || document.hidden) {
      window.scrollTo(0, targetY);
      if (done) done();
      return;
    }

    pendingGlide = { target: targetY, done: done };

    // Long jumps get more time, but never drag.
    var dur = Math.min(1150, Math.max(460, Math.abs(dist) * 0.5));
    var t0 = null;

    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      window.scrollTo(0, startY + dist * easeInOutCubic(p));
      if (p < 1) { scrollRAF = requestAnimationFrame(step); }
      else { scrollRAF = null; pendingGlide = null; if (done) done(); }
    }
    scrollRAF = requestAnimationFrame(step);
  }

  // Any deliberate scroll input cancels the animation immediately.
  var TAKEOVER_KEYS = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '];
  window.addEventListener('wheel', stopScroll, { passive: true });
  window.addEventListener('touchstart', stopScroll, { passive: true });
  window.addEventListener('keydown', function (e) {
    if (TAKEOVER_KEYS.indexOf(e.key) > -1) stopScroll();
  }, { passive: true });

  // Scroll targets must be ordinary in-flow elements. A sticky or fixed
  // element reports its *painted* position — for the stuck masthead that
  // tracks the scroll, so measuring it would only ever move by the header
  // offset. That is why #top is its own element above the header.
  function glideToId(id, done) {
    var target = document.getElementById(id);
    if (!target) return false;
    glideTo(target.getBoundingClientRect().top + window.scrollY - headerOffset(), function () {
      try { history.replaceState(null, '', '#' + id); } catch (e) {}
      // Keyboard users should land inside the section, without a second jump.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (done) done();
    });
    return true;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      // Buttons that open a panel handle their own click.
      if (a.hasAttribute('data-opens-talk') || a.hasAttribute('data-opens-write')) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      if (glideToId(id)) e.preventDefault();
    });
  });

  /* ── Pegel rail: scroll depth as water level ──────────── */
  var level = document.querySelector('.gauge__level');
  var ticking = false;

  function readLevel() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (level) level.style.setProperty('--fill', Math.min(100, Math.max(0, pct)) + '%');
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(readLevel); }
  }, { passive: true });
  readLevel();

  /* ── Section highlighting in the nav ──────────────────── */
  var sections = ['leistungen', 'projekte', 'profil', 'kontakt']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        nav.querySelectorAll('a').forEach(function (a) {
          a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id));
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── Reveals ──────────────────────────────────────────── */
  var revealTargets = document.querySelectorAll(
    '.band__head, .card, .case, .profile__portrait, .profile__text, .contact__pitch, .form, .disclaimer'
  );
  revealTargets.forEach(function (el, i) {
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--d', (i % 3) * 70 + 'ms');
  });

  if ('IntersectionObserver' in window) {
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el) { reveal.observe(el); });

    // Failsafe: content must never stay invisible if the observer misses.
    window.setTimeout(function () {
      revealTargets.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    }, 1200);

    var venns = document.querySelectorAll('.venn');
    var vObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.2 });

    venns.forEach(function (v) {
      // Above the fold on load: draw straight away rather than waiting.
      if (v.getBoundingClientRect().top < window.innerHeight) {
        requestAnimationFrame(function () { v.classList.add('is-in'); });
      } else {
        vObs.observe(v);
      }
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('.venn').forEach(function (v) { v.classList.add('is-in'); });
  }

  var note = document.getElementById('form-note');

  /* ── Write & send dialog ──────────────────────────────────
     The end of every dialog path: compose the message here rather
     than sending the reader back down the page. */
  var write        = document.getElementById('write-modal');
  var writeClose   = document.getElementById('write-close');
  var writeNote    = document.getElementById('write-note');
  var writeReturn  = null;
  var DEFAULT_TOPIC = 'erstgespraech';
  var topicTouched  = false;   // did the reader pick a topic themselves?

  function openWrite(opts) {
    opts = opts || {};
    writeReturn = opts.returnTo || null;

    var wf = fieldsOf(document.getElementById('write-form'));
    // An explicit path (a service card) always wins. Otherwise fall back to
    // the first-call category — unless the reader already chose one.
    if (opts.topic) { wf.topic.value = opts.topic; topicTouched = false; }
    else if (!topicTouched) { wf.topic.value = DEFAULT_TOPIC; }

    var prefilled = false;
    if (opts.prefill && isUntouchedPrefill(wf.message.value)) {
      wf.message.value = opts.prefill;
      prefilled = true;
    }

    setNote(writeNote, prefilled ? t('ui.prefilled') : '', prefilled ? 'ok' : '');

    if (typeof write.showModal === 'function') write.showModal();
    else write.setAttribute('open', '');

    // Land where there is something to do: after the prefill, or at the top.
    if (prefilled) {
      wf.message.focus();
      wf.message.setSelectionRange(wf.message.value.length, wf.message.value.length);
    } else {
      wf.name.focus();
    }
  }

  function closeWrite() {
    if (typeof write.close === 'function') write.close();
    else write.removeAttribute('open');
  }

  if (write) {
    var wTopicSel = document.getElementById('w-topic');
    if (wTopicSel) {
      wTopicSel.addEventListener('change', function () { topicTouched = true; });
    }
    document.querySelectorAll('[data-opens-write]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        closeNav();
        openWrite({ returnTo: el });
      });
    });

    writeClose.addEventListener('click', closeWrite);
    write.addEventListener('click', function (e) { if (e.target === write) closeWrite(); });
    write.addEventListener('close', function () {
      if (writeReturn) { writeReturn.focus(); writeReturn = null; }
    });
  }

  /* ── Erstgespräch dialog ──────────────────────────────────
     A quiet explanation of what the first call is, offered by the two
     buttons that promise one. Its own CTA just opens the form — the
     dialog exists to lower the barrier, not to push. */
  var talk       = document.getElementById('talk-modal');
  var talkClose  = document.getElementById('talk-close');
  var talkCta    = document.getElementById('talk-cta');
  var talkReturn = null;

  function openTalk(trigger) {
    talkReturn = trigger || null;
    if (typeof talk.showModal === 'function') talk.showModal();
    else talk.setAttribute('open', '');
    talkClose.focus();
  }

  function closeTalk() {
    if (typeof talk.close === 'function') talk.close();
    else talk.removeAttribute('open');
  }

  if (talk) {
    talkClose.addEventListener('click', closeTalk);
    talk.addEventListener('click', function (e) { if (e.target === talk) closeTalk(); });
    talk.addEventListener('close', function () {
      if (talkReturn) { talkReturn.focus(); talkReturn = null; }
    });

    document.querySelectorAll('[data-opens-talk]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        closeNav();
        openTalk(el);
      });
    });

    talkCta.addEventListener('click', function () {
      var back = talkReturn;      // hand the original trigger along
      closeTalk();
      openWrite({ returnTo: back });
    });
  }

  /* ── Service detail dialog ────────────────────────────────
     One <dialog> reused by all six cards; contents come from the
     dictionary so it follows the language switcher. */
  var modal   = document.getElementById('svc-modal');
  var mClose  = document.getElementById('modal-close');
  var mCta    = document.getElementById('modal-cta');
  var openService = null;          // '1'..'6' while the dialog is open
  var lastReturn  = null;          // element to restore focus to

  function fillModal(n) {
    document.getElementById('modal-title').textContent   = t('svc.' + n + 't');
    document.getElementById('modal-lede').textContent    = t('svc.' + n + 'd');
    document.getElementById('modal-deliver').textContent = t('dlg.deliver');
    document.getElementById('modal-hint').textContent    = t('dlg.hint');
    mCta.textContent = t('dlg.cta');

    // The lists differ in length from service to service, so run until a
    // key is missing rather than assuming a fixed count.
    var list = document.getElementById('modal-list');
    list.textContent = '';
    for (var i = 1; has('svc.' + n + 'l' + i); i++) {
      var li = document.createElement('li');
      li.textContent = t('svc.' + n + 'l' + i);
      list.appendChild(li);
    }
  }

  function openModal(btn) {
    openService = btn.dataset.service;
    lastReturn = btn;
    fillModal(openService);
    mCta.dataset.topic = btn.dataset.topic;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');       // very old browsers
    mClose.focus();
  }

  function closeModal() {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  }

  document.querySelectorAll('.card__more').forEach(function (b) {
    b.addEventListener('click', function () { openModal(b); });
  });

  if (modal) {
    mClose.addEventListener('click', closeModal);
    // Clicking the backdrop (i.e. the dialog itself, outside the box) closes it.
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener('close', function () {
      openService = null;
      if (lastReturn) { lastReturn.focus(); lastReturn = null; }
    });
  }

  /* ── Dialog CTA → contact form, pre-filled and still editable ── */
  var PREFILL_KEYS = ['svc.1pre', 'svc.2pre', 'svc.3pre',
                     'svc.4pre', 'svc.5pre', 'svc.6pre'];

  function isUntouchedPrefill(value) {
    if (!value.trim()) return true;
    // Also treat a prefill from another service (any language) as replaceable,
    // so switching cards does not strand stale text.
    return LANGS.some(function (l) {
      return PREFILL_KEYS.some(function (k) {
        var p = (DICT[l] || {})[k];
        return p && value.trim() === p.trim();
      });
    });
  }

  if (mCta) {
    mCta.addEventListener('click', function () {
      var n = openService;
      var back = lastReturn;
      closeModal();
      openWrite({
        topic:    mCta.dataset.topic,
        prefill:  t('svc.' + n + 'pre'),
        returnTo: back
      });
    });
  }

  /* ── Enquiry forms ────────────────────────────────────────
     Two forms share one implementation: the one on the page and the
     one inside the write dialog. Fields are found by name, so the
     markup can differ without the logic caring.

     No backend: the message is composed into a mailto: so it leaves
     from the sender's own mail client. See README.md to swap in a
     real endpoint. */
  var MAILTO = 'consulting_mhuber@gmx.net';

  function fieldsOf(formEl) {
    return {
      name:    formEl.querySelector('[name="name"]'),
      org:     formEl.querySelector('[name="org"]'),
      email:   formEl.querySelector('[name="email"]'),
      topic:   formEl.querySelector('[name="topic"]'),
      message: formEl.querySelector('[name="message"]'),
      privacy: formEl.querySelector('[name="privacy"]')
    };
  }

  function setNote(noteEl, msg, state) {
    if (!noteEl) return;
    noteEl.textContent = msg;
    noteEl.setAttribute('data-state', state);
  }

  function wireForm(formEl, noteEl) {
    if (!formEl) return;
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      formEl.querySelectorAll('[aria-invalid]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });

      var f = fieldsOf(formEl);

      function fail(msg, el) {
        setNote(noteEl, msg, 'err');
        if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
      }

      if (!f.name.value.trim())    return fail(t('ui.errRequired'), f.name);
      if (!f.message.value.trim()) return fail(t('ui.errRequired'), f.message);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()))
        return fail(t('ui.errMail'), f.email);
      if (!f.privacy.checked)      return fail(t('ui.errPrivacy'), f.privacy);

      var topicLabel = f.topic.options[f.topic.selectedIndex].textContent;
      var subject = '[' + topicLabel + '] ' + f.name.value.trim();
      var body = [
        t('frm.name')  + ': ' + f.name.value.trim(),
        t('frm.org')   + ': ' + (f.org.value.trim() || '—'),
        t('frm.mail')  + ': ' + f.email.value.trim(),
        t('frm.topic') + ': ' + topicLabel,
        '',
        f.message.value.trim()
      ].join('\n');

      setNote(noteEl, t('ui.ok'), 'ok');
      window.location.href = 'mailto:' + MAILTO +
        '?subject=' + encodeURIComponent(subject) +
        '&body='    + encodeURIComponent(body);
    });
  }

  wireForm(document.getElementById('form'), note);
  wireForm(document.getElementById('write-form'), document.getElementById('write-note'));

  /* ── Year in footer stays accurate ────────────────────── */
  var footNote = document.querySelector('.foot__note');
  if (footNote) {
    var y = new Date().getFullYear();
    var sync = function () { footNote.textContent = t('foot.note').replace(/©\s*\d{4}/, '© ' + y); };
    sync();
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { requestAnimationFrame(sync); });
    });
  }
})();
