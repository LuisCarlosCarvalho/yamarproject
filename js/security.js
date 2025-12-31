// ============================================
// SISTEMA DE SEGURANÇA - YAMAR PROJECT
// ============================================
// Proteção contra XSS, CSRF, Rate Limiting, e outras vulnerabilidades

// ============================================
// SANITIZAÇÃO E VALIDAÇÃO DE INPUTS
// ============================================

/**
 * Sanitiza HTML removendo tags potencialmente perigosas
 */
function sanitizeHTML(str) {
  if (!str) return '';
  
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Sanitiza HTML mas permite algumas tags seguras
 */
function sanitizeHTMLSafe(str) {
  if (!str) return '';
  
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
  const temp = document.createElement('div');
  temp.innerHTML = str;
  
  // Remove scripts e tags perigosas
  const scripts = temp.querySelectorAll('script, iframe, object, embed, link, style');
  scripts.forEach(el => el.remove());
  
  // Remove atributos perigosos
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    const attrs = Array.from(el.attributes);
    attrs.forEach(attr => {
      if (attr.name.startsWith('on') || attr.name === 'href' && attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
    
    // Remove tags não permitidas
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      el.replaceWith(...el.childNodes);
    }
  });
  
  return temp.innerHTML;
}

/**
 * Valida email
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Valida telefone português
 */
function validatePhone(phone) {
  const re = /^(\+351)?[0-9]{9}$/;
  return re.test(String(phone).replace(/\s/g, ''));
}

/**
 * Valida URL
 */
function validateURL(url) {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Escapa caracteres especiais para prevenir XSS
 */
function escapeHTML(str) {
  if (!str) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return String(str).replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Valida e sanitiza input genérico
 */
function validateInput(value, type = 'text', maxLength = 1000) {
  if (!value) return { valid: false, sanitized: '', error: 'Campo obrigatório' };
  
  value = String(value).trim();
  
  // Verifica tamanho máximo
  if (value.length > maxLength) {
    return { valid: false, sanitized: '', error: `Máximo ${maxLength} caracteres` };
  }
  
  // Validação por tipo
  switch (type) {
    case 'email':
      if (!validateEmail(value)) {
        return { valid: false, sanitized: '', error: 'Email inválido' };
      }
      break;
    case 'phone':
      if (!validatePhone(value)) {
        return { valid: false, sanitized: '', error: 'Telefone inválido' };
      }
      break;
    case 'url':
      if (!validateURL(value)) {
        return { valid: false, sanitized: '', error: 'URL inválida' };
      }
      break;
    case 'number':
      if (isNaN(value)) {
        return { valid: false, sanitized: '', error: 'Deve ser um número' };
      }
      value = parseFloat(value);
      break;
  }
  
  const sanitized = type === 'html' ? sanitizeHTMLSafe(value) : sanitizeHTML(value);
  
  return { valid: true, sanitized, error: null };
}

// ============================================
// PROTEÇÃO CONTRA CSRF
// ============================================

/**
 * Gera token CSRF
 */
function generateCSRFToken() {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  sessionStorage.setItem('csrfToken', token);
  return token;
}

/**
 * Valida token CSRF
 */
function validateCSRFToken(token) {
  const storedToken = sessionStorage.getItem('csrfToken');
  return token && storedToken && token === storedToken;
}

/**
 * Adiciona token CSRF a formulário
 */
function addCSRFTokenToForm(form) {
  const token = generateCSRFToken();
  
  let input = form.querySelector('input[name="csrf_token"]');
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrf_token';
    form.appendChild(input);
  }
  
  input.value = token;
}

// ============================================
// RATE LIMITING
// ============================================

const rateLimits = new Map();

/**
 * Verifica rate limit para uma ação
 */
function checkRateLimit(action, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const key = `rateLimit_${action}`;
  
  let attempts = rateLimits.get(key) || [];
  
  // Remove tentativas antigas
  attempts = attempts.filter(time => now - time < windowMs);
  
  // Verifica se excedeu o limite
  if (attempts.length >= maxAttempts) {
    const oldestAttempt = Math.min(...attempts);
    const remainingTime = Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetIn: remainingTime
    };
  }
  
  // Adiciona nova tentativa
  attempts.push(now);
  rateLimits.set(key, attempts);
  
  return {
    allowed: true,
    remaining: maxAttempts - attempts.length,
    resetIn: Math.ceil(windowMs / 1000)
  };
}

/**
 * Reseta rate limit para uma ação
 */
function resetRateLimit(action) {
  rateLimits.delete(`rateLimit_${action}`);
}

// ============================================
// CRIPTOGRAFIA DE DADOS
// ============================================

/**
 * Criptografa dados sensíveis usando AES-GCM
 */
async function encryptData(data, password = 'yamar_secure_key_2025') {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    // Gera salt e IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Deriva chave do password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // Criptografa
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );
    
    // Combina salt + iv + dados criptografados
    const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    // Converte para base64
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    return null;
  }
}

