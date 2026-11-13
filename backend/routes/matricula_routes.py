
from flask import Blueprint, request, jsonify
from mysql.connector.errors import IntegrityError

from dao.matricula_dao import MatriculaDAO


matricula_bp = Blueprint(
    "matriculas",
    __name__,
    url_prefix="/api/matriculas"
)

dao = MatriculaDAO()


# LISTAR TODAS AS MATRICULAS
@matricula_bp.route("/", methods=["GET"])
def listar_matriculas():

    try:
        matriculas = dao.listar()
        return jsonify(matriculas), 200

    except Exception as erro:
        print("Erro ao listar matriculas:", erro)

        return jsonify({
            "erro": "Não foi possível listar as matrículas."
        }), 500


# BUSCAR MATRICULA POR ID
@matricula_bp.route("/<int:id_matricula>", methods=["GET"])
def buscar_matricula(id_matricula):

    try:
        matricula = dao.buscar_por_id(id_matricula)

        if matricula is None:
            return jsonify({
                "erro": "Matrícula não encontrada."
            }), 404

        return jsonify(matricula), 200

    except Exception as erro:
        print("Erro ao buscar matricula:", erro)

        return jsonify({
            "erro": "Não foi possível buscar a matrícula."
        }), 500


# LISTAR MATRICULAS DE UM ALUNO
@matricula_bp.route("/aluno/<int:id_aluno>", methods=["GET"])
def listar_matriculas_aluno(id_aluno):

    try:
        matriculas = dao.listar_por_aluno(id_aluno)

        return jsonify(matriculas), 200

    except Exception as erro:
        print("Erro ao listar matriculas do aluno:", erro)

        return jsonify({
            "erro": "Não foi possível listar as matrículas do aluno."
        }), 500


# CADASTRAR MATRICULA
@matricula_bp.route("/", methods=["POST"])
def cadastrar_matricula():

    dados = request.get_json(silent=True) or {}

    campos_obrigatorios = [
        "id_aluno",
        "id_plano",
        "data_inicio",
        "data_fim"
    ]

    if any(campo not in dados or dados[campo] is None
           for campo in campos_obrigatorios):

        return jsonify({
            "erro": "Aluno, plano, data de início e data de fim são obrigatórios."
        }), 400

    try:
        id_matricula = dao.cadastrar(
            id_aluno=dados["id_aluno"],
            id_plano=dados["id_plano"],
            data_inicio=dados["data_inicio"],
            data_fim=dados["data_fim"],
            status=dados.get("status", "Ativa")
        )

        return jsonify({
            "mensagem": "Matrícula cadastrada com sucesso!",
            "id_matricula": id_matricula
        }), 201

    except IntegrityError:
        return jsonify({
            "erro": "Aluno ou plano informado não existe, ou os dados violam uma restrição do banco."
        }), 409

    except Exception as erro:
        print("Erro ao cadastrar matricula:", erro)

        return jsonify({
            "erro": "Não foi possível cadastrar a matrícula."
        }), 500


# ATUALIZAR MATRICULA
@matricula_bp.route("/<int:id_matricula>", methods=["PUT"])
def atualizar_matricula(id_matricula):

    dados = request.get_json(silent=True) or {}

    try:
        matricula = dao.buscar_por_id(id_matricula)

        if matricula is None:
            return jsonify({
                "erro": "Matrícula não encontrada."
            }), 404

        id_aluno = dados.get("id_aluno", matricula["id_aluno"])
        id_plano = dados.get("id_plano", matricula["id_plano"])
        data_inicio = dados.get("data_inicio", matricula["data_inicio"])
        data_fim = dados.get("data_fim", matricula["data_fim"])
        status = dados.get("status", matricula["status"])

        dao.atualizar(
            id_matricula=id_matricula,
            id_aluno=id_aluno,
            id_plano=id_plano,
            data_inicio=data_inicio,
            data_fim=data_fim,
            status=status
        )

        return jsonify({
            "mensagem": "Matrícula atualizada com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "Aluno ou plano informado não existe."
        }), 409

    except Exception as erro:
        print("Erro ao atualizar matricula:", erro)

        return jsonify({
            "erro": "Não foi possível atualizar a matrícula."
        }), 500


# EXCLUIR MATRICULA
@matricula_bp.route("/<int:id_matricula>", methods=["DELETE"])
def excluir_matricula(id_matricula):

    try:
        matricula = dao.buscar_por_id(id_matricula)

        if matricula is None:
            return jsonify({
                "erro": "Matrícula não encontrada."
            }), 404

        dao.excluir(id_matricula)

        return jsonify({
            "mensagem": "Matrícula excluída com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir esta matrícula porque existem pagamentos vinculados."
        }), 409

    except Exception as erro:
        print("Erro ao excluir matricula:", erro)

        return jsonify({
            "erro": "Não foi possível excluir a matrícula."
        }), 500
