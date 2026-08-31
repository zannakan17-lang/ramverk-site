const html = document.documentElement;
const buttons = document.querySelectorAll('.toggle button');
const heroData = {
  forest: {
    eyebrow: 'Частное строительство',
    prefix: 'Дом, который растёт вместе с ',
    words: ['лесом', 'уединением', 'тишиной'],
    suffix: ' вокруг',
    sub: 'Премиальное деревянное домостроение и рекреационные объекты под ключ.',
    aboutText: 'Мы не строим быстро и в ущерб качеству. Каждый проект индивидуален — это природный или лесной массив, водный объект, прибрежная линия, которые нельзя воссоздать заново, если ошибиться. Поэтому мы работаем с <b>хирургической точностью</b> и особым вниманием к деталям: просчитываем заранее все варианты, проверяем возможность их безболезненной адаптации на местности и доводим реализацию до логического конца, <b>без каких-либо компромиссных вариантов</b>.'
  },
  concrete: {
    eyebrow: 'Промышленное строительство',
    prefix: 'Точность и надёжность в каждой ',
    words: ['конструкции', 'детали', 'системе'],
    suffix: '',
    sub: 'Индустриальные объекты и производственные комплексы под ключ.',
    aboutText: 'Бетон — это материал, который мы превращаем в архитектуру. В отличие от дерева, здесь нет места для ошибки: каждая форма, каждый угол и каждая текстура должны быть продуманы до мельчайших деталей. Мы работаем с бетоном как с <b>живым материалом</b>, учитывая его пластичность, прочность и способность стареть красиво. Наш подход — это сочетание <b>инженерной точности</b> и архитектурной выразительности, где каждая линия имеет значение, а каждая поверхность рассказывает свою историю.'
  }
};
let wordTimer = null;
function startHeroWords(theme){
  clearInterval(wordTimer);
  const d = heroData[theme];
  let wi = 0;
  const maxLen = Math.max(...d.words.map(w => w.length));
  wordTimer = setInterval(() => {
    const el = document.getElementById('hero-word');
    if(!el) return;
    el.style.setProperty('--word-w', maxLen + 'ch');
    el.classList.add('swap-out');
    setTimeout(() => {
      wi = (wi + 1) % d.words.length;
      el.textContent = d.words[wi];
      el.classList.remove('swap-out');
    }, 450);
  }, 2800);
}
function applyHero(theme){
  const d = heroData[theme];
  const maxLen = Math.max(...d.words.map(w => w.length));
  document.getElementById('hero-eyebrow').textContent = d.eyebrow;
  document.getElementById('hero-title').innerHTML = d.prefix + '<span class="hero-word" id="hero-word" style="--word-w:' + maxLen + 'ch">' + d.words[0] + '</span>' + d.suffix;
  document.getElementById('hero-sub').textContent = d.sub;
  
  // Обновляем текст в карточке "О нас"
  const aboutTextEl = document.querySelector('.about-text');
  if (aboutTextEl && d.aboutText) {
    aboutTextEl.innerHTML = d.aboutText;
  }
  
  startHeroWords(theme);
}
buttons.forEach(btn => {
  btn.onclick = () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const theme = btn.getAttribute('data-theme');
    if(theme === 'concrete'){ html.setAttribute('data-theme','concrete'); } else { html.removeAttribute('data-theme'); }
    applyHero(theme);
    if (theme === 'concrete') {
      renderCarousel(concretePhotos, concretePhotoNames);
  } else {
      renderCarousel(forestPhotos, forestPhotoNames);
  }
  };
});
applyHero('forest');