/**
 * Descriptografa dados
 */
async function decryptData(encryptedData, password = 'yamar_secure_key_2025') {
  try {
    // Converte de base64
    const data = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );
    
    // Extrai salt, IV e dados criptografados
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);
    
    const encoder = new TextEncoder();
    
    // Deriva chave do password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Descriptografa
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );
    
    // Converte para string e parseia JSON
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return null;
  }
}

// ============================================
// PROTEÇÃO DE DADOS NO LOCALSTORAGE
// ============================================

/**
 * Salva dados criptografados no localStorage
 */
async function secureSetItem(key, value) {
  try {
    const encrypted = await encryptData(value);
    if (encrypted) {
      localStorage.setItem(key, encrypted);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao salvar item seguro:', error);
    return false;
  }
}

/**
 * Recupera dados criptografados do localStorage
 */
async function secureGetItem(key) {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    return await decryptData(encrypted);
  } catch (error) {
    console.error('Erro ao recuperar item seguro:', error);
    return null;
  }
}

// ============================================
// PROTEÇÃO CONTRA CLICKJACKING
// ============================================

/**
 * Previne que a página seja carregada em iframe
 */
function preventClickjacking() {
  if (window !== window.top) {
    window.top.location = window.location;
  }
}

// ============================================
// HEADERS DE SEGURANÇA
// ============================================

/**
 * Adiciona meta tags de segurança
 */
function addSecurityHeaders() {
  const head = document.head;
  
  // CSP NÃO é definido aqui para permitir imagens externas (Imgur)
  // Apenas headers básicos de segurança
  
  // X-Content-Type-Options
  const xcto = document.createElement('meta');
  xcto.httpEquiv = 'X-Content-Type-Options';
  xcto.content = 'nosniff';
  head.appendChild(xcto);
  
  // X-Frame-Options
  const xfo = document.createElement('meta');
  xfo.httpEquiv = 'X-Frame-Options';
  xfo.content = 'DENY';
  head.appendChild(xfo);
  
  // Referrer Policy
  const rp = document.createElement('meta');
  rp.name = 'referrer';
  rp.content = 'strict-origin-when-cross-origin';
  head.appendChild(rp);
  
  // Permissions Policy
  const pp = document.createElement('meta');
  pp.httpEquiv = 'Permissions-Policy';
  pp.content = 'geolocation=(), microphone=(), camera=()';
  head.appendChild(pp);
  
  console.log('✅ Security headers ativados (sem CSP para permitir Imgur)');
}

// ============================================
// DETECÇÃO DE ATAQUES
// ============================================

/**
 * Detecta tentativas de SQL Injection
 */
