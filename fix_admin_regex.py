import re

def fix_admin_regex(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Mapeamento data-section -> (Emoji, Texto)
        sections = {
            "dashboard": ("📊", "Dashboard"),
            "bookings": ("📅", "Marcações"),
            "orders": ("📦", "Encomendas"),
            "services": ("💄", "Serviços"),
            "workshops": ("🎓", "Workshops"),
            "products": ("🛍️", "Produtos"),
            "posts": ("📝", "Blog"),
            "events": ("🎉", "Eventos"),
            "users": ("👥", "Utilizadores"),
            "messages": ("✉️", "Mensagens"),
            "images": ("🖼️", "Gestão de Imagens"),
            "reports": ("📈", "Relatórios"),
            "settings": ("⚙️", "Definições")
        }
        
        fixed_content = content
        
        # Para cada seção, substitui o conteúdo da tag <a>
        # Regex: data-section="KEYS".*?>CONTENT</a>
        for section, (emoji, text) in sections.items():
            pattern = fr'(data-section="{section}"[^>]*>).*?(</a>)'
            replacement = fr'\1{emoji} {text}\2'
            
            # Usamos flags=re.DOTALL se precisar match newline, mas aqui é linha a linha geralmente
            fixed_content = re.sub(pattern, replacement, fixed_content, flags=re.DOTALL)

        if content != fixed_content:
            print(f"Fixing admin menu with Regex in {file_path}...")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        else:
            print(f"No regex matches/changes for {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    path = r"c:\Users\LUIS\Desktop\testett\yamarproject-main\admin.html"
    fix_admin_regex(path)

if __name__ == "__main__":
    main()
