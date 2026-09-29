# Raumplan mit Berufsfindungsmesse

## Dateien
- `raumkoordinaten.js` – alle Räume mit Position (x, y) und Plan-Nummer (floor)
- `messe-aussteller.js` – Ausstellerliste der Messe (name, room, info)
- `tag-der-beruflichen-bildung.js` – gesicherte Daten, derzeit nicht eingebunden
- `script.js` – Logik, `index.html` / `style.css` – Oberfläche

## Aussteller für ein neues Jahr eintragen
In `messe-aussteller.js` die Liste ersetzen, z. B.
    { name: 'Firma XY', room: 'A.0.14', info: 'Kurzbeschreibung' },
Der Raum muss genau so in `raumkoordinaten.js` stehen. Das Stockwerk
wird automatisch ermittelt.

## Neuen Raum hinterlegen
1. `index.html?admin` öffnen, Stockwerk wählen.
   Alle bereits hinterlegten Räume erscheinen grau mit Beschriftung.
2. Auf die Raummitte klicken → die fertige Zeile erscheint (und liegt
   in der Zwischenablage), z. B. `'RAUM': { x: 400, y: 300, floor: 2 },`
3. Zeile in `raumkoordinaten.js` einfügen und `RAUM` durch die
   Raumbezeichnung ersetzen.

Plan-Nummern: 1=UG, 2=EG, 3=1. OG, 4=2. OG, 5=3. OG (Hauptgebäude), 6=EG, 7=1. OG (Werkstatt)
