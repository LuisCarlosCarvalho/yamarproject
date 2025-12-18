/**
 * STORAGE.JS - Camada de persistência localStorage
 * Gerencia todos os dados do site: usuários, produtos, serviços, eventos, workshops, posts, marcações e configurações
 */

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Gera um UUID simples
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Obtém data/hora atual em formato ISO
 */
function getCurrentDateTime() {
    return new Date().toISOString();
}

// ============================================
// OPERAÇÕES BÁSICAS DE STORAGE
// ============================================

/**
 * Obtém dados do localStorage
 */
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Salva dados no localStorage
 */
function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove dados do localStorage
 */
function removeData(key) {
    localStorage.removeItem(key);
}

// ============================================
// SEED DATA - DADOS INICIAIS
// ============================================

const SEED_USERS = [
    {
        id: generateUUID(),
        nome: 'Administrador',
        email: 'admin@yemarmakeup.pt',
        telefone: '912345678',
        senha: 'admin123',
        role: 'admin',
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Utilizador Teste',
        email: 'user@site.com',
        telefone: '923456789',
        senha: 'User@123',
        role: 'user',
        createdAt: getCurrentDateTime()
    }
];

const SEED_SERVICES = [
    {
        id: generateUUID(),
        nome: 'Maquilhagem Noiva',
        preco: 250,
        duracao: '3 horas',
        descricao: 'Serviço completo de maquilhagem para noivas, incluindo prova prévia. Realço a tua beleza natural para o dia mais especial da tua vida, garantindo uma maquilhagem duradoura e fotogénica.',
        imagemUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
        categoria: 'Noivas',
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Maquilhagem Social',
        preco: 80,
        duracao: '1.5 horas',
        descricao: 'Maquilhagem profissional para eventos sociais, festas, jantares especiais ou qualquer ocasião que mereça um look impecável.',
        imagemUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
        categoria: 'Social',
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Sessão Fotográfica + Maquilhagem',
        preco: 150,
        duracao: '2 horas',
        descricao: 'Maquilhagem artística e profissional especialmente preparada para sessões fotográficas, editoriais e portfolios.',
        imagemUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400',
        categoria: 'Editorial',
        ativo: true,
        createdAt: getCurrentDateTime()
    },



];

const SEED_WORKSHOPS = [
    {
        id: generateUUID(),
        titulo: 'Workshop Automaquilhagem',
        modalidade: 'Presencial',
        duracao: '4 horas',
        preco: 150,
        descricao: 'Aprende as técnicas essenciais para te maquilhares como uma profissional. Inclui kit de pincéis.',
        imagemUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
        vagas: 10,
        observacoes: 'Material incluído. Turmas reduzidas para maior atenção individual.',
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        titulo: 'Curso Profissional Maquilhagem',
        modalidade: 'Presencial',
        duracao: '40 horas',
        preco: 1200,
        descricao: 'Formação completa certificada para quem quer iniciar carreira como maquilhador profissional.',
        imagemUrl: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400',
        vagas: 8,
        observacoes: 'Certificado reconhecido. Inclui kit profissional completo.',
        ativo: true,
        createdAt: getCurrentDateTime()
    },


];

const SEED_EVENTS = [
    {
        id: generateUUID(),
        titulo: 'Masterclass Tendências 2025',
        data: '2025-02-15T14:00:00',
        local: 'Studio Yemar Makeup Artist - Porto',
        vagas: 20,
        descricao: 'Evento exclusivo onde apresento as principais tendências de maquilhagem para 2025. Demonstrações ao vivo e networking.',
        imagemUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
        preco: 0,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        titulo: 'Lançamento Coleção Pincéis',
        data: '2025-01-20T18:00:00',
        local: 'Hotel Intercontinental - Porto',
        vagas: 50,
        descricao: 'Evento de lançamento da nova coleção de pincéis profissionais. Coquetel e demonstrações exclusivas.',
        imagemUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
        preco: 0,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        titulo: 'Workshop Noivas - Edição Especial',
        data: '2025-03-08T10:00:00',
        local: 'Quinta da Pacheca - Douro',
        vagas: 15,
        descricao: 'Workshop intensivo sobre maquilhagem de noivas num cenário deslumbrante no Douro. Inclui almoço.',
        imagemUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        preco: 350,
        ativo: true,
        createdAt: getCurrentDateTime()
    }
];

