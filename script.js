// ============================================================
// GIRLFRIEND'S DAY SURPRISE — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. FLOATING BACKGROUND DECOR (hearts, sparkles, flowers)
  --------------------------------------------------------- */
  const bgDecor = document.getElementById('bg-decor');
  const floatEmojis = ['❤️', '💕', '🌸', '✨', '💗'];

  function spawnFloaty() {
    const el = document.createElement('span');
    const isSparkle = Math.random() < 0.35;
    el.className = 'floaty' + (isSparkle ? ' sparkle' : '');
    el.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];

    const startX = Math.random() * 100; // vw
    el.style.left = startX + 'vw';

    const duration = 7 + Math.random() * 6; // 7-13s
    el.style.animationDuration = duration + 's';

    const size = 0.9 + Math.random() * 1.1;
    el.style.fontSize = size + 'rem';

    bgDecor.appendChild(el);

    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  // Seed a few, then keep spawning at an interval (lightweight)
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnFloaty, i * 500);
  }
  setInterval(spawnFloaty, 900);

  /* ---------------------------------------------------------
     2. MUSIC TOGGLE (no autoplay)
  --------------------------------------------------------- */
  const musicBtn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-audio');
  let musicPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (!musicPlaying) {
      audio.play().catch(() => {
        // If the audio file isn't present/allowed, fail silently.
      });
      musicBtn.classList.add('playing');
      musicBtn.textContent = '🎶';
      musicPlaying = true;
    } else {
      audio.pause();
      musicBtn.classList.remove('playing');
      musicBtn.textContent = '🎵';
      musicPlaying = false;
    }
  });

  /* ---------------------------------------------------------
     3. THE ESCAPING "NO" BUTTON
  --------------------------------------------------------- */
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  const buttonRow = document.querySelector('.button-row');
  const page1 = document.getElementById('page1');

  const noMessages = [
    'Are you sure? 🥺',
    'Try again 😭',
    'Nope! 🙈',
    'Nice try! 😂',
    'Think again ❤️',
    'Not allowed 😌',
    'Catch me if you can! 🏃‍♀️'
  ];

  let escapeCount = 0;
  const MAX_SHRINK_STEPS = 5;
  let noEscaping = false; // becomes true once it has moved to fixed positioning

  function randomNoMessage() {
    const msg = noMessages[Math.floor(Math.random() * noMessages.length)];
    noBtn.textContent = msg;
  }

  function moveNoButton() {
    const rect = noBtn.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Keep some padding from viewport edges so it never causes scroll
    const padding = 12;
    const maxX = Math.max(padding, window.innerWidth - w - padding);
    const maxY = Math.max(padding, window.innerHeight - h - padding);

    const newX = padding + Math.random() * (maxX - padding);
    const newY = padding + Math.random() * (maxY - padding);

    if (!noEscaping) {
      // Switch to fixed positioning the first time it escapes
      noBtn.classList.add('escaping');
      noEscaping = true;
    }

    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    randomNoMessage();

    escapeCount++;
    if (escapeCount <= MAX_SHRINK_STEPS) {
      const scale = 1 - escapeCount * 0.06; // gentle shrink, never disappears
      noBtn.style.transform = `scale(${Math.max(scale, 0.72)})`;
    }
  }

  // Desktop: move away when the mouse gets close
  document.addEventListener('mousemove', (e) => {
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    const triggerDistance = 90;
    if (dist < triggerDistance) {
      moveNoButton();
    }
  });

  // Extra safety net: hover / focus / click / touch all trigger an escape
  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('focus', moveNoButton);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // Keep the button inside the viewport if the window is resized
  window.addEventListener('resize', () => {
    if (noEscaping) moveNoButton();
  });

  /* ---------------------------------------------------------
     4. "YES" BUTTON — burst animation + page transition
  --------------------------------------------------------- */
  const burstLayer = document.getElementById('burst-layer');
  const burstEmojis = ['❤️', '💕', '🎉', '✨', '💗', '🧸'];

  function triggerBurst(originX, originY) {
    const pieceCount = 26;
    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement('span');
      piece.className = 'burst-piece';
      piece.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];

      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 220;
      const flyX = Math.cos(angle) * distance;
      const flyY = Math.sin(angle) * distance - 60; // slight upward bias

      piece.style.left = originX + 'px';
      piece.style.top = originY + 'px';
      piece.style.setProperty('--fly-transform', `translate(${flyX}px, ${flyY}px) scale(1.1) rotate(${(Math.random() * 360) | 0}deg)`);
      piece.style.animationDelay = (Math.random() * 0.15) + 's';

      burstLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 1400);
    }
  }

  yesBtn.addEventListener('click', () => {
    const rect = yesBtn.getBoundingClientRect();
    triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

    yesBtn.disabled = true;
    noBtn.style.pointerEvents = 'none';

    setTimeout(goToPage2, 700);
  });

  function goToPage2() {
    page1.classList.add('page-exit');

    setTimeout(() => {
      page1.classList.remove('active', 'page-exit');
      page1.style.display = 'none';

      const page2 = document.getElementById('page2');
      page2.style.display = 'flex';
      page2.classList.add('active', 'page-enter');

      startTypewriter();
    }, 550);
  }

  /* ---------------------------------------------------------
     5. PAGE 2 — TYPEWRITER MESSAGE
  --------------------------------------------------------- */
  const wishMessage =
`Happy Girlfriend's Day to the most special person in my life. ❤️

You make my ordinary days feel a little more special, my smiles a little bigger, and my life a lot more beautiful.

I'm really lucky to have you, and I hope I can keep making you smile just as much as you make me smile.

Today is your day, but honestly... you deserve to be celebrated every single day. 🥺❤️

Happy Girlfriend's Day, my favorite person! 🧸🌸❤️`;

  function startTypewriter() {
    const target = document.getElementById('typewriter-text');
    target.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.innerHTML = '&nbsp;';

    let i = 0;
    const speed = 22; // ms per character — smooth but not too slow

    function typeNext() {
      if (i < wishMessage.length) {
        target.textContent += wishMessage[i];
        i++;
        setTimeout(typeNext, speed);
      } else {
        cursor.remove();
      }
    }

    target.appendChild(cursor);
    typeNext();
  }

});
