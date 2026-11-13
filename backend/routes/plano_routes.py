
from flask import Blueprint, request, jsonify
from mysql.connector.errors import IntegrityError

from dao.plano_dao import PlanoDAO


plano_bp = Blueprint(
    "planos",
    __name__,
    url_prefix="/api/planos"
)

dao = PlanoDAO()


# LISTAR PLANOS
@plano_bp.route("/", methods=["GET"])
def listar_planos():
    try:
        planos = dao.listar()
        return jsonify(planos), 200

    except Exception as erro:
        print("Erro ao listar planos:", erro)
        return jsonify({
            "erro": "Não foi possível listar os planos."
        }), 500


# BUSCAR PLANO POR ID
@plano_bp.route("/<int:id_plano>", methods=["GET"])
def buscar_plano(id_plano):
    try:
        plano = dao.buscar_por_id(id_plano)

        if plano is None:
            return jsonify({
                "erro": "Plano não encontrado."
            }), 404

        return jsonify(plano), 200

    except Exception as erro:
        print("Erro ao buscar plano:", erro)
        return jsonify({
            "erro": "Não foi possível buscar o plano."
        }), 500


# CADASTRAR PLANO
@plano_bp.route("/", methods=["POST"])
def cadastrar_plano():

    dados = request.get_json(silent=True) or {}

    campos_obrigatorios = [
        "nome", "valor", "duracao_meses"
    ]

    if any(campo not in dados for campo in campos_obrigatorios):
        return jsonify({
            "erro": "Nome, valor e duração são obrigatórios."
        }), 400

    try:
        id_plano = dao.cadastrar(
            nome=dados["nome"],
            descricao=dados.get("descricao"),
            valor=dados["valor"],
            duracao_meses=dados["duracao_meses"],
            status=dados.get("status", "Ativo")
        )

        return jsonify({
            "mensagem": "Plano cadastrado com sucesso!",
            "id_plano": id_plano
        }), 201

    except Exception as erro:
        print("Erro ao cadastrar plano:", erro)
        return jsonify({
            "erro": "Não foi possível cadastrar o plano."
        }), 500


# ATUALIZAR PLANO
@plano_bp.route("/<int:id_plano>", methods=["PUT"])
def atualizar_plano(id_plano):

    dados = request.get_json(silent=True) or {}

    try:
        plano = dao.buscar_por_id(id_plano)

        if plano is None:
            return jsonify({
                "erro": "Plano não encontrado."
            }), 404

        nome = dados.get("nome", plano["nome"])
        descricao = dados.get("descricao", plano["descricao"])
        valor = dados.get("valor", plano["valor"])
        duracao = dados.get(
            "duracao_meses", plano["duracao_meses"]
        )
        status = dados.get("status", plano["status"])

        if not nome or valor is None or duracao is None:
            return jsonify({
                "erro": "Nome, valor e duração são obrigatórios."
            }), 400

        dao.atualizar(
            id_plano=id_plano,
            nome=nome,
            descricao=descricao,
            valor=valor,
            duracao_meses=duracao,
            status=status
        )

        return jsonify({
            "mensagem": "Plano atualizado com sucesso!"
        }), 200

    except Exception as erro:
        print("Erro ao atualizar plano:", erro)
        return jsonify({
            "erro": "Não foi possível atualizar o plano."
        }), 500


# EXCLUIR PLANO
@plano_bp.route("/<int:id_plano>", methods=["DELETE"])
def excluir_plano(id_plano):

    try:
        plano = dao.buscar_por_id(id_plano)

        if plano is None:
            return jsonify({
                "erro": "Plano não encontrado."
            }), 404

        dao.excluir(id_plano)

        return jsonify({
            "mensagem": "Plano excluído com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este plano porque existem matrículas vinculadas."
        }), 409

    except Exception as erro:
        print("Erro ao excluir plano:", erro)
        return jsonify({
            "erro": "Não foi possível excluir o plano."
        }), 500
