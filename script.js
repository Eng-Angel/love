/* =====================================================================
   لِقلبِك وحدَه — script.js
   كل الإعدادات القابلة للتعديل موجودة في كائن CONFIG أدناه.
   ===================================================================== */

const CONFIG = {
  // كلمة السر الافتراضية (تُستخدم فقط أول مرة، بعدها تُحفظ في المتصفح)
  DEFAULT_PASSWORD: '3122007',

  // التاريخ الذي يبدأ منه العداد — عدّليه كما تشائين
  COUNTDOWN_START_DATE: new Date('2025-08-25T00:00:00'),

  // نص الترحيب الذي يُكتب حرفًا حرفًا في أعلى الصفحة
  HERO_TEXT: 'أهلاً بيكي تاني يا روحي',

  // رسالة التوست التي تظهر وتختفي بعد الدخول
  WELCOME_TOAST_TEXT: 'مستعدة تشوفي حاجة معمولالك مخصوص؟ ❤️',

  // نص خطأ كلمة السر الغلط
  WRONG_PASSWORD_TEXT: 'كلمة السر مش صح... جربي تاني يا قمر 💔',

  // الرسائل الرومانسية — تظهر واحدة ورا التانية، كل واحدة بعد ما اللي قبلها تخلص
  LETTER_MESSAGES: [
    'أنا عارف إني زعلتك، وإني قلت كلام مكنش لازم يتقال... سامحيني يا قمر 🥺',
    'من ساعة ما احنا مش عدل وأنا حاسس إن نص روحي ناقص',
    'انتي مش مجرد خطيبتي، انتي البيت اللي نفسي ارجعله كل مرة',
    'بجد بحبك أكتر من أي حاجة في الدنيا دي، وهفضل جنبك مهما حصل',
    'مستني بس كلمة منك عشان الدنيا ترجع حلوة زي زمان ❤️',
  ],

  TYPEWRITER_SPEED_HERO: 70,     // مللي ثانية بين كل حرف (العنوان)
  TYPEWRITER_SPEED_LETTER: 35,   // مللي ثانية بين كل حرف (كل رسالة)
  LETTER_MESSAGE_DELAY: 550,     // مللي ثانية فاصلة بين ظهور رسالة والتانية

  UNLOCK_ANIMATION_MS: 1000,   // مدة أنيميشن فتح القفل قبل الانتقال
  MAX_IMAGE_DIMENSION: 1000,   // أقصى عرض/ارتفاع للصورة قبل حفظها (لتقليل الحجم)
  IMAGE_QUALITY: 0.75,
};

const STORAGE_KEYS = {
  PASSWORD: 'romanticSite_password',
  PHOTOS: 'romanticSite_photos',
};

/* =====================================================================
   عناصر DOM
   ===================================================================== */
const loginScreen = document.getElementById('login-screen');
const contentScreen = document.getElementById('content-screen');
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const heartLockWrap = document.querySelector('.heart-lock-wrap');

const welcomeToast = document.getElementById('welcome-toast');
const heroTitle = document.getElementById('hero-title');
const heroCursor = document.getElementById('hero-cursor');
const letterMessagesEl = document.getElementById('letter-messages');
const letterSection = document.getElementById('letter-section');
const revealSections = document.querySelectorAll('.reveal-section');

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMinutes = document.getElementById('cd-minutes');

const galleryGrid = document.getElementById('gallery-grid');
const photoUpload = document.getElementById('photo-upload');
const galleryHint = document.getElementById('gallery-hint');

const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

const settingsToggle = document.getElementById('settings-toggle');
const settingsModal = document.getElementById('settings-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const passwordForm = document.getElementById('password-form');
const currentPasswordInput = document.getElementById('current-password');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const settingsMessage = document.getElementById('settings-message');

const heartsBg = document.getElementById('hearts-bg');
const confettiCanvas = document.getElementById('confetti-canvas');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================================================================
   1) تسجيل الدخول
   ===================================================================== */
