
from flask import Blueprint, request, jsonify
from datetime import date, datetime
from mysql.connector.errors import IntegrityError

from dao.treino_dao import TreinoDAO
from dao.treino_exercicio_dao import TreinoExercicioDAO
from dao.exercicio_dao import ExercicioDAO


treino_bp = Blueprint(
    "treinos",
    __name__,
    url_prefix="/api/treinos"
)

treino_dao = TreinoDAO()
treino_exercicio_dao = TreinoExercicioDAO()
exercicio_dao = ExercicioDAO()


# CONVERTER DATA
def converter_data(valor):

    if isinstance(valor, date):
        return valor

    return datetime.strptime(valor, "%Y-%m-%d").date()


# LISTAR TODOS OS TREINOS
@treino_bp.route("/", methods=["GET"])
def listar_treinos():

    try:
        treinos = treino_dao.listar()
        return jsonify(treinos), 200

    except Exception as erro:
        print("Erro ao listar treinos:", erro)

        return jsonify({
            "erro": "Não foi possível listar os treinos."
        }), 500


# BUSCAR TREINO POR ID
@treino_bp.route("/<int:id_treino>", methods=["GET"])
def buscar_treino(id_treino):

    try:
        treino = treino_dao.buscar_por_id(id_treino)

        if treino is None:
            return jsonify({
                "erro": "Treino não encontrado."
            }), 404

        return jsonify(treino), 200

    except Exception as erro:
        print("Erro ao buscar treino:", erro)

        return jsonify({
            "erro": "Não foi possível buscar o treino."
        }), 500


# LISTAR TREINOS DE UM ALUNO
@treino_bp.route("/aluno/<int:id_aluno>", methods=["GET"])
def listar_treinos_aluno(id_aluno):

    try:
        treinos = treino_dao.listar_por_aluno(id_aluno)
        return jsonify(treinos), 200

    except Exception as erro:
        print("Erro ao listar treinos do aluno:", erro)

        return jsonify({
            "erro": "Não foi possível listar os treinos do aluno."
        }), 500


# LISTAR TREINOS DE UM PROFESSOR
@treino_bp.route("/professor/<int:id_professor>", methods=["GET"])
def listar_treinos_professor(id_professor):

    try:
        treinos = treino_dao.listar_por_professor(id_professor)
        return jsonify(treinos), 200

    except Exception as erro:
        print("Erro ao listar treinos do professor:", erro)

        return jsonify({
            "erro": "Não foi possível listar os treinos do professor."
        }), 500


# CADASTRAR TREINO
@treino_bp.route("/", methods=["POST"])
def cadastrar_treino():

    dados = request.get_json(silent=True) or {}

    id_aluno = dados.get("id_aluno")
    id_professor = dados.get("id_professor")
    nome = dados.get("nome")

    if not id_aluno or not id_professor or not nome:
        return jsonify({
            "erro": "Aluno, professor e nome do treino são obrigatórios."
        }), 400

    try:
        data_criacao = converter_data(
            dados.get("data_criacao", date.today())
        )

        id_treino = treino_dao.cadastrar(
            id_aluno,
            id_professor,
            nome,
            dados.get("descricao"),
            data_criacao
        )

        return jsonify({
            "mensagem": "Treino cadastrado com sucesso!",
            "id_treino": id_treino
        }), 201

    except ValueError:
        return jsonify({
            "erro": "Data de criação inválida. Utilize AAAA-MM-DD."
        }), 400

    except IntegrityError:
        return jsonify({
            "erro": "Aluno ou professor informado não existe."
        }), 409

    except Exception as erro:
        print("Erro ao cadastrar treino:", erro)

        return jsonify({
            "erro": "Não foi possível cadastrar o treino."
        }), 500


# ATUALIZAR TREINO
@treino_bp.route("/<int:id_treino>", methods=["PUT"])
def atualizar_treino(id_treino):

    dados = request.get_json(silent=True) or {}

    try:
        treino = treino_dao.buscar_por_id(id_treino)

        if treino is None:
            return jsonify({
                "erro": "Treino não encontrado."
            }), 404

        id_aluno = dados.get("id_aluno", treino["id_aluno"])
        id_professor = dados.get(
            "id_professor", treino["id_professor"]
        )
        nome = dados.get("nome", treino["nome"])
        descricao = dados.get("descricao", treino["descricao"])

        data_criacao = converter_data(
            dados.get("data_criacao", treino["data_criacao"])
        )

        treino_dao.atualizar(
            id_treino,
            id_aluno,
            id_professor,
            nome,
            descricao,
            data_criacao
        )

        return jsonify({
            "mensagem": "Treino atualizado com sucesso!"
        }), 200

    except ValueError:
        return jsonify({
            "erro": "Data de criação inválida."
        }), 400

    except IntegrityError:
        return jsonify({
            "erro": "Aluno ou professor informado não existe."
        }), 409

    except Exception as erro:
        print("Erro ao atualizar treino:", erro)

        return jsonify({
            "erro": "Não foi possível atualizar o treino."
        }), 500


