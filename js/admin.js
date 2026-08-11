// Builds the admin form from data/team-data.json and exports the edited JSON.
// Public pages never read localStorage; committing the exported JSON is the
// only way to publish content changes.

let workingData = null;

async function initAdminForm() {
  try {
    workingData = JSON.parse(JSON.stringify(await getTeamData({ fresh: true })));
    renderMembersFields();
    renderProjectsFields();
    renderPlanningFields();

    document.getElementById("admin-form").addEventListener("submit", onExport);
    document.getElementById("reload-btn").addEventListener("click", onReload);
    document.getElementById("copy-btn").addEventListener("click", onCopy);
    document.getElementById("download-json-btn").addEventListener("click", onDownload);
  } catch (error) {
    showAdminError(error);
  }
}

function renderMembersFields() {
  const container = document.getElementById("members-fields");
  container.innerHTML = "";

  workingData.members.forEach((member, memberIndex) => {
    const card = document.createElement("section");
    card.className = "card admin-card";
    card.innerHTML = `
      <h3>Member ${member.id}</h3>
      <label>Name</label>
      <input type="text" data-member-field="name" data-index="${memberIndex}" value="${escapeAttr(member.name)}" class="admin-input">
      <label>Role / title</label>
      <input type="text" data-member-field="role" data-index="${memberIndex}" value="${escapeAttr(member.role)}" class="admin-input">
      <label>Bio</label>
      <textarea data-member-field="bio" data-index="${memberIndex}" class="admin-input" rows="3">${escapeHtml(member.bio)}</textarea>
      <label>Strength</label>
      <input type="text" data-member-field="strength" data-index="${memberIndex}" value="${escapeAttr(member.strength)}" class="admin-input">
      <label>Learning goal</label>
      <input type="text" data-member-field="learningGoal" data-index="${memberIndex}" value="${escapeAttr(member.learningGoal)}" class="admin-input">
      <label>Skills</label>
      <div class="skills-editor" data-index="${memberIndex}"></div>
      <button type="button" class="btn btn-secondary add-skill-btn" data-index="${memberIndex}">+ Add skill</button>
    `;
    container.appendChild(card);
    renderSkillsEditor(memberIndex);
  });

  container.querySelectorAll("[data-member-field]").forEach((element) => {
    element.addEventListener("input", (event) => {
      const index = Number(event.target.dataset.index);
      workingData.members[index][event.target.dataset.memberField] = event.target.value;
    });
  });

  container.querySelectorAll(".add-skill-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      workingData.members[index].skills.push({ name: "New skill", level: 50 });
      renderSkillsEditor(index);
    });
  });
}

function renderSkillsEditor(memberIndex) {
  const wrap = document.querySelector(`.skills-editor[data-index="${memberIndex}"]`);
  wrap.innerHTML = "";

  workingData.members[memberIndex].skills.forEach((skill, skillIndex) => {
    const row = document.createElement("div");
    row.className = "skill-editor-row";
    row.innerHTML = `
      <input type="text" value="${escapeAttr(skill.name)}" class="admin-input skill-name">
      <input type="number" min="0" max="100" value="${skill.level}" class="admin-input skill-level">
      <button type="button" class="remove-skill-btn" aria-label="Remove skill">×</button>
    `;

    row.querySelector(".skill-name").addEventListener("input", (event) => {
      workingData.members[memberIndex].skills[skillIndex].name = event.target.value;
    });
    row.querySelector(".skill-level").addEventListener("input", (event) => {
      workingData.members[memberIndex].skills[skillIndex].level = Number(event.target.value);
    });
    row.querySelector(".remove-skill-btn").addEventListener("click", () => {
      workingData.members[memberIndex].skills.splice(skillIndex, 1);
      renderSkillsEditor(memberIndex);
    });
    wrap.appendChild(row);
  });
}

