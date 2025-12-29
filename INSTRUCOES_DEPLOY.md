# Instruções de Deploy - PWA Yemar Makeup Artist

## 🚀 Como Fazer Deploy do Site

### Pré-requisitos
- ✅ Servidor web com suporte a HTTPS (obrigatório para PWA)
- ✅ Domínio configurado
- ✅ Certificado SSL instalado

---

## 📦 Arquivos para Upload

Faça upload de **todos** os arquivos do projeto para o servidor.

### Arquivos Novos (PWA):
- `manifest.json`
- `sw.js`
- `js/pwa-install.js`
- `assets/images/icon-*.png` (8 ícones)
- `assets/images/screenshot-*.png` (2 screenshots)

### Arquivos Modificados:
- `css/styles.css` (melhorias mobile + estilos PWA)
- Todos os 17 arquivos `.html` (meta tags PWA)

---

## ✅ Checklist Pós-Deploy

### 1. HTTPS Funcionando
- [ ] Site acessível via https://
- [ ] Certificado SSL válido

### 2. Arquivos PWA Acessíveis
- [ ] https://seusite.com/manifest.json retorna JSON
- [ ] https://seusite.com/sw.js retorna JavaScript
- [ ] https://seusite.com/assets/images/icon-192x192.png carrega

### 3. Service Worker Registrado
- [ ] Abra DevTools (F12)
- [ ] Vá em Application > Service Workers
- [ ] Deve aparecer "sw.js" registrado

---

## 🧪 Testando a PWA

### Teste 1: Página de Teste
Acesse: https://seusite.com/test-pwa.html

### Teste 2: Google Lighthouse
1. Abra DevTools (F12)
2. Vá em "Lighthouse"
3. Selecione "Progressive Web App"
4. Score deve ser > 90

### Teste 3: Mobile
1. Acesse no celular
2. Banner de instalação deve aparecer
3. Instale o app
4. Verifique funcionamento

---

## 📱 Como Instalar

### Android (Chrome)
1. Acesse o site no Chrome
2. Banner aparece automaticamente
3. Clique em "Instalar"

### iOS (Safari)
1. Acesse o site no Safari
2. Toque em Compartilhar
3. "Adicionar à Tela de Início"

---

## ⚠️ Problemas Comuns

**Banner não aparece:**
- Verifique HTTPS
- Aguarde alguns segundos
- Limpe cache

**Service Worker não registra:**
- Verifique se sw.js está acessível
- Verifique console por erros
- Limpe cache do service worker

---

## 🔄 Atualizando a PWA

Ao fazer alterações:

1. Altere a versão no `sw.js`:
```javascript
const CACHE_NAME = 'yemar-makeup-v1.0.1'; // Incrementar
```

2. Faça upload dos arquivos

3. Usuários verão notificação de atualização

---

## ✅ Checklist Final

- [ ] Todos os arquivos enviados
- [ ] HTTPS funcionando
- [ ] manifest.json acessível
- [ ] Service worker registrando
- [ ] Banner aparecendo
- [ ] Testado em Android
- [ ] Testado em iOS

---

🎉 **Pronto! Seu site agora é uma PWA completa!**
