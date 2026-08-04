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
    { id: 1, title: "GovAssist", description: "Add a short description from the admin page.", pptxUrl: "/GovAssist.pptx" },
    { id: 2, title: "Lost And Found Portal", description: "Add a short description from the admin page.", pptxUrl: "/LostAndFoundPortal.pptx" },
    { id: 3, title: "Placement Readiness Platform", description: "Add a short description from the admin page.", pptxUrl: "/PlacementReadinessPlatform.pptx" },
    { id: 4, title: "Semester Workload Balancer", description: "Add a short description from the admin page.", pptxUrl: "/SemesterWorkloadBalancer.pptx" }
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
