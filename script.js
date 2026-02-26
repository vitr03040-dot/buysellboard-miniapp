const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ⚠️ Замените на вашу реальную ссылку от Render!
const API = 'https://buysellboard.onrender.com';

// Загружаем объявления при старте
loadAds();

async function loadAds() {
    try {
        const res = await fetch(`${API}/api/ads`);
        const ads = await res.json();
        renderAds(ads);
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('adsGrid').innerHTML = '<p style="grid-column:1/-1;text-align:center">Ошибка загрузки</p>';
    }
}

function renderAds(ads) {
    const grid = document.getElementById('adsGrid');
    
    if (ads.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999">Пока нет объявлений</p>';
        return;
    }
    
    grid.innerHTML = ads.map(ad => `
        <div class="ad-card" onclick='showDetails(${JSON.stringify(ad)})'>
            <div class="ad-title">${ad.title}</div>
            <div class="ad-price">${ad.price} ₽</div>
        </div>
    `).join('');
}

// Функция показа деталей объявления
function showDetails(ad) {
    const text = `🔹 *${ad.title}*\n\n${ad.description || 'Без описания'}\n\n💰 ${ad.price} ₽\n\n📞 ${ad.contact}`;
    tg.showAlert(text.replace(/\*/g, ''));
}

// Показать форму добавления
function showForm() { 
    document.getElementById('adForm').style.display = 'block'; 
}

// Скрыть форму
function hideForm() { 
    document.getElementById('adForm').style.display = 'none'; 
}

// Отправка нового объявления
async function submit() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const contact = document.getElementById('contact').value;
    
    if (!title || !price) {
        tg.showAlert('❌ Заполните заголовок и цену!');
        return;
    }
    
    try {
        await fetch(`${API}/api/ads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                price: parseFloat(price), 
                contact, 
                user_id: tg.initDataUnsafe?.user?.id || 0 
            })
        });
        
        tg.showAlert('✅ Опубликовано!');
        hideForm();
        loadAds(); // Обновляем ленту
    } catch (error) {
        tg.showAlert('❌ Ошибка публикации');
    }
}

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