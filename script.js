// ===== TAB SWITCH =====
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== MODAL =====
const profModal   = document.getElementById('profModal');
const modalName   = document.getElementById('modalName');
const modalPhone  = document.getElementById('modalPhone');
const modalSave   = document.getElementById('modalSave');

function openProfModal() { profModal.classList.add('show'); }
function closeProfModal() { profModal.classList.remove('show'); }

modalSave.addEventListener('click', () => {
  const name  = modalName.value.trim();
  const phone = modalPhone.value.trim();
  if (!name || !phone) return alert('Iltimos, hammasini to‘ldiring!');
  saveProfile(name, phone);
  closeProfModal();
  getLocationAndFinish();
});

function saveProfile(name, phone) {
  localStorage.setItem('bodrumProfile', JSON.stringify({ name, phone }));
  document.getElementById('inpName').value  = name;
  document.getElementById('inpPhone').value = phone;
}

// ===== CART =====
const menuGrid   = document.getElementById('menuGrid');
const cartList   = document.getElementById('cartList');
const cartBadge  = document.getElementById('cartBadge');
const cartTotal  = document.getElementById('cartTotal');
const orderBtn   = document.getElementById('orderBtn');

let cart = [];

const menu = [
  { id: 1, name: 'Klyukva-Burger kombo',  price: 64000, img: 'https://i.imgur.com/1.jpg' },
  { id: 2, name: 'Klyukva-Lavash kombo',  price: 59000, img: 'https://i.imgur.com/2.jpg' },
  { id: 3, name: 'Klyukva-Trindwich kombo', price: 62000, img: 'https://i.imgur.com/3.jpg' },
  { id: 4, name: 'Klyukva-Burger',        price: 44000, img: 'https://i.imgur.com/4.jpg' },
];

// ===== RENDER MENU =====
menu.forEach(item => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <h3>${item.name}</h3>
    <div class="price">${item.price.toLocaleString()} so‘m</div>
    <button class="add-btn-only" data-id="${item.id}">Savatchaga</button>
  `;
  menuGrid.appendChild(card);
});

// ===== ADD TO CART (1 dona, porsiya tanlash yo‘q) =====
menuGrid.addEventListener('click', e => {
  if (e.target.classList.contains('add-btn-only')) {
    const id = parseInt(e.target.dataset.id);
    const product = menu.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    renderCart();
  }
});

// ===== RENDER CART =====
function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} so‘m</div>
      </div>
      <div class="cart-item-controls">
        <div class="cart-item-qty">
          <button data-idx="${idx}" data-act="-">−</button>
          <span>${item.qty}</span>
          <button data-idx="${idx}" data-act="+">+</button>
        </div>
        <button class="cart-item-delete" data-idx="${idx}">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    `;
    cartList.appendChild(div);
  });
  cartBadge.textContent = cart.reduce((s, i) => s + i.qty, 0);
  cartTotal.textContent = `Umumiy: ${total.toLocaleString()} so‘m`;
}

// ===== CART QTY +/- & DELETE =====
cartList.addEventListener('click', e => {
  const idx = e.target.dataset.idx;
  if (idx === undefined) return;
  const i = parseInt(idx);
  if (e.target.dataset.act === '+') cart[i].qty++;
  if (e.target.dataset.act === '-') cart[i].qty = Math.max(1, cart[i].qty - 1);
  if (e.target.closest('.cart-item-delete')) cart.splice(i, 1);
  renderCart();
});

// ===== ORDER FLOW =====
orderBtn.addEventListener('click', () => {
  if (!cart.length) return alert('Savat bo‘sh!');
  const saved = localStorage.getItem('bodrumProfile');
  if (!saved) return openProfModal();
  const { name, phone } = JSON.parse(saved);
  if (!name || !phone) return openProfModal();
  getLocationAndFinish();
});

function getLocationAndFinish() {
  cartList.innerHTML = '<div class="loader"></div>';
  cartTotal.textContent = 'Joylashuv aniqlanmoqda...';
  if (!navigator.geolocation) return finishOrder(null);
  navigator.geolocation.getCurrentPosition(
    pos => finishOrder({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    err => finishOrder(null)
  );
}

function finishOrder(location) {
  const { name, phone } = JSON.parse(localStorage.getItem('bodrumProfile'));
  const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const orderText = `👤 ${name} | 📞 +998${phone}\n📦 ${items}\n💰 Jami: ${total.toLocaleString()} so‘m` +
                    (location ? `\n📍 https://maps.google.com/?q=${location.lat},${location.lng}` : '');

  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify({ order: orderText }));
  } else {
    alert('Buyurtma qabul qilindi!\n' + orderText);
  }
  saveOrder(orderText);
  cart = [];
  renderCart();
}

function saveOrder(text) {
  const orders = JSON.parse(localStorage.getItem('bodrumOrders') || '[]');
  orders.unshift({ text, date: new Date().toLocaleString('uz') });
  localStorage.setItem('bodrumOrders', JSON.stringify(orders));
  renderOrders();
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('bodrumOrders') || '[]');
  const list = document.getElementById('ordersList');
  if (!orders.length) return list.innerHTML = 'Hali buyurtma yo‘q';
  list.innerHTML = orders.map(o => `
    <div class="order-item">
      <div>${o.text.replace(/\n/g, '<br>')}</div>
      <div class="order-date">${o.date}</div>
    </div>
  `).join('');
}

// ===== PROFILE SAVE =====
document.getElementById('saveProf').addEventListener('click', () => {
  const name  = document.getElementById('inpName').value.trim();
  const phone = document.getElementById('inpPhone').value.trim();
  if (!name || !phone) return alert('Iltimos, hammasini to‘ldiring!');
  saveProfile(name, phone);
  alert('✅ Saqlangan!');
});

// ===== INIT =====
renderOrders();
