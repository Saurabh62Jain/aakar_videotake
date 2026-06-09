function initAll() {
  initNavbar();
  initMobileMenu();
  initActiveLink();
  initScrollAnimations();
  initFestivalCountdown();
  initPortfolioFilter();
  initSeatingChart();
  initTicketGenerator();
  initBgCustomizer();
  initShowreelPlayer();
  initGallery();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ==========================================
   NAVIGATION & STICKY HEADER
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle burger animation
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
    
    // Simple bar animation mapping
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

function initActiveLink() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  navLinks.forEach(link => {
    const linkFile = link.getAttribute('href');
    if (currentFile === linkFile || (currentFile === '' && linkFile === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================
   SCROLL ANIMATIONS (Intersection Observer)
   ========================================== */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Set up elements to fade in
  const animateElements = document.querySelectorAll('.glass-card, .portfolio-item, .timeline-item, .section-header');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* ==========================================
   FESTIVAL COUNTDOWN TIMER
   ========================================== */
function initFestivalCountdown() {
  const countdownContainer = document.getElementById('festival-countdown');
  if (!countdownContainer) return;

  // Set target date for submission deadline: July 15, 2026, 03:00 PM (local time)
  // Month is 6 because JavaScript dates are 0-indexed (0 = Jan, 6 = July)
  const targetDate = new Date(2026, 6, 15, 15, 0, 0).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      countdownContainer.innerHTML = '<h4 style="color: var(--accent-amber); font-size: 1.5rem; text-align: center; width: 100%; font-family: var(--font-heading);">Submissions are Closed! (प्रविष्टियाँ बंद हो चुकी हैं)</h4>';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const formatNum = (num) => num < 10 ? `0${num}` : num;

    document.getElementById('days').innerText = formatNum(days);
    document.getElementById('hours').innerText = formatNum(hours);
    document.getElementById('minutes').innerText = formatNum(minutes);
    document.getElementById('seconds').innerText = formatNum(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================
   PORTFOLIO FILTER LOGIC
   ========================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length === 0 || portfolioItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   INTERACTIVE SEATING CHART (Workshops)
   ========================================== */
function initSeatingChart() {
  const seatingChart = document.getElementById('seating-chart');
  if (!seatingChart) return;

  const totalSeatsEl = document.getElementById('total-seats');
  const seatNumbersEl = document.getElementById('seat-numbers');
  const totalPriceEl = document.getElementById('total-price');
  
  const ticketPrice = 149; // Price per workshop ticket
  let selectedSeats = [];

  // Generate 24 seats (8 cols x 3 rows)
  for (let i = 1; i <= 24; i++) {
    const seat = document.createElement('button');
    seat.classList.add('seat');
    
    // Simulate some occupied seats
    const occupiedRandom = Math.random() < 0.35;
    if (occupiedRandom && i !== 5 && i !== 12) {
      seat.classList.add('occupied');
    }

    // Determine seat labels, e.g. Row A (1-8), B (9-16), C (17-24)
    let row = 'A';
    let seatNumInRow = i;
    if (i > 8 && i <= 16) {
      row = 'B';
      seatNumInRow = i - 8;
    } else if (i > 16) {
      row = 'C';
      seatNumInRow = i - 16;
    }
    const seatLabel = `${row}${seatNumInRow}`;

    seat.addEventListener('click', (e) => {
      e.preventDefault();
      if (seat.classList.contains('occupied')) return;

      seat.classList.toggle('selected');

      if (seat.classList.contains('selected')) {
        selectedSeats.push(seatLabel);
      } else {
        selectedSeats = selectedSeats.filter(s => s !== seatLabel);
      }

      // Update calculations
      const ticketCount = selectedSeats.length;
      totalSeatsEl.innerText = ticketCount;
      seatNumbersEl.innerText = ticketCount > 0 ? selectedSeats.join(', ') : 'None';
      totalPriceEl.innerText = `$${ticketCount * ticketPrice}`;
    });

    seatingChart.appendChild(seat);
  }
}

/* ==========================================
   DYNAMIC TICKET GENERATOR (Templates Page)
   ========================================== */
function initTicketGenerator() {
  const form = document.getElementById('ticket-generator-form');
  if (!form) return;

  const inputTitle = document.getElementById('gen-title');
  const inputDate = document.getElementById('gen-date');
  const inputTime = document.getElementById('gen-time');
  const inputSeat = document.getElementById('gen-seat');

  // Preview elements
  const previewTitle = document.getElementById('preview-title');
  const previewDate = document.getElementById('preview-date');
  const previewTime = document.getElementById('preview-time');
  const previewSeat = document.getElementById('preview-seat');
  const previewStubSeat = document.getElementById('preview-stub-seat');

  // Add event listeners for instant typing update
  const updatePreview = () => {
    previewTitle.innerText = inputTitle.value || 'FILM PREMIERE';
    previewDate.innerText = inputDate.value || 'NOVEMBER 20, 2026';
    previewTime.innerText = inputTime.value || '18:00 PM';
    previewSeat.innerText = inputSeat.value || 'A04';
    previewStubSeat.innerText = inputSeat.value || 'A04';
  };

  inputTitle.addEventListener('input', updatePreview);
  inputDate.addEventListener('input', updatePreview);
  inputTime.addEventListener('input', updatePreview);
  inputSeat.addEventListener('input', updatePreview);

  // Initialize
  updatePreview();
}

/* ==========================================
   3D LANGUAGE CARD FLIP (Journey Page)
   ========================================== */
function toggleLanguageCard() {
  const card = document.getElementById('language-card');
  const btn = document.getElementById('lang-toggle');
  if (!card || !btn) return;

  card.classList.toggle('flipped');

  if (card.classList.contains('flipped')) {
    btn.innerHTML = '🌐 Switch to Hindi / हिंदी में देखें';
  } else {
    btn.innerHTML = '🌐 Translate to English / English में देखें';
  }
}

/* ==========================================
   SITE BACKGROUND CUSTOMIZER WIDGET
   ========================================== */
function initBgCustomizer() {
  // 1. Inject the HTML into the body dynamically
  const container = document.createElement('div');
  container.innerHTML = `
    <!-- Floating toggle button -->
    <button class="bg-customizer-toggle" id="bg-toggle" aria-label="Open Background Customizer">
      <svg viewBox="0 0 24 24">
        <path d="M12 3a9 9 0 0 0 9 9 9.006 9.006 0 0 0-9 9 9 9 0 0 0-9-9 9 9 0 0 0 9-9m0-2a11 11 0 0 1 11 11 11.007 11.007 0 0 1-11 11A11 11 0 0 1 1 12 11 11 0 0 1 12 1m0 4c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z"/>
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
      </svg>
    </button>

    <!-- Side-out panel -->
    <div class="bg-customizer-panel" id="bg-panel">
      <div class="bg-customizer-header">
        <h4>🎨 Theme Customizer</h4>
        <button class="bg-customizer-close" id="bg-close">×</button>
      </div>

      <!-- Presets -->
      <div class="bg-customizer-section">
        <h5>Select Preset</h5>
        <div class="bg-presets-grid">
          <button class="bg-preset-btn active" data-preset="default">Default Slate</button>
          <button class="bg-preset-btn" data-preset="cinema">Classic Cinema</button>
          <button class="bg-preset-btn" data-preset="studio">Camera Rig</button>
          <button class="bg-preset-btn" data-preset="neon">Neon Lights</button>
        </div>
      </div>

      <!-- File Picker -->
      <div class="bg-customizer-section">
        <h5>Upload Local Image</h5>
        <button type="button" class="btn btn-secondary" id="bg-file-trigger" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px dashed rgba(229, 184, 66, 0.4); background: rgba(229, 184, 66, 0.05); color: var(--accent-gold); padding: 12px; font-weight: 600; cursor: pointer;">
          📂 Choose Local File
        </button>
        <input type="file" id="bg-file" class="bg-file-input" accept="image/*" style="display: none;">
      </div>

      <!-- URL Paste -->
      <div class="bg-customizer-section">
        <h5>Paste Image URL</h5>
        <div class="bg-url-group">
          <input type="url" id="bg-url" class="form-control" placeholder="https://..." style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 6px; color: #fff; width: 100%;">
          <button class="btn btn-primary" id="bg-url-apply" style="padding: 8px 15px; border-radius: 6px; margin-left: 8px; width: auto; flex-shrink: 0;">Apply</button>
        </div>
      </div>

      <!-- Overlay Opacity -->
      <div class="bg-customizer-section" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <span>OVERLAY OPACITY</span>
          <span id="bg-opacity-val">88%</span>
        </div>
        <input type="range" id="bg-opacity" class="bg-opacity-slider" min="30" max="98" value="88">
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // 2. Setup variables
  const toggleBtn = document.getElementById('bg-toggle');
  const panel = document.getElementById('bg-panel');
  const closeBtn = document.getElementById('bg-close');
  const presetBtns = document.querySelectorAll('.bg-preset-btn');
  const fileInput = document.getElementById('bg-file');
  const urlInput = document.getElementById('bg-url');
  const urlApply = document.getElementById('bg-url-apply');
  const opacitySlider = document.getElementById('bg-opacity');
  const opacityVal = document.getElementById('bg-opacity-val');

  // Presets mapping
  const presets = {
    default: 'default',
    cinema: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    studio: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    neon: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
  };

  // Toggle Panel with Admin Password Security
  toggleBtn.addEventListener('click', () => {
    if (panel.classList.contains('active')) {
      panel.classList.remove('active');
      return;
    }

    const password = prompt("Enter Admin Password to open Theme Customizer:");
    if (password === "admin") {
      panel.classList.add('active');
    } else if (password !== null) {
      alert("Access Denied! Incorrect Admin Password.");
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('active');
  });

  // Apply Background Logic
  function applyBg(value) {
    if (!value || value === 'default') {
      document.body.style.backgroundImage = 'none';
      document.body.classList.remove('has-bg-image');
      
      // Revert sections background when default is selected
      const sections = document.querySelectorAll('.section');
      sections.forEach(s => {
        s.style.backgroundColor = '';
      });
    } else {
      document.body.style.backgroundImage = `url('${value}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.classList.add('has-bg-image');
      
      // Apply opacity overlay settings
      const val = opacitySlider.value;
      const sections = document.querySelectorAll('.section');
      sections.forEach(s => {
        s.style.backgroundColor = `rgba(7, 7, 9, ${val / 100})`;
      });
    }
  }

  // Set Active Preset Style
  function setActivePreset(presetName) {
    presetBtns.forEach(btn => {
      if (btn.getAttribute('data-preset') === presetName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Preset Clicks
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetName = btn.getAttribute('data-preset');
      const bgUrl = presets[presetName];
      applyBg(bgUrl);
      setActivePreset(presetName);
      localStorage.setItem('site-background-preset', presetName);
      localStorage.setItem('site-background-value', bgUrl);
    });
  });

  // Trigger file upload (protected by parent panel entry)
  const fileTrigger = document.getElementById('bg-file-trigger');
  fileTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
  });

  // Local File Loading
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const dataUrl = event.target.result;
        applyBg(dataUrl);
        setActivePreset('none');
        localStorage.setItem('site-background-preset', 'custom');
        localStorage.setItem('site-background-value', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  });

  // Custom URL paste
  urlApply.addEventListener('click', (e) => {
    e.preventDefault();
    const val = urlInput.value.trim();
    if (val) {
      applyBg(val);
      setActivePreset('none');
      localStorage.setItem('site-background-preset', 'custom');
      localStorage.setItem('site-background-value', val);
      urlInput.value = '';
    }
  });

  // Opacity Control
  opacitySlider.addEventListener('input', () => {
    const val = opacitySlider.value;
    opacityVal.innerText = `${val}%`;
    localStorage.setItem('site-background-opacity', val);
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => {
      if (document.body.classList.contains('has-bg-image')) {
        s.style.backgroundColor = `rgba(7, 7, 9, ${val / 100})`;
      }
    });
  });

  // Load Saved State on Page Load
  const savedPreset = localStorage.getItem('site-background-preset');
  const savedValue = localStorage.getItem('site-background-value');
  const savedOpacity = localStorage.getItem('site-background-opacity');

  if (savedOpacity) {
    opacitySlider.value = savedOpacity;
    opacityVal.innerText = `${savedOpacity}%`;
  }

  if (savedValue) {
    applyBg(savedValue);
    if (savedPreset) {
      setActivePreset(savedPreset);
    }
  }
}

/* ==========================================
   SHOWREEL VIDEO PLAYER INTERACTIVITY
   ========================================== */
function initShowreelPlayer() {
  const playBtn = document.getElementById('play-button');
  const coverImg = document.getElementById('showreel-cover');
  let videoEl = document.getElementById('showreel-video');
  const pulseEl = document.getElementById('video-pulse');

  if (!playBtn || !videoEl) return;

  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Hide cover, button and pulse with smooth fade out
    if (coverImg) {
      coverImg.style.transition = 'opacity 0.4s ease';
      coverImg.style.opacity = '0';
      setTimeout(() => { coverImg.style.display = 'none'; }, 400);
    }
    
    playBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    playBtn.style.opacity = '0';
    playBtn.style.transform = 'scale(0.8)';
    setTimeout(() => { playBtn.style.display = 'none'; }, 400);

    if (pulseEl) {
      pulseEl.style.transition = 'opacity 0.4s ease';
      pulseEl.style.opacity = '0';
      setTimeout(() => { pulseEl.style.display = 'none'; }, 400);
    }

    // Show video and play
    videoEl.style.display = 'block';
    videoEl.style.opacity = '0';
    videoEl.style.transition = 'opacity 0.5s ease';
    
    // Trigger reflow to apply transitions
    videoEl.offsetHeight;
    videoEl.style.opacity = '1';
    
    if (videoEl.tagName.toLowerCase() === 'iframe') {
      const src = videoEl.getAttribute('src');
      if (src && !src.includes('autoplay=1')) {
        const separator = src.includes('?') ? '&' : '?';
        videoEl.setAttribute('src', src + separator + 'autoplay=1');
      }
    } else {
      videoEl.setAttribute('controls', 'true');
      videoEl.play().catch(err => {
        console.log("Auto-play blocked or error: ", err);
        fallbackToIframe();
      });
    }
  });

  function fallbackToIframe() {
    if (videoEl.tagName.toLowerCase() === 'iframe') return;
    
    const iframe = document.createElement('iframe');
    iframe.id = 'showreel-video';
    iframe.src = 'https://drive.google.com/file/d/1meOGuWyL-lAet5puJPD-A01pybhjDHLX/preview';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.display = 'block';
    iframe.style.opacity = '1';
    iframe.style.transition = 'opacity 0.5s ease';
    iframe.setAttribute('allow', 'autoplay');
    
    videoEl.parentNode.replaceChild(iframe, videoEl);
    videoEl = iframe;
  }

  // When video ends, restore poster and play button smoothly
  if (videoEl.tagName.toLowerCase() !== 'iframe') {
    videoEl.addEventListener('error', fallbackToIframe);
    
    videoEl.addEventListener('ended', () => {
      if (videoEl.tagName.toLowerCase() === 'iframe') return;
      videoEl.removeAttribute('controls');
      videoEl.style.transition = 'opacity 0.4s ease';
      videoEl.style.opacity = '0';
      
      setTimeout(() => {
        videoEl.style.display = 'none';
        
        if (coverImg) {
          coverImg.style.display = 'block';
          coverImg.offsetHeight;
          coverImg.style.opacity = '1';
        }
        
        playBtn.style.display = 'flex';
        playBtn.offsetHeight;
        playBtn.style.opacity = '1';
        playBtn.style.transform = 'scale(1)';

        if (pulseEl) {
          pulseEl.style.display = 'block';
          pulseEl.offsetHeight;
          pulseEl.style.opacity = '1';
        }
      }, 400);
    });
  }
}

/* ==========================================
   FESTIVAL GALLERY DYNAMIC GENERATION
   ========================================== */
function initGallery() {
  // 1. Render 2025 Festival Photos (32 images)
  const container2025 = document.getElementById('gallery-2025');
  if (container2025) {
    let html2025 = '';
    for (let i = 1; i <= 32; i++) {
      html2025 += `
        <div class="gallery-card">
          <div class="gallery-img-wrapper">
            <img class="gallery-img" src="images/gallery2025/gallery2025_${i}.jpg" alt="Aakar Film Festival 2025 Photo ${i}" loading="lazy">
          </div>
        </div>
      `;
    }
    container2025.innerHTML = html2025;
  }

  // 2. Render Past Memories (42 images)
  const containerPast = document.getElementById('dynamic-gallery');
  if (containerPast) {
    let htmlPast = '';
    for (let i = 1; i <= 42; i++) {
      htmlPast += `
        <div class="gallery-card">
          <div class="gallery-img-wrapper">
            <img class="gallery-img" src="images/gallery/gallery${i}.jpg" alt="Aakar Film Festival Past Memory ${i}" loading="lazy">
          </div>
        </div>
      `;
    }
    containerPast.innerHTML = htmlPast;
  }
}

