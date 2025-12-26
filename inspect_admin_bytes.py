
with open(r"c:\Users\LUIS\Desktop\testett\yamarproject-main\admin.html", "rb") as f:
    lines = f.readlines()
    
# Line 92 (index 91) e arredores
for i in range(90, 95):
    print(f"Line {i+1}: {lines[i]}")