function getStoredPassword() {
  return localStorage.getItem(STORAGE_KEYS.PASSWORD) || CONFIG.DEFAULT_PASSWORD;
}

function showLoginError(message) {
  loginError.textContent = message;
  loginError.classList.add('show');
  passwordInput.classList.remove('shake');
  // إعادة تشغيل الأنيميشن
  void passwordInput.offsetWidth;
  passwordInput.classList.add('shake');
}

function hideLoginError() {
  loginError.classList.remove('show');
  loginError.textContent = '';
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = passwordInput.value.trim();
  const correct = getStoredPassword();

  if (value === correct) {
    hideLoginError();
    unlockSequence();
  } else {
    showLoginError(CONFIG.WRONG_PASSWORD_TEXT);
    passwordInput.value = '';
    passwordInput.focus();
  }
});

function unlockSequence() {
  heartLockWrap.classList.add('unlocking');
  launchConfetti();

  setTimeout(() => {
    loginScreen.classList.add('fade-out');

    setTimeout(() => {
      loginScreen.hidden = true;
      contentScreen.hidden = false;
      // إجبار إعادة التدفق قبل إضافة كلاس الظهور لضمان التحول السلس
      void contentScreen.offsetWidth;
      contentScreen.classList.add('show');

      startAfterUnlockExperience();
    }, 700);
  }, CONFIG.UNLOCK_ANIMATION_MS);
}

function startAfterUnlockExperience() {
  showWelcomeToast();
  typeWriter(heroTitle, CONFIG.HERO_TEXT, CONFIG.TYPEWRITER_SPEED_HERO, () => {
    heroCursor.classList.add('hide');
  });
  startCountdown();
  renderGallery();
  attemptAutoplayMusic();
  initRevealObserver();
}

/* =====================================================================
   2) رسالة الترحيب (Toast)
   ===================================================================== */
function showWelcomeToast() {
  welcomeToast.textContent = CONFIG.WELCOME_TOAST_TEXT;
  welcomeToast.classList.add('show');
  setTimeout(() => {
    welcomeToast.classList.remove('show');
  }, 3200);
}

/* =====================================================================
   3) تأثير الكتابة حرفًا حرفًا
   ===================================================================== */
function typeWriter(element, text, speed, onDone) {
  element.textContent = '';
  if (reducedMotion) {
    element.textContent = text;
    if (onDone) onDone();
    return;
  }
  let i = 0;
  (function step() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(step, speed);
    } else if (onDone) {
      onDone();
    }
  })();
}

/* =====================================================================
   3ب) عرض الرسائل الرومانسية واحدة ورا التانية
   ===================================================================== */
let letterMessagesStarted = false;

function startLetterMessages() {
  if (letterMessagesStarted) return;
  letterMessagesStarted = true;

  const messages = CONFIG.LETTER_MESSAGES;
  let index = 0;

  function showNextMessage() {
    if (index >= messages.length) return;

    if (index > 0) {
      const divider = document.createElement('div');
      divider.className = 'letter-divider';
      divider.textContent = '❤';
      divider.setAttribute('aria-hidden', 'true');
      letterMessagesEl.appendChild(divider);
    }

    const p = document.createElement('p');
    p.className = 'letter-message';
    letterMessagesEl.appendChild(p);

    typeWriter(p, messages[index], CONFIG.TYPEWRITER_SPEED_LETTER, () => {
      p.classList.add('glow-active');
      index++;
      setTimeout(showNextMessage, CONFIG.LETTER_MESSAGE_DELAY);
    });
  }

  showNextMessage();
}

/* =====================================================================
   3ج) ظهور الأقسام تدريجيًا عند التمرير (Scroll Reveal)
   ===================================================================== */
function initRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    // دعم للمتصفحات القديمة: اظهري كل شيء مباشرة
    revealSections.forEach((el) => el.classList.add('in-view'));
    startLetterMessages();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (entry.target === letterSection) {
            startLetterMessages();
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  revealSections.forEach((el) => observer.observe(el));
}

/* =====================================================================
   4) العداد (منذ تاريخ معين)
   ===================================================================== */
function startCountdown() {
  function update() {
    const now = new Date();
    let diffMs = now - CONFIG.COUNTDOWN_START_DATE;
    if (diffMs < 0) diffMs = 0;

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    cdDays.textContent = days.toLocaleString('ar-EG');
    cdHours.textContent = hours.toLocaleString('ar-EG');
    cdMinutes.textContent = minutes.toLocaleString('ar-EG');
  }
  update();
  setInterval(update, 1000); // تحديث كل ثانية عشان العداد يحس إنه شغال وبيزيد قدامك أول بأول
}

/* =====================================================================
   5) معرض الصور (رفع + حفظ في localStorage)
   ===================================================================== */
function getStoredPhotos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePhotos(photos) {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    return true;
  } catch (err) {
    console.error('تعذر حفظ الصور:', err);
    galleryHint.textContent = 'المساحة المخصصة للحفظ ممتلئة، جرّبي حذف بعض الصور القديمة.';
    return false;
  }
}

function renderGallery() {
  const photos = getStoredPhotos();
  galleryGrid.innerHTML = '';

  if (photos.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = 'لا توجد صور بعد... أضيفي أول ذكرى لكما 📸';
    galleryGrid.appendChild(empty);
    return;
  }

  photos.forEach((photo) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = 'ذكرى مصورة';
    img.loading = 'lazy';

    const delBtn = document.createElement('button');
    delBtn.className = 'gallery-delete';
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', 'حذف الصورة');
    delBtn.textContent = '×';
    delBtn.addEventListener('click', () => deletePhoto(photo.id));

    item.appendChild(img);
    item.appendChild(delBtn);
    galleryGrid.appendChild(item);
  });
}

function deletePhoto(id) {
  const photos = getStoredPhotos().filter((p) => p.id !== id);
  savePhotos(photos);
  renderGallery();
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذرت قراءة الملف'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('تعذر تحميل الصورة'));
      img.onload = () => {
        let { width, height } = img;
        const max = CONFIG.MAX_IMAGE_DIMENSION;
        if (width > max || height > max) {
          if (width > height) {
            height = Math.round(height * (max / width));
            width = max;
          } else {
            width = Math.round(width * (max / height));
            height = max;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', CONFIG.IMAGE_QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

photoUpload.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  galleryHint.textContent = 'جاري إضافة الصور...';
  const photos = getStoredPhotos();

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    try {
      const dataUrl = await resizeImageFile(file);
      photos.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, src: dataUrl });
    } catch (err) {
      console.error(err);
    }
  }

  const ok = savePhotos(photos);
  if (ok) galleryHint.textContent = 'الصور تُحفظ في هذا المتصفح فقط';
  renderGallery();
  photoUpload.value = '';
});

/* =====================================================================
   6) الموسيقى
   ===================================================================== */
function attemptAutoplayMusic() {
  const playPromise = bgMusic.play();
  if (playPromise && playPromise.then) {
    playPromise
      .then(() => setMusicButtonState(true))
      .catch(() => setMusicButtonState(false)); // بعض المتصفحات تمنع التشغيل التلقائي
  }
}

function setMusicButtonState(isPlaying) {
  musicToggle.classList.toggle('playing', isPlaying);
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
}

musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => setMusicButtonState(true)).catch(() => {});
  } else {
    bgMusic.pause();
    setMusicButtonState(false);
  }
});

/* =====================================================================
   7) تغيير كلمة السر
   ===================================================================== */
function openSettingsModal() {
  settingsModal.hidden = false;
  void settingsModal.offsetWidth;
  settingsModal.classList.add('show');
  settingsMessage.textContent = '';
  settingsMessage.className = 'settings-message';
  passwordForm.reset();
  currentPasswordInput.focus();
}

