# Team Portfolio Website

A static portfolio for the three-person software-engineering team. It includes member profiles, four proposal decks, and a dedicated Planning Presentation page that records how the team compared the proposals and selected GovAssist.

**Live site (after GitHub Pages is enabled):** `https://RonitKhanna333.github.io/se-proj/`

## Structure

```text
index.html                         Home page
planning-presentation.html         Planning deck, selected direction, and team
members/member1.html ... 3.html    Member profiles
projects/project1.html ... 4.html  Individual proposal presentations
admin.html                         JSON export editor
data/team-data.json                Canonical site content
js/data.js                         Fetches and validates the JSON
js/render.js                       Renders public pages
js/admin.js                        Edits and exports the JSON
PlanningPresentation.pptx          Planning presentation source deck
css/style.css                      Shared stylesheet
```

## Content workflow

`data/team-data.json` is the single source of truth. Member details, project descriptions, presentation paths, planning-page copy, constraints, and the selected proposal are fetched from this committed file. Public pages do not read `localStorage` and do not contain a second copy of the data in JavaScript.

To publish a content change:

1. Serve the repository over HTTP and open `admin.html`.
2. Edit the fields and click **Generate JSON export**.
3. Download `team-data.json`.
4. Replace `data/team-data.json` with the download.
5. Commit and push the JSON file.

You can also edit `data/team-data.json` directly.

## Run locally

The browser blocks JSON fetching when HTML files are opened directly with `file://`. Start any static web server from the repository root, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Presentations

PPTX paths in `data/team-data.json` are resolved from the repository root, so they work both on Vercel and under the `/se-proj/` GitHub Pages path. Deployed pages use Microsoft Office Online Viewer and also provide a direct PPTX download.

## Deploying

### Vercel

This is a plain static site with no build command. Import the repository in Vercel with the framework preset set to **Other**. `vercel.json` already serves the repository root.

### GitHub Pages

In repository settings, enable Pages from the `main` branch and `/root` folder.

## Team

| Member | Responsibility |
|---|---|
| Ronit | Algorithms and evaluation |
| Bhavneet | Backend and cloud |
| Shreyas | Frontend and integration |
