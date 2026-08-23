// Erzeugt die Unfallanzeige als ECHTE 1:1-Kopie des amtlichen Vordrucks U 1000:
// lädt die Original-PDF (assets/U1000_Unfallanzeige.pdf) und füllt deren eigene
// ausfüllbare Formularfelder (AcroForm) mit den erfassten Daten. Kein Nachbau-Layout.
//
// Feldnamen und Radiobutton-Werte wurden 1:1 aus der Original-PDF extrahiert
// (siehe Analyse: pypdf get_fields() -> field_info.json) und visuell anhand
// der gerenderten Seite verifiziert (insbesondere Feld 11, das aus zwei
// unabhängigen Radiogruppen besteht, deren Beschriftung im PDF vertauscht ist).

// (Vorlage wird nicht mehr per fetch() nachgeladen, sondern aus js/template-pdf.js
// als Base64 eingebettet – siehe UA_PDF_TEMPLATE_BASE64 dort.)

// Bounding-Boxen (PDF-Punkte, y=0 unten) für die beiden Unterschriftsfelder auf Seite 1,
// direkt aus der Original-PDF übernommen. Dort werden die Signatur-PNGs hineingezeichnet,
// da AcroForm-Textfelder keine Bilder aufnehmen können.
const UA_SIG_RECT_UNTERNEHMER = [126.921, 83.7638, 289.134, 97.937];
const UA_SIG_RECT_BETRIEBSRAT = [303.307, 83.7638, 415.843, 97.937];

function ualFormatDatumDE(v) {
  if (!v) return "";
  const [j, m, t] = v.split("-");
  return t ? `${t}.${m}.${j}` : v;
}

function ualBase64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

