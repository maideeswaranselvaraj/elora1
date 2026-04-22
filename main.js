/* ===========================
   ELORA – main.js
   All page logic
=========================== */

// =====================
// NAV SCROLL & HAMBURGER
// =====================
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// =====================
// PRODUCT DATA (default)
// =====================
const defaultProducts = [
  {
    id: 1,
    name: 'Rose Noir',
    family: 'Floral Oriental',
    price: 499,
    emoji: '🌹',
    gradient: 'linear-gradient(135deg,#c9a96e,#8b5e3c)',
    notes: 'Bergamot · Bulgarian Rose · Oud',
    desc: 'A bold, romantic composition that opens with bright bergamot, blooms into lush Bulgarian rose, and dries down to a rich oud base. Irresistible.',
    badge: 'Best Seller',
    badgeClass: 'badge-bs',
    tags: ['floral', 'oriental']
  },
  {
    id: 2,
    name: 'Bleu Mystère',
    family: 'Aquatic Fresh',
    price: 499,
    emoji: '🌊',
    gradient: 'linear-gradient(135deg,#6b8fa3,#2c4a5e)',
    notes: 'Sea Salt · Jasmine · White Musk',
    desc: 'Crisp ocean air, sheer jasmine petals, and a soft, lingering musk trail. Modern, clean, and utterly addictive for everyday wear.',
    badge: 'Top Rated',
    badgeClass: 'badge-bs',
    tags: ['fresh']
  },
  {
    id: 3,
    name: 'Velvet Dusk',
    family: 'Woody Gourmand',
    price: 499,
    emoji: '🌙',
    gradient: 'linear-gradient(135deg,#8a6a9a,#4a2c6e)',
    notes: 'Cardamom · Iris · Mysore Sandalwood',
    desc: 'Spiced cardamom meets cool iris and a warm sandalwood base. This is the fragrance for golden hours and intimate evenings.',
    badge: 'New Arrival',
    badgeClass: 'badge-new',
    tags: ['woody', 'oriental']
  },
  {
    id: 4,
    name: 'Sakura Gold',
    family: 'Soft Floral',
    price: 499,
    emoji: '🌸',
    gradient: 'linear-gradient(135deg,#c2a96b,#7a6030)',
    notes: 'Yuzu · Cherry Blossom · Warm Amber',
    desc: 'A delicate dance of Japanese cherry blossom and zesty yuzu, anchored beautifully by warm, honeyed amber. Feminine and luminous.',
    badge: 'Trending',
    badgeClass: 'badge-bs',
    tags: ['floral']
  },
  {
    id: 5,
    name: 'Cedar Sage',
    family: 'Fresh Woody',
    price: 499,
    emoji: '🌲',
    gradient: 'linear-gradient(135deg,#5a8a6a,#2a5a3a)',
    notes: 'Lemon Verbena · Green Sage · Cedarwood',
    desc: 'The scent of a forest morning. Zesty verbena sparkles above a heart of aromatic sage, grounded in warm, dry cedarwood.',
    badge: null,
    badgeClass: '',
    tags: ['fresh', 'woody']
  },
  {
    id: 6,
    name: 'Amber Soleil',
    family: 'Warm Oriental',
    price: 499,
    emoji: '☀️',
    gradient: 'linear-gradient(135deg,#d4a853,#9a6820)',
    notes: 'Saffron · Tuberose · Benzoin Amber',
    desc: 'Sun-warmed saffron and velvety tuberose bloom into a rich benzoin amber base. Opulent, sensual, and deeply comforting.',
    badge: null,
    badgeClass: '',
    tags: ['oriental']
  },
  {
    id: 7,
    name: 'Noir Absolu',
    family: 'Dark Woody',
    price: 499,
    emoji: '🖤',
    gradient: 'linear-gradient(135deg,#3a3a3a,#1a1a1a)',
    notes: 'Black Pepper · Vetiver · Patchouli',
    desc: 'Intensely smoky and commanding. Black pepper electrifies a dark vetiver heart that slowly deepens into earthy, resinous patchouli.',
    badge: 'Limited',
    badgeClass: 'badge-new',
    tags: ['woody', 'oriental']
  }
];

// =====================
// STORAGE HELPERS
// =====================
function getProducts() {
  const stored = localStorage.getItem('elora_products');
  return stored ? JSON.parse(stored) : defaultProducts;
}

