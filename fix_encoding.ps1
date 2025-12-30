# Fix UTF-8 encoding in HTML files
$files = @(
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
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processando: $file"
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Corrigir caracteres
        $content = $content -replace 'tend�ncias', 'tendências'
        $content = $content -replace 'In�cio', 'Início'
        $content = $content -replace 'Servi�os', 'Serviços'
        $content = $content -replace 'PORTF�LIO', 'PORTFÓLIO'
        $content = $content -replace 'Navega��o', 'Navegação'
        $content = $content -replace 'Seguran�a', 'Segurança'
        $content = $content -replace 'Informa��es', 'Informações'
        $content = $content -replace 'Marca��o', 'Marcação'
        $content = $content -replace 'Or�amento', 'Orçamento'
        $content = $content -replace '�ltimas', 'últimas'
        $content = $content -replace 'publica��es', 'publicações'
        $content = $content -replace 'real�ar', 'realçar'
        $content = $content -replace 'Formul�rio', 'Formulário'
        $content = $content -replace 'D�vidas', 'Dúvidas'
        $content = $content -replace 'lan�amentos', 'lançamentos'
        $content = $content -replace 't�cnicas', 'técnicas'
        $content = $content -replace 'n�veis', 'níveis'
        $content = $content -replace 'Forma��o', 'Formação'
        $content = $content -replace 'Gr�tis', 'Grátis'
        $content = $content -replace '�rea', 'Área'
        $content = $content -replace 'Sess�o', 'Sessão'
        $content = $content -replace 'Defini��es', 'Definições'
        $content = $content -replace 'Coment�rios', 'Comentários'
        $content = $content -replace 'Conte�do', 'Conteúdo'
        $content = $content -replace 'Descri��o', 'Descrição'
        $content = $content -replace 'Pre�o', 'Preço'
        $content = $content -replace 'M�nimo', 'Mínimo'
        $content = $content -replace 'Marca��es', 'Marcações'
        $content = $content -replace 'Altera��es', 'Alterações'
        $content = $content -replace 'Observa��es', 'Observações'
        $content = $content -replace 'dispon�vel', 'disponível'
        $content = $content -replace 'dispon�veis', 'disponíveis'
        $content = $content -replace 'sess�es', 'sessões'
        $content = $content -replace 'fotogr�ficas', 'fotográficas'
        $content = $content -replace 'Localiza��o', 'Localização'
        $content = $content -replace 'Regi�o', 'Região'
        $content = $content -replace 'Est�dio', 'Estúdio'
        $content = $content -replace 'circunvala��o', 'circunvalação'
        $content = $content -replace 'm�ximo', 'máximo'
        $content = $content -replace '�teis', 'úteis'
        $content = $content -replace 'J�', 'Já'
        $content = $content -replace 'profiss�o', 'profissão'
        $content = $content -replace '©', '©'
        $content = $content -replace '�', '©'
        $content = $content -replace 'Escreve', 'Escreve'
        $content = $content -replace 'Deixa', 'Deixa'
        
        Set-Content $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "✓ $file corrigido"
    }
}

Write-Host "`nConcluído! Todos os arquivos foram corrigidos."
