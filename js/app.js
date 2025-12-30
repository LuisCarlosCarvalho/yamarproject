/**
 * APP.JS - Lógica Principal da Aplicação
 * Estado global, autenticação, guards, handlers e inicialização
 */

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener("DOMContentLoaded", function () {
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
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeMenu && mobileMenu) {
    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  // Fechar ao clicar em link
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu) {
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });
}

// ============================================
// DROPDOWNS
// ============================================

function initDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (toggle && menu) {
      // Desktop: hover
      dropdown.addEventListener("mouseenter", () => {
        if (window.innerWidth > 768) {
          menu.classList.add("show");
        }
      });

      dropdown.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768) {
          menu.classList.remove("show");
        }
      });

      // Mobile: click
      toggle.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          menu.classList.toggle("show");
        }
      });
    }
  });

  // Fechar dropdowns ao clicar fora
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });
}

// ============================================
// PESQUISA
// ============================================

function initSearch() {
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener("click", () => {
      searchOverlay.classList.add("open");
      if (searchInput) searchInput.focus();
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener("click", () => {
      searchOverlay.classList.remove("open");
    });
  }

  if (searchInput && searchResults) {
    const debouncedSearch = debounce((query) => {
      if (query.length >= 2) {
        const results = searchAll(query);
        searchResults.innerHTML = renderSearchResults(results);
      } else {
        searchResults.innerHTML = "";
      }
    }, 300);

    searchInput.addEventListener("input", (e) => {
      debouncedSearch(e.target.value);
    });
  }

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      searchOverlay &&
      searchOverlay.classList.contains("open")
    ) {
      searchOverlay.classList.remove("open");
    }
  });
}

// ============================================
// AUTENTICAÇÃO UI
// ============================================

function updateAuthUI() {
  const session = getCurrentSession();
  const authLinks = document.querySelectorAll(".auth-link");
  const adminLinks = document.querySelectorAll(".admin-link");
  const userLinks = document.querySelectorAll(".user-link");
  const guestLinks = document.querySelectorAll(".guest-link");

  if (session) {
    // Usuário logado
    authLinks.forEach((el) => {
      el.innerHTML = `<a href="conta.html">${session.nome}</a>`;
    });

    userLinks.forEach((el) => (el.style.display = ""));
    guestLinks.forEach((el) => (el.style.display = "none"));

    // Mostrar link admin se for admin
    if (session.role === "admin") {
      adminLinks.forEach((el) => (el.style.display = ""));
    } else {
      adminLinks.forEach((el) => (el.style.display = "none"));
    }
  } else {
    // Visitante
    authLinks.forEach((el) => {
      el.innerHTML = '<a href="conta.html">Entrar</a>';
    });

    userLinks.forEach((el) => (el.style.display = "none"));
    guestLinks.forEach((el) => (el.style.display = ""));
    adminLinks.forEach((el) => (el.style.display = "none"));
  }
}

// ============================================
// PROTEÇÃO DE ROTAS
// ============================================

function checkRouteProtection() {
  const currentPage = window.location.pathname.split("/").pop();
  const session = getCurrentSession();

  // Páginas que requerem login
  const protectedPages = [];

  // Páginas que requerem admin
  const adminPages = ["admin.html"];

  if (protectedPages.includes(currentPage)) {
    if (!session) {
      window.location.href = "conta.html";
      return;
    }
  }

  if (adminPages.includes(currentPage)) {
    if (!session || session.role !== "admin") {
      showToast("Acesso restrito a administradores", "error");
      window.location.href = "conta.html";
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
  const logoElements = document.querySelectorAll(".logo-text");
  logoElements.forEach((el) => {
    el.textContent = settings.logoText || "YEMAR MAKEUP ARTIST";
  });

  // Aplicar tagline
  const taglineElements = document.querySelectorAll(".tagline");
  taglineElements.forEach((el) => {
    el.textContent = settings.tagline || "Yemar Makeup Artist";
  });

  // Carregar formação e certificações na página Sobre
  loadFormacaoSobrePage();
  loadCertificacoesSobrePage();

  // Controlar visibilidade da loja
  const shopEnabled = settings.shopEnabled !== false;

  // Ocultar ícone do carrinho
  const cartIcon = document.getElementById("cartIconBtn");
  if (cartIcon) {
    cartIcon.style.display = shopEnabled ? "flex" : "none";
  }

  // Ocultar links e elementos da loja
  const shopLinks = document.querySelectorAll(".shop-link");
  shopLinks.forEach((link) => {
    link.style.display = shopEnabled ? "" : "none";
  });

  const shopElements = document.querySelectorAll(".shop-element");
  shopElements.forEach((element) => {
    element.style.display = shopEnabled ? "" : "none";
  });

  // Ocultar seção de produtos na homepage
  const productsSection = document.getElementById("productsSection");
  if (productsSection) {
    productsSection.style.display = shopEnabled ? "block" : "none";
  }

  // Aplicar logo imagem se existir
  if (settings.logoUrl) {
    const logoImgs = document.querySelectorAll(".logo-img");
    const logoUrl = getImageUrl({imagemUrl: settings.logoUrl}, 'assets/images/logo-default.png');
    logoImgs.forEach((img) => {
      img.src = logoUrl;
      img.style.display = "block";
      img.onerror = function() {
        this.onerror = null;
        this.style.display = "none";
      };
    });
  }

  // Aplicar foto do rodapé
  const footerAvatars = document.querySelectorAll("#footerAvatar, .footer-avatar");
  if (footerAvatars.length > 0) {
    const avatarUrlRaw = settings.footerAvatarUrl ||
                         settings.aboutImageUrl ||
                         "images/capa.png";
    const avatarUrl = getImageUrl({imagemUrl: avatarUrlRaw}, 'assets/images/placeholder.jpg');
    footerAvatars.forEach(img => {
      img.src = avatarUrl;
      img.onerror = function() {
        this.onerror = null;
        this.src = 'assets/images/placeholder.jpg';
      };
    });
  }

  // Aplicar foto do perfil da homepage
  const welcomeAvatars = document.querySelectorAll("#welcomeAvatar, .welcome-avatar");
  if (welcomeAvatars.length > 0 && settings.welcomeAvatarUrl) {
    const welcomeUrl = getImageUrl({imagemUrl: settings.welcomeAvatarUrl}, 'assets/images/placeholder.jpg');
    welcomeAvatars.forEach(img => {
      img.src = welcomeUrl;
      img.onerror = function() {
        this.onerror = null;
        this.src = 'assets/images/placeholder.jpg';
      };
    });
  }

  // Aplicar foto da página sobre
  const aboutImages = document.querySelectorAll("#aboutImage, .about-image");
  if (aboutImages.length > 0 && settings.aboutImageUrl) {
    const aboutUrl = getImageUrl({imagemUrl: settings.aboutImageUrl}, 'assets/images/placeholder.jpg');
    aboutImages.forEach(img => {
      img.src = aboutUrl;
      img.onerror = function() {
        this.onerror = null;
        this.src = 'assets/images/placeholder.jpg';
      };
    });
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
    showToast("Login efetuado com sucesso!", "success");

    setTimeout(() => {
      if (user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "conta.html";
      }
    }, 1000);
  } else {
    showToast("Email ou senha incorretos", "error");
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
    showToast("As senhas não coincidem", "error");
    return;
  }

  if (senha.length < 6) {
    showToast("A senha deve ter pelo menos 6 caracteres", "error");
    return;
  }

  if (getUserByEmail(email)) {
    showToast("Este email já está registado", "error");
    return;
  }

  // Criar usuário
  const newUser = createUser({ nome, email, telefone, senha });

  // Login automático
  setCurrentSession(newUser);
  showToast("Conta criada com sucesso!", "success");

  setTimeout(() => {
    window.location.href = "conta.html";
  }, 1000);
}

function handleLogout() {
  clearSession();
  showToast("Sessão terminada", "info");
  window.location.href = "index.html";
}

// ============================================
// HANDLERS DE MARCAÇÕES
// ============================================

function handleBookingSubmit(event, tipo, itemId, itemTitulo) {
  event.preventDefault();

  const session = getCurrentSession();
  if (!session) {
    showToast("Precisas de estar logado para fazer marcações", "error");
    return;
  }

  const form = event.target;
  const data = form.data.value;
  const hora = form.hora.value;
  const observacoes = form.observacoes?.value || "";

  // Validar data não é no passado
  const selectedDate = new Date(data + "T" + hora);
  if (selectedDate < new Date()) {
    showToast("Não é possível marcar para datas passadas", "error");
    return;
  }

  const booking = createBooking({
    userId: session.userId,
    tipo: tipo,
    itemId: itemId,
    itemTitulo: itemTitulo,
    dataHoraOuPreferencia: `${data} às ${hora}`,
    observacoes: observacoes,
  });

  closeModal();
  showToast("Marcação criada com sucesso! Aguarda confirmação.", "success");

  // Redirecionar para minha conta
  setTimeout(() => {
    window.location.href = "conta.html";
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
    openModal(
      "Inscrição no Evento",
      `
            <div class="booking-login-required">
                <p>Para te inscreveres neste evento, precisas de ter conta.</p>
                <a href="conta.html" class="btn btn-primary">Entrar / Registar</a>
            </div>
        `,
    );
    return;
  }

  const content = `
        <div class="event-booking-info">
            <h4>${event.titulo}</h4>
            <p><strong>Data:</strong> ${formatDateTime(new Date(event.data))}</p>
            <p><strong>Local:</strong> ${event.local}</p>
            <p><strong>Vagas disponíveis:</strong> ${event.vagas}</p>
            ${event.preco > 0 ? `<p><strong>Preço:</strong> ${event.preco}€</p>` : "<p><strong>Entrada:</strong> Gratuita</p>"}
        </div>
        <form id="eventBookingForm" onsubmit="handleEventBooking(event, '${event.id}', '${event.titulo}')">
            <div class="form-group">
                <label for="eventNotes">Observações (opcional)</label>
                <textarea id="eventNotes" name="observacoes" rows="3" placeholder="Alguma informação adicional..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Confirmar Inscrição</button>
        </form>
    `;

  openModal("Inscrição no Evento", content);
}

function handleEventBooking(e, eventId, eventTitulo) {
  e.preventDefault();

  const session = getCurrentSession();
  if (!session) return;

  const event = getEventById(eventId);
  const observacoes = document.getElementById("eventNotes")?.value || "";

  const booking = createBooking({
    userId: session.userId,
    tipo: "Evento",
    itemId: eventId,
    itemTitulo: eventTitulo,
    dataHoraOuPreferencia: formatDateTime(new Date(event.data)),
    observacoes: observacoes,
  });

  closeModal();
  showToast("Inscrição realizada com sucesso!", "success");
}

function cancelUserBooking(bookingId) {
  if (confirm("Tens a certeza que queres cancelar esta marcação?")) {
    cancelBooking(bookingId);
    showToast("Marcação cancelada", "info");
    loadUserBookings(); // Recarregar lista
  }
}

// ============================================
// HANDLERS DE CONTACTO
// ============================================

function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const nome = form.querySelector('#contactName').value.trim();
  const email = form.querySelector('#contactEmail').value.trim();
  const telefone = form.querySelector('#contactPhone').value.trim() || 'Não fornecido';
  const assunto = form.querySelector('#contactSubject').value;
  const mensagem = form.querySelector('#contactMessage').value.trim();

  // Criar mensagem no storage
  const message = createMessage({
    nome: nome,
    email: email,
    telefone: telefone,
    assunto: assunto,
    mensagem: mensagem
  });

  // Mostrar sucesso
  showToast(
    "Mensagem enviada com sucesso! Entraremos em contacto em breve.",
    "success",
  );
  
  form.reset();
}

// ============================================
// HANDLERS DE CARRINHO
// ============================================

function addProductToCart(productId) {
  addToCart(productId, 1);
  updateCartBadge();
  showToast("Produto adicionado ao carrinho!", "success");
}

function removeProductFromCart(productId) {
  removeFromCart(productId);
  updateCartBadge();
  updateMiniCartDisplay();
  showToast("Produto removido do carrinho", "info");
}

function clearCartItems() {
  clearCart();
  updateCartBadge();
  updateMiniCartDisplay();
  showToast("Carrinho limpo", "info");
}

function updateMiniCartDisplay() {
  const miniCartContent = document.getElementById("miniCartContent");
  if (miniCartContent) {
    miniCartContent.innerHTML = renderMiniCart();
  }
}

function toggleMiniCart() {
  const miniCart = document.getElementById("miniCart");
  if (miniCart) {
    miniCart.classList.toggle("open");
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
    const likeElements = document.querySelectorAll(
      `[data-post-id="${postId}"] .action-likes, .post-likes[data-id="${postId}"]`,
    );
    likeElements.forEach((el) => {
      el.textContent = `❤ ${post.likes}`;
    });
  }
  showToast("Gostaste deste post!", "success");
}

function handleCommentSubmit(event, postId) {
  event.preventDefault();

  const form = event.target;
  const nome = form.nome.value.trim();
  const mensagem = form.mensagem.value.trim();

  if (!nome || !mensagem) {
    showToast("Preenche todos os campos", "error");
    return;
  }

  addComment(postId, { nome, mensagem });
  showToast("Comentário adicionado!", "success");
  form.reset();

  // Recarregar comentários
  loadPostComments(postId);
}

// ============================================
// HANDLERS ADMIN
// ============================================

function adminConfirmBooking(bookingId) {
  confirmBooking(bookingId);
  showToast("Marcação confirmada!", "success");
  loadAdminBookings();
}

function adminCancelBooking(bookingId) {
  if (confirm("Tens a certeza que queres cancelar esta marcação?")) {
    cancelBooking(bookingId);
    showToast("Marcação cancelada", "info");
    loadAdminBookings();
  }
}

function adminCompleteBooking(bookingId) {
  completeBooking(bookingId);
  showToast("Marcação concluída!", "success");
  loadAdminBookings();
}

// ============================================
// FUNÇÕES DE CARREGAMENTO DE PÁGINAS
// ============================================

function loadHomeContent() {
  // Carregar imagem do perfil das configurações
  const settings = getSiteSettings();
  const welcomeAvatar = document.getElementById("welcomeAvatar");
  if (welcomeAvatar && settings.welcomeAvatarUrl) {
    welcomeAvatar.src = settings.welcomeAvatarUrl;
  }

  // Carregar serviços
  const servicesContainer = document.getElementById("servicesGrid");
  if (servicesContainer) {
    const services = getActiveServices().slice(0, 6);
    servicesContainer.innerHTML = services
      .map((s) => renderServiceCard(s))
      .join("");
  }

  // Carregar workshops
  const workshopsContainer = document.getElementById("workshopsGrid");
  if (workshopsContainer) {
    const workshops = getActiveWorkshops().slice(0, 4);
    workshopsContainer.innerHTML = workshops
      .map((w) => renderWorkshopCard(w))
      .join("");
  }

  // Carregar produtos
  const productsContainer = document.getElementById("productsGrid");
  if (productsContainer) {
    const products = getActiveProducts().slice(0, 8);
    productsContainer.innerHTML = products
      .map((p) => renderProductCard(p))
      .join("");
  }

  // Carregar posts
  const postsContainer = document.getElementById("postsGrid");
  if (postsContainer) {
    const posts = getActivePosts().slice(0, 4);
    postsContainer.innerHTML = posts
      .map((p) => renderEditorialPostCard(p))
      .join("");
  }

  // Carregar carrossel de certificados
  loadCertificatesCarousel();

  // Carregar slider de posts
  const sliderContainer = document.getElementById("featuredSlider");
  if (sliderContainer) {
    const posts = getActivePosts().slice(0, 3);
    sliderContainer.innerHTML = posts
      .map(
        (p, i) => `
            <div class="slide ${i === 0 ? "active" : ""}">
                <a href="post.html?id=${p.id}" class="slide-link">
                    <img src="${p.imagemUrl}" alt="${p.titulo}" loading="lazy">
                    <div class="slide-content">
                        <span class="slide-category">${p.categoria}</span>
                        <h3 class="slide-title">${p.titulo}</h3>
                        <p class="slide-date">${formatDate(new Date(p.dataPublicacao))}</p>
                    </div>
                </a>
            </div>
        `,
      )
      .join("");

    // Inicializar slider
    new Slider(sliderContainer, { autoplay: true, interval: 5000 });
  }

  // Aplicar banner (settings já declarado acima)
  const heroBanner = document.getElementById("heroBanner");
  if (heroBanner && settings.bannerImagemUrl) {
    const bannerUrl = getImageUrl({imagemUrl: settings.bannerImagemUrl}, 'assets/images/placeholder.jpg');
    heroBanner.style.backgroundImage = `url(${bannerUrl})`;
  }

  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) heroTitle.textContent = settings.bannerTitulo;

  const heroSubtitle = document.getElementById("heroSubtitle");
  if (heroSubtitle) heroSubtitle.textContent = settings.bannerSubtitulo;

  const heroCta = document.getElementById("heroCta");
  if (heroCta) heroCta.textContent = settings.bannerCta;
}

function loadServicesPage() {
  const container = document.getElementById("servicesContainer");
  if (container) {
    const services = getActiveServices();
    container.innerHTML = services.map((s) => renderServiceCard(s)).join("");
  }
}

function loadServiceDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    window.location.href = "servicos.html";
    return;
  }

  const service = getServiceById(id);
  if (!service) {
    showToast("Serviço não encontrado", "error");
    window.location.href = "servicos.html";
    return;
  }

  // Preencher página com imagem normalizada
  const imageUrl = getImageUrl(service, 'assets/images/servico-default.jpg');
  const serviceImages = document.querySelectorAll("#serviceImage, .service-image");
  serviceImages.forEach(img => {
    img.src = imageUrl;
    img.alt = service.nome || service.titulo;
    img.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/placeholder.jpg';
    };
  });
  
  document.getElementById("serviceCategory").textContent =
    service.categoria || "SERVIÇO";
  document.getElementById("serviceTitle").textContent = service.nome || service.titulo;
  document.getElementById("servicePrice").textContent = `${service.preco}€`;
  document.getElementById("serviceDuration").textContent = service.duracao;
  document.getElementById("serviceDescription").innerHTML =
    service.descricao.replace(/\n/g, "<br>");

  // Botão de marcação
  const bookBtn = document.getElementById("bookServiceBtn");
  if (bookBtn) {
    bookBtn.onclick = () => openBookingModal("Serviço", service);
  }

  document.title = `${service.nome} - Yemar Makeup Artist`;
}

