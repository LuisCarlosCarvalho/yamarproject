import os

def fix_final(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Correção baseada na análise de codepoints:
        # A lupa (🔍) corrompeu-se para ” (U+201D) seguido de \u008d.
        # Os caracteres ð (Eth) e Ÿ (Y diaeresis) sumiram ou foram removidos.
        
        # \u201d é Right Double Quotation Mark (”)
        # \u008d é Reverse Line Feed (controle)
        
        fixed_content = content.replace("\u201d\u008d", "🔍")
        
        # Caso o carrinho tenha sofrido o mesmo (perda de ðŸ)
        # Carrinho era ð Ÿ › ’
        # Sobraria › ’ (\u203a \u2019)
        fixed_content = fixed_content.replace("\u203a\u2019", "🛒")
        
        # Seta: â – ¼ (â sumiu?) – ¼ (\u2013 \u00bc)
        # Seta era â–¼
        fixed_content = fixed_content.replace("\u2013\u00bc", "▼")

        if content != fixed_content:
            print(f"Fixing artifacts in {file_path}...")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        else:
            print(f"Clean {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    directory = r"c:\Users\LUIS\Desktop\testett\yamarproject-main"
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            fix_final(os.path.join(directory, filename))

if __name__ == "__main__":
    main()
