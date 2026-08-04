# Team Portfolio Website

A static team portfolio website built for our group project — one page per team member showcasing their skills, plus four pages for our project presentation (PPT) showcase.

**Live site (once GitHub Pages is enabled):** `https://RonitKhanna333.github.io/se-proj/`

## Structure

```
index.html                    Home page — team + project overview
members/member1.html … 4.html One profile page per team member
projects/project1.html … 4.html  One page per project presentation
admin.html                    Form to edit member/project content
css/style.css                 Shared stylesheet
js/data.js                    Site content (names, skills, project links)
js/render.js                  Renders member/project pages from data.js
js/admin.js                   Powers the admin editing form
```

## Editing content

1. Open `admin.html` in a browser and fill in each member's name, role, bio, and skills, and each project's title/description/PPT link.
2. Click **Save** to preview your changes locally (stored in your browser only).
3. Click **Export data.js**, copy the generated code, and paste it into [`js/data.js`](js/data.js), replacing the existing `defaultTeamData` object.
4. Commit and push the updated `js/data.js` so the change is live for everyone.

## Adding the project PPTs

1. Add each `.pptx` file to this repo, e.g. `assets/pptx/project1.pptx`.
2. Copy its raw GitHub URL, e.g.
   `https://raw.githubusercontent.com/RonitKhanna333/se-proj/main/assets/pptx/project1.pptx`
3. Paste that URL into the matching project's "PPTX raw file URL" field in `admin.html`, save/export, and commit `js/data.js`.
4. The project page will embed the slides via the Microsoft Office Online Viewer.

## Deploying

### Vercel (recommended)

This is a plain static site (no build step), and `vercel.json` is already set up for it.

1. Go to [vercel.com/new](https://vercel.com/new) and import the `RonitKhanna333/se-proj` GitHub repo.
2. Framework Preset: **Other**. Leave Build Command and Output Directory empty — Vercel serves the repo root as-is.
3. Click **Deploy**. Every future push to `main` auto-deploys.

Or from the CLI, inside this folder:

```bash
npm i -g vercel
vercel
```

### GitHub Pages (alternative)

Enable **GitHub Pages** in the repo settings (Settings → Pages → Deploy from branch `main`, folder `/root`).

## Team

| Member | Role |
|---|---|
| Member One | _add role_ |
| Member Two | _add role_ |
| Member Three | _add role_ |
| Member Four | _add role_ |
