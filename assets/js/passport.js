import "./script.js";

const app = document.querySelector('#passport-app');
const source = document.querySelector('#main-content');
const book = document.querySelector('#passport-book');
const scene = document.querySelector('#book-scene');
const frontCover = document.querySelector('#front-cover');
const surfaces = document.querySelector('#book-pages');
const leaf = document.querySelector('#turning-leaf');
const previous = document.querySelector('#previous-page');
const next = document.querySelector('#next-page');
const status = document.querySelector('#page-status');
const tabs = document.querySelector('#chapter-tabs');
const dots = document.querySelector('#page-dots');
const hint = document.querySelector('.book-hint');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = matchMedia('(max-width: 760px), (max-width: 960px) and (max-height: 500px)');
const chapters = ['Profile', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'];
const pages = [];
let spread = 0;
let coverOpen = true;
let turning = false;
let turningTimer;
let turnToken = 0;

function content(selector) {
  const original = source.querySelector(selector);
  const clone = original.cloneNode(true);
  clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  clone.removeAttribute('id');
  clone.classList.remove('reveal');
  return clone.outerHTML;
}

function addPage(chapter, label, markup, className = '') {
  pages.push({ chapter, label, markup, className });
}

addPage('Profile', 'Personal details', `
  <div class="document-heading"><span>PORTFOLIO</span><span>PERSONAL DETAILS</span></div>
  <div class="identity-heading"><span class="document-symbol" aria-hidden="true">◎</span><div><p>Engineering passport</p><h1>Musabuddin<br>Mondal</h1></div></div>
  <div class="passport-id-grid"><figure class="passport-photo"><img src="/musab-portrait.jpg" alt="Portrait of Musabuddin Mondal" width="387" height="387"><figcaption>HOLDER PHOTO</figcaption></figure>
  <dl class="passport-details"><div><dt>Surname</dt><dd>MONDAL</dd></div><div><dt>Given names</dt><dd>MUSABUDDIN</dd></div><div><dt>Field of study</dt><dd>Software Engineering</dd></div><div><dt>University</dt><dd>McMaster University</dd></div><div><dt>Expected graduation</dt><dd>2027</dd></div></dl></div>
  <dl class="identity-contact"><div><dt>Email</dt><dd><a href="mailto:musab.mondal321@gmail.com">musab.mondal321@gmail.com</a></dd></div><div><dt>Phone</dt><dd><a href="tel:+15197312857">+1 (519) 731-2857</a></dd></div></dl>
  <div class="passport-signature" aria-label="Musabuddin Mondal">Musabuddin Mondal<span>HOLDER’S SIGNATURE</span></div>
  <div class="mrz" aria-hidden="true">P&lt;PORTFOLIO&lt;MONDAL&lt;&lt;MUSABUDDIN&lt;&lt;<br>SOFTWARE&lt;ENGINEERING&lt;&lt;2027&lt;&lt;&lt;&lt;&lt;</div>
`, 'identity-sheet');

addPage('Profile', 'The journey so far', `
  <p class="folio-eyebrow">A NOTE FROM THE HOLDER</p><h2 class="folio-title">Curiosity is<br>the starting point.</h2>
  <p class="folio-lead">I build reliable systems where software meets the real world.</p>
  <p>My work spans embedded Wi-Fi services at Ford, hardware test automation, full-stack platforms, and machine learning built from first principles.</p>
  <div class="passport-metrics"><div><strong>3.9<span>/4.0</span></strong><small>McMaster GPA</small></div><div><strong>3</strong><small>Industry placements</small></div></div>
  <div class="arrival-stamp"><span>SOFTWARE ENGINEERING</span><strong>CLASS OF 2027</strong><span>McMASTER UNIVERSITY</span></div>
  <div class="contents-note"><span>INSIDE THIS PASSPORT</span><p>Experience · Projects · Skills · Education</p></div>
`, 'welcome-sheet');

source.querySelectorAll('.experience-entry').forEach((entry, index) => {
  addPage('Experience', ['Ford · Wireless connectivity', 'Ford · Test automation', 'Skyjack · Engineering'][index], `
    <div class="document-heading"><span>PROFESSIONAL EXPERIENCE</span><span>ENTRY 0${index + 1}</span></div>
    <div class="work-top"><div class="work-date">${entry.querySelector('.entry-meta p').innerHTML}</div>${entry.querySelector('.entry-stamp').outerHTML}</div>
    <div class="folio-work">${entry.querySelector('.entry-content').innerHTML}</div>
  `, 'work-sheet');
});
addPage('Experience', 'Impact in numbers', `
  <p class="folio-eyebrow">MEASURABLE IMPACT</p><h2 class="folio-title">Small details.<br>Real differences.</h2>
  <div class="impact-records"><article><strong>33%</strong><div><h3>Faster driver loading</h3><p>Wi-Fi initialization reduced from 15 to 10 seconds at Ford.</p></div></article><article><strong>98%</strong><div><h3>Unit-test line coverage</h3><p>Dependency injection and isolated mocks across 30+ modules.</p></div></article><article><strong>4h</strong><div><h3>Saved every day</h3><p>Automated manual reporting at Skyjack with VBA and Power BI.</p></div></article><article><strong>$1M</strong><div><h3>Defective parts analyzed</h3><p>ERP data transformed into insights for global teams.</p></div></article></div>
`, 'impact-sheet');

const projectGroups = [
  { id: 'ml', label: 'Machine Learning', description: 'Models, computer vision, natural language, and generative AI.' },
  { id: 'backend', label: 'Backend', description: 'APIs, transactions, and server-side architecture.' },
  { id: 'fullstack', label: 'Full Stack', description: 'Web platforms connecting interfaces, services, and data.' },
  { id: 'mobile', label: 'Mobile Apps', description: 'Android and iOS apps, from realtime chat to everyday tools.' },
  { id: 'systems', label: 'Extensions & Automation', description: 'Browser extensions and API-driven automation.' },
];
const projectSelect = document.querySelector('#project-category-select');
const projectDirectory = pages.length;
const projectEntries = [...source.querySelectorAll('[data-project]')];
projectGroups.forEach(group => {
  group.entries = projectEntries.filter(project => project.dataset.projectGroup === group.id);
});
function addProjectPage(group, label, markup, className) {
  addPage('Projects', label, markup, className);
  pages.at(-1).projectGroup = group;
}
addProjectPage('directory', 'Project directory', `
  <p class="folio-eyebrow">PROJECT DIRECTORY · ${projectEntries.length} PROJECTS</p>
  <h2 class="folio-title">Choose your<br>area of interest.</h2>
  <div class="project-directory">${projectGroups.map(group => `<button type="button" data-project-jump="${group.id}"><span>${group.label}</span><small>${group.entries.length} projects</small><span class="directory-arrow" aria-hidden="true">→</span></button>`).join('')}</div>
`, 'directory-sheet');
addProjectPage('directory', 'Explore the projects', `
  <p class="folio-eyebrow">BUILT THROUGH CURIOSITY</p><h2 class="folio-title">From models<br>to mobile apps.</h2>
  <p>Explore ${projectEntries.length} projects grouped by their main area of work. Each entry includes the technologies used, a brief description, and a repository link where available.</p>
  <p>Use the “Explore projects” menu above the book to jump to any area, or turn the pages to browse each collection.</p>
  <a class="folio-button" href="https://github.com/MusabMondal?tab=repositories" target="_blank" rel="noreferrer">Explore GitHub</a>
`, 'welcome-sheet');

projectGroups.forEach((group, groupIndex) => {
  // Start each collection on a left page, so category jumps show a complete spread.
  group.pageIndex = pages.length;
  const cards = [];
  group.entries.forEach(project => {
    const title = project.querySelector('h3, h4').textContent;
    if (project.matches('.project-feature') || title === 'MovieWhiz') {
      const featured = project.matches('.project-feature');
      const code = featured ? project.querySelector('.visa-mark').textContent : 'MovieWhiz';
      const subtitle = project.querySelector(featured ? '.project-topline span' : '.card-type').textContent;
      const details = featured ? project.querySelector('.project-copy').innerHTML : `<h3>${title}</h3><p>${project.querySelector('p:not(.card-type)').textContent}</p><p>Express REST APIs and Firebase authentication support identification requests, user accounts, and search history in Firestore.</p>${project.querySelector('.tag-list').outerHTML}<p class="project-note">React Native · TypeScript · Node.js · Expo</p>`;
      addProjectPage(group.id, title, `<div class="document-heading"><span>${group.label.toUpperCase()}</span><span>PROJECT VISA</span></div><div class="visa-banner visa-${groupIndex % 4}"><span>${code}</span><small>${subtitle}</small></div><div class="folio-project">${details}</div>`, 'project-sheet');
    } else cards.push(project);
  });
  for (let i = 0; i < cards.length; i += 2) {
    const pair = cards.slice(i, i + 2);
    addProjectPage(group.id, `${group.label} · ${pair.map(card => card.querySelector('h4').textContent).join(' & ')}`, `<div class="document-heading"><span>${group.label.toUpperCase()}</span><span>PROJECT REGISTRY</span></div><div class="folio-project-list">${pair.map(card => `<article><p class="folio-eyebrow">${card.querySelector('.card-type').textContent}</p><h3>${card.querySelector('h4').textContent}</h3><p>${card.querySelector('p:not(.card-type)').textContent}</p>${card.querySelector('.tag-list').outerHTML}${card.querySelector('a') ? `<a class="repo-link" href="${card.querySelector('a').href}" target="_blank" rel="noreferrer">View repository</a>` : ''}</article>`).join('')}</div>`, 'archive-sheet');
  }
  if (pages.length % 2) {
    const nextGroup = projectGroups[groupIndex + 1];
    addProjectPage(group.id, `${group.label} collection`, `<p class="folio-eyebrow">${group.entries.length} PROJECTS</p><h2 class="folio-title">${group.label}</h2><p>${group.description}</p><ul class="collection-projects">${group.entries.map(project => `<li>${project.querySelector('h3, h4').textContent}</li>`).join('')}</ul><button class="folio-button" type="button" data-project-jump="${nextGroup ? nextGroup.id : 'directory'}">${nextGroup ? `Explore ${nextGroup.label}` : 'Back to project directory'} <span aria-hidden="true">→</span></button>`, 'collection-sheet');
  }
});
for (const [id, label] of [['directory', 'Project directory'], ...projectGroups.map(group => [group.id, `${group.label} (${group.entries.length})`])]) {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = label;
  projectSelect.append(option);
}
function projectPosition(id) {
  const index = id === 'directory' ? projectDirectory : projectGroups.find(group => group.id === id)?.pageIndex;
  return index === undefined ? null : index / 2;
}
projectSelect.addEventListener('change', () => {
  const target = projectPosition(projectSelect.value);
  if (target !== null) goTo(target);
});

// A single phone menu reaches every chapter as well as each project collection.
const mobileSelect = document.querySelector('#mobile-page-select');
const chapterOptions = document.createElement('optgroup');
chapterOptions.label = 'Passport sections';
chapters.forEach(chapter => {
  const option = document.createElement('option');
  option.value = `chapter:${chapter}`;
  option.textContent = chapter === 'Projects' ? 'Project directory' : chapter;
  chapterOptions.append(option);
});
const collectionOptions = document.createElement('optgroup');
collectionOptions.label = 'Project collections';
projectGroups.forEach(group => {
  const option = document.createElement('option');
  option.value = `project:${group.id}`;
  option.textContent = `${group.label} (${group.entries.length})`;
  collectionOptions.append(option);
});
mobileSelect.append(chapterOptions, collectionOptions);
mobileSelect.addEventListener('change', () => {
  const [kind, value] = mobileSelect.value.split(':');
  const target = kind === 'project' ? projectPosition(value)
    : Math.floor(pages.findIndex(page => page.chapter === value) / 2);
  if (target !== null && target >= 0) goTo(target);
});

const skills = [...source.querySelectorAll('.skills-passport article')];
for (const [start, end] of [[0, 3], [3, 5]]) {
  addPage('Skills', start === 0 ? 'Languages & systems' : 'Platforms & tooling', `<div class="document-heading"><span>TECHNICAL ENDORSEMENTS</span><span>${start === 0 ? 'I' : 'II'}</span></div><h2 class="folio-title">${start === 0 ? 'The toolkit.' : 'Built to deliver.'}</h2><div class="folio-skills">${skills.slice(start, end).map(skill => skill.outerHTML).join('')}</div>${start ? '<div class="skill-extra"><h3>Applied in projects</h3><p>TensorFlow · Keras · NumPy · OpenCV · Swift · SwiftUI · MQTT</p></div>' : ''}`, 'skills-sheet');
}
addPage('Education', 'McMaster University', `<div class="document-heading"><span>ACADEMIC RECORD</span><span>2027</span></div>${content('.education-main')}`, 'education-sheet');
addPage('Education', 'Continued learning', `<div class="document-heading"><span>CONTINUED LEARNING</span><span>ENDORSEMENTS</span></div><h2 class="folio-title">Always a student.</h2>${content('.certifications')}`, 'certificates-sheet');
addPage('Contact', 'Get in touch', `<p class="folio-eyebrow">THE NEXT CHAPTER</p><h2 class="folio-title">Let’s build<br>what’s next.</h2><p>I’m interested in software engineering opportunities across embedded systems, backend and full-stack development, test infrastructure, and applied machine learning.</p><div class="contact-links"><a href="mailto:musab.mondal321@gmail.com"><small>EMAIL</small>musab.mondal321@gmail.com</a><a href="https://www.linkedin.com/in/musabuddin-mondal" target="_blank" rel="noreferrer"><small>LINKEDIN</small>Musabuddin Mondal</a><a href="https://github.com/MusabMondal" target="_blank" rel="noreferrer"><small>GITHUB</small>@MusabMondal</a></div>`, 'contact-sheet');
addPage('Contact', 'End of passport', `<div class="end-seal"><span>ENGINEERING PASSPORT</span><strong>MM</strong><span>MUSABUDDIN MONDAL</span></div><p class="end-note">Thanks for taking a look.<br>There’s more to come.</p><button class="folio-button" type="button" data-chapter="Profile">Back to the first page</button>`, 'end-sheet');

const totalSpreads = pages.length / 2;
function pageMarkup(index, side) {
  const page = pages[index];
  return `<section class="paper-page ${side} ${page.className}" aria-label="Page ${index + 1}: ${page.label}"><div class="paper-scroll" tabindex="0" aria-label="${page.label}">${page.markup}</div><div class="folio-footer"><span>${page.chapter.toUpperCase()} / MUSABUDDIN MONDAL</span><span>${String(index + 1).padStart(2, '0')}</span></div></section>`;
}
function visibleMarkup(value) {
  if (narrow.matches) return pageMarkup(value * 2, 'single-page');
  return pageMarkup(value * 2, 'left-page') + pageMarkup(value * 2 + 1, 'right-page');
}
const stepSize = () => narrow.matches ? 0.5 : 1;
const lastPosition = () => totalSpreads - stepSize();

chapters.forEach(chapter => {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = chapter; button.dataset.chapter = chapter;
  tabs.append(button);
});
for (let i = 0; i < totalSpreads; i++) {
  const button = document.createElement('button');
  button.type = 'button'; button.dataset.spread = i;
  button.setAttribute('aria-label', `Pages ${i * 2 + 1}–${i * 2 + 2}: ${pages[i * 2].chapter}`);
  button.title = pages[i * 2].label;
  dots.append(button);
}

function updateControls() {
  previous.disabled = turning || !coverOpen;
  next.disabled = turning || (coverOpen && spread === lastPosition());
  previous.innerHTML = spread === 0 ? '<span aria-hidden="true">←</span> Close' : '<span aria-hidden="true">←</span> Previous';
  next.innerHTML = coverOpen ? 'Next <span aria-hidden="true">→</span>' : 'Open <span aria-hidden="true">→</span>';
  previous.setAttribute('aria-label', spread === 0 ? 'Close passport' : 'Previous passport pages');
  next.setAttribute('aria-label', coverOpen ? 'Next passport pages' : 'Open passport');
  tabs.querySelectorAll('button').forEach(button => {
    const active = button.dataset.chapter === pages[spread * 2].chapter;
    button.setAttribute('aria-current', active ? 'page' : 'false');
    button.disabled = turning;
  });
  dots.querySelectorAll('button').forEach((button, index) => {
    button.setAttribute('aria-current', index === Math.floor(spread) ? 'page' : 'false');
    button.disabled = turning;
  });
  mobileSelect.disabled = turning;
  const currentPage = pages[spread * 2];
  mobileSelect.value = currentPage.projectGroup && currentPage.projectGroup !== 'directory'
    ? `project:${currentPage.projectGroup}` : `chapter:${currentPage.chapter}`;
  projectSelect.disabled = turning;
  projectSelect.value = coverOpen ? (pages[spread * 2].projectGroup || '') : '';
  app.querySelectorAll('[data-project-jump]').forEach(button => { button.disabled = turning; });
  status.textContent = coverOpen ? (narrow.matches ? `Page ${spread * 2 + 1} of ${pages.length}`
    : `${projectGroups.find(group => group.id === currentPage.projectGroup)?.label || currentPage.chapter} · ${String(spread * 2 + 1).padStart(2, '0')} — ${String(spread * 2 + 2).padStart(2, '0')} / ${pages.length}`) : 'ENGINEERING PASSPORT · MM';
  hint.firstChild.textContent = coverOpen ? (narrow.matches ? 'Swipe to turn · ' : 'Drag a page or use the arrows · ')
    : (narrow.matches ? 'Tap the cover to open · ' : 'Click the cover to open · Drag a page or use the arrows · ');
}

function setCoverOpen(open) {
  if (turning || coverOpen === open) return;
  coverOpen = open;
  app.classList.toggle('is-open', open);
  app.classList.toggle('is-closed', !open);
  frontCover.inert = open;
  frontCover.setAttribute('aria-hidden', open ? 'true' : 'false');
  surfaces.inert = !open;
  if (!open) spread = 0;
  render();
}

function render() {
  surfaces.innerHTML = visibleMarkup(spread);
  updateControls();
}

// Share the same two-sided leaf between button turns and interactive dragging.
function prepareTurn(target) {
  const forward = target > spread;
  turning = true;
  updateControls();
  book.setAttribute('aria-busy', 'true');
  leaf.className = `turning-leaf ${forward ? 'forward' : 'backward'}`;
  leaf.style.transition = 'none';
  leaf.style.transform = 'rotateY(0deg)';
  leaf.querySelector('.leaf-front').innerHTML = pageMarkup(spread * 2 + (!narrow.matches && forward ? 1 : 0), forward ? 'right-page' : 'left-page');
  leaf.querySelector('.leaf-back').innerHTML = pageMarkup(target * 2 + (!narrow.matches && !forward ? 1 : 0), forward ? 'left-page' : 'right-page');
  leaf.inert = true;
  surfaces.innerHTML = narrow.matches ? visibleMarkup(target) : forward
    ? pageMarkup(spread * 2, 'left-page') + pageMarkup(target * 2 + 1, 'right-page')
    : pageMarkup(target * 2, 'left-page') + pageMarkup(spread * 2 + 1, 'right-page');
  surfaces.inert = true;
  leaf.hidden = false;
  return forward;
}

function settleTurn(target, forward, progress = 0, commit = true) {
  const token = ++turnToken;
  const duration = reducedMotion.matches ? 0 : Math.max(160, (narrow.matches ? 600 : 900) * (commit ? 1 - progress : progress));
  const finish = () => {
    if (token !== turnToken || !turning) return;
    clearTimeout(turningTimer);
    leaf.ontransitionend = null;
    if (commit) spread = target;
    turning = false;
    leaf.hidden = true;
    leaf.style.transition = '';
    leaf.style.transform = '';
    leaf.querySelectorAll('.leaf-face').forEach(face => face.replaceChildren());
    surfaces.inert = false;
    book.removeAttribute('aria-busy');
    render();
  };
  leaf.getBoundingClientRect();
  leaf.style.transition = `transform ${duration}ms cubic-bezier(.4,.05,.23,1)`;
  leaf.style.transform = `rotateY(${commit ? (forward ? -180 : 180) : 0}deg)`;
  leaf.ontransitionend = event => {
    if (event.target === leaf && event.propertyName === 'transform') finish();
  };
  if (!duration) finish();
  else turningTimer = setTimeout(finish, duration + 100);
}

function goTo(target) {
  if (!coverOpen) { setCoverOpen(true); return; }
  if (turning || target < 0 || target > lastPosition() || target === spread) return;
  const forward = prepareTurn(target);
  settleTurn(target, forward);
}

frontCover.addEventListener('click', () => setCoverOpen(true));
previous.addEventListener('click', () => spread === 0 ? setCoverOpen(false) : goTo(spread - stepSize()));
next.addEventListener('click', () => coverOpen ? goTo(spread + stepSize()) : setCoverOpen(true));
app.addEventListener('click', event => {
  const projectJump = event.target.closest('[data-project-jump]');
  if (projectJump) {
    const target = projectPosition(projectJump.dataset.projectJump);
    if (target !== null) goTo(target);
  }
  const chapter = event.target.closest('[data-chapter]');
  if (chapter) goTo(Math.floor(pages.findIndex(page => page.chapter === chapter.dataset.chapter) / 2));
  const dot = event.target.closest('[data-spread]');
  if (dot) goTo(Number(dot.dataset.spread));
});
document.addEventListener('keydown', event => {
  if (!document.body.classList.contains('book-mode') || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); coverOpen ? goTo(spread + stepSize()) : setCoverOpen(true); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); coverOpen && spread === 0 ? setCoverOpen(false) : goTo(spread - stepSize()); }
});
let drag = null;
let suppressClick = false;
scene.addEventListener('pointerdown', event => {
  if (!coverOpen || turning || !event.isPrimary || event.button !== 0 || event.target.closest('a, button')) return;
  const bounds = book.getBoundingClientRect();
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, width: bounds.width / (narrow.matches ? 1 : 2),
    side: narrow.matches ? null : event.clientX >= bounds.left + bounds.width / 2, progress: 0, active: false };
});
scene.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  if (!drag.active) {
    const threshold = event.pointerType === 'touch' ? 14 : 10;
    if (Math.abs(dy) > threshold && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    const forward = dx < 0;
    if (drag.side !== null && forward !== drag.side) { drag = null; return; }
    const target = spread + (forward ? stepSize() : -stepSize());
    if (target < 0 || target > lastPosition()) { drag = null; return; }
    drag.target = target;
    drag.forward = prepareTurn(target);
    drag.active = true;
    scene.setPointerCapture(event.pointerId);
    scene.classList.add('is-dragging');
  }
  event.preventDefault();
  drag.progress = Math.max(0, Math.min(1, dx * (drag.forward ? -1 : 1) / drag.width));
  leaf.style.transform = `rotateY(${drag.progress * (drag.forward ? -180 : 180)}deg)`;
});
function endDrag(event, cancelled = false) {
  if (!drag || event.pointerId !== drag.id) return;
  const current = drag;
  drag = null;
  scene.classList.remove('is-dragging');
  if (scene.hasPointerCapture(event.pointerId)) scene.releasePointerCapture(event.pointerId);
  if (!current.active) return;
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 0);
  settleTurn(current.target, current.forward, current.progress, !cancelled && current.progress >= .3);
}
scene.addEventListener('pointerup', event => endDrag(event));
scene.addEventListener('pointercancel', event => endDrag(event, true));
scene.addEventListener('lostpointercapture', event => endDrag(event, true));
scene.addEventListener('click', event => {
  if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
}, true);
scene.addEventListener('dragstart', event => { if (coverOpen) event.preventDefault(); });

