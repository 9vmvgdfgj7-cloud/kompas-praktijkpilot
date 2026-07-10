# KOMPAS Core v2.0

Volledige GitHub-projectstructuur voor de KOMPAS-praktijkpilot.

## Structuur
- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/registry.js`
- `js/discussion-glass.js`
- `js/logbook.js`
- `js/storage.js`
- `js/stabu.js`
- `data/meta.json`
- `data/observations.json`
- `data/objects.json`
- `data/locations.json`
- `data/development.json`

## Functionaliteit
- Registratiekaarten voor veelvoorkomende waarnemingen.
- Titel begint met `Opleverpunt` of `Constatering`.
- Locaties zonder overbodig lidwoord in de beschrijving.
- Installatietypen: WTW-unit, warmtepomp en omvormer zonnepanelen.
- Onderdelen per installatietype.
- Discussiekaart voor beschadigde beglazing:
  - zijde;
  - zone R/E/M;
  - gemeten lengte;
  - vergelijking met grens per zone;
  - kijkafstand;
  - lichtomstandigheden;
  - advies en onderbouwing.
- Knop `Aan KOMPAS toevoegen`.
- Lokaal bewaard logboek.
- Ontwikkellijst voor relevante opleverbare afbouwonderdelen.

## GitHub Desktop
1. Pak de ZIP uit.
2. Open in GitHub Desktop `Show in Finder`.
3. Verwijder daar de oude projectbestanden, maar laat de verborgen `.git`-map staan.
4. Kopieer alle bestanden en mappen uit `kompas-core-v2` naar die geopende repositorymap.
5. Ga terug naar GitHub Desktop.
6. Commit en Push.
