// ==========================================================================
// Großhandel Begehung — GBO: Inventar aus dem Betriebsprofil vorschlagen
// (ab Rev. 1.1-3)
// ==========================================================================
// Liest die Ausstattung des Standorts aus der geöffneten Begehung
// (Betriebsprofil: Haken = vorhanden, sonst Kategorien "nicht zutreffend")
// und wählt die passenden GBO-Module im Inventar aus. Es wird nur ergänzt,
// nie abgewählt. Zuordnung: GBO_GH_DATEN.ausstattung (tools/gbo_gh_katalog.py).
// ==========================================================================
(function () {
  'use strict';
  var GBO_KEY = 'ghbGboStateV1', AUDIT_KEY = 'ghbBegehungState';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var lies = function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null') || {}; } catch (e) { return {}; } };

  function liste(id) {
    var D = window.GBO_DATA;
    if ((D.generalTopics || []).some(function (a) { return a[0] === id; })) return 'selectedGeneral';
    if ((D.areas || []).some(function (a) { return a[0] === id; })) return 'selectedAreas';
    if ((D.machines || []).some(function (a) { return a[0] === id; })) return 'selectedMachines';
    return null;
  }
  function titel(id) {
    var D = window.GBO_DATA, all = [].concat(D.generalTopics || [], D.areas || [], D.machines || []);
    var a = all.find(function (x) { return x[0] === id; });
    return a ? a[1] : id;
  }

  function vorschlag() {
    var a = lies(AUDIT_KEY), na = a.notApplicable || {}, ci = a.companyInfo || {};
    var Z = window.GBO_GH_DATEN || {}, map = Z.ausstattung || {};
    var aus = (typeof AUSSTATTUNG !== 'undefined' && Array.isArray(AUSSTATTUNG)) ? AUSSTATTUNG : [];
    var st = lies(GBO_KEY), neu = [], vorhanden = [];
    aus.forEach(function (e) {
      if (e.kategorien.every(function (id) { return !!na[id]; })) return;
      vorhanden.push(e.label);
      (map[e.key] || []).forEach(function (m) {
        var l = liste(m);
        if (!l) return;
        if (st[l] && st[l][m]) return;
        if (neu.some(function (x) { return x.id === m; })) return;
        neu.push({ id: m, liste: l });
      });
    });
    return { standort: String(ci.marktnummer || '').trim(), gboStandort: String((st.meta || {}).marktnummer || '').trim(), neu: neu, vorhanden: vorhanden, profil: Object.keys(na).length > 0 };
  }

  async function uebernehmen() {
    var v = vorschlag();
    if (!v.standort) { alert('Im Prüfkatalog ist keine Begehung mit Standortnummer geöffnet.'); return; }
    if (v.gboStandort && v.gboStandort !== v.standort) {
      alert('Die geöffnete Begehung gehört zu Standort ' + v.standort + ', die Gefährdungsbeurteilung zu Standort ' + v.gboStandort + '. Bitte zuerst die passende Begehung öffnen.');
      return;
    }
    if (!v.neu.length) { alert('Alle Module aus dem Betriebsprofil sind bereits im Inventar ausgewählt.'); return; }
    var punkte = [
      'Ausgewählt werden ' + v.neu.length + ' Module: ' + v.neu.map(function (x) { return titel(x.id); }).join(', ') + '.',
      'Bereits gewählte Module bleiben erhalten, es wird nichts abgewählt.'
    ];
    if (!v.profil) punkte.push('Im Betriebsprofil ist noch keine Ausstattung abgewählt – es gilt alles als vorhanden. Bitte die Auswahl danach prüfen.');
    var ok;
    if (typeof zeigeHinweisFenster === 'function') {
      ok = (await zeigeHinweisFenster({ titel: 'Inventar vorschlagen', sub: 'Aus dem Betriebsprofil der Begehung (Standort ' + v.standort + ')', punkte: punkte,
        knoepfe: [{ w: 'ja', text: 'Übernehmen', art: 'primaer' }, { w: '', text: 'Abbrechen' }] })) === 'ja';
    } else ok = confirm(punkte.join('\n\n'));
    if (!ok) return;
    var st = lies(GBO_KEY);
    st.meta = st.meta || {};
    if (!st.meta.marktnummer) st.meta.marktnummer = v.standort;
    v.neu.forEach(function (x) { st[x.liste] = st[x.liste] || {}; st[x.liste][x.id] = true; });
    if (st.selectedGeneral && st.selectedGeneral.stapler) st.selectedGeneral.ffz = true;
    localStorage.setItem(GBO_KEY, JSON.stringify(st));
    location.reload();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.querySelector('[data-gbo-panel="vorbereiten"]');
    if (!panel || document.getElementById('ghInventarKarte')) return;
    var v = vorschlag();
    var karte = document.createElement('section');
    karte.className = 'gbo-card';
    karte.id = 'ghInventarKarte';
    karte.setAttribute('data-gbo-panel', 'vorbereiten');
    karte.innerHTML = '<h2>Inventar aus dem Betriebsprofil</h2>' +
      '<p class="gbo-card-intro">Das Betriebsprofil der Begehung (Ausstattung des Standorts) schlägt die passenden Bereiche, Einrichtungen und Maschinen vor. ' +
      'Danach die Auswahl unten prüfen und ergänzen, z. B. einzelne Maschinen im Fleischwerk.</p>' +
      '<div class="gbo-doc-actions"><button type="button" class="gbo-btn" id="ghInventarBtn">Inventar vorschlagen</button></div>' +
      '<p class="gbo-note">' + (v.standort ? 'Geöffnete Begehung: Standort ' + esc(v.standort) + ' · ' + v.vorhanden.length + ' Ausstattungsmerkmale vorhanden · ' + v.neu.length + ' Module noch nicht gewählt.'
        : 'Im Prüfkatalog ist keine Begehung mit Standortnummer geöffnet.') + '</p>';
    panel.parentNode.insertBefore(karte, panel);
    karte.hidden = panel.hidden;
    // Reiter-Umschaltung (gbo-v2.js kennt diese nachträglich eingefügte Karte nicht)
    document.querySelectorAll('[data-gbo-tab]').forEach(function (b) {
      b.addEventListener('click', function () { karte.hidden = b.dataset.gboTab !== 'vorbereiten'; });
    });
    document.getElementById('ghInventarBtn').addEventListener('click', uebernehmen);
  });
})();
