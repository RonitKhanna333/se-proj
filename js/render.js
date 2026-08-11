// Shared rendering helpers. All content comes from data/team-data.json.

async function renderMember(id) {
  try {
    const data = await getTeamData();
    const member = data.members.find((item) => item.id === id);
    if (!member) throw new Error(`Member ${id} was not found.`);

    document.title = `${member.name} — Team Portfolio`;
    document.getElementById("avatar").textContent = memberInitials(member.name);
    document.getElementById("name").textContent = member.name;
    document.getElementById("role").textContent = member.role;
    document.getElementById("bio").textContent = member.bio;

    const strength = document.getElementById("strength");
    const learningGoal = document.getElementById("learning-goal");
    if (strength) strength.textContent = member.strength || "Not specified";
    if (learningGoal) learningGoal.textContent = member.learningGoal || "Not specified";

    const skillsEl = document.getElementById("skills");
    skillsEl.innerHTML = "";

    if (!member.skills?.length) {
      skillsEl.innerHTML = '<p class="muted">No skills added yet.</p>';
      return;
    }

    member.skills.forEach((skill) => {
      const level = Math.min(100, Math.max(0, Number(skill.level) || 0));
      const wrap = document.createElement("div");
      wrap.className = "skill";
      wrap.innerHTML = `
        <div class="skill-label"><span>${escapeHtml(skill.name)}</span><span>${level}%</span></div>
        <div class="skill-bar"><div class="skill-bar-fill" style="width:${level}%"></div></div>
      `;
      skillsEl.appendChild(wrap);
    });
  } catch (error) {
    showDataError(error);
  }
}

async function renderProject(id) {
  try {
    const data = await getTeamData();
    const project = data.projects.find((item) => item.id === id);
    if (!project) throw new Error(`Project ${id} was not found.`);

    document.title = `${project.title} — Team Portfolio`;
    document.getElementById("title").textContent = project.title;
    document.getElementById("description").textContent = project.description;
    renderPresentationEmbed(project);
  } catch (error) {
    showDataError(error);
  }
}

async function renderHomeTeam() {
  const grid = document.getElementById("home-team-grid");
  if (!grid) return;

  try {
    const data = await getTeamData();
    grid.innerHTML = "";

    data.members.forEach((member) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="avatar">${escapeHtml(memberInitials(member.name))}</div>
        <h3 class="centered">${escapeHtml(member.name)}</h3>
        <p class="centered">${escapeHtml(member.role)}</p>
        <p class="centered"><a href="members/member${member.id}.html">View profile →</a></p>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    showDataError(error, grid);
  }
}

async function renderHomeProjects() {
  const grid = document.getElementById("home-project-grid");
  if (!grid) return;

  try {
    const data = await getTeamData();
    grid.innerHTML = "";

    data.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <p><a href="projects/project${project.id}.html">View slides →</a></p>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    showDataError(error, grid);
  }
}

async function renderPlanningPresentation() {
  try {
    const data = await getTeamData();
    const presentation = data.planningPresentation;
    const selectedProject = data.projects.find(
      (project) => project.id === presentation.selectedProjectId
    );

    document.title = `${presentation.title} — Team Portfolio`;
    document.getElementById("planning-eyebrow").textContent = presentation.eyebrow;
    document.getElementById("planning-title").textContent = presentation.title;
    document.getElementById("planning-description").textContent = presentation.description;
    document.getElementById("selected-project").textContent = selectedProject
      ? `${selectedProject.title} — ${selectedProject.description}`
      : "No selected project is configured.";

    const constraints = document.getElementById("planning-constraints");
    constraints.innerHTML = presentation.constraints
      .map((constraint) => `<span class="tag">${escapeHtml(constraint)}</span>`)
      .join("");

    const team = document.getElementById("planning-team-grid");
    const memberIds = new Set(presentation.teamMemberIds);
    team.innerHTML = "";
    data.members
      .filter((member) => memberIds.has(member.id))
      .forEach((member) => {
        const card = document.createElement("article");
        card.className = "card planning-member";
        card.innerHTML = `
          <div class="avatar avatar-small">${escapeHtml(memberInitials(member.name))}</div>
          <div>
            <h3>${escapeHtml(member.name)}</h3>
            <p class="role-line">${escapeHtml(member.role)}</p>
            <p><strong>Strength:</strong> ${escapeHtml(member.strength)}</p>
            <p><strong>Learning goal:</strong> ${escapeHtml(member.learningGoal)}</p>
          </div>
        `;
        team.appendChild(card);
      });

    renderPresentationEmbed(presentation);
  } catch (error) {
    showDataError(error);
  }
}

function renderPresentationEmbed(presentation) {
  const wrapper = document.getElementById("embed-wrapper");
  const downloadEl = document.getElementById("download-link");
  if (!wrapper) return;

  if (!presentation.pptxUrl?.trim()) {
    wrapper.innerHTML = `
      <div class="embed-placeholder">
        <strong>No presentation linked yet</strong>
        <p>Add the PPTX path to <code>data/team-data.json</code> and commit both files.</p>
      </div>
    `;
    return;
  }

  const absoluteUrl = getSiteAssetUrl(presentation.pptxUrl.trim());
  const isLocalPreview =
    window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

  if (isLocalPreview) {
    wrapper.innerHTML = `
      <div class="embed-placeholder">
        <strong>Embedded preview available after deployment</strong>
        <p>Microsoft Office Viewer needs a publicly reachable URL. Use the download button here, or open the deployed site for the embedded deck.</p>
      </div>
    `;
  } else {
    const viewerUrl =
      "https://view.officeapps.live.com/op/embed.aspx?src=" +
      encodeURIComponent(absoluteUrl);
    wrapper.innerHTML = `<iframe src="${viewerUrl}" title="${escapeHtml(presentation.title)}" allowfullscreen></iframe>`;
  }

  if (downloadEl) {
    downloadEl.href = absoluteUrl;
    downloadEl.style.display = "inline-block";
  }
}

function memberInitials(name) {
  return (
    (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function showDataError(error, target = document.querySelector("main") || document.querySelector(".container")) {
  console.error(error);
  if (!target) return;
  const message = document.createElement("div");
  message.className = "card data-error";
  message.innerHTML = `
    <strong>Could not load the site data.</strong>
    <p>${escapeHtml(error.message)} If you opened the files directly, run a local web server instead.</p>
  `;
  target.prepend(message);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}