const SEED_PRODUCTS = [
    {
        id: generateUUID(),
        nome: 'Kit Pincéis Profissional',
        preco: 189,
        categoria: 'Pincéis',
        imagemUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        descricao: 'Kit completo com 12 pincéis profissionais de alta qualidade. Cerdas sintéticas veganas.',
        estoque: 25,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Paleta Sombras Nude',
        preco: 65,
        categoria: 'Olhos',
        imagemUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
        descricao: 'Paleta com 18 tons nude e neutros. Acabamentos matte, shimmer e glitter.',
        estoque: 40,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Base Fluida HD',
        preco: 42,
        categoria: 'Rosto',
        imagemUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400',
        descricao: 'Base de alta definição com cobertura média a alta. Acabamento natural e longa duração.',
        estoque: 60,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Batom Líquido Matte',
        preco: 28,
        categoria: 'Lábios',
        imagemUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
        descricao: 'Batom líquido de longa duração com acabamento matte aveludado. Não resseca os lábios.',
        estoque: 80,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Primer Iluminador',
        preco: 35,
        categoria: 'Rosto',
        imagemUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
        descricao: 'Primer com partículas iluminadoras para uma pele radiante e preparada para maquilhagem.',
        estoque: 35,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Máscara de Pestanas Volume',
        preco: 32,
        categoria: 'Olhos',
        imagemUrl: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2a?w=400',
        descricao: 'Máscara volumizadora à prova de água. Escova curvada para efeito leque.',
        estoque: 50,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Contorno em Creme',
        preco: 38,
        categoria: 'Rosto',
        imagemUrl: 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=400',
        descricao: 'Paleta de contorno em creme com 4 tons para esculpir e iluminar o rosto.',
        estoque: 30,
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        nome: 'Spray Fixador Maquilhagem',
        preco: 25,
        categoria: 'Acessórios',
        imagemUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
        descricao: 'Spray fixador de longa duração. Mantém a maquilhagem intacta até 16 horas.',
        estoque: 45,
        ativo: true,
        createdAt: getCurrentDateTime()
    }
];

const SEED_POSTS = [
    {
        id: generateUUID(),
        titulo: 'Tendências de Maquilhagem Verão 2025',
        categoria: 'Tendências',
        imagemUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
        excerpt: 'Descobre as principais tendências de maquilhagem para o verão 2025: pele natural, olhos marcantes e lábios subtis.',
        conteudo: 'O verão 2025 traz uma abordagem fresca e natural à maquilhagem. A tendência principal é a pele "glass skin" - luminosa, hidratada e com aspeto saudável. Os olhos ganham destaque com tons terrosos e esfumados suaves, enquanto os lábios apostam em glosses e batons em tons nude rosados.\n\nAs sobrancelhas continuam naturais e bem cuidadas, com o foco em realçar a forma natural de cada pessoa. O blush volta com força, aplicado de forma estratégica para criar um efeito "sun-kissed".\n\nPara conseguir este look, investe em produtos de qualidade que hidratem enquanto maquilham. Uma boa base com acabamento luminoso é essencial, assim como um iluminador subtil para os pontos altos do rosto.',
        autor: 'Yemar Makeup Artist',
        dataPublicacao: '2025-01-10',
        likes: 24,
        comentarios: [],
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        titulo: 'Guia Completo: Maquilhagem para Noivas',
        categoria: 'Noivas',
        imagemUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        excerpt: 'Tudo o que precisas saber sobre maquilhagem de noiva: desde a prova até ao grande dia.',
        conteudo: 'A maquilhagem de noiva é uma das mais importantes da vida de uma mulher. É essencial que te sintas bonita, confiante e, acima de tudo, tu mesma.\n\nA prova de maquilhagem deve ser agendada com 2-3 meses de antecedência. Leva fotografias de inspiração, mas está aberta a sugestões do profissional que conhece as técnicas que melhor funcionam para fotografia e vídeo.\n\nNo dia do casamento, a pele deve estar bem preparada. Começa a tua rotina de skincare intensiva pelo menos um mês antes. Evita tratamentos agressivos na semana anterior.\n\nA maquilhagem deve ser duradoura mas confortável. Produtos à prova de água são essenciais, especialmente para os olhos. O look deve ser atemporal - evita tendências muito marcadas que possam parecer datadas nas fotografias.',
        autor: 'Yemar Makeup Artist',
        dataPublicacao: '2025-01-05',
        likes: 45,
        comentarios: [],
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        titulo: 'Os Erros Mais Comuns na Maquilhagem',
        categoria: 'Dicas',
        imagemUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
        excerpt: 'Evita estes erros comuns e eleva a tua maquilhagem ao próximo nível.',
        conteudo: 'Mesmo as mais experientes cometem erros de maquilhagem. Aqui estão os mais comuns e como evitá-los:\n\n1. Base errada: Escolher o tom errado ou aplicar demasiado produto. Testa sempre na mandíbula e aplica em camadas finas.\n\n2. Não preparar a pele: A maquilhagem precisa de uma tela bem preparada. Limpa, hidrata e usa primer.\n\n3. Sobrancelhas demasiado marcadas: O look natural está em alta. Preenche apenas as falhas.\n\n4. Blush mal aplicado: Sorri e aplica nas maçãs do rosto, esfumando para cima.\n\n5. Não esfumar: A chave para uma maquilhagem profissional é o esfumado. Investe em bons pincéis.\n\n6. Esquecer o pescoço: Esfuma sempre a base até ao pescoço para evitar o efeito máscara.',
        autor: 'Yemar Makeup Artist',
        dataPublicacao: '2024-12-28',
        likes: 32,
        comentarios: [],
        ativo: true,
        createdAt: getCurrentDateTime()
    },
    {
        id: generateUUID(),
        titulo: 'Pincéis Essenciais para Iniciantes',
        categoria: 'Produtos',
        imagemUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        excerpt: 'Descobre quais os pincéis indispensáveis para começar a tua coleção de maquilhagem.',
        conteudo: 'Não precisas de dezenas de pincéis para conseguir uma maquilhagem bonita. Aqui estão os essenciais:\n\n1. Pincel de base: Plano ou duo-fiber para uma aplicação uniforme.\n\n2. Pincel de pó: Grande e fofo para selar a maquilhagem.\n\n3. Pincel de blush: Angulado ou arredondado para aplicação precisa.\n\n4. Pincel de sombras: Um plano para aplicar e um fofo para esfumar.\n\n5. Pincel de sobrancelhas: Angulado para preencher e spoolie para pentear.\n\n6. Pincel de lábios: Para aplicação precisa de batom.\n\nInveste em qualidade desde o início. Pincéis bons, bem cuidados, duram anos e fazem toda a diferença no resultado final.',
        autor: 'Yemar Makeup Artist',
        dataPublicacao: '2024-12-20',
        likes: 18,
        comentarios: [],
        ativo: true,
        createdAt: getCurrentDateTime()
    }
];

