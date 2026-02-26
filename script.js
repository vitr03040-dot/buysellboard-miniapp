const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ⚠️ Замените на вашу реальную ссылку от Render!
const API = 'https://buysellboard.onrender.com';

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
        <div class="ad-card" onclick='showDetails("${ad.title}", "${ad.price}", "${ad.contact}")'>
            <div class="ad-title">${ad.title}</div>
            <div class="ad-price">${ad.price} ₽</div>
        </div>
    `).join('');
}

function showDetails(title, price, contact) {
    const text = `🔹 ${title}\n\n💰 ${price} ₽\n\n📞 ${contact}`;
    tg.showAlert(text);
}

function showForm() { 
    document.getElementById('adForm').style.display = 'block'; 
}

function hideForm() { 
    document.getElementById('adForm').style.display = 'none'; 
}

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
        loadAds();
    } catch (error) {
        tg.showAlert('❌ Ошибка публикации');
    }
}