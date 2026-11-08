/* Apple-inspired scroll reveals; respects reduced-motion and keeps content accessible. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.section-head,.experiment-card,.playground-copy,.terminal,.manifesto-mark,.manifesto>p,.manifesto>span');
  if (reduced || !('IntersectionObserver' in window)) return;
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.classList.contains('experiment-card')) el.style.transitionDelay = (i % 2) * 90 + 'ms';
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  targets.forEach(el => observer.observe(el));
})();
