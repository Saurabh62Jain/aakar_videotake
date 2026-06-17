/**
 * Aakar Videotake PWA Integration Script
 * Handles Service Worker registration, Offline Notifications, and floating Install Prompts.
 */

(function() {
  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Aakar Videotake Service Worker registered! Scope: ', reg.scope))
        .catch(err => console.error('Aakar Videotake Service Worker registration failed: ', err));
    });
  }

  // 2. Inject CSS Styles for Dynamic PWA Elements
  const pwaStyles = `
    /* Floating Install Card */
    #pwa-install-card {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translate(-50%, 150px);
      width: 90%;
      max-width: 420px;
      background: rgba(15, 23, 19, 0.95);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(229, 184, 66, 0.25);
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 10000;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      color: #ffffff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #pwa-install-card.show {
      transform: translate(-50%, 0);
    }
    .pwa-logo-wrapper {
      width: 48px;
      height: 48px;
      background: rgba(229, 184, 66, 0.1);
      border-radius: 12px;
      padding: 4px;
      border: 1px solid rgba(229, 184, 66, 0.3);
      flex-shrink: 0;
    }
    .pwa-logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .pwa-content {
      flex-grow: 1;
    }
    .pwa-title {
      font-size: 15px;
      font-weight: 600;
      color: #E5B842;
      margin-bottom: 2px;
    }
    .pwa-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.3;
    }
    .pwa-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .pwa-btn {
      border: none;
      outline: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      border-radius: 10px;
      transition: all 0.2s ease;
    }
    .pwa-btn-install {
      background-color: #E5B842;
      color: #0F1713;
      padding: 8px 14px;
    }
    .pwa-btn-install:hover {
      background-color: #f0c75c;
      transform: translateY(-1px);
    }
    .pwa-btn-close {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .pwa-btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Offline Toast Alert */
    #pwa-offline-toast {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translate(-50%, -100px);
      background: rgba(200, 30, 30, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 100, 100, 0.4);
      border-radius: 12px;
      padding: 12px 24px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      z-index: 10001;
      color: white;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #pwa-offline-toast.show {
      transform: translate(-50%, 0);
    }
    .pwa-toast-icon {
      font-size: 16px;
      animation: shake 1.5s infinite;
    }
    @keyframes shake {
      0%, 100% { transform: rotate(0); }
      10%, 30% { transform: rotate(-10deg); }
      20%, 40% { transform: rotate(10deg); }
      50% { transform: rotate(0); }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = pwaStyles;
  document.head.appendChild(styleEl);

  // 3. Inject Floating Install Card and Offline Toast into DOM
  document.addEventListener('DOMContentLoaded', () => {
    // Floating Install Card HTML
    const installCard = document.createElement('div');
    installCard.id = 'pwa-install-card';
    installCard.innerHTML = `
      <div class="pwa-logo-wrapper">
        <img class="pwa-logo-img" src="images/logo_trans.png" alt="Aakar Logo">
      </div>
      <div class="pwa-content">
        <div class="pwa-title">Install Aakar App</div>
        <div class="pwa-desc">Access film festivals and workshops instantly from your home screen.</div>
      </div>
      <div class="pwa-actions">
        <button class="pwa-btn pwa-btn-install" id="pwa-install-trigger">Install</button>
        <button class="pwa-btn pwa-btn-close" id="pwa-install-close" aria-label="Dismiss">&times;</button>
      </div>
    `;
    document.body.appendChild(installCard);

    // Offline Toast HTML
    const offlineToast = document.createElement('div');
    offlineToast.id = 'pwa-offline-toast';
    offlineToast.innerHTML = `
      <span class="pwa-toast-icon">📡</span>
      <span class="pwa-toast-text">Connection lost. Showing cached offline content.</span>
    `;
    document.body.appendChild(offlineToast);

    // 4. Register Interactive Listeners
    let deferredPrompt;
    const triggerBtn = document.getElementById('pwa-install-trigger');
    const closeBtn = document.getElementById('pwa-install-close');

    // Listen to native PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Show banner if not dismissed in this session
      if (!sessionStorage.getItem('pwa_banner_dismissed')) {
        setTimeout(() => {
          installCard.classList.add('show');
        }, 4000); // Trigger 4 seconds after page load for best experience
      }
    });

    // Handle install button click
    triggerBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA Installation Choice: ${outcome}`);
      
      deferredPrompt = null;
      installCard.classList.remove('show');
    });

    // Handle close button click
    closeBtn.addEventListener('click', () => {
      installCard.classList.remove('show');
      sessionStorage.setItem('pwa_banner_dismissed', 'true');
    });

    // Monitor network changes
    window.addEventListener('online', () => {
      offlineToast.classList.remove('show');
    });

    window.addEventListener('offline', () => {
      offlineToast.classList.add('show');
    });

    // Initial check
    if (!navigator.onLine) {
      offlineToast.classList.add('show');
    }
  });
})();
