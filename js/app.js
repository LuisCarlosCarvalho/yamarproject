/**
 * APP.JS - Lógica Principal da Aplicação
 * Estado global, autenticação, guards, handlers e inicialização
 */

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar storage/seed
    initializeSeed();
    
    // Atualizar UI baseado na sessão
    updateAuthUI();
    
    // Atualizar badge do carrinho
    updateCartBadge();
    
    // Inicializar menu mobile
    initMobileMenu();
    
    // Inicializar dropdowns
    initDropdowns();
    
    // Inicializar pesquisa
    initSearch();
    
    // Aplicar configurações do site
    applySiteSettings();
    
    // Verificar proteção de rotas
    checkRouteProtection();
});

// ============================================
// MENU MOBILE
// ============================================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    
    // Fechar ao clicar em link
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });
}

// ============================================
// DROPDOWNS
// ============================================

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Desktop: hover
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    menu.classList.add('show');
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    menu.classList.remove('show');
                }
            });
            
            // Mobile: click
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    menu.classList.toggle('show');
                }
            });
        }
    });
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// ============================================
// PESQUISA
// ============================================

function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('open');
            if (searchInput) searchInput.focus();
        });
    }
    
    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('open');
        });
    }
    
    if (searchInput && searchResults) {
        const debouncedSearch = debounce((query) => {
            if (query.length >= 2) {
                const results = searchAll(query);
                searchResults.innerHTML = renderSearchResults(results);
            } else {
                searchResults.innerHTML = '';
            }
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('open')) {
            searchOverlay.classList.remove('open');
        }
    });
}

// ============================================
// AUTENTICAÇÃO UI
// ============================================

function updateAuthUI() {
    const session = getCurrentSession();
    const authLinks = document.querySelectorAll('.auth-link');
    const adminLinks = document.querySelectorAll('.admin-link');
    const userLinks = document.querySelectorAll('.user-link');
    const guestLinks = document.querySelectorAll('.guest-link');
    
    if (session) {
        // Usuário logado
        authLinks.forEach(el => {
            el.innerHTML = `
                <a href="conta.html" style="margin-right: 10px;">${session.nome}</a>
                <a href="#" onclick="logout(); return false;" style="color: #c9a227; font-size: 0.9em;">Sair</a>
            `;
        });
        
        userLinks.forEach(el => el.style.display = '');
        guestLinks.forEach(el => el.style.display = 'none');
        
        // Mostrar link admin se for admin
        if (session.role === 'admin') {
            adminLinks.forEach(el => el.style.display = '');
        } else {
            adminLinks.forEach(el => el.style.display = 'none');
        }
    } else {
        // Visitante
        authLinks.forEach(el => {
            el.innerHTML = '<a href="conta.html">Entrar</a>';
        });
        
        userLinks.forEach(el => el.style.display = 'none');
        guestLinks.forEach(el => el.style.display = '');
        adminLinks.forEach(el => el.style.display = 'none');
    }
}

// ============================================
// PROTEÇÃO DE ROTAS
// ============================================

function checkRouteProtection() {
    const currentPage = window.location.pathname.split('/').pop();
    const session = getCurrentSession();
    
    // Páginas que requerem login
    const protectedPages = [];
    
    // Páginas que requerem admin
    const adminPages = ['admin.html'];
    
    if (protectedPages.includes(currentPage)) {
        if (!session) {
            window.location.href = 'conta.html';
            return;
        }
    }
    
    if (adminPages.includes(currentPage)) {
        if (!session || session.role !== 'admin') {
            showToast('Acesso restrito a administradores', 'error');
            window.location.href = 'conta.html';
            return;
        }
    }
}

// ============================================
// CONFIGURAÇÕES DO SITE
// ============================================

function applySiteSettings() {
    const settings = getSiteSettings();
    
    // Aplicar logo
    const logoElements = document.querySelectorAll('.logo-text');
    logoElements.forEach(el => {
        el.textContent = settings.logoText || 'YEMAR MAKEUP ARTIST';
    });
    
    // Aplicar tagline
    const taglineElements = document.querySelectorAll('.tagline');
    taglineElements.forEach(el => {
        el.textContent = settings.tagline || 'Yemar Makeup Artist';
    });
    
    // Controlar visibilidade da loja
    const shopEnabled = settings.shopEnabled !== false;
    
    // Ocultar ícone do carrinho
    const cartIcon = document.getElementById('cartIconBtn');
    if (cartIcon) {
        cartIcon.style.display = shopEnabled ? 'flex' : 'none';
    }
    
    // Ocultar links e elementos da loja
    const shopLinks = document.querySelectorAll('.shop-link');
    shopLinks.forEach(link => {
        link.style.display = shopEnabled ? '' : 'none';
    });
    
    const shopElements = document.querySelectorAll('.shop-element');
    shopElements.forEach(element => {
        element.style.display = shopEnabled ? '' : 'none';
    });
    
    // Ocultar seção de produtos na homepage
    const productsSection = document.getElementById('productsSection');
    if (productsSection) {
        productsSection.style.display = shopEnabled ? 'block' : 'none';
    }
    
    // Aplicar logo imagem se existir
    if (settings.logoUrl) {
        const logoImgs = document.querySelectorAll('.logo-img');
        logoImgs.forEach(img => {
            img.src = settings.logoUrl;
            img.style.display = 'block';
        });
    }
    
    // Aplicar foto do rodapé
    const footerAvatar = document.getElementById('footerAvatar');
    if (footerAvatar) {
        // Usa footerAvatarUrl se existir, senão usa aboutImageUrl, senão usa padrão
        footerAvatar.src = settings.footerAvatarUrl || settings.aboutImageUrl || 'assets/images/capa.png';
    }
}

// ============================================
// HANDLERS DE AUTENTICAÇÃO
// ============================================

function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value.trim();
    const senha = form.senha.value;
    
    const user = validateLogin(email, senha);
    
    if (user) {
        setCurrentSession(user);
        showToast('Login efetuado com sucesso!', 'success');
        
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'conta.html';
            }
        }, 1000);
    } else {
        showToast('Email ou senha incorretos', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const senha = form.senha.value;
    const confirmarSenha = form.confirmarSenha.value;
    
    // Validações
    if (senha !== confirmarSenha) {
        showToast('As senhas não coincidem', 'error');
        return;
    }
    
    if (senha.length < 6) {
        showToast('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    if (getUserByEmail(email)) {
        showToast('Este email já está registado', 'error');
        return;
    }
    
    // Criar usuário
    const newUser = createUser({ nome, email, telefone, senha });
    
    // Login automático
    setCurrentSession(newUser);
    showToast('Conta criada com sucesso!', 'success');
    
    setTimeout(() => {
        window.location.href = 'conta.html';
    }, 1000);
}

function handleLogout() {
    clearSession();
    showToast('Sessão terminada', 'info');
    window.location.href = 'index.html';
}

// ============================================
// HANDLERS DE MARCAÇÕES
// ============================================

function handleBookingSubmit(event, tipo, itemId, itemTitulo) {
    event.preventDefault();
    
    const session = getCurrentSession();
    if (!session) {
        showToast('Precisas de estar logado para fazer marcações', 'error');
        return;
    }
    
    const form = event.target;
    const data = form.data.value;
    const hora = form.hora.value;
    const observacoes = form.observacoes?.value || '';
    
    // Validar data não é no passado
    const selectedDate = new Date(data + 'T' + hora);
    if (selectedDate < new Date()) {
        showToast('Não é possível marcar para datas passadas', 'error');
        return;
    }
    
    const booking = createBooking({
        userId: session.userId,
        tipo: tipo,
        itemId: itemId,
        itemTitulo: itemTitulo,
        dataHoraOuPreferencia: `${data} às ${hora}`,
        observacoes: observacoes
    });
    
    closeModal();
    showToast('Marcação criada com sucesso! Aguarda confirmação.', 'success');
    
    // Redirecionar para minha conta
    setTimeout(() => {
        window.location.href = 'conta.html';
    }, 2000);
}

function openBookingModal(tipo, item) {
    const content = renderBookingForm(tipo, item);
    openModal(`Marcar ${item.nome || item.titulo}`, content);
}

function openEventBookingModal(eventId) {
    const event = getEventById(eventId);
    if (!event) return;
    
    const session = getCurrentSession();
    
    if (!session) {
        openModal('Inscrição no Evento', `
            <div class="booking-login-required">
                <p>Para te inscreveres neste evento, precisas de ter conta.</p>
                <a href="conta.html" class="btn btn-primary">Entrar / Registar</a>
            </div>
        `);
        return;
    }
    
    const content = `
        <div class="event-booking-info">
            <h4>${event.titulo}</h4>
            <p><strong>Data:</strong> ${formatDateTime(new Date(event.data))}</p>
            <p><strong>Local:</strong> ${event.local}</p>
            <p><strong>Vagas disponíveis:</strong> ${event.vagas}</p>
            ${event.preco > 0 ? `<p><strong>Preço:</strong> ${event.preco}€</p>` : '<p><strong>Entrada:</strong> Gratuita</p>'}
        </div>
        <form id="eventBookingForm" onsubmit="handleEventBooking(event, '${event.id}', '${event.titulo}')">
            <div class="form-group">
                <label for="eventNotes">Observações (opcional)</label>
                <textarea id="eventNotes" name="observacoes" rows="3" placeholder="Alguma informação adicional..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Confirmar Inscrição</button>
        </form>
    `;
    
    openModal('Inscrição no Evento', content);
}

function handleEventBooking(e, eventId, eventTitulo) {
    e.preventDefault();
    
    const session = getCurrentSession();
    if (!session) return;
    
    const event = getEventById(eventId);
    const observacoes = document.getElementById('eventNotes')?.value || '';
    
    const booking = createBooking({
        userId: session.userId,
        tipo: 'Evento',
        itemId: eventId,
        itemTitulo: eventTitulo,
        dataHoraOuPreferencia: formatDateTime(new Date(event.data)),
        observacoes: observacoes
    });
    
    closeModal();
    showToast('Inscrição realizada com sucesso!', 'success');
}

function cancelUserBooking(bookingId) {
    if (confirm('Tens a certeza que queres cancelar esta marcação?')) {
        cancelBooking(bookingId);
        showToast('Marcação cancelada', 'info');
        loadUserBookings(); // Recarregar lista
    }
}

// ============================================
// HANDLERS DE CONTACTO
// ============================================

function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const assunto = form.assunto.value.trim();
    const mensagem = form.mensagem.value.trim();
    
    // Simular envio
    showToast('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');
    form.reset();
}

// ============================================
// HANDLERS DE CARRINHO
// ============================================

function addProductToCart(productId) {
    addToCart(productId, 1);
    updateCartBadge();
    showToast('Produto adicionado ao carrinho!', 'success');
}

function removeProductFromCart(productId) {
    removeFromCart(productId);
    updateCartBadge();
    updateMiniCartDisplay();
    showToast('Produto removido do carrinho', 'info');
}

function clearCartItems() {
    clearCart();
    updateCartBadge();
    updateMiniCartDisplay();
    showToast('Carrinho limpo', 'info');
}

function updateMiniCartDisplay() {
    const miniCartContent = document.getElementById('miniCartContent');
    if (miniCartContent) {
        miniCartContent.innerHTML = renderMiniCart();
    }
}

function toggleMiniCart() {
    const miniCart = document.getElementById('miniCart');
    if (miniCart) {
        miniCart.classList.toggle('open');
        updateMiniCartDisplay();
    }
}

// ============================================
// HANDLERS DE POSTS/BLOG
// ============================================

function handleLikePost(postId) {
    likePost(postId);
    // Atualizar UI
    const post = getPostById(postId);
    if (post) {
        const likeElements = document.querySelectorAll(`[data-post-id="${postId}"] .action-likes, .post-likes[data-id="${postId}"]`);
        likeElements.forEach(el => {
            el.textContent = `❤ ${post.likes}`;
        });
    }
    showToast('Gostaste deste post!', 'success');
}

function handleCommentSubmit(event, postId) {
    event.preventDefault();
    
    const form = event.target;
    const nome = form.nome.value.trim();
    const mensagem = form.mensagem.value.trim();
    
    if (!nome || !mensagem) {
        showToast('Preenche todos os campos', 'error');
        return;
    }
    
    addComment(postId, { nome, mensagem });
    showToast('Comentário adicionado!', 'success');
    form.reset();
    
    // Recarregar comentários
    loadPostComments(postId);
}

// ============================================
// HANDLERS ADMIN
// ============================================

function adminConfirmBooking(bookingId) {
    confirmBooking(bookingId);
    showToast('Marcação confirmada!', 'success');
    loadAdminBookings();
}

function adminCancelBooking(bookingId) {
    if (confirm('Tens a certeza que queres cancelar esta marcação?')) {
        cancelBooking(bookingId);
        showToast('Marcação cancelada', 'info');
        loadAdminBookings();
    }
}

function adminCompleteBooking(bookingId) {
    completeBooking(bookingId);
    showToast('Marcação concluída!', 'success');
    loadAdminBookings();
}

// ============================================
// FUNÇÕES DE CARREGAMENTO DE PÁGINAS
// ============================================

function loadHomeContent() {
    // Carregar imagem do perfil das configurações
    const settings = getSiteSettings();
    const welcomeAvatar = document.getElementById('welcomeAvatar');
    if (welcomeAvatar && settings.welcomeAvatarUrl) {
        welcomeAvatar.src = settings.welcomeAvatarUrl;
    }
    
    // Carregar serviços
    const servicesContainer = document.getElementById('servicesGrid');
    if (servicesContainer) {
        const services = getActiveServices().slice(0, 6);
        servicesContainer.innerHTML = services.map(s => renderServiceCard(s)).join('');
    }
    
    // Carregar workshops
    const workshopsContainer = document.getElementById('workshopsGrid');
    if (workshopsContainer) {
        const workshops = getActiveWorkshops().slice(0, 4);
        workshopsContainer.innerHTML = workshops.map(w => renderWorkshopCard(w)).join('');
    }
    
    // Carregar produtos
    const productsContainer = document.getElementById('productsGrid');
    if (productsContainer) {
        const products = getActiveProducts().slice(0, 8);
        productsContainer.innerHTML = products.map(p => renderProductCard(p)).join('');
    }
    
    // Carregar posts
    const postsContainer = document.getElementById('postsGrid');
    if (postsContainer) {
        const posts = getActivePosts().slice(0, 4);
        postsContainer.innerHTML = posts.map(p => renderEditorialPostCard(p)).join('');
    }
    
    // Carregar carrossel de certificados
    loadCertificatesCarousel();
    
    // Carregar slider de posts
    const sliderContainer = document.getElementById('featuredSlider');
    if (sliderContainer) {
        const posts = getActivePosts().slice(0, 3);
        sliderContainer.innerHTML = posts.map((p, i) => `
            <div class="slide ${i === 0 ? 'active' : ''}">
                <a href="post.html?id=${p.id}" class="slide-link">
                    <img src="${p.imagemUrl}" alt="${p.titulo}" loading="lazy">
                    <div class="slide-content">
                        <span class="slide-category">${p.categoria}</span>
                        <h3 class="slide-title">${p.titulo}</h3>
                        <p class="slide-date">${formatDate(new Date(p.dataPublicacao))}</p>
                    </div>
                </a>
            </div>
        `).join('');
        
        // Inicializar slider
        new Slider(sliderContainer, { autoplay: true, interval: 5000 });
    }
    
    // Aplicar banner (settings já declarado acima)
    const heroBanner = document.getElementById('heroBanner');
    if (heroBanner && settings.bannerImagemUrl) {
        heroBanner.style.backgroundImage = `url(${settings.bannerImagemUrl})`;
    }
    
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.textContent = settings.bannerTitulo;
    
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) heroSubtitle.textContent = settings.bannerSubtitulo;
    
    const heroCta = document.getElementById('heroCta');
    if (heroCta) heroCta.textContent = settings.bannerCta;
}

