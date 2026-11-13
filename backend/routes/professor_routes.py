
from flask import Blueprint, request, jsonify
from mysql.connector.errors import IntegrityError

from dao.professor_dao import ProfessorDAO


professor_bp = Blueprint(
    "professores",
    __name__,
    url_prefix="/api/professores"
)

dao = ProfessorDAO()


# LISTAR PROFESSORES
@professor_bp.route("/", methods=["GET"])
def listar_professores():

    try:
        professores = dao.listar()
        return jsonify(professores), 200

    except Exception as erro:
        print("Erro ao listar professores:", erro)

        return jsonify({
            "erro": "Não foi possível listar os professores."
        }), 500


# BUSCAR PROFESSOR POR ID
@professor_bp.route("/<int:id_professor>", methods=["GET"])
def buscar_professor(id_professor):

    try:
        professor = dao.buscar_por_id(id_professor)

        if professor is None:
            return jsonify({
                "erro": "Professor não encontrado."
            }), 404

        return jsonify(professor), 200

    except Exception as erro:
        print("Erro ao buscar professor:", erro)

        return jsonify({
            "erro": "Não foi possível buscar o professor."
        }), 500


# CADASTRAR PROFESSOR
@professor_bp.route("/", methods=["POST"])
def cadastrar_professor():

    dados = request.get_json(silent=True) or {}

    nome = dados.get("nome")
    cpf = dados.get("cpf")

    if not nome or not cpf:
        return jsonify({
            "erro": "Nome e CPF são obrigatórios."
        }), 400

    try:
        id_professor = dao.cadastrar(
            nome=nome,
            cpf=cpf,
            telefone=dados.get("telefone"),
            email=dados.get("email"),
            especialidade=dados.get("especialidade")
        )

        return jsonify({
            "mensagem": "Professor cadastrado com sucesso!",
            "id_professor": id_professor
        }), 201

    except IntegrityError:
        return jsonify({
            "erro": "CPF ou e-mail já cadastrado."
        }), 409

    except Exception as erro:
        print("Erro ao cadastrar professor:", erro)

        return jsonify({
            "erro": "Não foi possível cadastrar o professor."
        }), 500


# ATUALIZAR PROFESSOR
@professor_bp.route("/<int:id_professor>", methods=["PUT"])
def atualizar_professor(id_professor):

    dados = request.get_json(silent=True) or {}

    try:
        professor = dao.buscar_por_id(id_professor)

        if professor is None:
            return jsonify({
                "erro": "Professor não encontrado."
            }), 404

        nome = dados.get("nome", professor["nome"])
        cpf = dados.get("cpf", professor["cpf"])

        if not nome or not cpf:
            return jsonify({
                "erro": "Nome e CPF são obrigatórios."
            }), 400

        dao.atualizar(
            id_professor=id_professor,
            nome=nome,
            cpf=cpf,
            telefone=dados.get("telefone", professor["telefone"]),
            email=dados.get("email", professor["email"]),
            especialidade=dados.get(
                "especialidade", professor["especialidade"]
            )
        )

        return jsonify({
            "mensagem": "Professor atualizado com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "CPF ou e-mail já utilizado por outro professor."
        }), 409

    except Exception as erro:
        print("Erro ao atualizar professor:", erro)

        return jsonify({
            "erro": "Não foi possível atualizar o professor."
        }), 500


# EXCLUIR PROFESSOR
@professor_bp.route("/<int:id_professor>", methods=["DELETE"])
def excluir_professor(id_professor):

    try:
        professor = dao.buscar_por_id(id_professor)

        if professor is None:
            return jsonify({
                "erro": "Professor não encontrado."
            }), 404

        dao.excluir(id_professor)

        return jsonify({
            "mensagem": "Professor excluído com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este professor porque existem treinos vinculados."
        }), 409

    except Exception as erro:
        print("Erro ao excluir professor:", erro)

        return jsonify({
            "erro": "Não foi possível excluir o professor."
        }), 500
