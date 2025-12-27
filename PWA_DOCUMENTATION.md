# Documentação Técnica PWA - Yamar Project

## 📱 Visão Geral

Esta documentação cobre a implementação completa da Progressive Web App (PWA) para o projeto Yamar, incluindo responsividade mobile aprimorada, service worker avançado e sistema de instalação inteligente.

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
yamarproject/
├── manifest.json              # Configuração da PWA
├── sw.js                     # Service Worker
├── js/
│   ├── pwa-install.js        # Gerenciamento de instalação
│   └── ...                   # Outros scripts
├── css/
│   └── styles.css            # Estilos + Media Queries Mobile
├── assets/images/
│   ├── icon-*.png            # Ícones PWA (72px-512px)
│   └── screenshot-*.png      # Screenshots para stores
└── *.html                    # Páginas com meta tags PWA
```

## 📱 Responsividade Mobile

### Media Queries Implementadas

```css
/* Mobile First Approach */
@media (max-width: 768px) {
  /* Layout adjustments */
}

@media (max-width: 480px) {
  /* Small mobile optimizations */
}
```

### Funcionalidades Mobile
- **Touch Targets**: Mínimo 44x44px para botões
- **Font Size**: 16px em formulários (evita zoom iOS)
- **Scroll Horizontal**: Tabelas com overflow-x: auto
- **Modais**: Adaptados para tela cheia mobile

## 🚀 Service Worker

### Estratégias de Cache

1. **Network First**: Para páginas HTML
   - Tenta buscar da rede primeiro
   - Fallback para cache se offline

2. **Cache First**: Para assets estáticos
   - CSS, JS, imagens, fontes
   - Atualização em background

### Recursos em Cache

#### Estático (STATIC_CACHE)
- `index.html`, `styles.css`, `app.js`
- Manifest e ícones principais

#### Dinâmico (DYNAMIC_CACHE)
- Páginas visitadas
- Recursos carregados sob demanda

### Eventos Implementados
- `install`: Cache inicial
- `activate`: Limpeza de caches antigos
- `fetch`: Estratégias de cache
- `message`: Comunicação com app
- `push`: Notificações (preparado)
- `sync`: Sincronização em background (preparado)

## 📦 Manifest.json

### Configurações Principais
```json
{
  "name": "Yamar Project",
  "short_name": "Yamar",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#c9a227",
  "background_color": "#ffffff"
}
```

### Ícones
- 8 tamanhos: 72px até 512px
- Formato PNG com transparência
- Purpose: any maskable

### Atalhos Rápidos
- Serviços, Workshops, Loja, Contacto
- Ícones otimizados

## 📲 Sistema de Instalação

### Banner Inteligente
- Aparece automaticamente em mobile
- Detecta se já instalado
- Pode ser fechado (não reaparece no dia)
- Design com cores da marca

### Instruções iOS
- Modal passo-a-passo
- Compatível com Safari
- Explica processo de instalação

### Detecção de Instalação
```javascript
// Verifica se está em modo standalone
if (window.matchMedia('(display-mode: standalone)').matches) {
  // App já instalado
}
```

## 🎨 Design System

### Cores da Marca
- **Dourado**: `#c9a227` (principal)
- **Preto**: `#0b0b0d` (secundário)
- **Branco**: `#ffffff` (fundo)

### Tipografia Mobile
- Font-size mínimo: 16px em inputs
- Line-height: 1.5
- Touch targets: 44px mínimo

## 🧪 Testes e Validação

### Google Lighthouse
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90
- PWA: >90

### Testes Manuais
- Instalação Android/Chrome
- Instalação iOS/Safari
- Funcionamento offline
- Notificações de atualização

## 🚀 Deploy

### Pré-requisitos
- Servidor HTTPS (obrigatório para PWA)
- Suporte a Service Workers
- Certificado SSL válido

### Checklist de Deploy
- [ ] Upload de todos os arquivos
- [ ] Verificação HTTPS
- [ ] Teste com Lighthouse
- [ ] Validação manifest.json
- [ ] Teste de instalação
- [ ] Verificação offline

## 🔧 Troubleshooting

### Problemas Comuns

#### Service Worker não registra
- Verificar HTTPS
- Checar console do navegador
- Confirmar caminho do arquivo

#### Banner não aparece
- Verificar se já instalado
- Checar localStorage
- Confirmar device mobile

#### Cache não atualiza
- Hard refresh (Ctrl+F5)
- Limpar storage do navegador
- Verificar versão do cache

### Debug Tools
- Chrome DevTools > Application
- Lighthouse PWA Audit
- Service Worker panel

## 📈 Métricas de Sucesso

### PWA
- Install rate > 10%
- Session duration +20%
- Return visits +15%

### Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

## 🔮 Futuras Implementações

### Push Notifications
- Sistema de notificações push
- Personalização por usuário
- Agendamento inteligente

### Background Sync
- Sincronização offline
- Queue de ações
- Retry automático

### Advanced Caching
- Predictive caching
- Cache de API responses
- CDN integration

---

**Última atualização**: Dezembro 2025
**Versão**: 1.0.0