const eyebrowEl = document.getElementById('hero-eyebrow');
const eyebrowText = eyebrowEl.textContent;
eyebrowEl.innerHTML = '';
eyebrowText.split('').forEach((ch, i) => {
  const span = document.createElement('span');
  span.className = 'char';
  span.textContent = ch === ' ' ? '\u00A0' : ch;
  span.style.transitionDelay = (i * 30) + 'ms';
  eyebrowEl.appendChild(span);
});
setTimeout(() => {
  eyebrowEl.querySelectorAll('.char').forEach(c => c.classList.add('in'));
}, 200);
setTimeout(() => document.getElementById('hero-sub').classList.add('in'), 800);
setTimeout(() => document.getElementById('hero-cta').classList.add('in'), 1200);

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:0.15});
document.querySelectorAll('.card').forEach(s => io.observe(s));

document.querySelectorAll('[data-target]').forEach(el => {
  const target = parseInt(el.getAttribute('data-target'));
  let done = false;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting && !done){
        done = true;
        let start = null;
        const dur = 1200;
        function step(ts){
          if(!start) start = ts;
          const p = Math.min(1, (ts - start) / dur);
          el.textContent = Math.round(target * p).toLocaleString('ru-RU');
          if(p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    });
  }, {threshold:0.4});
  obs.observe(el);
});

const stageData = [
  {n:'01', icon:'ti-bulb', t:'Обсуждение идеи клиента и проработка архитектурной концепции'},
  {n:'02', icon:'ti-file-text', t:'Подготовка пакета исходно-разрешительной документации'},
  {n:'03', icon:'ti-mountain', t:'Инженерно-геологические исследования'},
  {n:'04', icon:'ti-file-description', t:'Разработка проектной документации'},
  {n:'05', icon:'ti-truck', t:'Мобилизация и начало работ'},
  {n:'06', icon:'ti-package', t:'Подбор строительных материалов и оборудования'},
  {n:'07', icon:'ti-trees', t:'Благоустройство прилегающей территории'},
  {n:'08', icon:'ti-key', t:'Ввод объекта в эксплуатацию и передача заказчику'}
];
const STAGE_DURATION = 3500;
const stagesEl = document.getElementById('stages');
const stageNumEl = document.getElementById('stage-num');
const stageIconEl = document.getElementById('stage-icon');
const stageTextEl = document.getElementById('stage-text');
const segFills = [];
stageData.forEach((s, i) => {
  const seg = document.createElement('div');
  seg.className = 'stage-seg';
  const fill = document.createElement('div');
  fill.className = 'stage-seg-fill';
  seg.appendChild(fill);
  seg.onclick = () => setStage(i, true);
  stagesEl.appendChild(seg);
  segFills.push(fill);
});
let stageIndex = 0;
let stageTimer = null;
function setStage(i, restart){
  stageIndex = i;
  const s = stageData[i];
  stageNumEl.textContent = s.n;
  stageIconEl.className = 'ti stage-icon-big ' + s.icon;
  stageTextEl.textContent = s.t;
  segFills.forEach((f, idx) => {
    f.classList.remove('filling');
    void f.offsetWidth;
    if(idx < i){ f.classList.add('done'); f.style.width = '100%'; f.classList.remove('filling'); }
    else if(idx === i){ f.classList.remove('done'); f.style.width = ''; f.style.animationDuration = STAGE_DURATION + 'ms'; f.classList.add('filling'); }
    else { f.classList.remove('done'); f.style.width = '0%'; f.classList.remove('filling'); }
  });
  if(restart) clearTimeout(stageTimer);
  clearTimeout(stageTimer);
  stageTimer = setTimeout(() => setStage((stageIndex + 1) % stageData.length, false), STAGE_DURATION);
}
setStage(0, false);
const stagesCard = stagesEl.closest('.card');
stagesCard.addEventListener('mouseenter', () => { segFills[stageIndex].style.animationPlayState = 'paused'; clearTimeout(stageTimer); });
stagesCard.addEventListener('mouseleave', () => {
  segFills[stageIndex].style.animationPlayState = 'running';
  const remaining = STAGE_DURATION;
  clearTimeout(stageTimer);
  stageTimer = setTimeout(() => setStage((stageIndex + 1) % stageData.length, false), remaining);
});

