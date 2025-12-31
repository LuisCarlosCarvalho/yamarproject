# 🚀 Guia Rápido - Sistema de Sincronização

## ⚡ Início Rápido (5 minutos)

### 1. Atualizar Dados

```bash
# Executar script Python
python admin_dados.py

# Escolher opção (exemplo: atualizar preço)
> 2  # Atualizar Serviço
> servico-1
> preco=200 disponivel=true
```

### 2. Deploy

```bash
# Commit e Push
git add dados.json
git commit -m "📊 Atualização de preços"
git push origin main

# Aguardar 30-60 segundos
```

### 3. Verificar

```bash
# Mobile: Abrir site
# Verificar console: ✅ Dados sincronizados com sucesso!
```

---

## 📋 Comandos Úteis

### Python Admin

```bash
# Listar todos os serviços
python admin_dados.py
> 1

# Listar workshops
python admin_dados.py
> 3

# Atualizar produto
python admin_dados.py
> 6
> produto-1
> preco=50 stock=20
```

### Git

```bash
# Status
git status

# Commit rápido
git add dados.json && git commit -m "update" && git push

# Ver histórico
git log --oneline
```

### Testes

```bash
# Local
python -m http.server 8000

# Console do navegador
fetch('dados.json?t=' + Date.now())
    .then(r => r.json())
    .then(d => console.log(d));
```

---

## 🐛 Troubleshooting Express

| Problema | Solução |
|----------|---------|
| Mobile não atualiza | Limpar cache Safari/Chrome |
| Script Python erro | `python -m json.tool dados.json` |
| Deploy falha | `vercel logs` |
| 404 dados.json | Verificar se está na raiz |

---

## 📚 Documentação Completa

- **SINCRONIZACAO.md** - Explicação técnica completa
- **DEPLOY_VERCEL.md** - Guia de deploy na Vercel
- **SECURITY_REPORT.md** - Sistema de segurança

---

## ✅ Checklist Diário

Ao atualizar dados:

- [ ] Executar `python admin_dados.py`
- [ ] Fazer alterações necessárias
- [ ] Commit: `git add dados.json && git commit -m "📊 update"`
- [ ] Push: `git push origin main`
- [ ] Aguardar 1 minuto
- [ ] Testar no mobile

**Tempo total**: < 2 minutos

---

## 🎯 Estrutura de Dados

### Serviços
```javascript
{
  "id": "servico-1",
  "titulo": "Maquilhagem de Noiva",
  "preco": 150.00,
  "disponivel": true
}
```

### Workshops
```javascript
{
  "id": "workshop-1",
  "titulo": "Workshop Básica",
  "preco": 80.00,
  "vagas": 10
}
```

### Produtos
```javascript
{
  "id": "produto-1",
  "nome": "Base HD",
  "preco": 45.00,
  "stock": 15
}
```

---

## 💡 Dicas

1. **Atualizar múltiplos campos**: `preco=200 duracao="3 horas" disponivel=true`
2. **Backup antes de editar**: `cp dados.json dados.json.bak`
3. **Validar JSON**: `python -m json.tool dados.json`
4. **Ver deploy ao vivo**: https://vercel.com/dashboard

---

**Leia a documentação completa em SINCRONIZACAO.md**
