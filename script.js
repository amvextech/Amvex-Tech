// AMVEX TECH — SCRIPT.JS //
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/* ============================================================
   HERO SECTION — script.js
   - Animated number counters (fires on scroll into view)
   - Progress bar animation
   - Feature cards stagger-in
   - Magnetic button effect
============================================================ */

(function () {
  'use strict';

  /* ── 1. COUNTER ANIMATION ─────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800; // ms
    const start    = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
        el.classList.add('counter-done');
      }
    }

    requestAnimationFrame(step);
  }

  /* ── 2. PROGRESS BAR ANIMATION ───────────────────────────── */
  function animateBars() {
    document.querySelectorAll('.stat-bar-fill').forEach(function (fill) {
      var w = fill.dataset.w;
      // small rAF delay to let transition register
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fill.style.width = w + '%';
        });
      });
    });
  }

  /* ── 3. INTERSECTION OBSERVER — stats section ─────────────── */
  var statsObserved = false;

  function initStatsObserver() {
    var statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsObserved) {
          statsObserved = true;
          document.querySelectorAll('.counter').forEach(animateCounter);
          animateBars();
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }

  /* ── 4. FEATURE CARDS STAGGER-IN ─────────────────────────── */
  function initFeatCards() {
    var cards = document.querySelectorAll('.feat-card');
    cards.forEach(function (card) {
      var delay = parseInt(card.dataset.delay || 0, 10);

      setTimeout(function () {
        card.classList.add('visible');
      }, 120 + delay);
    });
  }

  /* ── 5. MAGNETIC BUTTON EFFECT ────────────────────────────── */
  function initMagnetic() {
    var btns = document.querySelectorAll('.btn-primary, .btn-secondary');

    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect  = btn.getBoundingClientRect();
        var x     = e.clientX - rect.left - rect.width  / 2;
        var y     = e.clientY - rect.top  - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18) + 'px, ' + (y * 0.18 - 3) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ── 6. HERO BACKGROUND PARALLAX (subtle) ─────────────────── */
  function initParallax() {
    var img = document.querySelector('.hero-bg-img');
    if (!img) return;
    if (window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          // shift image up slightly as user scrolls (parallax depth = 0.25)
          img.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── INIT ─────────────────────────────────────────────────── */
  function init() {
    initStatsObserver();
    initFeatCards();
    initMagnetic();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();



// ── Scroll Restoration ────────────────────────────────────── //

// ============================================================
//  AMVEX TECH — PREMIUM MOBILE DRAWER NAVIGATION
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Element refs ──────────────────────────────────────────
  var hamburger   = document.getElementById('hamburger');
  var drawer      = document.getElementById('mobileDrawer');
  var overlay     = document.getElementById('navOverlay');
  var drawerClose = document.getElementById('drawerClose');

  // ── State ─────────────────────────────────────────────────
  var isOpen         = false;
  var touchStartX    = 0;
  var touchStartY    = 0;
  var isDragging     = false;
  var dragStarted    = false;
  var currentTranslate = 0;

  // ── Open drawer ───────────────────────────────────────────
  function openDrawer() {
    if (isOpen) return;
    isOpen = true;
    if (drawer)    drawer.classList.add('active');
    if (overlay)   overlay.classList.add('active');
    if (hamburger) {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.classList.add('ripple-active');
      setTimeout(function () {
        hamburger.classList.remove('ripple-active');
        hamburger.classList.add('ripple-done');
        setTimeout(function () { hamburger.classList.remove('ripple-done'); }, 500);
      }, 50);
    }
    document.body.style.overflow = 'hidden';
  }

  // ── Close drawer ──────────────────────────────────────────
  function closeDrawer() {
    if (!isOpen) return;
    isOpen = false;
    if (drawer)    drawer.classList.remove('active');
    if (overlay)   overlay.classList.remove('active');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  // ── Hamburger button ──────────────────────────────────────
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  // ── Overlay click ─────────────────────────────────────────
  if (overlay) {
    overlay.addEventListener('click', function () {
      closeDrawer();
    });
  }

  // ── Close (X) button inside drawer ───────────────────────
  if (drawerClose) {
    drawerClose.addEventListener('click', function () {
      closeDrawer();
    });
  }

  // ── Escape key ────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeDrawer();
  });

  // ── Close on regular link clicks inside drawer ────────────
  if (drawer) {
    var drawerLinks = drawer.querySelectorAll('a.drawer-link, .drawer-sub-link');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var href = link.getAttribute('href') || '';
        if (href.indexOf('#') !== -1) {
          closeDrawer();
          return;
        }
        setTimeout(function () { closeDrawer(); }, 120);
      });
    });

    var ctaBtns = drawer.querySelectorAll('.drawer-cta-btn');
    ctaBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTimeout(function () { closeDrawer(); }, 120);
      });
    });
  }

  // ── Services accordion ────────────────────────────────────
  if (drawer) {
    var accordionToggles = drawer.querySelectorAll('.drawer-accordion-toggle');

    accordionToggles.forEach(function (toggle) {
      var panelId = toggle.getAttribute('aria-controls');
      var panel   = document.getElementById(panelId);
      if (!panel) return;

      panel.style.maxHeight  = '0px';
      panel.style.opacity    = '0';
      panel.style.overflow   = 'hidden';
      panel.style.transition = 'max-height 0.42s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease';
      panel.removeAttribute('hidden');

      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          toggle.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = '0px';
          panel.style.opacity   = '0';
        } else {
          panel.style.maxHeight = 'none';
          var fullHeight = panel.scrollHeight;
          panel.style.maxHeight = '0px';
          panel.offsetHeight;
          toggle.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = fullHeight + 'px';
          panel.style.opacity   = '1';
        }
      });
    });
  }

  // ── Touch swipe-to-close ──────────────────────────────────
  if (drawer) {
    drawer.addEventListener('touchstart', function (e) {
      touchStartX    = e.touches[0].clientX;
      touchStartY    = e.touches[0].clientY;
      isDragging     = false;
      dragStarted    = false;
      currentTranslate = 0;
      drawer.style.transition = 'none';
    }, { passive: true });

    drawer.addEventListener('touchmove', function (e) {
      var dx = e.touches[0].clientX - touchStartX;
      var dy = e.touches[0].clientY - touchStartY;
      if (!dragStarted) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        dragStarted = true;
        isDragging  = Math.abs(dx) > Math.abs(dy);
      }
      if (!isDragging || dx < 0) return;
      currentTranslate = dx;
      drawer.style.transform = 'translateX(' + dx + 'px)';
      if (overlay) {
        var progress = Math.min(dx / drawer.offsetWidth, 1);
        overlay.style.opacity = String(1 - progress * 0.9);
      }
    }, { passive: true });

    drawer.addEventListener('touchend', function () {
      drawer.style.transition = '';
      drawer.style.transform  = '';
      if (overlay) overlay.style.opacity = '';
      if (isDragging && currentTranslate > drawer.offsetWidth * 0.3) {
        closeDrawer();
      }
      isDragging       = false;
      dragStarted      = false;
      currentTranslate = 0;
    }, { passive: true });
  }

});

