// Raumplan Leaflet Konfiguration
document.addEventListener('DOMContentLoaded', function() {
    // Gebäude und Stockwerk-Konfiguration
    const buildings = {
        hauptgebaeude: {
            name: 'Hauptgebäude',
            floors: {
                1: { name: 'Untergeschoss', svg: '1.svg' },
                2: { name: 'Erdgeschoss', svg: '2.svg' },
                3: { name: '1. Stock', svg: '3.svg' },
                4: { name: '2. Stock', svg: '4.svg' },
                5: { name: '3. Stock', svg: '5.svg' }
            }
        },
        werkstatt: {
            name: 'Werkstattgebäude',
            floors: {
                6: { name: 'Erdgeschoss', svg: '6.svg' },
                7: { name: '1. Stock', svg: '7.svg' }
            }
        }
    };

    // Aktuelle Auswahl
    let currentFloor = 2;
    let currentBuilding = 'hauptgebaeude';
    let currentImageOverlay = null;
    let roomMarkers = [];
    let eventMarkers = [];
    let highlightedMarker = null;

    // Marker-Cache für bessere Performance
    let markerCache = new Map();
    let loadingMarkers = false;

    // Device detection
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

    // Konfigurationskonstanten
    const CONFIG = {
        map: {
            minZoom: -5,
            maxZoom: 3,
            center: [0, 0],
            zoom: 0,
            bounds: [[0, 0], [600, 800]]
        },
        ui: {
            highlightDuration: 5000,
            zoomAnimationDuration: 0.8,
            menuDelay: 100,
            pulseInterval: 300,
            pulseCount: 6
        },
        marker: {
            radius: isMobile ? 9 : 8,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            highlightRadius: isMobile ? 18 : 15,
            highlightWeight: 4,
            highlightFillOpacity: 0.9,
            touchRadius: 44 // Minimum touch target size (invisible)
        }
    };

    // Map initialisieren ohne geografische Koordinaten (für Raumplan)
    const map = L.map('map', {
        crs: L.CRS.Simple,
        ...CONFIG.map
    });

    // Raum-Koordinaten-Mapping
    // Diese Koordinaten müssen an Ihre tatsächlichen Raumpläne angepasst werden
    const roomCoordinates = {
        // Hauptgebäude - Untergeschoss
        'C.-1.44': { x: 341, y: 237 },
        'A.-1.14': { x: 737, y: 292 },
        'A.-1.15': { x: 740, y: 249 },
        'A.-1.16': { x: 744, y: 205 },
        'A.-1.17': { x: 748, y: 153 },
        'A.-1.18': { x: 687, y: 143 },
        'A.-1.20': { x: 681, y: 233 },
        'D.-1.52': { x: 225, y: 231 },
        'E.-1.63': { x: 135, y: 178 },
        'E.-1.64': { x: 73, y: 185 },
        'E.-1.65': { x: 74, y: 248 },
        'E.-1.66': { x: 68, y: 324 },
        'E.-1.69': { x: 135, y: 298 },

        // Hauptgebäude - Erdgeschoss
        'A.0.11': { x: 673, y: 429 },
        'A.0.12': { x: 676, y: 379 },
        'A.0.14': { x: 681, y: 299 },
        'A.0.16': { x: 690, y: 174 },
        'A.0.18': { x: 630, y: 158 },
        'A.0.20': { x: 625, y: 244 },
        'A.0.21': { x: 622, y: 322 },
        'A.0.25': { x: 618, y: 393 },
        'B.0.30': { x: 474, y: 436 },
        'B.0.31': { x: 547, y: 434 },
        'C.0.40': { x: 316, y: 246 },
        'C.0.Pausenhalle': { x: 327, y: 366 },
        'D.0.52': { x: 184, y: 240 },
        'E.0.64': { x: 38, y: 188 },
        'E.0.68': { x: 36, y: 366 },
        'E.0.69': { x: 95, y: 378 },
        'E.0.70': { x: 98, y: 304 },
        'E.0.Flur': { x: 66, y: 258 },
        'Pavillon': { x: 502, y: 204 },
        'Parkplatz A': { x: 236, y: 117 },

        // Hauptgebäude - 1. Stock
        'B.1.31': { x: 583, y: 438 },
        'B.1.32': { x: 529, y: 442 },
        'B.1.33': { x: 486, y: 442 },
        'B.1.34': { x: 430, y: 443 },
        'C.1.41': { x: 330, y: 224 },
        'C.1.42': { x: 360, y: 309 },
        'C.1.44': { x: 365, y: 380 },
        'C.1.49': { x: 305, y: 455 },
        'D.1.52': { x: 204, y: 219 },
        'E.1.65': { x: 38, y: 156 },
        'E.1.67': { x: 38, y: 207 },
        'E.1.68': { x: 38, y: 262 },
        'E.1.69': { x: 39, y: 317 },
        'E.1.70': { x: 35, y: 378 },
        'E.1.72': { x: 107, y: 373 },
        'E.1.73': { x: 107, y: 290 },

        // Hauptgebäude - 2. Stock
        'A.2.10': { x: 727, y: 455 },
        'A.2.16': { x: 727, y: 112 },
        'A.2.18': { x: 712, y: 170 },
        'A.2.20': { x: 706, y: 234 },
        'A.2.21': { x: 700, y: 312 },
        'A.2.25': { x: 695, y: 394 },
        'B.2.31': { x: 489, y: 448 },
        'B.2.32': { x: 408, y: 451 },
        'C.2.48': { x: 314, y: 424 },
        'E.2.60': { x: 96, y: 288 },
        'E.2.63': { x: 95, y: 157 },
        'E.2.64': { x: 31, y: 154 },
        'E.2.65': { x: 31, y: 204 },
        'E.2.66': { x: 30, y: 259 },

        // Werkstatt - Erdgeschoss
        'F.0.81': { x: 488, y: 305 },
        'F.0.83': { x: 420, y: 213 },
        'F.0.85': { x: 496, y: 204 },
        'F.0.86': { x: 350, y: 250 },
        'G.0.91': { x: 264, y: 344 },
        'G.0.92': { x: 260, y: 416 },
        'G.0.93': { x: 256, y: 484 },
        'G.0.96': { x: 338, y: 356 },
        'Werkstatt Außen': { x: 415, y: 441 },

        // Werkstatt - 1. Stock
        'F.1.82': { x: 518, y: 200 }
    };

    // Farben für alle Marker-Kategorien
    const markerColors = {
        room: '#007cba',           // Blau für normale Räume
        exhibitor: '#FFA500',      // Orange/Gelb für Berufsfindungsmesse
        vocational: '#28a745'      // Grün für Tag der beruflichen Bildung
    };

    // Optimierte Funktion zum Laden eines Stockwerks
    function loadFloor(floorNumber) {
        if (loadingMarkers) return; // Verhindere mehrfache gleichzeitige Aufrufe
        loadingMarkers = true;

        // Performance-optimierte Marker-Entfernung
        const markersToRemove = [...roomMarkers, ...eventMarkers];
        if (highlightedMarker) markersToRemove.push(highlightedMarker);

        // Batch-Entfernung für bessere Performance
        markersToRemove.forEach(marker => {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        });

        // Alten Overlay entfernen
        if (currentImageOverlay && map.hasLayer(currentImageOverlay)) {
            map.removeLayer(currentImageOverlay);
        }

        // Arrays zurücksetzen
        roomMarkers.length = 0;
        eventMarkers.length = 0;
        highlightedMarker = null;

        // Bestimme Gebäude basierend auf Stockwerk
        if (floorNumber >= 1 && floorNumber <= 5) {
            currentBuilding = 'hauptgebaeude';
        } else if (floorNumber >= 6 && floorNumber <= 7) {
            currentBuilding = 'werkstatt';
        }

        const building = buildings[currentBuilding];
        const floor = building.floors[floorNumber];

        if (floor) {
            // Neuen Overlay laden
            currentImageOverlay = L.imageOverlay(floor.svg, CONFIG.map.bounds).addTo(map);
            map.fitBounds(CONFIG.map.bounds);

            // UI aktualisieren
            updateFloorInfo(building.name, floor.name);
            updateActiveButton(floorNumber);

            // Verzögerte Marker-Erstellung für bessere Performance
            requestAnimationFrame(() => {
                addRoomMarkers(floorNumber);
                addEventMarkers(floorNumber);
                loadingMarkers = false;
            });

            currentFloor = floorNumber;
        } else {
            loadingMarkers = false;
        }
    }

    // UI Info aktualisieren
    function updateFloorInfo(buildingName, floorName) {
        document.getElementById('current-floor').textContent = `${buildingName} - ${floorName}`;
        // Mobile Info auch aktualisieren
        const mobileFloorElement = document.getElementById('mobile-current-floor');
        if (mobileFloorElement) {
            mobileFloorElement.textContent = `${buildingName} - ${floorName}`;
        }
    }

    // Aktiven Button aktualisieren
    function updateActiveButton(floorNumber) {
        // Desktop Buttons
        document.querySelectorAll('.floor-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const desktopBtn = document.querySelector(`[data-floor="${floorNumber}"]`);
        if (desktopBtn) desktopBtn.classList.add('active');

        // Mobile Buttons
        document.querySelectorAll('.mobile-floor-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const mobileBtn = document.querySelector(`.mobile-floor-btn[data-floor="${floorNumber}"]`);
        if (mobileBtn) mobileBtn.classList.add('active');
    }

    // Event Listener für Stockwerk-Buttons (Desktop)
    document.querySelectorAll('.floor-btn').forEach(button => {
        button.addEventListener('click', function() {
            const floorNumber = parseInt(this.dataset.floor);
            loadFloor(floorNumber);
        });
    });

    // Event Listener für mobile Stockwerk-Buttons
    document.querySelectorAll('.mobile-floor-btn').forEach(button => {
        button.addEventListener('click', function() {
            const floorNumber = parseInt(this.dataset.floor);
            loadFloor(floorNumber);
            closeMobileMenu(); // Menu nach Auswahl schließen
        });
    });

    // Raum-Daten pro Stockwerk
    // Um neue Räume hinzuzufügen, bearbeiten Sie diese Datenstruktur:
    // Format: { id: eindeutige_id, name: 'Raumname', x: x_koordinate, y: y_koordinate, info: 'Beschreibung' }
    const floorRooms = {
        1: [ // Untergeschoss
            { id: 1, name: 'WC', x: 831, y: 185, info: 'Die sanitären Anlagen befinden sich während der Bauarbeiten außerhalb des Gebäudes im Container hinter Gebäude A' },
            { id: 2, name: 'WC', x: 134, y: 227, info: 'WC: Damen und Herren' }
        ],
        2: [ // Erdgeschoss
            { id: 3, name: 'Empfang', x: 323, y: 451, info: 'Eingangshalle' },
            { id: 4, name: 'WC', x: 98, y: 255, info: 'WC: Damen und Herren' },
            { id: 5, name: 'WC', x: 269, y: 299, info: 'WC: Damen und Herren' }
        ],
        3: [ // 1. Stock
            { id: 6, name: 'WC', x: 106, y: 213, info: 'WC: Damen und Herren' },
            { id: 7, name: 'WC', x: 351, y: 426, info: 'WC: Herren' }
        ],
        4: [ // 2. Stock
            { id: 8, name: 'WC', x: 345, y: 424, info: 'WC: Herren' }
        ],
        5: [ // 3. Stock
            { id: 9, name: 'Aula', x: 326, y: 331, info: 'Aula' }
        ],
        6: [ // Werkstatt Erdgeschoss
            { id: 10, name: 'Werkstatt 1', x: 300, y: 200, info: 'Metallbearbeitung' },
            { id: 11, name: 'Lager', x: 500, y: 350, info: 'Materialausgabe' }
        ],
        7: [ // Werkstatt 1. Stock
            { id: 12, name: 'Büro Werkstatt', x: 250, y: 180, info: 'Verwaltung Werkstatt' }
        ]
    };

    // Einheitliche Funktion zum Erstellen von Markern
    function createMarker(coords, color, popupContent, clickHandler) {
        const marker = L.circleMarker([coords.y, coords.x], {
            radius: CONFIG.marker.radius,
            fillColor: color,
            color: '#ffffff',
            weight: CONFIG.marker.weight,
            opacity: CONFIG.marker.opacity,
            fillOpacity: CONFIG.marker.fillOpacity
        }).addTo(map);

        marker.bindPopup(popupContent);

        if (clickHandler) {
            // Optimierte Event-Handler für Touch und Click
            const handleInteraction = function(e) {
                e.originalEvent.stopPropagation();
                clickHandler(e);
            };

            // Touch-Events für bessere mobile Performance
            if (isMobile) {
                marker.on('touchstart', handleInteraction);
                // Verhindere Ghost-Clicks
                marker.on('click', function(e) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                });
            } else {
                marker.on('click', handleInteraction);
            }
        }

        return marker;
    }

    // Funktion zum Hinzufügen von Raum-Markern
    function addRoomMarkers(floorNumber) {
        const rooms = floorRooms[floorNumber] || [];

        rooms.forEach(raum => {
            const popupContent = `
                <div class="room-popup">
                    <div class="room-title">${raum.name}</div>
                    <div class="room-info">${raum.info}</div>
                    <div class="room-floor">Stockwerk: ${buildings[currentBuilding].floors[floorNumber].name}</div>
                </div>
            `;

            const clickHandler = function(e) {
                console.log(`Raum ausgewählt: ${raum.name} (Stock ${floorNumber})`);
                document.getElementById('floor-info').textContent = `Ausgewählt: ${raum.name}`;
            };

            const marker = createMarker(
                { x: raum.x, y: raum.y },
                markerColors.room,
                popupContent,
                clickHandler
            );

            // Marker-Metadaten für bessere Performance
            marker._raumplanData = {
                type: 'room',
                id: raum.id,
                name: raum.name,
                floor: floorNumber
            };

            roomMarkers.push(marker);
        });
    }

    // Event-Marker hinzufügen (Berufsfindungsmesse + Tag der beruflichen Bildung)
    function addEventMarkers(floorNumber) {
        // Berufsfindungsmesse-Marker (Orange/Gelb)
        const floorExhibitors = exhibitors.filter(exhibitor => exhibitor.floor === floorNumber);
        floorExhibitors.forEach(exhibitor => {
            const coords = roomCoordinates[exhibitor.room];
            if (coords) {
                const popupContent = `
                    <div class="event-popup">
                        <div class="event-header">🏢 <strong>Berufsfindungsmesse</strong></div>
                        <div class="event-title">${exhibitor.name}</div>
                        <div class="event-room">Raum: ${exhibitor.room}</div>
                        <div class="event-info">${exhibitor.info}</div>
                    </div>
                `;

                const clickHandler = function(e) {
                    document.getElementById('floor-info').textContent = `${exhibitor.name} → ${exhibitor.room}`;
                };

                const marker = createMarker(coords, markerColors.exhibitor, popupContent, clickHandler);

                // Marker-Metadaten für bessere Performance
                marker._raumplanData = {
                    type: 'exhibitor',
                    name: exhibitor.name,
                    room: exhibitor.room,
                    floor: floorNumber
                };

                eventMarkers.push(marker);
            }
        });

        // Tag der beruflichen Bildung-Marker (Grün)
        const floorVocational = vocationalEducation.filter(item => item.floor === floorNumber);
        floorVocational.forEach(item => {
            const coords = roomCoordinates[item.room];
            if (coords) {
                const popupContent = `
                    <div class="event-popup">
                        <div class="event-header">🎓 <strong>Tag der beruflichen Bildung</strong></div>
                        <div class="event-title">${item.name}</div>
                        <div class="event-category">Kategorie: ${item.category}</div>
                        <div class="event-room">Raum: ${item.room}</div>
                        <div class="event-info">${item.info}</div>
                    </div>
                `;

                const clickHandler = function(e) {
                    document.getElementById('floor-info').textContent = `${item.name} → ${item.room}`;
                };

                const marker = createMarker(coords, markerColors.vocational, popupContent, clickHandler);

                // Marker-Metadaten für bessere Performance
                marker._raumplanData = {
                    type: 'vocational',
                    name: item.name,
                    room: item.room,
                    floor: floorNumber,
                    category: item.category
                };

                eventMarkers.push(marker);
            }
        });
    }

    // Map Click Event für Info-Anzeige der Koordinaten (nur Konsole)
    map.on('click', function(e) {
        const coords = e.latlng;
        console.log(`Koordinaten: x: ${Math.round(coords.lng)}, y: ${Math.round(coords.lat)}`);
    });

    // Aussteller-Daten (Berufsfindungsmesse 2025)
    const exhibitors = [
        { name: 'Agentur für Arbeit', room: 'B.1.32', building: 'hauptgebaeude', floor: 3, info: 'Berufsberatung und Stellenvermittlung' },
        { name: 'Autohaus Elmshorn', room: 'A.2.25', building: 'hauptgebaeude', floor: 4, info: 'Automobilbereich und KFZ-Ausbildung' },
        { name: 'Backauf Computer GmbH', room: 'B.0.30', building: 'hauptgebaeude', floor: 2, info: 'IT-Systeme und Computerservice' },
        { name: 'Berufliche Hochschule Hamburg (BHH)', room: 'E.2.64', building: 'hauptgebaeude', floor: 4, info: 'Studium und Hochschulbildung' },
        { name: 'EF Education (Deutschland) GmbH', room: 'E.1.70', building: 'hauptgebaeude', floor: 3, info: 'Sprachreisen und internationale Bildung' },
        { name: 'EHLER ERMER & PARTNER', room: 'C.2.48', building: 'hauptgebaeude', floor: 4, info: 'Wirtschaftsprüfung, Steuerberatung, Recht' },
        { name: 'Fachhochschule Kiel', room: 'E.2.60', building: 'hauptgebaeude', floor: 4, info: 'Angewandte Wissenschaften und Technik' },
        { name: 'Fachhochschule Wedel', room: 'E.2.63', building: 'hauptgebaeude', floor: 4, info: 'Informatik und Wirtschaftsingenieurwesen' },
        { name: 'Fachhochschule Westküste', room: 'E.2.65', building: 'hauptgebaeude', floor: 4, info: 'Wirtschaft und Technik an der Westküste' },
        { name: 'Feuerwehr Hamburg', room: 'A.2.21', building: 'hauptgebaeude', floor: 4, info: 'Rettungsdienst und Brandschutz' },
        { name: 'Finanzamt Elmshorn', room: 'C.-1.44', building: 'hauptgebaeude', floor: 1, info: 'Öffentlicher Dienst und Steuerverwaltung' },
        { name: 'Flora Unternehmensgruppe', room: 'E.-1.65', building: 'hauptgebaeude', floor: 1, info: 'Gartenbau und Landschaftspflege' },
        { name: 'Handwerkskammer Lübeck', room: 'A.-1.14', building: 'hauptgebaeude', floor: 1, info: 'Handwerksberufe und duale Ausbildung' },
        { name: 'Hauptzollamt Itzehoe', room: 'C.1.42', building: 'hauptgebaeude', floor: 3, info: 'Zollverwaltung und öffentlicher Dienst' },
        { name: 'HellermannTyton GmbH & Co. KG', room: 'A.0.14', building: 'hauptgebaeude', floor: 2, info: 'Kabeltechnik und Elektroinstallation' },
        { name: 'Holz Junge GmbH', room: 'A.0.25', building: 'hauptgebaeude', floor: 2, info: 'Holzverarbeitung und Tischlerei' },
        { name: 'Itzehoer Versicherung', room: 'A.2.10', building: 'hauptgebaeude', floor: 4, info: 'Versicherungswirtschaft und Finanzdienstleistungen' },
        { name: 'Jacobs Douwe Egberts DE GmbH', room: 'E.1.73', building: 'hauptgebaeude', floor: 3, info: 'Lebensmittelindustrie und Produktion' },
        { name: 'Karriereberatung der Bundeswehr', room: 'A.-1.15', building: 'hauptgebaeude', floor: 1, info: 'Militärische und zivile Laufbahnen' },
        { name: 'Klinikum Itzehoe', room: 'E.-1.69', building: 'hauptgebaeude', floor: 1, info: 'Gesundheitswesen und Pflege' },
        { name: 'kommunit IT-Zweckverband', room: 'B.0.31', building: 'hauptgebaeude', floor: 2, info: 'IT-Verwaltung und öffentlicher Sektor' },
        { name: 'Kreis Pinneberg', room: 'B.1.33', building: 'hauptgebaeude', floor: 3, info: 'Öffentliche Verwaltung und Kommunaldienst' },
        { name: 'KW Design Akademie Hamburg', room: 'E.1.65', building: 'hauptgebaeude', floor: 3, info: 'Design und kreative Ausbildung' },
        { name: 'LKN Schleswig-Holstein', room: 'D.-1.52', building: 'hauptgebaeude', floor: 1, info: 'Küstenschutz und Umweltschutz' },
        { name: 'NORDAKADEMIE', room: 'E.2.66', building: 'hauptgebaeude', floor: 4, info: 'Duale Hochschulausbildung' },
        { name: 'Ossenbrüggen Feinwerktechnik', room: 'A.0.12', building: 'hauptgebaeude', floor: 2, info: 'Präzisionsmechanik und Feinwerktechnik' },
        { name: 'Panther Packaging', room: 'A.-1.17', building: 'hauptgebaeude', floor: 1, info: 'Verpackungstechnik und Industrieproduktion' },
        { name: 'PAPE+RAHN PartG mbB', room: 'C.1.41', building: 'hauptgebaeude', floor: 3, info: 'Steuerberatung und Wirtschaftsprüfung' },
        { name: 'Provinzial Nord Brandkasse AG', room: 'B.1.31', building: 'hauptgebaeude', floor: 3, info: 'Versicherungswirtschaft' },
        { name: 'Regio Kliniken GmbH', room: 'E.-1.64', building: 'hauptgebaeude', floor: 1, info: 'Gesundheitswesen und medizinische Versorgung' },
        { name: 'SALVANA TIERNAHRUNG GmbH', room: 'A.0.20', building: 'hauptgebaeude', floor: 2, info: 'Tiernahrungsproduktion und Landwirtschaft' },
        { name: 'Sparkasse Elmshorn', room: 'E.1.72', building: 'hauptgebaeude', floor: 3, info: 'Bankwesen und Finanzdienstleistungen' },
        { name: 'Stadt Elmshorn', room: 'B.1.34', building: 'hauptgebaeude', floor: 3, info: 'Kommunalverwaltung und öffentlicher Dienst' },
        { name: 'Steinbeis Papier GmbH', room: 'A.-1.16', building: 'hauptgebaeude', floor: 1, info: 'Papierherstellung und Recycling' },
        { name: 'Tietjens Verfahrenstechnik GmbH', room: 'A.-1.20', building: 'hauptgebaeude', floor: 1, info: 'Anlagenbau und Verfahrenstechnik' },
        { name: 'Universität Rostock', room: 'E.-1.63', building: 'hauptgebaeude', floor: 1, info: 'Universitätsstudium und Forschung' }
    ];

    // Bildungsangebote (Tag der beruflichen Bildung 2025)
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

    // Aussteller-Funktionen
    function populateExhibitorList() {
        const exhibitorList = document.getElementById('exhibitor-list');
        exhibitorList.innerHTML = '';

        exhibitors.forEach(exhibitor => {
            const item = document.createElement('div');
            item.className = 'exhibitor-item';
            item.innerHTML = `
                <div class="exhibitor-main">
                    <span class="exhibitor-name">${exhibitor.name}</span>
                    <span class="exhibitor-room">${exhibitor.room}</span>
                </div>
                <div class="exhibitor-info">${exhibitor.info}</div>
                <button class="locate-btn" onclick="locateExhibitor('${exhibitor.name}')">📍 Zeigen</button>
            `;
            exhibitorList.appendChild(item);
        });
    }

    function openExhibitorOverlay() {
        const overlay = document.getElementById('exhibitor-overlay');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeExhibitorOverlay() {
        const overlay = document.getElementById('exhibitor-overlay');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    function filterExhibitors() {
        const searchTerm = document.getElementById('exhibitor-search').value.toLowerCase();
        const items = document.querySelectorAll('.exhibitor-item');

        items.forEach(item => {
            const name = item.querySelector('.exhibitor-name').textContent.toLowerCase();
            const room = item.querySelector('.exhibitor-room').textContent.toLowerCase();
            const info = item.querySelector('.exhibitor-info').textContent.toLowerCase();

            if (name.includes(searchTerm) || room.includes(searchTerm) || info.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function locateExhibitor(exhibitorName) {
        const exhibitor = exhibitors.find(e => e.name === exhibitorName);
        if (!exhibitor) return;

        locateItem(exhibitor, 'exhibitor', closeExhibitorOverlay);
    }

    // Vocational Education Funktionen
    function populateVocationalList() {
        const vocationalList = document.getElementById('vocational-list');
        vocationalList.innerHTML = '';

        vocationalEducation.forEach(item => {
            const element = document.createElement('div');
            element.className = 'vocational-item';
            element.innerHTML = `
                <div class="vocational-main">
                    <span class="vocational-name">${item.name}</span>
                    <span class="vocational-category">${item.category}</span>
                </div>
                <div class="vocational-room">${item.room}</div>
                <div class="vocational-info">${item.info}</div>
                <button class="locate-btn" onclick="locateVocationalItem('${item.name}')">📍 Zeigen</button>
            `;
            vocationalList.appendChild(element);
        });
    }

    function openVocationalOverlay() {
        const overlay = document.getElementById('vocational-overlay');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeVocationalOverlay() {
        const overlay = document.getElementById('vocational-overlay');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    function filterVocational() {
        const searchTerm = document.getElementById('vocational-search').value.toLowerCase();
        const items = document.querySelectorAll('.vocational-item');

        items.forEach(item => {
            const name = item.querySelector('.vocational-name').textContent.toLowerCase();
            const category = item.querySelector('.vocational-category').textContent.toLowerCase();
            const room = item.querySelector('.vocational-room').textContent.toLowerCase();
            const info = item.querySelector('.vocational-info').textContent.toLowerCase();

            if (name.includes(searchTerm) || category.includes(searchTerm) || 
                room.includes(searchTerm) || info.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function locateVocationalItem(itemName) {
        const item = vocationalEducation.find(e => e.name === itemName);
        if (!item) return;

        locateItem(item, 'vocational', closeVocationalOverlay);
    }

    // Einheitliche Locate-Funktion
    function locateItem(item, type, closeOverlayFn) {
        closeOverlayFn();
        loadFloor(item.floor);

        // Zoom und Hervorhebung mit Verzögerung
        setTimeout(() => {
            highlightAndZoomToRoom(item.room, markerColors[type]);
        }, CONFIG.ui.menuDelay);

        document.getElementById('floor-info').textContent = `${item.name} → ${item.room}`;
        console.log(`Navigiere zu: ${item.name} in Raum ${item.room}`);
    }

    // Optimierte Funktion zum Hervorheben und Zoomen zu einem Raum
    function highlightAndZoomToRoom(roomId, color) {
        const coords = roomCoordinates[roomId];
        if (!coords) return;

        // Entferne vorherigen Highlight-Marker
        clearHighlight();

        // Erstelle hervorgehobenen Marker mit Touch-Optimierung
        highlightedMarker = L.circleMarker([coords.y, coords.x], {
            radius: CONFIG.marker.highlightRadius,
            fillColor: color,
            color: '#ffffff',
            weight: CONFIG.marker.highlightWeight,
            opacity: CONFIG.marker.opacity,
            fillOpacity: CONFIG.marker.highlightFillOpacity,
            className: 'highlighted-marker',
            interactive: false // Verhindert Event-Konflikte
        }).addTo(map);

        // Optimierter Zoom mit requestAnimationFrame
        requestAnimationFrame(() => {
            map.setView([coords.y, coords.x], 1, {
                animate: true,
                duration: CONFIG.ui.zoomAnimationDuration
            });
        });

        // Pulsierender Effekt
        animatePulse();

        // Automatisches Entfernen des Highlights
        setTimeout(clearHighlight, CONFIG.ui.highlightDuration);
    }

    // Hilfsfunktionen für bessere Lesbarkeit
    function clearHighlight() {
        if (highlightedMarker) {
            map.removeLayer(highlightedMarker);
            highlightedMarker = null;
        }
    }

    function animatePulse() {
        let pulseCount = 0;
        const pulseInterval = setInterval(() => {
            if (highlightedMarker && pulseCount < CONFIG.ui.pulseCount) {
                const currentRadius = highlightedMarker.getRadius();
                const newRadius = currentRadius === CONFIG.marker.highlightRadius ? 20 : CONFIG.marker.highlightRadius;
                highlightedMarker.setRadius(newRadius);
                pulseCount++;
            } else {
                clearInterval(pulseInterval);
                if (highlightedMarker) {
                    highlightedMarker.setRadius(12);
                }
            }
        }, CONFIG.ui.pulseInterval);
    }

    // Mobile Menu Funktionen
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.querySelector('.hamburger-btn');

        if (mobileMenu.classList.contains('show')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.querySelector('.hamburger-btn');

        mobileMenu.classList.add('show');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.querySelector('.hamburger-btn');

        mobileMenu.classList.remove('show');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Welcome Overlay Funktionen
    function openWelcomeOverlay() {
        const overlay = document.getElementById('welcome-overlay');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeWelcomeOverlay() {
        const overlay = document.getElementById('welcome-overlay');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Welcome Overlay beim ersten Besuch anzeigen
    function showWelcomeOnFirstVisit() {
        const hasVisited = localStorage.getItem('raumplan-visited');
        if (!hasVisited) {
            setTimeout(() => {
                openWelcomeOverlay();
                localStorage.setItem('raumplan-visited', 'true');
            }, 500); // Kurze Verzögerung für bessere UX
        }
    }

    // Globale Funktionen für HTML
    window.openExhibitorOverlay = openExhibitorOverlay;
    window.closeExhibitorOverlay = closeExhibitorOverlay;
    window.filterExhibitors = filterExhibitors;
    window.locateExhibitor = locateExhibitor;
    window.openVocationalOverlay = openVocationalOverlay;
    window.closeVocationalOverlay = closeVocationalOverlay;
    window.filterVocational = filterVocational;
    window.locateVocationalItem = locateVocationalItem;
    window.toggleMobileMenu = toggleMobileMenu;
    window.closeMobileMenu = closeMobileMenu;
    window.openWelcomeOverlay = openWelcomeOverlay;
    window.closeWelcomeOverlay = closeWelcomeOverlay;

    // Listen beim Start füllen
    populateExhibitorList();
    populateVocationalList();

    // Initialer Stockwerk laden (Erdgeschoss)
    loadFloor(2);

    // Welcome Overlay beim ersten Besuch anzeigen
    showWelcomeOnFirstVisit();

    // Globale Funktionen für spätere Erweiterungen
    window.raumplanFunctions = {
        loadFloor: loadFloor,
        getCurrentFloor: () => currentFloor,
        getCurrentBuilding: () => currentBuilding,
        getFloorRooms: (floor) => floorRooms[floor] || [],
        addRoom: function(name, x, y, info, floor = currentFloor) {
            const marker = L.circleMarker([y, x], {
                radius: 8,
                fillColor: '#007cba',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            marker.bindPopup(`<strong>${name}</strong><br>${info || ''}`);
            roomMarkers.push(marker);
            return marker;
        }
    };
});