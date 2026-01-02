# Instruções para popular o Supabase (seed)

Este documento descreve duas formas seguras de popular o banco:

A) Usando Node (recomendado para inicialização/produção)
B) Usando o navegador (apenas para testes; pode ser bloqueado por RLS)

---

A) Rodar seed via Node (usa `service_role` key)

Passos:
1. Não exponha sua `service_role` key no browser. Defina-a localmente como variável de ambiente.

PowerShell (temporário para a sessão):
```powershell
$env:SUPABASE_URL = 'https://qzjzlpilmptoojuguqas.supabase.co'
$env:SUPABASE_SERVICE_ROLE = '<sua_service_role_key_aqui>'
npm install
npm run seed:supabase
```

Bash (Linux/macOS):
```bash
export SUPABASE_URL='https://qzjzlpilmptoojuguqas.supabase.co'
export SUPABASE_SERVICE_ROLE='<sua_service_role_key_aqui>'
npm install
npm run seed:supabase
```

- O script `tools/run-seed.js` lê `dados.json` e faz `upsert` nas tabelas.
- Saída final mostrará `Inseridos` e `Erros`.

Segurança:
- Use `service_role` apenas em servidor ou ambiente local protegido.
- Não comite chaves no repositório.

---

B) Rodar seed via navegador (usa a `anon/public` key — pode falhar por RLS)

Passos:
1. Sirva o projeto via HTTP (para evitar problemas CORS):
```powershell
# na raiz do projeto
py -3 -m http.server 8000
# ou
npx http-server . -p 8000
```
2. Abra: `http://localhost:8000/supabase-setup.html`
3. Abra DevTools → Console (F12)
4. Verifique conexão:
```javascript
await checkConnection();
```
(ou, se seu console não suportar top-level await, use IIFE:)
```javascript
(async () => { await checkConnection(); })();
```
5. Rodar seed:
```javascript
(async () => {
  const resultado = await supabaseSeed.seed();
  console.log('Resultado do seed:', resultado);
})();
```
6. Verificar status:
```javascript
(async () => { const st = await supabaseSeed.checkStatus(); console.log(st); })();
```

Notas importantes:
- Se o SQL schema não foi executado no Dashboard, crie as tabelas primeiro (use `supabase-schema.sql`).
- O `supabase-setup.html` agora loga objetos de erro completos. Se houver erros, copie-os (ou faça screenshot) e compartilhe para diagnóstico.
- Se RLS estiver habilitado sem políticas de INSERT para `anon`, o seed via navegador será bloqueado. Use o método A (Node) nesses casos.

---

Se quiser, eu posso:
- Gerar um `.env` local (não comitado) e instruções extras.
- Ajudar a executar comandos no seu terminal (você roda as chaves localmente).
- Ajudar a criar/ajustar policies RLS para permitir o seed via `anon` (temporário).
