#!/usr/bin/env python3
"""
ASiC Handel - Zahlen in Dokumentation und Hilfe (Begehung und Gefaehrdungsbeurteilung) automatisch aktualisieren.

Aufruf (im Projektordner, also dem Ordner mit index.html):

    python tools/doku-zahlen.py          # aktualisieren
    python tools/doku-zahlen.py --pruefen  # nur pruefen, nichts schreiben

Was das Skript tut:
  1. Liest aus dem Code: Zeilen je Datei, Anzahl Kategorien und Pruefpunkte
     (js/audit-data.js), App-Revision (js/app.js) und Cache-Name (sw.js).
  2. Schreibt diese Werte in alle Stellen der Form
         <span data-zahl="fragen">199</span>
     in dokumentation.html, hilfe.html, gbo-dokumentation.html und gbo-hilfe.html.
  3. Erzeugt die Tabelle "Dateiuebersicht" in dokumentation.html neu
     (Beschreibungen stehen in tools/doku-dateien.json).
  4. Meldet Unstimmigkeiten: Dateien ohne Beschreibung, fehlende Dateien,
     abweichende Versionsangaben in den HTML-Seiten, externe Schriften.

Es werden nur die Zahlen und die Dateitabelle veraendert, sonst nichts.
Benoetigt nur Python 3 (keine zusaetzlichen Pakete).
"""

import datetime
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIELE = ["dokumentation.html", "hilfe.html", "gbo-dokumentation.html", "gbo-hilfe.html", "impressum.html", "datenschutz.html"]
TABELLE_START = "<!-- DATEITABELLE:START -->"
TABELLE_ENDE = "<!-- DATEITABELLE:ENDE -->"
NUR_PRUEFEN = "--pruefen" in sys.argv


# --------------------------------------------------------------------------
# Hilfsfunktionen
# --------------------------------------------------------------------------

def pfad(rel):
    return os.path.join(ROOT, *rel.split("/"))


def lies(rel):
    with open(pfad(rel), encoding="utf-8", newline="") as f:
        return f.read()


def schreibe(rel, text):
    with open(pfad(rel), "w", encoding="utf-8", newline="") as f:
        f.write(text)


def zeilen(rel):
    """Zeilenzahl wie 'wc -l', plus eine, falls die letzte Zeile ohne Zeilenumbruch endet."""
    with open(pfad(rel), "rb") as f:
        daten = f.read()
    if not daten:
        return 0
    n = daten.count(b"\n")
    if not daten.endswith(b"\n"):
        n += 1
    return n


def de_zahl(n):
    return f"{n:,}".replace(",", ".")


def de_datum(iso):
    return datetime.date.fromisoformat(iso).strftime("%d.%m.%Y")


def groesse_kb(rel):
    kb = os.path.getsize(pfad(rel)) / 1024
    return f"{kb:.1f}".replace(".", ",") + " KB"


# --------------------------------------------------------------------------
# Werte aus dem Code lesen
# --------------------------------------------------------------------------