function loadServicesPage() {
    const container = document.getElementById('servicesContainer');
    if (container) {
        const services = getActiveServices();
        container.innerHTML = services.map(s => renderServiceCard(s)).join('');
    }
}

function loadServiceDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'servicos.html';
        return;
    }
    
    const service = getServiceById(id);
    if (!service) {
        showToast('Serviço não encontrado', 'error');
        window.location.href = 'servicos.html';
        return;
    }
    
    // Preencher página
    document.getElementById('serviceImage').src = service.imagemUrl;
    document.getElementById('serviceImage').alt = service.nome;
    document.getElementById('serviceCategory').textContent = service.categoria || 'SERVIÇO';
    document.getElementById('serviceTitle').textContent = service.nome;
    document.getElementById('servicePrice').textContent = `${service.preco}€`;
    document.getElementById('serviceDuration').textContent = service.duracao;
    document.getElementById('serviceDescription').innerHTML = service.descricao.replace(/\n/g, '<br>');
    
    // Botão de marcação
    const bookBtn = document.getElementById('bookServiceBtn');
    if (bookBtn) {
        bookBtn.onclick = () => openBookingModal('Serviço', service);
    }
    
    document.title = `${service.nome} - Yemar Makeup Artist`;
}

function loadWorkshopsPage() {
    const container = document.getElementById('workshopsContainer');
    if (container) {
        const workshops = getActiveWorkshops();
        container.innerHTML = workshops.map(w => renderWorkshopCard(w)).join('');
    }
}

function loadWorkshopDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'workshops.html';
        return;
    }
    
    const workshop = getWorkshopById(id);
    if (!workshop) {
        showToast('Workshop não encontrado', 'error');
        window.location.href = 'workshops.html';
        return;
    }
    
    // Preencher página
    document.getElementById('workshopImage').src = workshop.imagemUrl;
    document.getElementById('workshopImage').alt = workshop.titulo;
    document.getElementById('workshopModality').textContent = workshop.modalidade;
    document.getElementById('workshopTitle').textContent = workshop.titulo;
    document.getElementById('workshopPrice').textContent = `${workshop.preco}€`;
    document.getElementById('workshopDuration').textContent = workshop.duracao;
    document.getElementById('workshopVagas').textContent = `${workshop.vagas} vagas`;
    document.getElementById('workshopDescription').innerHTML = workshop.descricao.replace(/\n/g, '<br>');
    if (workshop.observacoes) {
        document.getElementById('workshopNotes').innerHTML = workshop.observacoes.replace(/\n/g, '<br>');
    }
    
    // Botão de marcação
    const bookBtn = document.getElementById('bookWorkshopBtn');
    if (bookBtn) {
        bookBtn.onclick = () => openBookingModal('Workshop', workshop);
    }
    
    document.title = `${workshop.titulo} - Yemar Makeup Artist`;
}

function loadEventsPage() {
    const container = document.getElementById('eventsContainer');
    if (container) {
        const events = getUpcomingEvents();
        if (events.length === 0) {
            container.innerHTML = '<p class="no-items">Não há eventos agendados de momento.</p>';
        } else {
            container.innerHTML = events.map(e => renderEventCard(e)).join('');
        }
    }
}

function loadProductsPage() {
    const container = document.getElementById('productsContainer');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (container) {
        let products = getActiveProducts();
        
        // Preencher filtro de categorias
        if (categoryFilter && categoryFilter.options.length <= 1) {
            const categories = getProductCategories();
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categoryFilter.appendChild(option);
            });
        }
        
        // Aplicar filtros
        const selectedCategory = categoryFilter?.value;
        const selectedSort = sortFilter?.value;
        
        if (selectedCategory) {
            products = products.filter(p => p.categoria === selectedCategory);
        }
        
        if (selectedSort === 'price-asc') {
            products.sort((a, b) => a.preco - b.preco);
        } else if (selectedSort === 'price-desc') {
            products.sort((a, b) => b.preco - a.preco);
        } else if (selectedSort === 'name') {
            products.sort((a, b) => a.nome.localeCompare(b.nome));
        }
        
        container.innerHTML = products.map(p => renderProductCard(p)).join('');
    }
}

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'produtos.html';
        return;
    }
    
    const product = getProductById(id);
    if (!product) {
        showToast('Produto não encontrado', 'error');
        window.location.href = 'produtos.html';
        return;
    }
    
    // Preencher página
    document.getElementById('productImage').src = product.imagemUrl;
    document.getElementById('productImage').alt = product.nome;
    document.getElementById('productCategory').textContent = product.categoria;
    document.getElementById('productTitle').textContent = product.nome;
    document.getElementById('productPrice').textContent = `${product.preco}€`;
    document.getElementById('productDescription').innerHTML = product.descricao.replace(/\n/g, '<br>');
    
    // Botão de adicionar ao carrinho
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
        addBtn.onclick = () => addProductToCart(product.id);
    }
    
    document.title = `${product.nome} - Yemar Makeup Artist`;
}

function loadBlogPage() {
    const container = document.getElementById('postsContainer');
    if (container) {
        const posts = getActivePosts();
        container.innerHTML = posts.map(p => renderEditorialPostCard(p)).join('');
    }
}

function loadPostDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'blog.html';
        return;
    }
    
    const post = getPostById(id);
    if (!post) {
        showToast('Post não encontrado', 'error');
        window.location.href = 'blog.html';
        return;
    }
    
    // Preencher página
    document.getElementById('postCategory').textContent = post.categoria;
    document.getElementById('postTitle').textContent = post.titulo;
    document.getElementById('postDate').textContent = `Posted on ${formatDate(new Date(post.dataPublicacao))}`;
    document.getElementById('postImage').src = post.imagemUrl;
    document.getElementById('postImage').alt = post.titulo;
    document.getElementById('postContent').innerHTML = post.conteudo.replace(/\n/g, '<br>');
    document.getElementById('postLikes').textContent = `❤ ${post.likes || 0}`;
    document.getElementById('postLikes').onclick = () => handleLikePost(post.id);
    
    // Carregar comentários
    loadPostComments(id);
    
    document.title = `${post.titulo} - Yemar Makeup Artist`;
}

function loadPostComments(postId) {
    const container = document.getElementById('commentsContainer');
    const post = getPostById(postId);
    
    if (container && post) {
        const comments = post.comentarios || [];
        
        if (comments.length === 0) {
            container.innerHTML = '<p class="no-comments">Ainda não há comentários. Sê o primeiro a comentar!</p>';
        } else {
            container.innerHTML = comments.map(c => `
                <div class="comment">
                    <div class="comment-header">
                        <strong>${c.nome}</strong>
                        <span class="comment-date">${formatDateTime(new Date(c.createdAt))}</span>
                    </div>
                    <p class="comment-text">${c.mensagem}</p>
                </div>
            `).join('');
        }
    }
}

function loadUserBookings() {
    const container = document.getElementById('bookingsContainer');
    const session = getCurrentSession();
    
    if (container && session) {
        const bookings = getBookingsByUser(session.userId);
        
        if (bookings.length === 0) {
            container.innerHTML = '<p class="no-items">Ainda não tens marcações.</p>';
        } else {
            // Ordenar por data de criação (mais recentes primeiro)
            bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            container.innerHTML = bookings.map(b => renderBookingCard(b)).join('');
        }
    }
}

function loadContactPage() {
    const settings = getSiteSettings();
    
    const emailContacto = document.getElementById('emailContacto');
    if (emailContacto) emailContacto.textContent = settings.emailContacto;
    
    const emailColaboracao = document.getElementById('emailColaboracao');
    if (emailColaboracao) emailColaboracao.textContent = settings.emailColaboracao;
    
    const telefone = document.getElementById('telefoneContacto');
    if (telefone) telefone.textContent = settings.telefone;
    
    const endereco = document.getElementById('enderecoContacto');
    if (endereco) endereco.textContent = settings.endereco;
}