const SEED_SITE_SETTINGS = {
    logoUrl: '',
    logoText: 'YEMAR MAKEUP ARTIST',
    tagline: 'Yemar Makeup Artist',
    bannerTitulo: 'Realça a Tua Beleza Natural',
    bannerSubtitulo: 'Maquilhagem profissional para todos os momentos especiais da tua vida',
    bannerImagemUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    bannerCta: 'Marcar Agora',
    welcomeAvatarUrl: 'assets/images/logo_name.png',
    aboutImageUrl: 'assets/images/capa.png',
    footerAvatarUrl: 'assets/images/capa.png',
    emailContacto: 'yemarmk@gmail.com',
    telefone: '(+351) 933758731',
    whatsapp: '351933758731',
    whatsappNotificationTemplate: `🔔 *Nova Marcação Recebida!*

*Cliente:* {clienteNome}
*Email:* {clienteEmail}
*Telefone:* {clienteTelefone}

*{tipoServico}:* {nomeServico}
*Data:* {data}
*Hora:* {hora}

*Status:* Pendente

Por favor, confirme esta marcação no painel administrativo.

_Yemar Makeup Artist_`,
    endereco: 'Rua das Flores, 123 - Porto',
    shopEnabled: true,
    redesSociais: {
        facebook: 'https://facebook.com/yemarmakeup',
        instagram: 'https://instagram.com/yemarmakeup',
        twitter: 'https://twitter.com/yemarmakeup',
        youtube: 'https://youtube.com/yemarmakeup'
    },
    certificates: [
        {
            id: generateUUID(),
            imageUrl: 'images/certificates/cert1.jpg',
            title: 'QC Makeup Academy - Master International Makeup Professional',
            description: 'Certificação internacional em maquilhagem profissional',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'images/certificates/cert2.jpg',
            title: 'Certificate of Completion - Master Makeup Artist Program',
            description: 'Programa avançado de formação em maquilhagem artística',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'images/certificates/cert3.jpg',
            title: 'Makeup Artist Certificate',
            description: 'Certificado profissional de maquilhagem',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'images/certificates/cert4.webp',
            title: 'Certificado Profissional de Maquilhagem - La Femme',
            description: 'Curso online de maquilhagem profissional',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'images/certificates/cert5.jpg',
            title: 'Beauty Academy - Certificate of Completion',
            description: 'Certificado de conclusão em técnicas avançadas de beleza',
            createdAt: getCurrentDateTime()
        }
    ],
    portfolioImages: [
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
            title: 'Maquilhagem de Noiva',
            description: 'Look natural e elegante para o dia especial',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
            title: 'Maquilhagem Social',
            description: 'Maquilhagem sofisticada para eventos',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
            title: 'Editorial Fashion',
            description: 'Sessão fotográfica editorial',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
            title: 'Maquilhagem Artística',
            description: 'Criação artística para ensaio',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800',
            title: 'Madrinhas',
            description: 'Maquilhagem harmoniosa para madrinhas',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
            title: 'Maquilhagem Natural',
            description: 'Beleza natural realçada',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
            title: 'Olhos Marcantes',
            description: 'Esfumado clássico em tons terrosos',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800',
            title: 'Glam Night',
            description: 'Maquilhagem glamourosa para noite',
            createdAt: getCurrentDateTime()
        },
        {
            id: generateUUID(),
            imageUrl: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=800',
            title: 'Pele Radiante',
            description: 'Foco em pele iluminada e saudável',
            createdAt: getCurrentDateTime()
        }
    ],
    formacaoAcademica: [
        'Curso Profissional de Maquilhagem - Escola de Moda de Lisboa',
        'Especialização em Maquilhagem de Noivas - Academia Internacional',
        'Curso de Maquilhagem Editorial - Paris Fashion Academy',
        'Workshop de Efeitos Especiais - London Makeup School'
    ],
    certificacoesTextuais: [
        'Maquilhadora Profissional Certificada',
        'Especialista em Airbrush Makeup',
        'Certificação em Colorimetria',
        'Formadora Certificada pelo IEFP'
    ]
};