// --- ОБНОВЛЕННАЯ ЧАСТЬ: ПУТИ К ИЗОБРАЖЕНИЯМ ---
const forestPhotos = [
  "images/forest/B0042895.jpg",
  "images/forest/DSC03469.jpg",
  "images/forest/IMG_20260812_120547.jpg",
  "images/forest/photo_2023-04-25_15.01.51.jpeg",
  "images/forest/photo_2022-03-17_08-53-50.jpg"
];
const forestPhotoNames = [
  "Времена года. Игора",
  "Точка на карте. Видлица",
  "Мельниково",
  "Silk Road",
  "Амирсой"
];

// Если у вас нет конкретных изображений для бетона, можно использовать те же лесные.
// Или создать папку images/concrete/ и положить туда другие изображения.
const concretePhotos = [
  "images/concrete/05.jpg",
  "images/concrete/Нонтиссе_01.jpg",
  "images/concrete/Шушары_Бадаевское_04.jpg",
  "images/concrete/G_03.jpg",
  "images/concrete/86_10.jpg"
];
const concretePhotoNames = [
  "Шушары. Складской А+",
  "Нонтиссе. Light Industrial",
  "Шушары. Бадаевское",
  "Шушары. Бадаевское_02",
  "Шушары. Складской А+ 86 уч."
];
// -------------------------------------------------

const track = document.getElementById('carousel-track');
const dotsWrap = document.getElementById('carousel-dots');
const carouselEl = document.querySelector('.carousel');
let currentPhotos = forestPhotos;
let current = 0;
let autoplay = null;

function renderCarousel(photos, namesArray){
  currentPhotos = photos.length ? photos : [null, null, null];
  current = 0;
  track.innerHTML = '';
  dotsWrap.innerHTML = '';

  currentPhotos.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    if (src) {
      slide.style.backgroundImage = `url(${src})`;
      slide.style.backgroundSize = 'cover';
      slide.style.backgroundPosition = 'center';
    } else {
      slide.classList.add('carousel-slide-placeholder');
    }

    // Добавляем название слайда
    const nameDiv = document.createElement('div');
    nameDiv.className = 'carousel-slide-name';
    nameDiv.textContent = namesArray[i] || `Объект ${i + 1}`;
    slide.appendChild(nameDiv);

    track.appendChild(slide);

    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goTo(i);
    dotsWrap.appendChild(dot);
  });

  track.style.transform = 'translateX(0%)';
  clearInterval(autoplay);
  autoplay = setInterval(() => goTo(current + 1), 5000);
}
function goTo(i){
  current = (i + currentPhotos.length) % currentPhotos.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsWrap.querySelectorAll('button').forEach((d, idx) => d.classList.toggle('active', idx === current));
}
const zoneLeft = document.getElementById('carousel-zone-left');
const zoneRight = document.getElementById('carousel-zone-right');
zoneLeft.onclick = () => goTo(current - 1);
zoneRight.onclick = () => goTo(current + 1);
carouselEl.addEventListener('mouseenter', () => clearInterval(autoplay));
carouselEl.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current + 1), 5000); });
let touchStartX = 0;
carouselEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
carouselEl.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if(diff > 40) goTo(current - 1);
  else if(diff < -40) goTo(current + 1);
});
renderCarousel(forestPhotos, forestPhotoNames);

document.querySelectorAll('.project-block').forEach(p => {
  p.onclick = () => p.classList.toggle('selected');
});