// ============================================
// FUNÇÕES ADMIN
// ============================================

function loadAdminDashboard() {
    const stats = getDashboardStats();
    
    document.getElementById('statPendentes').textContent = stats.pendentes;
    document.getElementById('statConfirmadas').textContent = stats.confirmadas;
    document.getElementById('statUsers').textContent = stats.totalUsers;
    document.getElementById('statProducts').textContent = stats.totalProducts;
    document.getElementById('statServices').textContent = stats.totalServices;
    document.getElementById('statEvents').textContent = stats.upcomingEvents;
}

function loadAdminBookings() {
    const container = document.getElementById('bookingsTableBody');
    if (container) {
        const bookings = getBookings();
        bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        container.innerHTML = bookings.map(b => renderBookingRow(b)).join('');
    }
}

function loadAdminSection(section) {
    // Esconder todas as seções
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(`section-${section}`);
    if (targetSection) targetSection.style.display = 'block';
    
    // Atualizar menu ativo
    document.querySelectorAll('.admin-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });
    
    // Carregar dados da seção
    switch(section) {
        case 'dashboard':
            loadAdminDashboard();
            break;
        case 'bookings':
            loadAdminBookings();
            break;
        case 'services':
            loadAdminServices();
            break;
        case 'workshops':
            loadAdminWorkshops();
            break;
        case 'events':
            loadAdminEvents();
            break;
        case 'products':
            loadAdminProducts();
            break;
        case 'posts':
            loadAdminPosts();
            break;
        case 'settings':
            loadAdminSettings();
            break;
    }
}

function loadAdminServices() {
    const container = document.getElementById('servicesTableBody');
    if (container) {
        const services = getServices();
        container.innerHTML = services.map(s => `
            <tr>
                <td>${s.nome}</td>
                <td>${s.categoria || '-'}</td>
                <td>${s.preco}€</td>
                <td>${s.duracao}</td>
                <td><span class="status-badge ${s.ativo ? 'status-confirmed' : 'status-cancelled'}">${s.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn-action" onclick="editService('${s.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteServiceItem('${s.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadAdminWorkshops() {
    const container = document.getElementById('workshopsTableBody');
    if (container) {
        const workshops = getWorkshops();
        container.innerHTML = workshops.map(w => `
            <tr>
                <td>${w.titulo}</td>
                <td>${w.modalidade}</td>
                <td>${w.preco}€</td>
                <td>${w.duracao}</td>
                <td><span class="status-badge ${w.ativo ? 'status-confirmed' : 'status-cancelled'}">${w.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn-action" onclick="editWorkshop('${w.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteWorkshopItem('${w.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadAdminEvents() {
    const container = document.getElementById('eventsTableBody');
    if (container) {
        const events = getEvents();
        container.innerHTML = events.map(e => `
            <tr>
                <td>${e.titulo}</td>
                <td>${formatDateTime(new Date(e.data))}</td>
                <td>${e.local}</td>
                <td>${e.vagas}</td>
                <td><span class="status-badge ${e.ativo ? 'status-confirmed' : 'status-cancelled'}">${e.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn-action" onclick="editEvent('${e.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteEventItem('${e.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadAdminProducts() {
    const container = document.getElementById('productsTableBody');
    if (container) {
        const products = getProducts();
        container.innerHTML = products.map(p => `
            <tr>
                <td>${p.nome}</td>
                <td>${p.categoria}</td>
                <td>${p.preco}€</td>
                <td>${p.estoque || 0}</td>
                <td><span class="status-badge ${p.ativo ? 'status-confirmed' : 'status-cancelled'}">${p.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn-action" onclick="editProduct('${p.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteProductItem('${p.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadAdminPosts() {
    const container = document.getElementById('postsTableBody');
    if (container) {
        const posts = getPosts();
        container.innerHTML = posts.map(p => `
            <tr>
                <td>${p.titulo}</td>
                <td>${p.categoria}</td>
                <td>${formatDate(new Date(p.dataPublicacao))}</td>
                <td>${p.likes || 0}</td>
                <td><span class="status-badge ${p.ativo ? 'status-confirmed' : 'status-cancelled'}">${p.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn-action" onclick="editPost('${p.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deletePostItem('${p.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadAdminSettings() {
    const settings = getSiteSettings();
    
    document.getElementById('settingsLogoText').value = settings.logoText || '';
    document.getElementById('settingsTagline').value = settings.tagline || '';
    document.getElementById('settingsLogoUrl').value = settings.logoUrl || '';
    document.getElementById('settingsBannerTitle').value = settings.bannerTitulo || '';
    document.getElementById('settingsBannerSubtitle').value = settings.bannerSubtitulo || '';
    document.getElementById('settingsBannerImage').value = settings.bannerImagemUrl || '';
    document.getElementById('settingsBannerCta').value = settings.bannerCta || '';
    document.getElementById('settingsEmailContacto').value = settings.emailContacto || '';
    document.getElementById('settingsEmailColaboracao').value = settings.emailColaboracao || '';
    document.getElementById('settingsTelefone').value = settings.telefone || '';
    document.getElementById('settingsEndereco').value = settings.endereco || '';
    document.getElementById('settingsFacebook').value = settings.redesSociais?.facebook || '';
    document.getElementById('settingsInstagram').value = settings.redesSociais?.instagram || '';
    document.getElementById('settingsTwitter').value = settings.redesSociais?.twitter || '';
    document.getElementById('settingsYoutube').value = settings.redesSociais?.youtube || '';
}

function saveAdminSettings(event) {
    event.preventDefault();
    
    const settings = {
        logoText: document.getElementById('settingsLogoText').value,
        tagline: document.getElementById('settingsTagline').value,
        logoUrl: document.getElementById('settingsLogoUrl').value,
        bannerTitulo: document.getElementById('settingsBannerTitle').value,
        bannerSubtitulo: document.getElementById('settingsBannerSubtitle').value,
        bannerImagemUrl: document.getElementById('settingsBannerImage').value,
        bannerCta: document.getElementById('settingsBannerCta').value,
        emailContacto: document.getElementById('settingsEmailContacto').value,
        emailColaboracao: document.getElementById('settingsEmailColaboracao').value,
        telefone: document.getElementById('settingsTelefone').value,
        endereco: document.getElementById('settingsEndereco').value,
        redesSociais: {
            facebook: document.getElementById('settingsFacebook').value,
            instagram: document.getElementById('settingsInstagram').value,
            twitter: document.getElementById('settingsTwitter').value,
            youtube: document.getElementById('settingsYoutube').value
        }
    };
    
    updateSiteSettings(settings);
    showToast('Configurações guardadas com sucesso!', 'success');
    applySiteSettings();
}

// ============================================
// CRUD MODALS
// ============================================

function openAddServiceModal() {
    const content = `
        <form id="serviceForm" onsubmit="handleServiceSubmit(event)">
            <div class="form-group">
                <label for="serviceName">Nome *</label>
                <input type="text" id="serviceName" name="nome" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="servicePrice">Preço (€) *</label>
                    <input type="number" id="servicePrice" name="preco" required min="0">
                </div>
                <div class="form-group">
                    <label for="serviceDuration">Duração *</label>
                    <input type="text" id="serviceDuration" name="duracao" required placeholder="Ex: 2 horas">
                </div>
            </div>
            <div class="form-group">
                <label for="serviceCategory">Categoria</label>
                <input type="text" id="serviceCategory" name="categoria" placeholder="Ex: Noivas, Social">
            </div>
            <div class="form-group">
                <label for="serviceImage">URL da Imagem</label>
                <input type="url" id="serviceImage" name="imagemUrl">
            </div>
            <div class="form-group">
                <label for="serviceDesc">Descrição *</label>
                <textarea id="serviceDesc" name="descricao" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="serviceActive" name="ativo" checked> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Adicionar Serviço', content);
}

function handleServiceSubmit(event, editId = null) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        nome: form.nome.value,
        preco: parseFloat(form.preco.value),
        duracao: form.duracao.value,
        categoria: form.categoria.value,
        imagemUrl: form.imagemUrl.value || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
        descricao: form.descricao.value,
        ativo: form.ativo.checked
    };
    
    if (editId) {
        updateService(editId, data);
        showToast('Serviço atualizado!', 'success');
    } else {
        createService(data);
        showToast('Serviço criado!', 'success');
    }
    
    closeModal();
    loadAdminServices();
}

function editService(id) {
    const service = getServiceById(id);
    if (!service) return;
    
    const content = `
        <form id="serviceForm" onsubmit="handleServiceSubmit(event, '${id}')">
            <div class="form-group">
                <label for="serviceName">Nome *</label>
                <input type="text" id="serviceName" name="nome" value="${service.nome}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="servicePrice">Preço (€) *</label>
                    <input type="number" id="servicePrice" name="preco" value="${service.preco}" required min="0">
                </div>
                <div class="form-group">
                    <label for="serviceDuration">Duração *</label>
                    <input type="text" id="serviceDuration" name="duracao" value="${service.duracao}" required>
                </div>
            </div>
            <div class="form-group">
                <label for="serviceCategory">Categoria</label>
                <input type="text" id="serviceCategory" name="categoria" value="${service.categoria || ''}">
            </div>
            <div class="form-group">
                <label for="serviceImage">URL da Imagem</label>
                <input type="url" id="serviceImage" name="imagemUrl" value="${service.imagemUrl || ''}">
            </div>
            <div class="form-group">
                <label for="serviceDesc">Descrição *</label>
                <textarea id="serviceDesc" name="descricao" rows="4" required>${service.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="serviceActive" name="ativo" ${service.ativo ? 'checked' : ''}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Editar Serviço', content);
}

function deleteServiceItem(id) {
    if (confirm('Tens a certeza que queres eliminar este serviço?')) {
        deleteService(id);
        showToast('Serviço eliminado', 'info');
        loadAdminServices();
    }
}

// Similar functions for workshops, events, products, posts...
function openAddWorkshopModal() {
    const content = `
        <form id="workshopForm" onsubmit="handleWorkshopSubmit(event)">
            <div class="form-group">
                <label for="workshopTitle">Título *</label>
                <input type="text" id="workshopTitle" name="titulo" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="workshopPrice">Preço (€) *</label>
                    <input type="number" id="workshopPrice" name="preco" required min="0">
                </div>
                <div class="form-group">
                    <label for="workshopDuration">Duração *</label>
                    <input type="text" id="workshopDuration" name="duracao" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="workshopModality">Modalidade *</label>
                    <select id="workshopModality" name="modalidade" required>
                        <option value="Presencial">Presencial</option>
                        <option value="Online">Online</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="workshopVagas">Vagas *</label>
                    <input type="number" id="workshopVagas" name="vagas" required min="1">
                </div>
            </div>
            <div class="form-group">
                <label for="workshopImage">URL da Imagem</label>
                <input type="url" id="workshopImage" name="imagemUrl">
            </div>
            <div class="form-group">
                <label for="workshopDesc">Descrição *</label>
                <textarea id="workshopDesc" name="descricao" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label for="workshopNotes">Observações</label>
                <textarea id="workshopNotes" name="observacoes" rows="2"></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="workshopActive" name="ativo" checked> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Adicionar Workshop', content);
}

function handleWorkshopSubmit(event, editId = null) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        titulo: form.titulo.value,
        preco: parseFloat(form.preco.value),
        duracao: form.duracao.value,
        modalidade: form.modalidade.value,
        vagas: parseInt(form.vagas.value),
        imagemUrl: form.imagemUrl.value || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
        descricao: form.descricao.value,
        observacoes: form.observacoes.value,
        ativo: form.ativo.checked
    };
    
    if (editId) {
        updateWorkshop(editId, data);
        showToast('Workshop atualizado!', 'success');
    } else {
        createWorkshop(data);
        showToast('Workshop criado!', 'success');
    }
    
    closeModal();
    loadAdminWorkshops();
}

function editWorkshop(id) {
    const workshop = getWorkshopById(id);
    if (!workshop) return;
    
    const content = `
        <form id="workshopForm" onsubmit="handleWorkshopSubmit(event, '${id}')">
            <div class="form-group">
                <label for="workshopTitle">Título *</label>
                <input type="text" id="workshopTitle" name="titulo" value="${workshop.titulo}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="workshopPrice">Preço (€) *</label>
                    <input type="number" id="workshopPrice" name="preco" value="${workshop.preco}" required min="0">
                </div>
                <div class="form-group">
                    <label for="workshopDuration">Duração *</label>
                    <input type="text" id="workshopDuration" name="duracao" value="${workshop.duracao}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="workshopModality">Modalidade *</label>
                    <select id="workshopModality" name="modalidade" required>
                        <option value="Presencial" ${workshop.modalidade === 'Presencial' ? 'selected' : ''}>Presencial</option>
                        <option value="Online" ${workshop.modalidade === 'Online' ? 'selected' : ''}>Online</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="workshopVagas">Vagas *</label>
                    <input type="number" id="workshopVagas" name="vagas" value="${workshop.vagas}" required min="1">
                </div>
            </div>
            <div class="form-group">
                <label for="workshopImage">URL da Imagem</label>
                <input type="url" id="workshopImage" name="imagemUrl" value="${workshop.imagemUrl || ''}">
            </div>
            <div class="form-group">
                <label for="workshopDesc">Descrição *</label>
                <textarea id="workshopDesc" name="descricao" rows="4" required>${workshop.descricao}</textarea>
            </div>
            <div class="form-group">
                <label for="workshopNotes">Observações</label>
                <textarea id="workshopNotes" name="observacoes" rows="2">${workshop.observacoes || ''}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="workshopActive" name="ativo" ${workshop.ativo ? 'checked' : ''}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Editar Workshop', content);
}

function deleteWorkshopItem(id) {
    if (confirm('Tens a certeza que queres eliminar este workshop?')) {
        deleteWorkshop(id);
        showToast('Workshop eliminado', 'info');
        loadAdminWorkshops();
    }
}

// Events CRUD
function openAddEventModal() {
    const content = `
        <form id="eventForm" onsubmit="handleEventSubmit(event)">
            <div class="form-group">
                <label for="eventTitle">Título *</label>
                <input type="text" id="eventTitle" name="titulo" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="eventDate">Data e Hora *</label>
                    <input type="datetime-local" id="eventDate" name="data" required min="${getTodayDate()}T00:00">
                </div>
                <div class="form-group">
                    <label for="eventVagas">Vagas *</label>
                    <input type="number" id="eventVagas" name="vagas" required min="1">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="eventLocal">Local *</label>
                    <input type="text" id="eventLocal" name="local" required>
                </div>
                <div class="form-group">
                    <label for="eventPrice">Preço (€)</label>
                    <input type="number" id="eventPrice" name="preco" min="0" value="0">
                </div>
            </div>
            <div class="form-group">
                <label for="eventImage">URL da Imagem</label>
                <input type="url" id="eventImage" name="imagemUrl">
            </div>
            <div class="form-group">
                <label for="eventDesc">Descrição *</label>
                <textarea id="eventDesc" name="descricao" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="eventActive" name="ativo" checked> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Adicionar Evento', content);
}

function handleEventSubmit(event, editId = null) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        titulo: form.titulo.value,
        data: form.data.value,
        local: form.local.value,
        vagas: parseInt(form.vagas.value),
        preco: parseFloat(form.preco.value) || 0,
        imagemUrl: form.imagemUrl.value || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
        descricao: form.descricao.value,
        ativo: form.ativo.checked
    };
    
    if (editId) {
        updateEvent(editId, data);
        showToast('Evento atualizado!', 'success');
    } else {
        createEvent(data);
        showToast('Evento criado!', 'success');
    }
    
    closeModal();
    loadAdminEvents();
}

function editEvent(id) {
    const evt = getEventById(id);
    if (!evt) return;
    
    const content = `
        <form id="eventForm" onsubmit="handleEventSubmit(event, '${id}')">
            <div class="form-group">
                <label for="eventTitle">Título *</label>
                <input type="text" id="eventTitle" name="titulo" value="${evt.titulo}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="eventDate">Data e Hora *</label>
                    <input type="datetime-local" id="eventDate" name="data" value="${evt.data}" required>
                </div>
                <div class="form-group">
                    <label for="eventVagas">Vagas *</label>
                    <input type="number" id="eventVagas" name="vagas" value="${evt.vagas}" required min="1">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="eventLocal">Local *</label>
                    <input type="text" id="eventLocal" name="local" value="${evt.local}" required>
                </div>
                <div class="form-group">
                    <label for="eventPrice">Preço (€)</label>
                    <input type="number" id="eventPrice" name="preco" value="${evt.preco || 0}" min="0">
                </div>
            </div>
            <div class="form-group">
                <label for="eventImage">URL da Imagem</label>
                <input type="url" id="eventImage" name="imagemUrl" value="${evt.imagemUrl || ''}">
            </div>
            <div class="form-group">
                <label for="eventDesc">Descrição *</label>
                <textarea id="eventDesc" name="descricao" rows="4" required>${evt.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="eventActive" name="ativo" ${evt.ativo ? 'checked' : ''}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Editar Evento', content);
}

function deleteEventItem(id) {
    if (confirm('Tens a certeza que queres eliminar este evento?')) {
        deleteEvent(id);
        showToast('Evento eliminado', 'info');
        loadAdminEvents();
    }
}

// Products CRUD
function openAddProductModal() {
    const content = `
        <form id="productForm" onsubmit="handleProductSubmit(event)">
            <div class="form-group">
                <label for="productName">Nome *</label>
                <input type="text" id="productName" name="nome" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="productPrice">Preço (€) *</label>
                    <input type="number" id="productPrice" name="preco" required min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label for="productStock">Estoque</label>
                    <input type="number" id="productStock" name="estoque" min="0" value="0">
                </div>
            </div>
            <div class="form-group">
                <label for="productCategory">Categoria *</label>
                <input type="text" id="productCategory" name="categoria" required placeholder="Ex: Pincéis, Olhos, Rosto">
            </div>
            <div class="form-group">
                <label for="productImage">URL da Imagem</label>
                <input type="url" id="productImage" name="imagemUrl">
            </div>
            <div class="form-group">
                <label for="productDesc">Descrição *</label>
                <textarea id="productDesc" name="descricao" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="productActive" name="ativo" checked> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Adicionar Produto', content);
}

function handleProductSubmit(event, editId = null) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        nome: form.nome.value,
        preco: parseFloat(form.preco.value),
        estoque: parseInt(form.estoque.value) || 0,
        categoria: form.categoria.value,
        imagemUrl: form.imagemUrl.value || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
        descricao: form.descricao.value,
        ativo: form.ativo.checked
    };
    
    if (editId) {
        updateProduct(editId, data);
        showToast('Produto atualizado!', 'success');
    } else {
        createProduct(data);
        showToast('Produto criado!', 'success');
    }
    
    closeModal();
    loadAdminProducts();
}

function editProduct(id) {
    const product = getProductById(id);
    if (!product) return;
    
    const content = `
        <form id="productForm" onsubmit="handleProductSubmit(event, '${id}')">
            <div class="form-group">
                <label for="productName">Nome *</label>
                <input type="text" id="productName" name="nome" value="${product.nome}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="productPrice">Preço (€) *</label>
                    <input type="number" id="productPrice" name="preco" value="${product.preco}" required min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label for="productStock">Estoque</label>
                    <input type="number" id="productStock" name="estoque" value="${product.estoque || 0}" min="0">
                </div>
            </div>
            <div class="form-group">
                <label for="productCategory">Categoria *</label>
                <input type="text" id="productCategory" name="categoria" value="${product.categoria}" required>
            </div>
            <div class="form-group">
                <label for="productImage">URL da Imagem</label>
                <input type="url" id="productImage" name="imagemUrl" value="${product.imagemUrl || ''}">
            </div>
            <div class="form-group">
                <label for="productDesc">Descrição *</label>
                <textarea id="productDesc" name="descricao" rows="4" required>${product.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="productActive" name="ativo" ${product.ativo ? 'checked' : ''}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Editar Produto', content);
}

function deleteProductItem(id) {
    if (confirm('Tens a certeza que queres eliminar este produto?')) {
        deleteProduct(id);
        showToast('Produto eliminado', 'info');
        loadAdminProducts();
    }
}

// Posts CRUD
function openAddPostModal() {
    const content = `
        <form id="postForm" onsubmit="handlePostSubmit(event)">
            <div class="form-group">
                <label for="postTitle">Título *</label>
                <input type="text" id="postTitle" name="titulo" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="postCategory">Categoria *</label>
                    <input type="text" id="postCategory" name="categoria" required placeholder="Ex: Tendências, Dicas">
                </div>
                <div class="form-group">
                    <label for="postDate">Data de Publicação *</label>
                    <input type="date" id="postDate" name="dataPublicacao" required value="${getTodayDate()}">
                </div>
            </div>
            <div class="form-group">
                <label for="postImage">URL da Imagem</label>
                <input type="url" id="postImage" name="imagemUrl">
            </div>
            <div class="form-group">
                <label for="postExcerpt">Resumo *</label>
                <textarea id="postExcerpt" name="excerpt" rows="2" required placeholder="Breve resumo do post"></textarea>
            </div>
            <div class="form-group">
                <label for="postContent">Conteúdo *</label>
                <textarea id="postContent" name="conteudo" rows="6" required></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="postActive" name="ativo" checked> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Adicionar Post', content, { size: 'large' });
}

function handlePostSubmit(event, editId = null) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        titulo: form.titulo.value,
        categoria: form.categoria.value,
        dataPublicacao: form.dataPublicacao.value,
        imagemUrl: form.imagemUrl.value || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
        excerpt: form.excerpt.value,
        conteudo: form.conteudo.value,
        autor: 'Yemar Makeup Artist',
        ativo: form.ativo.checked
    };
    
    if (editId) {
        updatePost(editId, data);
        showToast('Post atualizado!', 'success');
    } else {
        createPost(data);
        showToast('Post criado!', 'success');
    }
    
    closeModal();
    loadAdminPosts();
}

function editPost(id) {
    const post = getPostById(id);
    if (!post) return;
    
    const content = `
        <form id="postForm" onsubmit="handlePostSubmit(event, '${id}')">
            <div class="form-group">
                <label for="postTitle">Título *</label>
                <input type="text" id="postTitle" name="titulo" value="${post.titulo}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="postCategory">Categoria *</label>
                    <input type="text" id="postCategory" name="categoria" value="${post.categoria}" required>
                </div>
                <div class="form-group">
                    <label for="postDate">Data de Publicação *</label>
                    <input type="date" id="postDate" name="dataPublicacao" value="${post.dataPublicacao}" required>
                </div>
            </div>
            <div class="form-group">
                <label for="postImage">URL da Imagem</label>
                <input type="url" id="postImage" name="imagemUrl" value="${post.imagemUrl || ''}">
            </div>
            <div class="form-group">
                <label for="postExcerpt">Resumo *</label>
                <textarea id="postExcerpt" name="excerpt" rows="2" required>${post.excerpt}</textarea>
            </div>
            <div class="form-group">
                <label for="postContent">Conteúdo *</label>
                <textarea id="postContent" name="conteudo" rows="6" required>${post.conteudo}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="postActive" name="ativo" ${post.ativo ? 'checked' : ''}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
    openModal('Editar Post', content, { size: 'large' });
}

function deletePostItem(id) {
    if (confirm('Tens a certeza que queres eliminar este post?')) {
        deletePost(id);
        showToast('Post eliminado', 'info');
        loadAdminPosts();
    }
}


// ============================================
// PÁGINA DE CONTA
// ============================================

function loadAccountPage() {
    const session = getCurrentSession();
    const authArea = document.getElementById('authArea');
    const profileArea = document.getElementById('profileArea');
    
    if (session) {
        // Usuário logado - mostrar perfil
        if (authArea) authArea.style.display = 'none';
        if (profileArea) profileArea.style.display = 'block';
        
        // Preencher dados do usuário
        document.getElementById('userName').textContent = session.nome;
        document.getElementById('userEmail').textContent = session.email;
        
        // Carregar marcações e encomendas
        loadUserBookings();
        loadUserOrders();
        loadUserSettings();
        
        // Inicializar tabs do perfil
        initProfileTabs();
    } else {
        // Visitante - mostrar login/registo
        if (authArea) authArea.style.display = 'block';
        if (profileArea) profileArea.style.display = 'none';
        
        // Inicializar tabs de auth
        initAuthTabs();
        
        // Inicializar forms
        initAuthForms();
    }
}

function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab[data-tab]');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.tab === 'login') {
                loginForm.classList.add('active');
                loginForm.style.display = 'block';
                registerForm.classList.remove('active');
                registerForm.style.display = 'none';
            } else {
                registerForm.classList.add('active');
                registerForm.style.display = 'block';
                loginForm.classList.remove('active');
                loginForm.style.display = 'none';
            }
        });
    });
}

function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const senha = document.getElementById('loginPassword').value;
            
            const user = validateLogin(email, senha);
            
            if (user) {
                setCurrentSession(user);
                showToast('Login efetuado com sucesso!', 'success');
                
                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            } else {
                showToast('Email ou senha incorretos', 'error');
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('registerName').value.trim();
            const telefone = document.getElementById('registerPhone').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const senha = document.getElementById('registerPassword').value;
            const confirmarSenha = document.getElementById('registerPasswordConfirm').value;
            
            if (senha !== confirmarSenha) {
                showToast('As senhas não coincidem', 'error');
                return;
            }
            
            if (senha.length < 6) {
                showToast('A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            
            if (getUserByEmail(email)) {
                showToast('Este email já está registado', 'error');
                return;
            }
            
            const newUser = createUser({ nome, email, telefone, senha });
            setCurrentSession(newUser);
            showToast('Conta criada com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
}

function initProfileTabs() {
    const tabs = document.querySelectorAll('.auth-tab[data-profile-tab]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Esconder todas as tabs
            document.querySelectorAll('.profile-tab').forEach(t => {
                t.style.display = 'none';
                t.classList.remove('active');
            });
            
            // Mostrar tab selecionada
            const tabId = tab.dataset.profileTab + 'Tab';
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.style.display = 'block';
                tabContent.classList.add('active');
            }
        });
    });
}

function loadUserBookings() {
    const container = document.getElementById('userBookings');
    if (!container) return;
    
    const session = getCurrentSession();
    if (!session) return;
    
    const bookings = getUserBookings(session.id);
    
    if (bookings.length === 0) {
        container.innerHTML = '<p class="no-items">Ainda não tens marcações.</p>';
        return;
    }
    
    container.innerHTML = bookings.map(b => `
        <div class="booking-card">
            <div class="booking-info">
                <h4>${b.itemTitulo}</h4>
                <p><strong>Tipo:</strong> ${b.tipo}</p>
                <p><strong>Data/Hora:</strong> ${b.dataHoraOuPreferencia}</p>
                <p><strong>Estado:</strong> <span class="status-badge status-${b.estado}">${getStatusLabel(b.estado)}</span></p>
            </div>
            ${b.estado === 'pending' ? `<button class="btn btn-outline btn-sm" onclick="cancelUserBooking('${b.id}')">Cancelar</button>` : ''}
        </div>
    `).join('');
}

function loadUserOrders() {
    const container = document.getElementById('userOrders');
    if (!container) return;
    
    const session = getCurrentSession();
    if (!session) return;
    
    const orders = getUserOrders(session.id);
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="no-items">Ainda não tens encomendas.</p>';
        return;
    }
    
    container.innerHTML = orders.map(o => `
        <div class="order-card">
            <div class="order-info">
                <h4>Encomenda #${o.id.slice(-6).toUpperCase()}</h4>
                <p><strong>Data:</strong> ${formatDate(new Date(o.createdAt))}</p>
                <p><strong>Total:</strong> ${o.total}€</p>
                <p><strong>Estado:</strong> <span class="status-badge status-${o.estado}">${getOrderStatusLabel(o.estado)}</span></p>
            </div>
        </div>
    `).join('');
}

function loadUserSettings() {
    const session = getCurrentSession();
    if (!session) {
        console.log('loadUserSettings: Sem sessão');
        return;
    }
    
    console.log('loadUserSettings: Sessão encontrada', session);
    
    // Usar dados da sessão diretamente
    const user = session;
    
    // Aguardar DOM estar pronto
    setTimeout(() => {
        // Preencher campos
        const nameInput = document.getElementById('settingsName');
        const phoneInput = document.getElementById('settingsPhone');
        const emailInput = document.getElementById('settingsEmail');
        
        if (nameInput) nameInput.value = user.nome || '';
        if (phoneInput) phoneInput.value = user.telefone || '';
        if (emailInput) emailInput.value = user.email || '';
        
        console.log('Campos preenchidos:', {
            nome: nameInput?.value,
            telefone: phoneInput?.value,
            email: emailInput?.value
        });
        
        // Configurar formulário
        const settingsForm = document.getElementById('settingsForm');
        if (!settingsForm) {
            console.error('Formulário settingsForm não encontrado!');
            return;
        }
        
        // Remover listeners antigos
        if (settingsForm.dataset.initialized === 'true') {
            console.log('Formulário já inicializado, pulando...');
            return;
        }
        
        settingsForm.dataset.initialized = 'true';
        console.log('Inicializando formulário de settings');
        
        // Event listener no formulário
        settingsForm.addEventListener('submit', handleSettingsSubmit);
        
        // Event listener direto no botão como fallback
        const submitBtn = settingsForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                console.log('Botão clicado diretamente');
                if (!settingsForm.checkValidity()) {
                    return; // Deixa validação HTML5 funcionar
                }
                e.preventDefault();
                handleSettingsSubmit(e);
            });
        }
    }, 200);
}

function handleSettingsSubmit(e) {
    e.preventDefault();
    console.log('handleSettingsSubmit chamado');
    
    const session = getCurrentSession();
    if (!session) {
        console.error('Sem sessão ao salvar');
        showToast('Erro: Sessão expirada', 'error');
        return;
    }
    
    const nome = document.getElementById('settingsName').value.trim();
    const telefone = document.getElementById('settingsPhone').value.trim();
    const email = document.getElementById('settingsEmail').value.trim();
    
    console.log('Dados do formulário:', { nome, telefone, email });
    
    if (!nome || !email || !telefone) {
        console.log('Validação falhou: campo obrigatório vazio');
        showToast('Nome, telefone e email são obrigatórios!', 'error');
        return;
    }
    
    console.log('Salvando diretamente no localStorage...');
    
    // Forçar salvamento direto no localStorage
    const users = getUsers();
    console.log('Usuários antes da atualização:', users);
    console.log('Sessão atual:', session);
    
    // Buscar por email (mais confiável que ID)
    const userIndex = users.findIndex(u => u.email.toLowerCase() === session.email.toLowerCase());
    console.log('Índice do usuário (busca por email):', userIndex);
    
    if (userIndex === -1) {
        console.error('Usuário não encontrado na lista');
        console.log('Tentando buscar por ID como fallback...');
        const userIndexById = users.findIndex(u => u.id === session.id);
        console.log('Índice por ID:', userIndexById);
        
        if (userIndexById === -1) {
            showToast('Erro: Usuário não encontrado', 'error');
            return;
        }
        
        // Usar índice encontrado por ID
        const finalIndex = userIndexById;
        
        // Atualizar dados
        users[finalIndex] = {
            ...users[finalIndex],
            nome: nome,
            telefone: telefone,
            email: email
        };
        
        console.log('Usuário atualizado (via ID):', users[finalIndex]);
        
        // Salvar
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Dados salvos no localStorage');
        
        // Atualizar sessão
        setCurrentSession(users[finalIndex]);
        showToast('Dados atualizados com sucesso!', 'success');
        updateAuthUI();
        return;
    }
    
    // Atualizar dados do usuário
    users[userIndex] = {
        ...users[userIndex],
        nome: nome,
        telefone: telefone,
        email: email
    };
    
    console.log('Usuário atualizado:', users[userIndex]);
    
    // Salvar diretamente no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Dados salvos no localStorage');
    
    // Verificar se foi salvo
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const savedUser = savedUsers.find(u => u.id === session.id);
    console.log('Usuário verificado após salvar:', savedUser);
    
    // Atualizar sessão
    setCurrentSession(users[userIndex]);
    
    showToast('Dados atualizados com sucesso!', 'success');
    
    // Atualizar UI
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    
    if (userNameEl) userNameEl.textContent = nome;
    if (userEmailEl) userEmailEl.textContent = email;
    
    // Atualizar auth UI
    updateAuthUI();
    
    console.log('Salvamento concluído com sucesso!');
}

function logout() {
    clearSession();
    showToast('Sessão terminada', 'info');
    window.location.href = 'index.html';
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Pendente',
        'confirmed': 'Confirmada',
        'completed': 'Concluída',
        'cancelled': 'Cancelada'
    };
    return labels[status] || status;
}

function getOrderStatusLabel(status) {
    const labels = {
        'pending': 'Pendente',
        'processing': 'Em Processamento',
        'shipped': 'Enviada',
        'delivered': 'Entregue',
        'cancelled': 'Cancelada'
    };
    return labels[status] || status;
}

// ============================================
// PÁGINA DO CARRINHO
// ============================================

function loadCartPage() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItems) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>O teu carrinho está vazio</h3>
                <p>Adiciona produtos para continuar.</p>
                <a href="produtos.html" class="btn btn-primary">Ver Produtos</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    let subtotal = 0;
    
    cartItems.innerHTML = cart.map(item => {
        const product = getProductById(item.productId);
        if (!product) return '';
        
        const itemTotal = product.preco * item.quantidade;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${product.imagemUrl}" alt="${product.nome}" loading="lazy">
                <div class="cart-item-info">
                    <h3>${product.nome}</h3>
                    <p>Quantidade: ${item.quantidade}</p>
                </div>
                <span class="cart-item-price">${itemTotal}€</span>
                <span class="cart-item-remove" onclick="removeProductFromCart('${item.productId}')">&times;</span>
            </div>
        `;
    }).join('');
    
    if (cartSummary) {
        cartSummary.style.display = 'block';
        document.getElementById('cartSubtotal').textContent = `${subtotal}€`;
        document.getElementById('cartTotal').textContent = `${subtotal}€`;
    }
}

function checkout() {
    const session = getCurrentSession();
    
    if (!session) {
        showToast('Precisas de estar logado para finalizar a compra', 'error');
        setTimeout(() => {
            window.location.href = 'conta.html';
        }, 1500);
        return;
    }
    
    const cart = getCart();
    if (cart.length === 0) {
        showToast('O teu carrinho está vazio', 'error');
        return;
    }
    
    // Calcular total
    let total = 0;
    const items = cart.map(item => {
        const product = getProductById(item.productId);
        if (product) {
            total += product.preco * item.quantity;
            return {
                productId: item.productId,
                nome: product.nome,
                preco: product.preco,
                quantity: item.quantity
            };
        }
        return null;
    }).filter(Boolean);
    
    // Criar encomenda
    const order = createOrder({
        userId: session.id,
        items: items,
        total: total
    });
    
    // Limpar carrinho
    clearCart();
    updateCartBadge();
    
    showToast('Encomenda realizada com sucesso!', 'success');
    
    setTimeout(() => {
        window.location.href = 'conta.html';
    }, 2000);
}

// ============================================
// PÁGINA DE EVENTO
// ============================================

function loadEventDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'eventos.html';
        return;
    }
    
    const event = getEventById(id);
    if (!event) {
        showToast('Evento não encontrado', 'error');
        window.location.href = 'eventos.html';
        return;
    }
    
    // Preencher página
    document.getElementById('eventImage').src = event.imagemUrl;
    document.getElementById('eventImage').alt = event.titulo;
    document.getElementById('eventTitle').textContent = event.titulo;
    document.getElementById('eventDate').textContent = formatDate(new Date(event.data));
    document.getElementById('eventTime').textContent = new Date(event.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('eventLocation').textContent = event.local;
    document.getElementById('eventSpots').textContent = event.vagas;
    document.getElementById('eventPrice').textContent = event.preco > 0 ? `${event.preco}€` : 'Gratuito';
    document.getElementById('eventDescription').innerHTML = event.descricao.replace(/\n/g, '<br>');
    
    // Botão de inscrição
    const bookBtn = document.getElementById('bookEventBtn');
    if (bookBtn) {
        bookBtn.onclick = () => openEventBookingModal(event.id);
    }
    
    document.title = `${event.titulo} - Yemar Makeup Artist`;
}

// ============================================
// PÁGINA ADMIN
// ============================================

function loadAdminPage() {
    const session = getCurrentSession();
    
    if (!session || session.role !== 'admin') {
        showToast('Acesso restrito a administradores', 'error');
        window.location.href = 'conta.html';
        return;
    }
    
    // Carregar dashboard
    loadAdminDashboard();
    
    // Inicializar navegação
    initAdminNav();
    
    // Inicializar formulários de configurações
    initAdminSettingsForms();
    
    // Carregar portfólio e certificados
    loadPortfolioImagesAdmin();
    loadCertificatesAdmin();
    
    // Carregar analytics
    loadAnalyticsStats();
}

function initAdminNav() {
    const navItems = document.querySelectorAll('.admin-menu-item');
    const mobileNavItems = document.querySelectorAll('#mobileAdminNav a');
    
    const allItems = [...navItems, ...mobileNavItems];
    
    allItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const section = item.dataset.section;
            
            // Atualizar active state
            navItems.forEach(i => i.classList.remove('active'));
            mobileNavItems.forEach(i => i.classList.remove('active'));
            
            document.querySelectorAll(`[data-section="${section}"]`).forEach(i => i.classList.add('active'));
            
            // Esconder todas as seções
            document.querySelectorAll('.admin-section').forEach(s => {
                s.classList.remove('active');
                s.style.display = 'none';
            });
            
            // Mostrar seção selecionada
            const sectionEl = document.getElementById(section + 'Section');
            if (sectionEl) {
                sectionEl.classList.add('active');
                sectionEl.style.display = 'block';
                
                // Carregar dados da seção
                loadAdminSection(section);
            }
            
            // Fechar menu mobile
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });
}