// ============================================
// INICIALIZAÇÃO DO SEED
// ============================================

/**
 * Inicializa os dados seed se não existirem
 */
function initializeSeed() {
    // Sempre atualiza os usuários com os dados do seed para garantir credenciais corretas
    const existingUsers = getData('users');
    if (!existingUsers || existingUsers.length === 0) {
        setData('users', SEED_USERS);
    } else {
        // Verifica se o admin existe com as credenciais corretas
        const adminExists = existingUsers.find(u => u.email === 'admin@yemarmakeup.pt' && u.senha === 'admin123');
        if (!adminExists) {
            // Atualiza ou adiciona o admin
            const adminIndex = existingUsers.findIndex(u => u.role === 'admin');
            if (adminIndex >= 0) {
                existingUsers[adminIndex].email = 'admin@yemarmakeup.pt';
                existingUsers[adminIndex].senha = 'admin123';
            } else {
                existingUsers.push(SEED_USERS[0]);
            }
            setData('users', existingUsers);
        }
    }
    if (!getData('services')) {
        setData('services', SEED_SERVICES);
    }
    if (!getData('workshops')) {
        setData('workshops', SEED_WORKSHOPS);
    }
    if (!getData('events')) {
        setData('events', SEED_EVENTS);
    }
    if (!getData('products')) {
        setData('products', SEED_PRODUCTS);
    }
    if (!getData('posts')) {
        setData('posts', SEED_POSTS);
    }
    if (!getData('bookings')) {
        setData('bookings', []);
    }
    if (!getData('siteSettings')) {
        setData('siteSettings', SEED_SITE_SETTINGS);
    } else {
        // Atualizar portfólio e certificados se estiverem vazios
        const currentSettings = getData('siteSettings');
        if (!currentSettings.portfolioImages || currentSettings.portfolioImages.length === 0) {
            currentSettings.portfolioImages = SEED_SITE_SETTINGS.portfolioImages;
            setData('siteSettings', currentSettings);
        }
        if (!currentSettings.certificates || currentSettings.certificates.length === 0) {
            currentSettings.certificates = SEED_SITE_SETTINGS.certificates || [];
            setData('siteSettings', currentSettings);
        }
        if (!currentSettings.whatsapp) {
            currentSettings.whatsapp = SEED_SITE_SETTINGS.whatsapp;
            setData('siteSettings', currentSettings);
        }
        if (currentSettings.shopEnabled === undefined) {
            currentSettings.shopEnabled = SEED_SITE_SETTINGS.shopEnabled;
            setData('siteSettings', currentSettings);
        }
        if (!currentSettings.formacaoAcademica) {
            currentSettings.formacaoAcademica = SEED_SITE_SETTINGS.formacaoAcademica || [];
            setData('siteSettings', currentSettings);
        }
        if (!currentSettings.certificacoesTextuais) {
            currentSettings.certificacoesTextuais = SEED_SITE_SETTINGS.certificacoesTextuais || [];
            setData('siteSettings', currentSettings);
        }
    }
    if (!getData('cart')) {
        setData('cart', []);
    }
}

// ============================================
// OPERAÇÕES DE USUÁRIOS
// ============================================

function getUsers() {
    return getData('users') || [];
}

function getUserById(id) {
    console.log('getUserById chamada com id:', id);
    const users = getUsers();
    console.log('Todos os usuários:', users);
    const user = users.find(u => u.id === id);
    console.log('Usuário encontrado:', user);
    return user;
}

function getUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function createUser(userData) {
    const users = getUsers();
    const newUser = {
        id: generateUUID(),
        ...userData,
        role: 'user',
        createdAt: getCurrentDateTime()
    };
    users.push(newUser);
    setData('users', users);
    return newUser;
}

function validateLogin(email, senha) {
    const user = getUserByEmail(email);
    if (user && user.senha === senha) {
        return user;
    }
    return null;
}

// ============================================
// OPERAÇÕES DE SESSÃO
// ============================================

