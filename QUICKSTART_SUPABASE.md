# 🚀 GUIA RÁPIDO - Configuração Supabase

## ⏱️ 5 Minutos para ter seu banco configurado!

---

## 📦 O que foi instalado:

✅ Cliente Supabase JS  
✅ Módulo de configuração  
✅ Módulo de operações CRUD  
✅ Script de seed (popular banco)  
✅ Schema completo do banco  
✅ Token de API configurado  

---

## 🎯 PASSO A PASSO RÁPIDO

### 1️⃣ Configure a URL do Projeto (2 min)

```bash
python setup_supabase.py
```

**OU manualmente**:

1. Acesse: https://app.supabase.com
2. Entre no seu projeto
3. Vá em **Settings** → **API**
4. Copie a **URL** (ex: `https://xxxxx.supabase.co`)
5. Edite `js/supabase-config.js`:

```javascript
url: 'https://SEU-PROJETO.supabase.co', // ← Cole aqui
```

---

### 2️⃣ Crie as Tabelas no Banco (2 min)

1. No Supabase Dashboard → **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase-schema.sql`
4. Copie TUDO (Ctrl+A → Ctrl+C)
5. Cole no editor (Ctrl+V)
6. Clique em **Run** ▶️
7. Aguarde a mensagem: `✅ Schema criado com sucesso!`

---

### 3️⃣ Popule o Banco com Dados (1 min)

1. Abra `index.html` no navegador
2. Pressione **F12** (abre Console)
3. Execute:

```javascript
await supabaseSeed.seed()
```

4. Aguarde a mensagem: `✅ SEED CONCLUÍDO`

5. Verifique os dados:

```javascript
await supabaseSeed.checkStatus()
```

Deve mostrar algo como:

```
📊 STATUS DO BANCO DE DADOS:
   Serviços: 3
   Produtos: 6
   Workshops: 2
   Eventos: 0
   Posts: 0
```

---

## ✅ PRONTO! Banco Configurado

Agora seu site está conectado ao Supabase e os dados sincronizam automaticamente entre desktop e mobile!

---

## 🧪 Testar Sincronização

### No Desktop:

```javascript
// Adicionar um novo serviço
await createServico({
  id: 'teste-' + Date.now(),
  titulo: 'Teste de Sincronização',
  tipo: 'Maquilhagem',
  preco: 99.00,
  disponivel: true
})
```

### No Mobile:

1. Acesse o site no celular
2. Abra o Console (use navegador que suporta)
3. Busque serviços:

```javascript
const servicos = await getAllServicos()
console.log(servicos)
```

O serviço criado no desktop deve aparecer!

---

## 🔧 Comandos Úteis

### Gerenciar Dados

```javascript
// Buscar todos os serviços
await getAllServicos()

// Buscar todos os produtos
await getAllProdutos()

// Buscar um serviço específico
await getServicoById('servico-1')

// Criar serviço
await createServico({ id: 'novo', titulo: 'Meu Serviço', ... })

// Atualizar serviço
await updateServico('servico-1', { preco: 150.00 })

// Deletar serviço
await deleteServico('servico-1')
```

### Sincronização

```javascript
// Sincronizar Supabase → Local (download)
await syncSupabaseToLocal()

// Sincronizar Local → Supabase (upload)
await syncLocalToSupabase()

// Forçar atualização do cache
await getDadosJSON(true)
```

### Status e Debug

```javascript
// Ver status do banco
await supabaseSeed.checkStatus()

// Verificar se Supabase está disponível
isSupabaseAvailable()

// Ver cliente Supabase
getSupabaseClient()
```

---

## 🚨 Resolução de Problemas

### Erro: "Cliente Supabase não está disponível"

**Causa**: Biblioteca não carregou  
**Solução**: Recarregue a página (F5)

### Erro: "Invalid API key"

**Causa**: Token incorreto  
**Solução**: Verifique o token em `supabase-config.js`

### Erro: "relation does not exist"

**Causa**: Tabelas não foram criadas  
**Solução**: Execute o SQL no passo 2

### Dados não aparecem

**Causa**: Seed não foi executado  
**Solução**: Execute `await supabaseSeed.seed()`

---

## 📱 Publicar para Mobile

### Opção 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opção 2: Netlify

1. Arraste a pasta do projeto para [Netlify Drop](https://app.netlify.com/drop)
2. Site publicado instantaneamente!

### Opção 3: GitHub Pages

```bash
git add .
git commit -m "Configurar Supabase"
git push

# Ativar GitHub Pages nas configurações do repo
```

---

## 🎉 Funcionalidades Ativas

✅ **CRUD Completo**: Criar, ler, atualizar, deletar  
✅ **Sincronização Automática**: A cada 5 minutos  
✅ **Cache Offline**: Funciona sem internet  
✅ **Mobile First**: Otimizado para celular  
✅ **Segurança RLS**: Proteção de dados  
✅ **Real-time**: Atualizações em tempo real (opcional)  

---

## 📚 Arquivos Criados

```
📁 yamarproject/
├── 📄 supabase-schema.sql        # Estrutura do banco
├── 📄 setup_supabase.py          # Assistente de configuração
├── 📄 SUPABASE_CONFIG.md         # Documentação completa
├── 📄 QUICKSTART_SUPABASE.md     # Este guia rápido
└── 📁 js/
    ├── 📄 supabase-config.js     # Configuração
    ├── 📄 supabase-db.js         # Operações CRUD
    └── 📄 supabase-seed.js       # Popular banco
```

---

## 💡 Dicas Finais

1. **Backup**: Sempre faça backup antes de mexer no banco
2. **Dev/Prod**: Use projetos separados para desenvolvimento e produção
3. **Segurança**: Nunca exponha a `service_role_key` no frontend
4. **Performance**: O cache local reduz chamadas à API
5. **Logs**: Monitore o console para ver operações do Supabase

---

## 🆘 Precisa de Ajuda?

📖 Documentação completa: [SUPABASE_CONFIG.md](SUPABASE_CONFIG.md)  
🌐 Docs Supabase: https://supabase.com/docs  
💬 Suporte Supabase: https://supabase.com/support  

---

**Configuração criada em**: 02/01/2026  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para usar
