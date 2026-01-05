// ============================================
// FUNÇÕES SEGURAS DE RENDERIZAÇÃO
// ============================================
// Substituem innerHTML com sanitização automática

/**
 * Define HTML sanitizado em um elemento
 * @param {HTMLElement} element - Elemento alvo
 * @param {string} html - HTML a ser inserido
 * @param {boolean} allowSafeTags - Se permite tags seguras (padrão: false)
 */
function setSecureHTML(element, html, allowSafeTags = false) {
  if (!element) return;
  
  if (html === null || html === undefined) {
    element.innerHTML = '';
    return;
  }
  
  const sanitized = allowSafeTags ? sanitizeHTMLSafe(html) : sanitizeHTML(html);
  element.innerHTML = sanitized;
}

/**
 * Cria elemento de forma segura a partir de template
 * @param {string} template - Template HTML
 * @returns {DocumentFragment} - Fragment com elementos seguros
 */
function createSecureElement(template) {
  const temp = document.createElement('template');
  temp.innerHTML = sanitizeHTMLSafe(template);
  return temp.content.cloneNode(true);
}

/**
 * Anexa HTML sanitizado a um elemento
 * @param {HTMLElement} element - Elemento pai
 * @param {string} html - HTML a ser anexado
 */
function appendSecureHTML(element, html) {
  if (!element) return;
  
  const fragment = createSecureElement(html);
  element.appendChild(fragment);
}

/**
 * Define texto com segurança (previne XSS completamente)
 * @param {HTMLElement} element - Elemento alvo
 * @param {string} text - Texto a ser inserido
 */
function setSecureText(element, text) {
  if (!element) return;
  element.textContent = text || '';
}

/**
 * Renderiza lista de itens de forma segura
 * @param {HTMLElement} element - Container
 * @param {Array} items - Array de items
 * @param {Function} renderFn - Função que renderiza cada item
 */
function renderSecureList(element, items, renderFn) {
  if (!element) return;
  
  if (!items || items.length === 0) {
    element.innerHTML = '';
    return;
  }
  
  // Limpa container
  element.innerHTML = '';
  
  // Renderiza cada item
  items.forEach(item => {
    const html = renderFn(item);
    appendSecureHTML(element, html);
  });
}

/**
 * Sanitiza atributos de elementos
 * @param {HTMLElement} element - Elemento
 * @param {Object} attributes - Objeto com atributos
 */
function setSecureAttributes(element, attributes) {
  if (!element || !attributes) return;
  
  Object.keys(attributes).forEach(key => {
    // Não permite atributos de eventos
    if (key.startsWith('on')) {
      console.warn(`⚠️ Tentativa de adicionar evento via atributo: ${key}`);
      return;
    }
    
    // Não permite href com javascript:
    if (key === 'href' && attributes[key].startsWith('javascript:')) {
      console.warn('⚠️ Tentativa de adicionar href com javascript:');
      return;
    }
    
    // Sanitiza valor
    const value = sanitizeHTML(String(attributes[key]));
    element.setAttribute(key, value);
  });
}

/**
 * Valida e sanitiza URL antes de usar
 * @param {string} url - URL a validar
 * @param {string} fallback - URL de fallback
 * @returns {string} - URL sanitizada
 */
function sanitizeURL(url, fallback = '#') {
  if (!url) return fallback;
  
  // Remove javascript: e data: URLs
  if (url.match(/^(javascript|data|vbscript):/i)) {
    console.warn('⚠️ URL perigosa bloqueada:', url);
    return fallback;
  }
  
  // Valida URLs HTTP/HTTPS
  try {
    const urlObj = new URL(url, window.location.origin);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol)) {
      return url;
    }
  } catch {
    // URL relativa - permite
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
      return url;
    }
  }
  
  console.warn('⚠️ URL inválida:', url);
  return fallback;
}

/**
 * Cria card seguro com dados
 * @param {Object} data - Dados do card
 * @param {string} template - Template do card
 * @returns {string} - HTML sanitizado
 */
