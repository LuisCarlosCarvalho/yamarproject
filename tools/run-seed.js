/* tools/run-seed.js
 * Script Node para popular o Supabase usando a service_role key (executar no servidor ou localmente).
 * Uso:
 *   - export SUPABASE_URL="https://..." (Windows: setx SUPABASE_URL "...")
 *   - export SUPABASE_SERVICE_ROLE="<service_role_key>"
 *   - npm install
 *   - npm run seed:supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Erro: defina as variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE antes de executar.');
  console.error('Exemplo (Windows PowerShell):');
  console.error('  $env:SUPABASE_URL = "https://xyz.supabase.co"');
  console.error('  $env:SUPABASE_SERVICE_ROLE = "<service_role_key>"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false }
});

async function run() {
  try {
    const dadosPath = path.resolve(__dirname, '..', 'dados.json');
    if (!fs.existsSync(dadosPath)) {
      console.error('Arquivo dados.json não encontrado em:', dadosPath);
      process.exit(1);
    }

    const raw = fs.readFileSync(dadosPath, 'utf8');
    const dados = JSON.parse(raw);

    let inserted = 0;
    let errors = 0;

    async function upsertTable(table, rows) {
      if (!rows || rows.length === 0) return { ok: 0, err: 0 };
      try {
        // Upsert em lote
        const { data, error } = await supabase
          .from(table)
          .upsert(rows, { onConflict: 'id' })
          .select();

        if (error) {
          console.error(`Erro upsert ${table}:`, error);
          return { ok: 0, err: rows.length };
        }

        return { ok: (data && data.length) || 0, err: 0 };
      } catch (e) {
        console.error(`Exceção upsert ${table}:`, e);
        return { ok: 0, err: rows.length };
      }
    }

    // Servicos
    if (Array.isArray(dados.servicos) && dados.servicos.length > 0) {
      console.log('Inserindo servicos:', dados.servicos.length);
      const res = await upsertTable('servicos', dados.servicos.map(s => ({ ...s })));
      inserted += res.ok; errors += res.err;
    }

    // Produtos
    if (Array.isArray(dados.produtos) && dados.produtos.length > 0) {
      console.log('Inserindo produtos:', dados.produtos.length);
      const res = await upsertTable('produtos', dados.produtos.map(p => ({ ...p })));
      inserted += res.ok; errors += res.err;
    }

    // Workshops
    if (Array.isArray(dados.workshops) && dados.workshops.length > 0) {
      console.log('Inserindo workshops:', dados.workshops.length);
      const res = await upsertTable('workshops', dados.workshops.map(w => ({ ...w })));
      inserted += res.ok; errors += res.err;
    }

    // Eventos
    if (Array.isArray(dados.eventos) && dados.eventos.length > 0) {
      console.log('Inserindo eventos:', dados.eventos.length);
      const res = await upsertTable('eventos', dados.eventos.map(e => ({ ...e })));
      inserted += res.ok; errors += res.err;
    }

    // Posts (blog)
    if (Array.isArray(dados.blog) && dados.blog.length > 0) {
      console.log('Inserindo posts:', dados.blog.length);
      const res = await upsertTable('posts', dados.blog.map(p => ({ ...p })));
      inserted += res.ok; errors += res.err;
    }

    // Configuracoes
    if (dados.site) {
      try {
        console.log('Inserindo/atualizando configuracoes.site_info');
        const { data, error } = await supabase.from('configuracoes').upsert([
          { chave: 'site_info', valor: dados.site, descricao: 'Informações do site' }
        ]).select();
        if (error) {
          console.error('Erro ao upsert configuracoes:', error);
          errors++;
        } else {
          inserted += 1;
        }
      } catch (e) {
        console.error('Exceção ao inserir configuracoes:', e);
        errors++;
      }
    }

    console.log('\nResultado final:');
    console.log('  Inseridos:', inserted);
    console.log('  Erros:', errors);

    if (errors > 0) process.exit(2);
    process.exit(0);

  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}

run();
