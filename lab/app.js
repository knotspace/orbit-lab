'use strict';

// The public Lab index currently contains only the star field and sound control.
// Keep this entry script limited to those real elements; experiment pages own their
// individual simulation scripts.
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stars = document.getElementById('stars');
if (stars) {
  const ctx = stars.getContext('2d');
  if (ctx) {
    let items = [];
    let frame = 0;
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);
    const paint = (time) => {
      if (document.hidden) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const star of items) {
        ctx.globalAlpha = star.alpha + (reducedMotion ? 0 : Math.sin(time * 0.0007 + star.phase) * 0.1);
        ctx.fillStyle = '#b4c9dc';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const resize = () => {
      const scale = dpr();
      stars.width = Math.round(window.innerWidth * scale);
      stars.height = Math.round(window.innerHeight * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      items = Array.from(
        { length: Math.min(100, Math.floor(window.innerWidth / 10)) },
        () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.1 + 0.2,
          alpha: Math.random() * 0.4 + 0.08,
          phase: Math.random() * 6
        })
      );
      paint(performance.now());
    };
    const animate = (time) => {
      paint(time);
      if (!reducedMotion && !document.hidden) frame = requestAnimationFrame(animate);
    };
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reducedMotion) frame = requestAnimationFrame(animate);
      else if (!document.hidden) paint(performance.now());
    });
    resize();
    if (!reducedMotion) frame = requestAnimationFrame(animate);
  }
}

// Ambient audio is created only after the visitor explicitly activates it.
const soundToggle = document.getElementById('soundToggle');
const soundLabel = document.getElementById('soundLabel');
if (soundToggle && soundLabel) {
  let audio = null;
  let oscillator = null;
  let gain = null;
  soundToggle.addEventListener('click', async () => {
    if (!audio) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audio = new AudioContextClass();
      oscillator = audio.createOscillator();
      gain = audio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 110;
      gain.gain.value = 0;
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start();
    }
    if (audio.state === 'suspended') await audio.resume();
    const enabled = soundToggle.classList.toggle('active');
    gain.gain.setTargetAtTime(enabled ? 0.018 : 0, audio.currentTime, 0.12);
    soundLabel.textContent = enabled ? 'SOUND ON' : 'SOUND OFF';
    soundToggle.setAttribute('aria-label', enabled ? 'サウンドを停止' : 'サウンドを再生');
  });
}
