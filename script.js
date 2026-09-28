/**
 * ========================================================
 * TẾT 2027 - HỒ SƠ TÌNH BẠN DIỆU KỲ
 * STORY MODE: ZERO-SCROLL • PROFILES CHO THẢO & THANH
 * BẢO MẬT TÊN (KHÔNG TIẾT LỘ ĐỂ TRÁNH DÒ TÊN)
 * ========================================================
 */

// ==================== CẤU HÌNH LÌ XÌ MOMO ====================
const CONFIG = {
  MOMO_LINK: "https://momo.vn",
  MOMO_QR_IMAGE: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fmomo.vn"
};

// ==================== HỒ SƠ RIÊNG BIỆT: THẢO & THANH ====================
const PROFILES = {
  thao: {
    key: "thao",
    name: "Thảo",
    fullName: "Thảo 🌸",
    avatar: "🌸",
    scanTag: "MÀN 2: QUÉT DỮ LIỆU CỦA THẢO",
    stats: {
      photo: { val: "2 TẤM", sub: "Do tao lười giơ máy thôi chứ mày lúc nào cũng xinh! 🌸" },
      eating: { val: "N CUỘC", sub: "Kèo ăn uống đếm không xuể, rủ là có mặt chiến tới bến! 🤤🔥" },
      msg: { val: "999+ TIN", sub: "Nhắn tin thâu đêm suốt sáng, buôn mòn màn hình! 💬🔥" },
      score: { val: "100 / 100", sub: "Tình bạn 10 điểm không có nhưng, luôn luôn tuyệt vời! 💖✨" }
    },
    letterTitle: "Thân Gửi Thảo! 🌸",
    letterBody: `
      <p><strong>Thân gửi Thảo,</strong></p>
      <p>Năm qua tuy hai đứa nhắn với nhau <strong>999+ tin</strong>, đi ăn cùng nhau <strong>N cuộc kèo</strong>... Cảm ơn mày vì luôn là một đứa bạn tuyệt vời!</p>
      <p>Năm mới 2027 chúc Thảo lúc nào cũng rạng rỡ xinh đẹp, tiền vào như thác lũ, việc gì cũng hanh thông và chuẩn bị tinh thần đi ăn tiếp kèo N+1 nhé! 🌸</p>
    `,
    voucherHeader: "VOUCHER ĐỘC QUYỀN CHO THẢO",
    voucherName: "🎟️ Bao Ăn Kèo Thứ N+1 (Free 100%)"
  },
  thanh: {
    key: "thanh",
    name: "Thanh",
    fullName: "Thanh ✨",
    avatar: "✨",
    scanTag: "MÀN 2: QUÉT DỮ LIỆU CỦA THANH",
    stats: {
      photo: { val: "0 TẤM", sub: "Tìm mỏi mắt không ra, ngỡ đâu đặc vụ ngầm FBI! 🕵️‍♀️" },
      eating: { val: "02 LẦN", sub: "Đếm 1 bàn tay mà vẫn còn thừa 3 ngón! 🤤" },
      msg: { val: "0+ TIN", sub: "Giao tiếp bằng thần giao cách cảm là chính 🧠" },
      score: { val: "3 / 100", sub: "Tình bạn mong manh như sợi bún nhưng vẫn làm web tặng Tết 🤡❤️" }
    },
    letterTitle: "Thân Gửi Thanh! ✨",
    letterBody: `
      <p><strong>Thân gửi Thanh,</strong></p>
      <p>Tuy một năm qua đi ăn được đúng <strong>2 lần</strong>, ảnh chung <strong>0 tấm</strong>, tin nhắn <strong>0+ tin</strong> và độ thân thiết <strong>3/100</strong>... nhưng tao luôn rất trân trọng tình bạn này!</p>
      <p>Năm mới 2027 chúc Thanh luôn bình an, mạnh khỏe, visual đỉnh chóp và đạt được tất cả những gì mong ước nhé! 🌸</p>
    `,
    voucherHeader: "VOUCHER ĐỘC QUYỀN CHO THANH",
    voucherName: "🎟️ Bao Ăn Chầu Thứ 3 (Free 100%)"
  }
};

