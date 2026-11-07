// ==========================================================================
// ASiC Handel — Anmeldung beim Öffnen einer Seite prüfen (ab Rev. 1.55)
// ==========================================================================
// Fragt anmeldung.php, ob die Anmeldung auf dem Server eingeschaltet ist
// und ob dieses Gerät angemeldet ist. Wenn nicht: weiter zur Anmeldeseite.
//
// Den eigentlichen Schutz leisten der Server (save/list/load/offen.php
// verlangen die Anmeldung) und der Torwächter (tor.php). Diese Prüfung sorgt
// nur dafür, dass man die Anmeldeseite sofort sieht.
//
// Ohne Verbindung wird nichts geprüft: Die App funktioniert im Markt auch
// offline weiter. Gibt es anmeldung.php nicht (z. B. GitHub Pages, ältere
// Server), bleibt alles wie bisher.
//
// window.asicAnmeldung: Promise mit dem Status (oder null), z. B. für die
// Einstellungen ("Angemeldet als …").
// ==========================================================================

(function () {
    'use strict';

    function seite() {
        const datei = location.pathname.split('/').pop() || 'index.html';
        return /^[a-z0-9-]+\.html$/i.test(datei) ? datei : 'index.html';
    }

    window.asicAnmeldung = (async function () {
        if (navigator.onLine === false) return null;
        if (!/^https?:$/.test(location.protocol)) return null;   // Desktop-App, Datei
        const abbruch = new AbortController();
        const uhr = setTimeout(() => abbruch.abort(), 5000);
        try {
            const res = await fetch('anmeldung.php?aktion=status', {
                credentials: 'same-origin', cache: 'no-store', signal: abbruch.signal
            });
            if (!res.ok) return null;
            const s = await res.json();
            try {
                if (s && typeof s.autoTeamArchiv === 'boolean') localStorage.setItem('asicAutoTeamArchiv', s.autoTeamArchiv ? '1' : '0');
                if (s && typeof s.autoPdfArchiv === 'boolean') localStorage.setItem('asicAutoPdfArchiv', s.autoPdfArchiv ? '1' : '0');
                // Merker des früheren Zugangscodes (bis 1.55-9) aufräumen
                localStorage.removeItem('asicAnmeldungAktiv');
                localStorage.removeItem('asicHandelAccessGranted');
            } catch (e) { /* weiter */ }
            if (!s || !s.aktiv) return s || null;
            if (!s.angemeldet || (s.benutzer && s.benutzer.mussAendern)) {
                const zusatz = s.angemeldet ? '&aktion=passwort' : '';
                location.replace('anmeldung.html?ziel=' + encodeURIComponent(seite()) + zusatz);
            }
            return s;
        } catch (e) {
            return null;
        } finally {
            clearTimeout(uhr);
        }
    })();
})();