def lies_werte(dateien):
    werte = {}
    warnungen = []

    daten = lies("js/audit-data.js")
    kategorien = re.findall(r'id:\s*"([^"]+)"\s*,\s*name:', daten)
    fragen = re.findall(r'\{\s*id:\s*"(\d+(?:\.\d+)+)"\s*,', daten)
    if len(fragen) != len(set(fragen)):
        warnungen.append("In js/audit-data.js kommen doppelte Frage-IDs vor.")
    werte["kategorien"] = str(len(kategorien))
    werte["fragen"] = str(len(fragen))

    # Gefaehrdungsbeurteilung: js/gbo-data.js ist "window.GBO_DATA = {...};" (JSON)
    gbo_text = lies("js/gbo-data.js")
    gbo_json = gbo_text[gbo_text.index("{"):gbo_text.rindex("}") + 1]
    gbo = json.loads(gbo_json)
    module = gbo["generalTopics"] + gbo["areas"] + gbo["machines"]
    gbo_ids = [q[0] for fragen_liste in gbo["questions"].values() for q in fragen_liste]
    if len(gbo_ids) != len(set(gbo_ids)):
        warnungen.append("In js/gbo-data.js kommen doppelte Frage-IDs vor.")
    werte["gbo_module"] = str(len(module))
    werte["gbo_fragen"] = str(len(gbo_ids))
    werte["gbo_eindeutig"] = str(len(set(gbo_ids)))

    app = lies("js/app.js")
    m = re.search(r"const APP_REVISION\s*=\s*'([^']+)'", app)
    d = re.search(r"const APP_REVISION_DATE\s*=\s*'([^']+)'", app)
    if not (m and d):
        raise SystemExit("APP_REVISION / APP_REVISION_DATE in js/app.js nicht gefunden.")
    werte["revision"] = m.group(1)
    werte["revision_datum"] = de_datum(d.group(1))
    werte["stand"] = werte["revision_datum"]

    sw = lies("sw.js")
    c = re.search(r"const CACHE_NAME\s*=\s*'([^']+)'", sw)
    if not c:
        raise SystemExit("CACHE_NAME in sw.js nicht gefunden.")
    werte["cache"] = c.group(1)
    werte["cache_version"] = "v" + c.group(1).rsplit("-v", 1)[-1]

    if werte["cache_version"] != "v" + werte["revision"]:
        warnungen.append(
            f"Versionen passen nicht zusammen: APP_REVISION {werte['revision']} "
            f"in js/app.js, aber CACHE_NAME {werte['cache']} in sw.js."
        )
    kommentar = re.search(r"SERVICE-WORKER-VERSION:\s*([0-9]+(?:\.[0-9]+)+)", sw)
    if kommentar and kommentar.group(1) != werte["revision"]:
        warnungen.append(
            f"Kommentar SERVICE-WORKER-VERSION in sw.js nennt {kommentar.group(1)}, "
            f"die App-Revision ist {werte['revision']}."
        )

    summe = 0
    for e in dateien:
        if e.get("art") in ("bibliothek", "binaer"):
            continue
        summe += zeilen(e["datei"])
    werte["zeilen_gesamt"] = de_zahl(summe)
    werte["zeilen_stand"] = datetime.date.today().strftime("%d.%m.%Y")
    return werte, warnungen


# --------------------------------------------------------------------------
# Dateitabelle
# --------------------------------------------------------------------------

def baue_tabelle(dateien, werte):
    zeilen_html = []
    for e in dateien:
        art = e.get("art", "")
        if art == "binaer":
            spalte = groesse_kb(e["datei"])
        elif art == "bibliothek":
            spalte = de_zahl(zeilen(e["datei"])) + " (minifiziert)"
        else:
            spalte = de_zahl(zeilen(e["datei"]))
        zweck = e["zweck"]
        for k, v in werte.items():
            zweck = zweck.replace("{" + k + "}", v)
        zeilen_html.append(
            "                <tr>\n"
            f"                    <td>{html.escape(e['datei'])}</td>\n"
            f'                    <td class="zahl">{html.escape(spalte)}</td>\n'
            f"                    <td>{html.escape(zweck, quote=False)}</td>\n"
            "                </tr>\n"
        )
    return "".join(zeilen_html)


def wende_an(text, werte, tabelle):
    # 1) Platzhalter <span data-zahl="schluessel">...</span>
    text = re.sub(r'(<span data-zahl="([a-z_]+)">)(.*?)(</span>)',
                  lambda m: m.group(1) + (werte[m.group(2)] if m.group(2) in werte
                                          else _fehler(m.group(2))) + m.group(4),
                  text, flags=re.S)

    # 2) Dateitabelle zwischen den Markierungen
    if tabelle is not None and TABELLE_START in text:
        a = text.index(TABELLE_START) + len(TABELLE_START)
        b = text.index(TABELLE_ENDE)
        text = text[:a] + "\n" + tabelle + "                " + text[b:]
    return text


def _fehler(schluessel):
    raise SystemExit(f'Unbekannter Platzhalter data-zahl="{schluessel}".')


# --------------------------------------------------------------------------
# Pruefungen
# --------------------------------------------------------------------------