let activeProfile = PROFILES.thao;

// ==================== HÀM CHUẨN HÓA VÀ NHẬN DIỆN TÊN ====================
// Xử lý không phân biệt hoa thường, có dấu hay không dấu: Thanh, thanh, tHanh, THANH, Thảo, thảo, tHao, THẢO...
function normalizeText(str) {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // gỡ bỏ toàn bộ dấu tiếng Việt
}

function detectProfileFromInput(inputStr) {
  const norm = normalizeText(inputStr);
  if (norm.includes("thanh")) {
    return "thanh";
  }
  if (norm.includes("thao")) {
    return "thao";
  }
  return null;
}

// ==================== ÂM THANH WEB AUDIO SYNTHESIZER ====================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientInterval = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  }

  unlock() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop(freq = 560) {
    if (this.isMuted || !this.ctx) return;
    this.unlock();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.07);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  playWarning() {
    if (this.isMuted || !this.ctx) return;
    this.unlock();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(180, now + 0.1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playRadarBeep() {
    if (this.isMuted || !this.ctx) return;
    this.unlock();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playWheelTick() {
    if (this.isMuted || !this.ctx) return;
    this.unlock();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  playScratch() {
    if (this.isMuted || !this.ctx) return;
    this.unlock();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200 + Math.random() * 150, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playFanfare() {
    if (this.isMuted || !this.ctx) return;
    this.unlock();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    });
  }

  toggleAmbient(enable) {
    if (!enable) {
      if (this.ambientInterval) {
        clearInterval(this.ambientInterval);
        this.ambientInterval = null;
      }
      return;
    }

    if (this.ambientInterval) return;
    const scale = [392, 440, 523.25, 587.33, 659.25, 783.99];
    let noteIdx = 0;

    this.ambientInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      this.unlock();
      const now = this.ctx.currentTime;
      const freq = scale[noteIdx % scale.length];
      noteIdx += (Math.random() > 0.5 ? 1 : 2);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    }, 750);
  }
}

const sounds = new SoundFX();

// ==================== CÁNH HOA CANVAS 60FPS ====================
class FallingPetals {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    const count = window.innerWidth < 600 ? 20 : 35;
    for (let i = 0; i < count; i++) {
      this.petals.push(this.spawn(true));
    }
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  spawn(randomY = false) {
    const isPeach = Math.random() > 0.45;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -15,
      size: 6 + Math.random() * 8,
      speedY: 1.1 + Math.random() * 1.5,
      speedX: -0.4 + Math.random() * 0.9,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      color: isPeach ? 'rgba(255, 182, 193, 0.75)' : 'rgba(255, 215, 64, 0.75)',
      sway: Math.random() * Math.PI * 2
    };
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let p of this.petals) {
      p.y += p.speedY;
      p.sway += 0.02;
      p.x += Math.sin(p.sway) * 0.7 + p.speedX;
      p.rotation += p.rotSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      if (p.y > this.height + 15 || p.x < -20 || p.x > this.width + 20) {
        Object.assign(p, this.spawn(false));
      }
    }
    requestAnimationFrame(() => this.loop());
  }
}

// ==================== CONFETTI ENGINE ====================
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#ffd152', '#ff1744', '#ff4081', '#00e676', '#ffeb3b', '#fff'];
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  blast(x, y, count = 45) {
    sounds.playFanfare();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 5 + Math.random() * 5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        alpha: 1,
        life: 0.96
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.alpha *= p.life;

      if (p.alpha <= 0.02 || p.y > this.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }
    requestAnimationFrame(() => this.loop());
  }
}

