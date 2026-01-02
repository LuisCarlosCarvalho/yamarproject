# 🗄️ Configuração do Banco de Dados Supabase

## Yamar Makeup Artist Project

Este guia descreve como configurar e utilizar o banco de dados Supabase para sincronização entre desktop e mobile.

---

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase
3. Token de API fornecido

---

## ⚙️ Configuração Inicial

### 1. Obter URL do Projeto Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** > **API**
3. Copie a **URL do projeto** (algo como: `https://xxxxxxxxxxxxx.supabase.co`)

### 2. Configurar URL no Projeto

Edite o arquivo `js/supabase-config.js` e substitua a URL:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://SEU-PROJETO.supabase.co', // ← Substitua aqui
  key: 'sbp_7a9ad3f79c7feadbc5e163ff1bba998de10cd16d',
  // ...
};
```

---

## 🏗️ Criar Estrutura do Banco de Dados

### Opção 1: Usando o SQL Editor (Recomendado)

1. No Supabase Dashboard, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em **Run**
5. Aguarde a mensagem de sucesso

### Opção 2: Usando Migration

```bash
# Se você usa Supabase CLI
supabase db push
```

---

## 📊 Estrutura do Banco de Dados

O banco contém as seguintes tabelas:

- **users** - Usuários do sistema
- **servicos** - Serviços de maquilhagem
- **produtos** - Produtos à venda
- **workshops** - Workshops e cursos
- **eventos** - Eventos e portfolio
- **posts** - Posts do blog
- **marcacoes** - Marcações/reservas de serviços
- **pedidos** - Pedidos de produtos
- **configuracoes** - Configurações do site

---

## 🌱 Popular Banco de Dados (Seed)

Após criar as tabelas, popule o banco com os dados iniciais:

### 1. Abra o site no navegador

```
http://localhost:5500/index.html
```

### 2. Abra o Console do Navegador (F12)

### 3. Execute o comando de seed:

```javascript
await supabaseSeed.seed()
```

### 4. Verifique o status:

```javascript
await supabaseSeed.checkStatus()
```

Você verá algo como:

```
📊 STATUS DO BANCO DE DADOS:
   Serviços: 3
   Produtos: 6
   Workshops: 2
   Eventos: 4
   Posts: 5
```

---

## 🔄 Sincronização Automática

O sistema já está configurado para:

1. **Leitura do Supabase**: Sempre que a página carregar, os dados são buscados do Supabase
2. **Cache Local**: Dados são armazenados em cache para acesso offline
3. **Atualização Automática**: A cada 5 minutos, o cache é atualizado

### Forçar Sincronização Manual

```javascript
// Sincronizar Supabase → Local
await syncSupabaseToLocal()

// Sincronizar Local → Supabase
await syncLocalToSupabase()
```

---

## 🔐 Segurança (RLS - Row Level Security)

O banco está configurado com políticas de segurança:

- ✅ **Dados públicos** (serviços, produtos, workshops) são acessíveis a todos
- ✅ **Dados privados** (marcações, pedidos) são acessíveis apenas ao dono
- ✅ **Apenas admins** podem criar/editar serviços e produtos

---

## 📱 Funcionamento Mobile

### Como funciona:

1. **Desktop**: Atualiza dados no Supabase
2. **Mobile**: Ao abrir o app, busca dados do Supabase
3. **Cache**: Dados são salvos localmente para funcionar offline
4. **Sync**: Ao voltar online, sincroniza mudanças

### Testar no Mobile:

1. Publique o site (Vercel, Netlify, etc.)
2. Acesse no celular
3. Faça logout e login novamente
4. Os dados devem aparecer sincronizados

---

## 🛠️ Comandos Úteis

### No Console do Navegador:

```javascript
// Ver status do banco
await supabaseSeed.checkStatus()

// Popular banco novamente
await supabaseSeed.seed()

// Limpar todos os dados (CUIDADO!)
await supabaseSeed.clear()

// Buscar todos os serviços
const servicos = await getAllServicos()
console.log(servicos)

// Buscar todos os produtos
const produtos = await getAllProdutos()
console.log(produtos)

// Criar novo serviço
await createServico({
  id: 'servico-teste',
  titulo: 'Meu Serviço',
  preco: 100.00,
  disponivel: true
})

// Atualizar serviço
await updateServico('servico-teste', {
  preco: 120.00
})

// Deletar serviço
await deleteServico('servico-teste')
```

---

## 🚨 Troubleshooting

### Erro: "Cliente Supabase não está disponível"

**Solução**: Verifique se a biblioteca Supabase foi carregada:

```javascript
console.log(typeof supabase) // deve ser 'object'
```

Se for `undefined`, adicione o script no HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Erro: "Invalid API key"

**Solução**: Verifique se o token em `supabase-config.js` está correto.

### Erro: "relation does not exist"

**Solução**: Execute o script SQL (`supabase-schema.sql`) no SQL Editor do Supabase.

### Dados não aparecem no mobile

**Solução**:

1. Limpe o cache do navegador mobile
2. Faça logout e login novamente
3. Verifique se o site está usando HTTPS (Supabase requer SSL)

---

## 📝 Estrutura de Arquivos

```
yamarproject/
├── supabase-schema.sql          # Schema do banco de dados
├── js/
│   ├── supabase-config.js       # Configuração do Supabase
│   ├── supabase-db.js           # Operações CRUD
│   ├── supabase-seed.js         # Popular banco de dados
│   ├── storage.js               # (Atualizado para usar Supabase)
│   └── app.js                   # Lógica principal
└── SUPABASE_CONFIG.md           # Este arquivo
```

---

## 🎯 Próximos Passos

1. ✅ Configurar URL do Supabase
2. ✅ Criar tabelas no banco
3. ✅ Popular banco com dados iniciais
4. ✅ Testar sincronização
5. 🔄 Atualizar `storage.js` para usar Supabase (opcional)
6. 🔄 Implementar autenticação com Supabase Auth (opcional)

---

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✨ Funcionalidades Implementadas

- ✅ CRUD completo para todas as entidades
- ✅ Sincronização automática
- ✅ Cache local para offline
- ✅ Row Level Security
- ✅ Triggers automáticos (updated_at)
- ✅ Políticas de acesso
- ✅ Seed inicial de dados

---

## 💡 Dicas

1. **Backup**: Sempre faça backup dos dados antes de limpar o banco
2. **Desenvolvimento**: Use um projeto Supabase separado para desenvolvimento
3. **Performance**: O cache local reduz chamadas à API
4. **Segurança**: Nunca exponha a chave de serviço (service_role_key) no frontend

---

**Data de criação**: 02/01/2026
**Versão**: 1.0.0