// ============================================================
//  SEARCH — desktop nav + mobile drawer
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  var searchData = [
    { title: 'Web Development',         url: 'service-web.html',        category: 'Development'    },
    { title: 'Mobile Apps',             url: 'service-app.html',        category: 'Development'    },
    { title: 'Backend Solutions',       url: 'service-backend.html',    category: 'Development'    },
    { title: 'UI/UX Design',           url: 'service-uiux.html',       category: 'Design'         },
    { title: 'Security & Optimization', url: 'service-security.html',   category: 'Infrastructure' },
    { title: 'Deployment & Support',    url: 'service-deployment.html', category: 'Infrastructure' },
    { title: 'Home',                    url: 'index.html',              category: 'Navigation'     },
    { title: 'Contact',                 url: 'contact.html',            category: 'Navigation'     },
    { title: 'About',                   url: 'index.html#about',        category: 'Navigation'     },
    { title: 'Portfolio',               url: 'index.html#portfolio',    category: 'Navigation'     },
    { title: 'Owner',                   url: 'index.html#founder',      category: 'Navigation'     },
    { title: 'Founder CEO',             url: 'index.html#founder',      category: 'Navigation'     }


  ];

  function bindSearch(input, resultsEl) {
    if (!input || !resultsEl) return;
    input.addEventListener('input', function () {
      var q = this.value.toLowerCase().trim();
      if (q.length < 2) { resultsEl.classList.remove('active'); return; }
      var matches = searchData.filter(function (item) {
        return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      });
      if (matches.length === 0) {
        resultsEl.innerHTML = '<div class="search-result-item">No results found</div>';
      } else {
        resultsEl.innerHTML = matches.map(function (item) {
          return '<div class="search-result-item" onclick="window.location.href=\'' + item.url + '\'">' +
                 '<strong>' + item.title + '</strong>' +
                 '<small style="color:var(--muted);display:block;margin-top:3px;">' + item.category + '</small>' +
                 '</div>';
        }).join('');
      }
      resultsEl.classList.add('active');
    });
  }

  bindSearch(
    document.querySelector('.nav-search .search-input'),
    document.querySelector('.nav-search .search-results')
  );

  bindSearch(
    document.querySelector('.drawer-search-input'),
    document.querySelector('.drawer-search-results')
  );

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-container') && !e.target.closest('.drawer-search')) {
      document.querySelectorAll('.search-results').forEach(function (r) {
        r.classList.remove('active');
      });
    }
  });
});