function saveProducts(products) {
  localStorage.setItem('elora_products', JSON.stringify(products));
}

function getNextId(products) {
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

// =====================
// PRODUCTS PAGE
// =====================
const productsGrid = document.getElementById('productsGrid');
const adminBody = document.getElementById('adminBody');
const toggleAdmin = document.getElementById('toggleAdmin');
const saveProductBtn = document.getElementById('saveProduct');
const cancelEdit = document.getElementById('cancelEdit');
const adminMsg = document.getElementById('adminMsg');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';
let editingId = null;

if (productsGrid) {
  renderProducts();
  setupAdmin();
  setupFilters();
}

function renderProducts() {
  const products = getProducts();
  const filtered = currentFilter === 'all'
    ? products
    : products.filter(p => p.tags && p.tags.includes(currentFilter));

  productsGrid.innerHTML = '';

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="product-img" style="background:${product.gradient || 'linear-gradient(135deg,#c9a96e,#8b5e3c)'}">
        <div class="product-badges">
          ${product.badge ? `<span class="badge ${product.badgeClass}">${product.badge}</span>` : ''}
        </div>
        <span style="filter:drop-shadow(0 4px 12px rgba(0,0,0,0.25));font-size:4.5rem">${product.emoji || '🌸'}</span>
      </div>
      <div class="product-info">
        <p class="product-family">${product.family}</p>
        <h3>ELORA ${product.name}</h3>
        <p class="product-notes">${product.notes}</p>
        <p class="product-desc">${product.desc}</p>
        <div class="product-bottom">
          <span class="product-price">₹${product.price}</span>
          <div class="product-actions">
            <button class="btn-edit" onclick="editProduct(${product.id}, event)">Edit</button>
            <button class="btn-delete" onclick="deleteProduct(${product.id}, event)">Delete</button>
            <button class="btn-small" onclick="buyProduct(${product.id}, event)">Buy Now</button>
          </div>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = '<p style="color:var(--text-light);font-size:0.9rem;padding:2rem;text-align:center;">No products found in this category.</p>';
  }
}

function setupFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProducts();
    });
  });
}

function setupAdmin() {
  if (!toggleAdmin) return;

  toggleAdmin.addEventListener('click', () => {
    adminBody.style.display = adminBody.style.display === 'none' ? 'block' : 'none';
  });

  if (saveProductBtn) {
    saveProductBtn.addEventListener('click', () => {
      const name = document.getElementById('pName').value.trim();
      const family = document.getElementById('pFamily').value.trim();
      const price = parseInt(document.getElementById('pPrice').value) || 499;
      const emoji = document.getElementById('pEmoji').value.trim() || '🌸';
      const gradient = document.getElementById('pGradient').value.trim()
        ? `linear-gradient(135deg,${document.getElementById('pGradient').value.trim()})`
        : 'linear-gradient(135deg,#c9a96e,#8b5e3c)';
      const notes = document.getElementById('pNotes').value.trim();
      const desc = document.getElementById('pDesc').value.trim();

      if (!name || !family) {
        showAdminMsg('Please fill in Name and Family fields.', 'error');
        return;
      }

      const products = getProducts();

      if (editingId !== null) {
        const idx = products.findIndex(p => p.id === editingId);
        if (idx !== -1) {
          products[idx] = { ...products[idx], name, family, price, emoji, gradient, notes, desc };
          saveProducts(products);
          showAdminMsg(`"${name}" updated successfully!`, 'success');
        }
        resetForm();
      } else {
        const newProduct = {
          id: getNextId(products),
          name, family, price, emoji, gradient, notes, desc,
          badge: null, badgeClass: '', tags: ['floral']
        };
        products.push(newProduct);
        saveProducts(products);
        showAdminMsg(`"${name}" added to your collection!`, 'success');
        resetForm();
      }

      renderProducts();
    });
  }

  if (cancelEdit) {
    cancelEdit.addEventListener('click', resetForm);
  }
}

