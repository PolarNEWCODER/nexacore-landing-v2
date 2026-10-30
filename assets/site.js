// Endereço usado na apresentação. Troque apenas quando o contato oficial mudar.
const CONTACT_EMAIL = 'contato@nexacore.example';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

const topbar = $('#topbar');
const scrollMeter = $('#scrollMeter');
const cursorGlow = $('#cursorGlow');
let scrollFrame = 0;

function updateScrollProgress() {
  scrollFrame = 0;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  if (scrollMeter) scrollMeter.style.width = `${progress}%`;
  if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 18);
}

function queueScrollProgress() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollProgress);
}

updateScrollProgress();
window.addEventListener('scroll', queueScrollProgress, { passive: true });
window.addEventListener('resize', queueScrollProgress, { passive: true });

const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const menuToggle = $('#menuToggle');
const nav = $('#navLinks');

function closeMenu({ returnFocus = false } = {}) {
  if (!menuToggle || !nav) return;
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  menuToggle.textContent = '☰';
  if (returnFocus) menuToggle.focus();
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menuToggle.textContent = isOpen ? '×' : '☰';
  });

  $$('#navLinks a').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu({ returnFocus: true });
  });
}

// Keep the main navigation in sync with the section currently in view.
const navLinks = $$('#navLinks a[href^="#"]');
const pageSections = $$('main > section[id]');
if ('IntersectionObserver' in window && navLinks.length && pageSections.length) {
  const sectionVisibility = new Map();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      sectionVisibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });

    const currentSection = [...sectionVisibility.entries()]
      .filter(([, ratio]) => ratio > 0)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    navLinks.forEach((link) => {
      if (link.hash === `#${currentSection}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { threshold: [0, 0.15, 0.35, 0.55], rootMargin: '-18% 0px -52% 0px' });

  pageSections.forEach((section) => sectionObserver.observe(section));
}

// Scroll-driven story: the active card, current step, and progress line move together.
const storyCards = $$('.story-card');
const storyCount = $('#storyCount');
const storyLine = $('#storyLine');
const storyProgress = storyLine?.parentElement;

function setActiveStory(index) {
  if (index < 0 || index >= storyCards.length) return;
  storyCards.forEach((card, cardIndex) => card.classList.toggle('active', cardIndex === index));

  const currentStep = index + 1;
  if (storyCount) storyCount.textContent = String(currentStep).padStart(2, '0');
  if (storyLine) storyLine.style.width = `${(currentStep / storyCards.length) * 100}%`;
  if (storyProgress) storyProgress.setAttribute('aria-valuenow', String(currentStep));
}

if ('IntersectionObserver' in window && storyCards.length) {
  const storyVisibility = new Map();
  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      storyVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
    });

    const mostVisible = [...storyVisibility.entries()]
      .filter(([, ratio]) => ratio > 0)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!mostVisible) return;

    setActiveStory(storyCards.indexOf(mostVisible));
  }, { threshold: [0.4, 0.55, 0.7], rootMargin: '-12% 0px -12% 0px' });

  storyCards.forEach((card) => storyObserver.observe(card));
} else {
  setActiveStory(0);
}

// Subtle pointer depth on the hero. It is skipped for touch and reduced-motion users.
const heroStage = $('#heroStage');
if (heroStage && !prefersReducedMotion && hasFinePointer) {
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerClientX = 0;
  let pointerClientY = 0;

  heroStage.addEventListener('pointermove', (event) => {
    const bounds = heroStage.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    if (pointerFrame) return;

    pointerFrame = window.requestAnimationFrame(() => {
      heroStage.style.transform = `rotateY(${pointerX * 5}deg) rotateX(${-pointerY * 4}deg)`;
      if (cursorGlow) {
        cursorGlow.style.opacity = '0.8';
        cursorGlow.style.left = `${pointerClientX}px`;
        cursorGlow.style.top = `${pointerClientY}px`;
      }
      pointerFrame = 0;
    });
  });

  heroStage.addEventListener('pointerleave', () => {
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    heroStage.style.transform = '';
    if (cursorGlow) cursorGlow.style.opacity = '0';
  });
}

// Every value below is illustrative and remains labelled as demonstration data.
const demoViews = {
  overview: {
    label: 'Visão geral',
    kicker: 'PAINEL DE CONTROLE / VISÃO GERAL',
    title: 'Bom dia, equipe.',
    metrics: [
      ['Pessoas cadastradas', '128', 'Base demonstrativa'],
      ['Equipes ativas', '08', 'Organização interna'],
      ['Pendências', '06', 'Exemplo de acompanhamento'],
    ],
    chart: 'Distribuição ilustrativa',
    bars: [48, 69, 56, 82, 63, 93, 74, 100],
    note: 'Interface conceitual para demonstrar a direção do produto. Funcionalidades e indicadores finais dependem do escopo aprovado do sistema.',
  },
  people: {
    label: 'Pessoas',
    kicker: 'GESTÃO DE PESSOAS / CADASTROS',
    title: 'Pessoas em um só lugar.',
    metrics: [
      ['Perfis demonstrativos', '128', 'Dados fictícios'],
      ['Novos cadastros', '12', 'Exemplo visual'],
      ['Informações completas', '94%', 'Indicador ilustrativo'],
    ],
    chart: 'Cadastros por período',
    bars: [35, 48, 43, 65, 54, 77, 69, 92],
    note: 'A visão de pessoas é ilustrativa. Os campos, permissões e processos reais serão definidos conforme os requisitos do produto.',
  },
  teams: {
    label: 'Equipes',
    kicker: 'ORGANIZAÇÃO / EQUIPES',
    title: 'Uma visão por equipe.',
    metrics: [
      ['Equipes ilustrativas', '08', 'Estrutura de exemplo'],
      ['Áreas demonstrativas', '05', 'Organização visual'],
      ['Lideranças', '08', 'Exemplo de cadastro'],
    ],
    chart: 'Distribuição por equipe',
    bars: [75, 42, 64, 55, 91, 68, 47, 79],
    note: 'A estrutura de equipes exibida não representa dados reais de uma organização.',
  },
  insights: {
    label: 'Indicadores',
    kicker: 'INDICADORES / VISÃO ANALÍTICA',
    title: 'Informação para decidir.',
    metrics: [
      ['Indicadores exemplo', '04', 'Modelo conceitual'],
      ['Relatórios visuais', '06', 'Exemplo de interface'],
      ['Atualização', 'Demo', 'Sem dados conectados'],
    ],
    chart: 'Tendência demonstrativa',
    bars: [28, 38, 46, 41, 62, 71, 66, 94],
    note: 'Os gráficos são demonstrativos e não estão conectados a uma base real. Métricas finais dependem das regras e fontes de dados implementadas.',
  },
};

const demoButtons = $$('[data-view]');
const demoMain = $('.demo-main');
const demoMetrics = $('#demoMetrics');
const demoChart = $('#demoChart');
const demoStatus = $('#demoStatus');
let demoAnimationTimer = 0;

function makeMetric([label, value, description]) {
  const metric = document.createElement('div');
  metric.className = 'demo-metric';

  const metricLabel = document.createElement('div');
  metricLabel.className = 'metric-label';
  metricLabel.textContent = label;

  const metricValue = document.createElement('div');
  metricValue.className = 'metric-value';
  metricValue.textContent = value;

  const metricDescription = document.createElement('div');
  metricDescription.className = 'metric-change neutral';
  metricDescription.textContent = description;

  metric.append(metricLabel, metricValue, metricDescription);
  return metric;
}

function makeChartBar(height) {
  const bar = document.createElement('i');
  bar.className = 'bar';
  bar.setAttribute('aria-hidden', 'true');
  bar.style.setProperty('--h', `${height}%`);
  return bar;
}

function setDemoView(key, { announce = false } = {}) {
  const view = demoViews[key];
  if (!view) return;

  demoButtons.forEach((button) => {
    const isActive = button.dataset.view === key;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  $('#demoKicker').textContent = view.kicker;
  $('#demoTitle').textContent = view.title;
  $('#chartTitle').textContent = view.chart;
  $('#demoNote').textContent = view.note;
  demoChart.setAttribute('aria-label', `${view.chart}. Dados demonstrativos, sem conexão a uma base real.`);
  demoMetrics.replaceChildren(...view.metrics.map(makeMetric));
  demoChart.replaceChildren(...view.bars.map(makeChartBar));

  if (announce && demoStatus) demoStatus.textContent = `Visualização ${view.label} selecionada. Todos os dados são demonstrativos.`;

  if (demoMain && !prefersReducedMotion) {
    window.clearTimeout(demoAnimationTimer);
    demoMain.classList.remove('is-updating');
    void demoMain.offsetWidth;
    demoMain.classList.add('is-updating');
    demoAnimationTimer = window.setTimeout(() => demoMain.classList.remove('is-updating'), 360);
  }
}

demoButtons.forEach((button) => button.addEventListener('click', () => {
  setDemoView(button.dataset.view, { announce: true });
}));
setDemoView('overview');

// The magnetic response is small, pointer-only, and disabled when motion is reduced.
if (!prefersReducedMotion && hasFinePointer) {
  $$('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * 0.045;
      const y = (event.clientY - bounds.top - bounds.height / 2) * 0.08;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}

const year = $('#year');
if (year) year.textContent = String(new Date().getFullYear());

const contactForm = $('#contactForm');
const formFeedback = $('#formFeedback');

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const emailAddress = CONTACT_EMAIL.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      formFeedback.textContent = 'Não foi possível preparar a mensagem. Confira o endereço configurado da Nexa Core.';
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const senderEmail = String(formData.get('email') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = encodeURIComponent(`Contato pelo site Nexa Core — ${name}`);
    const body = encodeURIComponent(
      `Olá, Nexa Core!\n\nNome: ${name}\nE-mail: ${senderEmail}\nEmpresa: ${company || 'Não informada'}\n\nDesafio / projeto:\n${message}\n\nEnviado a partir da landing page da Nexa Core.`
    );

    formFeedback.textContent = 'Abrindo o Gmail…';
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${subject}&body=${body}`;
    window.setTimeout(() => {
      formFeedback.textContent = `Se o Gmail não abrir, confira se você está conectado à sua conta Google. Destino: ${emailAddress}.`;
    }, 1500);
  });
}
