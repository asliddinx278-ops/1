// ===== TAB SWITCH =====
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== MODAL ELEMENTS =====
const profModal   = document.getElementById('profModal');
const modalName   = document.getElementById('modalName');
const modalPhone  = document.getElementById('modalPhone');
const modalSave   = document.getElementById('modalSave');

// ===== PROFILE LOAD / SAVE =====
function loadProfile() {
  const saved = localStorage.getItem('bodrumProfile');
  if (saved) {
    const { name, phone } = JSON.parse(saved);
    document.getElementById('inpName').value  = name;
    document.getElementById('inpPhone').value = phone;
    modalName.value  = name;
    modalPhone.value = phone;
  }
}
function saveProfile(name, phone) {
  localStorage.setItem('bodrumProfile', JSON.stringify({ name, phone }));
  document.getElementById('inpName').value  = name;
  document.getElementById('inpPhone').value = phone;
}

// ===== MODAL OPEN / CLOSE =====
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

// ===== CART & ORDER =====
const menuGrid = document.getElementById('menuGrid');
const cartList = document.getElementById('cartList');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const orderBtn = document.getElementById('orderBtn');

let cart = [];

const menu = [
  { id: 1, name: 'Klyukva-Burger kombo',  price: 64000, img: 'https://i.imgur.com/1.jpg' },
  { id: 2, name: 'Klyukva-Lavash kombo',  price: 59000, img: 'https://i.imgur.com/2.jpg' },
  { id: 3, name: 'Klyukva-Trindwich kombo', price: 62000, img: 'https://i.imgur.com/3.jpg' },
  { id: 4, name: 'Klyukva-Burger',        price: 44000, img: 'https://i.imgur.com/4.jpg' },
];

menu.forEach(item => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <h3>${item.name}</h3>
    <div class="price">${item.price.toLocaleString()} so‘m</div>
    <button data-id="${item.id}">Savatchaga</button>
  `;
  menuGrid.appendChild(card);
});

menuGrid.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const id = parseInt(e.target.dataset.id);
    const product = menu.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    renderCart();
  }
});

function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>${(item.price * item.qty).toLocaleString()} so‘m</span>
    `;
    cartList.appendChild(div);
  });
  cartBadge.textContent = cart.reduce((s, i) => s + i.qty, 0);
  cartTotal.textContent = `Umumiy: ${total.toLocaleString()} so‘m`;
}

// ===== ORDER FLOW =====
orderBtn.addEventListener('click', () => {
  if (!cart.length) return alert('Savat bo‘sh!');

  // 1) check profile
  const saved = localStorage.getItem('bodrumProfile');
  if (!saved) return openProfModal();
  const { name, phone } = JSON.parse(saved);
  if (!name || !phone) return openProfModal();

  // 2) get location
  getLocationAndFinish();
});

function getLocationAndFinish() {
  // loading
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

// ===== PROFILE SAVE (inside profile page) =====
document.getElementById('saveProf').addEventListener('click', () => {
  const name  = document.getElementById('inpName').value.trim();
  const phone = document.getElementById('inpPhone').value.trim();
  if (!name || !phone) return alert('Iltimos, hammasini to‘ldiring!');
  saveProfile(name, phone);
  alert('✅ Saqlangan!');
});

// ===== INIT =====
loadProfile();
renderOrders();