// ── Back to top button ───────────────────────────────────────
const backToTopButton = document.createElement('button');
backToTopButton.className = 'back-to-top';
backToTopButton.innerHTML = '↑';
backToTopButton.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopButton);

let backToTopTicking = false;
window.addEventListener('scroll', function() {
    if (backToTopTicking) return;
    backToTopTicking = true;
    requestAnimationFrame(function() {
        backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
        backToTopTicking = false;
    });
}, { passive: true });

backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Scroll Animations ────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.7s cubic-bezier(0.23,1,0.32,1) forwards';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.service-card, .portfolio-card, .blog-card, .swp-tech-card, .swp-work-card, .swp-why-card, .swp-step, .swp-feature-item, .info-card'
).forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ── Performance: Lazy Loading ────────────────────────────────
document.querySelectorAll('img').forEach(function(img) {
  if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  if (!img.hasAttribute('loading') && !img.closest('.hero, .navbar')) {
    img.setAttribute('loading', 'lazy');
  }
});

const lazyImages = document.querySelectorAll('img.lazy');
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { threshold: 0.1, rootMargin: '300px 0px' });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ── WebP Support ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  const supportsWebP = document.createElement('canvas').toDataURL('image/webp', 0.9).indexOf('data:image/webp') === 0;
  const images = document.querySelectorAll('img[data-webp-fallback]');
  images.forEach(img => {
    const webpSrc = img.getAttribute('data-webp-fallback');
    if (supportsWebP && webpSrc) {
      const webpImg = new Image();
      webpImg.onload = function() { img.src = this.src; };
      webpImg.src = webpSrc;
    }
  });
});

