
from flask import Blueprint, request, jsonify
from mysql.connector.errors import IntegrityError

from dao.pagamento_dao import PagamentoDAO


pagamento_bp = Blueprint(
    "pagamentos",
    __name__,
    url_prefix="/api/pagamentos"
)

dao = PagamentoDAO()


# LISTAR TODOS OS PAGAMENTOS
@pagamento_bp.route("/", methods=["GET"])
def listar_pagamentos():

    try:
        pagamentos = dao.listar()
        return jsonify(pagamentos), 200

    except Exception as erro:
        print("Erro ao listar pagamentos:", erro)

        return jsonify({
            "erro": "Não foi possível listar os pagamentos."
        }), 500


# BUSCAR PAGAMENTO POR ID
@pagamento_bp.route("/<int:id_pagamento>", methods=["GET"])
def buscar_pagamento(id_pagamento):

    try:
        pagamento = dao.buscar_por_id(id_pagamento)

        if pagamento is None:
            return jsonify({
                "erro": "Pagamento não encontrado."
            }), 404

        return jsonify(pagamento), 200

    except Exception as erro:
        print("Erro ao buscar pagamento:", erro)

        return jsonify({
            "erro": "Não foi possível buscar o pagamento."
        }), 500


# LISTAR PAGAMENTOS DE UMA MATRÍCULA
@pagamento_bp.route("/matricula/<int:id_matricula>", methods=["GET"])
def listar_pagamentos_matricula(id_matricula):

    try:
        pagamentos = dao.listar_por_matricula(id_matricula)

        return jsonify(pagamentos), 200

    except Exception as erro:
        print("Erro ao listar pagamentos da matrícula:", erro)

        return jsonify({
            "erro": "Não foi possível listar os pagamentos."
        }), 500


# CADASTRAR PAGAMENTO
@pagamento_bp.route("/", methods=["POST"])
def cadastrar_pagamento():

    dados = request.get_json(silent=True) or {}

    campos_obrigatorios = [
        "id_matricula",
        "valor",
        "data_vencimento"
    ]

    if any(
        campo not in dados or dados[campo] is None
        for campo in campos_obrigatorios
    ):
        return jsonify({
            "erro": "Matrícula, valor e data de vencimento são obrigatórios."
        }), 400

    try:
        valor = float(dados["valor"])

        if valor <= 0:
            return jsonify({
                "erro": "O valor do pagamento deve ser maior que zero."
            }), 400

        status = dados.get("status", "Pendente")

        if status not in ["Pendente", "Pago", "Atrasado"]:
            return jsonify({
                "erro": "Status de pagamento inválido."
            }), 400

        id_pagamento = dao.cadastrar(
            id_matricula=dados["id_matricula"],
            valor=dados["valor"],
            data_vencimento=dados["data_vencimento"],
            data_pagamento=dados.get("data_pagamento"),
            forma_pagamento=dados.get("forma_pagamento"),
            status=status
        )

        return jsonify({
            "mensagem": "Pagamento cadastrado com sucesso!",
            "id_pagamento": id_pagamento
        }), 201

    except IntegrityError:
        return jsonify({
            "erro": "A matrícula informada não existe."
        }), 409

    except (ValueError, TypeError):
        return jsonify({
            "erro": "Valor do pagamento inválido."
        }), 400

    except Exception as erro:
        print("Erro ao cadastrar pagamento:", erro)

        return jsonify({
            "erro": "Não foi possível cadastrar o pagamento."
        }), 500


# ATUALIZAR PAGAMENTO
@pagamento_bp.route("/<int:id_pagamento>", methods=["PUT"])
def atualizar_pagamento(id_pagamento):

    dados = request.get_json(silent=True) or {}

    try:
        pagamento = dao.buscar_por_id(id_pagamento)

        if pagamento is None:
            return jsonify({
                "erro": "Pagamento não encontrado."
            }), 404

        valor = dados.get("valor", pagamento["valor"])

        if float(valor) <= 0:
            return jsonify({
                "erro": "O valor deve ser maior que zero."
            }), 400

        status = dados.get("status", pagamento["status"])

        if status not in ["Pendente", "Pago", "Atrasado"]:
            return jsonify({
                "erro": "Status de pagamento inválido."
            }), 400

        dao.atualizar(
            id_pagamento=id_pagamento,
            id_matricula=dados.get(
                "id_matricula", pagamento["id_matricula"]
            ),
            valor=valor,
            data_pagamento=dados.get(
                "data_pagamento", pagamento["data_pagamento"]
            ),
            data_vencimento=dados.get(
                "data_vencimento", pagamento["data_vencimento"]
            ),
            forma_pagamento=dados.get(
                "forma_pagamento", pagamento["forma_pagamento"]
            ),
            status=status
        )

        return jsonify({
            "mensagem": "Pagamento atualizado com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "A matrícula informada não existe."
        }), 409

    except (ValueError, TypeError):
        return jsonify({
            "erro": "Valor do pagamento inválido."
        }), 400

    except Exception as erro:
        print("Erro ao atualizar pagamento:", erro)

        return jsonify({
            "erro": "Não foi possível atualizar o pagamento."
        }), 500


# EXCLUIR PAGAMENTO
@pagamento_bp.route("/<int:id_pagamento>", methods=["DELETE"])
def excluir_pagamento(id_pagamento):

    try:
        pagamento = dao.buscar_por_id(id_pagamento)

        if pagamento is None:
            return jsonify({
                "erro": "Pagamento não encontrado."
            }), 404

        dao.excluir(id_pagamento)

        return jsonify({
            "mensagem": "Pagamento excluído com sucesso!"
        }), 200

    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este pagamento."
        }), 409

    except Exception as erro:
        print("Erro ao excluir pagamento:", erro)

        return jsonify({
            "erro": "Não foi possível excluir o pagamento."
        }), 500
