// ============================================================
// RAUMKOORDINATEN
// ------------------------------------------------------------
// Jeder Raum, in dem etwas stattfinden kann, braucht hier einen Eintrag.
// x / y  = Position auf dem Plan (Hilfe: index.html?admin öffnen und
//          auf die Karte klicken – die Koordinaten werden angezeigt)
// floor  = Plan-Nummer: 1=UG, 2=EG, 3=1. OG, 4=2. OG, 5=3. OG (Hauptgebäude)
//                      6=EG, 7=1. OG (Werkstatt)
// ============================================================

const roomCoordinates = {
    // Hauptgebäude - Untergeschoss
    'C.-1.44': { x: 365, y: 309, floor: 1 },
    'A.-1.14': { x: 665, y: 347, floor: 1 },
    'A.-1.15': { x: 668, y: 312, floor: 1 },
    'A.-1.16': { x: 671, y: 278, floor: 1 },
    'A.-1.17': { x: 674, y: 234, floor: 1 },
    'A.-1.18': { x: 626, y: 226, floor: 1 },
    'A.-1.20': { x: 621, y: 298, floor: 1 },
    'A.-1.21': { x: 617, y: 365, floor: 1 },   // 2026 per Plan-Auswertung ergänzt
    'D.-1.52': { x: 261, y: 297, floor: 1 },
    'E.-1.63': { x: 191, y: 257, floor: 1 },
    'E.-1.64': { x: 143, y: 258, floor: 1 },
    'E.-1.65': { x: 142, y: 312, floor: 1 },
    'E.-1.66': { x: 139, y: 369, floor: 1 },
    'E.-1.69': { x: 190, y: 350, floor: 1 },

    // Hauptgebäude - Erdgeschoss
    'A.0.11': { x: 647, y: 451, floor: 2 },
    'A.0.12': { x: 651, y: 412, floor: 2 },
    'A.0.14': { x: 654, y: 346, floor: 2 },
    'A.0.16': { x: 661, y: 251, floor: 2 },
    'A.0.18': { x: 616, y: 238, floor: 2 },
    'A.0.20': { x: 610, y: 309, floor: 2 },
    'A.0.21': { x: 607, y: 368, floor: 2 },
    'A.0.25': { x: 603, y: 453, floor: 2 },
    'B.0.30': { x: 550, y: 457, floor: 2 },
    'B.0.31': { x: 494, y: 458, floor: 2 },
    'C.0.40': { x: 370, y: 310, floor: 2 },
    'C.0.Pausenhalle': { x: 376, y: 398, floor: 2 },
    'D.0.52': { x: 267, y: 306, floor: 2 },
    'E.0.64': { x: 152, y: 264, floor: 2 },
    'E.0.68': { x: 152, y: 407, floor: 2 },
    'E.0.69': { x: 197, y: 410, floor: 2 },
    'E.0.70': { x: 199, y: 354, floor: 2 },
    'E.0.Flur': { x: 175, y: 339, floor: 2 },
    'Pavillon': { x: 515, y: 276, floor: 2 },
    'Parkplatz A': { x: 630, y: 155, floor: 2 },

    // Hauptgebäude - 1. Stock
    'B.1.31': { x: 584, y: 438, floor: 3 },
    'B.1.32': { x: 529, y: 442, floor: 3 },
    'B.1.33': { x: 485, y: 443, floor: 3 },
    'B.1.34': { x: 431, y: 444, floor: 3 },
    'C.1.41': { x: 353, y: 235, floor: 3 },
    'C.1.42': { x: 362, y: 310, floor: 3 },
    'C.1.44': { x: 363, y: 383, floor: 3 },
    'C.1.49': { x: 304, y: 455, floor: 3 },
    'D.1.52': { x: 202, y: 220, floor: 3 },
    'E.1.65': { x: 39, y: 156, floor: 3 },
    'E.1.67': { x: 38, y: 208, floor: 3 },
    'E.1.68': { x: 43, y: 258, floor: 3 },
    'E.1.69': { x: 44, y: 320, floor: 3 },
    'E.1.70': { x: 35, y: 376, floor: 3 },
    'E.1.72': { x: 107, y: 371, floor: 3 },
    'E.1.73': { x: 120, y: 290, floor: 3 },

    // Hauptgebäude - 1. Stock, Trakt A (2026 per Plan-Auswertung ergänzt)
    'A.1.10': { x: 749, y: 472, floor: 3 },
    'A.1.11': { x: 751, y: 433, floor: 3 },
    'A.1.12': { x: 754, y: 398, floor: 3 },
    'A.1.13': { x: 756, y: 371, floor: 3 },
    'A.1.14': { x: 759, y: 330, floor: 3 },
    'A.1.15': { x: 764, y: 274, floor: 3 },
    'A.1.16': { x: 767, y: 219, floor: 3 },
    'A.1.17': { x: 769, y: 178, floor: 3 },
    'A.1.18': { x: 773, y: 128, floor: 3 },
    'A.1.19': { x: 740, y: 119, floor: 3 },
    'A.1.20': { x: 704, y: 138, floor: 3 },
    // VORLÄUFIG: Im Plan 3.svg ist dieser Raum (zwischen A.1.23 und A.1.20)
    // fälschlich ebenfalls mit "A.1.12" beschriftet – vermutlich A.1.22.
    'A.1.22': { x: 700, y: 201, floor: 3 },
    'A.1.23': { x: 697, y: 244, floor: 3 },
    'A.1.24': { x: 695, y: 315, floor: 3 },
    'A.1.28': { x: 690, y: 394, floor: 3 },
    // A.1.21: im Plan nicht vorhanden – bewusst ohne Punkt (Angabe nur in der Ausstellerliste)

    // Hauptgebäude - 2. Stock
    'A.2.10': { x: 728, y: 457, floor: 4 },
    'A.2.16': { x: 747, y: 127, floor: 4 },
    'A.2.18': { x: 732, y: 182, floor: 4 },
    'A.2.20': { x: 707, y: 235, floor: 4 },
    'A.2.21': { x: 720, y: 328, floor: 4 },
    'A.2.25': { x: 714, y: 407, floor: 4 },
    'B.2.31': { x: 490, y: 449, floor: 4 },
    'B.2.32': { x: 406, y: 452, floor: 4 },
    'C.2.48': { x: 311, y: 426, floor: 4 },
    'E.2.60': { x: 96, y: 288, floor: 4 },
    'E.2.63': { x: 96, y: 161, floor: 4 },
    'E.2.64': { x: 30, y: 155, floor: 4 },
    'E.2.65': { x: 30, y: 206, floor: 4 },
    'E.2.66': { x: 29, y: 261, floor: 4 },

    // Werkstatt - Erdgeschoss
    'F.0.81': { x: 488, y: 305, floor: 6 },
    'F.0.83': { x: 420, y: 213, floor: 6 },
    'F.0.85': { x: 496, y: 204, floor: 6 },
    'F.0.86': { x: 350, y: 250, floor: 6 },
    'G.0.91': { x: 264, y: 344, floor: 6 },
    'G.0.92': { x: 260, y: 416, floor: 6 },
    'G.0.93': { x: 256, y: 484, floor: 6 },
    'G.0.96': { x: 338, y: 356, floor: 6 },
    'Werkstatt Außen': { x: 415, y: 441, floor: 6 },

    // Werkstatt - 1. Stock
    'F.1.82': { x: 518, y: 200, floor: 7 }
};