const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});
function animateOutline(){
  outlineX += (mouseX - outlineX) * 0.18;
  outlineY += (mouseY - outlineY) * 0.18;
  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top = outlineY + 'px';
  requestAnimationFrame(animateOutline);
}
animateOutline();
document.querySelectorAll('a, button, .stat, .stage-seg, .carousel-zone').forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
});
zoneLeft.addEventListener('mouseenter', () => { cursorOutline.classList.add('label-mode'); cursorOutline.textContent = 'Назад'; });
zoneRight.addEventListener('mouseenter', () => { cursorOutline.classList.add('label-mode'); cursorOutline.textContent = 'Далее'; });
[zoneLeft, zoneRight].forEach(z => z.addEventListener('mouseleave', () => { cursorOutline.classList.remove('label-mode'); cursorOutline.textContent = ''; }));

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const relX = e.clientX - r.left - r.width / 2;
    const relY = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
});

const scrollIndicator = document.getElementById('scroll-indicator');
window.addEventListener('scroll', () => {
  scrollIndicator.style.opacity = window.scrollY > 60 ? '0' : '0.8';
});

const stagePathFill = document.getElementById('stage-path-fill');
const stageBodyEl = document.querySelector('.stage-body');
function updateStagePath(){
  const r = stageBodyEl.getBoundingClientRect();
  const vh = window.innerHeight;
  const progress = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3)));
  stagePathFill.style.height = (progress * 100) + '%';
}
window.addEventListener('scroll', updateStagePath);
updateStagePath();

document.querySelectorAll('.stat').forEach(stat => {
  const labelEl = stat.querySelector('.label');
  const original = labelEl.textContent;
  const breakdown = stat.getAttribute('data-breakdown');
  stat.addEventListener('mouseenter', () => {
    labelEl.style.opacity = '0';
    setTimeout(() => { labelEl.textContent = breakdown; labelEl.classList.add('breakdown'); labelEl.style.opacity = '1'; }, 150);
  });
  stat.addEventListener('mouseleave', () => {
    labelEl.style.opacity = '0';
    setTimeout(() => { labelEl.textContent = original; labelEl.classList.remove('breakdown'); labelEl.style.opacity = '1'; }, 150);
  });
});
// ===== INTERACTIVE MAP (SVG) =====
const geoData = {
  karelia: { title: 'Карелия · Видлица', desc: 'Глэмпинг-курорт «Точка на карте» на берегу Ладожского озера. Модульные дома, панорамное остекление, минимальное воздействие на природу. 12 объектов.' },
  spb: { title: 'Санкт-Петербург', desc: 'Рекреационные и промышленные объекты: курорт «Времена года» в Игоре, складской комплекс А+ в Шушарах, резиденция в Мельниково. Более 40 объектов.' },
  tver: { title: 'Тверь', desc: 'Коттеджный посёлок премиум-класса и частные резиденции. Деревянное домостроение из клеёного бруса, авторские проекты. 8 объектов.' },
  moscow: { title: 'Москва', desc: 'Представительство компании и ключевые объекты: частные дома, загородные резиденции, коммерческая недвижимость. Более 30 объектов.' }
};

const geoInfoTitle = document.getElementById('geo-info-title');
const geoInfoDesc = document.getElementById('geo-info-desc');

document.querySelectorAll('.geo-city').forEach(city => {
  city.addEventListener('click', () => {
    const id = city.getAttribute('data-city');
    const data = geoData[id];
    if (!data) return;

    document.querySelectorAll('.geo-city').forEach(c => c.classList.remove('active'));
    city.classList.add('active');

    geoInfoTitle.style.opacity = '0';
    geoInfoDesc.style.opacity = '0';
    setTimeout(() => {
      geoInfoTitle.textContent = data.title;
      geoInfoDesc.textContent = data.desc;
      geoInfoTitle.style.opacity = '1';
      geoInfoDesc.style.opacity = '1';
    }, 200);
  });
});

// Re-observe new cards for scroll-in animation (fix for desktop)
document.querySelectorAll('.card').forEach(s => {
  if (!s.classList.contains('visible')) {
    io.observe(s);
  }
});

