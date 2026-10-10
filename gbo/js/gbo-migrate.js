// ==========================================================================
// ASiC Handel — GBO: Übernahme alter Frage-Kürzel (ab Rev. 2.0.29)
// ==========================================================================
// In 9 Vertiefungsmodulen waren die Frage-IDs gemischt (z. B. BRA-01 … BR-06).
// Ab Rev. 2.0.29 sind sie je Modul einheitlich. Damit bereits erfasste
// Bewertungen, Vormerkungen aus der Begehung und Fotos nicht verloren gehen,
// werden alte IDs beim Laden auf die neuen übertragen (idempotent, ohne Löschen
// vorhandener neuer Einträge).
// ==========================================================================
(function () {
    'use strict';
    var ALIAS = {"BR-01":"BS-01",
        "BR-02":"BS-02",
        "BR-03":"BS-03",
        "BR-04":"BS-04",
        "BR-05":"BRA-05",
        "BR-06":"BRA-06",
        "FL-04":"FR-04",
        "FL-05":"FR-05",
        "ME-02":"MECH-02",
        "ME-03":"MECH-03",
        "SE-03":"SENS-03",
        "SE-04":"SENS-04",
        "NO-03":"NF-03",
        "NO-04":"NF-04",
        "LA-03":"LAG-03",
        "LA-04":"LAG-04",
        "LA-05":"LAG-05",
        "LR-04":"LGR-04",
        "LR-05":"LGR-05",
        "LR-06":"LGR-06",
        "RE-04":"REG-04",
        "RE-05":"REG-05",
        "RE-06":"REG-06"};
    function mapId(id) { return ALIAS[id] || id; }
    function migrateState(s) {
        if (!s || typeof s !== 'object' || !s.answers) return s;
        var changed = false;
        Object.keys(ALIAS).forEach(function (o) {
            if (Object.prototype.hasOwnProperty.call(s.answers, o)) {
                var n = ALIAS[o];
                if (!s.answers[n]) s.answers[n] = s.answers[o];
                delete s.answers[o]; changed = true;
            }
        });
        if (Array.isArray(s.reviews)) s.reviews.forEach(function (r) {
            if (r && r.questionId && ALIAS[r.questionId]) { r.questionId = ALIAS[r.questionId]; changed = true; }
        });
        if (s.risk && typeof s.risk === 'object') Object.keys(ALIAS).forEach(function (o) {
            if (Object.prototype.hasOwnProperty.call(s.risk, o)) {
                if (!s.risk[ALIAS[o]]) s.risk[ALIAS[o]] = s.risk[o];
                delete s.risk[o]; changed = true;
            }
        });
        return s;
    }
    function migrateLinks(list) {
        if (!Array.isArray(list)) return list;
        list.forEach(function (l) { if (l && l.gboQuestionId && ALIAS[l.gboQuestionId]) l.gboQuestionId = ALIAS[l.gboQuestionId]; });
        return list;
    }
    function storage() {
        try {
            var s = JSON.parse(localStorage.getItem('asicGboStateV1') || 'null');
            if (s && s.answers) { migrateState(s); localStorage.setItem('asicGboStateV1', JSON.stringify(s)); }
            var l = JSON.parse(localStorage.getItem('asicMarketLinksV2') || 'null');
            if (Array.isArray(l)) { migrateLinks(l); localStorage.setItem('asicMarketLinksV2', JSON.stringify(l)); }
        } catch (e) { console.warn('GBO-Kürzelübernahme (Speicher):', e); }
    }
    function photos() {
        if (!window.GBOPhotos || !Object.keys(ALIAS).length) return Promise.resolve();
        return Object.keys(ALIAS).reduce(function (p, o) {
            return p.then(function () {
                return window.GBOPhotos.get(o).then(function (rec) {
                    if (!rec) return;
                    var n = ALIAS[o];
                    return window.GBOPhotos.get(n).then(function (ex) {
                        var step = ex ? Promise.resolve() : window.GBOPhotos.put(n, rec.blob, { name: rec.name, type: rec.type, stamp: rec.stamp, size: rec.size });
                        return step.then(function () { return window.GBOPhotos.remove(o); });
                    });
                });
            }).catch(function (e) { console.warn('GBO-Kürzelübernahme (Foto ' + o + '):', e); });
        }, Promise.resolve());
    }
    // Fragenzahl in den Modul-Untertiteln aus den Daten berechnen
    (function labels() {
        var d = window.GBO_DATA;
        if (!d || !d.questions) return;
        ['areas', 'machines', 'generalTopics'].forEach(function (k) {
            (d[k] || []).forEach(function (a) {
                var i = a.findIndex(function (x) { return /^\d+ (Vertiefungs|Tiefen)fragen$/.test(String(x)); });
                if (i > -1 && d.questions[a[0]]) {
                    a[i] = d.questions[a[0]].length + ' ' + (/Tiefenfragen/.test(a[i]) ? 'Tiefenfragen' : 'Vertiefungsfragen');
                }
            });
        });
    })();
    window.GBOMigrate = { alias: ALIAS, mapId: mapId, state: migrateState, links: migrateLinks, run: function () { storage(); return photos(); } };
    storage();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', photos); else photos();
})();
