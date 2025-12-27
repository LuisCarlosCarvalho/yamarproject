class PWAInstall {
  constructor() {
    this.deferredPrompt = null;
    this.installBanner = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    // Check if already installed
    this.checkIfInstalled();

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    // Listen for app installed
    window.addEventListener('appinstalled', (evt) => {
      console.log('App was installed successfully');
      this.isInstalled = true;
      this.hideInstallBanner();
      this.showSuccessMessage();
    });

    // Register service worker
    this.registerServiceWorker();

    // Show banner on mobile devices after a delay
    if (this.isMobile() && !this.isInstalled) {
      setTimeout(() => {
        if (!this.installBanner && this.deferredPrompt) {
          this.showInstallBanner();
        }
      }, 3000);
    }
  }

  checkIfInstalled() {
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      this.isInstalled = true;
      return;
    }

    // Check localStorage for dismissed banner
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const today = new Date();
      if (dismissedDate.toDateString() === today.toDateString()) {
        return; // Don't show again today
      } else {
        localStorage.removeItem('pwa-banner-dismissed');
      }
    }
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.showUpdateNotification();
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  showInstallBanner() {
    if (this.installBanner || this.isInstalled) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <div class="pwa-banner-icon">
          <img src="/assets/images/icon-96.png" alt="Yamar App" width="48" height="48">
        </div>
        <div class="pwa-banner-text">
          <h3>Instalar Yamar App</h3>
          <p>Acesse rapidamente serviços, workshops e loja</p>
        </div>
        <div class="pwa-banner-actions">
          ${this.isIOS() ?
            '<button class="pwa-btn-install" onclick="pwaInstall.showIOSInstructions()">Como instalar</button>' :
            '<button class="pwa-btn-install" onclick="pwaInstall.installApp()">Instalar</button>'
          }
          <button class="pwa-btn-dismiss" onclick="pwaInstall.dismissBanner()">Depois</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    this.installBanner = banner;

    // Animate in
    setTimeout(() => banner.classList.add('show'), 100);
  }

  hideInstallBanner() {
    if (!this.installBanner) return;

    this.installBanner.classList.remove('show');
    setTimeout(() => {
      if (this.installBanner) {
        this.installBanner.remove();
        this.installBanner = null;
      }
    }, 300);
  }

  dismissBanner() {
    localStorage.setItem('pwa-banner-dismissed', new Date().toISOString());
    this.hideInstallBanner();
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    this.deferredPrompt = null;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      this.hideInstallBanner();
    } else {
      console.log('User dismissed the install prompt');
    }
  }

  showIOSInstructions() {
    const modal = document.createElement('div');
    modal.id = 'pwa-ios-modal';
    modal.innerHTML = `
      <div class="pwa-modal-overlay" onclick="pwaInstall.closeIOSModal()">
        <div class="pwa-modal-content" onclick="event.stopPropagation()">
          <div class="pwa-modal-header">
            <h3>Como instalar no iPhone</h3>
            <button class="pwa-modal-close" onclick="pwaInstall.closeIOSModal()">×</button>
          </div>
          <div class="pwa-modal-body">
            <div class="ios-step">
              <div class="step-number">1</div>
              <p>Toque no botão <strong>Compartilhar</strong> <span class="ios-share-icon">⬆️</span></p>
            </div>
            <div class="ios-step">
              <div class="step-number">2</div>
              <p>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></p>
            </div>
            <div class="ios-step">
              <div class="step-number">3</div>
              <p>Toque em <strong>"Adicionar"</strong> no canto superior direito</p>
            </div>
          </div>
          <div class="pwa-modal-footer">
            <button class="pwa-btn-primary" onclick="pwaInstall.closeIOSModal()">Entendi</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => modal.classList.add('show'), 100);
  }

  closeIOSModal() {
    const modal = document.getElementById('pwa-ios-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.id = 'pwa-success-message';
    message.innerHTML = `
      <div class="pwa-success-content">
        <div class="pwa-success-icon">✅</div>
        <div class="pwa-success-text">
          <h4>Yamar App instalado!</h4>
          <p>Agora você pode acessar pela tela inicial</p>
        </div>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => message.classList.add('show'), 100);
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="pwa-update-content">
        <div class="pwa-update-icon">🔄</div>
        <div class="pwa-update-text">
          <h4>Atualização disponível</h4>
          <p>Uma nova versão está pronta</p>
        </div>
        <div class="pwa-update-actions">
          <button class="pwa-btn-update" onclick="pwaInstall.updateApp()">Atualizar</button>
          <button class="pwa-btn-dismiss" onclick="pwaInstall.dismissUpdate()">Depois</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
  }

  dismissUpdate() {
    const notification = document.getElementById('pwa-update-notification');
    if (notification) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }

  updateApp() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      });
    }
  }
}

// Initialize PWA install when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.pwaInstall = new PWAInstall();
});