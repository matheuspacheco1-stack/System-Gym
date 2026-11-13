
from flask import Blueprint, request, jsonify

from dao.exercicio_dao import ExercicioDAO


exercicio_bp = Blueprint(
    "exercicios",
    __name__,
    url_prefix="/api/exercicios"
)

dao = ExercicioDAO()


# LISTAR TODOS OS EXERCICIOS
@exercicio_bp.route("/", methods=["GET"])
def listar_exercicios():

    try:
        exercicios = dao.listar()

        # Filtro opcional por grupo muscular
        grupo = request.args.get("grupo_muscular")

        if grupo:
            exercicios = [
                e for e in exercicios
                if e["grupo_muscular"].strip().casefold()
                == grupo.strip().casefold()
            ]

        return jsonify(exercicios), 200

    except Exception as erro:
        print("Erro ao listar exercicios:", erro)

        return jsonify({
            "erro": "Não foi possível listar os exercícios."
        }), 500


# BUSCAR EXERCICIO POR ID
@exercicio_bp.route("/<int:id_exercicio>", methods=["GET"])
def buscar_exercicio(id_exercicio):

    try:
        exercicio = dao.buscar_por_id(id_exercicio)

        if exercicio is None:
            return jsonify({
                "erro": "Exercício não encontrado."
            }), 404

        return jsonify(exercicio), 200

    except Exception as erro:
        print("Erro ao buscar exercicio:", erro)

        return jsonify({
            "erro": "Não foi possível buscar o exercício."
        }), 500


# CADASTRAR EXERCICIO
@exercicio_bp.route("/", methods=["POST"])
def cadastrar_exercicio():

    dados = request.get_json(silent=True) or {}

    nome = dados.get("nome")
    grupo_muscular = dados.get("grupo_muscular")

    if not nome or not grupo_muscular:
        return jsonify({
            "erro": "Nome e grupo muscular são obrigatórios."
        }), 400

    try:
        id_exercicio = dao.cadastrar(
            nome=nome,
            grupo_muscular=grupo_muscular,
            descricao=dados.get("descricao")
        )

        return jsonify({
            "mensagem": "Exercício cadastrado com sucesso!",
            "id_exercicio": id_exercicio
        }), 201

    except Exception as erro:
        print("Erro ao cadastrar exercicio:", erro)

        return jsonify({
            "erro": "Não foi possível cadastrar o exercício."
        }), 500


# ATUALIZAR EXERCICIO
@exercicio_bp.route("/<int:id_exercicio>", methods=["PUT"])
def atualizar_exercicio(id_exercicio):

    dados = request.get_json(silent=True) or {}

    try:
        exercicio = dao.buscar_por_id(id_exercicio)

        if exercicio is None:
            return jsonify({
                "erro": "Exercício não encontrado."
            }), 404

        nome = dados.get("nome", exercicio["nome"])
        grupo = dados.get(
            "grupo_muscular",
            exercicio["grupo_muscular"]
        )
        descricao = dados.get(
            "descricao",
            exercicio["descricao"]
        )

        if not nome or not grupo:
            return jsonify({
                "erro": "Nome e grupo muscular são obrigatórios."
            }), 400

        dao.atualizar(
            id_exercicio=id_exercicio,
            nome=nome,
            grupo_muscular=grupo,
            descricao=descricao
        )

        return jsonify({
            "mensagem": "Exercício atualizado com sucesso!"
        }), 200

    except Exception as erro:
        print("Erro ao atualizar exercicio:", erro)

        return jsonify({
            "erro": "Não foi possível atualizar o exercício."
        }), 500


# EXCLUIR EXERCICIO
@exercicio_bp.route("/<int:id_exercicio>", methods=["DELETE"])
def excluir_exercicio(id_exercicio):

    try:
        exercicio = dao.buscar_por_id(id_exercicio)

        if exercicio is None:
            return jsonify({
                "erro": "Exercício não encontrado."
            }), 404

        dao.excluir(id_exercicio)

        return jsonify({
            "mensagem": "Exercício excluído com sucesso!"
        }), 200

    except Exception as erro:
        print("Erro ao excluir exercicio:", erro)

        return jsonify({
            "erro": "Não foi possível excluir o exercício."
        }), 500
