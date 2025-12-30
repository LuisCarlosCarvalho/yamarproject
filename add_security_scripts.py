import os
import re

# Diretório do projeto
project_dir = r'c:\Users\LUIS\Documents\GitHub\yamarproject'

# Arquivos HTML a processar (exceto admin.html e index.html que já foram atualizados)
html_files = [
    'produtos.html',
    'produto.html',
    'post.html',
    'portfolio.html',
    'eventos.html',
    'evento.html',
    'sobre.html',
    'servicos.html',
    'servico.html',
    'contacto.html',
    'conta.html',
    'carrinho.html',
    'blog.html',
    'workshop.html',
    'workshops.html'
]

# Scripts de segurança para adicionar
security_scripts = '''    <!-- Sistema de Segurança -->
    <script src="js/security.js" defer></script>
    <script src="js/secure-render.js" defer></script>
</head>'''

# Processa cada arquivo
for filename in html_files:
    filepath = os.path.join(project_dir, filename)
    
    try:
        # Lê o arquivo
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verifica se já tem os scripts de segurança
        if 'js/security.js' in content:
            print(f'✓ {filename} - já tem scripts de segurança')
            continue
        
        # Encontra </head> e adiciona os scripts antes
        if '</head>' in content:
            content = content.replace('</head>', security_scripts)
            
            # Salva o arquivo
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f'✓ {filename} - scripts de segurança adicionados')
        else:
            print(f'✗ {filename} - tag </head> não encontrada')
    
    except Exception as e:
        print(f'✗ {filename} - erro: {e}')

print('\n✅ Processo concluído!')
