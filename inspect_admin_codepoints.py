
path = r"c:\Users\LUIS\Desktop\testett\yamarproject-main\admin.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Padrões visuais identificados no diff:
patterns = [
    "“Š", # Dashboard
    "“…", # Marcações
    "“¦", # Encomendas
    "Ž“", # Workshops
    "› ï¸ ", # Produtos
    "“ ", # Blog (Space after quote?)
    "Ž‰", # Eventos
    "‘¥", # Utilizadores
    "âœ‰ï¸ ", # Mensagens
    "▼ï¸ ", # Gestão de Imagens
    "“ˆ", # Relatórios
]

print("Scanning for patterns...")
for p in patterns:
    idx = content.find(p)
    if idx != -1:
        snippet = content[idx:idx+len(p)+5]
        print(f"Pattern '{p}' found. Snippet: {snippet}")
        print("Codepoints:")
        for char in p:
            print(f"{char}: {ord(char):X}")
        print("-" * 20)
    else:
        print(f"Pattern '{p}' NOT found (might be slight variation)")
