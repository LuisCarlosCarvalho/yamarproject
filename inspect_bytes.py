with open(r"c:\Users\LUIS\Desktop\testett\yamarproject-main\servicos.html", "rb") as f:
    content = f.read()
    # Procurar por "IN" seguido de bytes suspeitos
    start = content.find(b"IN")
    if start != -1:
        print(f"Bytes after IN: {content[start:start+10]}")
    
    # Procurar Lupa (ðŸ” )
    start_lupa = content.find(b"\xf0\x9f") # UTF-8 start encoded as latin1 bytes?
    # No arquivo corrompido (UTF-8 interpretado como Latin1 e salvo como UTF-8):
    # Lupa bytes originais UTF-8: F0 9F 94 8D
    # Corrompido: C3 B0 C5 B8 E2 80 9D (Isso que esperamos ver em UTF-8 para 'ðŸ”')
    # C3 B0 = ð
    # C5 B8 = Ÿ
    # E2 80 9D = ”
    
    # Vamos imprimir um trecho onde sabemos que tem lupa (searchToggle)
    search_idx = content.find(b"searchToggle")
    if search_idx != -1:
         print(f"Bytes near searchToggle: {content[search_idx+50:search_idx+150]}")
