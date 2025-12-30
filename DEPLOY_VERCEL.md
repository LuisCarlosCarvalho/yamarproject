# 🚀 Guia de Deploy - Yamar Project na Vercel

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Configuração do dados.json](#configuração-do-dadosjson)
4. [Deploy Inicial](#deploy-inicial)
5. [Atualizações de Dados](#atualizações-de-dados)
6. [Verificação e Testes](#verificação-e-testes)
7. [Troubleshooting](#troubleshooting)

---

## 📦 Pré-requisitos

### Ferramentas Necessárias
- **Node.js** 18+ instalado
- **Git** configurado
- Conta na **Vercel** (gratuita)
- **Vercel CLI** (opcional, mas recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login
```

---

## 📁 Estrutura de Arquivos

O projeto deve ter esta estrutura para deploy:

```
yamarproject/
├── dados.json              ⭐ ARQUIVO CENTRAL DE DADOS
├── index.html
├── admin.html
├── *.html                  (todas as páginas)
├── vercel.json             (configuração Vercel)
├── package.json
├── js/
│   ├── app.js
│   ├── storage.js          ⭐ Sistema de sincronização
│   ├── ui.js               ⭐ Compatibilidade mobile
│   ├── security.js
│   └── secure-render.js
├── css/
│   └── styles.css
├── assets/
│   └── images/
└── images/
```

---

## ⚙️ Configuração do dados.json

### 1. **Localização Correta**
O arquivo `dados.json` deve estar na **raiz do projeto**, no mesmo nível que `index.html`.

```
✅ CORRETO:
/dados.json
/index.html

❌ ERRADO:
/data/dados.json
/api/dados.json
```

### 2. **Caminho de Fetch**

No arquivo `js/storage.js`, o caminho já está configurado corretamente:

```javascript
async function fetchDadosJSON() {
    const timestamp = new Date().getTime();
    const url = `dados.json?t=${timestamp}`; // ✅ Caminho relativo
    // ...
}
```

### 3. **Cache-Busting**

O sistema usa timestamp para forçar refresh:
```javascript
dados.json?t=1704067200000
```

Isso garante que mobile sempre busca a versão mais recente.

---

## 🚀 Deploy Inicial

### Método 1: Via Dashboard Vercel (Recomendado)

1. **Acesse** [vercel.com](https://vercel.com)
2. **Clique** em "New Project"
3. **Importe** seu repositório GitHub
4. **Configure** o projeto:
   - Framework Preset: `Other`
   - Root Directory: `./` (raiz)
   - Build Command: (deixe vazio)
   - Output Directory: (deixe vazio)
5. **Clique** em "Deploy"

### Método 2: Via Vercel CLI

```bash
# No diretório do projeto
cd /path/to/yamarproject

# Deploy
vercel

# Seguir prompts:
# ? Set up and deploy? [Y/n] Y
# ? Which scope? [Seu usuário]
# ? Link to existing project? [N]
# ? What's your project's name? yamarproject
# ? In which directory is your code located? ./

# Deploy para produção
vercel --prod
```

---

## 📝 Atualizações de Dados

### Como Funciona a Sincronização

1. **Desktop**: Admin atualiza preço no painel HTML
2. **Python Script**: Grava mudança no `dados.json`
3. **Commit & Push**: Mudanças vão para GitHub
4. **Vercel**: Auto-redeploy (30-60 segundos)
5. **Mobile**: Busca `dados.json?t=timestamp` (cache-busting)
6. **Sincronização**: Todos dispositivos recebem novos dados

### Usando o Script Python

```bash
# Executar painel administrativo
python admin_dados.py

# Exemplo: Atualizar preço de serviço
# 1. Escolher opção [2] Atualizar Serviço
# 2. Digitar ID: makeup-noiva
# 3. Digitar: preco=200 disponivel=true
# 4. Script salva em dados.json automaticamente
```

### Workflow Completo

```bash
# 1. Atualizar dados via Python
python admin_dados.py

# 2. Verificar mudanças
git status

# 3. Commit
git add dados.json
git commit -m "📊 Atualização de preços e disponibilidade"

# 4. Push para GitHub
git push origin main

# 5. Vercel faz auto-deploy (aguardar 30-60s)

# 6. Testar no mobile
# Abrir site no mobile e verificar mudanças
```

---

## ✅ Verificação e Testes

### Teste 1: Verificar Cache-Busting

No console do navegador:

```javascript
// Desktop
console.log('Testando fetch...');
fetch('dados.json?t=' + Date.now())
    .then(r => r.json())
    .then(d => console.log('✅ Dados:', d));

// Mobile (mesmo código)
```

Ambos devem retornar os **mesmos dados atualizados**.

### Teste 2: Verificar Sincronização

1. **Desktop**: Atualizar preço via Python
2. **Commit & Push**
3. **Aguardar** 30-60s (deploy Vercel)
4. **Mobile**: Abrir site
5. **Verificar**: Preço atualizado aparece

### Teste 3: Verificar querySelectorAll

```javascript
// Console do navegador (mobile)
const badges = document.querySelectorAll('#cartBadge, .cart-badge');
console.log('✅ Badges encontrados:', badges.length);
// Deve retornar 2+ (desktop menu + mobile menu)
```

---

## 🔧 Configuração Avançada - vercel.json

Crie arquivo `vercel.json` na raiz:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*.html",
      "use": "@vercel/static"
    },
    {
      "src": "dados.json",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/dados.json",
      "headers": {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      "dest": "/dados.json"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
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
        }
      ]
    }
  ]
}
```

### Benefícios desta Configuração

- ✅ **Cache-Control no dados.json**: Força refresh sempre
- ✅ **Security Headers**: Mantém proteções do sistema
- ✅ **Static Builds**: Otimização automática

---

## 🐛 Troubleshooting

### Problema 1: Mobile Não Atualiza Dados

**Sintomas**: Desktop mostra preço €200, mobile mostra €150

**Causas Possíveis**:
1. Cache do navegador mobile
2. Deploy não concluído
3. Cache-busting não funcionando

**Soluções**:

```bash
# 1. Limpar cache mobile
# Configurações > Safari/Chrome > Limpar Histórico

# 2. Verificar deploy
vercel ls
# Deve mostrar deployment recente

# 3. Forçar hard refresh mobile
# Safari: Fechar e reabrir
# Chrome: Menu > Histórico > Limpar dados

# 4. Verificar timestamp
# Console mobile:
console.log(new Date().getTime());
// Deve ser timestamp atual (13 dígitos)
```

### Problema 2: Erro 404 no dados.json

**Sintomas**: `Failed to fetch dados.json`

**Causas**:
- Arquivo não está na raiz
- Deploy incompleto
- Caminho errado

**Soluções**:

```bash
# Verificar estrutura local
ls -la dados.json
# Deve mostrar arquivo na raiz

# Verificar no Vercel
curl https://seu-site.vercel.app/dados.json
# Deve retornar JSON completo

# Verificar caminho no código
grep -r "dados.json" js/
# Deve ser caminho relativo: 'dados.json'
```

### Problema 3: IDs Duplicados (getElementById não funciona)

**Sintomas**: Funções funcionam no desktop, falham no mobile

**Causa**: HTML tem IDs duplicados (menu desktop + menu mobile)

**Solução**: Já implementada em `ui.js`

```javascript
// ❌ ERRADO (antigo)
const badge = document.getElementById('cartBadge');

// ✅ CORRETO (novo)
const badges = document.querySelectorAll('#cartBadge, .cart-badge');
badges.forEach(badge => { /* atualizar */ });
```

### Problema 4: Dados Não Salvam via Python

**Sintomas**: Script executa, mas dados não mudam

**Verificações**:

```bash
# 1. Verificar permissões
ls -la dados.json
# Deve ter permissão de escrita

# 2. Executar script com debug
python -u admin_dados.py

# 3. Verificar encoding
file dados.json
# Deve mostrar: UTF-8 Unicode text

# 4. Validar JSON
python -m json.tool dados.json
# Deve retornar JSON formatado (sem erros)
```

### Problema 5: Deploy Lento

**Sintomas**: Mudanças demoram >5min para aparecer

**Otimizações**:

```bash
# 1. Usar Vercel CLI para deploy imediato
vercel --prod

# 2. Verificar build logs
vercel logs [deployment-url]

# 3. Configurar auto-deploy (GitHub)
# Vercel Dashboard > Project > Settings > Git
# ✅ Production Branch: main
# ✅ Auto Deploy: Enabled
```

---

## 📊 Monitoramento

### Verificar Status de Deploy

```bash
# Lista últimos deploys
vercel ls

# Ver logs de deploy específico
vercel logs [deployment-url]

# Ver status ao vivo
vercel inspect [deployment-url]
```

### Verificar Sincronização

```javascript
// Adicionar no console do navegador
async function testarSync() {
    console.log('🔍 Iniciando teste de sincronização...');
    
    // 1. Buscar dados
    const dados = await getDadosJSON();
    console.log('✅ Dados carregados:', dados);
    
    // 2. Verificar cache
    console.log('📅 Última atualização:', ultimaAtualizacao);
    
    // 3. Verificar localStorage
    const servicos = getServicos();
    console.log('💾 Serviços no localStorage:', servicos);
    
    // 4. Comparar
    if (JSON.stringify(dados.servicos) === JSON.stringify(servicos)) {
        console.log('✅ Sincronização OK!');
    } else {
        console.log('⚠️ Dados desincronizados!');
    }
}

testarSync();
```

---

## 🎯 Checklist de Deploy

Antes de fazer deploy, verificar:

- [ ] `dados.json` está na raiz do projeto
- [ ] `vercel.json` configurado (opcional)
- [ ] Security headers ativados
- [ ] `storage.js` usa cache-busting com timestamp
- [ ] `ui.js` usa `querySelectorAll` ao invés de `getElementById`
- [ ] Todos os scripts Python funcionam
- [ ] Git está sincronizado com GitHub
- [ ] Testado no desktop (Chrome/Safari)
- [ ] Testado no mobile (iOS/Android)
- [ ] Cache-busting verificado

---

## 🔐 Segurança em Produção

### Headers de Segurança (já configurados)

```javascript
// js/security.js
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### Proteção do dados.json

O arquivo `dados.json` é **público** (necessário para fetch), mas:

- ✅ **Apenas leitura** no frontend
- ✅ **Escrita apenas via Python** (servidor/local)
- ✅ **Validação** antes de salvar
- ✅ **Versionamento** via Git

**Nunca** exponha credenciais ou dados sensíveis no `dados.json`.

---

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Cache-Control Headers](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Cache-Control)
- [Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)

---

## 💡 Dicas de Performance

### 1. Minimize o dados.json

```bash
# Comprimir JSON (remover espaços)
python -m json.tool --compact dados.json > dados.min.json
mv dados.min.json dados.json
```

### 2. Use CDN da Vercel

A Vercel automaticamente serve arquivos via CDN global. Sem configuração extra necessária.

### 3. Monitore Tamanho

```bash
# Verificar tamanho do dados.json
ls -lh dados.json

# Ideal: < 100KB
# Aceitável: < 500KB
# Otimizar se: > 1MB
```

---

## 🎉 Deploy Completo!

Após seguir este guia, seu site estará:

- ✅ **Sincronizado** entre desktop e mobile
- ✅ **Seguro** com todos os headers
- ✅ **Atualizado** automaticamente via GitHub
- ✅ **Otimizado** com cache-busting
- ✅ **Compatível** com todos dispositivos

**URL do Site**: `https://yamarproject.vercel.app`

---

## 📞 Suporte

Em caso de dúvidas:

1. Verificar seção [Troubleshooting](#troubleshooting)
2. Conferir logs: `vercel logs`
3. Testar localmente: `python -m http.server 8000`
4. Validar JSON: `python -m json.tool dados.json`

**Última Atualização**: Janeiro 2024
