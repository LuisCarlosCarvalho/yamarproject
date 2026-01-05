/**
 * SUPABASE-DB.JS - Operações de banco de dados com Supabase
 * CRUD operations para todas as tabelas do projeto
 */

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Verifica se o cliente está disponível
 */
function checkSupabaseClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Cliente Supabase não está disponível');
  }
  return client;
}

// ============================================
// SITE SETTINGS SYNC
// ============================================

/**
 * Busca as configurações do site na tabela `configuracoes` (chave 'site_settings' ou 'site_info')
 */
async function fetchSiteSettingsFromSupabase() {
  try {
    const client = checkSupabaseClient();

    // Primeiro tenta chave 'site_settings'
    let { data, error } = await client
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'site_settings')
      .limit(1)
      .single();

    if (error || !data) {
      // fallback para 'site_info'
      const res = await client
        .from('configuracoes')
        .select('valor')
        .eq('chave', 'site_info')
        .limit(1)
        .single();
      if (res.error || !res.data) return null;
      return res.data.valor || null;
    }

    return data.valor || null;
  } catch (err) {
    handleSupabaseError(err, 'fetchSiteSettingsFromSupabase');
    return null;
  }
}

/**
 * Upsert das configurações do site na tabela `configuracoes` com chave 'site_settings'
 * @param {Object} settings
 */
async function upsertSiteSettingsToSupabase(settings) {
  try {
    const client = checkSupabaseClient();
    const payload = { chave: 'site_settings', valor: settings };
    const { data, error } = await client
      .from('configuracoes')
      .upsert(payload, { onConflict: 'chave' })
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Site settings upserted to Supabase');
    return data;
  } catch (err) {
    handleSupabaseError(err, 'upsertSiteSettingsToSupabase');
    return null;
  }
}

/**
 * Handler genérico de erros
 */
function handleSupabaseError(error, context = '') {
  console.error(`❌ Erro Supabase ${context}:`, error);
  throw error;
}

// ============================================
// SERVIÇOS
// ============================================

/**
 * Busca todos os serviços
 */
async function getAllServicos() {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('servicos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'getAllServicos');
    return [];
  }
}

/**
 * Busca serviço por ID
 */
async function getServicoById(id) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('servicos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, `getServicoById(${id})`);
    return null;
  }
}

/**
 * Cria novo serviço
 */
async function createServico(servico) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('servicos')
      .insert([servico])
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Serviço criado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, 'createServico');
    return null;
  }
}

/**
 * Atualiza serviço
 */
async function updateServico(id, updates) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('servicos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Serviço atualizado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, `updateServico(${id})`);
    return null;
  }
}

/**
 * Deleta serviço
 */
async function deleteServico(id) {
  try {
    const client = checkSupabaseClient();
    const { error } = await client
      .from('servicos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    console.log('✅ Serviço deletado:', id);
    return true;
  } catch (error) {
    handleSupabaseError(error, `deleteServico(${id})`);
    return false;
  }
}

// ============================================
// PRODUTOS
// ============================================

/**
 * Busca todos os produtos
 */
async function getAllProdutos() {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('produtos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'getAllProdutos');
    return [];
  }
}

/**
 * Busca produto por ID
 */
async function getProdutoById(id) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, `getProdutoById(${id})`);
    return null;
  }
}

/**
 * Cria novo produto
 */
async function createProduto(produto) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('produtos')
      .insert([produto])
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Produto criado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, 'createProduto');
    return null;
  }
}

/**
 * Atualiza produto
 */
async function updateProduto(id, updates) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('produtos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Produto atualizado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, `updateProduto(${id})`);
    return null;
  }
}

/**
 * Deleta produto
 */
async function deleteProduto(id) {
  try {
    const client = checkSupabaseClient();
    const { error } = await client
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    console.log('✅ Produto deletado:', id);
    return true;
  } catch (error) {
    handleSupabaseError(error, `deleteProduto(${id})`);
    return false;
  }
}

// ============================================
// WORKSHOPS
// ============================================

/**
 * Busca todos os workshops
 */
async function getAllWorkshops() {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('workshops')
      .select('*')
      .order('proxima_data', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'getAllWorkshops');
    return [];
  }
}

/**
 * Cria novo workshop
 */
async function createWorkshop(workshop) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('workshops')
      .insert([workshop])
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Workshop criado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, 'createWorkshop');
    return null;
  }
}

/**
 * Atualiza workshop
 */
async function updateWorkshop(id, updates) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('workshops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Workshop atualizado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, `updateWorkshop(${id})`);
    return null;
  }
}

// ============================================
// EVENTOS
// ============================================

/**
 * Busca todos os eventos
 */