function createSecureCard(data, templateFn) {
  // Sanitiza todos os valores do objeto
  const safeData = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (typeof value === 'string') {
      safeData[key] = escapeHTML(value);
    } else if (typeof value === 'number') {
      safeData[key] = value;
    } else if (value === null || value === undefined) {
      safeData[key] = '';
    } else {
      safeData[key] = value;
    }
  });
  
  return templateFn(safeData);
}

/**
 * Valida e sanitiza dados de formulário
 * @param {FormData|Object} formData - Dados do formulário
 * @returns {Object} - Objeto com dados sanitizados e validação
 */
function sanitizeFormData(formData) {
  const sanitized = {};
  const errors = {};
  let isValid = true;
  
  // Converte FormData para objeto se necessário
  const data = formData instanceof FormData 
    ? Object.fromEntries(formData.entries())
    : formData;
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    // Pula token CSRF
    if (key === 'csrf_token') {
      sanitized[key] = value;
      return;
    }
    
    // Verifica segurança
    const check = securityCheck(value);
    if (!check.safe) {
      errors[key] = `Input contém padrão suspeito: ${check.threat}`;
      isValid = false;
      logSecurityEvent('FORM_ATTACK', { field: key, threat: check.threat });
      return;
    }
    
    // Sanitiza valor
    sanitized[key] = sanitizeHTML(value);
  });
  
  return { data: sanitized, errors, isValid };
}

/**
 * Renderiza tabela de forma segura
 * @param {HTMLElement} element - Elemento da tabela (tbody)
 * @param {Array} rows - Array de linhas
 * @param {Function} renderFn - Função que renderiza cada linha
 */
function renderSecureTable(element, rows, renderFn) {
  if (!element) return;
  
  if (!rows || rows.length === 0) {
    element.innerHTML = '<tr><td colspan="100%" class="no-items">Nenhum item encontrado</td></tr>';
    return;
  }
  
  element.innerHTML = '';
  
  rows.forEach(row => {
    const tr = document.createElement('tr');
    const html = renderFn(row);
    tr.innerHTML = sanitizeHTMLSafe(html);
    element.appendChild(tr);
  });
}

/**
 * Cria opção de select de forma segura
 * @param {HTMLSelectElement} select - Elemento select
 * @param {Array} options - Array de opções {value, text}
 */
function populateSecureSelect(select, options) {
  if (!select) return;
  
  // Limpa opções existentes (exceto a primeira se for placeholder)
  const firstOption = select.options[0];
  const hasPlaceholder = firstOption && firstOption.value === '';
  
  select.innerHTML = '';
  
  if (hasPlaceholder) {
    select.appendChild(firstOption);
  }
  
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = sanitizeHTML(opt.value || '');
    option.textContent = opt.text || opt.value || '';
    
    if (opt.selected) {
      option.selected = true;
    }
    
    select.appendChild(option);
  });
}

/**
 * Atualiza contador com animação segura
 * @param {HTMLElement} element - Elemento do contador
 * @param {number} value - Valor final
 * @param {number} duration - Duração da animação em ms
 */
function animateSecureCounter(element, value, duration = 1000) {
  if (!element) return;
  
  const start = parseInt(element.textContent) || 0;
  const end = parseInt(value) || 0;
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      element.textContent = end.toLocaleString('pt-PT');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString('pt-PT');
    }
  }, 16);
}

/**
 * Formata preço de forma segura
 * @param {number} price - Preço
 * @returns {string} - Preço formatado
 */
function formatSecurePrice(price) {
  const numPrice = parseFloat(price) || 0;
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(numPrice);
}

/**
 * Formata data de forma segura
 * @param {string|Date} date - Data
 * @returns {string} - Data formatada
 */
function formatSecureDate(date) {
  if (!date) return '-';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat('pt-PT').format(dateObj);
  } catch {
    return '-';
  }
}

/**
 * Trunca texto de forma segura
 * @param {string} text - Texto
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} - Texto truncado
 */
function truncateSecureText(text, maxLength = 100) {
  if (!text) return '';
  
  const sanitized = sanitizeHTML(text);
  
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  
  return sanitized.substring(0, maxLength) + '...';
}

/**
 * Cria badge de status de forma segura
 * @param {string} status - Status
 * @returns {string} - HTML do badge
 */
