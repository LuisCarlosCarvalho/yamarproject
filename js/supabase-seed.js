/**
 * SUPABASE-SEED.JS - Popular banco de dados com dados do dados.json
 * Executa migração inicial dos dados locais para Supabase
 */

/**
 * Popula o banco de dados com dados do dados.json
 */
async function seedSupabaseDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');
    
    // Verificar se Supabase está disponível
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase não está disponível');
    }
    
    // Buscar dados do JSON
    const dados = await getDadosJSON(true);
    
    if (!dados) {
      throw new Error('Não foi possível carregar dados.json');
    }
    
    console.log('📦 Dados carregados:', {
      servicos: dados.servicos?.length || 0,
      produtos: dados.produtos?.length || 0,
      workshops: dados.workshops?.length || 0,
      eventos: dados.eventos?.length || 0,
      blog: dados.blog?.length || 0
    });
    
    let totalInseridos = 0;
    let totalErros = 0;
    
    // Inserir serviços
    if (dados.servicos && dados.servicos.length > 0) {
      console.log('📝 Inserindo serviços...');
      for (const servico of dados.servicos) {
        try {
          const exists = await getServicoById(servico.id);
          if (!exists) {
            await createServico(servico);
            totalInseridos++;
            console.log(`  ✓ Serviço inserido: ${servico.titulo}`);
          } else {
            console.log(`  ⚠ Serviço já existe: ${servico.titulo}`);
          }
        } catch (error) {
          totalErros++;
          console.error(`  ✗ Erro ao inserir serviço ${servico.id}:`, error);
        }
      }
    }
    
    // Inserir produtos
    if (dados.produtos && dados.produtos.length > 0) {
      console.log('📝 Inserindo produtos...');
      for (const produto of dados.produtos) {
        try {
          const exists = await getProdutoById(produto.id);
          if (!exists) {
            await createProduto(produto);
            totalInseridos++;
            console.log(`  ✓ Produto inserido: ${produto.nome}`);
          } else {
            console.log(`  ⚠ Produto já existe: ${produto.nome}`);
          }
        } catch (error) {
          totalErros++;
          console.error(`  ✗ Erro ao inserir produto ${produto.id}:`, error);
        }
      }
    }
    
    // Inserir workshops
    if (dados.workshops && dados.workshops.length > 0) {
      console.log('📝 Inserindo workshops...');
      for (const workshop of dados.workshops) {
        try {
          const client = getSupabaseClient();
          const { data: exists } = await client
            .from('workshops')
            .select('id')
            .eq('id', workshop.id)
            .single();
          
          if (!exists) {
            await createWorkshop(workshop);
            totalInseridos++;
            console.log(`  ✓ Workshop inserido: ${workshop.titulo}`);
          } else {
            console.log(`  ⚠ Workshop já existe: ${workshop.titulo}`);
          }
        } catch (error) {
          totalErros++;
          console.error(`  ✗ Erro ao inserir workshop ${workshop.id}:`, error);
        }
      }
    }
    
    // Inserir eventos
    if (dados.eventos && dados.eventos.length > 0) {
      console.log('📝 Inserindo eventos...');
      for (const evento of dados.eventos) {
        try {
          const client = getSupabaseClient();
          const { data: exists } = await client
            .from('eventos')
            .select('id')
            .eq('id', evento.id)
            .single();
          
          if (!exists) {
            await createEvento(evento);
            totalInseridos++;
            console.log(`  ✓ Evento inserido: ${evento.titulo}`);
          } else {
            console.log(`  ⚠ Evento já existe: ${evento.titulo}`);
          }
        } catch (error) {
          totalErros++;
          console.error(`  ✗ Erro ao inserir evento ${evento.id}:`, error);
        }
      }
    }
    
    // Inserir posts do blog
    if (dados.blog && dados.blog.length > 0) {
      console.log('📝 Inserindo posts...');
      for (const post of dados.blog) {
        try {
          const exists = await getPostById(post.id);
          if (!exists) {
            await createPost(post);
            totalInseridos++;
            console.log(`  ✓ Post inserido: ${post.titulo}`);
          } else {
            console.log(`  ⚠ Post já existe: ${post.titulo}`);
          }
        } catch (error) {
          totalErros++;
          console.error(`  ✗ Erro ao inserir post ${post.id}:`, error);
        }
      }
    }
    
    // Inserir configurações
    if (dados.site) {
      console.log('📝 Inserindo configurações...');
      try {
        const client = getSupabaseClient();
        await client
          .from('configuracoes')
          .upsert([
            { chave: 'site_info', valor: dados.site, descricao: 'Informações do site' }
          ]);
        console.log('  ✓ Configurações inseridas');
      } catch (error) {
        console.error('  ✗ Erro ao inserir configurações:', error);
      }
    }
    
    console.log('\n✅ SEED CONCLUÍDO');
    console.log(`   📊 Total inseridos: ${totalInseridos}`);
    console.log(`   ⚠️  Total erros: ${totalErros}`);
    
    return {
      success: true,
      inseridos: totalInseridos,
      erros: totalErros
    };
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verifica status da sincronização
 */
async function checkSyncStatus() {
  try {
    const client = getSupabaseClient();
    
    const servicos = await getAllServicos();
    const produtos = await getAllProdutos();
    const workshops = await getAllWorkshops();
    const eventos = await getAllEventos();
    const posts = await getAllPosts();
    
    console.log('📊 STATUS DO BANCO DE DADOS:');
    console.log(`   Serviços: ${servicos.length}`);
    console.log(`   Produtos: ${produtos.length}`);
    console.log(`   Workshops: ${workshops.length}`);
    console.log(`   Eventos: ${eventos.length}`);
    console.log(`   Posts: ${posts.length}`);
    
    return {
      servicos: servicos.length,
      produtos: produtos.length,
      workshops: workshops.length,
      eventos: eventos.length,
      posts: posts.length
    };
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return null;
  }
}

/**
 * Limpa todos os dados do banco (cuidado!)
 */
async function clearSupabaseData() {
  const confirmacao = confirm('⚠️ ATENÇÃO: Isso irá deletar TODOS os dados do banco. Tem certeza?');
  
  if (!confirmacao) {
    console.log('❌ Operação cancelada');
    return false;
  }
  
  try {
    const client = getSupabaseClient();
    
    console.log('🗑️ Limpando banco de dados...');
    
    // Deletar na ordem correta (respeitando foreign keys)
    await client.from('marcacoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await client.from('pedidos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await client.from('posts').delete().neq('id', 'xxx');
    await client.from('eventos').delete().neq('id', 'xxx');
    await client.from('workshops').delete().neq('id', 'xxx');
    await client.from('produtos').delete().neq('id', 'xxx');
    await client.from('servicos').delete().neq('id', 'xxx');
    
    console.log('✅ Banco de dados limpo');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
    return false;
  }
}

// Expor funções no console para facilitar uso
window.supabaseSeed = {
  seed: seedSupabaseDatabase,
  checkStatus: checkSyncStatus,
  clear: clearSupabaseData
};

console.log('🌱 Supabase Seed carregado. Use:');
console.log('   - supabaseSeed.seed() para popular banco');
console.log('   - supabaseSeed.checkStatus() para ver status');
console.log('   - supabaseSeed.clear() para limpar dados');
