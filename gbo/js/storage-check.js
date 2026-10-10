// ==========================================================================
// ASiC Handel — Speicherprüfung
// ==========================================================================
// Prüft VOR dem Speichern eines Fotos, ob im Gerätespeicher der App noch
// genug Platz ist, und liefert eine verständliche Meldung.
//
//  - estimate(): belegter und verfügbarer Platz (navigator.storage.estimate).
//    Nicht jeder Browser liefert die Werte; dann ist das Ergebnis null und
//    es wird ohne Vorabprüfung gespeichert (Fehler werden trotzdem gemeldet).
//  - check(bytes): { ok, warn, message }
//        ok = false  -> nicht speichern, message dem Nutzer zeigen
//        warn = true -> speichern ist möglich, aber der Speicher wird knapp
//  - localUsage(): Belegung des Browserspeichers (localStorage, ca. 5 MB)
// ==========================================================================

(function () {
    'use strict';

    const WARN_ANTEIL = 0.8;            // ab 80 % Belegung warnen
    const LOCAL_LIMIT_ZEICHEN = 5000000; // typische Grenze von localStorage

    function mb(bytes) {
        if (bytes < 1048576) {
            return Math.max(1, Math.round(bytes / 1024)).toLocaleString('de-DE') + ' KB';
        }
        return (bytes / 1048576).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' MB';
    }

    async function estimate() {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                const e = await navigator.storage.estimate();
                if (e && e.quota) {
                    const usage = e.usage || 0;
                    return { usage, quota: e.quota, free: Math.max(0, e.quota - usage) };
                }
            }
        } catch (err) {
            console.warn('Speicherschätzung nicht möglich:', err);
        }
        return null;
    }

    async function check(bytes) {
        const e = await estimate();
        if (!e) return { ok: true, warn: false, message: '' };

        const benoetigt = Math.ceil(bytes * 1.3) + 262144; // Zuschlag für Verwaltung
        if (e.free < benoetigt) {
            return {
                ok: false,
                warn: true,
                message:
                    'Nicht genug Speicherplatz: Für dieses Foto (einschließlich Reserve) werden etwa ' + mb(benoetigt) +
                    ' benötigt, frei sind nur noch etwa ' + mb(e.free) + '.\n\n' +
                    'Bitte zuerst nicht mehr benötigte Fotos löschen oder die Begehung ' +
                    'archivieren und zurücksetzen.'
            };
        }

        const danach = (e.usage + bytes) / e.quota;
        if (danach >= WARN_ANTEIL) {
            return {
                ok: true,
                warn: true,
                message:
                    'Achtung: Der App-Speicher ist zu etwa ' + Math.round(danach * 100) +
                    ' % belegt (frei: ' + mb(e.free) + '). Bitte bald sichern ' +
                    '(Datei ▾ → JSON exportieren oder Auf NAS speichern) und alte Fotos aufräumen.'
            };
        }
        return { ok: true, warn: false, message: '' };
    }

    function localUsage() {
        let zeichen = 0;
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                zeichen += k.length + (localStorage.getItem(k) || '').length;
            }
        } catch (err) { /* Zugriff nicht möglich */ }
        return {
            zeichen,
            limit: LOCAL_LIMIT_ZEICHEN,
            anteil: zeichen / LOCAL_LIMIT_ZEICHEN
        };
    }

    // Bittet den Browser, die Daten der App nicht von sich aus zu löschen.
    async function persist() {
        try {
            if (navigator.storage && navigator.storage.persist) {
                return await navigator.storage.persist();
            }
        } catch (err) { /* nicht kritisch */ }
        return false;
    }

    window.ASiCStorage = { WARN_ANTEIL, estimate, check, localUsage, persist, mb };
})();
