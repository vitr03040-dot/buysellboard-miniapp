const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const API = 'https://ВАШ-СЕРВЕР.onrender.com';

loadAds();

async function loadAds() {
    const res = await fetch(`${API}/api/ads`);
    const ads = await res.json();
    const grid = document.getElementById('adsGrid');
    grid.innerHTML = ads.map(ad => `
        <div class="ad-card">
            <div class="ad-title">${ad.title}</div>
            <div class="ad-price">${ad.price} ₽</div>
        </div>
    `).join('');
}

function showForm() { document.getElementById('adForm').style.display = 'block'; }
function hideForm() { document.getElementById('adForm').style.display = 'none'; }

async function submit() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const contact = document.getElementById('contact').value;
    
    await fetch(`${API}/api/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, price, contact, user_id: tg.initDataUnsafe?.user?.id })
    });
    
    tg.showAlert('✅ Опубликовано!');
    hideForm();
    loadAds();
}