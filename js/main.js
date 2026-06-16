// ========================================
// Matematika Diskrit — Main JS
// ========================================

document.addEventListener('DOMContentLoaded', function() {

  // ---- Answer Toggle ----
  document.querySelectorAll('.answer-toggle__btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const content = this.nextElementSibling;
      this.classList.toggle('open');
      content.classList.toggle('open');
    });
  });

  // ---- Mobile Sidebar Toggle ----
  const menuBtn = document.querySelector('.navbar__menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // ---- Scroll Spy for TOC ----
  const tocLinks = document.querySelectorAll('.sidebar__sublink');
  const sections = [];
  
  tocLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.getElementById(href.substring(1));
      if (section) sections.push({ el: section, link: link });
    }
  });

  if (sections.length > 0) {
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          const scrollPos = window.scrollY + 100;
          let activeIdx = 0;
          
          sections.forEach(function(s, i) {
            if (scrollPos >= s.el.offsetTop) {
              activeIdx = i;
            }
          });
          
          tocLinks.forEach(function(l) { l.classList.remove('active'); });
          if (sections[activeIdx]) {
            sections[activeIdx].link.classList.add('active');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---- Back to Top Button ----
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Animate on Scroll ----
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedEls.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ---- Active sidebar link based on current page ----
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar__link').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href) {
      const linkPage = href.split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    }
  });

  // ---- KaTeX Auto Render (if available) ----
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    });
  }
});