function editProduct(id, e) {
  if (e) e.stopPropagation();
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;

  editingId = id;
  document.getElementById('pName').value = product.name;
  document.getElementById('pFamily').value = product.family;
  document.getElementById('pPrice').value = product.price;
  document.getElementById('pEmoji').value = product.emoji || '';
  document.getElementById('pNotes').value = product.notes || '';
  document.getElementById('pDesc').value = product.desc || '';

  document.getElementById('formTitle').textContent = `Edit: ELORA ${product.name}`;
  document.getElementById('cancelEdit').style.display = 'inline-flex';

  if (adminBody) adminBody.style.display = 'block';
  adminBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteProduct(id, e) {
  if (e) e.stopPropagation();
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;
  if (!confirm(`Delete "ELORA ${product.name}"? This cannot be undone.`)) return;

  const updated = products.filter(p => p.id !== id);
  saveProducts(updated);
  renderProducts();
}

function buyProduct(id, e) {
  if (e) e.stopPropagation();
  localStorage.setItem('elora_checkout_product', id);
  window.location.href = 'checkout.html';
}

function resetForm() {
  editingId = null;
  ['pName','pFamily','pPrice','pEmoji','pGradient','pNotes','pDesc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = id === 'pPrice' ? '499' : '';
  });
  if (document.getElementById('formTitle')) document.getElementById('formTitle').textContent = 'Add New Product';
  if (cancelEdit) cancelEdit.style.display = 'none';
}

function showAdminMsg(msg, type) {
  if (!adminMsg) return;
  adminMsg.textContent = msg;
  adminMsg.className = `admin-msg ${type}`;
  setTimeout(() => { adminMsg.textContent = ''; adminMsg.className = 'admin-msg'; }, 3000);
}

// =====================
// BEST SELLERS SLIDER
// =====================
const bsSlider = document.getElementById('bsSlider');
const bsPrev = document.getElementById('bsPrev');
const bsNext = document.getElementById('bsNext');
const bsDots = document.getElementById('bsDots');

if (bsSlider) {
  let bsIndex = 0;
  const cards = bsSlider.querySelectorAll('.bs-card');
  const visible = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;

  function buildDots() {
    if (!bsDots) return;
    const total = Math.ceil(cards.length / visible());
    bsDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === bsIndex ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      bsDots.appendChild(d);
    }
  }

  function goTo(i) {
    const maxIndex = Math.ceil(cards.length / visible()) - 1;
    bsIndex = Math.max(0, Math.min(i, maxIndex));
    const card = cards[0];
    const cardW = card.offsetWidth + 32; // gap
    bsSlider.style.transform = `translateX(-${bsIndex * visible() * cardW}px)`;
    buildDots();
    document.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === bsIndex));
  }

  if (bsPrev) bsPrev.addEventListener('click', () => goTo(bsIndex - 1));
  if (bsNext) bsNext.addEventListener('click', () => goTo(bsIndex + 1));

  buildDots();
  window.addEventListener('resize', () => { bsIndex = 0; goTo(0); buildDots(); });
}

// =====================
// CHECKOUT PAGE
// =====================
const formStep1 = document.getElementById('formStep1');
const formStep2 = document.getElementById('formStep2');
const formStep3 = document.getElementById('formStep3');
const toStep2 = document.getElementById('toStep2');
const toStep3 = document.getElementById('toStep3');
const backStep1 = document.getElementById('backStep1');
const step2Tab = document.getElementById('step2');
const step3Tab = document.getElementById('step3');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyVal = document.getElementById('qtyVal');
const subtotalEl = document.getElementById('subtotal');
const orderTotalEl = document.getElementById('orderTotal');
const discountRow = document.getElementById('discountRow');
const discountAmt = document.getElementById('discountAmt');
const promoCode = document.getElementById('promoCode');
const applyPromo = document.getElementById('applyPromo');
const promoMsg = document.getElementById('promoMsg');
const orderItemEl = document.getElementById('orderItem');
const orderSummaryConfirm = document.getElementById('orderSummaryConfirm');

let qty = 1;
let basePrice = 499;
let discount = 0;
const PROMOS = { 'ELORA10': 10, 'WELCOME20': 20, 'FIRST50': 50 };

