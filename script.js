// tab switch
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// menu & cart logic
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

orderBtn.addEventListener('click', () => {
  if (!cart.length) return alert('Savat bo‘sh!');
  const order = cart.map(i => `${i.name} x${i.qty}`).join(', ') +
                `\nJami: ${cart.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString()} so‘m`;
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify({ order }));
    window.Telegram.WebApp.close();
  } else {
    alert('Buyurtma:\n' + order);
  }
});