// ==================== APP CONTROLLER ====================
document.addEventListener('DOMContentLoaded', () => {
  const petals = new FallingPetals('petal-canvas');
  const confetti = new ConfettiEngine('confetti-canvas');

  // Input & Dialogue Elements
  const userNameInput = document.getElementById('user-name-input');
  const nameErrorMsg = document.getElementById('name-error-msg');
  const scanTargetTag = document.getElementById('scan-target-tag');

  // Stats Elements
  const statValPhoto = document.getElementById('stat-val-photo');
  const statSubPhoto = document.getElementById('stat-sub-photo');
  const statValEating = document.getElementById('stat-val-eating');
  const statSubEating = document.getElementById('stat-sub-eating');
  const statValMsg = document.getElementById('stat-val-msg');
  const statSubMsg = document.getElementById('stat-sub-msg');
  const statValScore = document.getElementById('stat-val-score');
  const statSubScore = document.getElementById('stat-sub-score');

  // Letter & Voucher Elements
  const letterTitleText = document.getElementById('letter-title-text');
  const letterBodyText = document.getElementById('letter-body-text');
  const voucherHeaderText = document.getElementById('voucher-header-text');
  const voucherNameText = document.getElementById('voucher-name-text');

  // MoMo elements
  const btnMomoAction = document.getElementById('btn-momo-action');
  if (btnMomoAction) btnMomoAction.href = CONFIG.MOMO_LINK;
  const momoQrImage = document.getElementById('momo-qr-image');
  if (momoQrImage) momoQrImage.src = CONFIG.MOMO_QR_IMAGE;

  // ==================== HÀM ÁP DỤNG HỒ SƠ ====================
  function applyProfile(profileKey) {
    const prof = PROFILES[profileKey] || PROFILES.thao;
    activeProfile = prof;

    // Screen 1 Scanner & Stats
    scanTargetTag.textContent = prof.scanTag;
    statValPhoto.textContent = prof.stats.photo.val;
    statSubPhoto.textContent = prof.stats.photo.sub;
    statValEating.textContent = prof.stats.eating.val;
    statSubEating.textContent = prof.stats.eating.sub;
    statValMsg.textContent = prof.stats.msg.val;
    statSubMsg.textContent = prof.stats.msg.sub;
    statValScore.textContent = prof.stats.score.val;
    statSubScore.textContent = prof.stats.score.sub;

    // Screen 3 Letter & Voucher
    letterTitleText.textContent = prof.letterTitle;
    letterBodyText.innerHTML = prof.letterBody;
    voucherHeaderText.textContent = prof.voucherHeader;
    voucherNameText.textContent = prof.voucherName;
  }

  // Khởi tạo từ URL param nếu có link gửi riêng (?ten=thao hoặc ?ten=thanh)
  const urlParams = new URLSearchParams(window.location.search);
  const paramRaw = urlParams.get('ten') || urlParams.get('to') || '';
  const detectedParam = detectProfileFromInput(paramRaw);

  if (detectedParam) {
    userNameInput.value = PROFILES[detectedParam].name;
    applyProfile(detectedParam);
  }

  // Xóa báo lỗi khi người dùng gõ
  userNameInput.addEventListener('input', () => {
    nameErrorMsg.classList.add('hidden');
    // KHÔNG hiển thị trước tên hay cập nhật dialogue để tránh bị dò tên!
  });

  // ==================== STORY SCREEN MANAGER ====================
  let currentScreen = 0;
  const totalScreens = 4;
  const screens = [
    document.getElementById('screen-0'),
    document.getElementById('screen-1'),
    document.getElementById('screen-2'),
    document.getElementById('screen-3')
  ];
  const progressSegments = document.querySelectorAll('.progress-segment');
  const stepBadge = document.getElementById('step-badge');

  function goToScreen(index) {
    if (index < 0 || index >= totalScreens) return;
    sounds.playPop();

    screens.forEach((s, idx) => {
      s.classList.remove('active', 'prev');
      if (idx < index) s.classList.add('prev');
      if (idx === index) s.classList.add('active');
    });

    currentScreen = index;
    stepBadge.textContent = `MÀN ${currentScreen + 1}/${totalScreens}`;

    progressSegments.forEach((seg, idx) => {
      if (idx <= currentScreen) {
        seg.classList.add('active');
      } else {
        seg.classList.remove('active');
      }
    });

    if (currentScreen === 2) {
      initWheel();
    } else if (currentScreen === 3) {
      initScratchCard();
    }
  }

  // ==================== ÂM THANH TOGGLE ====================
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const diskIcon = document.getElementById('disk-icon');
  let isMusicPlaying = false;

  musicToggleBtn.addEventListener('click', () => {
    sounds.unlock();
    isMusicPlaying = !isMusicPlaying;
    if (isMusicPlaying) {
      diskIcon.classList.remove('paused');
      sounds.isMuted = false;
      sounds.toggleAmbient(true);
      sounds.playPop();
    } else {
      diskIcon.classList.add('paused');
      sounds.isMuted = true;
      sounds.toggleAmbient(false);
    }
  });

  const unlockTouch = () => {
    sounds.unlock();
    window.removeEventListener('click', unlockTouch);
    window.removeEventListener('touchstart', unlockTouch);
  };
  window.addEventListener('click', unlockTouch, { once: true });
  window.addEventListener('touchstart', unlockTouch, { once: true });

  // ==================== SCREEN 0: BẮT ĐẦU (VALIDATE TÊN BẢO MẬT) ====================
  const btnStartStory = document.getElementById('btn-start-story');

  btnStartStory.addEventListener('click', () => {
    const rawVal = userNameInput.value.trim();
    const matched = detectProfileFromInput(rawVal);

    if (!matched) {
      // Báo lỗi ngắn gọn, KHÔNG tiết lộ tên để chống dò tên
      sounds.playWarning();
      nameErrorMsg.textContent = "⚠️ Ủa ai zị, không đúng r má ơi!";
      nameErrorMsg.classList.remove('hidden');
      userNameInput.focus();
      return;
    }

    nameErrorMsg.classList.add('hidden');
    applyProfile(matched);
    resetWheelState();
    goToScreen(1);
  });

  userNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnStartStory.click();
    }
  });

  // ==================== SCREEN 1: MÁY QUÉT VÂN TAY (TOUCH & HOLD) ====================
  const fpBtn = document.getElementById('fingerprint-btn');
  const scannerPadArea = document.getElementById('scanner-pad-area');
  const fpStatusText = document.getElementById('fp-status-text');
  const revealedDashboard = document.getElementById('revealed-dashboard');
  const btnToWheel = document.getElementById('btn-to-wheel');

  let scanHoldTimer = null;
  let scanInterval = null;
  let isScanCompleted = false;

  function startScanning(e) {
    if (isScanCompleted) return;
    if (e.cancelable) e.preventDefault();
    sounds.unlock();

    scannerPadArea.classList.add('scanning');
    fpStatusText.innerHTML = `<span style="color: #ffeb3b;">⚡ ĐANG QUÉT DỮ LIỆU CỦA ${activeProfile.name.toUpperCase()}...</span>`;

    if (navigator.vibrate) {
      navigator.vibrate([60, 40, 60, 40, 100]);
    }

    scanInterval = setInterval(() => {
      sounds.playRadarBeep();
      if (navigator.vibrate) navigator.vibrate(40);
    }, 120);

    scanHoldTimer = setTimeout(() => {
      completeScan();
    }, 1400);
  }

  function stopScanning() {
    if (isScanCompleted) return;
    scannerPadArea.classList.remove('scanning');
    clearTimeout(scanHoldTimer);
    clearInterval(scanInterval);
    fpStatusText.innerHTML = `<strong>ĐẶT VÀ GIỮ NGÓN TAY</strong><br>vào vòng tròn để quét dữ liệu`;
  }

  function completeScan() {
    isScanCompleted = true;
    clearInterval(scanInterval);
    scannerPadArea.classList.remove('scanning');

    scannerPadArea.style.display = 'none';
    revealedDashboard.classList.remove('hidden');

    const boxes = [
      document.getElementById('spin-box-1'),
      document.getElementById('spin-box-2'),
      document.getElementById('spin-box-3'),
      document.getElementById('spin-box-4')
    ];

    boxes.forEach((box, idx) => {
      setTimeout(() => {
        box.classList.add('spinning');
        sounds.playRadarBeep();
        if (navigator.vibrate) navigator.vibrate(60);

        if (idx === boxes.length - 1) {
          setTimeout(() => {
            confetti.blast(window.innerWidth / 2, window.innerHeight * 0.45, 50);
          }, 1100);
        }
      }, idx * 240);
    });
  }

  fpBtn.addEventListener('mousedown', startScanning);
  fpBtn.addEventListener('touchstart', startScanning, { passive: false });
  window.addEventListener('mouseup', stopScanning);
  window.addEventListener('touchend', stopScanning);

  btnToWheel.addEventListener('click', () => {
    goToScreen(2);
  });

  // ==================== SCREEN 2: VÒNG XOAY MAY MẮN (CANVAS) & POPUP TRÚNG THƯỞNG ====================
  const wheelCanvas = document.getElementById('wheel-canvas');
  const wheelCtx = wheelCanvas.getContext('2d');
  const wheelCenterBtn = document.getElementById('wheel-center-btn');
  const wheelResultBanner = document.getElementById('wheel-result-banner');
  const btnToGift = document.getElementById('btn-to-gift');

  // Popup Trúng Thưởng Elements
  const prizeModal = document.getElementById('prize-modal');
  const popupPrizeTitle = document.getElementById('popup-prize-title');
  const popupPrizeDesc = document.getElementById('popup-prize-desc');
  const btnPrizeProceed = document.getElementById('btn-prize-proceed');
  const btnPrizeRetry = document.getElementById('btn-prize-retry');

  const slices = [
    {
      text: "Bao 1 chầu trà sữa 🧋",
      color: "#e91e63",
      des: "Đặc quyền VIP Tết 2027: Được bạn thân bao trọn gói 01 ly trà sữa size L, full topping, 100% đường 100% đá (hoặc tùy chọn). Hạn dùng: Ngay khi rủ là phải đi!"
    },
    {
      text: "Visual thăng hạng 🌸",
      color: "#9c27b0",
      des: "Vận may sắc đẹp nở rộ! Năm mới da dẻ mịn màng, visual đỉnh nóc kịch trần, ăn thả ga không lo tăng cân, bước chân ra ngõ ai cũng ngoái nhìn khen tấm tắc!"
    },
    {
      text: "Đi ăn chầu thứ 3 🍜",
      color: "#f44336",
      des: "Chỉ tiêu bắt buộc năm mới: Hai đứa nhất định phải xách xe đi ăn chầu thứ 3 để phá vỡ kỷ lục 2 lần của năm cũ. Bất kỳ ai bùng kèo sẽ bị phạt bao trọn gói!"
    },
    {
      text: "Tiền vào như nước 💰",
      color: "#ff9800",
      des: "Ví tiền phồng to, tài khoản nổ ting ting liên tục, thưởng Tết ngập tràn! Lời khuyên phong thủy: Nhớ trích 10% hoa hồng mời bạn thân đi ăn để lộc lá duy trì cả năm!"
    },
    {
      text: "Vé tâm sự không quạu 💬",
      color: "#2196f3",
      des: "Vé bảo hiểm tinh thần trọn đời: Được quyền nhắn tin hoặc gọi điện xàm xí, than thở thâu đêm suốt sáng mà đối phương không được phép cúp máy hay quạu quọ!"
    },
    {
      text: "Lì xì lộc lá đầu năm 🧧",
      color: "#4caf50",
      des: "Nhận ngay vía tài lộc may mắn từ vũ trụ và bạn thân! Hãy bấm sang màn tiếp theo và cào phong bao lì xì để mở bức thư cùng lộc MoMo may mắn nhé!"
    }
  ];

  let currentWheelAngle = 0;
  let isWheelSpinning = false;
  let lastWonSlice = null;

  function resetWheelState() {
    currentWheelAngle = 0;
    isWheelSpinning = false;
    lastWonSlice = null;
    wheelResultBanner.innerHTML = `<p class="wheel-tip">👇 Bấm nút <strong>QUAY!</strong> ở giữa vòng tròn</p>`;
    btnToGift.style.display = 'none';
    btnToGift.disabled = true;
    prizeModal.classList.add('hidden');
    drawWheel(0);
  }

  function initWheel() {
    if (!lastWonSlice) {
      resetWheelState();
    } else {
      drawWheel(currentWheelAngle);
    }
  }

  function drawWheel(angle) {
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 8;
    const sliceAngle = (Math.PI * 2) / slices.length;

    wheelCtx.clearRect(0, 0, size, size);

    slices.forEach((slice, i) => {
      const startAngle = angle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      wheelCtx.beginPath();
      wheelCtx.moveTo(center, center);
      wheelCtx.arc(center, center, radius, startAngle, endAngle);
      wheelCtx.closePath();
      wheelCtx.fillStyle = slice.color;
      wheelCtx.fill();
      wheelCtx.strokeStyle = "#ffd152";
      wheelCtx.lineWidth = 3;
      wheelCtx.stroke();

      wheelCtx.save();
      wheelCtx.translate(center, center);
      wheelCtx.rotate(startAngle + sliceAngle / 2);
      wheelCtx.textAlign = "right";
      wheelCtx.fillStyle = "#fff";
      wheelCtx.font = "bold 13px 'Montserrat', sans-serif";
      wheelCtx.fillText(slice.text, radius - 15, 5);
      wheelCtx.restore();
    });
  }

  function spinWheel() {
    if (isWheelSpinning) return;
    isWheelSpinning = true;
    btnToGift.disabled = true;

    const extraRounds = 5 + Math.floor(Math.random() * 3);
    const targetSliceIndex = Math.floor(Math.random() * slices.length);
    const sliceAngle = (Math.PI * 2) / slices.length;

    const targetAngle = extraRounds * Math.PI * 2 + (slices.length - targetSliceIndex - 0.5) * sliceAngle - Math.PI / 2;

    const startAngle = currentWheelAngle;
    const totalRotation = targetAngle - startAngle;
    const duration = 3800;
    const startTime = performance.now();

    let lastTickAngle = startAngle;

    function animateWheel(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const angle = startAngle + totalRotation * easeOut;

      drawWheel(angle);

      if (Math.abs(angle - lastTickAngle) > sliceAngle * 0.8) {
        sounds.playWheelTick();
        if (navigator.vibrate) navigator.vibrate(15);
        lastTickAngle = angle;
      }

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        currentWheelAngle = angle % (Math.PI * 2);
        isWheelSpinning = false;

        const wonSlice = slices[targetSliceIndex];
        lastWonSlice = wonSlice;

        wheelResultBanner.innerHTML = `<p class="wheel-prize-text">🎉 Trúng: <strong>${wonSlice.text}</strong>! (Bấm xem chi tiết)</p>`;
        btnToGift.disabled = false;

        popupPrizeTitle.textContent = wonSlice.text;
        popupPrizeDesc.textContent = wonSlice.des;
        prizeModal.classList.remove('hidden');

        confetti.blast(window.innerWidth / 2, window.innerHeight * 0.45, 60);
      }
    }

    requestAnimationFrame(animateWheel);
  }

  wheelCenterBtn.addEventListener('click', spinWheel);

  wheelResultBanner.addEventListener('click', () => {
    if (lastWonSlice) {
      popupPrizeTitle.textContent = lastWonSlice.text;
      popupPrizeDesc.textContent = lastWonSlice.des;
      prizeModal.classList.remove('hidden');
    }
  });

  btnPrizeProceed.addEventListener('click', () => {
    sounds.playPop();
    prizeModal.classList.add('hidden');
    goToScreen(3);
  });

  btnPrizeRetry.addEventListener('click', () => {
    sounds.playPop();
    prizeModal.classList.add('hidden');
    resetWheelState();
  });

  btnToGift.addEventListener('click', () => {
    goToScreen(3);
  });

  // ==================== SCREEN 3: THẺ CÀO LÌ XÌ BẰNG TAY (SCRATCH CARD) ====================
  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchCtx = scratchCanvas.getContext('2d');
  const scratchContainer = document.getElementById('scratch-container');
  const scratchPercentEl = document.getElementById('scratch-percent');
  const scratchStatusBar = document.getElementById('scratch-status-bar');

  let isScratching = false;
  let isCardCleared = false;

  function initScratchCard() {
    const rect = scratchContainer.getBoundingClientRect();
    scratchCanvas.width = rect.width;
    scratchCanvas.height = rect.height;

    const grad = scratchCtx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#ffd152');
    grad.addColorStop(0.5, '#f39c12');
    grad.addColorStop(1, '#ffb703');
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, rect.width, rect.height);

    scratchCtx.fillStyle = '#b71c1c';
    scratchCtx.font = "900 24px 'Montserrat', sans-serif";
    scratchCtx.textAlign = "center";
    scratchCtx.fillText("🧧 CÀO TẠI ĐÂY 🧧", rect.width / 2, rect.height / 2 - 15);

    scratchCtx.fillStyle = '#7a0000';
    scratchCtx.font = "bold 13px 'Mali', cursive";
    scratchCtx.fillText(`Di tay cào mở quà của ${activeProfile.name}!`, rect.width / 2, rect.height / 2 + 18);
  }

  function scratch(e) {
    if (!isScratching || isCardCleared) return;
    if (e.cancelable) e.preventDefault();

    const rect = scratchCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 26, 0, Math.PI * 2);
    scratchCtx.fill();

    sounds.playScratch();
    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (isCardCleared) return;
    const w = scratchCanvas.width;
    const h = scratchCanvas.height;
    const imgData = scratchCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentCount = 0;
    const totalSampled = data.length / 16;

    for (let i = 3; i < data.length; i += 16) {
      if (data[i] === 0) transparentCount++;
    }

    const percent = Math.round((transparentCount / totalSampled) * 100);
    scratchPercentEl.textContent = `${percent}%`;

    if (percent > 40) {
      isCardCleared = true;
      scratchCanvas.style.transition = 'opacity 0.6s ease';
      scratchCanvas.style.opacity = '0';
      setTimeout(() => {
        scratchCanvas.style.display = 'none';
      }, 600);

      scratchStatusBar.innerHTML = `🎉 <strong>ĐÃ MỞ BUNG LÌ XÌ & BỨC THƯ CỦA ${activeProfile.name.toUpperCase()}!</strong>`;
      confetti.blast(window.innerWidth / 2, window.innerHeight * 0.5, 70);
    }
  }

  scratchCanvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
  scratchCanvas.addEventListener('mousemove', scratch);
  window.addEventListener('mouseup', () => { isScratching = false; });

  scratchCanvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: false });
  scratchCanvas.addEventListener('touchmove', scratch, { passive: false });
  window.addEventListener('touchend', () => { isScratching = false; });

  // ==================== POPUP MÃ QR ====================
  const btnQrPopup = document.getElementById('btn-qr-popup');
  const qrModal = document.getElementById('qr-modal');
  const btnCloseQr = document.getElementById('btn-close-qr');

  btnQrPopup.addEventListener('click', () => {
    sounds.playPop();
    qrModal.classList.remove('hidden');
  });

  btnCloseQr.addEventListener('click', () => {
    sounds.playPop();
    qrModal.classList.add('hidden');
  });

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.add('hidden');
  });

  // Nút chơi lại từ đầu / Đổi người
  const btnRestartApp = document.getElementById('btn-restart-app');
  btnRestartApp.addEventListener('click', () => {
    isScanCompleted = false;
    scannerPadArea.style.display = 'flex';
    revealedDashboard.classList.add('hidden');
    document.querySelectorAll('.spin-item-box').forEach(b => b.classList.remove('spinning'));

    resetWheelState();

    isCardCleared = false;
    scratchCanvas.style.display = 'block';
    scratchCanvas.style.opacity = '1';
    scratchPercentEl.textContent = '0%';
    scratchStatusBar.innerHTML = `<span>✨ Tiến độ cào: <strong id="scratch-percent">0%</strong> (Cào > 50% để mở bung)</span>`;

    userNameInput.value = '';
    goToScreen(0);
  });
});