if (formStep1) {
  // Load product
  const pid = localStorage.getItem('elora_checkout_product');
  const products = getProducts();
  const product = pid ? products.find(p => p.id === parseInt(pid)) : products[0];

  if (product && orderItemEl) {
    basePrice = product.price;
    orderItemEl.innerHTML = `
      <div class="order-item-img" style="background:${product.gradient}">${product.emoji}</div>
      <div class="order-item-name">ELORA ${product.name}</div>
      <div class="order-item-family">${product.family}</div>
    `;
    updateTotal();
  }

  // Qty
  if (qtyMinus) qtyMinus.addEventListener('click', () => { if (qty > 1) { qty--; qtyVal.textContent = qty; updateTotal(); } });
  if (qtyPlus) qtyPlus.addEventListener('click', () => { qty++; qtyVal.textContent = qty; updateTotal(); });

  function updateTotal() {
    const sub = basePrice * qty;
    if (subtotalEl) subtotalEl.textContent = `₹${sub}`;
    const discVal = Math.round(sub * discount / 100);
    if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';
    if (discountAmt) discountAmt.textContent = `-₹${discVal}`;
    if (orderTotalEl) orderTotalEl.textContent = `₹${sub - discVal}`;
  }

  // Promo
  if (applyPromo) {
    applyPromo.addEventListener('click', () => {
      const code = promoCode.value.trim().toUpperCase();
      if (PROMOS[code]) {
        discount = PROMOS[code];
        promoMsg.textContent = `✓ ${discount}% discount applied!`;
        promoMsg.className = 'ok';
        updateTotal();
      } else {
        promoMsg.textContent = '✗ Invalid promo code.';
        promoMsg.className = 'no';
      }
    });
  }

  // Payment toggle
  document.querySelectorAll('.payment-opt').forEach(opt => {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const val = this.querySelector('input').value;
      const upiF = document.getElementById('upiFields');
      const cardF = document.getElementById('cardFields');
      if (upiF) upiF.style.display = val === 'upi' ? 'block' : 'none';
      if (cardF) cardF.style.display = val === 'card' ? 'block' : 'none';
    });
  });

  // Step navigation
  if (toStep2) {
    toStep2.addEventListener('click', () => {
      const firstName = document.getElementById('firstName')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const address = document.getElementById('address')?.value.trim();
      const city = document.getElementById('city')?.value.trim();
      const pincode = document.getElementById('pincode')?.value.trim();

      if (!firstName || !email || !phone || !address || !city || !pincode) {
        alert('Please fill in all required fields.');
        return;
      }
      formStep1.style.display = 'none';
      formStep2.style.display = 'block';
      if (step2Tab) step2Tab.classList.add('active');
    });
  }

  if (backStep1) {
    backStep1.addEventListener('click', () => {
      formStep2.style.display = 'none';
      formStep1.style.display = 'block';
      if (step2Tab) step2Tab.classList.remove('active');
    });
  }

  if (toStep3) {
    toStep3.addEventListener('click', () => {
      formStep2.style.display = 'none';
      formStep3.style.display = 'block';
      if (step2Tab) step2Tab.classList.add('active');
      if (step3Tab) step3Tab.classList.add('active');

      // Order confirm
      const sub = basePrice * qty;
      const discVal = Math.round(sub * discount / 100);
      const total = sub - discVal;
      const orderId = 'ELR' + Date.now().toString().slice(-6);

      if (orderSummaryConfirm && product) {
        orderSummaryConfirm.innerHTML = `
          <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem">
            <div style="width:50px;height:50px;border-radius:4px;background:${product.gradient};display:flex;align-items:center;justify-content:center;font-size:1.8rem">${product.emoji}</div>
            <div><div style="font-weight:600;font-size:0.9rem">ELORA ${product.name}</div><div style="color:var(--text-light);font-size:0.78rem">${product.family}</div></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-light);margin-bottom:4px"><span>Order ID</span><strong style="color:var(--dark)">#${orderId}</strong></div>
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-light);margin-bottom:4px"><span>Qty</span><span>${qty}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-light);margin-bottom:4px"><span>Shipping</span><span style="color:#27ae60">FREE</span></div>
          ${discount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-light);margin-bottom:4px"><span>Discount (${discount}%)</span><span style="color:#27ae60">-₹${discVal}</span></div>` : ''}
          <div style="display:flex;justify-content:space-between;font-size:0.95rem;font-weight:600;padding-top:0.75rem;border-top:1px solid var(--cream2);margin-top:0.75rem"><span>Total Paid</span><span>₹${total}</span></div>
          <div style="margin-top:1rem;padding:0.75rem;background:#d4edda;border-radius:3px;font-size:0.78rem;color:#155724;text-align:center">📦 Expected delivery in 3–5 business days</div>
        `;
      }
      localStorage.removeItem('elora_checkout_product');
    });
  }
}
