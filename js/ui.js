/**
 * UI.JS - Componentes de Interface
 * Renderização de cards, modais, toasts, loaders e outros elementos visuais
 */

// ============================================
// HELPER DE IMAGENS
// ============================================

/**
 * Normaliza URL de imagem (suporta URLs externas e caminhos locais)
 * @param {object} item - Objeto com propriedade imagem ou imagemUrl
 * @param {string} fallback - Imagem padrão se não encontrar
 * @returns {string} URL normalizada
 */
function getImageUrl(item, fallback = 'assets/images/placeholder.jpg') {
  // Prioridade: imagemUrl > imagem
  const imageField = item.imagemUrl || item.imagem;
  
  // Se não tem imagem, retorna fallback
  if (!imageField) return fallback;
  
  // Se é URL externa (começa com http:// ou https://), retorna diretamente
  if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
    return imageField;
  }
  
  // Se é caminho local, retorna como está (relativo à raiz do site)
  return imageField;
}

/**
 * Aplica imagem com fallback em elementos
 * @param {string} selector - Seletor CSS
 * @param {string} imageUrl - URL da imagem
 */
function applyImageWithFallback(selector, imageUrl) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el.tagName === 'IMG') {
      el.src = imageUrl;
      // Fallback se imagem falhar ao carregar
      el.onerror = function() {
        this.onerror = null; // Previne loop infinito
        this.src = 'assets/images/placeholder.jpg';
      };
    } else {
      el.style.backgroundImage = `url(${imageUrl})`;
    }
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

/**
 * Exibe uma notificação toast
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duração em ms (default: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
    // Remove toast existente
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remover
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// ============================================
// MODAL
// ============================================

/**
 * Abre um modal
 * @param {string} title - Título do modal
 * @param {string} content - Conteúdo HTML do modal
 * @param {object} options - Opções adicionais
 */
