// Builds the admin form from the current team data, and handles
// Save (localStorage), Export (generate js/data.js source), and Reset.

let workingData = null;

function initAdminForm() {
  workingData = JSON.parse(JSON.stringify(getTeamData()));
  renderMembersFields();
  renderProjectsFields();

  document.getElementById("admin-form").addEventListener("submit", onSave);
  document.getElementById("export-btn").addEventListener("click", onExport);
  document.getElementById("reset-btn").addEventListener("click", onReset);
  document.getElementById("copy-btn").addEventListener("click", onCopy);
}

function renderMembersFields() {
  const container = document.getElementById("members-fields");
  container.innerHTML = "";

  workingData.members.forEach((member, mIndex) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginBottom = "1.5rem";

    card.innerHTML = `
      <h3>Member ${member.id}</h3>
      <label>Name</label>
      <input type="text" data-field="name" data-index="${mIndex}" value="${escapeAttr(member.name)}" class="admin-input">
      <label>Role / Title</label>
      <input type="text" data-field="role" data-index="${mIndex}" value="${escapeAttr(member.role)}" class="admin-input">
      <label>Bio</label>
      <textarea data-field="bio" data-index="${mIndex}" class="admin-input" rows="2">${escapeHtml(member.bio)}</textarea>
      <label>Skills</label>
      <div class="skills-editor" data-index="${mIndex}"></div>
      <button type="button" class="btn add-skill-btn" data-index="${mIndex}" style="margin-top:0.5rem; padding:0.4rem 1rem; font-size:0.85rem;">+ Add skill</button>
    `;

    container.appendChild(card);
    renderSkillsEditor(mIndex);
  });

  container.querySelectorAll("[data-field][data-index]").forEach((el) => {
    el.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.index);
      const field = e.target.dataset.field;
      workingData.members[idx][field] = e.target.value;
    });
  });

  container.querySelectorAll(".add-skill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      workingData.members[idx].skills.push({ name: "New Skill", level: 50 });
      renderSkillsEditor(idx);
    });
  });
}

function renderSkillsEditor(mIndex) {
  const wrap = document.querySelector(`.skills-editor[data-index="${mIndex}"]`);
  wrap.innerHTML = "";

  workingData.members[mIndex].skills.forEach((skill, sIndex) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "0.5rem";
    row.style.marginBottom = "0.5rem";
    row.style.alignItems = "center";

    row.innerHTML = `
      <input type="text" value="${escapeAttr(skill.name)}" class="admin-input skill-name" style="flex:2;">
      <input type="number" min="0" max="100" value="${skill.level}" class="admin-input skill-level" style="flex:1;">
      <button type="button" class="remove-skill-btn" style="background:none; border:1px solid var(--border); color:var(--text-dim); border-radius:6px; cursor:pointer; padding:0.4rem 0.7rem;">✕</button>
    `;

    row.querySelector(".skill-name").addEventListener("input", (e) => {
      workingData.members[mIndex].skills[sIndex].name = e.target.value;
    });
    row.querySelector(".skill-level").addEventListener("input", (e) => {
      workingData.members[mIndex].skills[sIndex].level = Number(e.target.value);
    });
    row.querySelector(".remove-skill-btn").addEventListener("click", () => {
      workingData.members[mIndex].skills.splice(sIndex, 1);
      renderSkillsEditor(mIndex);
    });

    wrap.appendChild(row);
  });
}

function renderProjectsFields() {
  const container = document.getElementById("projects-fields");
  container.innerHTML = "";

  workingData.projects.forEach((project, pIndex) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginBottom = "1.5rem";

    card.innerHTML = `
      <h3>Project Part ${project.id}</h3>
      <label>Title</label>
      <input type="text" data-field="title" data-index="${pIndex}" value="${escapeAttr(project.title)}" class="admin-input proj-input">
      <label>Description</label>
      <textarea data-field="description" data-index="${pIndex}" class="admin-input proj-input" rows="2">${escapeHtml(project.description)}</textarea>
      <label>PPTX raw file URL (e.g. from GitHub — see note above)</label>
      <input type="text" data-field="pptxUrl" data-index="${pIndex}" value="${escapeAttr(project.pptxUrl)}" class="admin-input proj-input" placeholder="https://raw.githubusercontent.com/user/repo/main/assets/pptx/project${project.id}.pptx">
    `;

    container.appendChild(card);
  });

  container.querySelectorAll("input.proj-input, textarea.proj-input").forEach((el) => {
    el.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.index);
      const field = e.target.dataset.field;
      workingData.projects[idx][field] = e.target.value;
    });
  });
}

function onSave(e) {
  e.preventDefault();
  saveTeamData(workingData);
  const status = document.getElementById("save-status");
  status.style.display = "block";
  setTimeout(() => (status.style.display = "none"), 3000);
}

function onReset() {
  if (!confirm("Reset all fields to the site defaults? This clears your saved edits in this browser.")) return;
  localStorage.removeItem(TEAM_DATA_STORAGE_KEY);
  workingData = JSON.parse(JSON.stringify(defaultTeamData));
  renderMembersFields();
  renderProjectsFields();
}

function onExport() {
  const source = `// Default content for the site. The admin page (admin.html) lets team
// members edit this data; edits are saved to localStorage for live preview
// in that browser, and can be exported here to make them permanent for
// everyone (see admin.html "Export data.js").

const defaultTeamData = ${JSON.stringify(workingData, null, 2)};

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
`;

  document.getElementById("export-textarea").value = source;
  document.getElementById("export-output").style.display = "block";
  document.getElementById("export-output").scrollIntoView({ behavior: "smooth" });
}

function onCopy() {
  const textarea = document.getElementById("export-textarea");
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    const btn = document.getElementById("copy-btn");
    const original = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = original), 2000);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str ?? "").replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", initAdminForm);
