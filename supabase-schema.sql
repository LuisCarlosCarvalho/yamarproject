-- ============================================
-- SCHEMA DO BANCO DE DADOS SUPABASE
-- Yamar Makeup Artist Project
-- ============================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: users
-- Gerencia usuários do sistema
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_login TIMESTAMP WITH TIME ZONE,
  ativo BOOLEAN DEFAULT true
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- TABELA: servicos
-- Serviços de maquilhagem oferecidos
-- ============================================
CREATE TABLE IF NOT EXISTS servicos (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  duracao TEXT,
  categoria TEXT,
  imagem TEXT,
  destaque BOOLEAN DEFAULT false,
  disponivel BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para servicos
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_destaque ON servicos(destaque);
CREATE INDEX IF NOT EXISTS idx_servicos_disponivel ON servicos(disponivel);

-- ============================================
-- TABELA: produtos
-- Produtos à venda
-- ============================================
CREATE TABLE IF NOT EXISTS produtos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  marca TEXT,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  preco_original DECIMAL(10,2),
  categoria TEXT,
  imagem TEXT,
  stock INTEGER DEFAULT 0,
  disponivel BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false,
  tags TEXT[],
  avaliacoes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_disponivel ON produtos(disponivel);
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produtos_stock ON produtos(stock);

-- ============================================
-- TABELA: workshops
-- Workshops e cursos oferecidos
-- ============================================
CREATE TABLE IF NOT EXISTS workshops (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao TEXT,
  vagas INTEGER,
  vagas_ocupadas INTEGER DEFAULT 0,
  nivel TEXT,
  proxima_data DATE,
  imagem TEXT,
  inclui TEXT[],
  disponivel BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para workshops
CREATE INDEX IF NOT EXISTS idx_workshops_proxima_data ON workshops(proxima_data);
CREATE INDEX IF NOT EXISTS idx_workshops_disponivel ON workshops(disponivel);
CREATE INDEX IF NOT EXISTS idx_workshops_nivel ON workshops(nivel);

-- ============================================
-- TABELA: eventos
-- Eventos e portfolio
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT,
  data DATE,
  local TEXT,
  imagem TEXT,
  galeria TEXT[],
  destaque BOOLEAN DEFAULT false,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos(tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_destaque ON eventos(destaque);
CREATE INDEX IF NOT EXISTS idx_eventos_publicado ON eventos(publicado);

-- ============================================
-- TABELA: posts
-- Posts do blog
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  conteudo TEXT,
  autor TEXT,
  categoria TEXT,
  tags TEXT[],
  imagem_capa TEXT,
  imagens TEXT[],
  publicado BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Índices para posts
CREATE INDEX IF NOT EXISTS idx_posts_categoria ON posts(categoria);
CREATE INDEX IF NOT EXISTS idx_posts_publicado ON posts(publicado);
CREATE INDEX IF NOT EXISTS idx_posts_destaque ON posts(destaque);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- ============================================
-- TABELA: marcacoes
-- Marcações e reservas de serviços
-- ============================================
CREATE TABLE IF NOT EXISTS marcacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  servico_id TEXT REFERENCES servicos(id),
  workshop_id TEXT REFERENCES workshops(id),
  nome_cliente TEXT NOT NULL,
  email_cliente TEXT NOT NULL,
  telefone_cliente TEXT,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'concluida')),
  observacoes TEXT,
  valor DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para marcacoes
CREATE INDEX IF NOT EXISTS idx_marcacoes_user_id ON marcacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_marcacoes_servico_id ON marcacoes(servico_id);
CREATE INDEX IF NOT EXISTS idx_marcacoes_workshop_id ON marcacoes(workshop_id);
CREATE INDEX IF NOT EXISTS idx_marcacoes_data ON marcacoes(data);
CREATE INDEX IF NOT EXISTS idx_marcacoes_status ON marcacoes(status);

-- ============================================
-- TABELA: pedidos
-- Pedidos de produtos
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  itens JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  taxa_entrega DECIMAL(10,2) DEFAULT 0,
  desconto DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'enviado', 'entregue', 'cancelado')),
  endereco_entrega JSONB,
  metodo_pagamento TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_user_id ON pedidos(user_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);

-- ============================================
-- TABELA: configuracoes
-- Configurações do site
-- ============================================
CREATE TABLE IF NOT EXISTS configuracoes (
  chave TEXT PRIMARY KEY,
  valor JSONB NOT NULL,
  descricao TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marcacoes_updated_at BEFORE UPDATE ON marcacoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (dados públicos)
CREATE POLICY "Servicos são públicos" ON servicos FOR SELECT USING (true);
CREATE POLICY "Produtos são públicos" ON produtos FOR SELECT USING (true);
CREATE POLICY "Workshops são públicos" ON workshops FOR SELECT USING (true);
CREATE POLICY "Eventos são públicos" ON eventos FOR SELECT USING (publicado = true);
CREATE POLICY "Posts publicados são públicos" ON posts FOR SELECT USING (publicado = true);

-- Políticas para marcacoes (usuários só veem suas próprias)
CREATE POLICY "Usuários veem suas marcações" ON marcacoes 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários criam suas marcações" ON marcacoes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para pedidos (usuários só veem seus próprios)
CREATE POLICY "Usuários veem seus pedidos" ON pedidos 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários criam seus pedidos" ON pedidos 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Inserir configurações básicas
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('site_info', '{"nome": "Yemar Makeup Artist", "tagline": "Maquilhadora Profissional", "email": "yemar@makeup.com", "telefone": "+351 912 345 678"}', 'Informações básicas do site'),
  ('redes_sociais', '{"instagram": "https://instagram.com/yemarmakeup", "facebook": "https://facebook.com/yemarmakeup", "whatsapp": "+351912345678"}', 'Links das redes sociais')
ON CONFLICT (chave) DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Schema criado com sucesso!';
  RAISE NOTICE '📋 Tabelas: users, servicos, produtos, workshops, eventos, posts, marcacoes, pedidos, configuracoes';
  RAISE NOTICE '🔒 RLS habilitado em todas as tabelas';
END $$;