// Erzeugt EIN gefülltes PDF (nur Seite 1 des Vordrucks) für einen bestimmten Empfängertext
// und gibt die fertigen Bytes zurück (noch kein Download).
async function erzeugeEinzelnesPdf(b, empfaengerText) {
  if (!window.PDFLib) {
    throw new Error("PDF-Bibliothek konnte nicht geladen werden. Bitte Internetverbindung prüfen.");
  }
  const { PDFDocument } = window.PDFLib;

  const templateBytes = ualBase64ToUint8Array(UA_PDF_TEMPLATE_BASE64);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  function setText(fieldName, value) {
    try {
      form.getTextField(fieldName).setText(value == null ? "" : String(value));
    } catch (e) {
      console.warn("Textfeld nicht in der Vorlage gefunden:", fieldName, e);
    }
  }
  function selectRadio(fieldName, value) {
    if (!value) return;
    try {
      form.getRadioGroup(fieldName).select(value);
    } catch (e) {
      console.warn("Auswahlfeld nicht in der Vorlage gefunden:", fieldName, value, e);
    }
  }

  // --- 1–3 Unternehmen & Empfänger ---
  setText("1 Name und Anschrift des Unternehmens 2", b.unternehmenAnschrift);
  setText("2 Unternehmensnummer des Unfallversicherungsträgers  2", b.unternehmensnummer);
  setText("3 Empfänger/-in 2", empfaengerText);

  // --- 4–13 Versicherte Person ---
  setText("4 Name, Vorname der versicherten Person  2", b.personName);
  setText("5 Geburtsdatum (TT.MM.JJJJ) 2", ualFormatDatumDE(b.geburtsdatum));
  setText("6 Straße, Hausnummer 2", b.strasse);
  setText("6 Postleitzahl 2", b.plz);
  setText("6 Ort 2", b.ort);
  selectRadio("7 Geschlecht", { maennlich: "/0", weiblich: "/1", divers: "/2", keine: "/3" }[b.geschlecht]);
  setText("8 Staatsangehörigkeit  2", b.staatsangehoerigkeit);
  selectRadio("9 Leiharbeitnehmer/-in", b.leiharbeitnehmer === "ja" ? "/1" : b.leiharbeitnehmer === "nein" ? "/0" : null);
  selectRadio("10 Auszubildende/-r", b.auszubildende === "ja" ? "/1" : b.auszubildende === "nein" ? "/0" : null);

  // Feld 11 ist in der Original-PDF EIN einziges Auswahlfeld ("Die versicherte Person ist")
  // mit drei Optionen, empirisch am gerenderten PDF verifiziert (nicht nur aus Koordinaten
  // abgeleitet, da Label- und Checkbox-Position im Vordruck nicht auf gleicher Höhe liegen):
  //   /2 = Unternehmer/-in
  //   /1 = Gesellschafter/-in ODER Geschäftsführer/-in (TEILEN SICH eine gemeinsame Checkbox –
  //        im Original-PDF nicht weiter unterscheidbar, auch wenn das HTML-Formular beides
  //        getrennt anbietet)
  //   /0 = "mit der Unternehmerin/dem Unternehmer:" – der Einstieg in die zweite Untergruppe
  //        "mit der Unternehmerin/dem Unternehmer" (verwandt /0, verheiratet /1, Lebenspartnerschaft /2)
  // Da es real nur EIN Feld ist, hat die Rolle (Unternehmer/Gesellschafter/Geschäftsführer)
  // Vorrang vor der Beziehungsart, falls im HTML-Formular versehentlich beides angegeben wurde.
  let feld11Wert = null;
  if (b.beziehung?.rolle === "unternehmer") feld11Wert = "/2";
  else if (b.beziehung?.rolle === "gesellschafter" || b.beziehung?.rolle === "geschaeftsfuehrer") feld11Wert = "/1";
  else if (b.beziehung?.verwandt || b.beziehung?.verheiratet || b.beziehung?.lebenspartnerschaft) feld11Wert = "/0";
  selectRadio("Die versicherte Person ist", feld11Wert);

  let beziehungWert = null;
  if (b.beziehung?.verwandt) beziehungWert = "/0";
  else if (b.beziehung?.verheiratet) beziehungWert = "/1";
  else if (b.beziehung?.lebenspartnerschaft) beziehungWert = "/2";
  selectRadio("mit der Unternehmerin/dem Unternehmer", beziehungWert);
  // Ist im HTML-Formular mehr als eine der drei Beziehungsarten angehakt (dort als unabhängige
  // Kästchen umgesetzt), wird nach der Priorität verwandt > verheiratet > Lebenspartnerschaft
  // nur die erste ins amtliche PDF übernommen, da die Vorlage hier nur eine Auswahl erlaubt.

  setText("12 Anspruch auf Entgeltfortzahlung 2", b.entgeltfortzahlungWochen);
  setText("13 Krankenkasse (Name, PLZ, Ort, bei Familienversicherung Name des Mitglieds)", b.krankenkasse);

  // --- 14–17 Unfallzeitpunkt & -ort ---
  selectRadio("14 Tödlicher Unfall?", b.toedlich === "ja" ? "/1" : b.toedlich === "nein" ? "/0" : null);
  const uhrzeitTeil = b.unfallUhrzeit ? `/${b.unfallUhrzeit}` : "";
  setText("15 Unfallzeitpunkt (TT.MM.JJJJ/hh:mm)", `${ualFormatDatumDE(b.unfallDatum)}${uhrzeitTeil}`);
  setText("16 Unfallort (genaue Orts- und Straßenangabe mit PLZ) 2", b.unfallort);
  selectRadio("17 Unfall im Homeoffice?", b.homeoffice === "ja" ? "/1" : b.homeoffice === "nein" ? "/0" : null);
  // b.wegeunfall ist ein reines Zusatzfeld für die interne Auswertung und hat in der
  // amtlichen Vorlage kein eigenes Ankreuzfeld – wird daher hier bewusst nicht übernommen.

  // --- 18 Unfallhergang ---
  selectRadio("Die Angaben beruhen auf der Schilderung",
    b.schilderungQuelle === "andere" ? "/anderer Personen" : b.schilderungQuelle === "versicherte" ? "/der versicherten Person" : null);
  setText("18 Ausführliche Schilderung des Unfallhergangs (Verlauf, Bezeichnung des Betriebsteils, ggf. Beteili", b.schilderung);

  // --- 19–20 Verletzung ---
  const koerperteileText = (b.koerperteile || []).map(formatKoerperteil).join(", ");
  setText("19 Verletzte Körperteile 2", koerperteileText);
  setText("20 Art der Verletzung", b.verletzungsart);
  selectRadio("War diese Person Augenzeugin/Augenzeuge des Unfalls?", b.augenzeuge === "ja" ? "/1" : b.augenzeuge === "nein" ? "/0" : null);

  // --- 21–22 Kenntnisnahme & Erstbehandlung ---
  setText("21 Wer hat von dem Unfall zuerst Kenntnis genommen? (Name, Anschrift) 2", b.kenntnisPerson);
  setText("22 Erstbehandlung: Name und Anschrift der Ärztin/des Arztes oder des Krankenhauses 3", b.erstbehandlung);

  // --- 23–26 Tätigkeit & Arbeitszeit ---
  setText("23 Beginn und Ende der Arbeitszeit der versicherten Person Beginn", b.arbeitszeitBeginn);
  setText("23 Beginn und Ende der Arbeitszeit der versicherten Person Ende", b.arbeitszeitEnde);
  setText("24 Zum Unfallzeitpunkt beschäftigt/tätig als 2", b.taetigkeit);
  setText("25 Seit wann bei dieser Tätigkeit? (TT.MM.JJJJ)", ualFormatDatumDE(b.taetigSeit));
  setText("26 In welchem Teil des Unternehmens ist die versicherte Person ständig tätig? 2", b.betriebsteil);

  // --- 27–28 Arbeitsunterbrechung ---
  selectRadio("27 Hat die versicherte Person die Arbeit eingestellt?",
    { nein: "/0", sofort: "/1", spaeter: "/2" }[b.arbeitEingestellt]);
  setText("27 Datum", b.spaeterDatum);
  setText("27 Uhrzeit", b.spaeterUhrzeit);
  selectRadio("28 Hat die versicherte Person die Arbeit wieder aufgenommen?",
    b.wiederAufgenommen === "ja" ? "/1" : b.wiederAufgenommen === "nein" ? "/0" : null);
  setText("28 Datum", ualFormatDatumDE(b.wiederAufgenommenDatum));
  // Hinweis: Die Original-PDF fragt bei Feld 28 nur das Datum ab (keine separaten
  // Beginn-/Ende-Uhrzeiten wie im HTML-Formular zusätzlich erfasst) – daher werden
  // b.wiederBeginn/b.wiederEnde hier nicht ins amtliche PDF übernommen.

  // --- 29 Datum, Unterschrift, Rückfragen ---
  setText("29 Datum 2", ualFormatDatumDE(b.meldedatum));
  setText("29 Telefon-Nr. für Rückfragen 2", b.telefonRueckfragen);
  // Die Textfelder "29 Unternehmer/-in ..." und "29 Betriebsrat ..." bleiben leer –
  // dort werden stattdessen die handschriftlichen Signatur-Bilder eingezeichnet.

  async function zeichneSignatur(dataUrl, rect) {
    if (!dataUrl) return;
    const pngBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngBytes);
    const [x0, y0, x1, y1] = rect;
    const boxW = x1 - x0, boxH = y1 - y0;
    const scale = Math.min(boxW / pngImage.width, boxH / pngImage.height, 1);
    const w = pngImage.width * scale;
    const h = pngImage.height * scale;
    const page = pdfDoc.getPages()[0];
    page.drawImage(pngImage, { x: x0 + (boxW - w) / 2, y: y0 + (boxH - h) / 2, width: w, height: h });
  }
  await zeichneSignatur(b.unterschriftUnternehmer, UA_SIG_RECT_UNTERNEHMER);
  await zeichneSignatur(b.unterschriftBetriebsrat, UA_SIG_RECT_BETRIEBSRAT);

  // Formular "einbrennen": Felder werden zu normalem Seiteninhalt, damit das PDF in
  // jedem Betrachter (Mail-Anhang, Ausdruck) exakt gleich aussieht.
  form.flatten();

  // Nur Seite 1 wird benötigt (Seite 2–3 der Vorlage sind nur die Ausfüll-Erläuterungen).
  const seitenAnzahl = pdfDoc.getPageCount();
  for (let i = seitenAnzahl - 1; i >= 1; i--) pdfDoc.removePage(i);

  return pdfDoc.save();
}

