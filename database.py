import os
import psycopg2
from psycopg2.extras import RealDictCursor

DB_URL = os.environ.get('DATABASE_URL')

def get_conn():
    return psycopg2.connect(DB_URL)

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title TEXT,
        price REAL,
        contact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.commit()
    conn.close()

def add_ad(user_id, title, desc, price, contact):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('INSERT INTO ads (user_id, title, price, contact) VALUES (%s,%s,%s,%s) RETURNING id',
                (user_id, title, price, contact))
    conn.commit()
    id = cur.fetchone()[0]
    conn.close()
    return id

def get_all_ads():
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM ads ORDER BY id DESC')
    ads = cur.fetchall()
    conn.close()
    return ads