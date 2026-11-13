
from dao.plano_dao import PlanoDAO
from uuid import uuid4
from decimal import Decimal


dao = PlanoDAO()

id_plano = None
nome_teste = "Plano Teste " + uuid4().hex[:8]

try:
    print("\n=== TESTE DO PLANODAO ===")

    # 1. CADASTRAR
    id_plano = dao.cadastrar(
        nome=nome_teste,
        descricao="Plano criado para teste",
        valor=Decimal("99.90"),
        duracao_meses=1
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_plano)

    # 2. BUSCAR POR ID
    plano = dao.buscar_por_id(id_plano)

    print("\n2. Plano encontrado:")
    print(plano)

    # 3. ATUALIZAR
    resultado = dao.atualizar(
        id_plano,
        nome_teste + " Atualizado",
        "Descrição atualizada",
        Decimal("119.90"),
        2,
        "Ativo"
    )

    print("\n3. Atualização:", resultado)

    # 4. LISTAR
    planos = dao.listar()

    print("\n4. Quantidade de planos:", len(planos))

    # 5. EXCLUIR
    resultado = dao.excluir(id_plano)

    print("\n5. Exclusão:", resultado)

    print("\n=== TESTES CONCLUÍDOS ===")

finally:
    if id_plano is not None:
        plano = dao.buscar_por_id(id_plano)

        if plano is not None:
            dao.excluir(id_plano)