// ── Founder Section 3D Card ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  const founderCard3D = document.querySelector('.founder-card-3d');
  if (founderCard3D) {
    let isHovered = false;
    founderCard3D.addEventListener('click', () => {
      founderCard3D.style.transform = 'rotateY(180deg)';
    });
    founderCard3D.addEventListener('mouseenter', () => { isHovered = true; });
    founderCard3D.addEventListener('mouseleave', () => {
      isHovered = false;
      founderCard3D.style.transform = '';
    });
    founderCard3D.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = founderCard3D.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -10;
      const rotateY = ((x - rect.width  / 2) / rect.width)  *  10;
      founderCard3D.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }
});
// ============================================================
//  CONTACT SECTION
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Char counter ──────────────────────────────────────────
  const msgArea   = document.getElementById('ctcMsg');
  const charSpan  = document.getElementById('ctcCharCount');
  const MAX_CHARS = 500;
  const chips      = document.querySelectorAll('.ctc-chip');
  const selectedServices = new Set();

  if (msgArea && charSpan) {
    msgArea.addEventListener('input', () => {
      const len = msgArea.value.length;

      charSpan.textContent = len;

      charSpan.style.color =
        len > MAX_CHARS * 0.85 ? '#f43f5e' : '';

      if (len > MAX_CHARS) {
        msgArea.value = msgArea.value.substring(0, MAX_CHARS);
        charSpan.textContent = MAX_CHARS;
      }
    });
  }

  // ── Form submit ───────────────────────────────────────────
  const ctcForm    = document.getElementById('contactForm');
  const ctcSubmit  = document.getElementById('ctcSubmit');
  const ctcSuccess = document.getElementById('ctcSuccess');

  if (!ctcForm) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const value = chip.dataset.val || chip.textContent.trim();
      chip.classList.toggle('active');
      chip.classList.contains('active')
        ? selectedServices.add(value)
        : selectedServices.delete(value);

      const servicesField = document.getElementById('ctcServices');
      if (servicesField) servicesField.value = Array.from(selectedServices).join(', ');
    });
  });

  function resetSubmitState() {
    if (!ctcSubmit) return;
    ctcSubmit.disabled = false;
    ctcSubmit.classList.remove('loading');
    const btnText = ctcSubmit.querySelector('.ctc-submit__text');
    if (btnText) btnText.textContent = 'Send Message';
  }

  ctcForm.addEventListener('submit', function (e) {

    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.ctc-error').forEach(el => el.remove());

    document.querySelectorAll(
      '.ctc-input-wrap input, .ctc-input-wrap textarea, .ctc-input-wrap select'
    ).forEach(el => {
      el.style.borderColor = '';
    });

    const name     = document.getElementById('ctcName');
    const email    = document.getElementById('ctcEmail');
    const phone    = document.getElementById('ctcPhone');
    const services = document.getElementById('ctcServices');

    let isValid = true;
    let firstInvalid = null;

    function showError(input, msg) {

      input.style.borderColor = '#f43f5e';

      const err = document.createElement('span');

      err.className = 'ctc-error';

      err.style.cssText =
        'font-size:0.72rem;color:#f43f5e;margin-top:4px;display:block;';

      err.textContent = msg;

      input.closest('.ctc-field').appendChild(err);

      if (!firstInvalid) firstInvalid = input;

      isValid = false;
    }

    // Validation
    if (!name.value.trim()) {
      showError(name, 'Please enter your name.');
    }

    if (
       email.value.trim() &&
       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
        ) {

     showError(email, 'Please enter a valid email address.');
  }

    if (!phone.value.trim()) {
      showError(phone, 'Please enter your mobile number.');
    }

    

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus({ preventScroll: true });
      return;
    }

    // Loading state
    if (ctcSubmit) {

      ctcSubmit.disabled = true;

      ctcSubmit.classList.add('loading');

      const btnText =
        ctcSubmit.querySelector('.ctc-submit__text');

      if (btnText) {
        btnText.textContent = 'Sending...';
      }
    }

    // Send form
    fetch(ctcForm.action, {
      method: 'POST',
      body: new FormData(ctcForm)
    })

    .then(async (response) => {

      const result = await response.json();

      if (result.success) {

        // Hide fields
        document.querySelectorAll(
          '.ctc-field, .ctc-form__row'
        ).forEach(el => {
          el.style.display = 'none';
        });

        // Hide button
        if (ctcSubmit) {
          ctcSubmit.style.display = 'none';
        }

        // Show success
        if (ctcSuccess) {
          ctcSuccess.classList.add('show');
        }

        // Reset after 5 sec
    setTimeout(() => {

  // Fully reset form
  ctcForm.reset();

  // Force re-enable submit button
  if (ctcSubmit) {

    ctcSubmit.disabled = false;

    ctcSubmit.style.display = '';

    ctcSubmit.classList.remove('loading');

    const btnText =
      ctcSubmit.querySelector('.ctc-submit__text');

    if (btnText) {
      btnText.textContent = 'Send Message';
    }
  }

  // Restore fields
  document.querySelectorAll(
    '.ctc-field, .ctc-form__row'
  ).forEach(el => {
    el.style.display = '';
  });

  // Hide success
  if (ctcSuccess) {
    ctcSuccess.classList.remove('show');
  }

  // Reset char count
  if (charSpan) {
    charSpan.textContent = '0';
  }

}, 5000);

      } else {

        alert('Something went wrong.');
        resetSubmitState();

      }

    })

    .catch(() => {

      alert('Failed to send message. Please try again.');
      resetSubmitState();

    });

  });

});
// ============================================================
//  CHATBOT
// ============================================================
function toggleChat() {
    const box = document.getElementById("chatBox");
    if (box.style.display === "flex") {
        box.style.display = "none";
    } else {
        box.style.display = "flex";
        const body = document.getElementById("chatBody");
        if (!body.dataset.welcomed) {
            body.dataset.welcomed = "true";
            setTimeout(() => {
                addMessage("👋 Hey! Welcome to Amvex Tech. I'm here to help. Ask me about our services, pricing, or anything else!", "bot");
            }, 300);
        }
    }
}