function createSecureBadge(status) {
  const statusMap = {
    'pendente': { class: 'badge-warning', text: 'Pendente' },
    'confirmado': { class: 'badge-info', text: 'Confirmado' },
    'confirmada': { class: 'badge-info', text: 'Confirmada' },
    'concluido': { class: 'badge-success', text: 'Concluído' },
    'concluída': { class: 'badge-success', text: 'Concluída' },
    'cancelado': { class: 'badge-danger', text: 'Cancelado' },
    'cancelada': { class: 'badge-danger', text: 'Cancelada' },
    'pago': { class: 'badge-success', text: 'Pago' },
    'paid': { class: 'badge-success', text: 'Pago' },
    'entregue': { class: 'badge-success', text: 'Entregue' },
    'em_preparacao': { class: 'badge-info', text: 'Em Preparação' }
  };
  
  const statusLower = String(status || 'pendente').toLowerCase();
  const badge = statusMap[statusLower] || { class: 'badge-secondary', text: status };
  
  return `<span class="badge ${badge.class}">${escapeHTML(badge.text)}</span>`;
}

/**
 * Renderiza imagem de forma segura
 * @param {string} src - URL da imagem
 * @param {string} alt - Texto alternativo
 * @param {string} className - Classes CSS
 * @returns {HTMLImageElement} - Elemento img
 */
function createSecureImage(src, alt = '', className = '') {
  const img = document.createElement('img');
  
  const safeSrc = sanitizeURL(src, 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E');
  img.alt = sanitizeHTML(alt);
  // Pré-carrega a src e aplica fallback se necessário
  (function(preloadSrc){
    // If a global applyImageSafe exists (from ui.js), use it for consistent fallback handling
    if (typeof window.applyImageSafe === 'function') {
      try {
        window.applyImageSafe(img, preloadSrc, 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3E?%3C/text%3E%3C/svg%3E');
        return;
      } catch (e) {
        console.warn('applyImageSafe failed, falling back to local preload:', e);
      }
    }

    const tester = new Image();
    tester.onload = function() { img.src = preloadSrc; };
    tester.onerror = function() { img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3E?%3C/text%3E%3C/svg%3E'; };
    tester.src = preloadSrc;
  })(safeSrc);
  
  if (className) {
    img.className = sanitizeHTML(className);
  }
  
  // Proteção contra erro de carregamento
  img.onerror = function() {
    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3E?%3C/text%3E%3C/svg%3E';
  };
  
  return img;
}

/**
 * Cria link de forma segura
 * @param {string} href - URL do link
 * @param {string} text - Texto do link
 * @param {Object} options - Opções adicionais
 * @returns {HTMLAnchorElement} - Elemento a
 */
function createSecureLink(href, text, options = {}) {
  const a = document.createElement('a');
  
  a.href = sanitizeURL(href);
  a.textContent = sanitizeHTML(text);
  
  if (options.className) {
    a.className = sanitizeHTML(options.className);
  }
  
  if (options.target === '_blank') {
    a.target = '_blank';
    a.rel = 'noopener noreferrer'; // Segurança
  }
  
  if (options.title) {
    a.title = sanitizeHTML(options.title);
  }
  
  return a;
}

// Exporta funções globalmente
window.setSecureHTML = setSecureHTML;
window.createSecureElement = createSecureElement;
window.appendSecureHTML = appendSecureHTML;
window.setSecureText = setSecureText;
window.renderSecureList = renderSecureList;
window.setSecureAttributes = setSecureAttributes;
window.sanitizeURL = sanitizeURL;
window.createSecureCard = createSecureCard;
window.sanitizeFormData = sanitizeFormData;
window.renderSecureTable = renderSecureTable;
window.populateSecureSelect = populateSecureSelect;
window.animateSecureCounter = animateSecureCounter;
window.formatSecurePrice = formatSecurePrice;
window.formatSecureDate = formatSecureDate;
window.truncateSecureText = truncateSecureText;
window.createSecureBadge = createSecureBadge;
window.createSecureImage = createSecureImage;
window.createSecureLink = createSecureLink;

console.log('🔒 Funções seguras de renderização carregadas');
