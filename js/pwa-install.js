/**
 * PWA INSTALL - Gerenciamento de instalação do app
 * Yemar Makeup Artist
 */

(function() {
    'use strict';
    
    let deferredPrompt = null;
    let installButton = null;
    let installBanner = null;
    
    // Verificar se o navegador suporta PWA
    const isPWASupported = () => {
        return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
    };
    
    // Verificar se já está instalado
    const isInstalled = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    };
    
    // Verificar se é dispositivo móvel
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    // Criar banner de instalação
    const createInstallBanner = () => {
        // Verificar se o banner já foi fechado hoje
        const bannerClosed = localStorage.getItem('pwa-banner-closed');
        const today = new Date().toDateString();
        
        if (bannerClosed === today) {
            return;
        }
        
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-banner-content">
                <div class="pwa-banner-icon">📱</div>
                <div class="pwa-banner-text">
                    <strong>Instalar Yemar App</strong>
                    <p>Acesso rápido aos serviços!</p>
                </div>
                <div class="pwa-banner-actions">
                    <button class="pwa-install-btn" id="pwa-install-btn">Instalar</button>
                    <button class="pwa-close-btn" id="pwa-close-btn" aria-label="Fechar">×</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        installBanner = banner;
        
        // Adicionar event listeners
        document.getElementById('pwa-install-btn').addEventListener('click', promptInstall);
        document.getElementById('pwa-close-btn').addEventListener('click', closeBanner);
        
        // Mostrar banner com animação
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    };
    
    // Fechar banner
    const closeBanner = () => {
        if (installBanner) {
            installBanner.classList.remove('show');
            setTimeout(() => {
                installBanner.remove();
            }, 300);
            
            // Salvar que o banner foi fechado hoje
            localStorage.setItem('pwa-banner-closed', new Date().toDateString());
        }
    };
    
    // Prompt de instalação
    const promptInstall = async () => {
        console.log('promptInstall chamado');
        
        // Sempre mostrar instruções para iOS
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            showIOSInstructions();
            closeBanner();
            return;
        }
        
        if (!deferredPrompt) {
            console.log('Prompt de instalação não disponível');
            alert('Para instalar:\n1. Toque no menu do navegador (\u22ee)\n2. Selecione "Adicionar à tela inicial"');
            closeBanner();
            return;
        }
        
        try {
            // Mostrar o prompt
            await deferredPrompt.prompt();
            
            // Aguardar a escolha do usuário
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`);
            
            // Rastrear instalação
            if (outcome === 'accepted') {
                trackInstallation('accepted');
            } else {
                trackInstallation('declined');
            }
            
            // Limpar o prompt
            deferredPrompt = null;
            
        } catch (error) {
            console.error('Erro ao instalar:', error);
        } finally {
            // Sempre fechar banner
            closeBanner();
        }
    };
    
    // Mostrar instruções para iOS
    const showIOSInstructions = () => {
        const modal = document.createElement('div');
        modal.className = 'pwa-modal';
        modal.innerHTML = `
            <div class="pwa-modal-content">
                <button class="pwa-modal-close" aria-label="Fechar">×</button>
                <h3>Como instalar no iOS</h3>
                <ol class="pwa-instructions">
                    <li>Toque no botão <strong>Compartilhar</strong> <span style="font-size: 1.2em;">⎙</span></li>
                    <li>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></li>
                    <li>Toque em <strong>"Adicionar"</strong> no canto superior direito</li>
                </ol>
                <p style="margin-top: 1rem; color: var(--color-gray-500); font-size: 0.9rem;">
                    O ícone do app aparecerá na sua tela inicial!
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar modal
        modal.querySelector('.pwa-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    };
    
    // Rastrear instalação
    const trackInstallation = (outcome) => {
        // Salvar no localStorage
        const installations = JSON.parse(localStorage.getItem('pwa-installations') || '[]');
        installations.push({
            date: new Date().toISOString(),
            outcome: outcome,
            userAgent: navigator.userAgent
        });
        localStorage.setItem('pwa-installations', JSON.stringify(installations));
        
        // Rastrear visita de página (se a função existir)
        if (typeof trackPageVisit === 'function') {
            trackPageVisit('pwa-install-' + outcome);
        }
    };
    
    // Registrar Service Worker
    const registerServiceWorker = async () => {
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker não suportado');
            return;
        }
        
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registrado:', registration.scope);
            
            // Verificar atualizações
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Nova versão do Service Worker encontrada');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Nova versão disponível
                        showUpdateNotification();
                    }
                });
            });
            
        } catch (error) {
            console.error('Erro ao registrar Service Worker:', error);
        }
    };
    
    // Mostrar notificação de atualização
    const showUpdateNotification = () => {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="pwa-update-content">
                <p><strong>Nova versão disponível!</strong></p>
                <button class="pwa-update-btn" id="pwa-update-btn">Atualizar</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        document.getElementById('pwa-update-btn').addEventListener('click', () => {
            // Recarregar a página para ativar o novo service worker
            window.location.reload();
        });
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    };
    
    // Inicializar PWA
    const initPWA = () => {
        console.log('Inicializando PWA...');
        
        // Registrar Service Worker
        registerServiceWorker();
        
        // Se já estiver instalado, não mostrar banner
        if (isInstalled()) {
            console.log('App já está instalado');
            return;
        }
        
        // Capturar evento beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt disparado');
            
            // Prevenir o mini-infobar padrão do Chrome
            e.preventDefault();
            
            // Salvar o evento para usar depois
            deferredPrompt = e;
            
            // Mostrar banner de instalação (apenas em mobile)
            if (isMobile()) {
                createInstallBanner();
            }
        });
        
        // Rastrear quando o app for instalado
        window.addEventListener('appinstalled', (e) => {
            console.log('App instalado com sucesso!');
            trackInstallation('installed');
            closeBanner();
        });
        
        // Para iOS, mostrar banner após 3 segundos se for mobile e não estiver instalado
        if (isMobile() && /iPhone|iPad|iPod/.test(navigator.userAgent) && !isInstalled()) {
            setTimeout(() => {
                createInstallBanner();
            }, 3000);
        }
    };
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPWA);
    } else {
        initPWA();
    }
    
    // Expor funções globalmente para uso em outras partes do site
    window.PWAInstall = {
        prompt: promptInstall,
        isInstalled: isInstalled,
        isMobile: isMobile,
        isSupported: isPWASupported
    };
    
})();