function getCurrentSession() {
    return getData('currentSession');
}

function setCurrentSession(user) {
    setData('currentSession', {
        userId: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role
    });
}

function clearSession() {
    removeData('currentSession');
}

function isLoggedIn() {
    return getCurrentSession() !== null;
}

function isAdmin() {
    const session = getCurrentSession();
    return session && session.role === 'admin';
}

// ============================================
// OPERAÇÕES DE SERVIÇOS
// ============================================

function getServices() {
    return getData('services') || [];
}

function getActiveServices() {
    return getServices().filter(s => s.ativo);
}

function getServiceById(id) {
    const services = getServices();
    return services.find(s => s.id === id);
}

function createService(serviceData) {
    const services = getServices();
    const newService = {
        id: generateUUID(),
        ...serviceData,
        ativo: true,
        createdAt: getCurrentDateTime()
    };
    services.push(newService);
    setData('services', services);
    return newService;
}

function updateService(id, serviceData) {
    const services = getServices();
    const index = services.findIndex(s => s.id === id);
    if (index !== -1) {
        services[index] = { ...services[index], ...serviceData, updatedAt: getCurrentDateTime() };
        setData('services', services);
        return services[index];
    }
    return null;
}

function deleteService(id) {
    const services = getServices();
    const filtered = services.filter(s => s.id !== id);
    setData('services', filtered);
}

// ============================================
// OPERAÇÕES DE WORKSHOPS
// ============================================

function getWorkshops() {
    return getData('workshops') || [];
}

function getActiveWorkshops() {
    return getWorkshops().filter(w => w.ativo);
}

function getWorkshopById(id) {
    const workshops = getWorkshops();
    return workshops.find(w => w.id === id);
}

function createWorkshop(workshopData) {
    const workshops = getWorkshops();
    const newWorkshop = {
        id: generateUUID(),
        ...workshopData,
        ativo: true,
        createdAt: getCurrentDateTime()
    };
    workshops.push(newWorkshop);
    setData('workshops', workshops);
    return newWorkshop;
}

function updateWorkshop(id, workshopData) {
    const workshops = getWorkshops();
    const index = workshops.findIndex(w => w.id === id);
    if (index !== -1) {
        workshops[index] = { ...workshops[index], ...workshopData, updatedAt: getCurrentDateTime() };
        setData('workshops', workshops);
        return workshops[index];
    }
    return null;
}

function deleteWorkshop(id) {
    const workshops = getWorkshops();
    const filtered = workshops.filter(w => w.id !== id);
    setData('workshops', filtered);
}

// ============================================
// OPERAÇÕES DE EVENTOS
// ============================================

function getEvents() {
    return getData('events') || [];
}

function getActiveEvents() {
    return getEvents().filter(e => e.ativo);
}

function getUpcomingEvents() {
    // Retorna todos os eventos ativos (para demonstração)
    return getActiveEvents();
}

function getEventById(id) {
    const events = getEvents();
    return events.find(e => e.id === id);
}

function createEvent(eventData) {
    const events = getEvents();
    const newEvent = {
        id: generateUUID(),
        ...eventData,
        ativo: true,
        createdAt: getCurrentDateTime()
    };
    events.push(newEvent);
    setData('events', events);
    return newEvent;
}

function updateEvent(id, eventData) {
    const events = getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
        events[index] = { ...events[index], ...eventData, updatedAt: getCurrentDateTime() };
        setData('events', events);
        return events[index];
    }
    return null;
}

function deleteEvent(id) {
    const events = getEvents();
    const filtered = events.filter(e => e.id !== id);
    setData('events', filtered);
}

// ============================================
// OPERAÇÕES DE PRODUTOS
// ============================================

function getProducts() {
    return getData('products') || [];
}

function getActiveProducts() {
    return getProducts().filter(p => p.ativo);
}

function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id);
}

function getProductsByCategory(categoria) {
    return getActiveProducts().filter(p => p.categoria === categoria);
}

function getProductCategories() {
    const products = getActiveProducts();
    return [...new Set(products.map(p => p.categoria))];
}

function createProduct(productData) {
    const products = getProducts();
    const newProduct = {
        id: generateUUID(),
        ...productData,
        ativo: true,
        createdAt: getCurrentDateTime()
    };
    products.push(newProduct);
    setData('products', products);
    return newProduct;
}

function updateProduct(id, productData) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...productData, updatedAt: getCurrentDateTime() };
        setData('products', products);
        return products[index];
    }
    return null;
}

function deleteProduct(id) {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    setData('products', filtered);
}

// ============================================
// OPERAÇÕES DE POSTS
// ============================================

function getPosts() {
    return getData('posts') || [];
}

function getActivePosts() {
    return getPosts().filter(p => p.ativo);
}

function getPostById(id) {
    const posts = getPosts();
    return posts.find(p => p.id === id);
}