function loadAdminSection(section) {
    switch(section) {
        case 'dashboard':
            loadAdminDashboard();
            break;
        case 'bookings':
            loadAdminBookings();
            break;
        case 'orders':
            loadAdminOrders();
            break;
        case 'services':
            loadAdminServices();
            break;
        case 'workshops':
            loadAdminWorkshops();
            break;
        case 'products':
            loadAdminProducts();
            break;
        case 'posts':
            loadAdminPosts();
            break;
        case 'events':
            loadAdminEvents();
            break;
        case 'users':
            loadAdminUsers();
            break;
        case 'messages':
            loadAdminMessages();
            break;
        case 'reports':
            loadAdminReports();
            break;
        case 'settings':
            loadAdminSettingsPage();
            break;
    }
}

function loadAdminReports() {
    initializeReportDates();
    loadReports();
}

function loadAdminDashboard() {
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
        const stats = getAdminStats();
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                    <h3>${stats.pendingBookings || 0}</h3>
                    <p>Marcações Pendentes</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-info">
                    <h3>${stats.pendingOrders || 0}</h3>
                    <p>Encomendas Pendentes</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                    <h3>${stats.totalUsers || 0}</h3>
                    <p>Utilizadores</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🛍️</div>
                <div class="stat-info">
                    <h3>${stats.totalProducts || 0}</h3>
                    <p>Produtos</p>
                </div>
            </div>
        `;
    }
    
    // Carregar marcações recentes
    const recentBookings = document.getElementById('recentBookings');
    if (recentBookings) {
        const bookings = getBookings().slice(0, 5);
        if (bookings.length === 0) {
            recentBookings.innerHTML = '<p class="no-items">Sem marcações recentes.</p>';
        } else {
            recentBookings.innerHTML = bookings.map(b => `
                <div class="recent-item">
                    <strong>${b.itemTitulo}</strong>
                    <span class="status-badge status-${b.estado}">${getStatusLabel(b.estado)}</span>
                </div>
            `).join('');
        }
    }
    
    // Carregar encomendas recentes
    const recentOrders = document.getElementById('recentOrders');
    if (recentOrders) {
        const orders = getOrders().slice(0, 5);
        if (orders.length === 0) {
            recentOrders.innerHTML = '<p class="no-items">Sem encomendas recentes.</p>';
        } else {
            recentOrders.innerHTML = orders.map(o => `
                <div class="recent-item">
                    <strong>#${o.id.slice(-6).toUpperCase()}</strong> - ${o.total}€
                    <span class="status-badge status-${o.estado}">${getOrderStatusLabel(o.estado)}</span>
                </div>
            `).join('');
        }
    }
}

function loadAdminUsers() {
    const container = document.getElementById('usersTableBody');
    if (container) {
        const users = getUsers();
        container.innerHTML = users.map(u => `
            <tr>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.telefone || '-'}</td>
                <td><span class="status-badge ${u.role === 'admin' ? 'status-confirmed' : 'status-pending'}">${u.role === 'admin' ? 'Admin' : 'Utilizador'}</span></td>
                <td>${formatDate(new Date(u.createdAt))}</td>
            </tr>
        `).join('');
    }
}

function loadAdminMessages() {
    const container = document.getElementById('messagesTableBody');
    if (container) {
        const messages = getMessages ? getMessages() : [];
        if (messages.length === 0) {
            container.innerHTML = '<tr><td colspan="6">Sem mensagens.</td></tr>';
        } else {
            container.innerHTML = messages.map(m => `
                <tr>
                    <td>${m.nome}</td>
                    <td>${m.email}</td>
                    <td>${m.assunto}</td>
                    <td>${formatDate(new Date(m.createdAt))}</td>
                    <td><span class="status-badge ${m.lida ? 'status-confirmed' : 'status-pending'}">${m.lida ? 'Lida' : 'Nova'}</span></td>
                    <td>
                        <button class="btn-action" onclick="viewMessage('${m.id}')" title="Ver">👁</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

