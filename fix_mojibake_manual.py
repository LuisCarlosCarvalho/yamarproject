import os

# Mapa de substituições manuais extendido
REPLACEMENTS = {
    # Caracteres acentuados básicos
    "Ã‡": "Ç",
    "Ã§": "ç",
    "Ãƒ": "Ã",
    "Ã£": "ã",
    "ÃÕ": "Õ",
    "Ãµ": "õ",
    "Ã€": "À",
    "Ã ": "à",
    "Ã‰": "É",
    "Ã©": "é",
    "Ãˆ": "È",
    "Ã¨": "è",
    "ÃŠ": "Ê",
    "Ãª": "ê",
    "Ã“": "Ó",
    "Ã³": "ó",
    "Ã”": "Ô",
    "Ã´": "ô",
    "Ãš": "Ú",
    "Ãº": "ú",
    "Ã—": "×",
    "Ã¡": "á",
    "Ã¢": "â",
    "Â©": "©",
    "Â®": "®",
    
    # Pontuação e Símbolos
    "â€“": "–", 
    "â€”": "—", 
    "â€¦": "…", 
    "â€œ": "“", 
    "â€ ": "”", # Space at end might be variant
    "â€\x9d": "”",
    "â€™": "’",
    "â€˜": "‘",
    
    # Emojis e Símbolos Específicos (Corrupção de 4 bytes ou 3 bytes)
    "ðŸ” ": "🔍", # Lupa (F0 9F 94 8D -> ð Ÿ ” [8D?])
    "ðŸ›’": "🛒", # Carrinho (F0 9F 9B 92 -> ð Ÿ › ’)
    "â–¼": "▼",  # Seta (E2 96 BC -> â – ¼)
    
    # Casos Específicos com byte 8D (Í, Lupa)
    "INÃ CIO": "INÍCIO", # IN + Ã + Space + CIO
    "INÃ\x8dCIO": "INÍCIO", # Variante
    "INÃ\x20CIO": "INÍCIO",
    
    # Outros símbolos
    "ðŸ’„": "💄", # Logo icon maybe?
}

def fix_mojibake(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Tenta aplicar reversão automática (Latin1) APENAS se seguro
        # Mas aqui vamos focar no replace manual que é mais garantido para o estado atual
        
        fixed_content = content
        for bad, good in REPLACEMENTS.items():
            fixed_content = fixed_content.replace(bad, good)
            
        # Tenta capturar o caso da Lupa com o byte invisível se houver
        # Se 'ðŸ” ' (com espaço) não pegou, pode ser outro caractere
        if "ðŸ”" in fixed_content and "ðŸ” " not in fixed_content:
             # Tenta achar o 4o caractere
             pass 

        if content != fixed_content:
            print(f"Fixing {file_path}...")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        else:
            print(f"No changes for {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    directory = r"c:\Users\LUIS\Desktop\testett\yamarproject-main"
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            fix_mojibake(os.path.join(directory, filename))

if __name__ == "__main__":
    main()