function setBookMode(enabled) {
  document.body.classList.toggle('book-mode', enabled);
  document.body.classList.toggle('reading-mode', !enabled);
  app.hidden = !enabled;
  source.hidden = enabled;
  document.querySelector('#return-to-passport').hidden = enabled;
  if (!enabled) {
    source.querySelectorAll('.reveal').forEach(node => node.classList.add('visible'));
    window.scrollTo({ top: 0 });
  } else {
    window.scrollTo({ top: 0 });
  }
}
document.querySelector('#reading-mode').addEventListener('click', () => {
  setBookMode(false);
  source.tabIndex = -1;
  source.focus({ preventScroll: true });
});
document.querySelector('#return-to-passport').addEventListener('click', () => {
  setBookMode(true);
  scene.focus({ preventScroll: true });
});
narrow.addEventListener('change', () => {
  if (drag) endDrag({ pointerId: drag.id }, true);
  clearTimeout(turningTimer);
  leaf.ontransitionend = null;
  leaf.style.transform = '';
  leaf.style.transition = '';
  turnToken++;
  turning = false;
  leaf.hidden = true;
  surfaces.inert = false;
  book.removeAttribute('aria-busy');
  if (!narrow.matches) spread = Math.floor(spread);
  render();
});
render();
setCoverOpen(false);
setBookMode(true);