function createPost(postData) {
    const posts = getPosts();
    const newPost = {
        id: generateUUID(),
        ...postData,
        likes: 0,
        comentarios: [],
        ativo: true,
        createdAt: getCurrentDateTime()
    };
    posts.push(newPost);
    setData('posts', posts);
    return newPost;
}

function updatePost(id, postData) {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index] = { ...posts[index], ...postData, updatedAt: getCurrentDateTime() };
        setData('posts', posts);
        return posts[index];
    }
    return null;
}

function deletePost(id) {
    const posts = getPosts();
    const filtered = posts.filter(p => p.id !== id);
    setData('posts', filtered);
}

function likePost(id) {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index].likes = (posts[index].likes || 0) + 1;
        setData('posts', posts);
        return posts[index];
    }
    return null;
}

function addComment(postId, comentario) {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
        if (!posts[index].comentarios) {
            posts[index].comentarios = [];
        }
        posts[index].comentarios.push({
            id: generateUUID(),
            ...comentario,
            createdAt: getCurrentDateTime()
        });
        setData('posts', posts);
        return posts[index];
    }
    return null;
}

// ============================================
// OPERAÇÕES DE MARCAÇÕES (BOOKINGS)
// ============================================

function getBookings() {
    return getData('bookings') || [];
}

function getBookingById(id) {
    const bookings = getBookings();
    return bookings.find(b => b.id === id);
}

function getBookingsByUser(userId) {
    return getBookings().filter(b => b.userId === userId);
}

function getBookingsByStatus(status) {
    return getBookings().filter(b => b.status === status);
}

function getPendingBookings() {
    return getBookingsByStatus('Pendente');
}

function createBooking(bookingData) {
    const bookings = getBookings();
    const newBooking = {
        id: generateUUID(),
        ...bookingData,
        status: 'Pendente',
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime()
    };
    bookings.push(newBooking);
    setData('bookings', bookings);
    
    // Enviar notificação ao admin via WhatsApp
    sendWhatsAppToAdmin(newBooking);
    
    return newBooking;
}

function updateBookingStatus(id, status) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = status;
        bookings[index].updatedAt = getCurrentDateTime();
        setData('bookings', bookings);
        return bookings[index];
    }
    return null;
}

function cancelBooking(id) {
    return updateBookingStatus(id, 'Cancelada');
}

function confirmBooking(id) {
    const booking = updateBookingStatus(id, 'Confirmada');
    if (booking) {
        sendWhatsAppConfirmation(booking);
    }
    return booking;
}

function sendWhatsAppConfirmation(booking) {
    const settings = getSiteSettings();
    const whatsappNumber = settings.whatsapp || '351933758731';
    const user = getUserById(booking.userId);
    
    if (!user || !user.telefone) {
        console.warn('Não foi possível enviar WhatsApp: utilizador sem telefone');
        return;
    }
    
    // Get service/workshop/event name
    let serviceName = '';
    if (booking.tipo === 'servico') {
        const service = getServiceById(booking.servicoId);
        serviceName = service ? service.nome : 'Serviço';
    } else if (booking.tipo === 'workshop') {
        const workshop = getWorkshopById(booking.workshopId);
        serviceName = workshop ? workshop.titulo : 'Workshop';
    } else if (booking.tipo === 'evento') {
        const event = getEventById(booking.eventoId);
        serviceName = event ? event.titulo : 'Evento';
    }
    
    const message = `Olá ${user.nome}!\n\nA sua marcação foi confirmada:\n\n✅ ${serviceName}\n📅 ${booking.data} às ${booking.hora}\n\nObrigada por escolher Yemar Makeup Artist!\n\nQualquer dúvida, entre em contacto.`;
    
    const encodedMessage = encodeURIComponent(message);
    const userPhone = user.telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${userPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp in new window
    if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
    }
}

function completeBooking(id) {
    return updateBookingStatus(id, 'Concluída');
}

// ============================================
// OPERAÇÕES DE CARRINHO
// ============================================

function getCart() {
    return getData('cart') || [];
}

function addToCart(productId, quantidade = 1) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantidade += quantidade;
    } else {
        cart.push({ productId, quantidade });
    }
    
    setData('cart', cart);
    return cart;
}

function removeFromCart(productId) {
    const cart = getCart();
    const filtered = cart.filter(item => item.productId !== productId);
    setData('cart', filtered);
    return filtered;
}

function updateCartQuantity(productId, quantidade) {
    const cart = getCart();
    const index = cart.findIndex(item => item.productId === productId);
    
    if (index !== -1) {
        if (quantidade <= 0) {
            return removeFromCart(productId);
        }
        cart[index].quantidade = quantidade;
        setData('cart', cart);
    }
    
    return cart;
}

function clearCart() {
    setData('cart', []);
    return [];
}