# EXCLUIR TREINO
@treino_bp.route("/<int:id_treino>", methods=["DELETE"])
def excluir_treino(id_treino):

    try:
        treino = treino_dao.buscar_por_id(id_treino)

        if treino is None:
            return jsonify({
                "erro": "Treino não encontrado."
            }), 404

        treino_dao.excluir(id_treino)

        return jsonify({
            "mensagem": "Treino excluído com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "Exclua primeiro os exercícios vinculados a este treino."
        }), 409

    except Exception as erro:
        print("Erro ao excluir treino:", erro)

        return jsonify({
            "erro": "Não foi possível excluir o treino."
        }), 500


# LISTAR EXERCÍCIOS DE UM TREINO
@treino_bp.route("/<int:id_treino>/exercicios", methods=["GET"])
def listar_exercicios_treino(id_treino):

    try:
        treino = treino_dao.buscar_por_id(id_treino)

        if treino is None:
            return jsonify({
                "erro": "Treino não encontrado."
            }), 404

        exercicios = treino_exercicio_dao.listar_por_treino(
            id_treino
        )

        return jsonify(exercicios), 200

    except Exception as erro:
        print("Erro ao listar exercícios do treino:", erro)

        return jsonify({
            "erro": "Não foi possível listar os exercícios."
        }), 500


# ADICIONAR EXERCÍCIO AO TREINO
@treino_bp.route("/<int:id_treino>/exercicios", methods=["POST"])
def adicionar_exercicio_treino(id_treino):

    dados = request.get_json(silent=True) or {}

    id_exercicio = dados.get("id_exercicio")
    series = dados.get("series")

    if id_exercicio is None or series is None:
        return jsonify({
            "erro": "Exercício e quantidade de séries são obrigatórios."
        }), 400

    try:
        treino = treino_dao.buscar_por_id(id_treino)

        if treino is None:
            return jsonify({
                "erro": "Treino não encontrado."
            }), 404

        exercicio = exercicio_dao.buscar_por_id(id_exercicio)

        if exercicio is None:
            return jsonify({
                "erro": "Exercício não encontrado."
            }), 404

        series = int(series)

        if series <= 0:
            return jsonify({
                "erro": "A quantidade de séries deve ser maior que zero."
            }), 400

        ordem = dados.get("ordem")

        if ordem is not None:
            ordem = int(ordem)

        id_vinculo = treino_exercicio_dao.cadastrar(
            id_treino=id_treino,
            id_exercicio=id_exercicio,
            series=series,
            repeticoes=dados.get("repeticoes"),
            ordem=ordem,
            observacoes=dados.get("observacoes")
        )

        return jsonify({
            "mensagem": "Exercício adicionado ao treino com sucesso!",
            "id_treino_exercicio": id_vinculo
        }), 201

    except (ValueError, TypeError):
        return jsonify({
            "erro": "Quantidade de séries ou ordem inválida."
        }), 400

    except IntegrityError:
        return jsonify({
            "erro": "Não foi possível vincular o exercício ao treino."
        }), 409

    except Exception as erro:
        print("Erro ao adicionar exercício:", erro)

        return jsonify({
            "erro": "Não foi possível adicionar o exercício ao treino."
        }), 500


# ATUALIZAR EXERCÍCIO DA FICHA
@treino_bp.route("/exercicios/<int:id_treino_exercicio>", methods=["PUT"])
def atualizar_exercicio_treino(id_treino_exercicio):

    dados = request.get_json(silent=True) or {}

    try:
        registro = treino_exercicio_dao.buscar_por_id(
            id_treino_exercicio
        )

        if registro is None:
            return jsonify({
                "erro": "Exercício da ficha não encontrado."
            }), 404

        id_exercicio = dados.get(
            "id_exercicio", registro["id_exercicio"]
        )

        exercicio = exercicio_dao.buscar_por_id(id_exercicio)

        if exercicio is None:
            return jsonify({
                "erro": "Exercício não encontrado."
            }), 404

        series = int(dados.get("series", registro["series"]))

        if series <= 0:
            return jsonify({
                "erro": "A quantidade de séries deve ser maior que zero."
            }), 400

        ordem = dados.get("ordem", registro["ordem"])

        if ordem is not None:
            ordem = int(ordem)

        treino_exercicio_dao.atualizar(
            id_treino_exercicio,
            registro["id_treino"],
            id_exercicio,
            series,
            dados.get("repeticoes", registro["repeticoes"]),
            ordem,
            dados.get("observacoes", registro["observacoes"])
        )

        return jsonify({
            "mensagem": "Exercício da ficha atualizado com sucesso!"
        }), 200

    except (ValueError, TypeError):
        return jsonify({
            "erro": "Dados de séries ou ordem inválidos."
        }), 400

    except Exception as erro:
        print("Erro ao atualizar exercício da ficha:", erro)

        return jsonify({
            "erro": "Não foi possível atualizar o exercício."
        }), 500


# REMOVER EXERCÍCIO DA FICHA
@treino_bp.route("/exercicios/<int:id_treino_exercicio>", methods=["DELETE"])
def remover_exercicio_treino(id_treino_exercicio):

    try:
        registro = treino_exercicio_dao.buscar_por_id(
            id_treino_exercicio
        )

        if registro is None:
            return jsonify({
                "erro": "Exercício da ficha não encontrado."
            }), 404

        treino_exercicio_dao.excluir(id_treino_exercicio)

        return jsonify({
            "mensagem": "Exercício removido do treino com sucesso!"
        }), 200

    except Exception as erro:
        print("Erro ao remover exercício:", erro)

        return jsonify({
            "erro": "Não foi possível remover o exercício."
        }), 500
