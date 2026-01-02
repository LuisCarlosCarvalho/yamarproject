/**
 * SUPABASE-CONFIG.JS - Configuração e inicialização do Supabase
 * Gerencia conexão com banco de dados Supabase
 */

// Configurações do Supabase
const SUPABASE_CONFIG = {
  url: 'https://qzjzlpilmptoojuguqas.supabase.co',
  key: 'sbp_7a9ad3f79c7feadbc5e163ff1bba998de10cd16d',
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'yamarproject-web'
      }
    }
  }
};

// Cliente Supabase (será inicializado)
let supabaseClient = null;

/**
 * Inicializa o cliente Supabase
 */
function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('❌ Biblioteca Supabase não carregada. Adicione o script no HTML.');
    return null;
  }

  try {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key, SUPABASE_CONFIG.options);
    console.log('✅ Supabase inicializado com sucesso');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
    return null;
  }
}

/**
 * Obtém o cliente Supabase
 */
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = initSupabase();
  }
  return supabaseClient;
}

/**
 * Verifica se o Supabase está disponível
 */
function isSupabaseAvailable() {
  return supabaseClient !== null && typeof supabase !== 'undefined';
}

// Auto-inicialização quando o script carrega
if (typeof supabase !== 'undefined') {
  initSupabase();
}