function closeSettingsModal() {
  settingsModal.classList.remove('show');
  setTimeout(() => { settingsModal.hidden = true; }, 350);
}

settingsToggle.addEventListener('click', openSettingsModal);
modalCloseBtn.addEventListener('click', closeSettingsModal);
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) closeSettingsModal();
});

passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const current = currentPasswordInput.value;
  const next = newPasswordInput.value;
  const confirm = confirmPasswordInput.value;

  if (current !== getStoredPassword()) {
    settingsMessage.textContent = 'كلمة السر الحالية غير صحيحة';
    settingsMessage.className = 'settings-message error';
    return;
  }
  if (next.length < 4) {
    settingsMessage.textContent = 'يجب ألا تقل كلمة السر الجديدة عن 4 خانات';
    settingsMessage.className = 'settings-message error';
    return;
  }
  if (next !== confirm) {
    settingsMessage.textContent = 'كلمتا السر الجديدتان غير متطابقتين';
    settingsMessage.className = 'settings-message error';
    return;
  }

  localStorage.setItem(STORAGE_KEYS.PASSWORD, next);
  settingsMessage.textContent = 'تم تغيير كلمة السر بنجاح 💕';
  settingsMessage.className = 'settings-message success';
  setTimeout(closeSettingsModal, 1400);
});

/* =====================================================================
   8) القلوب العائمة في الخلفية
   ===================================================================== */
function spawnFloatingHeart() {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > 0.5 ? '❤' : '💗';

  const left = Math.random() * 100;
  const size = 0.9 + Math.random() * 1.6;
  const duration = 7 + Math.random() * 8;
  const drift = (Math.random() * 160 - 80) + 'px';

  heart.style.left = `${left}%`;
  heart.style.fontSize = `${size}rem`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.setProperty('--drift', drift);

  heart.addEventListener('animationend', () => heart.remove());
  heartsBg.appendChild(heart);
}

function startHeartsLoop() {
  const interval = reducedMotion ? 4000 : 1100;
  spawnFloatingHeart();
  setInterval(spawnFloatingHeart, interval);
}

/* =====================================================================
   9) تأثير الكونفيتي
   ===================================================================== */
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiRunning = false;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

const CONFETTI_COLORS = ['#ff5da2', '#ff1744', '#fff6f8', '#ff2f6e', '#ffb3d1'];

function launchConfetti() {
  if (reducedMotion) return;

  const count = 140;
  confettiParticles = Array.from({ length: count }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * confettiCanvas.height * 0.3,
    size: 5 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    speedY: 2 + Math.random() * 3,
    speedX: (Math.random() - 0.5) * 2.4,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
    life: 0,
    maxLife: 260 + Math.random() * 80,
  }));

  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(confettiTick);
  }
}

function confettiTick() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let active = 0;
  for (const p of confettiParticles) {
    if (p.life >= p.maxLife) continue;
    active++;
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    p.life++;

    const fadeStart = p.maxLife - 40;
    const alpha = p.life > fadeStart ? Math.max(0, 1 - (p.life - fadeStart) / 40) : 1;

    confettiCtx.save();
    confettiCtx.globalAlpha = alpha;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;

    if (p.shape === 'circle') {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    } else {
      confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    confettiCtx.restore();
  }

  if (active > 0) {
    requestAnimationFrame(confettiTick);
  } else {
    confettiRunning = false;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* =====================================================================
   تهيئة أولية
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // تأكيد وجود كلمة سر مخزّنة (تُستخدم القيمة الافتراضية أول مرة فقط)
  if (!localStorage.getItem(STORAGE_KEYS.PASSWORD)) {
    localStorage.setItem(STORAGE_KEYS.PASSWORD, CONFIG.DEFAULT_PASSWORD);
  }
  startHeartsLoop();
  passwordInput.focus();
});