function loadWorkshopsPage() {
  const container = document.getElementById("workshopsContainer");
  if (container) {
    const workshops = getActiveWorkshops();
    container.innerHTML = workshops.map((w) => renderWorkshopCard(w)).join("");
  }
}

function loadWorkshopDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    window.location.href = "workshops.html";
    return;
  }

  const workshop = getWorkshopById(id);
  if (!workshop) {
    showToast("Workshop não encontrado", "error");
    window.location.href = "workshops.html";
    return;
  }

  // Preencher página com imagem normalizada
  const imageUrl = getImageUrl(workshop, 'assets/images/workshop-default.jpg');
  const workshopImages = document.querySelectorAll("#workshopImage, .workshop-image");
  workshopImages.forEach(img => {
    img.src = imageUrl;
    img.alt = workshop.titulo;
    img.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/placeholder.jpg';
    };
  });
  
  document.getElementById("workshopModality").textContent = workshop.modalidade;
  document.getElementById("workshopTitle").textContent = workshop.titulo;
  document.getElementById("workshopPrice").textContent = `${workshop.preco}€`;
  document.getElementById("workshopDuration").textContent = workshop.duracao;
  document.getElementById("workshopVagas").textContent =
    `${workshop.vagas} vagas`;
  document.getElementById("workshopDescription").innerHTML =
    workshop.descricao.replace(/\n/g, "<br>");
  if (workshop.observacoes) {
    document.getElementById("workshopNotes").innerHTML =
      workshop.observacoes.replace(/\n/g, "<br>");
  }

  // Botão de marcação
  const bookBtn = document.getElementById("bookWorkshopBtn");
  if (bookBtn) {
    bookBtn.onclick = () => openBookingModal("Workshop", workshop);
  }

  document.title = `${workshop.titulo} - Yemar Makeup Artist`;
}

function loadEventsPage() {
  const container = document.getElementById("eventsContainer");
  if (container) {
    const events = getUpcomingEvents();
    if (events.length === 0) {
      container.innerHTML =
        '<p class="no-items">Não há eventos agendados de momento.</p>';
    } else {
      container.innerHTML = events.map((e) => renderEventCard(e)).join("");
    }
  }
}

function loadProductsPage() {
  const container = document.getElementById("productsContainer");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (container) {
    let products = getActiveProducts();

    // Preencher filtro de categorias
    if (categoryFilter && categoryFilter.options.length <= 1) {
      const categories = getProductCategories();
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
      });
    }

    // Aplicar filtros
    const selectedCategory = categoryFilter?.value;
    const selectedSort = sortFilter?.value;

    if (selectedCategory) {
      products = products.filter((p) => p.categoria === selectedCategory);
    }

    if (selectedSort === "price-asc") {
      products.sort((a, b) => a.preco - b.preco);
    } else if (selectedSort === "price-desc") {
      products.sort((a, b) => b.preco - a.preco);
    } else if (selectedSort === "name") {
      products.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    container.innerHTML = products.map((p) => renderProductCard(p)).join("");
  }
}

function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    window.location.href = "produtos.html";
    return;
  }

  const product = getProductById(id);
  if (!product) {
    showToast("Produto não encontrado", "error");
    window.location.href = "produtos.html";
    return;
  }

  // Preencher página com imagem normalizada
  const imageUrl = getImageUrl(product, 'assets/images/produto-default.jpg');
  const productImages = document.querySelectorAll("#productImage, .product-image");
  productImages.forEach(img => {
    img.src = imageUrl;
    img.alt = product.nome;
    img.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/placeholder.jpg';
    };
  });
  
  document.getElementById("productCategory").textContent = product.categoria;
  document.getElementById("productTitle").textContent = product.nome;
  document.getElementById("productPrice").textContent = `${product.preco}€`;
  document.getElementById("productDescription").innerHTML =
    product.descricao.replace(/\n/g, "<br>");

  // Botão de adicionar ao carrinho
  const addBtn = document.getElementById("addToCartBtn");
  if (addBtn) {
    addBtn.onclick = () => addProductToCart(product.id);
  }

  document.title = `${product.nome} - Yemar Makeup Artist`;
}

function loadBlogPage() {
  const container = document.getElementById("postsContainer");
  if (container) {
    const posts = getActivePosts();
    container.innerHTML = posts.map((p) => renderEditorialPostCard(p)).join("");
  }
}

function loadPostDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    window.location.href = "blog.html";
    return;
  }

  const post = getPostById(id);
  if (!post) {
    showToast("Post não encontrado", "error");
    window.location.href = "blog.html";
    return;
  }

  // Preencher página com imagem normalizada
  document.getElementById("postCategory").textContent = post.categoria;
  document.getElementById("postTitle").textContent = post.titulo;
  document.getElementById("postDate").textContent =
    `Posted on ${formatDate(new Date(post.dataPublicacao))}`;
  
  const imageUrl = getImageUrl(post, 'assets/images/blog-default.jpg');
  const postImages = document.querySelectorAll("#postImage, .post-image");
  postImages.forEach(img => {
    img.src = imageUrl;
    img.alt = post.titulo;
    img.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/placeholder.jpg';
    };
  });
  
  document.getElementById("postContent").innerHTML = post.conteudo.replace(
    /\n/g,
    "<br>",
  );
  document.getElementById("postLikes").textContent = `❤ ${post.likes || 0}`;
  document.getElementById("postLikes").onclick = () => handleLikePost(post.id);

  // Carregar comentários
  loadPostComments(id);

  document.title = `${post.titulo} - Yemar Makeup Artist`;
}

function loadPostComments(postId) {
  const container = document.getElementById("commentsContainer");
  const post = getPostById(postId);

  if (container && post) {
    const comments = post.comentarios || [];

    if (comments.length === 0) {
      container.innerHTML =
        '<p class="no-comments">Ainda não há comentários. Sê o primeiro a comentar!</p>';
    } else {
      container.innerHTML = comments
        .map(
          (c) => `
                <div class="comment">
                    <div class="comment-header">
                        <strong>${c.nome}</strong>
                        <span class="comment-date">${formatDateTime(new Date(c.createdAt))}</span>
                    </div>
                    <p class="comment-text">${c.mensagem}</p>
                </div>
            `,
        )
        .join("");
    }
  }
}

function loadUserBookings() {
  const container = document.getElementById("bookingsContainer");
  const session = getCurrentSession();

  if (container && session) {
    const bookings = getBookingsByUser(session.userId);

    if (bookings.length === 0) {
      container.innerHTML = '<p class="no-items">Ainda não tens marcações.</p>';
    } else {
      // Ordenar por data de criação (mais recentes primeiro)
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      container.innerHTML = bookings.map((b) => renderBookingCard(b)).join("");
    }
  }
}

function loadContactPage() {
  const settings = getSiteSettings();

  const emailContacto = document.getElementById("emailContacto");
  if (emailContacto) emailContacto.textContent = settings.emailContacto;

  const emailColaboracao = document.getElementById("emailColaboracao");
  if (emailColaboracao)
    emailColaboracao.textContent = settings.emailColaboracao;

  const telefone = document.getElementById("telefoneContacto");
  if (telefone) telefone.textContent = settings.telefone;

  const endereco = document.getElementById("enderecoContacto");
  if (endereco) endereco.textContent = settings.endereco;
}

// ============================================
// FUNÇÕES ADMIN
// ============================================

function loadAdminDashboard() {
  const stats = getDashboardStats();

  document.getElementById("statPendentes").textContent = stats.pendentes;
  document.getElementById("statConfirmadas").textContent = stats.confirmadas;
  document.getElementById("statUsers").textContent = stats.totalUsers;
  document.getElementById("statProducts").textContent = stats.totalProducts;
  document.getElementById("statServices").textContent = stats.totalServices;
  document.getElementById("statEvents").textContent = stats.upcomingEvents;
}

function loadAdminBookings() {
  const container = document.getElementById("bookingsTableBody");
  if (container) {
    const bookings = getBookings();
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    container.innerHTML = bookings.map((b) => renderBookingRow(b)).join("");
  }
}

function loadAdminSection(section) {
  // Esconder todas as seções
  document
    .querySelectorAll(".admin-section")
    .forEach((s) => (s.style.display = "none"));

  // Mostrar seção selecionada
  const targetSection = document.getElementById(`section-${section}`);
  if (targetSection) targetSection.style.display = "block";

  // Atualizar menu ativo
  document.querySelectorAll(".admin-menu-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === section);
  });

  // Carregar dados da seção
  switch (section) {
    case "dashboard":
      loadAdminDashboard();
      break;
    case "bookings":
      loadAdminBookings();
      break;
    case "services":
      loadAdminServices();
      break;
    case "workshops":
      loadAdminWorkshops();
      break;
    case "events":
      loadAdminEvents();
      break;
    case "products":
      loadAdminProducts();
      break;
    case "posts":
      loadAdminPosts();
      break;
    case "settings":
      loadAdminSettings();
      break;
  }
}

