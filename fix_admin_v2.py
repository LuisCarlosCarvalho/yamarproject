import os

def fix_admin_v2(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Mapeamento EXATO baseado na leitura do arquivo (view_file output)
        replacements = {
            "› ï¸  Produtos": "🛍️ Produtos",     # Note os espaços!
            "“  Blog": "📝 Blog",                 # Note os dois espaços!
            "âœ‰ï¸  Mensagens": "✉️ Mensagens",   # Note o espaço!
            "▼ï¸  Gestão": "🖼️ Gestão",            # Note o espaço!
            "âš™ï¸  Definições": "⚙️ Definições"   # Note o espaço!
        }
        
        fixed_content = content
        for bad, good in replacements.items():
            fixed_content = fixed_content.replace(bad, good)
            
        # Tentativa de fallback sem o texto junto, caso haja variação
        # Mas com cuidado para não substituir coisas erradas
        fallback_replacements = {
            "› ï¸ ": "🛍️",
            "“ ": "📝",  # Arriscado se "“ " for quote... mas no menu admin deve ser OK
            "âœ‰ï¸ ": "✉️",
            "▼ï¸ ": "🖼️",
            "âš™ï¸ ": "⚙️"
        }
        
        if content == fixed_content: # Só tenta fallback se a primeira passagem não mudou tudo
             for bad, good in fallback_replacements.items():
                 fixed_content = fixed_content.replace(bad, good)

        if content != fixed_content:
            print(f"Fixing admin emoji artifacts v2 in {file_path}...")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        else:
            print(f"No changes for {file_path} (v2)")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    path = r"c:\Users\LUIS\Desktop\testett\yamarproject-main\admin.html"
    if os.path.exists(path):
        fix_admin_v2(path)

if __name__ == "__main__":
    main()
