const username = 'Fiercejojo88862';
const container = document.querySelector('#projects');
let currentFilter = 'all';
function filterProjects(filter) {
  currentFilter = filter;
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  container.querySelectorAll('.project').forEach(project => {
    project.hidden = filter !== 'all' && project.dataset.category !== filter;
  });
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-handle').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(username); status.textContent = 'Handle copied!'; }
  catch { status.textContent = username; }
});
function repositoryCard(repo) {
  const article = document.createElement('article');
  article.className = 'project'; article.dataset.category = 'code';
  const art = document.createElement('a');
  art.className = 'project-art repo-art';
  art.href = `https://github.com/${username}/${encodeURIComponent(repo.name)}`;
  art.target = '_blank'; art.rel = 'noopener noreferrer';
  const label = document.createElement('span'); label.className = 'art-label'; label.textContent = 'FROM GITHUB / OPEN SOURCE';
  const title = document.createElement('strong'); title.textContent = repo.name.replace(/[-_]/g, ' ');
  const language = document.createElement('span'); language.className = 'repo-language'; language.textContent = `${repo.language || 'Repository'} · View source ↗`;
  art.append(label, title, language);
  const meta = document.createElement('div'); meta.className = 'project-meta';
  const heading = document.createElement('h3'); heading.textContent = repo.name;
  const type = document.createElement('span'); type.textContent = 'GitHub ↗'; meta.append(heading, type);
  const description = document.createElement('p'); description.textContent = repo.description || 'Explore the project and its source on GitHub.';
  article.append(art, meta, description); return article;
}
async function loadRepositories() {
  const status = document.querySelector('#project-status');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {signal: controller.signal});
    if (!response.ok) throw new Error('GitHub unavailable');
    const repos = await response.json();
    if (!Array.isArray(repos)) throw new Error('Unexpected response');
    const selected = repos.filter(repo => !repo.fork && !repo.archived).slice(0, 4);
    if (selected.length) {
      container.querySelector('[data-category="code"]').remove();
      selected.forEach(repo => container.append(repositoryCard(repo)));
      document.querySelector('[data-filter="all"] span').textContent = String(container.children.length).padStart(2, '0');
      filterProjects(currentFilter);
      status.textContent = 'Public GitHub projects + visual concepts';
    } else { status.textContent = 'Visual concepts · Explore GitHub for more'; }
  } catch { status.textContent = 'Visual concepts · GitHub link available below'; }
  finally { clearTimeout(timeout); }
}
loadRepositories();