function loadAdminServices() {
  const container = document.getElementById("servicesTableBody");
  if (container) {
    const services = getServices();
    container.innerHTML = services
      .map(
        (s) => `
            <tr>
                <td>${s.nome}</td>
                <td>${s.categoria || "-"}</td>
                <td>${s.preco}€</td>
                <td>${s.duracao}</td>
                <td><span class="status-badge ${s.ativo ? "status-confirmed" : "status-cancelled"}">${s.ativo ? "Ativo" : "Inativo"}</span></td>
                <td>
                    <button class="btn-action" onclick="editService('${s.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteServiceItem('${s.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `,
      )
      .join("");
  }
}

function loadAdminWorkshops() {
  const container = document.getElementById("workshopsTableBody");
  if (container) {
    const workshops = getWorkshops();
    container.innerHTML = workshops
      .map(
        (w) => `
            <tr>
                <td>${w.titulo}</td>
                <td>${w.modalidade}</td>
                <td>${w.preco}€</td>
                <td>${w.duracao}</td>
                <td><span class="status-badge ${w.ativo ? "status-confirmed" : "status-cancelled"}">${w.ativo ? "Ativo" : "Inativo"}</span></td>
                <td>
                    <button class="btn-action" onclick="editWorkshop('${w.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteWorkshopItem('${w.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `,
      )
      .join("");
  }
}

function loadAdminEvents() {
  const container = document.getElementById("eventsTableBody");
  if (container) {
    const events = getEvents();
    container.innerHTML = events
      .map(
        (e) => `
            <tr>
                <td>${e.titulo}</td>
                <td>${formatDateTime(new Date(e.data))}</td>
                <td>${e.local}</td>
                <td>${e.vagas}</td>
                <td><span class="status-badge ${e.ativo ? "status-confirmed" : "status-cancelled"}">${e.ativo ? "Ativo" : "Inativo"}</span></td>
                <td>
                    <button class="btn-action" onclick="editEvent('${e.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteEventItem('${e.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `,
      )
      .join("");
  }
}

function loadAdminProducts() {
  const container = document.getElementById("productsTableBody");
  if (container) {
    const products = getProducts();
    container.innerHTML = products
      .map(
        (p) => `
            <tr>
                <td>${p.nome}</td>
                <td>${p.categoria}</td>
                <td>${p.preco}€</td>
                <td>${p.estoque || 0}</td>
                <td><span class="status-badge ${p.ativo ? "status-confirmed" : "status-cancelled"}">${p.ativo ? "Ativo" : "Inativo"}</span></td>
                <td>
                    <button class="btn-action" onclick="editProduct('${p.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deleteProductItem('${p.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `,
      )
      .join("");
  }
}

function loadAdminPosts() {
  const container = document.getElementById("postsTableBody");
  if (container) {
    const posts = getPosts();
    container.innerHTML = posts
      .map(
        (p) => `
            <tr>
                <td>${p.titulo}</td>
                <td>${p.categoria}</td>
                <td>${formatDate(new Date(p.dataPublicacao))}</td>
                <td>${p.likes || 0}</td>
                <td><span class="status-badge ${p.ativo ? "status-confirmed" : "status-cancelled"}">${p.ativo ? "Ativo" : "Inativo"}</span></td>
                <td>
                    <button class="btn-action" onclick="editPost('${p.id}')" title="Editar">✎</button>
                    <button class="btn-action btn-cancel" onclick="deletePostItem('${p.id}')" title="Eliminar">✕</button>
                </td>
            </tr>
        `,
      )
      .join("");
  }
}

function loadAdminSettings() {
  const settings = getSiteSettings();

  document.getElementById("settingsLogoText").value = settings.logoText || "";
  document.getElementById("settingsTagline").value = settings.tagline || "";
  document.getElementById("settingsLogoUrl").value = settings.logoUrl || "";
  document.getElementById("settingsBannerTitle").value =
    settings.bannerTitulo || "";
  document.getElementById("settingsBannerSubtitle").value =
    settings.bannerSubtitulo || "";
  document.getElementById("settingsBannerImage").value =
    settings.bannerImagemUrl || "";
  document.getElementById("settingsBannerCta").value = settings.bannerCta || "";
  document.getElementById("settingsEmailContacto").value =
    settings.emailContacto || "";
  document.getElementById("settingsEmailColaboracao").value =
    settings.emailColaboracao || "";
  document.getElementById("settingsTelefone").value = settings.telefone || "";
  document.getElementById("settingsEndereco").value = settings.endereco || "";
  document.getElementById("settingsFacebook").value =
    settings.redesSociais?.facebook || "";
  document.getElementById("settingsInstagram").value =
    settings.redesSociais?.instagram || "";
  document.getElementById("settingsTwitter").value =
    settings.redesSociais?.twitter || "";
  document.getElementById("settingsYoutube").value =
    settings.redesSociais?.youtube || "";
}

function saveAdminSettings(event) {
  event.preventDefault();

  const settings = {
    logoText: document.getElementById("settingsLogoText").value,
    tagline: document.getElementById("settingsTagline").value,
    logoUrl: document.getElementById("settingsLogoUrl").value,
    bannerTitulo: document.getElementById("settingsBannerTitle").value,
    bannerSubtitulo: document.getElementById("settingsBannerSubtitle").value,
    bannerImagemUrl: document.getElementById("settingsBannerImage").value,
    bannerCta: document.getElementById("settingsBannerCta").value,
    emailContacto: document.getElementById("settingsEmailContacto").value,
    emailColaboracao: document.getElementById("settingsEmailColaboracao").value,
    telefone: document.getElementById("settingsTelefone").value,
    endereco: document.getElementById("settingsEndereco").value,
    redesSociais: {
      facebook: document.getElementById("settingsFacebook").value,
      instagram: document.getElementById("settingsInstagram").value,
      twitter: document.getElementById("settingsTwitter").value,
      youtube: document.getElementById("settingsYoutube").value,
    },
  };

  updateSiteSettings(settings);
  showToast("Configurações guardadas com sucesso!", "success");
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
                <label for="serviceImage">📸 URL da Imagem do Serviço</label>
                <input type="url" id="serviceImage" name="imagemUrl" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do serviço e na página de detalhes</small>
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
  openModal("Adicionar Serviço", content);
}

