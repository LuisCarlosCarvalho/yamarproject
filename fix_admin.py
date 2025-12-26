"""
Script para corrigir artefatos de emojis corrompidos no arquivo admin.html.
"""

import os

def fix_admin(file_path):
    """
    Corrige artefatos de emojis corrompidos no arquivo especificado.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Mapeamento de emojis corrompidos no Admin
        # Baseado na saída de inspeção e lógica de mojibake (UTF-8 bytes -> CP1252 chars)

        # Dashboard: 📊 (F0 9F 93 8A) -> ð Ÿ “ Š (F0->ð, 9F->Ÿ, 93->“, 8A->Š)
        # Scan achou: “Š (U+201C U+0160). Provavelmente ðŸ sumiu/foi filtrado.
        replacements = {
            "“Š": "📊",  # Dashboard
            "“…": "📅",  # Marcações
            "“¦": "📦",     # Encomendas (Package?) 📦 (F0 9F 93 A6 -> ðŸ“¦) -> “¦
            "Ž“": "🎓",     # Workshops (Grad cap) 🎓 (F0 9F 8E 93 -> ðŸŽ“) -> Ž“
            "› ï¸ ": "🛍️",   # Produtos (Shopping bags) 🛍️ (F0 9F 9B 8D EF B8 8F) -> › (9B?)
                             # Shopping Bags: F0 9F 9B 8D -> ð Ÿ ›  (8D sumiu/ctrl)
                             # Vamos tentar match parcial seguro.
            "“ ": "📝",      # Blog (Memo?) 📝 (F0 9F 93 9D -> ðŸ“ ) -> “
            "Ž‰": "🎉",     # Eventos (Party popper) 🎉 (F0 9F 8E 89 -> ðŸŽ‰) -> Ž‰
            "‘¥": "👥",     # Utilizadores (Busts) 👥 (F0 9F 91 A5 -> ðŸ‘¥) -> ‘¥
            "âœ‰ï¸ ": "✉️", # Mensagens (Envelope) ✉️ (E2 9C 89 EF B8 8F -> âœ‰ï¸ ) - Esse é padrão
            "▼ï¸ ": "🖼️",    # Gestão de Imagens (Frame?) 🖼️ (F0 9F 96 BC -> ðŸ–¼) ?
                             # O texto diz "▼ï¸ Gestão de Imagens". ▼ é Down Arrow?
                             # Mas menu de imagens geralmente é Picture.
                             # Se for Frame 🖼️: F0 9F 96 BC.
                             # Se for Folder 📁: F0 9F 93 81.
                             # Vamos assumir 🖼️ pelo contexto visual.
            "“ˆ": "📈",     # Relatórios (Chart increasing?) 📈 (F0 9F 93 88 -> ðŸ“ˆ) -> “ˆ
        }

        fixed_content = content
        for bad, good in replacements.items():
            fixed_content = fixed_content.replace(bad, good)

        # Correção adicional para Product (Shopping Bags) que é complexo
        # Padrão: › ï¸  (Shopping Bags 🛍️)
        # Se 🛍️ falhar, try 🛍
        fixed_content = fixed_content.replace("› ï¸ ", "🛍️") # Tenta com variation selector
        fixed_content = fixed_content.replace("› ", "🛍️")     # Tenta sem

        # Correção para Image (Frame)
        # ▼ï¸  -> 🖼️
        fixed_content = fixed_content.replace("▼ï¸ ", "🖼️")

        if content != fixed_content:
            print(f"Fixing admin emoji artifacts in {file_path}...")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        else:
            print(f"No changes for {file_path}")

    except (IOError, OSError) as e:
        print(f"Error processing {file_path}: {e}")

def main():
    """
    Função principal para executar a correção no arquivo admin.html.
    """
    path = r"c:\Users\LUIS\Desktop\testett\yamarproject-main\admin.html"
    if os.path.exists(path):
        fix_admin(path)

if __name__ == "__main__":
    main()