function addMessage(text, type) {
    const chatBody = document.getElementById("chatBody");
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (!msg) return;
    addMessage(msg, "user");
    input.value = "";
    showTyping(() => addMessage(getReply(msg), "bot"));
}

function showTyping(callback) {
    const chatBody = document.getElementById("chatBody");
    const typing = document.createElement("div");
    typing.className = "msg bot typing-msg";
    typing.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    setTimeout(() => { typing.remove(); callback(); }, 800);
}

function getReply(msg) {
    msg = msg.toLowerCase();
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
        return "Hey! 👋 Great to meet you. How can we help bring your idea to life?";
    if (msg.includes("service") || msg.includes("offer") || msg.includes("do"))
        return "We offer Web Development, Mobile Apps, UI/UX Design, Backend Solutions, Security & Optimization, and Deployment Support. Which interests you? 🚀";
    if (msg.includes("price") || msg.includes("cost") || msg.includes("rate") || msg.includes("budget") || msg.includes("money"))
        return "Pricing depends on your project scope. We offer competitive rates — let's hop on a quick call! You can reach us at amvextech@gmail.com 📩";
    if (msg.includes("time") || msg.includes("deadline") || msg.includes("how long") || msg.includes("duration"))
        return "Most projects take 2–8 weeks depending on complexity. We work in agile sprints to keep delivery fast ⏱️";
    if (msg.includes("contact") || msg.includes("reach") || msg.includes("talk"))
        return "📧 Email: amvextech@gmail.com\n📱 Phone: +91-7905457261\nOr scroll to our Contact section!";
    if (msg.includes("web") || msg.includes("website"))
        return "We build blazing-fast, SEO-optimized websites with React, Next.js and more. Check out service-web.html for full details! 🌐";
    if (msg.includes("app") || msg.includes("mobile") || msg.includes("android") || msg.includes("ios"))
        return "We build iOS & Android apps using Flutter and React Native — one codebase, two platforms, native feel 📱";
    if (msg.includes("design") || msg.includes("ui") || msg.includes("ux"))
        return "Our design team crafts user-centered interfaces in Figma — from wireframes to dev-ready design systems 🎨";
    if (msg.includes("backend") || msg.includes("api") || msg.includes("server") || msg.includes("database"))
        return "We build scalable APIs, microservices, and cloud infrastructure with Node.js, PostgreSQL, Redis, and more ⚙️";
    if (msg.includes("security") || msg.includes("hack") || msg.includes("secure"))
        return "We do full OWASP security audits, SSL hardening, and performance optimization — 0 breaches on our watch 🔐";
    if (msg.includes("deploy") || msg.includes("hosting") || msg.includes("cloud") || msg.includes("aws"))
        return "We handle CI/CD pipelines, AWS/GCP deployment, monitoring, and ongoing support so you can focus on business 🚀";
    if (msg.includes("location") || msg.includes("where") || msg.includes("office") || msg.includes("mumbai"))
        return "We're based in Thane, Mumbai, India — but we work with clients globally! 📍";
    if (msg.includes("owner") || msg.includes("ceo") || msg.includes("founder") || msg.includes("name"))
        return "The Founder of Amvex Tech is MOHAMMAD AMIR";
    return "That's interesting! I'd love to help you further. Feel free to email us at amvextech@gmail.com for a detailed discussion 🤝";
}

