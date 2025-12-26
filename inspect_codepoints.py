
path = r"c:\Users\LUIS\Desktop\testett\yamarproject-main\servicos.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
    
idx = content.find("searchToggle")
if idx != -1:
    snippet = content[idx:idx+80]
    print(f"Snippet: {snippet}")
    print("Codepoints:")
    for char in snippet:
        print(f"{char}: {ord(char):X}")
