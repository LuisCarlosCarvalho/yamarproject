import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'test-pwa.html']

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Substituir images/logo.png por assets/images/logo.png
    if 'images/logo.png' in content:
        content = content.replace('images/logo.png', 'assets/images/logo.png')
        modified = True
    
    # Substituir images/logo_name.png por assets/images/logo.png
    if 'images/logo_name.png' in content:
        content = content.replace('images/logo_name.png', 'assets/images/logo.png')
        modified = True
    
    if modified:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {filename} - Caminhos de imagem corrigidos")
    else:
        print(f"- {filename} - OK")

print("\n✅ Caminhos de imagem padronizados!")
