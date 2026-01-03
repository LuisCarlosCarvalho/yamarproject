/**
 * SUPABASE-CONFIG.JS - Configuração e inicialização do Supabase
 * Gerencia conexão com banco de dados Supabase
 */

// Configurações do Supabase
const SUPABASE_CONFIG = {
  url: 'https://qzjzlpilmptoojuguqas.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6anpscGlsbXB0b29qdWd1cWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDQ2NjIsImV4cCI6MjA4MjkyMDY2Mn0.z2Mv4Nzvyel0xEZrcCxmoqBwpYHmoTPTRLlJ6Ja_ujI',
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