// ============================================================
//  SERVICES SECTION
// ============================================================
(function () {

  const svcCards = document.querySelectorAll('.svc-card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = parseInt(card.dataset.index) || 0;
        setTimeout(() => {
          card.classList.add('svc-card--visible');
        }, index * 90);
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  svcCards.forEach(card => cardObserver.observe(card));

  const tabs      = document.querySelectorAll('.svc-tab');
  const indicator = document.querySelector('.svc-tab-indicator');
  const grid      = document.getElementById('svcGrid');
  let filterBusy = false;

  function moveIndicator(tab) {
    if (!tab || !indicator) return;
    const tabRect    = tab.getBoundingClientRect();
    const filterRect = tab.closest('.svc-filter').getBoundingClientRect();
    indicator.style.width     = tabRect.width + 'px';
    indicator.style.transform = `translateX(${tabRect.left - filterRect.left - 5}px)`;
  }

  function animateCardFilter(nextFilter) {
    if (!grid || filterBusy) return;
    filterBusy = true;

    const cards = Array.from(grid.querySelectorAll('.svc-card'));
    const firstRects = new Map();
    const outgoing = [];

    cards.forEach(card => {
      if (!card.classList.contains('svc-hidden')) {
        firstRects.set(card, card.getBoundingClientRect());
      }
      const matches = nextFilter === 'all' || card.dataset.cat === nextFilter;
      if (!matches && !card.classList.contains('svc-hidden')) outgoing.push(card);
    });

    grid.style.minHeight = grid.getBoundingClientRect().height + 'px';
    grid.classList.add('svc-grid--filtering');

    const canAnimate = typeof Element !== 'undefined' && Element.prototype.animate;
    const exitAnimations = canAnimate
      ? outgoing.map(card => card.animate([
          { opacity: 1, transform: 'translateY(0) scale(1)' },
          { opacity: 0, transform: 'translateY(12px) scale(0.97)' }
        ], { duration: 170, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }).finished.catch(() => {}))
      : [];

    Promise.all(exitAnimations).then(() => {
      cards.forEach((card, i) => {
        const matches = nextFilter === 'all' || card.dataset.cat === nextFilter;
        card.style.transitionDelay = '0ms';
        card.getAnimations().forEach(animation => animation.cancel());

        if (matches) {
          card.classList.remove('svc-hidden');
          card.classList.add('svc-card--visible');
          card.style.transitionDelay = (i * 35) + 'ms';
        } else {
          card.classList.add('svc-hidden');
          card.style.transitionDelay = '0ms';
        }
      });

      requestAnimationFrame(() => {
        const enterAnimations = canAnimate
          ? cards.filter(card => !card.classList.contains('svc-hidden')).map((card, index) => {
              const first = firstRects.get(card);
              const last = card.getBoundingClientRect();
              const delay = Math.min(index * 28, 110);

              if (first) {
                const dx = first.left - last.left;
                const dy = first.top - last.top;
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                  return card.animate([
                    { transform: `translate(${dx}px, ${dy}px) scale(0.985)`, opacity: 0.92 },
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 }
                  ], { duration: 430, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }).finished.catch(() => {});
                }
              }

              return card.animate([
                { transform: 'translateY(18px) scale(0.97)', opacity: 0 },
                { transform: 'translateY(0) scale(1)', opacity: 1 }
              ], { duration: 390, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }).finished.catch(() => {});
            })
          : [];

        Promise.all(enterAnimations).then(() => {
          grid.classList.remove('svc-grid--filtering');
          grid.style.minHeight = '';
          cards.forEach(card => {
            card.style.transitionDelay = '';
          });
          filterBusy = false;
        });
      });
    });
  }

  const firstActive = document.querySelector('.svc-tab.active');
  if (firstActive && indicator) moveIndicator(firstActive);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active') || filterBusy) return;
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      if (indicator) moveIndicator(tab);
      animateCardFilter(tab.dataset.filter);
    });
  });

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.svc-tab.active');
    if (currentActive && indicator) moveIndicator(currentActive);
  });

  if (window.matchMedia('(pointer: fine)').matches) {
    svcCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width  * 100) + '%');
        card.style.setProperty('--mouse-y', ((e.clientY - rect.top)  / rect.height * 100) + '%');
      });
    });
  }

  svcCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.svc-card__cta');
        if (link) link.click();
      }
    });
  });

})();


