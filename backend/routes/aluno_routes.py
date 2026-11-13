
from flask import Blueprint, request, jsonify
from mysql.connector.errors import IntegrityError

from dao.aluno_dao import AlunoDAO


aluno_bp = Blueprint(
    "alunos",
    __name__,
    url_prefix="/api/alunos"
)

dao = AlunoDAO()


# LISTAR TODOS OS ALUNOS
@aluno_bp.route("/", methods=["GET"])
def listar_alunos():

    try:
        alunos = dao.listar()

        return jsonify(alunos), 200

    except Exception as erro:
        print("Erro ao listar alunos:", erro)

        return jsonify({
            "erro": "Não foi possível listar os alunos."
        }), 500


# BUSCAR ALUNO POR ID
@aluno_bp.route("/<int:id_aluno>", methods=["GET"])
def buscar_aluno(id_aluno):

    try:
        aluno = dao.buscar_por_id(id_aluno)

        if aluno is None:
            return jsonify({
                "erro": "Aluno não encontrado."
            }), 404

        return jsonify(aluno), 200

    except Exception as erro:
        print("Erro ao buscar aluno:", erro)

        return jsonify({
            "erro": "Não foi possível buscar o aluno."
        }), 500


# CADASTRAR ALUNO
@aluno_bp.route("/", methods=["POST"])
def cadastrar_aluno():

    dados = request.get_json(silent=True) or {}

    nome = dados.get("nome")
    cpf = dados.get("cpf")

    if not nome or not cpf:
        return jsonify({
            "erro": "Nome e CPF são obrigatórios."
        }), 400

    try:
        id_aluno = dao.cadastrar(
            nome=nome,
            cpf=cpf,
            telefone=dados.get("telefone"),
            email=dados.get("email"),
            data_nascimento=dados.get("data_nascimento"),
            endereco=dados.get("endereco")
        )

        return jsonify({
            "mensagem": "Aluno cadastrado com sucesso!",
            "id_aluno": id_aluno
        }), 201

    except IntegrityError:
        return jsonify({
            "erro": "CPF ou e-mail já cadastrado."
        }), 409

    except Exception as erro:
        print("Erro ao cadastrar aluno:", erro)

        return jsonify({
            "erro": "Não foi possível cadastrar o aluno."
        }), 500


# ATUALIZAR ALUNO
@aluno_bp.route("/<int:id_aluno>", methods=["PUT"])
def atualizar_aluno(id_aluno):

    dados = request.get_json(silent=True) or {}

    try:
        aluno = dao.buscar_por_id(id_aluno)

        if aluno is None:
            return jsonify({
                "erro": "Aluno não encontrado."
            }), 404

        nome = dados.get("nome", aluno["nome"])
        cpf = dados.get("cpf", aluno["cpf"])

        if not nome or not cpf:
            return jsonify({
                "erro": "Nome e CPF são obrigatórios."
            }), 400

        dao.atualizar(
            id_aluno=id_aluno,
            nome=nome,
            cpf=cpf,
            telefone=dados.get("telefone", aluno["telefone"]),
            email=dados.get("email", aluno["email"]),
            data_nascimento=dados.get(
                "data_nascimento", aluno["data_nascimento"]
            ),
            endereco=dados.get("endereco", aluno["endereco"])
        )

        return jsonify({
            "mensagem": "Aluno atualizado com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "CPF ou e-mail já utilizado por outro aluno."
        }), 409

    except Exception as erro:
        print("Erro ao atualizar aluno:", erro)

        return jsonify({
            "erro": "Não foi possível atualizar o aluno."
        }), 500


# EXCLUIR ALUNO
@aluno_bp.route("/<int:id_aluno>", methods=["DELETE"])
def excluir_aluno(id_aluno):

    try:
        aluno = dao.buscar_por_id(id_aluno)

        if aluno is None:
            return jsonify({
                "erro": "Aluno não encontrado."
            }), 404

        dao.excluir(id_aluno)

        return jsonify({
            "mensagem": "Aluno excluído com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este aluno porque existem registros vinculados."
        }), 409

    except Exception as erro:
        print("Erro ao excluir aluno:", erro)

        return jsonify({
            "erro": "Não foi possível excluir o aluno."
        }), 500
