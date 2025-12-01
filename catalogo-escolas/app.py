from flask import Flask, render_template, request, redirect, url_for, jsonify, g
import sqlite3
import webbrowser
import threading
import sys
import os

if getattr(sys, 'frozen', False):
    basedir = sys._MEIPASS  # Diretório temporário quando empacotado
else:
    basedir = os.path.abspath(os.path.dirname(__file__))

if getattr(sys, 'frozen', False):
    db_path = os.path.dirname(sys.executable)  # Caminho da pasta onde está o .exe
else:
    db_path = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, template_folder=os.path.join(basedir, 'templates'), static_folder=os.path.join(basedir, 'static'))

DATABASE = os.path.join(db_path, 'catalogo_escolas.db')

def inicializar_banco():
    conn = sqlite3.connect(DATABASE)
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

# Funções de conexão por requisição
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row  # Acesso a colunas por nome, se quiser
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/main')
def index():
    db = get_db()
    bairro = request.args.get('bairro')
    nome_escola = request.args.get('nome_escola')

    bairros = [linha['bairro'] for linha in db.execute("SELECT DISTINCT bairro FROM escolas")]

    query = "SELECT * FROM escolas WHERE 1=1"
    params = []

    if bairro:
        query += " AND bairro = ?"
        params.append(bairro)

    if nome_escola:
        query += " AND nome LIKE ?"
        params.append(f"%{nome_escola}%")

    query += " ORDER BY bairro ASC, nome ASC"
    escolas = db.execute(query, params).fetchall()

    return render_template(
        'index.html',
        escolas=escolas,
        bairros=bairros,
        bairro_selecionado=bairro,
        nome_escola=nome_escola
    )

@app.route('/adicionar', methods=['POST'])
def adicionar():
    db = get_db()
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Dados inválidos"}), 400

    try:
        db.execute(
            "INSERT INTO escolas (nome, endereco, bairro, telefone, vagas_disponiveis) VALUES (?, ?, ?, ?, ?)",
            (
                dados.get('nome'),
                dados.get('endereco'),
                dados.get('bairro'),
                dados.get('telefone'),
                dados.get('vagas_disponiveis'),
            )
        )
        db.commit()
        return jsonify({"ok": True})
    except Exception as e:
        db.rollback()
        print("Erro ao adicionar escola:", e)
        return jsonify({"erro": "Erro no servidor"}), 500

@app.route('/excluir/<int:id>', methods=['GET'])
def excluir_escola(id):
    db = get_db()
    try:
        db.execute("DELETE FROM escolas WHERE id = ?", (id,))
        db.commit()
    except Exception as e:
        db.rollback()
        print("Erro ao excluir:", e)
    return redirect(url_for('index'))

@app.route('/editar_vagas/<int:id>', methods=['POST'])
def editar_vagas(id):
    db = get_db()
    try:
        dados = request.get_json()
        vagas = dados.get('vagas')
        if vagas is None:
            return jsonify({"erro": "Número de vagas não informado"}), 400

        db.execute("UPDATE escolas SET vagas_disponiveis = ? WHERE id = ?", (vagas, id))
        db.commit()
        return jsonify({"ok": True})
    except Exception as e:
        db.rollback()
        print(f"Erro ao atualizar vagas: {e}")
        return jsonify({"erro": "Erro no servidor"}), 500

if __name__ == '__main__':
    inicializar_banco()
    threading.Timer(1.25, lambda: webbrowser.open('http://127.0.0.1:5000')).start()
    app.run()