function openModal(title, content, options = {}) {
    closeModal(); // Fecha modal existente
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'modal';
    
    modal.innerHTML = `
        <div class="modal ${options.size || ''}">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animar entrada
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', handleModalEsc);
}

function handleModalEsc(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function closeModal() {
    // Usa querySelector ao invés de getElementById para compatibilidade
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    document.removeEventListener('keydown', handleModalEsc);
}

// ============================================
// LOADER
// ============================================

function showLoader() {
    // Usa querySelector ao invés de getElementById para compatibilidade
    if (document.querySelector('.loader-overlay')) return;
    
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'loader-overlay';
    loader.innerHTML = `
        <div class="loader">
            <div class="loader-spinner"></div>
            <p>A carregar...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function hideLoader() {
    // Usa querySelector ao invés de getElementById para compatibilidade
    const loader = document.querySelector('.loader-overlay');
    if (loader) {
        loader.remove();
    }
}

// ============================================
// RENDERIZAÇÃO DE CARDS
// ============================================

/**
 * Renderiza card de serviço
 */
function renderServiceCard(service) {
    const imageUrl = getImageUrl(service, 'assets/images/servico-default.jpg');
    return `
        <article class="card service-card">
            <div class="card-image">
                <img src="${imageUrl}" alt="${service.nome || service.titulo}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
                <span class="card-category">${service.categoria || 'SERVIÇO'}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${service.nome}</h3>
                <p class="card-excerpt">${truncateText(service.descricao, 100)}</p>
                <div class="card-meta">
                    <span class="card-price">${service.preco}€</span>
                    <span class="card-duration">${service.duracao}</span>
                </div>
                <a href="servico.html?id=${service.id}" class="btn btn-outline">Ver Detalhes</a>
            </div>
        </article>
    `;
}

/**
 * Renderiza card de workshop
 */
function renderWorkshopCard(workshop) {
    const imageUrl = getImageUrl(workshop, 'assets/images/workshop-default.jpg');
    return `
        <article class="card workshop-card">
            <div class="card-image">
                <img src="${imageUrl}" alt="${workshop.titulo}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
                <span class="card-category">${workshop.modalidade || 'WORKSHOP'}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${workshop.titulo}</h3>
                <p class="card-excerpt">${truncateText(workshop.descricao, 100)}</p>
                <div class="card-meta">
                    <span class="card-price">${workshop.preco}€</span>
                    <span class="card-duration">${workshop.duracao}</span>
                </div>
                <a href="workshop.html?id=${workshop.id}" class="btn btn-primary">Marque Já</a>
            </div>
        </article>
    `;
}

/**
 * Renderiza card de evento
 */
function renderEventCard(event) {
    const eventDate = new Date(event.data);
    const formattedDate = formatDate(eventDate);
    
    const imageUrl = getImageUrl(event, 'assets/images/evento-default.jpg');
    return `
        <article class="card event-card">
            <div class="card-image">
                <img src="${imageUrl}" alt="${event.titulo}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
                <div class="event-date-badge">
                    <span class="day">${eventDate.getDate()}</span>
                    <span class="month">${getMonthShort(eventDate.getMonth())}</span>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${event.titulo}</h3>
                <div class="event-info">
                    <p><strong>Data:</strong> ${formattedDate}</p>
                    <p><strong>Local:</strong> ${event.local}</p>
                    <p><strong>Vagas:</strong> ${event.vagas}</p>
                </div>
                <p class="card-excerpt">${truncateText(event.descricao, 80)}</p>
                <button class="btn btn-primary" onclick="openEventBookingModal('${event.id}')">
                    ${event.preco > 0 ? `Inscrever-se - ${event.preco}€` : 'Inscrever-se Grátis'}
                </button>
            </div>
        </article>
    `;
}

/**
 * Renderiza card de produto
 */
function renderProductCard(product) {
    const imageUrl = getImageUrl(product, 'assets/images/produto-default.jpg');
    return `
        <article class="card product-card">
            <div class="card-image">
                <img src="${imageUrl}" alt="${product.nome}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
                <span class="card-category">${product.categoria}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${product.nome}</h3>
                <p class="card-price-large">${product.preco}€</p>
                <div class="card-actions">
                    <a href="produto.html?id=${product.id}" class="btn btn-outline btn-sm">Ver Detalhes</a>
                    <button class="btn btn-primary btn-sm" onclick="addProductToCart('${product.id}')">Adicionar</button>
                </div>
            </div>
        </article>
    `;
}

/**
 * Renderiza card de post/blog
 */
function renderPostCard(post) {
    const imageUrl = getImageUrl(post, 'assets/images/blog-default.jpg');
    return `
        <article class="card post-card">
            <div class="card-image">
                <img src="${imageUrl}" alt="${post.titulo}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
            </div>
            <div class="card-content">
                <span class="post-category">${post.categoria}</span>
                <h3 class="card-title">${post.titulo}</h3>
                <p class="post-date">${formatDate(new Date(post.dataPublicacao))}</p>
                <p class="card-excerpt">${truncateText(post.excerpt, 120)}</p>
                <div class="post-meta">
                    <span class="post-likes">❤ ${post.likes || 0}</span>
                    <span class="post-comments">💬 ${(post.comentarios || []).length}</span>
                </div>
                <a href="post.html?id=${post.id}" class="btn-link">CONTINUE READING →</a>
            </div>
        </article>
    `;
}

/**
 * Renderiza card de post editorial (estilo do site modelo)
 */
function renderEditorialPostCard(post, featured = false) {
    return `
        <article class="editorial-card ${featured ? 'featured' : ''}">
            <div class="editorial-header">
                <span class="editorial-category">${post.categoria}</span>
                <h3 class="editorial-title">${post.titulo}</h3>
                <p class="editorial-date">Posted on ${formatDate(new Date(post.dataPublicacao))}</p>
            </div>
            <div class="editorial-image">
                <a href="post.html?id=${post.id}">
                    <img src="${getImageUrl(post, 'assets/images/blog-default.jpg')}" alt="${post.titulo}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
                </a>
            </div>
            <div class="editorial-content">
                <p class="editorial-excerpt">${post.excerpt}</p>
                <a href="post.html?id=${post.id}" class="btn-continue">CONTINUE READING</a>
            </div>
            <div class="editorial-actions">
                <span class="action-comments">💬 ${(post.comentarios || []).length} COMMENTS</span>
                <div class="action-share">
                    <a href="#" class="share-icon" title="Facebook">f</a>
                    <a href="#" class="share-icon" title="Twitter">t</a>
                    <a href="#" class="share-icon" title="Pinterest">p</a>
                </div>
                <span class="action-likes" onclick="handleLikePost('${post.id}')">❤ ${post.likes || 0}</span>
            </div>
        </article>
    `;
}

/**
 * Renderiza card de marcação (para minha conta)
 */
function renderBookingCard(booking) {
    const statusClass = getStatusClass(booking.status);
    const canCancel = booking.status === 'Pendente';
    
    return `
        <article class="booking-card">
            <div class="booking-header">
                <span class="booking-type">${booking.tipo}</span>
                <span class="booking-status ${statusClass}">${booking.status}</span>
            </div>
            <div class="booking-content">
                <h4 class="booking-title">${booking.itemTitulo}</h4>
                <p class="booking-datetime">
                    <strong>Data/Hora:</strong> ${booking.dataHoraOuPreferencia || 'A confirmar'}
                </p>
                ${booking.observacoes ? `<p class="booking-notes"><strong>Observações:</strong> ${booking.observacoes}</p>` : ''}
                <p class="booking-created">Criada em: ${formatDateTime(new Date(booking.createdAt))}</p>
            </div>
            ${canCancel ? `
                <div class="booking-actions">
                    <button class="btn btn-outline btn-sm" onclick="cancelUserBooking('${booking.id}')">Cancelar</button>
                </div>
            ` : ''}
        </article>
    `;
}

/**
 * Renderiza linha de tabela de marcação (para admin)
 */
function renderBookingRow(booking) {
    const user = getUserById(booking.userId);
    const statusClass = getStatusClass(booking.status);
    
    return `
        <tr>
            <td>${booking.tipo}</td>
            <td>${booking.itemTitulo}</td>
            <td>${user ? user.nome : 'N/A'}</td>
            <td>${booking.dataHoraOuPreferencia || 'A confirmar'}</td>
            <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
            <td class="actions-cell">
                ${booking.status === 'Pendente' ? `
                    <button class="btn-action btn-confirm" onclick="adminConfirmBooking('${booking.id}')" title="Confirmar">✓</button>
                    <button class="btn-action" onclick="adminEditBooking('${booking.id}')" title="Editar">✏️</button>
                    <button class="btn-action btn-cancel" onclick="adminCancelBooking('${booking.id}')" title="Cancelar">✕</button>
                    <button class="btn-action" onclick="adminSendWhatsAppToClient('${booking.id}')" title="Enviar Msg">📱</button>
                ` : ''}
                ${booking.status === 'Confirmada' ? `
                    <button class="btn-action btn-complete" onclick="adminCompleteBooking('${booking.id}')" title="Concluir">✓✓</button>
                    <button class="btn-action" onclick="adminEditBooking('${booking.id}')" title="Editar">✏️</button>
                    <button class="btn-action btn-cancel" onclick="adminCancelBooking('${booking.id}')" title="Cancelar">✕</button>
                    <button class="btn-action" onclick="adminSendWhatsAppToClient('${booking.id}')" title="Enviar Msg">📱</button>
                ` : ''}
                ${(booking.status === 'Concluída' || booking.status === 'Cancelada') ? `
                    <button class="btn-action" onclick="adminSendWhatsAppToClient('${booking.id}')" title="Enviar Msg">📱</button>
                ` : ''}
            </td>
        </tr>
    `;
}

// ============================================
// SLIDER/CAROUSEL
// ============================================

class Slider {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = container.querySelectorAll('.slide');
        this.currentIndex = 0;
        this.autoplay = options.autoplay || false;
        this.interval = options.interval || 5000;
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length <= 1) return;
        
        // Criar dots
        this.createDots();
        
        // Criar setas
        this.createArrows();
        
        // Mostrar primeiro slide
        this.showSlide(0);
        
        // Iniciar autoplay
        if (this.autoplay) {
            this.startAutoplay();
        }
    }
    
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        this.container.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider-dot');
    }
    
    createArrows() {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-arrow slider-prev';
        prevBtn.innerHTML = '‹';
        prevBtn.setAttribute('aria-label', 'Anterior');
        prevBtn.addEventListener('click', () => this.prev());
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-arrow slider-next';
        nextBtn.innerHTML = '›';
        nextBtn.setAttribute('aria-label', 'Próximo');
        nextBtn.addEventListener('click', () => this.next());
        
        this.container.appendChild(prevBtn);
        this.container.appendChild(nextBtn);
    }
    
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        if (this.dots) {
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        this.currentIndex = index;
    }
    
    goToSlide(index) {
        this.showSlide(index);
        if (this.autoplay) {
            this.resetAutoplay();
        }
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        this.autoplayTimer = setInterval(() => this.next(), this.interval);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// ============================================
// FORMULÁRIOS
// ============================================

/**
 * Renderiza formulário de marcação
 */
function renderBookingForm(tipo, item) {
    const session = getCurrentSession();
    
    if (!session) {
        return `
            <div class="booking-login-required">
                <p>Para fazer uma marcação, precisas de ter conta.</p>
                <a href="conta.html" class="btn btn-primary">Entrar / Registar</a>
            </div>
        `;
    }
    
    return `
        <form id="bookingForm" class="booking-form" onsubmit="handleBookingSubmit(event, '${tipo}', '${item.id}', '${item.nome || item.titulo}')">
            <div class="form-group">
                <label for="bookingDate">Data Pretendida *</label>
                <input type="date" id="bookingDate" name="data" required min="${getTodayDate()}">
            </div>
            <div class="form-group">
                <label for="bookingTime">Hora Pretendida *</label>
                <input type="time" id="bookingTime" name="hora" required>
            </div>
            <div class="form-group">
                <label for="bookingNotes">Observações</label>
                <textarea id="bookingNotes" name="observacoes" rows="3" placeholder="Informações adicionais..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Confirmar Marcação</button>
        </form>
    `;
}

/**
 * Renderiza formulário de contacto
 */
function renderContactForm() {
    return `
        <form id="contactForm" class="contact-form" onsubmit="handleContactSubmit(event)">
            <div class="form-group">
                <label for="contactName">Nome *</label>
                <input type="text" id="contactName" name="nome" required>
            </div>
            <div class="form-group">
                <label for="contactEmail">Email *</label>
                <input type="email" id="contactEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="contactSubject">Assunto *</label>
                <input type="text" id="contactSubject" name="assunto" required>
            </div>
            <div class="form-group">
                <label for="contactMessage">Mensagem *</label>
                <textarea id="contactMessage" name="mensagem" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Enviar Mensagem</button>
        </form>
    `;
}

// ============================================
// UTILITÁRIOS
// ============================================

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('pt-PT', options);
}

