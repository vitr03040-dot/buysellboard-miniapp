import sqlite3
DB = 'ads.db'

def init_db():
    conn = sqlite3.connect(DB)
    conn.execute('''CREATE TABLE IF NOT EXISTS ads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        price REAL,
        contact TEXT
    )''')
    conn.commit()
    conn.close()

def add_ad(user_id, title, desc, price, contact):
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute('INSERT INTO ads (user_id, title, price, contact) VALUES (?,?,?,?)',
                (user_id, title, price, contact))
    conn.commit()
    id = cur.lastrowid
    conn.close()
    return id

def get_all_ads():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    ads = [dict(r) for r in conn.execute('SELECT * FROM ads ORDER BY id DESC').fetchall()]
    conn.close()
    return ads