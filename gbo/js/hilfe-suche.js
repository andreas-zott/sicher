// ASiC Handel – Suche, Auf-/Zuklappen und "Nach oben" der Hilfeseite.
// Eigene Datei wegen der Content-Security-Policy (erlaubt
// keine eingebetteten Skripte mehr).
(function () {
    'use strict';

    var input = document.getElementById('faq-search');
    var clearBtn = document.getElementById('faq-clear');
    var statusEl = document.getElementById('faq-status');
    var toggleBtn = document.getElementById('faq-toggle');
    var emptyEl = document.getElementById('faq-empty');
    var emptyReset = document.getElementById('faq-empty-reset');
    var topBtn = document.getElementById('faq-top');

    var units = Array.prototype.slice.call(document.querySelectorAll('[data-unit]'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.h-section'));
    var items = Array.prototype.slice.call(document.querySelectorAll('.h-item'));
    var timer = null;

    // ---- Text fuer die Suche normalisieren (Umlaute und Gross-/Kleinschreibung)
    function normA(s) {
        return String(s).toLowerCase()
            .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    }

    function normB(s) {
        return String(s).toLowerCase()
            .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
    }

    // Suchtext je Einheit einmal berechnen (inkl. versteckter Details)
    units.forEach(function (u) {
        var raw = u.textContent + ' ' + (u.getAttribute('data-kw') || '');
        u._hayA = normA(raw);
        u._hayB = normB(raw);
    });

    function matches(unit, words) {
        for (var i = 0; i < words.length; i++) {
            var wa = normA(words[i]);
            var wb = normB(words[i]);
            if (unit._hayA.indexOf(wa) === -1 && unit._hayB.indexOf(wb) === -1) return false;
        }
        return true;
    }

    function setSearching(on) {
        document.body.classList.toggle('is-searching', on);
    }

    function setStatus(text) {
        statusEl.textContent = text;
    }

    function resetSearch() {
        units.forEach(function (u) {
            u.hidden = false;
            if (u._openedBySearch) {
                u.open = false;
                u._openedBySearch = false;
            }
        });
        sections.forEach(function (s) { s.hidden = false; });
        emptyEl.classList.remove('is-visible');
        setSearching(false);
        setStatus('');
        clearBtn.hidden = true;
        updateToggleLabel();
    }

    function runSearch() {
        var q = input.value.trim();
        clearBtn.hidden = (input.value === '');

        if (q.length < 2) {
            resetSearch();
            return;
        }

        var words = q.split(/\s+/);
        var treffer = 0;

        setSearching(true);

        units.forEach(function (u) {
            var ok = matches(u, words);
            u.hidden = !ok;
            if (ok) {
                treffer++;
                if (u.tagName === 'DETAILS' && !u.open) {
                    u.open = true;
                    u._openedBySearch = true;
                }
            } else if (u._openedBySearch) {
                u.open = false;
                u._openedBySearch = false;
            }
        });

        sections.forEach(function (s) {
            if (s.hasAttribute('data-unit')) return;
            var sichtbar = s.querySelector('.h-item:not([hidden])');
            s.hidden = !sichtbar;
        });

        emptyEl.classList.toggle('is-visible', treffer === 0);
        setStatus(treffer === 0
            ? ''
            : treffer + (treffer === 1 ? ' Treffer' : ' Treffer') + ' für „' + q + '“');
        updateToggleLabel();
    }

    function onInput() {
        clearTimeout(timer);
        timer = setTimeout(runSearch, 120);
    }

    input.addEventListener('input', onInput);

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            input.value = '';
            runSearch();
        }
    });

    function clearSearch() {
        input.value = '';
        runSearch();
        input.focus();
    }

    clearBtn.addEventListener('click', clearSearch);
    emptyReset.addEventListener('click', clearSearch);

    // ---- Alle aufklappen / zuklappen
    function sichtbareItems() {
        return items.filter(function (i) { return !i.hidden; });
    }

    function alleOffen() {
        var v = sichtbareItems();
        return v.length > 0 && v.every(function (i) { return i.open; });
    }

    function updateToggleLabel() {
        var offen = alleOffen();
        toggleBtn.textContent = offen ? 'Alle Antworten zuklappen' : 'Alle Antworten aufklappen';
        toggleBtn.setAttribute('aria-pressed', offen ? 'true' : 'false');
    }

    toggleBtn.addEventListener('click', function () {
        var oeffnen = !alleOffen();
        sichtbareItems().forEach(function (i) {
            i.open = oeffnen;
            if (!oeffnen) {
                var m = i.querySelectorAll('.h-more');
                for (var k = 0; k < m.length; k++) m[k].open = false;
            } else {
                var m2 = i.querySelectorAll('.h-more');
                for (var j = 0; j < m2.length; j++) m2[j].open = true;
            }
            i._openedBySearch = false;
        });
        updateToggleLabel();
    });

    items.forEach(function (i) {
        i.addEventListener('toggle', updateToggleLabel);
    });

    // ---- Direktlink: #q-... oeffnet die Frage
    function openFromHash() {
        var id = decodeURIComponent((location.hash || '').replace(/^#/, ''));
        if (!id) return;
        var el = document.getElementById(id);
        if (el && el.classList.contains('h-item')) {
            el.open = true;
            setTimeout(function () { el.scrollIntoView({ block: 'start' }); }, 50);
        }
    }

    window.addEventListener('hashchange', openFromHash);
    openFromHash();

    // ---- Nach oben
    function onScroll() {
        topBtn.classList.toggle('is-visible', window.scrollY > 700);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0 });
        input.focus({ preventScroll: true });
    });

    updateToggleLabel();
})();
