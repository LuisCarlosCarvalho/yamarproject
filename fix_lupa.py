import os

def fix_lupa(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Substitui lupa corrompida (padrão de 3 caracteres visíveis + possível 4 invisível)
        # O padrão é "ðŸ”" (eth + Y com trema + Right Double Quotation)
        fixed_content = content.replace("ðŸ”", "🔍")
        
        # Correção adicional para espaço que pode ter sobrado do quarto byte corrompido (8D)
        # Se 8D virou espaço depois do ”, removemos.
        fixed_content = fixed_content.replace("🔍 ", "🔍") # Se o espaço for indesejado
        # Na verdade, melhor não remover espaço se não tiver certeza, mas em 'searchToggle', não deve ter espaço.
        # "searchToggle">🔍 </button> -> "searchToggle">🔍</button>
        # Vamos assumir simples replace primeiro.

        if content != fixed_content:
            print(f"Fixing lupa in {file_path}...")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        else:
            print(f"No lupa issues in {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    directory = r"c:\Users\LUIS\Desktop\testett\yamarproject-main"
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            fix_lupa(os.path.join(directory, filename))

if __name__ == "__main__":
    main()
