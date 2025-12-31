import os
import re

# Lista de arquivos HTML (exceto test-pwa.html)
html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'test-pwa.html']

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remover linha duplicada do PWA Install Script
    # Procurar por: <!-- PWA Install Script -->\n    <script src="/js/pwa-install.js"></script>
    pattern = r'\s*<!-- PWA Install Script -->\s*\n\s*<script src="/js/pwa-install\.js"></script>'
    
    if re.search(pattern, content):
        content = re.sub(pattern, '', content)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ {filename} - Script duplicado removido")
    else:
        print(f"- {filename} - Nenhuma duplicação encontrada")

print("\n✅ Processamento concluído!")