function getCartTotal() {
    const cart = getCart();
    let total = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            total += product.preco * item.quantidade;
        }
    });
    
    return total;
}

function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantidade, 0);
}

// ============================================
// OPERAÇÕES DE CONFIGURAÇÕES DO SITE
// ============================================

function getSiteSettings() {
    return getData('siteSettings') || SEED_SITE_SETTINGS;
}

function updateSiteSettings(settings) {
    const current = getSiteSettings();
    const updated = { ...current, ...settings };
    setData('siteSettings', updated);
    return updated;
}

// ============================================
// ESTATÍSTICAS PARA DASHBOARD
// ============================================

function getDashboardStats() {
    const bookings = getBookings();
    const users = getUsers();
    const products = getProducts();
    const services = getServices();
    const events = getEvents();
    const workshops = getWorkshops();
    
    return {
        pendentes: bookings.filter(b => b.status === 'Pendente').length,
        confirmadas: bookings.filter(b => b.status === 'Confirmada').length,
        concluidas: bookings.filter(b => b.status === 'Concluída').length,
        canceladas: bookings.filter(b => b.status === 'Cancelada').length,
        totalBookings: bookings.length,
        totalUsers: users.filter(u => u.role === 'user').length,
        totalProducts: products.filter(p => p.ativo).length,
        totalServices: services.filter(s => s.ativo).length,
        totalEvents: events.filter(e => e.ativo).length,
        totalWorkshops: workshops.filter(w => w.ativo).length,
        upcomingEvents: getUpcomingEvents().length
    };
}

// ============================================
// PESQUISA
// ============================================

function searchAll(query) {
    const q = query.toLowerCase();
    const results = {
        services: [],
        workshops: [],
        products: [],
        posts: [],
        events: []
    };
    
    // Pesquisar serviços
    results.services = getActiveServices().filter(s => 
        s.nome.toLowerCase().includes(q) || 
        s.descricao.toLowerCase().includes(q)
    );
    
    // Pesquisar workshops
    results.workshops = getActiveWorkshops().filter(w => 
        w.titulo.toLowerCase().includes(q) || 
        w.descricao.toLowerCase().includes(q)
    );
    
    // Pesquisar produtos
    results.products = getActiveProducts().filter(p => 
        p.nome.toLowerCase().includes(q) || 
        p.descricao.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
    
    // Pesquisar posts
    results.posts = getActivePosts().filter(p => 
        p.titulo.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.conteudo.toLowerCase().includes(q)
    );
    
    // Pesquisar eventos
    results.events = getActiveEvents().filter(e => 
        e.titulo.toLowerCase().includes(q) || 
        e.descricao.toLowerCase().includes(q)
    );
    
    return results;
}

// Inicializar seed ao carregar
initializeSeed();


// ============================================
// FUNÇÕES ADICIONAIS DE UTILIZADORES
// ============================================

function getUserBookings(userId) {
    return getBookings().filter(b => b.userId === userId);
}

function getUserOrders(userId) {
    return getOrders().filter(o => o.userId === userId);
}

function updateUser(id, userData) {
    console.log('updateUser chamada:', { id, userData });
    const users = getUsers();
    console.log('Usuários antes:', users);
    const index = users.findIndex(u => u.id === id);
    console.log('Index encontrado:', index);
    if (index !== -1) {
        users[index] = { ...users[index], ...userData, updatedAt: getCurrentDateTime() };
        console.log('Usuário atualizado:', users[index]);
        setData('users', users);
        console.log('Dados salvos no localStorage');
        return users[index];
    }
    console.log('Usuário não encontrado');
    return null;
}

// ============================================
// OPERAÇÕES DE ENCOMENDAS
// ============================================

function getOrders() {
    return getData('orders') || [];
}

function getOrderById(id) {
    const orders = getOrders();
    return orders.find(o => o.id === id);
}

function createOrder(orderData) {
    const orders = getOrders();
    const newOrder = {
        id: generateUUID(),
        ...orderData,
        estado: 'pending',
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime()
    };
    orders.push(newOrder);
    setData('orders', orders);
    return newOrder;
}

function updateOrderStatus(id, estado) {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        orders[index].estado = estado;
        orders[index].updatedAt = getCurrentDateTime();
        setData('orders', orders);
        return orders[index];
    }
    return null;
}

// ============================================
// OPERAÇÕES DE MENSAGENS
// ============================================

function getMessages() {
    return getData('messages') || [];
}

function createMessage(messageData) {
    const messages = getMessages();
    const newMessage = {
        id: generateUUID(),
        ...messageData,
        lida: false,
        createdAt: getCurrentDateTime()
    };
    messages.push(newMessage);
    setData('messages', messages);
    return newMessage;
}

function markMessageAsRead(id) {
    const messages = getMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
        messages[index].lida = true;
        setData('messages', messages);
        return messages[index];
    }
    return null;
}