function ualDateiname(b, empfaengerBezeichnung) {
  const namensteil = (b.personName || "Person").replace(/[^a-zA-Z0-9]+/g, "_");
  const datumsteil = (b.unfallDatum || "").replace(/-/g, "");
  const empfteil = empfaengerBezeichnung ? "_" + empfaengerBezeichnung.replace(/[^a-zA-Z0-9]+/g, "_") : "";
  return `Unfallanzeige_${namensteil}_${datumsteil}${empfteil}.pdf`;
}

function ualDownloadBytes(pdfBytes, dateiname) {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dateiname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Erzeugt für JEDEN in b.empfaengerListe hinterlegten Empfänger ein eigenes, vollständig
// identisches PDF (nur der Empfänger in Feld 3 unterscheidet sich) und lädt alle herunter.
// Der Browser fragt bei mehreren automatischen Downloads ggf. einmalig um Erlaubnis.
async function erzeugeUnfallanzeigePdf(b) {
  const liste = (b.empfaengerListe && b.empfaengerListe.length) ? b.empfaengerListe : [{ bezeichnung: "", adresse: b.empfaenger || "" }];
  for (let i = 0; i < liste.length; i++) {
    const empf = liste[i];
    const pdfBytes = await erzeugeEinzelnesPdf(b, empf.adresse);
    ualDownloadBytes(pdfBytes, ualDateiname(b, empf.bezeichnung || `Empfaenger${i + 1}`));
    // kleine Pause zwischen den Downloads, damit der Browser sie nicht als Popup-Flut blockiert
    if (i < liste.length - 1) await new Promise((r) => setTimeout(r, 400));
  }
}