function loadAdminSettingsPage() {
    // Carregar configurações existentes se houver
    const settings = getSiteSettings();
    
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroImage = document.getElementById('heroImage');
    const heroCta = document.getElementById('heroCta');
    const contactEmail = document.getElementById('settingsContactEmail');
    const contactPhone = document.getElementById('settingsContactPhone');
    const contactAddress = document.getElementById('settingsAddress');
    const contactWhatsApp = document.getElementById('settingsWhatsApp');
    const contactMapUrl = document.getElementById('settingsMapUrl');
    const whatsappTemplate = document.getElementById('whatsappNotificationTemplate');
    
    if (heroTitle) heroTitle.value = settings.bannerTitulo || 'Realça a Tua Beleza Natural';
    if (heroSubtitle) heroSubtitle.value = settings.bannerSubtitulo || 'Maquilhagem profissional para todos os momentos especiais da tua vida';
    if (heroImage) heroImage.value = settings.bannerImagemUrl || '';
    if (heroCta) heroCta.value = settings.bannerCta || 'Marcar Agora';
    if (contactEmail) contactEmail.value = settings.emailContacto || 'yemarmk@gmail.com';
    if (contactPhone) contactPhone.value = settings.telefone || '(+351) 933758731';
    if (contactAddress) contactAddress.value = settings.endereco || '';
    if (contactWhatsApp) contactWhatsApp.value = settings.whatsapp || '351933758731';
    if (contactMapUrl) contactMapUrl.value = settings.mapUrl || '';
    if (whatsappTemplate) whatsappTemplate.value = settings.whatsappNotificationTemplate || getDefaultWhatsAppTemplate();
    
    // Form handlers
    const heroForm = document.getElementById('heroSettingsForm');
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentSettings = getSiteSettings();
            updateSiteSettings({
                ...currentSettings,
                bannerTitulo: document.getElementById('heroTitle').value,
                bannerSubtitulo: document.getElementById('heroSubtitle').value,
                bannerImagemUrl: document.getElementById('heroImage').value,
                bannerCta: document.getElementById('heroCta').value
            });
            
            showToast('Configurações do banner guardadas!', 'success');
        });
    }
    
    const contactForm = document.getElementById('contactSettingsForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentSettings = getSiteSettings();
            updateSiteSettings({
                ...currentSettings,
                emailContacto: document.getElementById('settingsContactEmail').value,
                telefone: document.getElementById('settingsContactPhone').value,
                whatsapp: document.getElementById('settingsWhatsApp').value,
                endereco: document.getElementById('settingsAddress').value,
                mapUrl: document.getElementById('settingsMapUrl').value
            });
            
            showToast('Informações de contacto guardadas!', 'success');
        });
    }
    
    // Carregar imagens existentes
    const welcomeAvatarUrl = document.getElementById('welcomeAvatarUrl');
    const aboutImageUrl = document.getElementById('aboutImageUrl');
    const footerAvatarUrl = document.getElementById('footerAvatarUrl');
    
    if (welcomeAvatarUrl) welcomeAvatarUrl.value = settings.welcomeAvatarUrl || 'assets/images/logo_name.png';
    if (aboutImageUrl) aboutImageUrl.value = settings.aboutImageUrl || 'assets/images/capa.png';
    if (footerAvatarUrl) footerAvatarUrl.value = settings.footerAvatarUrl || 'assets/images/capa.png';
    
    // Form handler para imagens
    const imagesForm = document.getElementById('imagesSettingsForm');
    if (imagesForm) {
        imagesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentSettings = getSiteSettings();
            updateSiteSettings({
                ...currentSettings,
                welcomeAvatarUrl: document.getElementById('welcomeAvatarUrl').value,
                aboutImageUrl: document.getElementById('aboutImageUrl').value,
                footerAvatarUrl: document.getElementById('footerAvatarUrl').value
            });
            
            showToast('Imagens guardadas! Recarregue a página para ver as alterações.', 'success');
        });
    }
    
    // Form handler para mensagens WhatsApp
    const whatsappForm = document.getElementById('whatsappSettingsForm');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentSettings = getSiteSettings();
            updateSiteSettings({
                ...currentSettings,
                whatsappNotificationTemplate: document.getElementById('whatsappNotificationTemplate').value
            });
            
            showToast('Mensagem WhatsApp guardada!', 'success');
        });
    }
}