// ===== REVIEWS SLIDER =====
const reviewsData = [
  { name: 'Алексей Петров', role: 'CEO, Игора Ресорт', text: 'Команда РАМВЕРК показала исключительный профессионализм. Каждая деталь продумана, сроки соблюдены, качество безупречное. Наш курорт стал визитной карточкой региона.', stars: 5 },
  { name: 'Мария Иванова', role: 'Директор, НонТиссе', text: 'Работаем с РАМВЕРК уже третий проект подряд. Ценим их внимание к деталям и способность находить нестандартные инженерные решения без компромиссов.', stars: 5 },
  { name: 'Дмитрий Сидоров', role: 'Частный заказчик', text: 'Строительство дома — это всегда стресс. Но не с этой командой. Всё было прозрачно, понятно и вовремя. Результат превзошёл ожидания. Живём и радуемся.', stars: 5 },
  { name: 'Карим Усманов', role: 'Инвестор, Silk Road', text: 'Международный проект с множеством сложностей — логистика, климат, местные стандарты. РАМВЕРК справились блестяще. Рекомендую без оговорок.', stars: 5 },
  { name: 'Ольга Новикова', role: 'Архитектор-партнёр', text: 'Как архитектор, я знаю цену хорошему подрядчику. РАМВЕРК — это та редкая команда, которая реализует замысел без потери качества на каждом этапе.', stars: 5 }
];

const reviewTrack = document.getElementById('review-track');
const reviewDotsEl = document.getElementById('review-dots');
let currentReview = 0;
let reviewAutoplay = null;

function renderReviews() {
  reviewTrack.innerHTML = '';
  reviewDotsEl.innerHTML = '';
  reviewsData.forEach((r, i) => {
    const item = document.createElement('div');
    item.className = 'review-item';
    const starsHtml = Array(r.stars).fill('<i class="ti ti-star-filled"></i>').join('');
    const initials = r.name.split(' ').map(w => w[0]).join('');
    item.innerHTML = `
      <div class="review-content">
        <div class="review-stars">${starsHtml}</div>
        <div class="review-text">${r.text}</div>
        <div class="review-author">
          <div class="review-avatar">${initials}</div>
          <div class="review-meta">
            <div class="review-name">${r.name}</div>
            <div class="review-role">${r.role}</div>
          </div>
        </div>
      </div>
    `;
    reviewTrack.appendChild(item);

    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToReview(i);
    reviewDotsEl.appendChild(dot);
  });
  startReviewAutoplay();
}

function goToReview(i) {
  currentReview = ((i % reviewsData.length) + reviewsData.length) % reviewsData.length;
  reviewTrack.style.transform = `translateX(-${currentReview * 100}%)`;
  reviewDotsEl.querySelectorAll('button').forEach((d, idx) => d.classList.toggle('active', idx === currentReview));
}

function startReviewAutoplay() {
  clearInterval(reviewAutoplay);
  reviewAutoplay = setInterval(() => goToReview(currentReview + 1), 5000);
}

document.getElementById('review-prev').onclick = () => { goToReview(currentReview - 1); startReviewAutoplay(); };
document.getElementById('review-next').onclick = () => { goToReview(currentReview + 1); startReviewAutoplay(); };

const reviewsSlider = document.getElementById('reviews-slider');
reviewsSlider.addEventListener('mouseenter', () => clearInterval(reviewAutoplay));
reviewsSlider.addEventListener('mouseleave', startReviewAutoplay);

// Touch support for reviews
let reviewTouchX = 0;
reviewsSlider.addEventListener('touchstart', e => { reviewTouchX = e.touches[0].clientX; });
reviewsSlider.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - reviewTouchX;
  if (diff > 40) { goToReview(currentReview - 1); startReviewAutoplay(); }
  else if (diff < -40) { goToReview(currentReview + 1); startReviewAutoplay(); }
});

renderReviews();

// Hover cursor for review nav buttons and map cities
document.querySelectorAll('.review-btn, .review-dots button, .geo-city').forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
});
