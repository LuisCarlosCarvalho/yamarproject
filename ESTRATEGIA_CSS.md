# Estratégia de Refatoração CSS

## Problema Atual
O site tem múltiplas media queries desorganizadas causando bugs no mobile.

## Solução
Ao invés de reescrever todo o CSS (3191 linhas), vou fazer uma **limpeza cirúrgica**:

### Abordagem:
1. **Manter** toda a estrutura desktop (funciona bem)
2. **Reorganizar** media queries em ordem lógica
3. **Simplificar** regras mobile para herdar do desktop
4. **Usar** abordagem mobile-first apenas nas media queries

### Breakpoints Padronizados:
```css
/* Mobile First */
/* Base: 0-575px (mobile) */
@media (min-width: 576px) { /* Tablet pequeno */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 992px) { /* Desktop */ }
@media (min-width: 1200px) { /* Desktop grande */ }
```

### Regras Principais:
1. **Touch targets**: Mínimo 44x44px em mobile
2. **Font-size**: Mínimo 16px em inputs (evita zoom iOS)
3. **Overflow**: Sempre hidden-x no body
4. **Flexbox/Grid**: Usar para layouts responsivos
5. **clamp()**: Para valores fluidos

### O que NÃO fazer:
- ❌ Reescrever tudo do zero
- ❌ Mudar estrutura HTML
- ❌ Remover funcionalidades desktop
- ❌ Criar versões separadas

### O que FAZER:
- ✅ Consolidar media queries duplicadas
- ✅ Adicionar regras mobile faltantes
- ✅ Corrigir bugs específicos (logo, menu, etc)
- ✅ Manter compatibilidade total

## Implementação
Vou editar o CSS atual com correções pontuais ao invés de reescrever.