function getDefaultWhatsAppTemplate() {
    return `🔔 *Nova Marcação Recebida!*

*Cliente:* {clienteNome}
*Email:* {clienteEmail}
*Telefone:* {clienteTelefone}

*{tipoServico}:* {nomeServico}
*Data:* {data}
*Hora:* {hora}

*Status:* Pendente

Por favor, confirme esta marcação no painel administrativo.

_Yemar Makeup Artist_`;
}

function resetData() {
    if (confirm('Tens a certeza? Isto irá repor todos os dados para os valores iniciais.')) {
        localStorage.clear();
        initializeSeed();
        showToast('Dados repostos com sucesso!', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

function exportData() {
    const data = {
        users: getUsers(),
        services: getServices(),
        workshops: getWorkshops(),
        products: getProducts(),
        posts: getPosts(),
        events: getEvents(),
        bookings: getBookings(),
        orders: getOrders(),
        settings: getSiteSettings()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yemar-makeup-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Dados exportados com sucesso!', 'success');
}

function getAdminStats() {
    return {
        pendingBookings: getBookings().filter(b => b.estado === 'pending').length,
        pendingOrders: getOrders().filter(o => o.estado === 'pending').length,
        totalUsers: getUsers().length,
        totalProducts: getProducts().length
    };
}

// Funções auxiliares para admin modals
function openServiceModal() {
    openAddServiceModal();
}

function openWorkshopModal() {
    openAddWorkshopModal();
}

function openProductModal() {
    openAddProductModal();
}

function openPostModal() {
    openAddPostModal();
}

function openEventModal() {
    openAddEventModal();
}


// ============================================
// TOGGLE PASSWORD VISIBILITY
// ============================================

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.add('active');
        button.querySelector('.eye-icon').textContent = '🙈';
    } else {
        input.type = 'password';
        button.classList.remove('active');
        button.querySelector('.eye-icon').textContent = '👁';
    }
}


// ============================================
// ADMIN - PORTFOLIO MANAGEMENT
// ============================================

function addPortfolioImageAdmin() {
    const imageUrl = document.getElementById('portfolioImageUrl').value.trim();
    const title = document.getElementById('portfolioImageTitle').value.trim();
    const description = document.getElementById('portfolioImageDesc').value.trim();
    
    if (!imageUrl) {
        showToast('Por favor, insira a URL da imagem', 'error');
        return;
    }
    
    addPortfolioImage({
        imageUrl,
        title,
        description
    });
    
    document.getElementById('portfolioImageUrl').value = '';
    document.getElementById('portfolioImageTitle').value = '';
    document.getElementById('portfolioImageDesc').value = '';
    
    showToast('Imagem adicionada ao portfólio!', 'success');
    loadPortfolioImagesAdmin();
}

function loadPortfolioImagesAdmin() {
    const images = getPortfolioImages();
    const grid = document.getElementById('portfolioImagesGrid');
    
    if (!grid) return;
    
    if (images.length === 0) {
        grid.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Nenhuma imagem no portfólio.</p>';
        return;
    }
    
    grid.innerHTML = images.map(img => `
        <div class="admin-image-item">
            <img src="${img.imageUrl}" alt="${img.title || 'Portfolio'}">
            <div class="admin-image-actions">
                <span style="font-size: 0.85rem;">${img.title || 'Sem título'}</span>
                <button class="btn btn-sm btn-outline" onclick="removePortfolioImageAdmin('${img.id}')">Remover</button>
            </div>
        </div>
    `).join('');
}

function removePortfolioImageAdmin(id) {
    if (confirm('Tem certeza que deseja remover esta imagem?')) {
        removePortfolioImage(id);
        showToast('Imagem removida!', 'success');
        loadPortfolioImagesAdmin();
    }
}

// ============================================
// ADMIN - CERTIFICATES MANAGEMENT
// ============================================

function addCertificateAdmin() {
    const imageUrl = document.getElementById('certificateImageUrl').value.trim();
    const title = document.getElementById('certificateTitle').value.trim();
    const year = document.getElementById('certificateYear').value.trim();
    
    if (!imageUrl || !title) {
        showToast('Por favor, preencha a URL e o título do certificado', 'error');
        return;
    }
    
    addCertificate({
        imageUrl,
        title,
        year
    });
    
    document.getElementById('certificateImageUrl').value = '';
    document.getElementById('certificateTitle').value = '';
    document.getElementById('certificateYear').value = '';
    
    showToast('Certificado adicionado!', 'success');
    loadCertificatesAdmin();
}

function loadCertificatesAdmin() {
    const certificates = getCertificates();
    const grid = document.getElementById('certificatesGrid');
    
    if (!grid) return;
    
    if (certificates.length === 0) {
        grid.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Nenhum certificado cadastrado.</p>';
        return;
    }
    
    grid.innerHTML = certificates.map(cert => `
        <div class="admin-image-item">
            <img src="${cert.imageUrl}" alt="${cert.title}">
            <div class="admin-image-actions">
                <div>
                    <strong style="font-size: 0.85rem;">${cert.title}</strong>
                    ${cert.year ? `<br><small>${cert.year}</small>` : ''}
                </div>
                <button class="btn btn-sm btn-outline" onclick="removeCertificateAdmin('${cert.id}')">Remover</button>
            </div>
        </div>
    `).join('');
}

function removeCertificateAdmin(id) {
    if (confirm('Tem certeza que deseja remover este certificado?')) {
        removeCertificate(id);
        showToast('Certificado removido!', 'success');
        loadCertificatesAdmin();
    }
}

// ============================================
// ADMIN - ANALYTICS
// ============================================

function loadAnalyticsStats() {
    const stats = getVisitStats();
    const container = document.getElementById('analyticsStats');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
            <div class="stat-card">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total de Visitas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.today}</div>
                <div class="stat-label">Visitas Hoje</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.last7Days}</div>
                <div class="stat-label">Últimos 7 Dias</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.last30Days}</div>
                <div class="stat-label">Últimos 30 Dias</div>
            </div>
        </div>
    `;
    
    loadPageVisitsChart(stats.byPage);
}

function loadPageVisitsChart(byPage) {
    const container = document.getElementById('pageVisitsChart');
    
    if (!container) return;
    
    const sortedPages = Object.entries(byPage).sort((a, b) => b[1] - a[1]);
    
    if (sortedPages.length === 0) {
        container.innerHTML = '<p style="color: #666;">Nenhuma visita registrada ainda.</p>';
        return;
    }
    
    const maxVisits = Math.max(...sortedPages.map(p => p[1]));
    
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${sortedPages.map(([page, visits]) => `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="min-width: 100px; font-size: 0.9rem;">${page}</div>
                    <div style="flex: 1; background: #eee; border-radius: 4px; height: 24px; position: relative;">
                        <div style="background: var(--color-red); height: 100%; width: ${(visits / maxVisits * 100)}%; border-radius: 4px;"></div>
                    </div>
                    <div style="min-width: 40px; text-align: right; font-weight: 600;">${visits}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================
