import sqlite3

conn = sqlite3.connect('catalogo_escolas.db')  # Cria o arquivo se não existir
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS escolas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    endereco TEXT,
    bairro TEXT,
    telefone TEXT,
    vagas_disponiveis INTEGER
)
''')

conn.commit()
conn.close()