// ============================================
// OPERAÇÕES DE ANALYTICS E VISITAS
// ============================================

function trackPageVisit(pageName) {
    const visits = getData('pageVisits') || [];
    const visit = {
        id: generateUUID(),
        page: pageName,
        timestamp: getCurrentDateTime(),
        date: new Date().toISOString().split('T')[0],
        userAgent: navigator.userAgent
    };
    visits.push(visit);
    setData('pageVisits', visits);
    return visit;
}

function getPageVisits() {
    return getData('pageVisits') || [];
}

function getVisitStats() {
    const visits = getPageVisits();
    const today = new Date().toISOString().split('T')[0];
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
        total: visits.length,
        today: visits.filter(v => v.date === today).length,
        last7Days: visits.filter(v => v.date >= last7Days).length,
        last30Days: visits.filter(v => v.date >= last30Days).length,
        byPage: visits.reduce((acc, v) => {
            acc[v.page] = (acc[v.page] || 0) + 1;
            return acc;
        }, {}),
        byDate: visits.reduce((acc, v) => {
            acc[v.date] = (acc[v.date] || 0) + 1;
            return acc;
        }, {})
    };
}

// ============================================
// OPERAÇÕES DE CERTIFICADOS
// ============================================

function getCertificates() {
    const settings = getSiteSettings();
    return settings.certificates || [];
}

function addCertificate(certificateData) {
    const settings = getSiteSettings();
    const certificates = settings.certificates || [];
    const newCertificate = {
        id: generateUUID(),
        ...certificateData,
        createdAt: getCurrentDateTime()
    };
    certificates.push(newCertificate);
    settings.certificates = certificates;
    setData('siteSettings', settings);
    return newCertificate;
}

function removeCertificate(id) {
    const settings = getSiteSettings();
    const certificates = settings.certificates || [];
    settings.certificates = certificates.filter(c => c.id !== id);
    setData('siteSettings', settings);
    return settings.certificates;
}

// ============================================
// OPERAÇÕES DE PORTFÓLIO
// ============================================

function getPortfolioImages() {
    const settings = getSiteSettings();
    return settings.portfolioImages || [];
}

function addPortfolioImage(imageData) {
    const settings = getSiteSettings();
    const images = settings.portfolioImages || [];
    const newImage = {
        id: generateUUID(),
        ...imageData,
        createdAt: getCurrentDateTime()
    };
    images.push(newImage);
    settings.portfolioImages = images;
    setData('siteSettings', settings);
    return newImage;
}

function removePortfolioImage(id) {
    const settings = getSiteSettings();
    const images = settings.portfolioImages || [];
    settings.portfolioImages = images.filter(i => i.id !== id);
    setData('siteSettings', settings);
    return settings.portfolioImages;
}

function updatePortfolioImage(id, imageData) {
    const settings = getSiteSettings();
    const images = settings.portfolioImages || [];
    const index = images.findIndex(i => i.id === id);
    if (index !== -1) {
        images[index] = { ...images[index], ...imageData, updatedAt: getCurrentDateTime() };
        settings.portfolioImages = images;
        setData('siteSettings', settings);
        return images[index];
    }
    return null;
}


/**
 * Envia notificação ao admin via WhatsApp quando cliente faz marcação
 */
function sendWhatsAppToAdmin(booking) {
    const settings = getSiteSettings();
    const adminWhatsApp = settings.whatsapp || '351933758731';
    
    // Obter informações do serviço/workshop/evento
    let serviceName = 'Serviço';
    let serviceType = '';
    
    if (booking.serviceId) {
        const service = getServiceById(booking.serviceId);
        serviceName = service ? service.nome : 'Serviço';
        serviceType = 'Serviço';
    } else if (booking.workshopId) {
        const workshop = getWorkshopById(booking.workshopId);
        serviceName = workshop ? workshop.nome : 'Workshop';
        serviceType = 'Workshop';
    } else if (booking.eventId) {
        const event = getEventById(booking.eventId);
        serviceName = event ? event.nome : 'Evento';
        serviceType = 'Evento';
    }
    
    // Formatar data e hora
    const dataFormatada = booking.data || 'Data não definida';
    const horaFormatada = booking.hora || 'Hora não definida';
    
    // Obter template personalizado ou usar padrão
    let template = settings.whatsappNotificationTemplate || getDefaultWhatsAppTemplate();
    
    // Substituir variáveis no template
    const message = template
        .replace(/{clienteNome}/g, booking.userName || 'Cliente')
        .replace(/{clienteEmail}/g, booking.userEmail || 'Não informado')
        .replace(/{clienteTelefone}/g, booking.userPhone || 'Não informado')
        .replace(/{tipoServico}/g, serviceType)
        .replace(/{nomeServico}/g, serviceName)
        .replace(/{data}/g, dataFormatada)
        .replace(/{hora}/g, horaFormatada);
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
