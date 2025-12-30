#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ADMIN_DADOS.PY - Script de Administração do dados.json
Atualiza preços, descrições, disponibilidade e outros dados do site
"""

import json
import sys
import os
from datetime import datetime
from typing import Dict, Any, List

# Caminho do arquivo dados.json
DADOS_FILE = os.path.join(os.path.dirname(__file__), 'dados.json')

def carregar_dados() -> Dict[str, Any]:
    """Carrega o arquivo dados.json"""
    try:
        with open(DADOS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Erro: Arquivo {DADOS_FILE} não encontrado!")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Erro ao ler JSON: {e}")
        sys.exit(1)

def salvar_dados(dados: Dict[str, Any]):
    """Salva os dados no arquivo dados.json"""
    try:
        # Atualiza timestamp e versão
        dados['lastUpdate'] = datetime.now().isoformat()
        
        # Salva com indentação para legibilidade
        with open(DADOS_FILE, 'w', encoding='utf-8') as f:
            json.dump(dados, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Dados salvos com sucesso em {DADOS_FILE}")
        print(f"📅 Última atualização: {dados['lastUpdate']}")
    except Exception as e:
        print(f"❌ Erro ao salvar: {e}")
        sys.exit(1)

# =============================================
# FUNÇÕES DE ATUALIZAÇÃO - SERVIÇOS
# =============================================

def atualizar_servico(dados: Dict, servico_id: str, **kwargs):
    """
    Atualiza um serviço existente
    
    Args:
        servico_id: ID do serviço (makeup-noiva, makeup-social, etc)
        kwargs: Campos a atualizar (nome, descricao, preco, disponivel)
    """
    servicos = dados.get('servicos', [])
    servico = next((s for s in servicos if s['id'] == servico_id), None)
    
    if not servico:
        print(f"❌ Serviço '{servico_id}' não encontrado!")
        return False
    
    # Atualiza campos fornecidos
    for campo, valor in kwargs.items():
        if campo in servico:
            old_value = servico[campo]
            servico[campo] = valor
            print(f"  📝 {campo}: {old_value} → {valor}")
    
    print(f"✅ Serviço '{servico['titulo']}' atualizado!")
    return True

def listar_servicos(dados: Dict):
    """Lista todos os serviços"""
    servicos = dados.get('servicos', [])
    print(f"\n📋 SERVIÇOS ({len(servicos)} encontrados):")
    print("-" * 80)
    for s in servicos:
        status = "✅ Disponível" if s.get('disponivel') else "❌ Indisponível"
        print(f"ID: {s['id']}")
        print(f"  Título: {s['titulo']}")
        print(f"  Preço: €{s['preco']}")
        print(f"  Duração: {s['duracao']}")
        print(f"  Status: {status}")
        print()

# =============================================
# FUNÇÕES DE ATUALIZAÇÃO - WORKSHOPS
# =============================================

def atualizar_workshop(dados: Dict, workshop_id: str, **kwargs):
    """Atualiza um workshop existente"""
    workshops = dados.get('workshops', [])
    workshop = next((w for w in workshops if w['id'] == workshop_id), None)
    
    if not workshop:
        print(f"❌ Workshop '{workshop_id}' não encontrado!")
        return False
    
    for campo, valor in kwargs.items():
        if campo in workshop:
            old_value = workshop[campo]
            workshop[campo] = valor
            print(f"  📝 {campo}: {old_value} → {valor}")
    
    print(f"✅ Workshop '{workshop['titulo']}' atualizado!")
    return True

def listar_workshops(dados: Dict):
    """Lista todos os workshops"""
    workshops = dados.get('workshops', [])
    print(f"\n📚 WORKSHOPS ({len(workshops)} encontrados):")
    print("-" * 80)
    for w in workshops:
        status = "✅ Disponível" if w.get('disponivel') else "❌ Indisponível"
        print(f"ID: {w['id']}")
        print(f"  Título: {w['titulo']}")
        print(f"  Preço: €{w['preco']}")
        print(f"  Vagas: {w.get('vagas', 'N/A')}")
        print(f"  Status: {status}")
        print()

# =============================================
# FUNÇÕES DE ATUALIZAÇÃO - PRODUTOS
# =============================================

def atualizar_produto(dados: Dict, produto_id: str, **kwargs):
    """Atualiza um produto existente"""
    produtos = dados.get('produtos', [])
    produto = next((p for p in produtos if p['id'] == produto_id), None)
    
    if not produto:
        print(f"❌ Produto '{produto_id}' não encontrado!")
        return False
    
    for campo, valor in kwargs.items():
        if campo in produto:
            old_value = produto[campo]
            produto[campo] = valor
            print(f"  📝 {campo}: {old_value} → {valor}")
    
    print(f"✅ Produto '{produto['nome']}' atualizado!")
    return True

def listar_produtos(dados: Dict):
    """Lista todos os produtos"""
    produtos = dados.get('produtos', [])
    print(f"\n🛍️ PRODUTOS ({len(produtos)} encontrados):")
    print("-" * 80)
    for p in produtos:
        status = "✅ Em estoque" if p.get('stock', 0) > 0 else "❌ Sem estoque"
        print(f"ID: {p['id']}")
        print(f"  Nome: {p['nome']}")
        print(f"  Preço: €{p['preco']}")
        print(f"  Estoque: {p.get('stock', 0)} unidades")
        print(f"  Status: {status}")
        print()

# =============================================
# FUNÇÕES DE ATUALIZAÇÃO - CONFIGURAÇÕES
# =============================================

def atualizar_config(dados: Dict, secao: str, **kwargs):
    """
    Atualiza configurações do site
    
    Args:
        secao: site, delivery, payment
        kwargs: Campos a atualizar
    """
    config = dados.get('configuracoes', {})
    
    if secao not in config:
        print(f"❌ Seção '{secao}' não encontrada!")
        return False
    
    for campo, valor in kwargs.items():
        if campo in config[secao]:
            old_value = config[secao][campo]
            config[secao][campo] = valor
            print(f"  📝 {secao}.{campo}: {old_value} → {valor}")
    
    print(f"✅ Configuração '{secao}' atualizada!")
    return True

def listar_config(dados: Dict):
    """Lista todas as configurações"""
    config = dados.get('configuracoes', {})
    print(f"\n⚙️ CONFIGURAÇÕES:")
    print("-" * 80)
    
    if 'site' in config:
        print("🌐 Site:")
        for k, v in config['site'].items():
            print(f"  {k}: {v}")
    
    if 'delivery' in config:
        print("\n🚚 Delivery:")
        for k, v in config['delivery'].items():
            print(f"  {k}: {v}")
    
    if 'payment' in config:
        print("\n💳 Pagamento:")
        print(f"  Métodos: {', '.join(config['payment'].get('metodos', []))}")
        print(f"  PIX: {config['payment'].get('pix', 'N/A')}")
    print()

# =============================================
# MENU INTERATIVO
# =============================================

def menu_principal():
    """Menu principal do administrador"""
    print("\n" + "="*80)
    print("🔧 YAMAR PROJECT - PAINEL DE ADMINISTRAÇÃO")
    print("="*80)
    print("1. Listar Serviços")
    print("2. Atualizar Serviço")
    print("3. Listar Workshops")
    print("4. Atualizar Workshop")
    print("5. Listar Produtos")
    print("6. Atualizar Produto")
    print("7. Ver Configurações")
    print("8. Atualizar Configuração")
    print("9. Sair")
    print("-"*80)
    
    return input("Escolha uma opção: ").strip()

def menu_atualizar_servico(dados: Dict):
    """Menu para atualizar serviço"""
    listar_servicos(dados)
    servico_id = input("\n📝 ID do serviço a atualizar: ").strip()
    
    print("\nCampos disponíveis: titulo, descricao, preco, duracao, disponivel")
    print("Digite no formato: campo=valor campo2=valor2")
    print("Exemplo: preco=180 disponivel=true")
    
    entrada = input("\n✏️ Atualizações: ").strip()
    
    # Parse entrada
    kwargs = {}
    for item in entrada.split():
        if '=' in item:
            campo, valor = item.split('=', 1)
            # Converte tipos
            if valor.lower() == 'true':
                valor = True
            elif valor.lower() == 'false':
                valor = False
            elif valor.replace('.', '').isdigit():
                valor = float(valor) if '.' in valor else int(valor)
            kwargs[campo] = valor
    
    if atualizar_servico(dados, servico_id, **kwargs):
        salvar_dados(dados)

def menu_atualizar_workshop(dados: Dict):
    """Menu para atualizar workshop"""
    listar_workshops(dados)
    workshop_id = input("\n📝 ID do workshop a atualizar: ").strip()
    
    print("\nCampos disponíveis: titulo, descricao, preco, vagas, disponivel")
    entrada = input("\n✏️ Atualizações (campo=valor): ").strip()
    
    kwargs = {}
    for item in entrada.split():
        if '=' in item:
            campo, valor = item.split('=', 1)
            if valor.lower() == 'true':
                valor = True
            elif valor.lower() == 'false':
                valor = False
            elif valor.replace('.', '').isdigit():
                valor = float(valor) if '.' in valor else int(valor)
            kwargs[campo] = valor
    
    if atualizar_workshop(dados, workshop_id, **kwargs):
        salvar_dados(dados)

def menu_atualizar_produto(dados: Dict):
    """Menu para atualizar produto"""
    listar_produtos(dados)
    produto_id = input("\n📝 ID do produto a atualizar: ").strip()
    
    print("\nCampos disponíveis: nome, descricao, preco, stock")
    entrada = input("\n✏️ Atualizações (campo=valor): ").strip()
    
    kwargs = {}
    for item in entrada.split():
        if '=' in item:
            campo, valor = item.split('=', 1)
            if valor.lower() == 'true':
                valor = True
            elif valor.lower() == 'false':
                valor = False
            elif valor.replace('.', '').isdigit():
                valor = float(valor) if '.' in valor else int(valor)
            kwargs[campo] = valor
    
    if atualizar_produto(dados, produto_id, **kwargs):
        salvar_dados(dados)

def menu_atualizar_config(dados: Dict):
    """Menu para atualizar configurações"""
    listar_config(dados)
    secao = input("\n📝 Seção (site/delivery/payment): ").strip()
    
    entrada = input("\n✏️ Atualizações (campo=valor): ").strip()
    
    kwargs = {}
    for item in entrada.split():
        if '=' in item:
            campo, valor = item.split('=', 1)
            if valor.lower() == 'true':
                valor = True
            elif valor.lower() == 'false':
                valor = False
            elif valor.replace('.', '').isdigit():
                valor = float(valor) if '.' in valor else int(valor)
            kwargs[campo] = valor
    
    if atualizar_config(dados, secao, **kwargs):
        salvar_dados(dados)

# =============================================
# MAIN
# =============================================

def main():
    """Função principal"""
    dados = carregar_dados()
    
    while True:
        opcao = menu_principal()
        
        if opcao == '1':
            listar_servicos(dados)
        elif opcao == '2':
            menu_atualizar_servico(dados)
        elif opcao == '3':
            listar_workshops(dados)
        elif opcao == '4':
            menu_atualizar_workshop(dados)
        elif opcao == '5':
            listar_produtos(dados)
        elif opcao == '6':
            menu_atualizar_produto(dados)
        elif opcao == '7':
            listar_config(dados)
        elif opcao == '8':
            menu_atualizar_config(dados)
        elif opcao == '9':
            print("\n👋 Até breve!")
            break
        else:
            print("\n❌ Opção inválida!")
        
        input("\n⏎ Pressione ENTER para continuar...")

if __name__ == '__main__':
    main()
