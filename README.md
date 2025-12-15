# Yemar Makeup Artist - Site de Maquilhadora Profissional

Site completo para maquilhadora profissional, desenvolvido em HTML, CSS e JavaScript puro, com persistência via localStorage.

## Características

### Design
- **Paleta de cores**: Preto (#0b0b0d), Branco (#ffffff) e Dourado (#c9a227)
- **Tipografia**: Playfair Display para títulos + Montserrat para navegação
- **Layout editorial premium** inspirado em sites de moda/beleza
- **Design responsivo** para todos os dispositivos
- **Logo personalizada** da marca

### Funcionalidades

#### Sistema de Autenticação
- Registo de novos utilizadores
- Login com validação
- Visualização de senha (botão olho)
- Perfil do utilizador com histórico de marcações e encomendas
- Área administrativa protegida

#### Sistema de Marcações/Agendamentos
- Marcação de serviços (maquilhagem noiva, social, etc.)
- Inscrição em workshops
- Inscrição em eventos
- Gestão de marcações no painel admin

#### Loja Online
- Catálogo de produtos com filtros por categoria
- Ordenação por nome e preço
- Carrinho de compras funcional
- Processo de checkout
- Gestão de encomendas no admin

#### Blog Editorial
- Posts com categorias
- Sistema de likes
- Layout editorial estilo revista
- Gestão de posts no admin

#### Painel Administrativo
- Dashboard com estatísticas
- Gestão de marcações
- Gestão de encomendas
- CRUD de serviços, workshops, produtos, posts e eventos
- Gestão de utilizadores
- Mensagens de contacto
- Definições do site (hero banner, contactos, endereço, mapa)

### Páginas

| Página | Descrição |
|--------|-----------|
| `index.html` | Homepage com hero, serviços, workshops, produtos e blog |
| `servicos.html` | Listagem de todos os serviços |
| `servico.html` | Detalhe do serviço com botão de marcação |
| `workshops.html` | Listagem de workshops e cursos |
| `workshop.html` | Detalhe do workshop |
| `eventos.html` | Listagem de eventos |
| `evento.html` | Detalhe do evento |
| `produtos.html` | Catálogo de produtos com filtros |
| `produto.html` | Detalhe do produto |
| `blog.html` | Listagem de posts do blog |
| `post.html` | Detalhe do post |
| `conta.html` | Login, registo e perfil do utilizador |
| `contacto.html` | Formulário de contacto com Google Maps |
| `sobre.html` | Página Sobre Mim |
| `carrinho.html` | Carrinho de compras |
| `admin.html` | Painel administrativo |

## Credenciais de Teste

### Administrador
- **Email**: admin@yemarmakeup.pt
- **Senha**: admin123

### Utilizador
- **Email**: user@site.com
- **Senha**: User@123

## Contactos

- **Email**: yemarmk@gmail.com
- **Telefone**: (+351) 933758731

## Redes Sociais

- **Facebook**: https://www.facebook.com/share/1Darek4Pov/
- **Instagram**: https://www.instagram.com/yemarmakeup

## Estrutura do Projeto

```
maquiadora-site/
├── css/
│   └── styles.css          # Estilos completos do site
├── js/
│   ├── storage.js          # Camada de dados (localStorage)
│   ├── ui.js               # Componentes de interface
│   └── app.js              # Lógica principal da aplicação
├── assets/
│   └── images/
│       └── logo.png        # Logo da marca
├── index.html              # Homepage
├── servicos.html           # Página de serviços
├── servico.html            # Detalhe do serviço
├── workshops.html          # Página de workshops
├── workshop.html           # Detalhe do workshop
├── eventos.html            # Página de eventos
├── evento.html             # Detalhe do evento
├── produtos.html           # Catálogo de produtos
├── produto.html            # Detalhe do produto
├── blog.html               # Blog
├── post.html               # Detalhe do post
├── conta.html              # Login/Registo/Perfil
├── contacto.html           # Formulário de contacto com mapa
├── sobre.html              # Sobre Mim
├── carrinho.html           # Carrinho de compras
├── admin.html              # Painel administrativo
└── README.md               # Esta documentação
```

## Como Usar

1. **Abrir o site**: Basta abrir o arquivo `index.html` num navegador moderno
2. **Testar como utilizador**: Navegue pelo site, adicione produtos ao carrinho, faça marcações
3. **Testar como admin**: Faça login com as credenciais de administrador e acesse o painel
4. **Configurar endereço**: No painel admin, vá em Definições para configurar o endereço e URL do mapa

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos com variáveis CSS, Flexbox e Grid
- **JavaScript ES6+** - Lógica da aplicação
- **localStorage** - Persistência de dados
- **Google Fonts** - Tipografia (Playfair Display, Montserrat)
- **Google Maps** - Mapa de localização na página de contacto
- **Unsplash** - Imagens de demonstração

## Notas

- Este é um protótipo funcional com dados armazenados localmente no navegador
- As imagens são carregadas do Unsplash para demonstração
- Para produção, seria necessário implementar um backend real
- Os dados podem ser resetados através do painel admin (Definições > Repor Dados Iniciais)

## Autor

Desenvolvido como protótipo funcional para demonstração.

---

© 2025 YemarMakeupArtist. Todos os direitos reservados.

Protótipo funcional - FSL Solution Digital.