// ============================================================
//  UNIFIED NAVBAR SYSTEM — single RAF handler, no flicker
// ============================================================
(function () {
  var navbar   = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var path     = window.location.pathname.toLowerCase();
  var isHome   = path.includes('index.html') || path === '/' || path.endsWith('/');
  var pageName = path.split('/').pop() || 'index.html';

  function getNavbarOffset() {
    var rect = navbar ? navbar.getBoundingClientRect() : null;
    return Math.ceil((rect ? rect.bottom : 72) + 45);
  }

  function findHashTarget(hash) {
    if (!hash || hash === '#') return null;
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1))) || document.querySelector(hash);
    } catch (err) {
      return null;
    }
  }

  function getScrollAnchor(target) {
    if (!target || target.id === 'home') return target;
    if (target.tagName && target.tagName.toLowerCase() === 'section') {
      return target.querySelector(
        '.section-header, .swp-section-header, .about-text, .ctc-header, .swp-about-text'
      ) || target;
    }
    return target;
  }

  function getUntransformedTop(el) {
    var top = el.getBoundingClientRect().top + window.pageYOffset;
    var transform = window.getComputedStyle(el).transform;
    if (transform && transform !== 'none') {
      var matrix = transform.match(/matrix(3d)?\(([^)]+)\)/);
      if (matrix) {
        var values = matrix[2].split(',').map(function (value) {
          return parseFloat(value.trim()) || 0;
        });
        top -= matrix[1] === '3d' ? values[13] : values[5];
      }
    }
    return top;
  }

  function scrollToHash(hash, behavior, stabilize) {
    var target = findHashTarget(hash);
    if (!target) return false;
    var anchor = getScrollAnchor(target);
    var top = getUntransformedTop(anchor) - getNavbarOffset();
    window.scrollTo({
      top: Math.max(0, Math.round(top)),
      behavior: behavior || 'smooth'
    });
    if (stabilize) {
      window.clearTimeout(scrollToHash._stabilizeTimer);
      scrollToHash._stabilizeTimer = window.setTimeout(function () {
        scrollToHash(hash, 'auto', false);
      }, behavior === 'smooth' ? 520 : 180);
    }
    return true;
  }

  function isSamePageHashLink(href) {
    if (!href || href === '#') return false;
    var hashIdx = href.indexOf('#');
    if (hashIdx === -1) return false;
    var linkPage = href.slice(0, hashIdx).split('/').pop();
    return !linkPage || linkPage.toLowerCase() === pageName;
  }

  window.AmvexScrollToHash = scrollToHash;

  // Single RAF-throttled scroll handler — replaces all previous navbar scroll code
  var rafId = null;
  var lastY = -1;

  function updateNavbar() {
    var y = window.scrollY;
    if (y === lastY) { rafId = null; return; }
    lastY = y;
    if (navbar) navbar.classList.toggle('scrolled', y > 50);
    rafId = null;
  }

  window.addEventListener('scroll', function () {
    if (!rafId) rafId = requestAnimationFrame(updateNavbar);
  }, { passive: true });

  updateNavbar(); // set correct state immediately on page load

  if (isHome && !window.location.hash) {
    window.addEventListener('pageshow', function () {
      var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (!navEntry || navEntry.type === 'reload') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }, { once: true });
  }

  // Active link tracking on scroll — homepage only
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

  var activeLinkRaf = null;
  window.addEventListener('scroll', function () {
    if (!isHome || sections.length === 0) return;
    if (activeLinkRaf) return;
    activeLinkRaf = requestAnimationFrame(function () {
      var current = '';
      var scrollY = window.scrollY + 130;
      for (var i = 0; i < sections.length; i++) {
        if (scrollY >= sections[i].offsetTop) current = sections[i].id;
      }
      if (current) {
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href') || '';
          link.classList.toggle('active', href === '#' + current || href === 'index.html#' + current);
        });
      }
      activeLinkRaf = null;
    });
  }, { passive: true });

  // Active state for non-home pages
  if (!isHome) {
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = (link.getAttribute('href') || '').toLowerCase();
      if (path.includes('service') && href.includes('service')) link.classList.add('active');
      if (path.includes('contact') && href.includes('contact')) link.classList.add('active');
    });
  }

  // Hash scroll on load
  if (isHome && window.location.hash) {
    requestAnimationFrame(function () {
      scrollToHash(window.location.hash, 'auto', false);
    });
    window.addEventListener('load', function () {
      scrollToHash(window.location.hash, 'auto', true);
      setTimeout(function () {
        scrollToHash(window.location.hash, 'auto', false);
      }, 450);
    }, { once: true });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href') || '';
      if (href === window.location.hash || href === 'index.html' + window.location.hash) {
        link.classList.add('active');
      }
    });
  }

  // Mega menu keyboard support
  var megaMenus = document.querySelectorAll('.mega-menu');
  megaMenus.forEach(function (menu) {
    var trigger  = menu.querySelector('a.nav-link');
    var dropdown = menu.querySelector('.mega-dropdown');
    if (!trigger || !dropdown) return;
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var isOpen = menu.classList.contains('kb-open');
        megaMenus.forEach(function (m) { m.classList.remove('kb-open'); });
        if (!isOpen) menu.classList.add('kb-open');
      }
      if (e.key === 'Escape') { menu.classList.remove('kb-open'); trigger.focus(); }
    });
    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { menu.classList.remove('kb-open'); trigger.focus(); }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.mega-menu')) {
      megaMenus.forEach(function (m) { m.classList.remove('kb-open'); });
    }
  });

  // Mega item cursor glow — fine pointer devices only
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.mega-item').forEach(function (item) {
      item.addEventListener('mousemove', function (e) {
        var rect = item.getBoundingClientRect();
        item.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
        item.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
      });
    });
  }

  // Nav hash-link smooth scroll
  document.querySelectorAll('.nav-links a[href*="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href    = link.getAttribute('href') || '';
      var hashIdx = href.indexOf('#');
      if (hashIdx === -1) return;
      if (isSamePageHashLink(href) && scrollToHash(href.slice(hashIdx), 'smooth', true)) {
        e.preventDefault();
        e.stopPropagation();
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
        if (window.history.pushState) {
          window.history.pushState(null, '', href.slice(hashIdx));
        }
      }
    });
  });

})();

// ── Smooth scroll for ALL hash anchors on every page ─────────
document.addEventListener('click', function (e) {
  var anchor = e.target.closest('a[href*="#"]');
  if (!anchor) return;
  var href = anchor.getAttribute('href');
  if (href === '#') return;
  var hashIdx = href.indexOf('#');
  if (hashIdx === -1) return;
  var linkPage = href.slice(0, hashIdx).split('/').pop();
  var currentPage = (window.location.pathname.toLowerCase().split('/').pop() || 'index.html');
  if (linkPage && linkPage.toLowerCase() !== currentPage) return;
  if (window.AmvexScrollToHash && window.AmvexScrollToHash(href.slice(hashIdx), 'smooth', true)) {
    e.preventDefault();
    if (window.history.pushState) {
      window.history.pushState(null, '', href.slice(hashIdx));
    }
  }
});

// ── kb-open style injection for mega menu ────────────────────
(function () {
  var s = document.createElement('style');
  s.textContent = '.mega-menu.kb-open .mega-dropdown{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0);}';
  document.head.appendChild(s);
})();
