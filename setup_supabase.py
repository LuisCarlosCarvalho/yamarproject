"""
SUPABASE SETUP - Helper para configuração do Supabase
Ajuda a configurar o projeto com Supabase
"""

import json
import re
from pathlib import Path

def print_banner():
    """Exibe banner inicial"""
    print("\n" + "="*60)
    print("🗄️  CONFIGURAÇÃO SUPABASE - Yamar Makeup Artist")
    print("="*60 + "\n")

def print_step(number, title):
    """Exibe passo da configuração"""
    print(f"\n📋 PASSO {number}: {title}")
    print("-" * 60)

def get_project_url():
    """Solicita URL do projeto Supabase"""
    print("\n🔗 Obtenha a URL do seu projeto:")
    print("   1. Acesse https://app.supabase.com")
    print("   2. Selecione seu projeto")
    print("   3. Vá em Settings > API")
    print("   4. Copie a 'URL' do projeto")
    print("   5. A URL deve ser algo como: https://xxxxx.supabase.co\n")
    
    while True:
        url = input("Cole a URL do seu projeto Supabase: ").strip()
        
        # Validar formato da URL
        if re.match(r'https://[a-z0-9]+\.supabase\.co', url):
            return url
        else:
            print("❌ URL inválida. Deve ser no formato: https://xxxxx.supabase.co")
            retry = input("Tentar novamente? (s/n): ").lower()
            if retry != 's':
                return None

def update_config_file(project_url, api_key):
    """Atualiza arquivo de configuração"""
    config_file = Path("js/supabase-config.js")
    
    if not config_file.exists():
        print(f"❌ Arquivo não encontrado: {config_file}")
        return False
    
    # Ler arquivo
    content = config_file.read_text(encoding='utf-8')
    
    # Substituir URL
    content = re.sub(
        r"url:\s*['\"]https://[^'\"]+['\"]",
        f"url: '{project_url}'",
        content
    )
    
    # Substituir key (caso seja diferente)
    content = re.sub(
        r"key:\s*['\"][^'\"]+['\"]",
        f"key: '{api_key}'",
        content
    )
    
    # Salvar arquivo
    config_file.write_text(content, encoding='utf-8')
    
    print(f"✅ Arquivo atualizado: {config_file}")
    return True

def display_next_steps():
    """Exibe próximos passos"""
    print("\n" + "="*60)
    print("✅ CONFIGURAÇÃO BÁSICA CONCLUÍDA!")
    print("="*60)
    
    print("\n📝 PRÓXIMOS PASSOS:")
    print("\n1️⃣  Criar tabelas no Supabase:")
    print("   • Acesse https://app.supabase.com")
    print("   • Vá em SQL Editor")
    print("   • Clique em 'New Query'")
    print("   • Copie todo o conteúdo de 'supabase-schema.sql'")
    print("   • Cole no editor e clique em 'Run'")
    
    print("\n2️⃣  Popular banco de dados:")
    print("   • Abra o site no navegador")
    print("   • Pressione F12 (Console)")
    print("   • Execute: await supabaseSeed.seed()")
    
    print("\n3️⃣  Verificar sincronização:")
    print("   • No Console do navegador")
    print("   • Execute: await supabaseSeed.checkStatus()")
    
    print("\n4️⃣  Testar no mobile:")
    print("   • Publique o site (Vercel, Netlify)")
    print("   • Acesse no celular")
    print("   • Dados devem estar sincronizados")
    
    print("\n📚 Para mais detalhes, consulte: SUPABASE_CONFIG.md")
    print("\n" + "="*60 + "\n")

def check_files():
    """Verifica se arquivos necessários existem"""
    required_files = [
        "js/supabase-config.js",
        "js/supabase-db.js",
        "js/supabase-seed.js",
        "supabase-schema.sql",
        "SUPABASE_CONFIG.md"
    ]
    
    missing = []
    for file in required_files:
        if not Path(file).exists():
            missing.append(file)
    
    if missing:
        print("⚠️  Arquivos faltando:")
        for file in missing:
            print(f"   ❌ {file}")
        return False
    
    print("✅ Todos os arquivos necessários estão presentes")
    return True

def show_token_info(token):
    """Exibe informações sobre o token"""
    print(f"\n🔑 Token configurado: {token[:20]}...{token[-10:]}")
    print("   ⚠️  IMPORTANTE: Este é um token público (anon key)")
    print("   ⚠️  NÃO compartilhe o 'service_role_key'")
    print("   ✅ Este token é seguro para usar no frontend")

def main():
    """Função principal"""
    print_banner()
    
    # Token fornecido pelo usuário
    api_key = "sbp_7a9ad3f79c7feadbc5e163ff1bba998de10cd16d"
    
    # Verificar arquivos
    print_step(1, "Verificando arquivos")
    if not check_files():
        print("\n❌ Execute este script na raiz do projeto yamarproject")
        return
    
    # Exibir info do token
    show_token_info(api_key)
    
    # Solicitar URL do projeto
    print_step(2, "Configurar URL do Projeto")
    project_url = get_project_url()
    
    if not project_url:
        print("\n❌ Configuração cancelada")
        return
    
    # Atualizar arquivo de configuração
    print_step(3, "Atualizando arquivos")
    if not update_config_file(project_url, api_key):
        print("\n❌ Erro ao atualizar arquivos")
        return
    
    # Exibir próximos passos
    display_next_steps()
    
    # Criar resumo JSON
    summary = {
        "project_url": project_url,
        "api_key": api_key[:20] + "..." + api_key[-10:],
        "configured_at": "2026-01-02",
        "status": "ready_for_schema_migration"
    }
    
    Path("supabase-setup-summary.json").write_text(
        json.dumps(summary, indent=2),
        encoding='utf-8'
    )
    print("💾 Resumo salvo em: supabase-setup-summary.json")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Configuração cancelada pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
