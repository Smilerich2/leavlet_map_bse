// Raumplan Leaflet Konfiguration
// Benötigt (vorher in index.html geladen):
//   raumkoordinaten.js  -> roomCoordinates
//   messe-aussteller.js -> exhibitors, MESSE_TITEL
document.addEventListener('DOMContentLoaded', function() {
    // Gebäude und Stockwerk-Konfiguration
    const buildings = {
        hauptgebaeude: {
            name: 'Hauptgebäude',
            floors: {
                1: { name: 'Untergeschoss', short: 'UG', svg: '1.svg' },
                2: { name: 'Erdgeschoss', short: 'EG', svg: '2.svg' },
                3: { name: '1. Stock', short: '1. OG', svg: '3.svg' },
                4: { name: '2. Stock', short: '2. OG', svg: '4.svg' },
                5: { name: '3. Stock', short: '3. OG', svg: '5.svg' }
            }
        },
        werkstatt: {
            name: 'Werkstattgebäude',
            floors: {
                6: { name: 'Erdgeschoss', short: 'EG', svg: '6.svg' },
                7: { name: '1. Stock', short: '1. OG', svg: '7.svg' }
            }
        }
    };

    function buildingKeyForFloor(floorNumber) {
        return floorNumber >= 6 ? 'werkstatt' : 'hauptgebaeude';
    }

    function floorLabel(floorNumber) {
        const b = buildings[buildingKeyForFloor(floorNumber)];
        const f = b.floors[floorNumber];
        return f ? `${b.name} · ${f.short}` : '';
    }

    // Aktuelle Auswahl
    let currentFloor = 2;
    let currentBuilding = 'hauptgebaeude';
    let currentImageOverlay = null;
    let roomMarkers = [];
    let eventMarkers = [];
    let adminMarkers = [];
    let loadingMarkers = false;
    let highlightedMarker = null;
    let highlightTimer = null;
    let pulseInterval = null;

    // Admin-Modus: index.html?admin
    const ADMIN_MODE = new URLSearchParams(window.location.search).has('admin');

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
        marker: {
            radius: isMobile ? 9 : 8,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }
    };

    // Map initialisieren ohne geografische Koordinaten (für Raumplan)
    const map = L.map('map', {
        crs: L.CRS.Simple,
        ...CONFIG.map
    });

    // Farben für alle Marker-Kategorien
    const markerColors = {
        room: '#007cba',           // Blau für normale Räume
        exhibitor: '#FFA500',      // Orange für Berufsfindungsmesse
        admin: '#888888'           // Grau: alle hinterlegten Räume (Admin-Modus)
    };

    // HTML-sicher ausgeben (Firmennamen mit & oder ' etc.)
    function esc(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ------------------------------------------------------------
    // Messe-Daten vorbereiten: Stockwerk automatisch aus Raum ableiten
    // ------------------------------------------------------------
    const messeAussteller = (typeof exhibitors !== 'undefined' ? exhibitors : [])
        .map(e => {
            const coords = roomCoordinates[e.room];
            return { ...e, floor: coords ? coords.floor : null };
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'de'));

    const fehlendeRaeume = messeAussteller.filter(e => e.floor === null);
    if (fehlendeRaeume.length) {
        console.warn('⚠️ Messe: Für diese Aussteller ist der Raum nicht in raumkoordinaten.js hinterlegt:',
            fehlendeRaeume.map(e => `${e.name} → ${e.room}`));
    }

    // ------------------------------------------------------------
    // Stockwerk laden
    // ------------------------------------------------------------
    function loadFloor(floorNumber) {
        if (loadingMarkers) return;
        loadingMarkers = true;

        clearHighlight();
        [...roomMarkers, ...eventMarkers, ...adminMarkers].forEach(marker => {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        });
        if (currentImageOverlay && map.hasLayer(currentImageOverlay)) {
            map.removeLayer(currentImageOverlay);
        }
        roomMarkers.length = 0;
        eventMarkers.length = 0;
        adminMarkers.length = 0;

        currentBuilding = buildingKeyForFloor(floorNumber);
        const building = buildings[currentBuilding];
        const floor = building.floors[floorNumber];

        if (floor) {
            currentImageOverlay = L.imageOverlay(floor.svg, CONFIG.map.bounds).addTo(map);
            map.fitBounds(CONFIG.map.bounds, { animate: false });

            updateFloorInfo(building.name, floor.name);
            updateActiveButton(floorNumber);
            currentFloor = floorNumber;

            if (ADMIN_MODE) addAdminMarkers(floorNumber);
            addRoomMarkers(floorNumber);
            addExhibitorMarkers(floorNumber);
        }
        loadingMarkers = false;
    }

    function updateFloorInfo(buildingName, floorName) {
        document.getElementById('current-floor').textContent = `${buildingName} - ${floorName}`;
        const mobileFloorElement = document.getElementById('mobile-current-floor');
        if (mobileFloorElement) mobileFloorElement.textContent = `${buildingName} - ${floorName}`;
    }

    function updateActiveButton(floorNumber) {
        document.querySelectorAll('.floor-btn, .mobile-floor-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.floor) === floorNumber);
        });
    }

    document.querySelectorAll('.floor-btn').forEach(button => {
        button.addEventListener('click', function() {
            loadFloor(parseInt(this.dataset.floor));
        });
    });

    document.querySelectorAll('.mobile-floor-btn').forEach(button => {
        button.addEventListener('click', function() {
            loadFloor(parseInt(this.dataset.floor));
            closeMobileMenu();
        });
    });

    // Feste Raum-Infos pro Stockwerk (WC, Empfang, Aula ...)
    // Format: { id, name, x, y, info }
    const floorRooms = {
        1: [ // Untergeschoss
            { id: 1, name: 'WC', x: 614, y: 396, info: 'WC im Trakt A' },
            { id: 2, name: 'WC', x: 192, y: 291, info: 'WC: Damen und Herren' }
        ],
        2: [ // Erdgeschoss
            { id: 3, name: 'Empfang', x: 385, y: 465, info: 'Eingangshalle' },
            { id: 4, name: 'WC', x: 199, y: 315, info: 'WC: Damen und Herren' },
            { id: 5, name: 'WC', x: 328, y: 348, info: 'WC: Damen und Herren' },
            { id: 13, name: 'WC', x: 606, y: 399, info: 'WC im Trakt A' }
        ],
        3: [ // 1. Stock
            { id: 6, name: 'WC', x: 106, y: 214, info: 'WC: Damen und Herren' },
            { id: 7, name: 'WC', x: 367, y: 418, info: 'WC: Herren' },
            { id: 14, name: 'WC', x: 692, y: 359, info: 'WC im Trakt A' }
        ],
        4: [ // 2. Stock
            { id: 8, name: 'WC', x: 359, y: 417, info: 'WC: Herren' },
            { id: 15, name: 'WC', x: 698, y: 362, info: 'WC im Trakt A' }
        ],
        5: [ // 3. Stock
            { id: 9, name: 'Aula', x: 326, y: 331, info: 'Aula' }
        ],
        6: [ // Werkstatt Erdgeschoss
            { id: 10, name: 'WC', x: 485, y: 268, info: 'WC: Damen und Herren' }
        ],
        7: [ // Werkstatt 1. Stock
            { id: 12, name: 'WC', x: 455, y: 227, info: 'WC: Damen und Herren' }
        ]
    };

    // Einheitliche Funktion zum Erstellen von Markern
    function createMarker(coords, color, popupContent, clickHandler, extraOptions = {}) {
        const marker = L.circleMarker([coords.y, coords.x], {
            radius: CONFIG.marker.radius,
            fillColor: color,
            color: '#ffffff',
            weight: CONFIG.marker.weight,
            opacity: CONFIG.marker.opacity,
            fillOpacity: CONFIG.marker.fillOpacity,
            ...extraOptions
        }).addTo(map);

        if (popupContent) marker.bindPopup(popupContent);
        if (clickHandler) marker.on('click', clickHandler);
        return marker;
    }

    function addRoomMarkers(floorNumber) {
        (floorRooms[floorNumber] || []).forEach(raum => {
            const popupContent = `
                <div class="room-popup">
                    <div class="room-title">${esc(raum.name)}</div>
                    <div class="room-info">${esc(raum.info)}</div>
                    <div class="room-floor">Stockwerk: ${esc(buildings[currentBuilding].floors[floorNumber].name)}</div>
                </div>`;
            const marker = createMarker({ x: raum.x, y: raum.y }, markerColors.room, popupContent, () => {
                document.getElementById('floor-info').textContent = `Ausgewählt: ${raum.name}`;
            });
            roomMarkers.push(marker);
        });
    }

    // ------------------------------------------------------------
    // Berufsfindungsmesse
    // ------------------------------------------------------------
    // Ein Marker pro Raum – falls mehrere Aussteller denselben Raum teilen,
    // stehen alle im selben Popup.
    function addExhibitorMarkers(floorNumber) {
        const proRaum = {};
        messeAussteller
            .filter(e => e.floor === floorNumber)
            .forEach(e => (proRaum[e.room] = proRaum[e.room] || []).push(e));

        Object.entries(proRaum).forEach(([room, liste]) => {
            const coords = roomCoordinates[room];
            const eintraege = liste.map(e => `
                <div class="event-title">${esc(e.name)}</div>
                ${e.info ? `<div class="event-info">${esc(e.info)}</div>` : ''}`).join('');
            const popupContent = `
                <div class="event-popup">
                    <div class="event-header">🏢 <strong>${esc(MESSE_TITEL)}</strong></div>
                    ${eintraege}
                    <div class="event-room">Raum: ${esc(room)}</div>
                </div>`;

            const marker = createMarker(coords, markerColors.exhibitor, popupContent, () => {
                document.getElementById('floor-info').textContent =
                    `${liste.map(e => e.name).join(', ')} → ${room}`;
            });
            marker._raumplanData = { type: 'exhibitor', room };
            eventMarkers.push(marker);
        });
    }

    function populateExhibitorList() {
        const list = document.getElementById('exhibitor-list');
        if (!list) return;
        list.innerHTML = '';

        if (!messeAussteller.length) {
            list.innerHTML = '<p class="exhibitor-info">Noch keine Aussteller eingetragen.</p>';
            return;
        }

        messeAussteller.forEach(exhibitor => {
            const item = document.createElement('div');
            item.className = 'exhibitor-item';
            const ort = exhibitor.floor ? floorLabel(exhibitor.floor) : (exhibitor.ort || '');
            item.innerHTML = `
                <div class="exhibitor-main">
                    <span class="exhibitor-name">${esc(exhibitor.name)}</span>
                    <span class="exhibitor-room">${esc(exhibitor.room)}</span>
                </div>
                ${exhibitor.info ? `<div class="exhibitor-info">${esc(exhibitor.info)}</div>` : ''}
                ${ort ? `<div class="exhibitor-info"><small>${esc(ort)}</small></div>` : ''}`;
            // Suchtext für Filter (inkl. Stockwerk)
            item.dataset.search = `${exhibitor.name} ${exhibitor.room} ${exhibitor.info} ${ort}`.toLowerCase();

            if (exhibitor.floor) {
                const btn = document.createElement('button');
                btn.className = 'locate-btn';
                btn.textContent = '📍 Zeigen';
                btn.addEventListener('click', () => locateExhibitor(exhibitor));
                item.appendChild(btn);
            }
            list.appendChild(item);
        });
    }

    function openExhibitorOverlay() {
        document.getElementById('exhibitor-overlay').classList.add('show');
        document.body.style.overflow = 'hidden';
        const search = document.getElementById('exhibitor-search');
        if (search && !isMobile) search.focus();
    }

    function closeExhibitorOverlay() {
        document.getElementById('exhibitor-overlay').classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    function filterExhibitors() {
        const term = document.getElementById('exhibitor-search').value.trim().toLowerCase();
        document.querySelectorAll('.exhibitor-item').forEach(item => {
            item.style.display = item.dataset.search.includes(term) ? 'block' : 'none';
        });
    }

    function locateExhibitor(exhibitor) {
        closeExhibitorOverlay();
        if (currentFloor !== exhibitor.floor) loadFloor(exhibitor.floor);

        // Popup des Messe-Markers öffnen und Raum hervorheben
        const marker = eventMarkers.find(m => m._raumplanData.room === exhibitor.room);
        if (marker) marker.openPopup();
        showPulsingPoint(exhibitor.room);

        document.getElementById('floor-info').textContent = `${exhibitor.name} → ${exhibitor.room}`;
    }

    // Rot pulsierender Punkt zur Hervorhebung
    function showPulsingPoint(roomId) {
        const coords = roomCoordinates[roomId];
        if (!coords) return;
        clearHighlight();

        highlightedMarker = L.circleMarker([coords.y, coords.x], {
            radius: 15,
            fillColor: '#ff0000',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.6,
            interactive: false
        }).addTo(map);
        highlightedMarker.bringToBack();

        let count = 0;
        pulseInterval = setInterval(() => {
            if (!highlightedMarker || count >= 10) {
                clearInterval(pulseInterval);
                return;
            }
            highlightedMarker.setRadius(highlightedMarker.getRadius() === 15 ? 25 : 15);
            count++;
        }, 300);

        highlightTimer = setTimeout(clearHighlight, 5000);
    }

    function clearHighlight() {
        clearInterval(pulseInterval);
        clearTimeout(highlightTimer);
        if (highlightedMarker) {
            map.removeLayer(highlightedMarker);
            highlightedMarker = null;
        }
    }

    // ------------------------------------------------------------
    // Admin-Modus (index.html?admin):
    // zeigt alle hinterlegten Raumkoordinaten des Stockwerks und
    // beim Klick auf die Karte die passende Zeile für raumkoordinaten.js
    // ------------------------------------------------------------
    function addAdminMarkers(floorNumber) {
        Object.entries(roomCoordinates)
            .filter(([, c]) => c.floor === floorNumber)
            .forEach(([room, c]) => {
                const m = createMarker(c, markerColors.admin, null, null, { radius: 5, interactive: false });
                m.bindTooltip(room, { permanent: true, direction: 'right', offset: [6, 0], className: 'admin-label' });
                adminMarkers.push(m);
            });
    }

    map.on('click', function(e) {
        const x = Math.round(e.latlng.lng);
        const y = Math.round(e.latlng.lat);
        console.log(`Koordinaten: x: ${x}, y: ${y}`);
        if (!ADMIN_MODE) return;

        const zeile = `'RAUM': { x: ${x}, y: ${y}, floor: ${currentFloor} },`;
        L.popup()
            .setLatLng(e.latlng)
            .setContent(`
                <div class="room-popup">
                    <div class="room-title">x: ${x}, y: ${y}</div>
                    <div class="room-info">Zeile für raumkoordinaten.js<br>(RAUM ersetzen):</div>
                    <code style="user-select:all;display:block;margin-top:4px">${esc(zeile)}</code>
                </div>`)
            .openOn(map);
        if (navigator.clipboard) navigator.clipboard.writeText(zeile).catch(() => {});
    });

    if (ADMIN_MODE) {
        const info = document.getElementById('floor-info');
        if (info) info.textContent = '🛠 Admin-Modus: Klick auf die Karte zeigt Koordinaten';
    }

    // ------------------------------------------------------------
    // Mobile Menu
    // ------------------------------------------------------------
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.contains('show') ? closeMobileMenu() : openMobileMenu();
    }

    function openMobileMenu() {
        document.getElementById('mobile-menu').classList.add('show');
        document.querySelector('.hamburger-btn').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        document.getElementById('mobile-menu').classList.remove('show');
        document.querySelector('.hamburger-btn').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // ------------------------------------------------------------
    // Welcome Overlay
    // ------------------------------------------------------------
    function openWelcomeOverlay() {
        document.getElementById('welcome-overlay').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeWelcomeOverlay() {
        document.getElementById('welcome-overlay').classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    function showWelcomeOnFirstVisit() {
        try {
            if (!localStorage.getItem('raumplan-visited')) {
                setTimeout(openWelcomeOverlay, 500);
                localStorage.setItem('raumplan-visited', 'true');
            }
        } catch (e) { /* localStorage nicht verfügbar */ }
    }

    // Escape schließt offene Overlays
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeExhibitorOverlay();
            closeWelcomeOverlay();
        }
    });

    // Globale Funktionen für HTML
    window.openExhibitorOverlay = openExhibitorOverlay;
    window.closeExhibitorOverlay = closeExhibitorOverlay;
    window.filterExhibitors = filterExhibitors;
    window.toggleMobileMenu = toggleMobileMenu;
    window.closeMobileMenu = closeMobileMenu;
    window.openWelcomeOverlay = openWelcomeOverlay;
    window.closeWelcomeOverlay = closeWelcomeOverlay;

    // Start
    populateExhibitorList();
    loadFloor(2);
    showWelcomeOnFirstVisit();

    window.raumplanFunctions = {
        loadFloor,
        getCurrentFloor: () => currentFloor,
        getCurrentBuilding: () => currentBuilding,
        getFloorRooms: (floor) => floorRooms[floor] || [],
        showRoom: showPulsingPoint
    };
});
