# 📋 Instruções de Deploy - PWA Yamar Project

## 🎯 Pré-requisitos

### Servidor
- ✅ **HTTPS obrigatório** (PWA não funciona em HTTP)
- ✅ Suporte a Service Workers
- ✅ Certificado SSL válido
- ✅ Headers CORS adequados

### Arquivos
- ✅ Todos os arquivos criados e modificados
- ✅ Ícones PWA gerados
- ✅ Screenshots criados

## 🚀 Checklist de Deploy

### 1. Preparação do Servidor
```bash
# Verificar HTTPS
curl -I https://seudominio.com

# Deve retornar status 200 e certificado válido
```

### 2. Upload de Arquivos
```bash
# Estrutura final esperada:
/ (raiz do site)
├── manifest.json
├── sw.js
├── index.html
├── css/styles.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── ui.js
│   └── pwa-install.js
├── assets/images/
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── ...
│   ├── icon-512.png
│   ├── screenshot-mobile.png
│   └── screenshot-desktop.png
└── [outras páginas HTML]
```

### 3. Configuração do Servidor

#### Apache (.htaccess)
```apache
# Habilitar CORS para Service Worker
<Files "sw.js">
  <RequireAll>
    Require all granted
  </RequireAll>
</Files>

# Headers de cache para PWA
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType application/manifest+json "access plus 1 month"
  ExpiresByType text/cache-manifest "access plus 1 month"
</IfModule>

# Headers de segurança
<IfModule mod_headers.c>
  Header always set X-Frame-Options DENY
  Header always set X-Content-Type-Options nosniff
  Header always set Referrer-Policy strict-origin-when-cross-origin
</IfModule>
```

#### Nginx
```nginx
# Configuração para PWA
location /sw.js {
  add_header Cache-Control "public, max-age=0, must-revalidate";
  add_header Service-Worker-Allowed /;
}

location /manifest.json {
  add_header Content-Type application/manifest+json;
  add_header Cache-Control "public, max-age=31536000";
}

# Headers de segurança
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header Referrer-Policy strict-origin-when-cross-origin;
```

#### Headers Importantes
```http
Service-Worker-Allowed: /
Cache-Control: public, max-age=31536000
Content-Type: application/manifest+json
```

## 🧪 Testes Pós-Deploy

### 1. Validação Básica
```bash
# Verificar se arquivos estão acessíveis
curl https://seudominio.com/manifest.json
curl https://seudominio.com/sw.js
curl https://seudominio.com/js/pwa-install.js
```

### 2. Google Lighthouse
1. Abrir Chrome DevTools
2. Aba "Lighthouse"
3. Selecionar "Progressive Web App"
4. Executar auditoria
5. **Objetivo**: Score >90 em todos os critérios

### 3. Teste Manual de Instalação

#### Android/Chrome
1. ✅ Acessar site em dispositivo Android
2. ✅ Banner deve aparecer automaticamente
3. ✅ Clicar "Instalar"
4. ✅ App deve ser instalado na tela inicial
5. ✅ Abrir em modo standalone

#### iOS/Safari
1. ✅ Acessar site em iPhone/iPad
2. ✅ Banner deve aparecer com "Como instalar"
3. ✅ Seguir instruções do modal
4. ✅ App deve aparecer na tela inicial

### 4. Testes de Funcionalidade

#### Offline
1. ✅ Instalar PWA
2. ✅ Abrir app instalado
3. ✅ Desconectar internet
4. ✅ Navegar pelas páginas em cache
5. ✅ Funcionalidades básicas devem funcionar

#### Cache
1. ✅ Visitar várias páginas
2. ✅ Fechar e reabrir app
3. ✅ Páginas devem carregar instantaneamente

#### Atualização
1. ✅ Fazer deploy de nova versão
2. ✅ Abrir app instalado
3. ✅ Deve aparecer notificação de atualização
4. ✅ Após atualizar, deve carregar nova versão

## 🔧 Troubleshooting

### Problema: Service Worker não registra
```
❌ Erro: "Failed to register service worker"
```

**Soluções**:
- ✅ Verificar HTTPS
- ✅ Checar caminho do arquivo `/sw.js`
- ✅ Verificar console do navegador
- ✅ Confirmar que arquivo existe no servidor

### Problema: Manifest não carrega
```
❌ Erro: "Manifest: property 'start_url' ignored"
```

**Soluções**:
- ✅ Validar JSON syntax
- ✅ Verificar caminhos dos ícones
- ✅ Confirmar HTTPS
- ✅ Usar https://manifest-validator.appspot.com/

### Problema: Banner não aparece
```
❌ Banner não aparece em mobile
```

**Soluções**:
- ✅ Verificar se device é mobile
- ✅ Checar localStorage `pwa-banner-dismissed`
- ✅ Confirmar que não está instalado
- ✅ Verificar console para erros JavaScript

### Problema: Instalação falha
```
❌ "beforeinstallprompt" não dispara
```

**Soluções**:
- ✅ Deve ter HTTPS
- ✅ Service Worker registrado
- ✅ Manifest válido
- ✅ Usuário interagiu com página
- ✅ Não pode estar já instalado

## 📊 Métricas de Sucesso

### Lighthouse PWA Score
- ✅ Performance: >90
- ✅ Accessibility: >90
- ✅ Best Practices: >90
- ✅ SEO: >90
- ✅ PWA: >90

### Funcionalidades
- ✅ Instala em Android
- ✅ Instala em iOS
- ✅ Funciona offline
- ✅ Cache inteligente
- ✅ Notificações de update

## 🛠️ Ferramentas de Debug

### Chrome DevTools
1. **Application Tab**:
   - Service Workers
   - Manifest
   - Storage > Cache Storage
   - Storage > Local Storage

2. **Network Tab**:
   - Verificar requests do SW
   - Status codes
   - Cache hits/misses

3. **Console**:
   - Logs do Service Worker
   - Erros de instalação
   - Mensagens de debug

### Teste PWA Page
- Usar `test-pwa.html` incluído no projeto
- Testa todas as funcionalidades automaticamente
- Gera relatório de compatibilidade

## 📞 Suporte

### Documentação
- `PWA_DOCUMENTATION.md` - Documentação técnica
- `RESUMO_ALTERACOES.md` - Resumo executivo
- `test-pwa.html` - Ferramenta de diagnóstico

### Validação Online
- [Manifest Validator](https://manifest-validator.appspot.com/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🚨 Rollback (se necessário)

### Desfazer alterações
1. Remover `<link rel="manifest">` dos HTML
2. Remover `<script src="/js/pwa-install.js">`
3. Remover `sw.js` e `manifest.json`
4. Reverter `styles.css` (remover media queries PWA)
5. Limpar cache do navegador

### Verificar rollback
- ✅ Site volta ao normal
- ✅ Sem erros de console
- ✅ Funcionalidades originais preservadas

---

## ✅ Checklist Final

- [ ] HTTPS configurado
- [ ] Arquivos uploaded
- [ ] Headers do servidor OK
- [ ] Lighthouse >90
- [ ] Instalação Android OK
- [ ] Instalação iOS OK
- [ ] Offline funcionando
- [ ] Cache inteligente OK
- [ ] Documentação lida
- [ ] Testes manuais OK

**Deploy concluído quando todos os itens acima estiverem ✅**

---

**Última atualização**: Dezembro 2025
**Versão**: 1.0.0