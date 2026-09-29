// ============================================================
// TAG DER BERUFLICHEN BILDUNG – Daten (derzeit NICHT eingebunden)
// Aus der alten script.js gesichert, damit nichts verloren geht.
// ============================================================

const vocationalEducation = [
        // Gebäude A - Keller
        { name: 'PackmitteltechnologInnen', room: 'A.-1.18', building: 'hauptgebaeude', floor: 1, info: 'Stecktiere & Erzeugnisse aus Wellpappe, Papier und Karton', category: 'Handwerk' },

        // Gebäude A - Erdgeschoss
        { name: 'Elektrohandwerk - Energie & Gebäude', room: 'A.0.11', building: 'hauptgebaeude', floor: 2, info: 'Elektroniker für Energie- und Gebäudetechnik', category: 'Elektro' },
        { name: 'Elektrohandwerk - Automatisierung', room: 'A.0.16', building: 'hauptgebaeude', floor: 2, info: 'Elektroniker für Automatisierungs- und Systemtechnik', category: 'Elektro' },
        { name: 'Elektroindustrie', room: 'A.0.21', building: 'hauptgebaeude', floor: 2, info: 'Ausbildungsberufe in der Elektroindustrie', category: 'Elektro' },
        { name: 'IT-Berufe', room: 'A.0.18', building: 'hauptgebaeude', floor: 2, info: 'Vorstellung der IT-Berufe und Digitalisierung', category: 'IT' },

        // Gebäude A - Zweiter Stock
        { name: 'FriseurInnen - Styling', room: 'A.2.20', building: 'hauptgebaeude', floor: 4, info: 'Haarschnitte und professionelles Styling', category: 'Handwerk' },
        { name: 'FriseurInnen - Schnitt', room: 'A.2.18', building: 'hauptgebaeude', floor: 4, info: 'Haarschnitte und moderne Frisuren', category: 'Handwerk' },
        { name: 'FriseurInnen - Beratung', room: 'A.2.16', building: 'hauptgebaeude', floor: 4, info: 'Beratung und Typberatung', category: 'Handwerk' },

        // Gebäude B - Zweiter Stock
        { name: 'MalerInnen - Ornamente', room: 'B.2.31', building: 'hauptgebaeude', floor: 4, info: 'Karten mit Ornamenten schablonieren', category: 'Handwerk' },
        { name: 'MalerInnen - Techniken', room: 'B.2.32', building: 'hauptgebaeude', floor: 4, info: 'Verschiedene Maltechniken und Gestaltung', category: 'Handwerk' },

        // Gebäude C - Erdgeschoss
        { name: 'Bildungscampus', room: 'C.0.40', building: 'hauptgebaeude', floor: 2, info: 'Alle vollzeitschulischen Angebote zentral', category: 'Bildung' },
        { name: 'Jugendberufsagentur & Partner', room: 'C.0.Pausenhalle', building: 'hauptgebaeude', floor: 2, info: 'JBA, Agentur für Arbeit, IHK, Erasmusgruppe', category: 'Beratung' },

        // Gebäude C - Erster Stock
        { name: 'Kaufmännische AssistentInnen', room: 'C.1.44', building: 'hauptgebaeude', floor: 3, info: 'Lernbürokonzept und Büroorganisation', category: 'Kaufmännisch' },
        { name: 'BiZ - Bewerbungsservice', room: 'C.1.49', building: 'hauptgebaeude', floor: 3, info: 'Bewerbungsmappencheck und professionelle Fotoecke', category: 'Beratung' },

        // Gebäude D - Erdgeschoss
        { name: 'Fleischer/Fleischerin', room: 'D.0.52', building: 'hauptgebaeude', floor: 2, info: 'Vorstellung des Ausbildungsberufs Fleischer/Fleischerin', category: 'Lebensmittel' },

        // Gebäude D - Erster Stock
        { name: 'Fachverkäufer Bäckerei', room: 'D.1.52', building: 'hauptgebaeude', floor: 3, info: 'Fachverkäufer/in im Lebensmittelhandwerk Schwerpunkt Bäckerei', category: 'Verkauf' },

        // Gebäude E - Keller
        { name: 'Fachkräfte Pflegeassistenz', room: 'E.-1.66', building: 'hauptgebaeude', floor: 1, info: 'Vorstellung Fachkräfte für Pflegeassistenz', category: 'Gesundheit' },

        // Gebäude E - Erdgeschoss
        { name: 'Praktikumsplatzbörse Gastro', room: 'E.0.Flur', building: 'hauptgebaeude', floor: 2, info: 'Praktikumsplatzbörse im Gastrogewerbe', category: 'Gastronomie' },
        { name: 'Bäcker/Bäckerin', room: 'E.0.64', building: 'hauptgebaeude', floor: 2, info: 'Vorstellung des Ausbildungsberufes Bäcker/Bäckerin', category: 'Lebensmittel' },
        { name: 'Koch/Köchin & Fachkraft Küche', room: 'E.0.68', building: 'hauptgebaeude', floor: 2, info: 'Ausbildungsberufe Koch/Köchin und Fachkraft Küche', category: 'Gastronomie' },
        { name: 'Systemgastronomie', room: 'E.0.70', building: 'hauptgebaeude', floor: 2, info: 'Fachmann/Fachfrau für Systemgastronomie und Fachkraft Gastronomie', category: 'Gastronomie' },
        { name: 'Restaurant & Veranstaltung', room: 'E.0.69', building: 'hauptgebaeude', floor: 2, info: 'Fachmann/Fachfrau für Restaurant- und Veranstaltungsgastronomie', category: 'Gastronomie' },

        // Gebäude E - Erster Stock
        { name: 'Gastronomische AssistentInnen', room: 'E.1.69', building: 'hauptgebaeude', floor: 3, info: 'Vorstellung Gastronomischer AssistentInnen', category: 'Gastronomie' },
        { name: 'Hotelfachmann/-frau', room: 'E.1.67', building: 'hauptgebaeude', floor: 3, info: 'Ausbildungsberufe Hotelfachmann/-frau', category: 'Tourismus' },
        { name: 'Kaufmann/-frau Hotelmanagement', room: 'E.1.68', building: 'hauptgebaeude', floor: 3, info: 'Kaufmann/-frau für Hotelmanagement', category: 'Tourismus' },

        // Werkstatt F - Erdgeschoss
        { name: 'Fußbodenheizung Wettbewerb', room: 'F.0.81', building: 'werkstatt', floor: 6, info: 'Wettbewerb: Verlegen einer Fußbodenheizung', category: 'Handwerk' },
        { name: 'Sitzbank Wettbewerb', room: 'F.0.83', building: 'werkstatt', floor: 6, info: 'Wettbewerb: Bauen einer Sitzbank', category: 'Handwerk' },
        { name: 'MetalltechnikerInnen', room: 'F.0.85', building: 'werkstatt', floor: 6, info: '"Muttermännchen" - Figur aus Stahl fertigen', category: 'Metall' },
        { name: 'KonstruktionsmechanikerIn', room: 'F.0.86', building: 'werkstatt', floor: 6, info: 'Beruf KonstruktionsmechanikerIn kennenlernen', category: 'Metall' },

        // Werkstatt F - Erster Stock
        { name: 'AnlagenmechanikerIn SHK', room: 'F.1.82', building: 'werkstatt', floor: 7, info: 'AnlagenmechanikerIn in Sanitär- Heizungs- und Klimatechnik', category: 'Handwerk' },

        // Werkstatt G - Erdgeschoss
        { name: 'Tischlerhandwerk modern', room: 'G.0.91', building: 'werkstatt', floor: 6, info: 'Tischlerhandwerk: modern und traditionell', category: 'Holz' },
        { name: 'Tischlerhandwerk traditionell', room: 'G.0.96', building: 'werkstatt', floor: 6, info: 'Traditionelle Holzbearbeitung und Handwerk', category: 'Holz' },
        { name: 'Möbel-/Küchen-/Umzugsservice', room: 'G.0.92', building: 'werkstatt', floor: 6, info: 'Werkzeuge testen, Umzugskarton packen', category: 'Service' },
        { name: 'Fachkraft Umzugsservice', room: 'G.0.93', building: 'werkstatt', floor: 6, info: 'Fachkraft für Möbel-, Küchen- und Umzugsservice', category: 'Service' },

        // Außenbereiche
        { name: 'BaumschulgärtnerInnen', room: 'Pavillon', building: 'hauptgebaeude', floor: 2, info: 'Bodenlebewesen, Minibagger, Hebebühne, Gehölzrätsel', category: 'Garten' },
        { name: 'Garten- und Landschaftsbau', room: 'Pavillon', building: 'hauptgebaeude', floor: 2, info: 'Vermessungstechnik, Minibagger in Aktion', category: 'Garten' },
        { name: 'Bundeswehr', room: 'Parkplatz A', building: 'hauptgebaeude', floor: 2, info: 'Bundeswehrtruck mit Informationen', category: 'Öffentlich' },
        { name: 'KÜHL GmbH Kranverleih', room: 'Werkstatt Außen', building: 'werkstatt', floor: 6, info: 'Kranverleih mit Kran vor Ort', category: 'Technik' }
    ];
