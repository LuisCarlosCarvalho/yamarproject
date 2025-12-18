# 📸 Mapeamento de Campos de Fotos - Painel Administrativo

## ✅ Campos Já Identificados no Admin

### 1. **Serviços** (Seção: Serviços)
- **Campo:** "URL da Imagem"
- **ID:** `serviceImage`
- **Localização:** Formulário de Adicionar/Editar Serviço
- **Uso:** Foto do serviço (ex: Maquilhagem de Noiva)
- **Status:** ✅ Identificado

### 2. **Workshops & Cursos** (Seção: Workshops)
- **Campo:** "URL da Imagem"
- **ID:** `workshopImage`
- **Localização:** Formulário de Adicionar/Editar Workshop
- **Uso:** Foto do workshop/curso
- **Status:** ✅ Identificado

### 3. **Últimas Novidades** (Seção: Blog)
- **Campo:** "URL da Imagem"
- **ID:** `postImage`
- **Localização:** Formulário de Adicionar/Editar Post
- **Uso:** Carrossel de posts do blog na página inicial
- **Status:** ✅ Identificado

### 4. **Produtos** (Seção: Produtos)
- **Campo:** "URL da Imagem"
- **ID:** `productImage`
- **Localização:** Formulário de Adicionar/Editar Produto
- **Uso:** Foto do produto
- **Status:** ✅ Identificado

### 5. **Eventos** (Seção: Eventos)
- **Campo:** "URL da Imagem"
- **ID:** `eventImage`
- **Localização:** Formulário de Adicionar/Editar Evento
- **Uso:** Foto do evento
- **Status:** ✅ Identificado

---

## 📝 Posts do Blog (Carrosséis Específicos)

Os seguintes carrosséis são **posts do blog** com categorias específicas:

### 6. **Tendências de Maquilhagem Verão 2025**
- **Tipo:** Post do Blog
- **Categoria:** "Tendências"
- **Campo:** "URL da Imagem" (no formulário de Posts)
- **Como gerir:** Criar posts com categoria "Tendências"
- **Status:** ✅ Gerido via Posts

### 7. **Guia Completo: Maquilhagem para Noivas**
- **Tipo:** Post do Blog
- **Categoria:** "Tutorial"
- **Campo:** "URL da Imagem" (no formulário de Posts)
- **Como gerir:** Criar posts com categoria "Tutorial"
- **Status:** ✅ Gerido via Posts

### 8. **Os Erros Mais Comuns na Maquilhagem**
- **Tipo:** Post do Blog
- **Categoria:** "Dicas"
- **Campo:** "URL da Imagem" (no formulário de Posts)
- **Como gerir:** Criar posts com categoria "Dicas"
- **Status:** ✅ Gerido via Posts

### 9. **Pincéis Essenciais para Iniciantes**
- **Tipo:** Post do Blog
- **Categoria:** "Produtos"
- **Campo:** "URL da Imagem" (no formulário de Posts)
- **Como gerir:** Criar posts com categoria "Produtos"
- **Status:** ✅ Gerido via Posts

---

## 🎯 Resumo

| Secção | Local no Admin | Campo de Foto | Identificação |
|--------|----------------|---------------|---------------|
| Serviços | Serviços → Adicionar/Editar | URL da Imagem | ✅ `serviceImage` |
| Workshops | Workshops → Adicionar/Editar | URL da Imagem | ✅ `workshopImage` |
| Últimas Novidades | Blog → Adicionar/Editar Post | URL da Imagem | ✅ `postImage` |
| Tendências Verão 2025 | Blog → Posts (Cat: Tendências) | URL da Imagem | ✅ `postImage` |
| Guia Noivas | Blog → Posts (Cat: Tutorial) | URL da Imagem | ✅ `postImage` |
| Erros Comuns | Blog → Posts (Cat: Dicas) | URL da Imagem | ✅ `postImage` |
| Pincéis Essenciais | Blog → Posts (Cat: Produtos) | URL da Imagem | ✅ `postImage` |
| Produtos | Produtos → Adicionar/Editar | URL da Imagem | ✅ `productImage` |
| Eventos | Eventos → Adicionar/Editar | URL da Imagem | ✅ `eventImage` |

---

## 📌 Notas Importantes

1. **Todos os campos já estão identificados** com labels "URL da Imagem"
2. **Posts do Blog** servem múltiplos carrosséis através de categorias
3. **Fotos atuais** serão mantidas
4. **Formato aceite:** URLs de imagens (https://...)
5. **Fallback:** Cada tipo tem uma imagem padrão do Unsplash

---

## 🔧 Próximos Passos (Sugeridos)

- [ ] Adicionar tooltips explicativos em cada campo
- [ ] Adicionar preview de imagem ao inserir URL
- [ ] Adicionar upload direto de imagens (opcional)
- [ ] Adicionar galeria de imagens sugeridas
