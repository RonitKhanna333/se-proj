// Default content for the site. The admin page (admin.html) lets team
// members edit this data; edits are saved to localStorage for live preview
// in that browser, and can be exported here to make them permanent for
// everyone (see admin.html "Export data.js").

const defaultTeamData = {
  members: [
    {
      id: 1,
      name: "Member One",
      role: "Role / Title",
      bio: "Add a short bio here from the admin page.",
      skills: [
        { name: "Skill A", level: 70 },
        { name: "Skill B", level: 60 }
      ]
    },
    {
      id: 2,
      name: "Member Two",
      role: "Role / Title",
      bio: "Add a short bio here from the admin page.",
      skills: [
        { name: "Skill A", level: 70 },
        { name: "Skill B", level: 60 }
      ]
    },
    {
      id: 3,
      name: "Member Three",
      role: "Role / Title",
      bio: "Add a short bio here from the admin page.",
      skills: [
        { name: "Skill A", level: 70 },
        { name: "Skill B", level: 60 }
      ]
    },
    {
      id: 4,
      name: "Member Four",
      role: "Role / Title",
      bio: "Add a short bio here from the admin page.",
      skills: [
        { name: "Skill A", level: 70 },
        { name: "Skill B", level: 60 }
      ]
    }
  ],
  projects: [
    { id: 1, title: "Project Part 1", description: "Overview / problem statement presentation.", pptxUrl: "" },
    { id: 2, title: "Project Part 2", description: "Design & methodology presentation.", pptxUrl: "" },
    { id: 3, title: "Project Part 3", description: "Implementation presentation.", pptxUrl: "" },
    { id: 4, title: "Project Part 4", description: "Results & conclusion presentation.", pptxUrl: "" }
  ]
};

const TEAM_DATA_STORAGE_KEY = "teamData";

function getTeamData() {
  try {
    const raw = localStorage.getItem(TEAM_DATA_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read saved team data, using defaults.", e);
  }
  return defaultTeamData;
}

function saveTeamData(data) {
  localStorage.setItem(TEAM_DATA_STORAGE_KEY, JSON.stringify(data));
}

function hasSavedTeamData() {
  return localStorage.getItem(TEAM_DATA_STORAGE_KEY) !== null;
}