function detectSQLInjection(input) {
  const sqlPatterns = [
    /(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b).*?['"=]/i,
    /['"]\s*(OR|AND)\s*['"]\s*['"]\s*=/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Detecta tentativas de XSS
 */
function detectXSS(input) {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe[^>]*>/i,
    /eval\(/i,
    /expression\(/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Detecta tentativas de Path Traversal
 */
function detectPathTraversal(input) {
  const pathPatterns = [
    /\.\.\//,
    /\.\.%2[fF]/,
    /%2e%2e%2[fF]/,
    /\.\.\\|/
  ];
  
  return pathPatterns.some(pattern => pattern.test(input));
}

/**
 * Valida input e detecta ataques
 */
function securityCheck(input) {
  if (detectSQLInjection(input)) {
    console.warn('⚠️ Tentativa de SQL Injection detectada!');
    return { safe: false, threat: 'SQL Injection' };
  }
  
  if (detectXSS(input)) {
    console.warn('⚠️ Tentativa de XSS detectada!');
    return { safe: false, threat: 'XSS' };
  }
  
  if (detectPathTraversal(input)) {
    console.warn('⚠️ Tentativa de Path Traversal detectada!');
    return { safe: false, threat: 'Path Traversal' };
  }
  
  return { safe: true, threat: null };
}

// ============================================
// MONITORAMENTO DE SEGURANÇA
// ============================================

const securityLog = [];

/**
 * Registra evento de segurança
 */
function logSecurityEvent(type, details) {
  const event = {
    type,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  securityLog.push(event);
  
  // Mantém apenas os últimos 100 eventos
  if (securityLog.length > 100) {
    securityLog.shift();
  }
  
  // Em produção, enviar para servidor
  console.warn('🔒 Evento de Segurança:', event);
}

/**
 * Obtém log de segurança
 */
function getSecurityLog() {
  return securityLog;
}

// ============================================
// PROTEÇÃO DE FORMULÁRIOS
// ============================================

/**
 * Protege formulário contra submissões maliciosas
 */
function protectForm(form) {
  // Adiciona token CSRF
  addCSRFTokenToForm(form);
  
  // Adiciona validação de segurança
  form.addEventListener('submit', function(e) {
    const formData = new FormData(form);
    
    // Valida CSRF token
    const csrfToken = formData.get('csrf_token');
    if (!validateCSRFToken(csrfToken)) {
      e.preventDefault();
      logSecurityEvent('CSRF_VIOLATION', { form: form.id });
      if (typeof showToast === 'function') {
        showToast('Erro de segurança. Recarregue a página.', 'error');
      }
      return false;
    }
    
    // Verifica rate limit
    const rateLimit = checkRateLimit(`form_${form.id}`, 10, 60000);
    if (!rateLimit.allowed) {
      e.preventDefault();
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { form: form.id });
      if (typeof showToast === 'function') {
        showToast(`Muitas tentativas. Aguarde ${rateLimit.resetIn} segundos.`, 'error');
      }
      return false;
    }
    
    // Valida todos os inputs
    const inputs = form.querySelectorAll('input, textarea');
    for (const input of inputs) {
      if (input.type === 'hidden' || input.name === 'csrf_token') continue;
      
      const check = securityCheck(input.value);
      if (!check.safe) {
        e.preventDefault();
        logSecurityEvent('ATTACK_DETECTED', { 
          form: form.id,
          field: input.name,
          threat: check.threat
        });
        if (typeof showToast === 'function') {
          showToast('Input suspeito detectado. Operação bloqueada.', 'error');
        }
        return false;
      }
    }
  });
}

// ============================================
// INICIALIZAÇÃO DE SEGURANÇA
// ============================================

/**
 * Inicializa todas as proteções de segurança
 */
function initSecurity() {
  // Previne clickjacking
  preventClickjacking();
  
  // Adiciona headers de segurança
  addSecurityHeaders();
  
  // Gera token CSRF inicial
  generateCSRFToken();
  
  // Protege todos os formulários
  document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (!form.hasAttribute('data-no-csrf')) {
        protectForm(form);
      }
    });
  });
  
  // Log de inicialização
  console.log('🔒 Sistema de segurança ativado');
  logSecurityEvent('SECURITY_INIT', { status: 'success' });
}

// ============================================
// EXPORTAÇÃO DE FUNÇÕES
// ============================================

// Inicializa automaticamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSecurity);
} else {
  initSecurity();
}
