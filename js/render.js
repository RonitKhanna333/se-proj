// Shared rendering helpers used by members/memberN.html and projects/projectN.html

function renderMember(id) {
  const data = getTeamData();
  const member = data.members.find((m) => m.id === id);
  if (!member) return;

  document.title = `${member.name} — Team Portfolio`;

  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  document.getElementById("avatar").textContent = initials || "?";
  document.getElementById("name").textContent = member.name;
  document.getElementById("role").textContent = member.role;
  document.getElementById("bio").textContent = member.bio;

  const skillsEl = document.getElementById("skills");
  skillsEl.innerHTML = "";

  if (!member.skills || member.skills.length === 0) {
    skillsEl.innerHTML = '<p style="color:var(--text-dim);">No skills added yet.</p>';
  } else {
    member.skills.forEach((skill) => {
      const wrap = document.createElement("div");
      wrap.className = "skill";
      wrap.innerHTML = `
        <div class="skill-label"><span>${escapeHtml(skill.name)}</span><span>${skill.level}%</span></div>
        <div class="skill-bar"><div class="skill-bar-fill" style="width:${skill.level}%"></div></div>
      `;
      skillsEl.appendChild(wrap);
    });
  }

  if (!hasSavedTeamData()) {
    const hint = document.getElementById("hint");
    if (hint) {
      hint.style.display = "block";
    }
  }
}

function renderProject(id) {
  const data = getTeamData();
  const project = data.projects.find((p) => p.id === id);
  if (!project) return;

  document.title = `${project.title} — Team Portfolio`;
  document.getElementById("title").textContent = project.title;
  document.getElementById("description").textContent = project.description;

  const wrapper = document.getElementById("embed-wrapper");

  if (project.pptxUrl && project.pptxUrl.trim() !== "") {
    const absoluteUrl = new URL(project.pptxUrl.trim(), window.location.href).href;
    const isLocalFile = absoluteUrl.startsWith("file:");

    if (isLocalFile) {
      // Office's viewer can't reach a file:// URL on your own machine — it
      // only works once the site is deployed (e.g. on Vercel) so the pptx
      // has a real public URL. Offer a direct download instead for now.
      wrapper.innerHTML = `
        <div class="embed-placeholder">
          <strong>Preview available after deployment</strong>
          <p>The Office viewer needs a public URL, which only exists once this site is deployed (e.g. on Vercel). Locally, use the download link below.</p>
        </div>
      `;
    } else {
      const viewerUrl =
        "https://view.officeapps.live.com/op/embed.aspx?src=" +
        encodeURIComponent(absoluteUrl);
      wrapper.innerHTML = `<iframe src="${viewerUrl}" title="${escapeHtml(project.title)}" allowfullscreen></iframe>`;
    }

    const downloadEl = document.getElementById("download-link");
    if (downloadEl) {
      downloadEl.href = absoluteUrl;
      downloadEl.style.display = "inline-block";
    }
  } else {
    wrapper.innerHTML = `
      <div class="embed-placeholder">
        <strong>No presentation linked yet</strong>
        <p>
          1. Commit your <code>.pptx</code> file into this repo (e.g. <code>/MyProject.pptx</code> at the root).<br>
          2. On the <a href="../admin.html">admin page</a>, paste that path (e.g. <code>/MyProject.pptx</code>) into this project's PPTX field, Save, then Export and commit the updated <code>data.js</code>.<br>
          3. The embed above will work once the site is live on Vercel (Office's viewer needs a public URL, not a local file).
        </p>
      </div>
    `;
  }
}

function memberInitials(name) {
  return (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

// Populates the "Meet the Team" card grid on index.html from data.js
function renderHomeTeam() {
  const grid = document.getElementById("home-team-grid");
  if (!grid) return;

  const data = getTeamData();
  grid.innerHTML = "";

  data.members.forEach((member) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="avatar">${escapeHtml(memberInitials(member.name))}</div>
      <h3 style="text-align:center;">${escapeHtml(member.name)}</h3>
      <p style="text-align:center;">${escapeHtml(member.role)}</p>
      <p style="text-align:center;"><a href="members/member${member.id}.html">View Profile →</a></p>
    `;
    grid.appendChild(card);
  });
}

// Populates the "Project Showcase" card grid on index.html from data.js
function renderHomeProjects() {
  const grid = document.getElementById("home-project-grid");
  if (!grid) return;

  const data = getTeamData();
  grid.innerHTML = "";

  data.projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <p><a href="projects/project${project.id}.html">View Slides →</a></p>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
