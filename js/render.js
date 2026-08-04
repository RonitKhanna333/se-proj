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
    const viewerUrl =
      "https://view.officeapps.live.com/op/embed.aspx?src=" +
      encodeURIComponent(project.pptxUrl.trim());
    wrapper.innerHTML = `<iframe src="${viewerUrl}" title="${escapeHtml(project.title)}" allowfullscreen></iframe>`;

    const downloadEl = document.getElementById("download-link");
    if (downloadEl) {
      downloadEl.href = project.pptxUrl.trim();
      downloadEl.style.display = "inline-block";
    }
  } else {
    wrapper.innerHTML = `
      <div class="embed-placeholder">
        <strong>No presentation linked yet</strong>
        <p>
          1. Push your <code>.pptx</code> file into this repo (e.g. <code>assets/pptx/project${id}.pptx</code>).<br>
          2. Copy its raw GitHub URL, e.g.
          <code>https://raw.githubusercontent.com/&lt;user&gt;/&lt;repo&gt;/main/assets/pptx/project${id}.pptx</code>.<br>
          3. Paste that URL into this project's field on the <a href="../admin.html">admin page</a> and Save/Export.
        </p>
      </div>
    `;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
