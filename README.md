# GovAssist Project Website

The permanent UCS503 project website for GovAssist: a versioned public-rule decision-support system designed to return traceable decisions, verification status, and cited evidence.

**Production:** [se-proj-gamma.vercel.app](https://se-proj-gamma.vercel.app/)

## Website structure

```text
index.html                         GovAssist overview, system flow, team, and proposal archive
planning-presentation.html         Permanent Planning Presentation v1 page
members/member1.html ... 3.html    Member profiles and responsibilities
projects/project1.html ... 4.html  Selected proposal and feasibility archive
admin.html                         JSON publication console
data/team-data.json                Canonical content and planning record
js/data.js                         Fetches and validates the canonical JSON
js/render.js                       Renders all public, data-driven content
js/site.js                         Responsive navigation behavior
js/admin.js                        Admin editor and JSON export
PlanningPresentation.pptx          Planning v1 source deck
css/style.css                      Shared responsive design system
```

## Planning Presentation v1 coverage

The permanent planning page includes:

- scope, objectives, functions, intended users, and external interfaces;
- frontend, application, rules/verification, data, and file architecture;
- performance, security, reliability, and maintainability targets;
- technical risks and planned responses;
- twelve-week milestones, dependencies, and named owners;
- version, date, authors, change summary, source PPTX, and version history.

If the plan changes, publish v2 as a separate permanent page and retain v1.

## Content workflow

`data/team-data.json` is the single source of truth for the public site. To publish a metadata change:

1. Open `admin.html` through the deployed site or a local HTTP server.
2. Edit the fields and choose **Generate JSON export**.
3. Download `team-data.json`.
4. Replace `data/team-data.json` in the repository.
5. Commit and deploy the change.

## Local preview

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. Microsoft Office Viewer requires a public URL, so local pages show a presentation placeholder while retaining the direct PPTX download.

## Deployment

This is a framework-free static site. `vercel.json` serves the repository root without a build step. Production deployments follow the repository’s Vercel integration.

## Team

| Member | Ownership |
|---|---|
| Ronit | Rules and evaluation |
| Bhavneet | Backend and platform |
| Shreyas | Product and frontend |