// ADMIN - SETTINGS FORMS
// ============================================

function initAdminSettingsForms() {
    // Site Name Form
    const siteNameForm = document.getElementById('siteNameForm');
    if (siteNameForm) {
        siteNameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tagline = document.getElementById('siteTagline').value;
            updateSiteSettings({ tagline });
            showToast('Nome do site atualizado!', 'success');
            applySiteSettings();
        });
    }
    
    // Shop Settings Form
    const shopForm = document.getElementById('shopSettingsForm');
    if (shopForm) {
        shopForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const shopEnabled = document.getElementById('shopEnabled').checked;
            updateSiteSettings({ shopEnabled });
            showToast('Configurações da loja atualizadas!', 'success');
        });
    }
    
    // Load current settings
    const settings = getSiteSettings();
    if (settings) {
        const taglineInput = document.getElementById('siteTagline');
        const shopEnabledInput = document.getElementById('shopEnabled');
        
        if (taglineInput) taglineInput.value = settings.tagline || 'Yemar Makeup Artist';
        if (shopEnabledInput) shopEnabledInput.checked = settings.shopEnabled !== false;
    }
}


// ============================================
// CERTIFICATES CAROUSEL
// ============================================

let currentCertificateIndex = 0;

function loadCertificatesCarousel() {
    const certificates = getCertificates();
    const section = document.getElementById('certificatesSection');
    const track = document.getElementById('certificatesTrack');
    const controls = document.getElementById('carouselControls');
    
    if (!section || !track) return;
    
    if (certificates.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    track.innerHTML = certificates.map(cert => `
        <div class="certificate-item">
            <img src="${cert.imageUrl}" alt="${cert.title}">
            <div class="certificate-info">
                <h3>${cert.title}</h3>
                ${cert.year ? `<p>${cert.year}</p>` : ''}
            </div>
        </div>
    `).join('');
    
    // Show controls only if more than 3 certificates
    if (controls) {
        controls.style.display = certificates.length > 3 ? 'flex' : 'none';
    }
    
    currentCertificateIndex = 0;
    updateCertificatesCarousel();
}

function moveCertificatesCarousel(direction) {
    const certificates = getCertificates();
    const maxIndex = Math.max(0, certificates.length - 3);
    
    currentCertificateIndex += direction;
    
    if (currentCertificateIndex < 0) {
        currentCertificateIndex = 0;
    } else if (currentCertificateIndex > maxIndex) {
        currentCertificateIndex = maxIndex;
    }
    
    updateCertificatesCarousel();
}

function updateCertificatesCarousel() {
    const track = document.getElementById('certificatesTrack');
    if (!track) return;
    
    const offset = currentCertificateIndex * -320; // 300px width + 20px gap
    track.style.transform = `translateX(${offset}px)`;
    
    // Update button states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const certificates = getCertificates();
    const maxIndex = Math.max(0, certificates.length - 3);
    
    if (prevBtn) {
        prevBtn.disabled = currentCertificateIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentCertificateIndex >= maxIndex;
    }
}


// ============================================
// RELATÓRIOS E ANÁLISES
// ============================================

let reportsCharts = {
    services: null,
    revenue: null,
    bookingsStatus: null,
    topProducts: null
};

function loadReports() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    // Gerar estatísticas
    const stats = generateReportStats(startDate, endDate);
    displayReportStats(stats);
    
    // Gerar gráficos
    generateServicesChart(startDate, endDate);
    generateRevenueChart(startDate, endDate);
    generateBookingsStatusChart(startDate, endDate);
    generateTopProductsChart(startDate, endDate);
    
    // Gerar tabela de serviços
    generateServicesTable(startDate, endDate);
}

function generateReportStats(startDate, endDate) {
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    const orders = filterByDateRange(getOrders(), startDate, endDate);
    
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmada').length;
    const completedBookings = bookings.filter(b => b.status === 'Concluída').length;
    const cancelledBookings = bookings.filter(b => b.status === 'Cancelada').length;
    
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Entregue').length;
    
    // Calcular receita
    let bookingsRevenue = 0;
    bookings.forEach(booking => {
        if (booking.status === 'Concluída') {
            if (booking.serviceId) {
                const service = getServiceById(booking.serviceId);
                if (service) bookingsRevenue += parseFloat(service.preco) || 0;
            } else if (booking.workshopId) {
                const workshop = getWorkshopById(booking.workshopId);
                if (workshop) bookingsRevenue += parseFloat(workshop.preco) || 0;
            }
        }
    });
    
    let ordersRevenue = 0;
    orders.forEach(order => {
        if (order.status === 'Entregue') {
            ordersRevenue += parseFloat(order.total) || 0;
        }
    });
    
    const totalRevenue = bookingsRevenue + ordersRevenue;
    
    return {
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalOrders,
        completedOrders,
        bookingsRevenue,
        ordersRevenue,
        totalRevenue
    };
}

