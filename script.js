/* ===============================
   GLOBAL
================================ */
let bgMusic;
let musicPlaying = false;

/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-invite");
  const intro = document.getElementById("intro");
  const main = document.getElementById("main");
  bgMusic = document.getElementById("bg-music");

  initSnow();
  initMusicButton();

  openBtn.addEventListener("click", () => {
    intro.style.opacity = "0";

    setTimeout(() => {
      intro.style.display = "none";
      main.classList.add("show");

      bgMusic.volume = 0.5;
      bgMusic.play().then(() => {
        musicPlaying = true;
        updateMusicIcon();
      });

      initSakura();
      initCarousel();
      initLightbox();
      initReveal();
      initCountdown();
    }, 500);
  });
});

/* ===============================
   MUSIC
================================ */
function initMusicButton() {
  const btn = document.getElementById("music-btn");
  const music = document.getElementById("bg-music");

  btn.addEventListener("click", () => {
    if (musicPlaying) {
      music.pause();
    } else {
      music.play();
    }
    musicPlaying = !musicPlaying;
    updateMusicIcon();
  });
}

function updateMusicIcon() {
  document.getElementById("music-btn").innerHTML = musicPlaying
    ? '<i class="fa-solid fa-volume-high"></i>'
    : '<i class="fa-solid fa-volume-xmark"></i>';
}

/* ===============================
   SNOW (INTRO)
================================ */
function initSnow() {
  const canvas = document.getElementById("snow");
  const ctx = canvas.getContext("2d");

  let w, h;
  const flakes = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 100; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      d: Math.random() + 0.5,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();

    flakes.forEach((f) => {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      f.y += f.d;
      if (f.y > h) f.y = 0;
    });

    ctx.fill();
    requestAnimationFrame(draw);
  }

  draw();
}

function loadGuestName() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("to");

  const guestEl = document.getElementById("guestName");

  if (name) {
    guestEl.textContent = decodeURIComponent(name);
  } else {
    guestEl.textContent = "Bạn";
  }
}

loadGuestName();

/* ===============================
   SAKURA
================================ */
function initSakura() {
  const canvas = document.getElementById("sakura");
  const ctx = canvas.getContext("2d");

  let w, h;
  const petals = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 40; i++) {
    petals.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 6 + 4,
      sx: Math.random() * 0.5 - 0.25,
      sy: Math.random() * 1 + 0.5,
      rot: Math.random() * Math.PI,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    petals.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = "rgba(255,182,193,0.85)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.r, -p.r, p.r * 2, 0);
      ctx.quadraticCurveTo(p.r, p.r, 0, 0);
      ctx.fill();
      ctx.restore();

      p.x += p.sx;
      p.y += p.sy;
      p.rot += 0.01;

      if (p.y > h) {
        p.y = -20;
        p.x = Math.random() * w;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ===============================
   CAROUSEL
================================ */
function initCarousel() {
  const images = [
    "images/DH3.jpg",
    "images/DH4.jpg",
    "images/DH5.jpg",
    "images/DH6.jpg",
    "images/DH7.jpg",
    "images/DH8.jpg",
    "images/DH9.jpg",
    "images/DH10.jpg",
    "images/DH11.jpg",
    "images/DH12.jpg",
  ];

  const mainImg = document.querySelector(".image-wrapper img");
  const thumbs = document.querySelectorAll(".thumb:not(.more)");
  const moreBtn = document.querySelector(".thumb.more");

  if (!mainImg) return;

  let index = 0;

  function show(i) {
    index = (i + images.length) % images.length;
    mainImg.src = images[index];

    thumbs.forEach((t) => t.classList.remove("active"));
    thumbs[index]?.classList.add("active");
  }

  thumbs.forEach((t, i) => t.addEventListener("click", () => show(i)));

  /* 👉 CLICK +MORE → MỞ LIGHTBOX */
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      window.__OPEN_LIGHTBOX__(images, index);
    });
  }

  show(0);
}

/* ===============================
   LIGHTBOX (CHỈ ẢNH LỚN)
================================ */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImage");
  const closeBtn = lightbox.querySelector(".close");
  const nextBtn = lightbox.querySelector(".next");
  const prevBtn = lightbox.querySelector(".prev");

  let images = [];
  let current = 0;

  /* 👉 PUBLIC METHOD cho MORE */
  window.__OPEN_LIGHTBOX__ = function (imgs, startIndex = 0) {
    images = imgs;
    current = startIndex;
    img.src = images[current];
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  /* 👉 CLICK ẢNH LỚN */
  const mainImage = document.querySelector(".carousel-main .mainImage");
  if (mainImage) {
    mainImage.addEventListener("click", () => {
      images = [
        "images/DH3.jpg",
        "images/DH4.jpg",
        "images/DH5.jpg",
        "images/DH6.jpg",
        "images/DH7.jpg",
        "images/DH8.jpg",
        "images/DH9.jpg",
        "images/DH10.jpg",
        "images/DH11.jpg",
        "images/DH12.jpg",
      ];
      current = images.indexOf(mainImage.src.split("/").pop());
      img.src = images[current];
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  function close() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn.onclick = close;

  nextBtn.onclick = () => {
    current = (current + 1) % images.length;
    img.src = images[current];
  };

  prevBtn.onclick = () => {
    current = (current - 1 + images.length) % images.length;
    img.src = images[current];
  };

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
  });
}

/* ===============================
   REVEAL
================================ */
function initReveal() {
  const els = document.querySelectorAll(".reveal");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  els.forEach((el) => io.observe(el));
}

/* ===============================
   COUNTDOWN
================================ */
function initCountdown() {
  const target = new Date("2026-01-23T09:00:00+07:00").getTime();

  const d = document.getElementById("days");
  const h = document.getElementById("hours");
  const m = document.getElementById("minutes");
  const s = document.getElementById("seconds");

  setInterval(() => {
    const diff = target - Date.now();
    if (diff <= 0) return;

    d.textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
    h.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, "0");
    m.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, "0");
    s.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, "0");
  }, 1000);
}

/* ===== SCROLL REVEAL ===== */
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

reveals.forEach((el) => observer.observe(el));
