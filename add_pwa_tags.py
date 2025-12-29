import os
import re

# Lista de arquivos HTML
html_files = [
    'index.html', 'servicos.html', 'servico.html', 'workshops.html', 
    'workshop.html', 'eventos.html', 'evento.html', 'produtos.html',
    'produto.html', 'blog.html', 'post.html', 'conta.html',
    'contacto.html', 'sobre.html', 'carrinho.html', 'admin.html',
    'portfolio.html'
]

# Tags PWA para adicionar no <head>
pwa_tags = '''    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#c9a227">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Yemar Makeup">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/assets/images/icon-192x192.png">'''

# Script PWA para adicionar antes do </body>
pwa_script = '''    <!-- PWA Install Script -->
    <script src="/js/pwa-install.js"></script>'''

def add_pwa_to_html(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verificar se já tem as tags PWA
        if 'manifest.json' in content:
            print(f'⊘ {filename} - já possui tags PWA')
            return False
        
        # Adicionar PWA meta tags após o último <link> ou <meta> no <head>
        # Procurar por </head> e adicionar antes
        if '</head>' in content:
            content = content.replace('</head>', f'{pwa_tags}\n</head>', 1)
        
        # Adicionar PWA script antes de </body>
        if '</body>' in content:
            content = content.replace('</body>', f'{pwa_script}\n</body>', 1)
        
        # Salvar arquivo
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'✓ {filename} - tags PWA adicionadas')
        return True
        
    except Exception as e:
        print(f'✗ {filename} - erro: {e}')
        return False

# Processar todos os arquivos
print('Adicionando tags PWA aos arquivos HTML...\n')
success_count = 0

for html_file in html_files:
    if os.path.exists(html_file):
        if add_pwa_to_html(html_file):
            success_count += 1
    else:
        print(f'⊘ {html_file} - arquivo não encontrado')

print(f'\n✓ Processo concluído! {success_count} arquivos atualizados.')
