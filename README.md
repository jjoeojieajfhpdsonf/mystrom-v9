# myStrom v9

Moderne Oberfläche für die myStrom WiFi Switches, nach dem Prototyp „Tesla × myStrom“ (Version 9). Alle Funktionen, die myStrom in PLUS, PRO, DATA PRO und HOME GUARD verkauft, sind frei.

Dieses Projekt ist **nur die Oberfläche**. Messen, Schalten, Regeln, Verlauf und Push-Mitteilungen erledigt die [mystrom-app](https://github.com/jjoeojieajfhpdsonf/myStrom); der kleine Server hier liefert die Seiten aus und reicht alle Aufrufe unter `/api/` an sie weiter. So laufen die Regeln nur einmal, egal welche Oberfläche du benutzt.

## Aufbau

- **Zuhause:** alle Steckdosen als Kacheln (Kachel öffnet, Power-Taste schaltet), Szenen, Tagesverbrauch mit Kurve, darunter Home Guard, Regeln, Alarme und Mehr. Oben ＋ zum Hinzufügen und das Zahnrad.
- **Gerät im Fokus:** die Steckdose antippen schaltet, die LED wird grün (an) oder rot (aus). Darunter die Leistung, vier Schnelltasten (Nachts aus, Timer, Sparen, Ferien), die Tageskurve mit Höchstwert, Durchschnitt und Kosten, und alle Automationen als Kacheln an festen Plätzen.
- **Unterseiten:** Einstellungen jeder Funktion, Verbrauch mit Diagramm und CSV-Export, Szenen, Home Guard, Regeln, Alarme, Mehr.

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
