import os

def fix_encoding(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Tenta reverter o mojibake usando latin1 que mapeia todos os bytes 0-255
        try:
            # Se o arquivo UTF-8 foi lido como Latin1/CP1252 e salvo como UTF-8,
            # os bytes UTF-8 originais viraram caracteres Latin1.
            # Encode latin1 recupera os bytes originais.
            # Decode utf-8 interpreta esses bytes corretamente.
            fixed_content = content.encode('latin1').decode('utf-8')
        except UnicodeError:
            # Se falhar, o arquivo pode já estar correto ou muito corrompido
            # Vamos tentar apenas substituir padrões comuns se o encode total falhar
            # mas latin1 geralmente não falha no encode.
            # O decode utf-8 pode falhar se os bytes recuperados não formarem utf-8 válido.
            print(f"Skipping {file_path}: content is not reversible directly.")
            return

        if content != fixed_content:
            print(f"Fixing {file_path}...")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        else:
            print(f"No changes needed for {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    directory = r"c:\Users\LUIS\Desktop\testett\yamarproject-main"
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            fix_encoding(os.path.join(directory, filename))

if __name__ == "__main__":
    main()
