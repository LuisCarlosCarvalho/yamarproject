# Changelog - Yemar Makeup Artist

## [Atualização] - 18 de Dezembro de 2025

### ✨ Novas Funcionalidades

#### 1. Sistema de Ativação/Desativação da Loja
- Adicionado botão no painel administrativo para ativar ou desativar a loja online
- Quando desativada, produtos e links da loja não aparecem no site
- Configuração salva em `siteSettings.shopEnabled`

#### 2. Portfólio
- Nova página `portfolio.html` criada
- Sistema completo de gestão de imagens do portfólio no painel admin
- Administrador pode adicionar/remover imagens com título e descrição
- Layout em grid responsivo com efeitos hover
- Link adicionado no menu de navegação principal

#### 3. Envio Automático de WhatsApp
- Ao confirmar uma marcação, o sistema abre automaticamente o WhatsApp
- Mensagem pré-formatada com detalhes da marcação é enviada ao cliente
- Funciona para serviços, workshops e eventos
- Número de WhatsApp configurável nas definições do site

#### 4. Relatórios de Visitas e Analytics
- Sistema de rastreamento de visitas por página
- Dashboard com estatísticas:
  - Total de visitas
  - Visitas hoje
  - Visitas nos últimos 7 dias
  - Visitas nos últimos 30 dias
- Gráfico de visitas por página
- Seção para integração com Google My Business

#### 5. Carrossel de Certificados
- Carrossel de certificados no rodapé da homepage
- Administrador pode adicionar/remover certificados com título e ano
- Navegação por setas (quando há mais de 3 certificados)
- Design elegante e responsivo

#### 6. Nome do Site Editável
- Campo no painel admin para alterar o nome/tagline do site
- Atualização dinâmica em todas as páginas
- Valor padrão: "Yemar Makeup Artist"

### 🔧 Correções e Melhorias

#### Remoção de Serviços
- ❌ Consultoria de Imagem
- ❌ Maquilhagem Madrinhas
- ❌ Masterclass para Marcas

#### Remoção de Workshops
- ❌ Reciclagem Profissional
- ❌ Workshop Online - Olhos Marcantes

#### Atualizações de Texto
- Substituído "I AM BAFÓNICA" por "Yemar Makeup Artist" em todo o site
- Tagline padrão atualizado nas configurações

### 📁 Novos Arquivos
- `portfolio.html` - Página de portfólio
- `CHANGELOG.md` - Este arquivo de changelog

### 🗄️ Alterações no Storage (localStorage)

#### Novas Propriedades em `siteSettings`:
```javascript
{
  tagline: 'Yemar Makeup Artist',
  whatsapp: '351933758731',
  shopEnabled: true,
  certificates: [],
  portfolioImages: []
}
```

#### Novas Coleções:
- `pageVisits` - Rastreamento de visitas

### 🎨 Novos Estilos CSS
- `.portfolio-gallery` - Grid de portfólio
- `.portfolio-item` - Item individual do portfólio
- `.certificates-section` - Seção de certificados
- `.certificates-carousel` - Carrossel de certificados
- `.admin-image-grid` - Grid de gerenciamento de imagens no admin

### 🔄 Novas Funções JavaScript

#### Storage (storage.js):
- `trackPageVisit(pageName)` - Registra visita a uma página
- `getPageVisits()` - Obtém todas as visitas
- `getVisitStats()` - Obtém estatísticas de visitas
- `getCertificates()` - Obtém certificados
- `addCertificate(data)` - Adiciona certificado
- `removeCertificate(id)` - Remove certificado
- `getPortfolioImages()` - Obtém imagens do portfólio
- `addPortfolioImage(data)` - Adiciona imagem ao portfólio
- `removePortfolioImage(id)` - Remove imagem do portfólio
- `updatePortfolioImage(id, data)` - Atualiza imagem do portfólio
- `sendWhatsAppConfirmation(booking)` - Envia confirmação via WhatsApp

#### App (app.js):
- `addPortfolioImageAdmin()` - Adiciona imagem no admin
- `loadPortfolioImagesAdmin()` - Carrega imagens no admin
- `removePortfolioImageAdmin(id)` - Remove imagem no admin
- `addCertificateAdmin()` - Adiciona certificado no admin
- `loadCertificatesAdmin()` - Carrega certificados no admin
- `removeCertificateAdmin(id)` - Remove certificado no admin
- `loadAnalyticsStats()` - Carrega estatísticas de analytics
- `loadPageVisitsChart(byPage)` - Carrega gráfico de visitas
- `initAdminSettingsForms()` - Inicializa formulários de configurações
- `loadCertificatesCarousel()` - Carrega carrossel de certificados
- `moveCertificatesCarousel(direction)` - Move carrossel
- `updateCertificatesCarousel()` - Atualiza estado do carrossel

### 📱 Compatibilidade
- Todas as funcionalidades são responsivas
- Funciona em navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dados salvos em localStorage (sem necessidade de backend)

### 🔐 Segurança
- Acesso ao painel admin continua protegido por autenticação
- Validações de formulários implementadas

### 📝 Notas Técnicas
- O sistema de WhatsApp abre uma nova janela com a mensagem pré-formatada
- O rastreamento de visitas é feito no lado do cliente (localStorage)
- Para produção, recomenda-se integrar com Google Analytics para métricas mais robustas
- Os certificados são exibidos apenas se houver pelo menos um cadastrado

---

**Desenvolvido por:** FSL Solution Digital  
**Data:** 18 de Dezembro de 2025