function formatDateTime(date) {
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('pt-PT', options);
}

function getMonthShort(monthIndex) {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return months[monthIndex];
}

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getStatusClass(status) {
    const classes = {
        'Pendente': 'status-pending',
        'Confirmada': 'status-confirmed',
        'Cancelada': 'status-cancelled',
        'Concluída': 'status-completed'
    };
    return classes[status] || '';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// PESQUISA
// ============================================

function renderSearchResults(results) {
    let html = '<div class="search-results">';
    
    const totalResults = 
        results.services.length + 
        results.workshops.length + 
        results.products.length + 
        results.posts.length + 
        results.events.length;
    
    if (totalResults === 0) {
        html += '<p class="no-results">Nenhum resultado encontrado.</p>';
    } else {
        if (results.services.length > 0) {
            html += '<div class="search-section"><h4>Serviços</h4>';
            results.services.forEach(s => {
                html += `<a href="servico.html?id=${s.id}" class="search-result-item">${s.nome}</a>`;
            });
            html += '</div>';
        }
        
        if (results.workshops.length > 0) {
            html += '<div class="search-section"><h4>Workshops</h4>';
            results.workshops.forEach(w => {
                html += `<a href="workshop.html?id=${w.id}" class="search-result-item">${w.titulo}</a>`;
            });
            html += '</div>';
        }
        
        if (results.products.length > 0) {
            html += '<div class="search-section"><h4>Produtos</h4>';
            results.products.forEach(p => {
                html += `<a href="produto.html?id=${p.id}" class="search-result-item">${p.nome}</a>`;
            });
            html += '</div>';
        }
        
        if (results.posts.length > 0) {
            html += '<div class="search-section"><h4>Blog</h4>';
            results.posts.forEach(p => {
                html += `<a href="post.html?id=${p.id}" class="search-result-item">${p.titulo}</a>`;
            });
            html += '</div>';
        }
        
        if (results.events.length > 0) {
            html += '<div class="search-section"><h4>Eventos</h4>';
            results.events.forEach(e => {
                html += `<a href="eventos.html" class="search-result-item">${e.titulo}</a>`;
            });
            html += '</div>';
        }
    }
    
    html += '</div>';
    return html;
}

// ============================================
// MINI CARRINHO
// ============================================

function renderMiniCart() {
    const cart = getCart();
    const itemCount = getCartItemCount();
    const total = getCartTotal();
    
    if (cart.length === 0) {
        return `
            <div class="mini-cart-empty">
                <p>O teu carrinho está vazio</p>
                <a href="produtos.html" class="btn btn-outline btn-sm">Ver Produtos</a>
            </div>
        `;
    }
    
    let itemsHtml = '';
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            itemsHtml += `
                <div class="mini-cart-item">
                    <img src="${product.imagemUrl}" alt="${product.nome}" loading="lazy">
                    <div class="mini-cart-item-info">
                        <p class="mini-cart-item-name">${product.nome}</p>
                        <p class="mini-cart-item-price">${item.quantidade}x ${product.preco}€</p>
                    </div>
                    <button class="mini-cart-remove" onclick="removeProductFromCart('${product.id}')">&times;</button>
                </div>
            `;
        }
    });
    
    return `
        <div class="mini-cart-items">${itemsHtml}</div>
        <div class="mini-cart-total">
            <span>Total:</span>
            <span class="total-value">${total.toFixed(2)}€</span>
        </div>
        <div class="mini-cart-actions">
            <button class="btn btn-outline btn-sm" onclick="clearCartItems()">Limpar</button>
            <button class="btn btn-primary btn-sm" onclick="showToast('Checkout simulado!', 'success')">Finalizar</button>
        </div>
    `;
}

function updateCartBadge() {
    // Usa querySelectorAll para atualizar TODOS os badges (desktop + mobile)
    const badges = document.querySelectorAll('#cartBadge, .cart-badge');
    if (badges.length > 0) {
        const count = getCartItemCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
}
