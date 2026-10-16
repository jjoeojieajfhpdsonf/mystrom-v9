# myStrom v9

Moderne Oberfläche für die myStrom WiFi Switches, nach dem Prototyp „Tesla × myStrom“ (Version 9). Alle Funktionen, die myStrom in PLUS, PRO, DATA PRO und HOME GUARD verkauft, sind frei.

Dieses Projekt ist **nur die Oberfläche**. Messen, Schalten, Regeln, Verlauf und Push-Mitteilungen erledigt die [mystrom-app](https://github.com/jjoeojieajfhpdsonf/myStrom); der kleine Server hier liefert die Seiten aus und reicht alle Aufrufe unter `/api/` an sie weiter. So laufen die Regeln nur einmal, egal welche Oberfläche du benutzt.

## Aufbau

Bedienung wie die [mystrom-app](https://github.com/jjoeojieajfhpdsonf/myStrom) und die echte myStrom-App, im Aussehen von Version 9:

- **Startseite:** alle Steckdosen und Übersichten als Kacheln (Verbrauch, Szenen, Home Guard, Regeln, Alarme). Eine Steckdose nach links oder rechts **wischen schaltet** sie, wie Blättern zur nächsten Seite AN (grün) oder AUS (rot); **antippen öffnet** sie. Oben ＋ zum Hinzufügen.
- **Gerät:** Kachelraster mit der Schalter-Kachel (antippen oder wischen schaltet) und allen Funktionen; Einstellungen hinter dem Zahnrad, dort auch Raum und Symbol wählen.
- **Verbrauch:** grosse Zahl, Gerät über ein Overlay mit Kacheln wählen, Tag zurück und vor, Diagramm, Verbrauch und Kosten, CSV-Export.
- **Szenen:** lange auf eine Szene drücken öffnet Ausführen, Bearbeiten und Löschen.

Die Oberfläche folgt dem Stand der mystrom-app; neue Funktionen von dort lassen sich übernehmen, das Aussehen steckt in `public/style.css`.

## Starten

Die mystrom-app muss laufen (Standard: Port 8091 auf demselben Rechner).

```bash
docker compose up -d --build
```

Danach läuft die Oberfläche auf Port 8092. Ändern lässt sich das in `.env`:

```
MYSTROM_V9_PORT=8092
MYSTROM_API_URL=http://127.0.0.1:8091
```

Ohne Docker:

```bash
PORT=8092 API_URL=http://127.0.0.1:8091 node server.js
```

## Auf dem Ubuntu-Server

```bash
git clone <repo> ~/mystrom-v9 && cd ~/mystrom-v9
docker compose up -d --build
sudo tailscale serve --bg --https=8444 http://127.0.0.1:8092
```

Die App ist dann unter `https://homeserver.tailec3147.ts.net:8444` erreichbar. Auf dem iPhone in Safari öffnen und „Zum Home-Bildschirm“ wählen; erst danach sind Push-Mitteilungen möglich (unter Alarme erlauben).