def pruefe(dateien, config, werte):
    warnungen = []
    gelistet = {e["datei"] for e in dateien}
    ignoriert = set(config.get("ignorieren", []))

    for e in dateien:
        if not os.path.isfile(pfad(e["datei"])):
            warnungen.append(f"In tools/doku-dateien.json steht {e['datei']}, die Datei gibt es aber nicht.")

    for ordner, unter, dateinamen in os.walk(ROOT):
        unter[:] = [u for u in unter if u not in (".git", "node_modules", "__pycache__")]
        for name in dateinamen:
            rel = os.path.relpath(os.path.join(ordner, name), ROOT).replace(os.sep, "/")
            if rel in gelistet or rel in ignoriert:
                continue
            warnungen.append(
                f"Datei {rel} ist nicht in tools/doku-dateien.json beschrieben "
                f"(eintragen oder - falls ungenutzt - aus dem Projekt entfernen)."
            )

    rev = werte["revision"]
    for name in sorted(os.listdir(ROOT)):
        if not name.endswith(".html"):
            continue
        t = lies(name)
        for m in re.finditer(r"App-Revision\s+([0-9]+(?:\.[0-9]+)+)", t):
            if m.group(1) != rev:
                warnungen.append(f"{name} nennt App-Revision {m.group(1)}, der Code hat {rev}.")
        for m in re.finditer(r"asic-handel-v([0-9]+(?:\.[0-9]+)+)", t):
            if m.group(1) != rev:
                warnungen.append(f"{name} nennt Cache asic-handel-v{m.group(1)}, der Code hat {werte['cache']}.")
        for m in re.finditer(r"Service Worker v([0-9]+(?:\.[0-9]+)+)", t):
            if m.group(1) != rev:
                warnungen.append(f"{name} nennt Service Worker v{m.group(1)}, der Code hat {werte['cache_version']}.")

    for rel in ["css/styles.css"] + [n for n in os.listdir(ROOT) if n.endswith(".html")]:
        t = lies(rel)
        if re.search(r"fonts\.(googleapis|gstatic)\.com", t):
            warnungen.append(f"{rel} laedt eine Schrift von Google (Datenschutz!). Schrift lokal einbinden.")

    sw = lies("sw.js")
    for pflicht in re.findall(r"url\('\.\./(fonts/[^']+)'\)", lies("css/styles.css")):
        if "./" + pflicht not in sw:
            warnungen.append(f"{pflicht} wird im CSS benutzt, fehlt aber im Offline-Cache von sw.js.")
    return warnungen


# --------------------------------------------------------------------------
# Hauptprogramm
# --------------------------------------------------------------------------

def main():
    with open(pfad("tools/doku-dateien.json"), encoding="utf-8") as f:
        config = json.load(f)
    dateien = config["dateien"]

    # Die Zeilenzahlen der beiden Zielseiten aendern sich durch das Schreiben
    # selbst; deshalb wird wiederholt, bis sich nichts mehr aendert.
    geaendert = set()
    for _ in range(6):
        werte, warnungen = lies_werte(dateien)
        tabelle = baue_tabelle(dateien, werte)
        runde = False
        for ziel in ZIELE:
            alt = lies(ziel)
            neu = wende_an(alt, werte, tabelle)
            if neu != alt:
                runde = True
                geaendert.add(ziel)
                if not NUR_PRUEFEN:
                    schreibe(ziel, neu)
        if NUR_PRUEFEN or not runde:
            break

    warnungen += pruefe(dateien, config, werte)

    print("Werte aus dem Code:")
    for k in ("revision", "revision_datum", "cache", "kategorien", "fragen", "gbo_module", "gbo_fragen", "zeilen_gesamt"):
        print(f"  {k:15} {werte[k]}")
    if NUR_PRUEFEN:
        print("\nPruefmodus: es wurde nichts geschrieben." +
              (" Aktualisierung waere noetig: " + ", ".join(sorted(geaendert)) if geaendert else " Alles aktuell."))
    else:
        print("\nAktualisiert: " + (", ".join(sorted(geaendert)) if geaendert else "nichts (war schon aktuell)"))
    if warnungen:
        print("\nHinweise (" + str(len(warnungen)) + "):")
        for w in warnungen:
            print("  - " + w)
        return 1
    print("\nKeine Unstimmigkeiten gefunden.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
