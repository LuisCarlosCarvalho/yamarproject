# -*- coding: utf-8 -*-
import os
import codecs

# Mapeamento de correções
replacements = {
    # Navegação e títulos
    'tend�ncias': 'tendências',
    'In�cio': 'Início',
    'Servi�os': 'Serviços',
    'SERVI�OS': 'SERVIÇOS',
    'IN�CIO': 'INÍCIO',
    'PORTF�LIO': 'PORTFÓLIO',
    'Navega��o': 'Navegação',
    'Seguran�a': 'Segurança',
    
    # Formulários e ações
    'Informa��es': 'Informações',
    'Marca��o': 'Marcação',
    'Or�amento': 'Orçamento',
    '�ltimas': 'últimas',
    'publica��es': 'publicações',
    'real�ar': 'realçar',
    'Formul�rio': 'Formulário',
    'D�vidas': 'Dúvidas',
    
    # Eventos e workshops
    'lan�amentos': 'lançamentos',
    't�cnicas': 'técnicas',
    'n�veis': 'níveis',
    'Forma��o': 'Formação',
    
    # Geral
    'Gr�tis': 'Grátis',
    '�rea': 'Área',
    'Sess�o': 'Sessão',
    'Defini��es': 'Definições',
    'Coment�rios': 'Comentários',
    'Conte�do': 'Conteúdo',
    'Descri��o': 'Descrição',
    'Pre�o': 'Preço',
    'M�nimo': 'Mínimo',
    'Marca��es': 'Marcações',
    'Altera��es': 'Alterações',
    'Observa��es': 'Observações',
    'dispon�vel': 'disponível',
    'dispon�veis': 'disponíveis',
    'sess�es': 'sessões',
    'fotogr�ficas': 'fotográficas',
    'Localiza��o': 'Localização',
    'Regi�o': 'Região',
    'Est�dio': 'Estúdio',
    'circunvala��o': 'circunvalação',
    'm�ximo': 'máximo',
    '�teis': 'úteis',
    'J�': 'Já',
    'profiss�o': 'profissão',
    '�ltimo': 'último',
    '�nico': 'único',
    
    # Caracteres especiais
    '©': '©',
    '�': '©',
}

# Arquivos a processar
files = [
    'blog.html',
    'carrinho.html',
    'conta.html',
    'contacto.html',
    'evento.html',
    'eventos.html',
    'workshop.html',
    'workshops.html',
    'post.html',
    'servicos.html',
    'servico.html',
    'produtos.html',
    'produto.html',
    'portfolio.html',
    'sobre.html'
]

print('Iniciando correção de encoding...\n')

for filename in files:
    if not os.path.exists(filename):
        print(f'❌ {filename} não encontrado')
        continue
    
    try:
        # Ler arquivo com encoding UTF-8
        with codecs.open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Aplicar correções
        for old, new in replacements.items():
            if old in content:
                content = content.replace(old, new)
        
        # Salvar arquivo
        with codecs.open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'✓ {filename} corrigido')
    except Exception as e:
        print(f'❌ Erro em {filename}: {str(e)}')

print('\nConcluído!')