function renderProjectsFields() {
  const container = document.getElementById("projects-fields");
  container.innerHTML = "";

  workingData.projects.forEach((project, projectIndex) => {
    const card = document.createElement("section");
    card.className = "card admin-card";
    card.innerHTML = `
      <h3>Project ${project.id}</h3>
      <label>Title</label>
      <input type="text" data-project-field="title" data-index="${projectIndex}" value="${escapeAttr(project.title)}" class="admin-input">
      <label>Description</label>
      <textarea data-project-field="description" data-index="${projectIndex}" class="admin-input" rows="3">${escapeHtml(project.description)}</textarea>
      <label>PPTX path or full HTTPS URL</label>
      <input type="text" data-project-field="pptxUrl" data-index="${projectIndex}" value="${escapeAttr(project.pptxUrl)}" class="admin-input">
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("[data-project-field]").forEach((element) => {
    element.addEventListener("input", (event) => {
      const index = Number(event.target.dataset.index);
      workingData.projects[index][event.target.dataset.projectField] = event.target.value;
    });
  });
}

function renderPlanningFields() {
  const presentation = workingData.planningPresentation;
  document.getElementById("planning-fields").innerHTML = `
    <section class="card admin-card">
      <label>Page title</label>
      <input type="text" data-planning-field="title" value="${escapeAttr(presentation.title)}" class="admin-input">
      <label>Eyebrow</label>
      <input type="text" data-planning-field="eyebrow" value="${escapeAttr(presentation.eyebrow)}" class="admin-input">
      <label>Description</label>
      <textarea data-planning-field="description" class="admin-input" rows="3">${escapeHtml(presentation.description)}</textarea>
      <label>PPTX path or full HTTPS URL</label>
      <input type="text" data-planning-field="pptxUrl" value="${escapeAttr(presentation.pptxUrl)}" class="admin-input">
      <label>Selected project ID</label>
      <input type="number" min="1" data-planning-field="selectedProjectId" value="${presentation.selectedProjectId}" class="admin-input">
      <label>Constraints (one per line)</label>
      <textarea id="planning-constraints-input" class="admin-input" rows="4">${escapeHtml(presentation.constraints.join("\n"))}</textarea>
    </section>
  `;

  document.querySelectorAll("[data-planning-field]").forEach((element) => {
    element.addEventListener("input", (event) => {
      const field = event.target.dataset.planningField;
      workingData.planningPresentation[field] =
        field === "selectedProjectId" ? Number(event.target.value) : event.target.value;
    });
  });

  document.getElementById("planning-constraints-input").addEventListener("input", (event) => {
    workingData.planningPresentation.constraints = event.target.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  });
}

function onExport(event) {
  event.preventDefault();
  const source = `${JSON.stringify(workingData, null, 2)}\n`;
  document.getElementById("export-textarea").value = source;
  document.getElementById("export-output").style.display = "block";
  document.getElementById("export-output").scrollIntoView({ behavior: "smooth" });
}

async function onReload() {
  try {
    workingData = JSON.parse(JSON.stringify(await getTeamData({ fresh: true })));
    renderMembersFields();
    renderProjectsFields();
    renderPlanningFields();
    document.getElementById("export-output").style.display = "none";
  } catch (error) {
    showAdminError(error);
  }
}

function onCopy() {
  const textarea = document.getElementById("export-textarea");
  navigator.clipboard.writeText(textarea.value).then(() => {
    const button = document.getElementById("copy-btn");
    button.textContent = "Copied!";
    setTimeout(() => (button.textContent = "Copy JSON"), 2000);
  });
}

function onDownload() {
  const source = document.getElementById("export-textarea").value;
  const url = URL.createObjectURL(new Blob([source], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "team-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

function showAdminError(error) {
  console.error(error);
  document.getElementById("admin-form").innerHTML = `
    <div class="card data-error">
      <strong>Could not load data/team-data.json.</strong>
      <p>${escapeHtml(error.message)} Serve the repository over HTTP instead of opening admin.html directly.</p>
    </div>
  `;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", initAdminForm);