function handleServiceSubmit(event, editId = null) {
  event.preventDefault();

  const form = event.target;
  const data = {
    nome: form.nome.value,
    preco: parseFloat(form.preco.value),
    duracao: form.duracao.value,
    categoria: form.categoria.value,
    imagemUrl:
      form.imagemUrl.value ||
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    descricao: form.descricao.value,
    ativo: form.ativo.checked,
  };

  if (editId) {
    updateService(editId, data);
    showToast("Serviço atualizado!", "success");
  } else {
    createService(data);
    showToast("Serviço criado!", "success");
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
                <input type="text" id="serviceCategory" name="categoria" value="${service.categoria || ""}">
            </div>
            <div class="form-group">
                <label for="serviceImage">📸 URL da Imagem do Serviço</label>
                <input type="url" id="serviceImage" name="imagemUrl" value="${service.imagemUrl || ""}" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do serviço e na página de detalhes</small>
            </div>
            <div class="form-group">
                <label for="serviceDesc">Descrição *</label>
                <textarea id="serviceDesc" name="descricao" rows="4" required>${service.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="serviceActive" name="ativo" ${service.ativo ? "checked" : ""}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
  openModal("Editar Serviço", content);
}

function deleteServiceItem(id) {
  if (confirm("Tens a certeza que queres eliminar este serviço?")) {
    deleteService(id);
    showToast("Serviço eliminado", "info");
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
                <label for="workshopImage">🎯 URL da Imagem do Workshop</label>
                <input type="url" id="workshopImage" name="imagemUrl" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do workshop e na página de detalhes</small>
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
  openModal("Adicionar Workshop", content);
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
    imagemUrl:
      form.imagemUrl.value ||
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    descricao: form.descricao.value,
    observacoes: form.observacoes.value,
    ativo: form.ativo.checked,
  };

  if (editId) {
    updateWorkshop(editId, data);
    showToast("Workshop atualizado!", "success");
  } else {
    createWorkshop(data);
    showToast("Workshop criado!", "success");
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
                        <option value="Presencial" ${workshop.modalidade === "Presencial" ? "selected" : ""}>Presencial</option>
                        <option value="Online" ${workshop.modalidade === "Online" ? "selected" : ""}>Online</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="workshopVagas">Vagas *</label>
                    <input type="number" id="workshopVagas" name="vagas" value="${workshop.vagas}" required min="1">
                </div>
            </div>
            <div class="form-group">
                <label for="workshopImage">🎯 URL da Imagem do Workshop</label>
                <input type="url" id="workshopImage" name="imagemUrl" value="${workshop.imagemUrl || ""}" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do workshop e na página de detalhes</small>
            </div>
            <div class="form-group">
                <label for="workshopDesc">Descrição *</label>
                <textarea id="workshopDesc" name="descricao" rows="4" required>${workshop.descricao}</textarea>
            </div>
            <div class="form-group">
                <label for="workshopNotes">Observações</label>
                <textarea id="workshopNotes" name="observacoes" rows="2">${workshop.observacoes || ""}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="workshopActive" name="ativo" ${workshop.ativo ? "checked" : ""}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
  openModal("Editar Workshop", content);
}

function deleteWorkshopItem(id) {
  if (confirm("Tens a certeza que queres eliminar este workshop?")) {
    deleteWorkshop(id);
    showToast("Workshop eliminado", "info");
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
                <label for="eventImage">🎉 URL da Imagem do Evento</label>
                <input type="url" id="eventImage" name="imagemUrl" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do evento e na página de detalhes</small>
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
  openModal("Adicionar Evento", content);
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
    imagemUrl:
      form.imagemUrl.value ||
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
    descricao: form.descricao.value,
    ativo: form.ativo.checked,
  };

  if (editId) {
    updateEvent(editId, data);
    showToast("Evento atualizado!", "success");
  } else {
    createEvent(data);
    showToast("Evento criado!", "success");
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
                <label for="eventImage">🎉 URL da Imagem do Evento</label>
                <input type="url" id="eventImage" name="imagemUrl" value="${evt.imagemUrl || ""}" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do evento e na página de detalhes</small>
            </div>
            <div class="form-group">
                <label for="eventDesc">Descrição *</label>
                <textarea id="eventDesc" name="descricao" rows="4" required>${evt.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="eventActive" name="ativo" ${evt.ativo ? "checked" : ""}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
  openModal("Editar Evento", content);
}

function deleteEventItem(id) {
  if (confirm("Tens a certeza que queres eliminar este evento?")) {
    deleteEvent(id);
    showToast("Evento eliminado", "info");
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
                <label for="productImage">🛍️ URL da Imagem do Produto</label>
                <input type="url" id="productImage" name="imagemUrl" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do produto e na página de detalhes</small>
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
  openModal("Adicionar Produto", content);
}

function handleProductSubmit(event, editId = null) {
  event.preventDefault();

  const form = event.target;
  const data = {
    nome: form.nome.value,
    preco: parseFloat(form.preco.value),
    estoque: parseInt(form.estoque.value) || 0,
    categoria: form.categoria.value,
    imagemUrl:
      form.imagemUrl.value ||
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    descricao: form.descricao.value,
    ativo: form.ativo.checked,
  };

  if (editId) {
    updateProduct(editId, data);
    showToast("Produto atualizado!", "success");
  } else {
    createProduct(data);
    showToast("Produto criado!", "success");
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
                <label for="productImage">🛍️ URL da Imagem do Produto</label>
                <input type="url" id="productImage" name="imagemUrl" value="${product.imagemUrl || ""}" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no card do produto e na página de detalhes</small>
            </div>
            <div class="form-group">
                <label for="productDesc">Descrição *</label>
                <textarea id="productDesc" name="descricao" rows="4" required>${product.descricao}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="productActive" name="ativo" ${product.ativo ? "checked" : ""}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
  openModal("Editar Produto", content);
}

function deleteProductItem(id) {
  if (confirm("Tens a certeza que queres eliminar este produto?")) {
    deleteProduct(id);
    showToast("Produto eliminado", "info");
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
                <label for="postImage">📰 URL da Imagem do Post (Blog)</label>
                <input type="url" id="postImage" name="imagemUrl" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no carrossel "Novidades" e nos posts do blog</small>
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
  openModal("Adicionar Post", content, { size: "large" });
}

function handlePostSubmit(event, editId = null) {
  event.preventDefault();

  const form = event.target;
  const data = {
    titulo: form.titulo.value,
    categoria: form.categoria.value,
    dataPublicacao: form.dataPublicacao.value,
    imagemUrl:
      form.imagemUrl.value ||
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    excerpt: form.excerpt.value,
    conteudo: form.conteudo.value,
    autor: "Yemar Makeup Artist",
    ativo: form.ativo.checked,
  };

  if (editId) {
    updatePost(editId, data);
    showToast("Post atualizado!", "success");
  } else {
    createPost(data);
    showToast("Post criado!", "success");
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
                <label for="postImage">📰 URL da Imagem do Post (Blog)</label>
                <input type="url" id="postImage" name="imagemUrl" value="${post.imagemUrl || ""}" placeholder="https://exemplo.com/imagem.jpg">
                <small style="color: #666; font-size: 0.85rem;">Esta imagem aparecerá no carrossel "Novidades" e nos posts do blog</small>
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
                    <input type="checkbox" id="postActive" name="ativo" ${post.ativo ? "checked" : ""}> Ativo
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Guardar</button>
        </form>
    `;
  openModal("Editar Post", content, { size: "large" });
}

function deletePostItem(id) {
  if (confirm("Tens a certeza que queres eliminar este post?")) {
    deletePost(id);
    showToast("Post eliminado", "info");
    loadAdminPosts();
  }
}

// ============================================
// PÁGINA DE CONTA
// ============================================

function loadAccountPage() {
  const session = getCurrentSession();
  const authArea = document.getElementById("authArea");
  const profileArea = document.getElementById("profileArea");

  if (session) {
    // Usuário logado - mostrar perfil
    if (authArea) authArea.style.display = "none";
    if (profileArea) profileArea.style.display = "block";

    // Preencher dados do usuário
    document.getElementById("userName").textContent = session.nome;
    document.getElementById("userEmail").textContent = session.email;

    // Carregar marcações e encomendas
    loadUserBookings();
    loadUserOrders();
    loadUserSettings();

    // Inicializar tabs do perfil
    initProfileTabs();
  } else {
    // Visitante - mostrar login/registo
    if (authArea) authArea.style.display = "block";
    if (profileArea) profileArea.style.display = "none";

    // Inicializar tabs de auth
    initAuthTabs();

    // Inicializar forms
    initAuthForms();
  }
}

function initAuthTabs() {
  const tabs = document.querySelectorAll(".auth-tab[data-tab]");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.tab === "login") {
        loginForm.classList.add("active");
        loginForm.style.display = "block";
        registerForm.classList.remove("active");
        registerForm.style.display = "none";
      } else {
        registerForm.classList.add("active");
        registerForm.style.display = "block";
        loginForm.classList.remove("active");
        loginForm.style.display = "none";
      }
    });
  });
}

function initAuthForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const senha = document.getElementById("loginPassword").value;

      const user = validateLogin(email, senha);

      if (user) {
        setCurrentSession(user);
        showToast("Login efetuado com sucesso!", "success");

        setTimeout(() => {
          if (user.role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.reload();
          }
        }, 1000);
      } else {
        showToast("Email ou senha incorretos", "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("registerName").value.trim();
      const telefone = document.getElementById("registerPhone").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const senha = document.getElementById("registerPassword").value;
      const confirmarSenha = document.getElementById(
        "registerPasswordConfirm",
      ).value;

      if (senha !== confirmarSenha) {
        showToast("As senhas não coincidem", "error");
        return;
      }

      if (senha.length < 6) {
        showToast("A senha deve ter pelo menos 6 caracteres", "error");
        return;
      }

      if (getUserByEmail(email)) {
        showToast("Este email já está registado", "error");
        return;
      }

      const newUser = createUser({ nome, email, telefone, senha });
      setCurrentSession(newUser);
      showToast("Conta criada com sucesso!", "success");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
}

function initProfileTabs() {
  const tabs = document.querySelectorAll(".auth-tab[data-profile-tab]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Esconder todas as tabs
      document.querySelectorAll(".profile-tab").forEach((t) => {
        t.style.display = "none";
        t.classList.remove("active");
      });

      // Mostrar tab selecionada
      const tabId = tab.dataset.profileTab + "Tab";
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.style.display = "block";
        tabContent.classList.add("active");
      }
    });
  });
}

function loadUserBookings() {
  const container = document.getElementById("userBookings");
  if (!container) return;

  const session = getCurrentSession();
  if (!session) return;

  const bookings = getUserBookings(session.id);

  if (bookings.length === 0) {
    container.innerHTML = '<p class="no-items">Ainda não tens marcações.</p>';
    return;
  }

  container.innerHTML = bookings
    .map(
      (b) => `
        <div class="booking-card">
            <div class="booking-info">
                <h4>${b.itemTitulo}</h4>
                <p><strong>Tipo:</strong> ${b.tipo}</p>
                <p><strong>Data/Hora:</strong> ${b.dataHoraOuPreferencia}</p>
                <p><strong>Estado:</strong> <span class="status-badge status-${b.estado}">${getStatusLabel(b.estado)}</span></p>
            </div>
            ${b.estado === "pending" ? `<button class="btn btn-outline btn-sm" onclick="cancelUserBooking('${b.id}')">Cancelar</button>` : ""}
        </div>
    `,
    )
    .join("");
}

function loadUserOrders() {
  const container = document.getElementById("userOrders");
  if (!container) return;

  const session = getCurrentSession();
  if (!session) return;

  const orders = getUserOrders(session.id);

  if (orders.length === 0) {
    container.innerHTML = '<p class="no-items">Ainda não tens encomendas.</p>';
    return;
  }

  container.innerHTML = orders
    .map(
      (o) => `
        <div class="order-card">
            <div class="order-info">
                <h4>Encomenda #${o.id.slice(-6).toUpperCase()}</h4>
                <p><strong>Data:</strong> ${formatDate(new Date(o.createdAt))}</p>
                <p><strong>Total:</strong> ${o.total}€</p>
                <p><strong>Estado:</strong> <span class="status-badge status-${o.estado}">${getOrderStatusLabel(o.estado)}</span></p>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadUserSettings() {
  const session = getCurrentSession();
  if (!session) {
    console.log("loadUserSettings: Sem sessão");
    return;
  }

  console.log("loadUserSettings: Sessão encontrada", session);

  // Verificar se estamos na página correta (conta.html)
  const settingsForm = document.getElementById("settingsForm");
  if (!settingsForm) {
    console.log(
      "loadUserSettings: Formulário settingsForm não encontrado, pulando...",
    );
    return;
  }

  // Usar dados da sessão diretamente
  const user = session;

  // Aguardar DOM estar pronto
  setTimeout(() => {
    // Preencher campos
    const nameInput = document.getElementById("settingsName");
    const phoneInput = document.getElementById("settingsPhone");
    const emailInput = document.getElementById("settingsEmail");

    if (nameInput) nameInput.value = user.nome || "";
    if (phoneInput) phoneInput.value = user.telefone || "";
    if (emailInput) emailInput.value = user.email || "";

    console.log("Campos preenchidos:", {
      nome: nameInput?.value,
      telefone: phoneInput?.value,
      email: emailInput?.value,
    });

    // Configurar formulário
    if (!settingsForm) {
      console.error("Formulário settingsForm não encontrado!");
      return;
    }

    // Remover listeners antigos
    if (settingsForm.dataset.initialized === "true") {
      console.log("Formulário já inicializado, pulando...");
      return;
    }

    settingsForm.dataset.initialized = "true";
    console.log("Inicializando formulário de settings");

    // Event listener no formulário
    settingsForm.addEventListener("submit", handleSettingsSubmit);

    // Event listener direto no botão como fallback
    const submitBtn = settingsForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        console.log("Botão clicado diretamente");
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
  console.log("handleSettingsSubmit chamado");

  const session = getCurrentSession();
  if (!session) {
    console.error("Sem sessão ao salvar");
    showToast("Erro: Sessão expirada", "error");
    return;
  }

  const nome = document.getElementById("settingsName").value.trim();
  const telefone = document.getElementById("settingsPhone").value.trim();
  const email = document.getElementById("settingsEmail").value.trim();

  console.log("Dados do formulário:", { nome, telefone, email });

  if (!nome || !email || !telefone) {
    console.log("Validação falhou: campo obrigatório vazio");
    showToast("Nome, telefone e email são obrigatórios!", "error");
    return;
  }

  console.log("Salvando diretamente no localStorage...");

  // Forçar salvamento direto no localStorage
  const users = getUsers();
  console.log("Usuários antes da atualização:", users);
  console.log("Sessão atual:", session);

  // Buscar por email (mais confiável que ID)
  const userIndex = users.findIndex(
    (u) => u.email.toLowerCase() === session.email.toLowerCase(),
  );
  console.log("Índice do usuário (busca por email):", userIndex);

  if (userIndex === -1) {
    console.error("Usuário não encontrado na lista");
    console.log("Tentando buscar por ID como fallback...");
    const userIndexById = users.findIndex((u) => u.id === session.id);
    console.log("Índice por ID:", userIndexById);

    if (userIndexById === -1) {
      showToast("Erro: Usuário não encontrado", "error");
      return;
    }

    // Usar índice encontrado por ID
    const finalIndex = userIndexById;

    // Atualizar dados
    users[finalIndex] = {
      ...users[finalIndex],
      nome: nome,
      telefone: telefone,
      email: email,
    };

    console.log("Usuário atualizado (via ID):", users[finalIndex]);

    // Salvar
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Dados salvos no localStorage");

    // Atualizar sessão
    setCurrentSession(users[finalIndex]);
    showToast("Dados atualizados com sucesso!", "success");
    updateAuthUI();
    return;
  }

  // Atualizar dados do usuário
  users[userIndex] = {
    ...users[userIndex],
    nome: nome,
    telefone: telefone,
    email: email,
  };

  console.log("Usuário atualizado:", users[userIndex]);

  // Salvar diretamente no localStorage
  localStorage.setItem("users", JSON.stringify(users));
  console.log("Dados salvos no localStorage");

  // Verificar se foi salvo
  const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const savedUser = savedUsers.find((u) => u.id === session.id);
  console.log("Usuário verificado após salvar:", savedUser);

  // Atualizar sessão
  setCurrentSession(users[userIndex]);

  showToast("Dados atualizados com sucesso!", "success");

  // Atualizar UI
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");

  if (userNameEl) userNameEl.textContent = nome;
  if (userEmailEl) userEmailEl.textContent = email;

  // Atualizar auth UI
  updateAuthUI();

  console.log("Salvamento concluído com sucesso!");
}

function logout() {
  clearSession();
  showToast("Sessão terminada", "info");
  window.location.href = "index.html";
}

function getStatusLabel(status) {
  const labels = {
    pending: "Pendente",
    confirmed: "Confirmada",
    completed: "Concluída",
    cancelled: "Cancelada",
  };
  return labels[status] || status;
}

function getOrderStatusLabel(status) {
  const labels = {
    pending: "Pendente",
    processing: "Em Processamento",
    shipped: "Enviada",
    delivered: "Entregue",
    cancelled: "Cancelada",
  };
  return labels[status] || status;
}

// ============================================
// PÁGINA DO CARRINHO
// ============================================

function loadCartPage() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");

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
    if (cartSummary) cartSummary.style.display = "none";
    return;
  }

  let subtotal = 0;

  cartItems.innerHTML = cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return "";

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
    })
    .join("");

  if (cartSummary) {
    cartSummary.style.display = "block";
    document.getElementById("cartSubtotal").textContent = `${subtotal}€`;
    document.getElementById("cartTotal").textContent = `${subtotal}€`;
  }
}

function checkout() {
  const session = getCurrentSession();

  if (!session) {
    showToast("Precisas de estar logado para finalizar a compra", "error");
    setTimeout(() => {
      window.location.href = "conta.html";
    }, 1500);
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast("O teu carrinho está vazio", "error");
    return;
  }

  // Calcular total
  let total = 0;
  const items = cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (product) {
        total += product.preco * item.quantity;
        return {
          productId: item.productId,
          nome: product.nome,
          preco: product.preco,
          quantity: item.quantity,
        };
      }
      return null;
    })
    .filter(Boolean);

  // Criar encomenda
  const order = createOrder({
    userId: session.id,
    items: items,
    total: total,
  });

  // Limpar carrinho
  clearCart();
  updateCartBadge();

  showToast("Encomenda realizada com sucesso!", "success");

  setTimeout(() => {
    window.location.href = "conta.html";
  }, 2000);
}

// ============================================
// PÁGINA DE EVENTO
// ============================================

function loadEventDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    window.location.href = "eventos.html";
    return;
  }

  const event = getEventById(id);
  if (!event) {
    showToast("Evento não encontrado", "error");
    window.location.href = "eventos.html";
    return;
  }

  // Preencher página
  document.getElementById("eventImage").src = event.imagemUrl;
  document.getElementById("eventImage").alt = event.titulo;
  document.getElementById("eventTitle").textContent = event.titulo;
  document.getElementById("eventDate").textContent = formatDate(
    new Date(event.data),
  );
  document.getElementById("eventTime").textContent = new Date(
    event.data,
  ).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("eventLocation").textContent = event.local;
  document.getElementById("eventSpots").textContent = event.vagas;
  document.getElementById("eventPrice").textContent =
    event.preco > 0 ? `${event.preco}€` : "Gratuito";
  document.getElementById("eventDescription").innerHTML =
    event.descricao.replace(/\n/g, "<br>");

  // Botão de inscrição
  const bookBtn = document.getElementById("bookEventBtn");
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

  if (!session || session.role !== "admin") {
    showToast("Acesso restrito a administradores", "error");
    window.location.href = "conta.html";
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

  // Carregar formação e certificações textuais
  loadFormacaoList();
  loadCertificacaoList();

  // Carregar analytics
  loadAnalyticsStats();
}

function initAdminNav() {
  const navItems = document.querySelectorAll(".admin-menu-item");
  const mobileNavItems = document.querySelectorAll("#mobileAdminNav a");

  const allItems = [...navItems, ...mobileNavItems];

  allItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const section = item.dataset.section;

      // Atualizar active state
      navItems.forEach((i) => i.classList.remove("active"));
      mobileNavItems.forEach((i) => i.classList.remove("active"));

      document
        .querySelectorAll(`[data-section="${section}"]`)
        .forEach((i) => i.classList.add("active"));

      // Esconder todas as seções
      document.querySelectorAll(".admin-section").forEach((s) => {
        s.classList.remove("active");
        s.style.display = "none";
      });

      // Mostrar seção selecionada
      const sectionEl = document.getElementById(section + "Section");
      if (sectionEl) {
        sectionEl.classList.add("active");
        sectionEl.style.display = "block";

        // Carregar dados da seção
        loadAdminSection(section);
      }

      // Fechar menu mobile
      const mobileMenu = document.getElementById("mobileMenu");
      if (mobileMenu) {
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });
}

function loadAdminSection(section) {
  switch (section) {
    case "dashboard":
      loadAdminDashboard();
      break;
    case "bookings":
      loadAdminBookings();
      break;
    case "orders":
      loadAdminOrders();
      break;
    case "services":
      loadAdminServices();
      break;
    case "workshops":
      loadAdminWorkshops();
      break;
    case "products":
      loadAdminProducts();
      break;
    case "posts":
      loadAdminPosts();
      break;
    case "events":
      loadAdminEvents();
      break;
    case "users":
      loadAdminUsers();
      break;
    case "messages":
      loadAdminMessages();
      break;
    case "images":
      loadImagesSection();
      break;
    case "reports":
      loadAdminReports();
      break;
    case "settings":
      loadAdminSettingsPage();
      break;
  }
}

function loadAdminReports() {
  initializeReportDates();
  loadReports();
}

function loadAdminDashboard() {
  const statsGrid = document.getElementById("statsGrid");
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
  const recentBookings = document.getElementById("recentBookings");
  if (recentBookings) {
    const bookings = getBookings().slice(0, 5);
    if (bookings.length === 0) {
      recentBookings.innerHTML =
        '<p class="no-items">Sem marcações recentes.</p>';
    } else {
      recentBookings.innerHTML = bookings
        .map(
          (b) => `
                <div class="recent-item">
                    <strong>${b.itemTitulo}</strong>
                    <span class="status-badge status-${b.estado}">${getStatusLabel(b.estado)}</span>
                </div>
            `,
        )
        .join("");
    }
  }

  // Carregar encomendas recentes
  const recentOrders = document.getElementById("recentOrders");
  if (recentOrders) {
    const orders = getOrders().slice(0, 5);
    if (orders.length === 0) {
      recentOrders.innerHTML =
        '<p class="no-items">Sem encomendas recentes.</p>';
    } else {
      recentOrders.innerHTML = orders
        .map(
          (o) => `
                <div class="recent-item">
                    <strong>#${o.id.slice(-6).toUpperCase()}</strong> - ${o.total}€
                    <span class="status-badge status-${o.estado}">${getOrderStatusLabel(o.estado)}</span>
                </div>
            `,
        )
        .join("");
    }
  }
}

function loadAdminUsers() {
  const container = document.getElementById("usersTableBody");
  if (container) {
    const users = getUsers();
    container.innerHTML = users
      .map(
        (u) => `
            <tr>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.telefone || "-"}</td>
                <td><span class="status-badge ${u.role === "admin" ? "status-confirmed" : "status-pending"}">${u.role === "admin" ? "Admin" : "Utilizador"}</span></td>
                <td>${formatDate(new Date(u.createdAt))}</td>
            </tr>
        `,
      )
      .join("");
  }
}

function loadAdminMessages() {
  const container = document.getElementById("messagesTableBody");
  if (container) {
    const messages = getMessages ? getMessages() : [];
    if (messages.length === 0) {
      container.innerHTML = '<tr><td colspan="6">Sem mensagens.</td></tr>';
    } else {
      container.innerHTML = messages
        .map(
          (m) => `
                <tr>
                    <td>${m.nome}</td>
                    <td>${m.email}</td>
                    <td>${m.assunto}</td>
                    <td>${formatDate(new Date(m.createdAt))}</td>
                    <td><span class="status-badge ${m.lida ? "status-confirmed" : "status-pending"}">${m.lida ? "Lida" : "Nova"}</span></td>
                    <td>
                        <button class="btn-action" onclick="viewMessage('${m.id}')" title="Ver">👁</button>
                    </td>
                </tr>
            `,
        )
        .join("");
    }
  }
}

function updateImagePreviews() {
  const welcomeAvatarUrl = document.getElementById("welcomeAvatarUrl");
  const aboutImageUrl = document.getElementById("aboutImageUrl");
  const footerAvatarUrl = document.getElementById("footerAvatarUrl");

  const welcomePreview = document.getElementById("welcomeAvatarPreview");
  const aboutPreview = document.getElementById("aboutImagePreview");
  const footerPreview = document.getElementById("footerAvatarPreview");

  if (welcomeAvatarUrl && welcomePreview) {
    welcomePreview.src = welcomeAvatarUrl.value || welcomeAvatarUrl.placeholder;
  }
  if (aboutImageUrl && aboutPreview) {
    aboutPreview.src = aboutImageUrl.value || aboutImageUrl.placeholder;
  }
  if (footerAvatarUrl && footerPreview) {
    footerPreview.src = footerAvatarUrl.value || footerAvatarUrl.placeholder;
  }
}

function loadAdminSettingsPage() {
  // Carregar configurações existentes se houver
  const settings = getSiteSettings();

  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const heroImage = document.getElementById("heroImage");
  const heroCta = document.getElementById("heroCta");
  const contactEmail = document.getElementById("settingsContactEmail");
  const contactPhone = document.getElementById("settingsContactPhone");
  const contactAddress = document.getElementById("settingsAddress");
  const contactWhatsApp = document.getElementById("settingsWhatsApp");
  const contactMapUrl = document.getElementById("settingsMapUrl");
  const whatsappTemplate = document.getElementById(
    "whatsappNotificationTemplate",
  );

  if (heroTitle)
    heroTitle.value = settings.bannerTitulo || "Realça a Tua Beleza Natural";
  if (heroSubtitle)
    heroSubtitle.value =
      settings.bannerSubtitulo ||
      "Maquilhagem profissional para todos os momentos especiais da tua vida";
  if (heroImage) heroImage.value = settings.bannerImagemUrl || "";
  if (heroCta) heroCta.value = settings.bannerCta || "Marcar Agora";
  if (contactEmail)
    contactEmail.value = settings.emailContacto || "yemarmk@gmail.com";
  if (contactPhone)
    contactPhone.value = settings.telefone || "(+351) 933758731";
  if (contactAddress) contactAddress.value = settings.endereco || "";
  if (contactWhatsApp)
    contactWhatsApp.value = settings.whatsapp || "351933758731";
  if (contactMapUrl) contactMapUrl.value = settings.mapUrl || "";
  if (whatsappTemplate)
    whatsappTemplate.value =
      settings.whatsappNotificationTemplate || getDefaultWhatsAppTemplate();

  // Form handlers
  const heroForm = document.getElementById("heroSettingsForm");
  if (heroForm && heroForm.dataset.initialized !== "true") {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentSettings = getSiteSettings();
      updateSiteSettings({
        ...currentSettings,
        bannerTitulo: document.getElementById("heroTitle").value,
        bannerSubtitulo: document.getElementById("heroSubtitle").value,
        bannerImagemUrl: document.getElementById("heroImage").value,
        bannerCta: document.getElementById("heroCta").value,
      });

      showToast("Configurações do banner guardadas!", "success");
    });
    heroForm.dataset.initialized = "true";
  }

  const contactForm = document.getElementById("contactSettingsForm");
  if (contactForm && contactForm.dataset.initialized !== "true") {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentSettings = getSiteSettings();
      updateSiteSettings({
        ...currentSettings,
        emailContacto: document.getElementById("settingsContactEmail").value,
        telefone: document.getElementById("settingsContactPhone").value,
        whatsapp: document.getElementById("settingsWhatsApp").value,
        endereco: document.getElementById("settingsAddress").value,
        mapUrl: document.getElementById("settingsMapUrl").value,
      });

      showToast("Informações de contacto guardadas!", "success");
    });
    contactForm.dataset.initialized = "true";
  }

  // Carregar imagens existentes
  const welcomeAvatarUrl = document.getElementById("welcomeAvatarUrl");
  const aboutImageUrl = document.getElementById("aboutImageUrl");
  const footerAvatarUrl = document.getElementById("footerAvatarUrl");

  if (welcomeAvatarUrl)
    welcomeAvatarUrl.value =
      settings.welcomeAvatarUrl || "images/logo_name.png";
  if (aboutImageUrl)
    aboutImageUrl.value = settings.aboutImageUrl || "images/capa.png";
  if (footerAvatarUrl)
    footerAvatarUrl.value =
      settings.footerAvatarUrl || "images/logo_name.png";

  // Atualizar previews das imagens
  updateImagePreviews();

  // Adicionar event listeners para atualizar previews em tempo real
  if (welcomeAvatarUrl) {
    welcomeAvatarUrl.addEventListener("input", updateImagePreviews);
  }
  if (aboutImageUrl) {
    aboutImageUrl.addEventListener("input", updateImagePreviews);
  }
  if (footerAvatarUrl) {
    footerAvatarUrl.addEventListener("input", updateImagePreviews);
  }

  // Form handler para imagens
  const imagesForm = document.getElementById("imagesSettingsForm");
  if (imagesForm && imagesForm.dataset.initialized !== "true") {
    imagesForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentSettings = getSiteSettings();
      updateSiteSettings({
        ...currentSettings,
        welcomeAvatarUrl: document.getElementById("welcomeAvatarUrl").value,
        aboutImageUrl: document.getElementById("aboutImageUrl").value,
        footerAvatarUrl: document.getElementById("footerAvatarUrl").value,
      });

      // Aplicar as configurações na página atual
      applySiteSettings();

      showToast(
        "Imagens guardadas! Recarregue outras páginas para ver as alterações.",
        "success",
      );
    });
    imagesForm.dataset.initialized = "true";
  }

  // Form handler para mensagens WhatsApp
  const whatsappForm = document.getElementById("whatsappSettingsForm");
  if (whatsappForm && whatsappForm.dataset.initialized !== "true") {
    whatsappForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentSettings = getSiteSettings();
      updateSiteSettings({
        ...currentSettings,
        whatsappNotificationTemplate: document.getElementById(
          "whatsappNotificationTemplate",
        ).value,
      });

      showToast("Mensagem WhatsApp guardada!", "success");
    });
    whatsappForm.dataset.initialized = "true";
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
  if (
    confirm(
      "Tens a certeza? Isto irá repor todos os dados para os valores iniciais.",
    )
  ) {
    localStorage.clear();
    initializeSeed();
    showToast("Dados repostos com sucesso!", "success");
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
    settings: getSiteSettings(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "yemar-makeup-data.json";
  a.click();
  URL.revokeObjectURL(url);

  showToast("Dados exportados com sucesso!", "success");
}

function getAdminStats() {
  return {
    pendingBookings: getBookings().filter((b) => b.estado === "pending").length,
    pendingOrders: getOrders().filter((o) => o.estado === "pending").length,
    totalUsers: getUsers().length,
    totalProducts: getProducts().length,
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
  if (input.type === "password") {
    input.type = "text";
    button.classList.add("active");
    button.querySelector(".eye-icon").textContent = "🙈";
  } else {
    input.type = "password";
    button.classList.remove("active");
    button.querySelector(".eye-icon").textContent = "👁";
  }
}

// ============================================
// ADMIN - PORTFOLIO MANAGEMENT
// ============================================

function addPortfolioImageAdmin() {
  const imageUrl = document.getElementById("portfolioImageUrl").value.trim();
  const title = document.getElementById("portfolioImageTitle").value.trim();
  const description = document
    .getElementById("portfolioImageDesc")
    .value.trim();

  if (!imageUrl) {
    showToast("Por favor, insira a URL da imagem", "error");
    return;
  }

  addPortfolioImage({
    imageUrl,
    title,
    description,
  });

  document.getElementById("portfolioImageUrl").value = "";
  document.getElementById("portfolioImageTitle").value = "";
  document.getElementById("portfolioImageDesc").value = "";

  showToast("Imagem adicionada ao portfólio!", "success");
  loadPortfolioImagesAdmin();
}

function loadPortfolioImagesAdmin() {
  const images = getPortfolioImages();
  const grid = document.getElementById("portfolioImagesGrid");

  if (!grid) return;

  if (images.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhuma imagem no portfólio.</p>';
    return;
  }

  grid.innerHTML = images
    .map(
      (img) => `
        <div class="admin-image-item">
            <img src="${img.imageUrl}" alt="${img.title || "Portfolio"}">
            <div class="admin-image-actions">
                <span style="font-size: 0.85rem;">${img.title || "Sem título"}</span>
                <button class="btn btn-sm btn-outline" onclick="removePortfolioImageAdmin('${img.id}')">Remover</button>
            </div>
        </div>
    `,
    )
    .join("");
}

function removePortfolioImageAdmin(id) {
  if (confirm("Tem certeza que deseja remover esta imagem?")) {
    removePortfolioImage(id);
    showToast("Imagem removida!", "success");
    loadPortfolioImagesAdmin();
  }
}

// ============================================
// ADMIN - CERTIFICATES MANAGEMENT
// ============================================

function addCertificateAdmin() {
  const imageUrl = document.getElementById("certificateImageUrl").value.trim();
  const title = document.getElementById("certificateTitle").value.trim();
  const year = document.getElementById("certificateYear").value.trim();

  if (!imageUrl || !title) {
    showToast("Por favor, preencha a URL e o título do certificado", "error");
    return;
  }

  addCertificate({
    imageUrl,
    title,
    year,
  });

  document.getElementById("certificateImageUrl").value = "";
  document.getElementById("certificateTitle").value = "";
  document.getElementById("certificateYear").value = "";

  showToast("Certificado adicionado!", "success");
  loadCertificatesAdmin();
}

function loadCertificatesAdmin() {
  const certificates = getCertificates();
  const grid = document.getElementById("certificatesGrid");

  if (!grid) return;

  if (certificates.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum certificado cadastrado.</p>';
    return;
  }

  grid.innerHTML = certificates
    .map(
      (cert) => `
        <div class="admin-image-item">
            <img src="${cert.imageUrl}" alt="${cert.title}">
            <div class="admin-image-actions">
                <div>
                    <strong style="font-size: 0.85rem;">${cert.title}</strong>
                    ${cert.year ? `<br><small>${cert.year}</small>` : ""}
                </div>
                <button class="btn btn-sm btn-outline" onclick="removeCertificateAdmin('${cert.id}')">Remover</button>
            </div>
        </div>
    `,
    )
    .join("");
}

function removeCertificateAdmin(id) {
  if (confirm("Tem certeza que deseja remover este certificado?")) {
    removeCertificate(id);
    showToast("Certificado removido!", "success");
    loadCertificatesAdmin();
  }
}

// ============================================
// ADMIN - ANALYTICS
// ============================================

function loadAnalyticsStats() {
  const stats = getVisitStats();
  const container = document.getElementById("analyticsStats");

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
  const container = document.getElementById("pageVisitsChart");

  if (!container) return;

  const sortedPages = Object.entries(byPage).sort((a, b) => b[1] - a[1]);

  if (sortedPages.length === 0) {
    container.innerHTML =
      '<p style="color: #666;">Nenhuma visita registrada ainda.</p>';
    return;
  }

  const maxVisits = Math.max(...sortedPages.map((p) => p[1]));

  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${sortedPages
              .map(
                ([page, visits]) => `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="min-width: 100px; font-size: 0.9rem;">${page}</div>
                    <div style="flex: 1; background: #eee; border-radius: 4px; height: 24px; position: relative;">
                        <div style="background: var(--color-red); height: 100%; width: ${(visits / maxVisits) * 100}%; border-radius: 4px;"></div>
                    </div>
                    <div style="min-width: 40px; text-align: right; font-weight: 600;">${visits}</div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

// ============================================
// ADMIN - SETTINGS FORMS
// ============================================

function initAdminSettingsForms() {
  // Site Name Form
  const siteNameForm = document.getElementById("siteNameForm");
  if (siteNameForm && siteNameForm.dataset.initialized !== "true") {
    siteNameForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const tagline = document.getElementById("siteTagline").value;
      updateSiteSettings({ tagline });
      showToast("Nome do site atualizado!", "success");
      applySiteSettings();
    });
    siteNameForm.dataset.initialized = "true";
  }

  // Shop Settings Form
  const shopForm = document.getElementById("shopSettingsForm");
  if (shopForm && shopForm.dataset.initialized !== "true") {
    shopForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const shopEnabled = document.getElementById("shopEnabled").checked;
      updateSiteSettings({ shopEnabled });
      showToast("Configurações da loja atualizadas!", "success");
    });
    shopForm.dataset.initialized = "true";
  }

  // Load current settings
  const settings = getSiteSettings();
  if (settings) {
    const taglineInput = document.getElementById("siteTagline");
    const shopEnabledInput = document.getElementById("shopEnabled");

    if (taglineInput)
      taglineInput.value = settings.tagline || "Yemar Makeup Artist";
    if (shopEnabledInput)
      shopEnabledInput.checked = settings.shopEnabled !== false;
  }
}

// ============================================
// CERTIFICATES CAROUSEL
// ============================================

let currentCertificateIndex = 0;
let certificatesAutoplayInterval = null;

function loadCertificatesCarousel() {
  const certificates = getCertificates();
  const section = document.getElementById("certificatesSection");
  const track = document.getElementById("certificatesTrack");
  const controls = document.getElementById("carouselControls");

  if (!section || !track) return;

  if (certificates.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  track.innerHTML = certificates
    .map(
      (cert) => `
        <div class="certificate-item">
            <img src="${cert.imageUrl}" alt="${cert.title}">
            <div class="certificate-info">
                <h3>${cert.title}</h3>
                ${cert.year ? `<p>${cert.year}</p>` : ""}
            </div>
        </div>
    `,
    )
    .join("");

  // Show controls only if more than 1 certificate
  if (controls) {
    controls.style.display = certificates.length > 1 ? "flex" : "none";
  }

  currentCertificateIndex = 0;
  updateCertificatesCarousel();

  // Iniciar autoplay se houver mais de 1 certificado
  if (certificates.length > 1) {
    startCertificatesAutoplay();
  }
}

function moveCertificatesCarousel(direction) {
  const certificates = getCertificates();
  const maxIndex = Math.max(0, certificates.length - 1);

  // Parar autoplay quando usuário interage manualmente
  stopCertificatesAutoplay();

  currentCertificateIndex += direction;

  if (currentCertificateIndex < 0) {
    currentCertificateIndex = 0;
  } else if (currentCertificateIndex > maxIndex) {
    currentCertificateIndex = maxIndex;
  }

  updateCertificatesCarousel();

  // Reiniciar autoplay após 2 segundos de inatividade
  setTimeout(() => {
    if (certificates.length > 1) {
      startCertificatesAutoplay();
    }
  }, 2000);
}

function updateCertificatesCarousel() {
  const track = document.getElementById("certificatesTrack");
  if (!track) return;

  // Calcula offset baseado no container width para centralizar
  const containerWidth = track.parentElement.offsetWidth;
  const itemWidth = 600;
  const offset =
    containerWidth / 2 -
    itemWidth / 2 -
    currentCertificateIndex * (itemWidth + 20);
  track.style.transform = `translateX(${offset}px)`;

  // Update button states
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const certificates = getCertificates();
  const maxIndex = Math.max(0, certificates.length - 1);

  if (prevBtn) {
    prevBtn.disabled = currentCertificateIndex === 0;
  }

  if (nextBtn) {
    nextBtn.disabled = currentCertificateIndex >= maxIndex;
  }
}

function startCertificatesAutoplay() {
  // Limpar intervalo existente
  if (certificatesAutoplayInterval) {
    clearInterval(certificatesAutoplayInterval);
  }

  // Iniciar novo intervalo (troca a cada 4 segundos)
  certificatesAutoplayInterval = setInterval(() => {
    const certificates = getCertificates();
    const maxIndex = Math.max(0, certificates.length - 1);

    currentCertificateIndex++;

    // Voltar ao início quando chegar ao fim
    if (currentCertificateIndex > maxIndex) {
      currentCertificateIndex = 0;
    }

    updateCertificatesCarousel();
  }, 4000);
}

function stopCertificatesAutoplay() {
  if (certificatesAutoplayInterval) {
    clearInterval(certificatesAutoplayInterval);
    certificatesAutoplayInterval = null;
  }
}

// ============================================
// RELATÓRIOS E ANÁLISES
// ============================================

// Nota: As funções de relatórios foram movidas para o final do arquivo
// para melhor organização e compatibilidade com a nova interface

// ============================================
// FUNÇÕES ADMIN - MARCAÇÕES
// ============================================

/**
 * Editar marcação
 */
function adminEditBooking(bookingId) {
  const booking = getBookingById(bookingId);
  if (!booking) {
    showToast("Marcação não encontrada", "error");
    return;
  }

  const user = getUserById(booking.userId);

  const content = `
        <form id="editBookingForm" onsubmit="saveEditedBooking(event, '${bookingId}')">
            <div class="form-group">
                <label>Cliente</label>
                <input type="text" value="${user ? user.nome : "N/A"}" disabled>
            </div>
            
            <div class="form-group">
                <label>Tipo</label>
                <input type="text" value="${booking.tipo}" disabled>
            </div>
            
            <div class="form-group">
                <label>Serviço/Workshop/Evento</label>
                <input type="text" value="${booking.itemTitulo}" disabled>
            </div>
            
            <div class="form-group">
                <label for="editDataHora">Data e Hora *</label>
                <input type="datetime-local" id="editDataHora" name="dataHora" value="${convertToDateTimeLocal(booking.dataHoraOuPreferencia)}" required>
            </div>
            
            <div class="form-group">
                <label for="editObservacoes">Observações</label>
                <textarea id="editObservacoes" name="observacoes" rows="3">${booking.observacoes || ""}</textarea>
            </div>
            
            <div class="form-group">
                <label for="editStatus">Estado *</label>
                <select id="editStatus" name="status" required>
                    <option value="Pendente" ${booking.status === "Pendente" ? "selected" : ""}>Pendente</option>
                    <option value="Confirmada" ${booking.status === "Confirmada" ? "selected" : ""}>Confirmada</option>
                    <option value="Concluída" ${booking.status === "Concluída" ? "selected" : ""}>Concluída</option>
                    <option value="Cancelada" ${booking.status === "Cancelada" ? "selected" : ""}>Cancelada</option>
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">Guardar Alterações</button>
        </form>
    `;

  openModal("Editar Marcação", content);
}

/**
 * Salvar marcação editada
 */
function saveEditedBooking(event, bookingId) {
  event.preventDefault();

  const form = event.target;
  const dataHora = form.dataHora.value;
  const observacoes = form.observacoes.value;
  const status = form.status.value;

  // Atualizar marcação
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) {
    showToast("Erro ao atualizar marcação", "error");
    return;
  }

  bookings[index] = {
    ...bookings[index],
    dataHoraOuPreferencia: formatDateTimeForDisplay(dataHora),
    observacoes: observacoes,
    status: status,
  };

  localStorage.setItem("bookings", JSON.stringify(bookings));

  showToast("Marcação atualizada com sucesso!", "success");
  closeModal();
  loadAdminBookings();
}

/**
 * Converter data para formato datetime-local
 */
function convertToDateTimeLocal(dateString) {
  if (!dateString) return "";

  // Tentar parsear diferentes formatos
  try {
    // Formato: "15/01/2025 às 14:00"
    const match = dateString.match(
      /(\d{2})\/(\d{2})\/(\d{4})\s+às\s+(\d{2}):(\d{2})/,
    );
    if (match) {
      const [_, day, month, year, hour, minute] = match;
      return `${year}-${month}-${day}T${hour}:${minute}`;
    }

    // Formato ISO
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  } catch (e) {
    console.error("Erro ao converter data:", e);
  }

  return "";
}

/**
 * Formatar datetime-local para exibição
 */
function formatDateTimeForDisplay(dateTimeLocal) {
  if (!dateTimeLocal) return "";

  const date = new Date(dateTimeLocal);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

/**
 * Enviar mensagem WhatsApp ao cliente
 */
function adminSendWhatsAppToClient(bookingId) {
  const booking = getBookingById(bookingId);
  if (!booking) {
    showToast("Marcação não encontrada", "error");
    return;
  }

  const user = getUserById(booking.userId);
  if (!user) {
    showToast("Cliente não encontrado", "error");
    return;
  }

  const settings = getSiteSettings();

  // Mensagem padrão personalizável
  const content = `
        <form id="whatsappClientForm" onsubmit="sendWhatsAppToClient(event, '${bookingId}')">
            <div class="form-group">
                <label>Cliente</label>
                <input type="text" value="${user.nome}" disabled>
            </div>
            
            <div class="form-group">
                <label>Telefone do Cliente</label>
                <input type="text" id="clientPhone" value="${user.telefone || ""}" placeholder="Ex: 351912345678">
                <small>Formato: código do país + número (sem espaços ou símbolos)</small>
            </div>
            
            <div class="form-group">
                <label for="whatsappMessage">Mensagem *</label>
                <textarea id="whatsappMessage" name="message" rows="10" required>${getClientWhatsAppTemplate(booking, user)}</textarea>
                <small>Personalize a mensagem conforme necessário</small>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">📱 Abrir WhatsApp</button>
        </form>
    `;

  openModal("Enviar Mensagem ao Cliente", content);
}

/**
 * Template de mensagem WhatsApp para cliente
 */
function getClientWhatsAppTemplate(booking, user) {
  const settings = getSiteSettings();
  const statusMessages = {
    Pendente: "Recebemos a sua marcação e estamos a processar o seu pedido.",
    Confirmada: "A sua marcação foi confirmada! Aguardamos por si.",
    Concluída: "Obrigado por escolher os nossos serviços!",
    Cancelada: "A sua marcação foi cancelada conforme solicitado.",
  };

  return `Olá ${user.nome}! 👋

${statusMessages[booking.status] || "Informação sobre a sua marcação:"}

*Detalhes da Marcação:*
📅 Serviço: ${booking.itemTitulo}
📆 Data/Hora: ${booking.dataHoraOuPreferencia || "A confirmar"}
📍 Estado: ${booking.status}

${booking.observacoes ? `📝 Observações: ${booking.observacoes}\n\n` : ""}${booking.status === "Confirmada" ? "Por favor, chegue 10 minutos antes do horário marcado.\n\n" : ""}Qualquer dúvida, estamos à disposição!

_${settings.tagline || "Yemar Makeup Artist"}_`;
}

/**
 * Enviar WhatsApp ao cliente
 */
function sendWhatsAppToClient(event, bookingId) {
  event.preventDefault();

  const form = event.target;
  const phone = form.querySelector("#clientPhone").value.trim();
  const message = form.querySelector("#whatsappMessage").value.trim();

  if (!phone) {
    showToast("Por favor, insira o telefone do cliente", "error");
    return;
  }

  if (!message) {
    showToast("Por favor, escreva uma mensagem", "error");
    return;
  }

  // Limpar telefone (remover espaços, parênteses, hífens)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Criar URL do WhatsApp
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  // Abrir WhatsApp
  window.open(whatsappUrl, "_blank");

  showToast("WhatsApp aberto! Envie a mensagem.", "success");
  closeModal();
}

/**
 * FORMAÇÃO & CERTIFICAÇÕES
 */

function loadFormacaoList() {
  const settings = getSiteSettings();
  const formacaoList = document.getElementById("formacaoList");
  if (!formacaoList) return;

  const formacoes = settings.formacaoAcademica || [];

  if (formacoes.length === 0) {
    formacaoList.innerHTML =
      '<p style="color: #999; font-size: 0.9rem;">Nenhuma formação adicionada</p>';
    return;
  }

  formacaoList.innerHTML = formacoes
    .map(
      (formacao, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f9f9f9; border-radius: 4px; margin-bottom: 0.5rem;">
            <span style="font-size: 0.9rem;">${formacao}</span>
            <button class="btn btn-sm btn-outline" onclick="removeFormacao(${index})" style="padding: 0.25rem 0.5rem;">✕</button>
        </div>
    `,
    )
    .join("");
}

function addFormacao() {
  const input = document.getElementById("newFormacao");
  const value = input.value.trim();

  if (!value) {
    showToast("Por favor, insira a formação", "error");
    return;
  }

  const settings = getSiteSettings();
  if (!settings.formacaoAcademica) {
    settings.formacaoAcademica = [];
  }

  settings.formacaoAcademica.push(value);
  setData("siteSettings", settings);

  input.value = "";
  loadFormacaoList();
  showToast("Formação adicionada com sucesso!", "success");
}

function removeFormacao(index) {
  if (!confirm("Deseja remover esta formação?")) return;

  const settings = getSiteSettings();
  settings.formacaoAcademica.splice(index, 1);
  setData("siteSettings", settings);

  loadFormacaoList();
  showToast("Formação removida com sucesso!", "success");
}

function loadCertificacaoList() {
  const settings = getSiteSettings();
  const certificacaoList = document.getElementById("certificacaoList");
  if (!certificacaoList) return;

  const certificacoes = settings.certificacoesTextuais || [];

  if (certificacoes.length === 0) {
    certificacaoList.innerHTML =
      '<p style="color: #999; font-size: 0.9rem;">Nenhuma certificação adicionada</p>';
    return;
  }

  certificacaoList.innerHTML = certificacoes
    .map(
      (cert, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f9f9f9; border-radius: 4px; margin-bottom: 0.5rem;">
            <span style="font-size: 0.9rem;">${cert}</span>
            <button class="btn btn-sm btn-outline" onclick="removeCertificacao(${index})" style="padding: 0.25rem 0.5rem;">✕</button>
        </div>
    `,
    )
    .join("");
}

function addCertificacao() {
  const input = document.getElementById("newCertificacao");
  const value = input.value.trim();

  if (!value) {
    showToast("Por favor, insira a certificação", "error");
    return;
  }

  const settings = getSiteSettings();
  if (!settings.certificacoesTextuais) {
    settings.certificacoesTextuais = [];
  }

  settings.certificacoesTextuais.push(value);
  setData("siteSettings", settings);

  input.value = "";
  loadCertificacaoList();
  showToast("Certificação adicionada com sucesso!", "success");
}

function removeCertificacao(index) {
  if (!confirm("Deseja remover esta certificação?")) return;

  const settings = getSiteSettings();
  settings.certificacoesTextuais.splice(index, 1);
  setData("siteSettings", settings);

  loadCertificacaoList();
  showToast("Certificação removida com sucesso!", "success");
}

/**
 * Carregar formação e certificações na página Sobre
 */
function loadFormacaoSobrePage() {
  const list = document.getElementById("formacaoAcademicaList");
  if (!list) return;

  const settings = getSiteSettings();
  const formacoes = settings.formacaoAcademica || [];

  if (formacoes.length === 0) {
    list.innerHTML = "<li>Informação em breve</li>";
    return;
  }

  list.innerHTML = formacoes.map((f) => `<li>${f}</li>`).join("");
}

function loadCertificacoesSobrePage() {
  const list = document.getElementById("certificacoesTextuaisList");
  if (!list) return;

  const settings = getSiteSettings();
  const certificacoes = settings.certificacoesTextuais || [];

  if (certificacoes.length === 0) {
    list.innerHTML = "<li>Informação em breve</li>";
    return;
  }

  list.innerHTML = certificacoes.map((c) => `<li>${c}</li>`).join("");
}

// ============================================
// ADMIN - IMAGES MANAGEMENT SECTION
// ============================================

function loadImagesSection() {
  loadImagesServices();
  loadImagesWorkshops();
  loadImagesPosts();
  loadImagesTrend();
  loadImagesBride();
  loadImagesMistakes();
  loadImagesBrushes();
  loadImagesProducts();
  loadImagesEvents();
}

function loadImagesServices() {
  const services = getActiveServices();
  const grid = document.getElementById("imagesServicesGrid");
  if (!grid) return;

  if (services.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum serviço cadastrado.</p>';
    return;
  }

  grid.innerHTML = services
    .map(
      (service) => `
        <div class="admin-image-preview-card">
            <img src="${service.imagemUrl}" alt="${service.nome}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${service.nome}</div>
                <div class="admin-image-preview-url">${service.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('service', '${service.id}', '${service.nome}', '${service.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesWorkshops() {
  const workshops = getActiveWorkshops();
  const grid = document.getElementById("imagesWorkshopsGrid");
  if (!grid) return;

  if (workshops.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum workshop cadastrado.</p>';
    return;
  }

  grid.innerHTML = workshops
    .map(
      (workshop) => `
        <div class="admin-image-preview-card">
            <img src="${workshop.imagemUrl}" alt="${workshop.nome}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${workshop.nome}</div>
                <div class="admin-image-preview-url">${workshop.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('workshop', '${workshop.id}', '${workshop.nome}', '${workshop.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesPosts() {
  const posts = getActivePosts();
  const grid = document.getElementById("imagesPostsGrid");
  if (!grid) return;

  if (posts.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum post cadastrado.</p>';
    return;
  }

  grid.innerHTML = posts
    .map(
      (post) => `
        <div class="admin-image-preview-card">
            <img src="${post.imagemUrl}" alt="${post.titulo}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${post.titulo}</div>
                <div class="admin-image-preview-url">${post.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('post', '${post.id}', '${post.titulo}', '${post.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesTrend() {
  const posts = getActivePosts().filter((p) => p.categoria === "Tendências");
  const grid = document.getElementById("imagesTrendGrid");
  if (!grid) return;

  if (posts.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum post com categoria "Tendências" encontrado.</p>';
    return;
  }

  grid.innerHTML = posts
    .map(
      (post) => `
        <div class="admin-image-preview-card">
            <img src="${post.imagemUrl}" alt="${post.titulo}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${post.titulo}</div>
                <div class="admin-image-preview-url">${post.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('post', '${post.id}', '${post.titulo}', '${post.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesBride() {
  const posts = getActivePosts().filter((p) => p.categoria === "Tutorial");
  const grid = document.getElementById("imagesBrideGrid");
  if (!grid) return;

  if (posts.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum post com categoria "Tutorial" encontrado.</p>';
    return;
  }

  grid.innerHTML = posts
    .map(
      (post) => `
        <div class="admin-image-preview-card">
            <img src="${post.imagemUrl}" alt="${post.titulo}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${post.titulo}</div>
                <div class="admin-image-preview-url">${post.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('post', '${post.id}', '${post.titulo}', '${post.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesMistakes() {
  const posts = getActivePosts().filter((p) => p.categoria === "Dicas");
  const grid = document.getElementById("imagesMistakesGrid");
  if (!grid) return;

  if (posts.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum post com categoria "Dicas" encontrado.</p>';
    return;
  }

  grid.innerHTML = posts
    .map(
      (post) => `
        <div class="admin-image-preview-card">
            <img src="${post.imagemUrl}" alt="${post.titulo}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${post.titulo}</div>
                <div class="admin-image-preview-url">${post.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('post', '${post.id}', '${post.titulo}', '${post.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesBrushes() {
  const posts = getActivePosts().filter((p) => p.categoria === "Produtos");
  const grid = document.getElementById("imagesBrushesGrid");
  if (!grid) return;

  if (posts.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum post com categoria "Produtos" encontrado.</p>';
    return;
  }

  grid.innerHTML = posts
    .map(
      (post) => `
        <div class="admin-image-preview-card">
            <img src="${post.imagemUrl}" alt="${post.titulo}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${post.titulo}</div>
                <div class="admin-image-preview-url">${post.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('post', '${post.id}', '${post.titulo}', '${post.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesProducts() {
  const products = getActiveProducts();
  const grid = document.getElementById("imagesProductsGrid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum produto cadastrado.</p>';
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
        <div class="admin-image-preview-card">
            <img src="${product.imagemUrl}" alt="${product.nome}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${product.nome}</div>
                <div class="admin-image-preview-url">${product.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('product', '${product.id}', '${product.nome}', '${product.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function loadImagesEvents() {
  const events = getActiveEvents();
  const grid = document.getElementById("imagesEventsGrid");
  if (!grid) return;

  if (events.length === 0) {
    grid.innerHTML =
      '<p style="color: #666; text-align: center; padding: 20px;">Nenhum evento cadastrado.</p>';
    return;
  }

  grid.innerHTML = events
    .map(
      (event) => `
        <div class="admin-image-preview-card">
            <img src="${event.imagemUrl}" alt="${event.nome}" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
            <div class="admin-image-preview-info">
                <div class="admin-image-preview-title">${event.nome}</div>
                <div class="admin-image-preview-url">${event.imagemUrl}</div>
                <div class="admin-image-preview-actions">
                    <button class="btn btn-sm btn-primary" onclick="editImageUrl('event', '${event.id}', '${event.nome}', '${event.imagemUrl}')">Editar</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function editImageUrl(type, id, title, currentUrl) {
  const newTitle = prompt(
    `Editar NOME de "${title}":\n\nNome atual:\n${title}\n\nNovo Nome:`,
    title,
  );

  if (newTitle === null) {
    return; // Cancelado
  }

  const newUrl = prompt(
    `Editar URL da imagem de "${newTitle}":\n\nURL atual:\n${currentUrl}\n\nNova URL:`,
    currentUrl,
  );

  if (newUrl === null) {
    return; // Cancelado
  }

  const trimmedTitle = newTitle.trim();
  const trimmedUrl = newUrl.trim();

  if (!trimmedTitle) {
    showToast("O nome não pode estar vazio!", "error");
    return;
  }

  if (!trimmedUrl) {
    showToast("A URL não pode estar vazia!", "error");
    return;
  }

  // Atualizar conforme o tipo
  switch (type) {
    case "service":
      const service = getServiceById(id);
      if (service) {
        service.nome = trimmedTitle;
        service.imagemUrl = trimmedUrl;
        updateService(service);
        showToast("Serviço e Imagem atualizados!", "success");
        loadImagesServices();
      }
      break;
    case "workshop":
      const workshop = getWorkshopById(id);
      if (workshop) {
        workshop.nome = trimmedTitle;
        workshop.imagemUrl = trimmedUrl;
        updateWorkshop(workshop);
        showToast("Workshop e Imagem atualizados!", "success");
        loadImagesWorkshops();
      }
      break;
    case "post":
      const post = getPostById(id);
      if (post) {
        post.titulo = trimmedTitle;
        post.imagemUrl = trimmedUrl;
        updatePost(post);
        showToast("Post e Imagem atualizados!", "success");
        loadImagesPosts();
        loadImagesTrend();
        loadImagesBride();
        loadImagesMistakes();
        loadImagesBrushes();
      }
      break;
    case "product":
      const product = getProductById(id);
      if (product) {
        product.nome = trimmedTitle;
        product.imagemUrl = trimmedUrl;
        updateProduct(product);
        showToast("Produto e Imagem atualizados!", "success");
        loadImagesProducts();
      }
      break;
    case "event":
      const event = getEventById(id);
      if (event) {
        event.nome = trimmedTitle;
        event.imagemUrl = trimmedUrl;
        updateEvent(event);
        showToast("Evento e Imagem atualizados!", "success");
        loadImagesEvents();
      }
      break;
  }
}

// ============================================
// RELATÓRIOS - Funções de Análise e Estatísticas
// ============================================

let salesChart = null;
let revenueChart = null;

function initializeReportDates() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  const startInput = document.getElementById('reportStartDate');
  const endInput = document.getElementById('reportEndDate');

  if (startInput) startInput.value = startDate.toISOString().split('T')[0];
  if (endInput) endInput.value = endDate.toISOString().split('T')[0];
}

function loadReports() {
  loadReportsData();
}

function loadReportsData() {
  const period = document.getElementById('reportPeriod')?.value || 'month';
  const startDate = document.getElementById('reportStartDate')?.value;
  const endDate = document.getElementById('reportEndDate')?.value;

  const dateFilter = getDateRangeFilter(period, startDate, endDate);

  // Carregar dados de todas as fontes
  const orders = getOrders() || [];
  const bookings = getBookings() || [];
  const messages = getMessages() || [];
  const products = getProducts() || [];
  const services = getServices() || [];
  const workshops = getWorkshops() || [];

  // Filtrar por data
  const filteredOrders = filterByDateRange(orders, dateFilter);
  const filteredBookings = filterByDateRange(bookings, dateFilter);
  const filteredMessages = filterByDateRange(messages, dateFilter);

  // Calcular estatísticas principais
  const stats = calculateReportStats(filteredOrders, filteredBookings, filteredMessages);

  // Atualizar cards principais
  updateReportCards(stats);

  // Carregar gráficos
  loadSalesByCategoryChart(filteredOrders, filteredBookings);
  loadRevenueExpensesChart(filteredOrders, filteredBookings);

  // Carregar tabelas
  loadTopProductsTable(filteredOrders);
  loadServicesReportTable(filteredBookings, services);
  loadWorkshopsReportTable(filteredBookings, workshops);
  loadFinancialAnalysis(filteredOrders, filteredBookings);
  loadMessagesReport(filteredMessages);
}

function getDateRangeFilter(period, customStart, customEnd) {
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      startDate = new Date('2020-01-01');
      break;
  }

  if (customStart) startDate = new Date(customStart);
  const endDate = customEnd ? new Date(customEnd) : now;

  return { startDate, endDate };
}

function filterByDateRange(items, dateFilter) {
  if (!items || !Array.isArray(items)) return [];

  return items.filter(item => {
    const itemDate = new Date(item.data || item.createdAt || item.timestamp);
    return itemDate >= dateFilter.startDate && itemDate <= dateFilter.endDate;
  });
}

function calculateReportStats(orders, bookings, messages) {
  // Calcular visitas (simulado - pode ser integrado com analytics real)
  const visits = Math.floor(Math.random() * 1000) + (orders.length + bookings.length) * 10;

  // Calcular receita total
  let revenue = 0;

  orders.forEach(order => {
    const status = order.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'paid' || status === 'entregue' || status === 'concluída') {
      revenue += parseFloat(order.total || 0);
    }
  });

  bookings.forEach(booking => {
    const status = booking.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'confirmed' || status === 'concluída' || status === 'confirmada') {
      revenue += parseFloat(booking.price || booking.preco || 0);
    }
  });

  return {
    visits,
    revenue,
    ordersCount: orders.length,
    messagesCount: messages.length
  };
}

function updateReportCards(stats) {
  const visitEl = document.getElementById('reportVisits');
  const revenueEl = document.getElementById('reportRevenue');
  const ordersEl = document.getElementById('reportOrders');
  const messagesEl = document.getElementById('reportMessages');

  if (visitEl) visitEl.textContent = stats.visits.toLocaleString();
  if (revenueEl) revenueEl.textContent = `€${stats.revenue.toFixed(2)}`;
  if (ordersEl) ordersEl.textContent = stats.ordersCount;
  if (messagesEl) messagesEl.textContent = stats.messagesCount;
}

function loadSalesByCategoryChart(orders, bookings) {
  const canvas = document.getElementById('salesByCategoryChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Agrupar vendas por categoria
  const categories = {
    'Produtos': 0,
    'Serviços': 0,
    'Workshops': 0,
    'Eventos': 0
  };

  orders.forEach(order => {
    const status = order.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'paid' || status === 'entregue' || status === 'concluída') {
      categories['Produtos'] += parseFloat(order.total || 0);
    }
  });

  bookings.forEach(booking => {
    const status = booking.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'confirmed' || status === 'concluída' || status === 'confirmada') {
      const price = parseFloat(booking.price || booking.preco || 0);
      const type = (booking.type || booking.tipo || '').toLowerCase();
      if (type === 'workshop') {
        categories['Workshops'] += price;
      } else if (type === 'event' || type === 'evento') {
        categories['Eventos'] += price;
      } else {
        categories['Serviços'] += price;
      }
    }
  });

  if (salesChart) salesChart.destroy();

  salesChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(240, 147, 251, 0.8)',
          'rgba(245, 87, 108, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: €${value.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

function loadRevenueExpensesChart(orders, bookings) {
  const canvas = document.getElementById('revenueExpensesChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Calcular receitas e despesas por mês
  const monthlyData = {};

  const addToMonth = (date, revenue, expense) => {
    const key = new Date(date).toISOString().slice(0, 7);
    if (!monthlyData[key]) {
      monthlyData[key] = { revenue: 0, expenses: 0 };
    }
    monthlyData[key].revenue += revenue;
    monthlyData[key].expenses += expense;
  };

  orders.forEach(order => {
    const status = order.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'paid' || status === 'entregue' || status === 'concluída') {
      const revenue = parseFloat(order.total || 0);
      const expense = revenue * 0.3; // Estimativa de 30% de custos
      addToMonth(order.data || order.createdAt, revenue, expense);
    }
  });

  bookings.forEach(booking => {
    const status = booking.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'confirmed' || status === 'concluída' || status === 'confirmada') {
      const revenue = parseFloat(booking.price || booking.preco || 0);
      const expense = revenue * 0.25; // Estimativa de 25% de custos
      addToMonth(booking.data || booking.createdAt, revenue, expense);
    }
  });

  const labels = Object.keys(monthlyData).sort();
  const revenueData = labels.map(key => monthlyData[key].revenue);
  const expensesData = labels.map(key => monthlyData[key].expenses);

  if (revenueChart) revenueChart.destroy();

  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(formatMonthLabel),
      datasets: [
        {
          label: 'Receitas',
          data: revenueData,
          backgroundColor: 'rgba(67, 233, 123, 0.8)',
          borderColor: 'rgba(67, 233, 123, 1)',
          borderWidth: 1
        },
        {
          label: 'Despesas',
          data: expensesData,
          backgroundColor: 'rgba(245, 87, 108, 0.8)',
          borderColor: 'rgba(245, 87, 108, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '€' + value.toFixed(0);
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: €${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

function formatMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function loadTopProductsTable(orders) {
  const tbody = document.getElementById('topProductsTable');
  if (!tbody) return;

  const productSales = {};
  let totalRevenue = 0;

  orders.forEach(order => {
    const status = order.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'paid' || status === 'entregue' || status === 'concluída') {
      (order.items || []).forEach(item => {
        const key = item.productId || item.nome;
        if (!productSales[key]) {
          productSales[key] = {
            name: item.nome || 'Produto',
            quantity: 0,
            revenue: 0
          };
        }
        const qty = item.quantidade || item.quantity || 1;
        const price = parseFloat(item.preco || item.price || 0);
        productSales[key].quantity += qty;
        productSales[key].revenue += price * qty;
        totalRevenue += price * qty;
      });
    }
  });

  const sortedProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  if (sortedProducts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #999;">Nenhum produto vendido no período selecionado</td></tr>';
    return;
  }

  tbody.innerHTML = sortedProducts.map(product => `
    <tr>
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>€${product.revenue.toFixed(2)}</td>
      <td>${((product.revenue / totalRevenue) * 100).toFixed(1)}%</td>
    </tr>
  `).join('');
}

function loadServicesReportTable(bookings, services) {
  const tbody = document.getElementById('servicesReportTable');
  if (!tbody) return;

  const serviceSales = {};

  bookings.forEach(booking => {
    const status = booking.status?.toLowerCase() || '';
    const type = (booking.type || booking.tipo || '').toLowerCase();
    if ((status === 'completed' || status === 'confirmed' || status === 'concluída' || status === 'confirmada') && (type === 'service' || type === 'serviço')) {
      const key = booking.serviceId || booking.serviceName || 'Serviço';
      if (!serviceSales[key]) {
        serviceSales[key] = {
          name: booking.serviceName || booking.nomeServico || 'Serviço',
          count: 0,
          revenue: 0
        };
      }
      serviceSales[key].count++;
      serviceSales[key].revenue += parseFloat(booking.price || booking.preco || 0);
    }
  });

  const sortedServices = Object.values(serviceSales)
    .sort((a, b) => b.revenue - a.revenue);

  if (sortedServices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 2rem; color: #999;">Nenhum serviço realizado no período selecionado</td></tr>';
    return;
  }

  tbody.innerHTML = sortedServices.map(service => `
    <tr>
      <td>${service.name}</td>
      <td>${service.count}</td>
      <td>€${service.revenue.toFixed(2)}</td>
    </tr>
  `).join('');
}

function loadWorkshopsReportTable(bookings, workshops) {
  const tbody = document.getElementById('workshopsReportTable');
  if (!tbody) return;

  const workshopSales = {};

  bookings.forEach(booking => {
    const status = booking.status?.toLowerCase() || '';
    const type = (booking.type || booking.tipo || '').toLowerCase();
    if ((status === 'completed' || status === 'confirmed' || status === 'concluída' || status === 'confirmada') && type === 'workshop') {
      const key = booking.workshopId || booking.workshopName || 'Workshop';
      if (!workshopSales[key]) {
        workshopSales[key] = {
          name: booking.workshopName || booking.nomeWorkshop || 'Workshop',
          participants: 0,
          revenue: 0
        };
      }
      workshopSales[key].participants++;
      workshopSales[key].revenue += parseFloat(booking.price || booking.preco || 0);
    }
  });

  const sortedWorkshops = Object.values(workshopSales)
    .sort((a, b) => b.revenue - a.revenue);

  if (sortedWorkshops.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 2rem; color: #999;">Nenhum workshop realizado no período selecionado</td></tr>';
    return;
  }

  tbody.innerHTML = sortedWorkshops.map(workshop => `
    <tr>
      <td>${workshop.name}</td>
      <td>${workshop.participants}</td>
      <td>€${workshop.revenue.toFixed(2)}</td>
    </tr>
  `).join('');
}

function loadFinancialAnalysis(orders, bookings) {
  let totalRevenue = 0;
  let totalExpenses = 0;
  const transactions = [];

  // Processar encomendas
  orders.forEach(order => {
    const status = order.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'paid' || status === 'entregue' || status === 'concluída') {
      const revenue = parseFloat(order.total || 0);
      totalRevenue += revenue;

      transactions.push({
        date: order.data || order.createdAt,
        description: `Encomenda #${order.id?.slice(0, 8) || 'N/A'}`,
        type: 'Entrada',
        category: 'Vendas de Produtos',
        amount: revenue
      });

      // Estimar custos
      const cost = revenue * 0.3;
      totalExpenses += cost;

      transactions.push({
        date: order.data || order.createdAt,
        description: `Custos - Encomenda #${order.id?.slice(0, 8) || 'N/A'}`,
        type: 'Saída',
        category: 'Custos de Produtos',
        amount: cost
      });
    }
  });

  // Processar marcações
  bookings.forEach(booking => {
    const status = booking.status?.toLowerCase() || '';
    if (status === 'completed' || status === 'confirmed' || status === 'concluída' || status === 'confirmada') {
      const revenue = parseFloat(booking.price || booking.preco || 0);
      totalRevenue += revenue;

      const type = (booking.type || booking.tipo || '').toLowerCase();
      const category = type === 'workshop' ? 'Workshop' :
                      (type === 'event' || type === 'evento') ? 'Evento' : 'Serviço';

      transactions.push({
        date: booking.data || booking.createdAt,
        description: `${category} - ${booking.serviceName || booking.workshopName || booking.nomeServico || booking.nomeWorkshop || 'N/A'}`,
        type: 'Entrada',
        category: `Receitas de ${category}`,
        amount: revenue
      });

      // Estimar custos
      const cost = revenue * 0.25;
      totalExpenses += cost;

      transactions.push({
        date: booking.data || booking.createdAt,
        description: `Custos - ${category}`,
        type: 'Saída',
        category: `Custos de ${category}`,
        amount: cost
      });
    }
  });

  const netProfit = totalRevenue - totalExpenses;

  // Atualizar resumo financeiro
  const revenueEl = document.getElementById('totalRevenueAmount');
  const expensesEl = document.getElementById('totalExpensesAmount');
  const profitEl = document.getElementById('netProfitAmount');

  if (revenueEl) revenueEl.textContent = `€${totalRevenue.toFixed(2)}`;
  if (expensesEl) expensesEl.textContent = `€${totalExpenses.toFixed(2)}`;
  if (profitEl) {
    profitEl.textContent = `€${netProfit.toFixed(2)}`;
    profitEl.style.background = netProfit >= 0 
      ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  }

  // Carregar tabela de transações
  const tbody = document.getElementById('financialTransactionsTable');
  if (!tbody) return;

  const sortedTransactions = transactions.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ).slice(0, 50);

  if (sortedTransactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #999;">Nenhuma transação no período selecionado</td></tr>';
    return;
  }

  tbody.innerHTML = sortedTransactions.map(transaction => `
    <tr>
      <td>${new Date(transaction.date).toLocaleDateString('pt-PT')}</td>
      <td>${transaction.description}</td>
      <td><span style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; background: ${transaction.type === 'Entrada' ? '#d4edda' : '#f8d7da'}; color: ${transaction.type === 'Entrada' ? '#155724' : '#721c24'};">${transaction.type}</span></td>
      <td>${transaction.category}</td>
      <td style="font-weight: 600; color: ${transaction.type === 'Entrada' ? '#28a745' : '#dc3545'};">€${transaction.amount.toFixed(2)}</td>
    </tr>
  `).join('');
}

function loadMessagesReport(messages) {
  const totalCount = messages.length;
  const readCount = messages.filter(m => m.read || m.lida).length;
  const unreadCount = totalCount - readCount;

  const totalEl = document.getElementById('totalMessagesCount');
  const readEl = document.getElementById('readMessagesCount');
  const unreadEl = document.getElementById('unreadMessagesCount');

  if (totalEl) totalEl.textContent = totalCount;
  if (readEl) readEl.textContent = readCount;
  if (unreadEl) unreadEl.textContent = unreadCount;
}

function exportReportPDF() {
  showToast('Funcionalidade de exportação em desenvolvimento. Os dados podem ser impressos usando Ctrl+P.', 'info');
  window.print();
}

