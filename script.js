// script.js
// script.js
const menuGrid = document.getElementById('menuGrid');

// Sizning menyudagi mahsulotlar (rasmga mos)
const menu = [
  { name: 'Klyukva-Burger kombo',  price: 64000, img: 'https://i.imgur.com/1.jpg' },
  { name: 'Klyukva-Lavash kombo',  price: 59000, img: 'https://i.imgur.com/2.jpg' },
  { name: 'Klyukva-Trindwich kombo', price: 62000, img: 'https://i.imgur.com/3.jpg' },
  { name: 'Klyukva-Burger',        price: 44000, img: 'https://i.imgur.com/4.jpg' },
];

// Kartochka yaratish
menu.forEach(item => {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <h3>${item.name}</h3>
    <div class="price">${item.price.toLocaleString()} so‘m</div>
    <button data-name="${item.name}" data-price="${item.price}">Savatchaga</button>
  `;

  menuGrid.appendChild(card);
});

// Tugma bosilganda Telegram’ga yuborish
menuGrid.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const { name, price } = e.target.dataset;
    const order = { item: name, price: parseInt(price) };

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(order));
      window.Telegram.WebApp.close();
    } else {
      alert(`Buyurtma: ${name} – ${price} so‘m`);
    }
  }
});