function displayReportStats(stats) {
    const statsGrid = document.getElementById('reportStatsGrid');
    if (!statsGrid) return;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.totalBookings}</div>
            <div class="stat-label">Total Marcações</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.completedBookings}</div>
            <div class="stat-label">Marcações Concluídas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalOrders}</div>
            <div class="stat-label">Total Encomendas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">€${stats.totalRevenue.toFixed(2)}</div>
            <div class="stat-label">Receita Total</div>
        </div>
    `;
}

function filterByDateRange(items, startDate, endDate) {
    if (!startDate && !endDate) return items;
    
    return items.filter(item => {
        const itemDate = new Date(item.createdAt || item.data);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-12-31');
        
        return itemDate >= start && itemDate <= end;
    });
}

function generateServicesChart(startDate, endDate) {
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    const services = getServices();
    
    const serviceCounts = {};
    services.forEach(service => {
        serviceCounts[service.nome] = 0;
    });
    
    bookings.forEach(booking => {
        if (booking.serviceId) {
            const service = getServiceById(booking.serviceId);
            if (service && serviceCounts[service.nome] !== undefined) {
                serviceCounts[service.nome]++;
            }
        }
    });
    
    const labels = Object.keys(serviceCounts);
    const data = Object.values(serviceCounts);
    
    const ctx = document.getElementById('servicesChart');
    if (!ctx) return;
    
    if (reportsCharts.services) {
        reportsCharts.services.destroy();
    }
    
    reportsCharts.services = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de Marcações',
                data: data,
                backgroundColor: '#c9a227',
                borderColor: '#c9a227',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function generateRevenueChart(startDate, endDate) {
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    const orders = filterByDateRange(getOrders(), startDate, endDate);
    
    // Agrupar por mês
    const monthlyRevenue = {};
    
    bookings.forEach(booking => {
        if (booking.status === 'Concluída' && booking.createdAt) {
            const month = booking.createdAt.substring(0, 7); // YYYY-MM
            if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
            
            if (booking.serviceId) {
                const service = getServiceById(booking.serviceId);
                if (service) monthlyRevenue[month] += parseFloat(service.preco) || 0;
            } else if (booking.workshopId) {
                const workshop = getWorkshopById(booking.workshopId);
                if (workshop) monthlyRevenue[month] += parseFloat(workshop.preco) || 0;
            }
        }
    });
    
    orders.forEach(order => {
        if (order.status === 'Entregue' && order.createdAt) {
            const month = order.createdAt.substring(0, 7);
            if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
            monthlyRevenue[month] += parseFloat(order.total) || 0;
        }
    });
    
    const labels = Object.keys(monthlyRevenue).sort();
    const data = labels.map(month => monthlyRevenue[month]);
    
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    if (reportsCharts.revenue) {
        reportsCharts.revenue.destroy();
    }
    
    reportsCharts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receita (€)',
                data: data,
                backgroundColor: 'rgba(201, 162, 39, 0.2)',
                borderColor: '#c9a227',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function generateBookingsStatusChart(startDate, endDate) {
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    
    const statusCounts = {
        'Pendente': 0,
        'Confirmada': 0,
        'Concluída': 0,
        'Cancelada': 0
    };
    
    bookings.forEach(booking => {
        if (statusCounts[booking.status] !== undefined) {
            statusCounts[booking.status]++;
        }
    });
    
    const ctx = document.getElementById('bookingsStatusChart');
    if (!ctx) return;
    
    if (reportsCharts.bookingsStatus) {
        reportsCharts.bookingsStatus.destroy();
    }
    
    reportsCharts.bookingsStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#ffc107',
                    '#4caf50',
                    '#2196f3',
                    '#f44336'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function generateTopProductsChart(startDate, endDate) {
    const orders = filterByDateRange(getOrders(), startDate, endDate);
    const products = getProducts();
    
    const productSales = {};
    products.forEach(product => {
        productSales[product.nome] = 0;
    });
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const product = getProductById(item.productId);
                if (product && productSales[product.nome] !== undefined) {
                    productSales[product.nome] += item.quantity || 0;
                }
            });
        }
    });
    
    // Pegar top 5
    const sorted = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => item[1]);
    
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;
    
    if (reportsCharts.topProducts) {
        reportsCharts.topProducts.destroy();
    }
    
    reportsCharts.topProducts = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Unidades Vendidas',
                data: data,
                backgroundColor: '#c9a227',
                borderColor: '#c9a227',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function generateServicesTable(startDate, endDate) {
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    const services = getServices();
    
    const serviceStats = {};
    services.forEach(service => {
        serviceStats[service.id] = {
            nome: service.nome,
            preco: parseFloat(service.preco) || 0,
            total: 0,
            confirmadas: 0,
            concluidas: 0,
            canceladas: 0,
            receita: 0
        };
    });
    
    bookings.forEach(booking => {
        if (booking.serviceId && serviceStats[booking.serviceId]) {
            const stats = serviceStats[booking.serviceId];
            stats.total++;
            
            if (booking.status === 'Confirmada') stats.confirmadas++;
            if (booking.status === 'Concluída') {
                stats.concluidas++;
                stats.receita += stats.preco;
            }
            if (booking.status === 'Cancelada') stats.canceladas++;
        }
    });
    
    const tbody = document.getElementById('servicesReportTable');
    if (!tbody) return;
    
    tbody.innerHTML = Object.values(serviceStats)
        .sort((a, b) => b.total - a.total)
        .map(stats => `
            <tr>
                <td>${stats.nome}</td>
                <td>${stats.total}</td>
                <td>${stats.confirmadas}</td>
                <td>${stats.concluidas}</td>
                <td>${stats.canceladas}</td>
                <td>€${stats.receita.toFixed(2)}</td>
            </tr>
        `).join('');
}

// Inicializar datas padrão (últimos 30 dias)
function initializeReportDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const startInput = document.getElementById('reportStartDate');
    const endInput = document.getElementById('reportEndDate');
    
    if (startInput) startInput.value = startDate.toISOString().split('T')[0];
    if (endInput) endInput.value = endDate.toISOString().split('T')[0];
}


// ============================================
// EXPORTAÇÃO DE RELATÓRIOS
// ============================================

function exportReportPDF() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    const stats = generateReportStats(startDate, endDate);
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    const services = getServices();
    
    // Gerar conteúdo HTML para PDF
    const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Relatório - Yemar Makeup Artist</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
        }
        h1 {
            color: #c9a227;
            border-bottom: 3px solid #c9a227;
            padding-bottom: 10px;
        }
        h2 {
            color: #666;
            margin-top: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .period {
            text-align: center;
            color: #666;
            margin-bottom: 20px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            border: 1px solid #ddd;
            padding: 15px;
            text-align: center;
            border-radius: 4px;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #c9a227;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #c9a227;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Relatório de Desempenho</h1>
        <p style="font-size: 18px; color: #c9a227;">Yemar Makeup Artist</p>
    </div>
    
    <div class="period">
        <strong>Período:</strong> ${startDate || 'Início'} até ${endDate || 'Hoje'}
    </div>
    
    <h2>Estatísticas Gerais</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">${stats.totalBookings}</div>
            <div class="stat-label">Total Marcações</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.completedBookings}</div>
            <div class="stat-label">Marcações Concluídas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalOrders}</div>
            <div class="stat-label">Total Encomendas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">€${stats.totalRevenue.toFixed(2)}</div>
            <div class="stat-label">Receita Total</div>
        </div>
    </div>
    
    <h2>Detalhamento de Serviços</h2>
    <table>
        <thead>
            <tr>
                <th>Serviço</th>
                <th>Total Marcações</th>
                <th>Confirmadas</th>
                <th>Concluídas</th>
                <th>Canceladas</th>
                <th>Receita Total</th>
            </tr>
        </thead>
        <tbody>
            ${generateServicesTableHTML(startDate, endDate)}
        </tbody>
    </table>
    
    <div class="footer">
        <p>Relatório gerado em ${new Date().toLocaleString('pt-PT')}</p>
        <p>Yemar Makeup Artist - Maquilhagem Profissional</p>
    </div>
</body>
</html>
    `;
    
    // Criar blob e download
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${startDate || 'inicio'}_${endDate || 'hoje'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Relatório HTML gerado! Abra o arquivo e use "Imprimir > Salvar como PDF" no navegador.', 'success');
}

function generateServicesTableHTML(startDate, endDate) {
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    const services = getServices();
    
    const serviceStats = {};
    services.forEach(service => {
        serviceStats[service.id] = {
            nome: service.nome,
            preco: parseFloat(service.preco) || 0,
            total: 0,
            confirmadas: 0,
            concluidas: 0,
            canceladas: 0,
            receita: 0
        };
    });
    
    bookings.forEach(booking => {
        if (booking.serviceId && serviceStats[booking.serviceId]) {
            const stats = serviceStats[booking.serviceId];
            stats.total++;
            
            if (booking.status === 'Confirmada') stats.confirmadas++;
            if (booking.status === 'Concluída') {
                stats.concluidas++;
                stats.receita += stats.preco;
            }
            if (booking.status === 'Cancelada') stats.canceladas++;
        }
    });
    
    return Object.values(serviceStats)
        .sort((a, b) => b.total - a.total)
        .map(stats => `
            <tr>
                <td>${stats.nome}</td>
                <td>${stats.total}</td>
                <td>${stats.confirmadas}</td>
                <td>${stats.concluidas}</td>
                <td>${stats.canceladas}</td>
                <td>€${stats.receita.toFixed(2)}</td>
            </tr>
        `).join('');
}

function exportReportExcel() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    const stats = generateReportStats(startDate, endDate);
    const bookings = filterByDateRange(getBookings(), startDate, endDate);
    const services = getServices();
    
    // Gerar conteúdo CSV
    let csv = 'RELATÓRIO DE DESEMPENHO - YEMAR MAKEUP ARTIST\n';
    csv += `Período: ${startDate || 'Início'} até ${endDate || 'Hoje'}\n`;
    csv += `Gerado em: ${new Date().toLocaleString('pt-PT')}\n\n`;
    
    csv += 'ESTATÍSTICAS GERAIS\n';
    csv += 'Métrica,Valor\n';
    csv += `Total Marcações,${stats.totalBookings}\n`;
    csv += `Marcações Confirmadas,${stats.confirmedBookings}\n`;
    csv += `Marcações Concluídas,${stats.completedBookings}\n`;
    csv += `Marcações Canceladas,${stats.cancelledBookings}\n`;
    csv += `Total Encomendas,${stats.totalOrders}\n`;
    csv += `Encomendas Entregues,${stats.completedOrders}\n`;
    csv += `Receita Marcações,€${stats.bookingsRevenue.toFixed(2)}\n`;
    csv += `Receita Encomendas,€${stats.ordersRevenue.toFixed(2)}\n`;
    csv += `Receita Total,€${stats.totalRevenue.toFixed(2)}\n\n`;
    
    csv += 'DETALHAMENTO DE SERVIÇOS\n';
    csv += 'Serviço,Total Marcações,Confirmadas,Concluídas,Canceladas,Receita Total\n';
    
    const serviceStats = {};
    services.forEach(service => {
        serviceStats[service.id] = {
            nome: service.nome,
            preco: parseFloat(service.preco) || 0,
            total: 0,
            confirmadas: 0,
            concluidas: 0,
            canceladas: 0,
            receita: 0
        };
    });
    
    bookings.forEach(booking => {
        if (booking.serviceId && serviceStats[booking.serviceId]) {
            const s = serviceStats[booking.serviceId];
            s.total++;
            if (booking.status === 'Confirmada') s.confirmadas++;
            if (booking.status === 'Concluída') {
                s.concluidas++;
                s.receita += s.preco;
            }
            if (booking.status === 'Cancelada') s.canceladas++;
        }
    });
    
    Object.values(serviceStats)
        .sort((a, b) => b.total - a.total)
        .forEach(s => {
            csv += `${s.nome},${s.total},${s.confirmadas},${s.concluidas},${s.canceladas},€${s.receita.toFixed(2)}\n`;
        });
    
    // Criar blob e download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${startDate || 'inicio'}_${endDate || 'hoje'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Relatório CSV exportado! Abra com Excel ou Google Sheets.', 'success');
}
