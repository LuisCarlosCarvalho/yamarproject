const { JSDOM } = require('jsdom');
const fs = require('fs');
const vm = require('vm');

(async function(){
  try {
    const html = `<!doctype html><html><body>
      <form id="shopSettingsForm"><label><input type="checkbox" id="shopEnabled" /></label><button type="submit">Guardar</button></form>
      <a class="shop-link" id="shopLink">ShopLink</a>
      <div id="cartIconBtn" style="display:flex">cart</div>
      <div id="productsSection" style="display:block">products</div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const context = dom.getInternalVMContext();

    // Expose window/document/localStorage to the context
    context.window = dom.window;
    context.document = dom.window.document;
    context.localStorage = dom.window.localStorage;
    context.console = console;

    // Seed a currentSession admin and default siteSettings
    dom.window.localStorage.setItem('currentSession', JSON.stringify({ userId: '1', email: 'admin@yemarmakeup.pt', nome: 'Admin', role: 'admin' }));
    dom.window.localStorage.setItem('siteSettings', JSON.stringify({ shopEnabled: true }));

    // Load storage.js and app.js into the JSDOM context
    const storageCode = fs.readFileSync('js/storage.js', 'utf8');
    const appCode = fs.readFileSync('js/app.js', 'utf8');

    vm.runInContext(storageCode, context);
    vm.runInContext(appCode, context);

    // Call loadAdminPage to initialize handlers
    if (typeof dom.window.loadAdminPage !== 'function') {
      console.error('loadAdminPage() não definida no contexto');
      process.exit(2);
    }

    dom.window.loadAdminPage();

    // Verificar estado inicial do checkbox (deve refletir siteSettings)
    console.log('Checkbox inicial:', dom.window.document.getElementById('shopEnabled').checked);

    // Simular desmarcar e submeter o form
    dom.window.document.getElementById('shopEnabled').checked = false;
    const ev = new dom.window.Event('submit', { bubbles: true, cancelable: true });
    dom.window.document.getElementById('shopSettingsForm').dispatchEvent(ev);

    // Ler estilos aplicados
    const linkDisplay = dom.window.document.querySelector('.shop-link').style.display;
    const cartDisplay = dom.window.document.getElementById('cartIconBtn').style.display;
    const prodDisplay = dom.window.document.getElementById('productsSection').style.display;

    console.log('Após submit -> shop-link:', linkDisplay, 'cartIconBtn:', cartDisplay, 'productsSection:', prodDisplay);

    const pass = cartDisplay === 'none' && prodDisplay === 'none';
    if (pass) {
      console.log('TEST PASS: toggle aplicado corretamente (elementos ocultos)');
      process.exit(0);
    } else {
      console.error('TEST FAIL: toggle não aplicou corretamente');
      process.exit(3);
    }
  } catch (err) {
    console.error('Erro no teste:', err);
    process.exit(4);
  }
})();
