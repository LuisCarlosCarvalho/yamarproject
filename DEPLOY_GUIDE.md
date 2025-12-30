# 🚀 GUIA DE DEPLOY SEGURO - YAMAR PROJECT

Este guia fornece instruções passo a passo para fazer o deploy do site de forma segura.

---

## 📋 Pré-requisitos

✅ Código com sistema de segurança implementado  
✅ Conta em plataforma de hospedagem  
✅ Domínio próprio (opcional mas recomendado)  

---

## 🎯 Opções de Hospedagem Recomendadas

### 1. Netlify (Recomendado) ⭐⭐⭐⭐⭐

**Por que escolher:**
- ✅ HTTPS automático e gratuito
- ✅ CDN global
- ✅ Deploy automático via Git
- ✅ Headers de segurança fáceis de configurar
- ✅ Formulários integrados (útil para contato)
- ✅ Plano gratuito generoso

**Como fazer deploy:**

1. **Crie uma conta em [netlify.com](https://netlify.com)**

2. **Conecte seu repositório GitHub:**
   - Clique em "New site from Git"
   - Escolha GitHub
   - Selecione o repositório `yamarproject`

3. **Configure o build:**
   ```
   Build command: (deixe em branco)
   Publish directory: /
   ```

4. **Adicione headers de segurança:**
   
   Crie um arquivo `netlify.toml` na raiz do projeto:
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
       X-XSS-Protection = "1; mode=block"
       Referrer-Policy = "strict-origin-when-cross-origin"
       Permissions-Policy = "geolocation=(), microphone=(), camera=()"
       Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; frame-ancestors 'none'"
       Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
   
   [[redirects]]
     from = "/*"
     to = "/404.html"
     status = 404
   ```

5. **Configure domínio personalizado (opcional):**
   - Vá em "Domain settings"
   - Adicione seu domínio
   - Configure DNS conforme instruções

---

### 2. Vercel ⭐⭐⭐⭐⭐

**Por que escolher:**
- ✅ HTTPS automático
- ✅ Edge Network global
- ✅ Deploy via Git
- ✅ Velocidade extrema
- ✅ Plano gratuito

**Como fazer deploy:**

1. **Crie conta em [vercel.com](https://vercel.com)**

2. **Conecte repositório:**
   - Clique em "New Project"
   - Importe do GitHub
   - Selecione `yamarproject`

3. **Configure:**
   ```
   Framework Preset: Other
   Build Command: (deixe em branco)
   Output Directory: ./
   ```

4. **Adicione `vercel.json` na raiz:**
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           },
           {
             "key": "Referrer-Policy",
             "value": "strict-origin-when-cross-origin"
           },
           {
             "key": "Permissions-Policy",
             "value": "geolocation=(), microphone=(), camera=()"
           },
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; frame-ancestors 'none'"
           },
           {
             "key": "Strict-Transport-Security",
             "value": "max-age=31536000; includeSubDomains; preload"
           }
         ]
       }
     ]
   }
   ```

---

### 3. GitHub Pages ⭐⭐⭐⭐

**Por que escolher:**
- ✅ Gratuito
- ✅ HTTPS automático
- ✅ Integração direta com GitHub
- ✅ Fácil de configurar

**Como fazer deploy:**

1. **Vá nas configurações do repositório no GitHub**

2. **Ative GitHub Pages:**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `master`
   - Folder: `/ (root)`

3. **Adicione CNAME para domínio personalizado (opcional)**

4. **Limitação:** Headers de segurança não podem ser customizados diretamente, mas o sistema JavaScript já implementa proteções

---

### 4. Cloudflare Pages ⭐⭐⭐⭐⭐

**Por que escolher:**
- ✅ HTTPS automático
- ✅ CDN global da Cloudflare
- ✅ Proteção DDoS incluída
- ✅ Analytics gratuito
- ✅ Workers para lógica server-side

**Como fazer deploy:**

1. **Crie conta em [pages.cloudflare.com](https://pages.cloudflare.com)**

2. **Conecte GitHub:**
   - "Create a project"
   - Conecte GitHub
   - Selecione repositório

3. **Configure:**
   ```
   Build command: (vazio)
   Build output directory: /
   ```

4. **Configure headers:**
   - Vá em Settings
   - Headers & Redirects
   - Adicione headers customizados (similar ao Netlify)

---

## 🔐 Checklist Pós-Deploy

Após fazer o deploy, verifique:

### 1. HTTPS Ativo
```
✅ Site carrega com https://
✅ Redirecionamento HTTP → HTTPS funcionando
✅ Certificado SSL válido
```

### 2. Headers de Segurança
Use [securityheaders.com](https://securityheaders.com) para verificar:
```
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ X-XSS-Protection: 1; mode=block
✅ Content-Security-Policy configurado
✅ Strict-Transport-Security (HSTS)
```

### 3. Sistema de Segurança JavaScript
Abra o console do browser (F12) e verifique:
```
✅ "🔒 Sistema de segurança ativado" aparece
✅ "🔒 Funções seguras de renderização carregadas" aparece
✅ Sem erros JavaScript
```

### 4. Teste de XSS
Tente em um campo de formulário:
```html
<script>alert('XSS')</script>
```
**Resultado esperado:** ✅ Input sanitizado, sem execução

### 5. Teste de CSRF
```javascript
// No console
validateCSRFToken('token_invalido')
```
**Resultado esperado:** ✅ Retorna `false`

### 6. Teste de Rate Limiting
Tente submeter um formulário 6x rapidamente  
**Resultado esperado:** ✅ 6ª tentativa bloqueada

### 7. Performance
Use [PageSpeed Insights](https://pagespeed.web.dev/):
```
✅ Score acima de 90 (mobile)
✅ Score acima de 95 (desktop)
✅ HTTPS habilitado
✅ Compressão ativa
```

### 8. Teste de Navegação
```
✅ Todas as páginas carregam
✅ Formulários funcionam
✅ Admin panel acessível
✅ Imagens carregam
✅ Links funcionam
```

---

## 🌐 Configuração de Domínio Personalizado

### Passo 1: Compre um domínio
- [GoDaddy](https://godaddy.com)
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)

### Passo 2: Configure DNS

**Para Netlify/Vercel:**
```
Type: A
Name: @
Value: [IP fornecido pela plataforma]

Type: CNAME
Name: www
Value: [seu-site].netlify.app ou [seu-site].vercel.app
```

**Para Cloudflare:**
- Cloudflare gerencia DNS automaticamente
- Apenas aponte nameservers do domínio para Cloudflare

### Passo 3: Aguarde propagação DNS
- Pode levar até 48h
- Use [whatsmydns.net](https://whatsmydns.net) para verificar

---

## 🔒 Proteção Adicional com Cloudflare (Recomendado)

Mesmo que hospede em outra plataforma, use Cloudflare como proxy:

### Benefícios:
- ✅ Proteção DDoS
- ✅ Firewall de aplicação web (WAF)
- ✅ Rate limiting avançado
- ✅ Cache global
- ✅ Analytics
- ✅ **Tudo GRATUITO**

### Como configurar:

1. **Crie conta em [cloudflare.com](https://cloudflare.com)**

2. **Adicione seu domínio:**
   - "Add site"
   - Digite seu domínio
   - Escolha plano Free

3. **Atualize nameservers:**
   - Cloudflare mostrará 2 nameservers
   - Configure no registrador do seu domínio

4. **Configure SSL:**
   - SSL/TLS → Full (strict)

5. **Ative proteções:**
   - Security → WAF → ON
   - Security → DDoS Protection → ON
   - Speed → Auto Minify → ON
   - Caching → Always Online → ON

6. **Configure Page Rules (opcional):**
   ```
   *yamarproject.com/*
   - Cache Level: Cache Everything
   - Browser Cache TTL: 1 day
   
   *yamarproject.com/admin.html
   - Security Level: High
   - Cache Level: Bypass
   ```

---

## 📊 Monitoramento

### 1. Google Analytics (Opcional)
Adicione no `<head>` de todos os HTML:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Uptime Monitoring
Use serviços gratuitos:
- [UptimeRobot](https://uptimerobot.com) - Gratuito
- [Pingdom](https://pingdom.com) - Trial gratuito

### 3. Logs de Segurança
O sistema já registra eventos. Para visualizar:
```javascript
// No console do admin
console.table(getSecurityLog());
```

---

## 🔄 Atualizações Futuras

Para atualizar o site após deploy:

### Se usou Git (Netlify/Vercel/Cloudflare):
```bash
git add .
git commit -m "Atualização de segurança"
git push origin main
```
**Deploy automático acontece!**

### GitHub Pages:
```bash
git add .
git commit -m "Atualização"
git push origin main
```
**Aguarde ~1 minuto**

---

## ⚠️ Checklist Antes de Colocar no Ar

- [ ] Todos os scripts de segurança carregam sem erro
- [ ] HTTPS configurado
- [ ] Headers de segurança implementados
- [ ] Teste de XSS realizado
- [ ] Teste de CSRF realizado
- [ ] Rate limiting testado
- [ ] Formulários funcionando
- [ ] Admin panel acessível
- [ ] Domínio configurado (se aplicável)
- [ ] Cloudflare ativo (recomendado)
- [ ] Backup do código no Git
- [ ] Analytics configurado (opcional)
- [ ] Uptime monitor configurado (opcional)
- [ ] Páginas de erro (403, 404, 500) funcionando

---

## 🆘 Troubleshooting

### Problema: "Erro ao carregar security.js"
**Solução:** Verifique se o arquivo está na pasta `/js/`

### Problema: "CSRF token inválido"
**Solução:** Recarregue a página antes de submeter o formulário

### Problema: "Mixed content" (HTTP em página HTTPS)
**Solução:** Certifique que todos os recursos usam HTTPS

### Problema: Headers de segurança não aparecem
**Solução:** Configure via `netlify.toml`, `vercel.json`, ou `.htaccess`

### Problema: Site lento
**Solução:** 
1. Ative Cloudflare
2. Otimize imagens
3. Use cache adequadamente

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do browser (F12)
2. Teste em [securityheaders.com](https://securityheaders.com)
3. Consulte o [SECURITY_REPORT.md](SECURITY_REPORT.md)
4. Revise este guia

---

## ✅ Próximos Passos

Após deploy bem-sucedido:

1. **Teste tudo:** Navegue por todas as páginas
2. **Configure analytics:** Monitore visitantes
3. **Configure uptime monitor:** Saiba se o site cair
4. **Divulgue:** Compartilhe nas redes sociais
5. **Mantenha atualizado:** Git push regularmente

---

**🎉 Parabéns! Seu site está seguro e no ar!**

Mantenha este guia para referência futura e atualizações.
