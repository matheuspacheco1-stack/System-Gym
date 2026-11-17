

from flask import Flask, jsonify, send_from_directory
from pathlib import Path
from flask_cors import CORS

from routes.aluno_routes import aluno_bp
from routes.professor_routes import professor_bp
from routes.plano_routes import plano_bp
from routes.matricula_routes import matricula_bp
from routes.pagamento_routes import pagamento_bp
from routes.exercicio_routes import exercicio_bp
from routes.treino_routes import treino_bp

app = Flask(__name__)

# Permitir comunicação com o frontend
CORS(app)


# Registrar as rotas
app.register_blueprint(aluno_bp)
app.register_blueprint(professor_bp)
app.register_blueprint(plano_bp)
app.register_blueprint(matricula_bp)
app.register_blueprint(pagamento_bp)
app.register_blueprint(exercicio_bp)
app.register_blueprint(treino_bp)

# Rota inicial
@app.route("/", methods=["GET"])
def inicio():
    return jsonify({
        "mensagem": "API SYSTEM GYM funcionando!",
        "status": "online"
    }), 200


# Verificar funcionamento da API
@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({
        "sistema": "SYSTEM GYM",
        "status": "online",
        "mensagem": "Servidor conectado e funcionando!"
    }), 200

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

@app.route("/frontend/")
@app.route("/frontend/<path:arquivo>")
def abrir_frontend(arquivo="index.html"):
    return send_from_directory(FRONTEND_DIR, arquivo)

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
