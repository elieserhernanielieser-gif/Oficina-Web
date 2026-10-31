const projects = Array.from({ length: 15 }, (_, index) => {
  const number = index + 1;
  return {
    id: number,
    title: `Projecto ${String(number).padStart(2, "0")}`,
    description: "Exercício prático de desenvolvimento de páginas com HTML e CSS. Actualiza esta descrição com o objectivo real do exercício.",
    folder: `project-${String(number).padStart(2, "0")}`
  };
});

const projectUrl = (project) => `projecto.html?id=${project.id}`;

function projectCard(project) {
  const number = String(project.id).padStart(2, "0");
  return `<article class="project-card">
    <a href="${projectUrl(project)}" aria-label="Ver ${project.title}">
      <div class="project-thumb"><span>&lt;/&gt; ${number}</span></div>
      <div class="project-card-body">
        <span class="project-number">EXPERIÊNCIA ${number}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <span class="card-link">Ver projecto ↗</span>
      </div>
    </a>
  </article>`;
}

document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

const featured = document.querySelector("#featured-projects");
if (featured) {
  // Repetimos a lista visualmente para criar uma faixa contínua; em ecrãs pequenos fica com scroll manual.
  featured.innerHTML = projects.slice(0, 8).map(projectCard).join("");
}

const gallery = document.querySelector("#all-projects");
function renderGallery(query = "") {
  if (!gallery) return;
  const filtered = projects.filter(project =>
    `${project.title} ${project.description}`.toLowerCase().includes(query.toLowerCase())
  );
  gallery.innerHTML = filtered.length
    ? filtered.map(projectCard).join("")
    : `<p class="empty-state">Não foram encontrados projectos com esse nome.</p>`;
  const count = document.querySelector("#project-count");
  if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? "projecto" : "projectos"}`;
}
if (gallery) {
  renderGallery();
  document.querySelector("#project-search")?.addEventListener("input", event => renderGallery(event.target.value));
}

// Menu responsivo
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuButton?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "✕" : "☰";
});

// Página de detalhe: cada exercício deve estar na pasta projects/project-XX/
const detailTitle = document.querySelector("#detail-title");
if (detailTitle) {
  const params = new URLSearchParams(location.search);
  const id = Math.min(15, Math.max(1, Number(params.get("id")) || 1));
  const project = projects[id - 1];
  const folder = `projects/${project.folder}`;
  const htmlPath = `${folder}/index.html`;
  const cssPath = `${folder}/style.css`;

  document.title = `${project.title} — Oficina Web`;
  document.querySelector("#detail-number").textContent = `EXPERIÊNCIA ${String(id).padStart(3, "0")}`;
  detailTitle.textContent = project.title;
  document.querySelector("#detail-description").textContent = project.description;
  document.querySelector("#project-frame").src = htmlPath;
  document.querySelector("#open-project").href = htmlPath;

  let currentCode = "html";
  const codeContent = document.querySelector("#code-content");
  async function loadCode(type) {
    currentCode = type;
    const path = type === "html" ? htmlPath : cssPath;
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Ficheiro ainda não disponível.");
      codeContent.textContent = await response.text();
    } catch {
      codeContent.textContent = `Ainda não foi possível carregar ${type.toUpperCase()} deste exercício.\n\nColoca o ficheiro em:\n${path}\n\nNota: abre o projecto através do Live Server ou de outro servidor local.`;
    }
    document.querySelectorAll(".code-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.code === type));
  }
  document.querySelectorAll(".code-tab").forEach(tab => tab.addEventListener("click", () => loadCode(tab.dataset.code)));
  document.querySelector("#copy-code").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(codeContent.textContent);
      document.querySelector("#copy-code").textContent = "Copiado!";
      setTimeout(() => document.querySelector("#copy-code").textContent = "Copiar código", 1600);
    } catch {
      document.querySelector("#copy-code").textContent = "Não foi possível copiar";
    }
  });
  loadCode("html");
}