async function getAllEventos() {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('eventos')
      .select('*')
      .order('data', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'getAllEventos');
    return [];
  }
}

/**
 * Cria novo evento
 */
async function createEvento(evento) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('eventos')
      .insert([evento])
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Evento criado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, 'createEvento');
    return null;
  }
}

/**
 * Atualiza evento
 */
async function updateEvento(id, updates) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('eventos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Evento atualizado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, `updateEvento(${id})`);
    return null;
  }
}

// ============================================
// POSTS DO BLOG
// ============================================

/**
 * Busca todos os posts
 */
async function getAllPosts() {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'getAllPosts');
    return [];
  }
}

/**
 * Busca post por ID
 */
async function getPostById(id) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, `getPostById(${id})`);
    return null;
  }
}

/**
 * Cria novo post
 */
async function createPost(post) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('posts')
      .insert([post])
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Post criado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, 'createPost');
    return null;
  }
}

/**
 * Atualiza post
 */
async function updatePost(id, updates) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Post atualizado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, `updatePost(${id})`);
    return null;
  }
}

// ============================================
// MARCAÇÕES/RESERVAS
// ============================================

/**
 * Busca todas as marcações
 */
async function getAllMarcacoes() {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('marcacoes')
      .select('*')
      .order('data', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'getAllMarcacoes');
    return [];
  }
}

/**
 * Busca marcações por usuário
 */
async function getMarcacoesByUser(userId) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('marcacoes')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, `getMarcacoesByUser(${userId})`);
    return [];
  }
}

/**
 * Cria nova marcação
 */
async function createMarcacao(marcacao) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('marcacoes')
      .insert([marcacao])
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Marcação criada:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, 'createMarcacao');
    return null;
  }
}

/**
 * Atualiza status da marcação
 */
async function updateMarcacaoStatus(id, status) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('marcacoes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Status da marcação atualizado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, `updateMarcacaoStatus(${id})`);
    return null;
  }
}

// ============================================
// USUÁRIOS
// ============================================

/**
 * Busca usuário por email
 */
async function getUserByEmail(email) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  } catch (error) {
    handleSupabaseError(error, `getUserByEmail(${email})`);
    return null;
  }
}

/**
 * Cria novo usuário
 */
async function createUser(user) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Usuário criado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, 'createUser');
    return null;
  }
}

/**
 * Atualiza usuário
 */
async function updateUser(id, updates) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Usuário atualizado:', data);
    return data;
  } catch (error) {
    handleSupabaseError(error, `updateUser(${id})`);
    return null;
  }
}

// ============================================
// SINCRONIZAÇÃO
// ============================================

/**
 * Sincroniza dados locais com Supabase
 */
async function syncLocalToSupabase() {
  try {
    console.log('🔄 Iniciando sincronização local → Supabase...');
    
    // Buscar dados do localStorage
    const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const workshops = JSON.parse(localStorage.getItem('workshops') || '[]');
    
    let synced = 0;
    
    // Sincronizar serviços
    for (const servico of servicos) {
      const exists = await getServicoById(servico.id);
      if (!exists) {
        await createServico(servico);
        synced++;
      }
    }
    
    // Sincronizar produtos
    for (const produto of produtos) {
      const exists = await getProdutoById(produto.id);
      if (!exists) {
        await createProduto(produto);
        synced++;
      }
    }
    
    // Sincronizar workshops
    for (const workshop of workshops) {
      const exists = await client
        .from('workshops')
        .select('id')
        .eq('id', workshop.id)
        .single();
      
      if (!exists.data) {
        await createWorkshop(workshop);
        synced++;
      }
    }
    
    console.log(`✅ Sincronização concluída: ${synced} registros`);
    return true;
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
    return false;
  }
}

/**
 * Sincroniza dados do Supabase para local (cache)
 */
async function syncSupabaseToLocal() {
  try {
    console.log('🔄 Sincronizando Supabase → Local...');
    
    const servicos = await getAllServicos();
    const produtos = await getAllProdutos();
    const workshops = await getAllWorkshops();
    const eventos = await getAllEventos();
    const posts = await getAllPosts();
    
    // Atualizar cache local
    localStorage.setItem('servicos_cache', JSON.stringify(servicos));
    localStorage.setItem('produtos_cache', JSON.stringify(produtos));
    localStorage.setItem('workshops_cache', JSON.stringify(workshops));
    localStorage.setItem('eventos_cache', JSON.stringify(eventos));
    localStorage.setItem('posts_cache', JSON.stringify(posts));
    localStorage.setItem('last_sync', new Date().toISOString());
    
    console.log('✅ Cache local atualizado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar cache:', error);
    return false;
  }
}
