// ============================================================
// BERUFSFINDUNGSMESSE – AUSSTELLER
// ------------------------------------------------------------
// Pro Aussteller eine Zeile:  name, room, info
// 'room' muss exakt so in raumkoordinaten.js stehen (z. B. 'A.0.14').
// Das Stockwerk wird automatisch aus dem Raum ermittelt.
// Aussteller mit unbekanntem Raum werden in der Liste als
// 'Raum fehlt' markiert (und in der Browser-Konsole gemeldet).
// ============================================================

const MESSE_TITEL = 'Berufsfindungsmesse 2026';

// info = kurze Beschreibung (optional, darf leer bleiben: '')
// ort  = nur nötig, wenn der Raum KEINE Koordinaten hat (dann kein Punkt
//        auf der Karte, aber Raum + Ortsangabe in der Liste)
const exhibitors = [
    { name: 'Tietjens Verfahrenstechnik GmbH', room: 'A.-1.14', info: 'Anlagenbau und Verfahrenstechnik' },
    { name: 'Steinbeis Papier GmbH', room: 'A.-1.15', info: 'Papierherstellung und Recycling' },
    { name: 'Panther Packaging GmbH & Co. KG', room: 'A.-1.17', info: 'Verpackungstechnik und Industrieproduktion' },
    { name: 'Karriereberatung der Bundeswehr', room: 'A.-1.20', info: 'Militärische und zivile Laufbahnen' },
    { name: 'F. REYHER Nchfg. GmbH & Co. KG', room: 'A.-1.21', info: 'Großhandel für Schrauben, Verbindungselemente und Befestigungstechnik' },
    { name: 'Ossenbrüggen Feinwerktechnik GmbH & Co. KG', room: 'A.0.12', info: 'Präzisionsmechanik und Feinwerktechnik' },
    { name: 'HellermannTyton GmbH & Co. KG', room: 'A.0.14', info: 'Kabeltechnik und Elektroinstallation' },
    { name: 'SALVANA TIERNAHRUNG GmbH', room: 'A.0.20', info: 'Tiernahrungsproduktion und Landwirtschaft' },
    { name: 'Holz Junge GmbH', room: 'A.0.25', info: 'Holzverarbeitung und Tischlerei' },
    { name: 'KW Design Akademie Hamburg/Bremen', room: 'A.1.11', info: 'Design und kreative Ausbildung' },
    { name: 'Universität Rostock', room: 'A.1.13', info: 'Universitätsstudium und Forschung' },
    { name: 'Autohaus Elmshorn GmbH & Co. KG', room: 'A.1.14', info: 'Automobilbereich und KFZ-Ausbildung' },
    { name: 'Lebenshilfe im Kreis Pinneberg', room: 'A.1.15', info: 'Begleitung von Menschen mit Behinderung – soziale und pädagogische Berufe' },
    { name: 'Hochschule für angewandte Wissenschaften (HAW) Kiel', room: 'A.1.16', info: 'Angewandte Wissenschaften und Technik' },
    { name: 'Berufliche Hochschule Hamburg (BHH)', room: 'A.1.17', info: 'Studium und Hochschulbildung' },
    { name: 'Fachhochschule Wedel gGmbH', room: 'A.1.18', info: 'Informatik und Wirtschaftsingenieurwesen' },
    { name: 'Fachhochschule Westküste', room: 'A.1.20', info: 'Wirtschaft und Technik an der Westküste' },
    { name: 'ArbeiterKind.de', room: 'A.1.21', ort: 'Hauptgebäude · 1. OG, Trakt A', info: 'Studienorientierung und Unterstützung für Studieninteressierte aus nichtakademischen Familien' },
    { name: 'NORDAKADEMIE Hochschule der Wirtschaft', room: 'A.1.22', info: 'Duale Hochschulausbildung' },
    { name: 'DAS FUTTERHAUS – Franchise GmbH & Co. KG', room: 'A.1.23', info: 'Fachhandel für Heimtierbedarf – Ausbildung im Einzelhandel' },
    { name: 'Backauf Computer GmbH', room: 'B.0.30', info: 'IT-Systeme und Computerservice' },
    { name: 'kommunit IT-Zweckverband Schleswig-Holstein', room: 'B.0.31', info: 'IT-Verwaltung und öffentlicher Sektor' },
    { name: 'Stadtwerke Elmshorn', room: 'B.1.31', info: 'Energie- und Wasserversorgung in der Region' },
    { name: 'Agentur für Arbeit Elmshorn', room: 'B.1.32', info: 'Berufsberatung und Stellenvermittlung' },
    { name: 'Stadt Elmshorn', room: 'B.1.33', info: 'Kommunalverwaltung und öffentlicher Dienst' },
    { name: 'Kreis Pinneberg', room: 'B.1.34', info: 'Öffentliche Verwaltung und Kommunaldienst' },
    { name: 'Landespolizei Schleswig-Holstein', room: 'C.-1.44', info: 'Polizeidienst und Ausbildung/Studium bei der Polizei' },
    { name: 'PAPE+RAHN PartG mbB Steuerberatungsgesellschaft', room: 'C.1.41', info: 'Steuerberatung und Wirtschaftsprüfung' },
    { name: 'ORLEN Deutschland GmbH', room: 'C.1.42', info: 'Tankstellennetz (star) und Energiehandel' },
    { name: 'Ehler Ermer & Partner mbB – Wirtschaftsprüfer | Steuerberater | Rechtsanwälte | Notarin', room: 'C.1.49', info: 'Wirtschaftsprüfung, Steuerberatung, Recht' },
    { name: 'Landesbetrieb für Küstenschutz, Nationalpark und Meeresschutz Schleswig-Holstein', room: 'D.-1.52', info: 'Küstenschutz und Umweltschutz' },
    { name: 'Handwerkskammer Lübeck', room: 'E.-1.63', info: 'Handwerksberufe und duale Ausbildung' },
    { name: 'Industrie- und Handelskammer zu Kiel', room: 'E.-1.64', info: 'Beratung zur dualen Ausbildung in Industrie, Handel und Dienstleistung' },
    { name: 'Regio Kliniken GmbH', room: 'E.-1.65', info: 'Gesundheitswesen und medizinische Versorgung' },
    { name: 'Klinikum Itzehoe', room: 'E.-1.69', info: 'Gesundheitswesen und Pflege' },
    { name: 'Peter Kölln GmbH & Co. KGaA', room: 'E.1.72', info: 'Lebensmittelproduktion – Haferflocken und Getreideprodukte aus Elmshorn' },
    { name: 'Jacobs Douwe Egberts DE GmbH', room: 'E.1.73', info: 'Lebensmittelindustrie und Produktion' },
    { name: 'Sparkasse Elmshorn', room: 'E.2.60', info: 'Bankwesen und Finanzdienstleistungen' },
    { name: 'Provinzial Nord Brandkasse AG', room: 'E.2.63', info: 'Versicherungswirtschaft' },
    { name: 'Finanzamt Elmshorn', room: 'E.2.65', info: 'Öffentlicher Dienst und Steuerverwaltung' },
    { name: 'Hauptzollamt Itzehoe', room: 'E.2.66', info: 'Zollverwaltung und öffentlicher Dienst' }
];
