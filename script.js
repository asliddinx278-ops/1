// script.js
const btn = document.getElementById('sendBtn');
const itemSel = document.getElementById('item');

btn.addEventListener('click', () => {
  const [name, priceStr] = itemSel.value.split(' – ');
  const price = parseInt(priceStr.replace(/\D/g, ''));

  const order = { item: name, price };

  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(order));
    window.Telegram.WebApp.close();
  } else {
    alert('Buyurtma: ' + JSON.stringify(order));
  }
});