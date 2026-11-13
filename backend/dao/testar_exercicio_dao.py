
from dao.exercicio_dao import ExercicioDAO
from uuid import uuid4


dao = ExercicioDAO()

id_exercicio = None

identificador = uuid4().hex[:10]
nome_teste = f"Exercicio Teste {identificador}"

try:
    print("\n=== TESTE DO EXERCICIODAO ===")

    # 1. CADASTRAR
    id_exercicio = dao.cadastrar(
        nome=nome_teste,
        grupo_muscular="Peito",
        descricao="Exercicio temporario para teste"
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_exercicio)

    # 2. BUSCAR POR ID
    exercicio = dao.buscar_por_id(id_exercicio)

    print("\n2. Exercicio encontrado:")
    print(exercicio)

    # 3. LISTAR TODOS
    exercicios = dao.listar()

    print("\n3. Quantidade de exercicios:", len(exercicios))

    # 4. FILTRAR POR GRUPO MUSCULAR
    exercicios_peito = dao.listar_por_grupo_muscular("Peito")

    print("\n4. Exercicios de peito:", len(exercicios_peito))

    # 5. ATUALIZAR
    resultado = dao.atualizar(
        id_exercicio,
        nome_teste + " Atualizado",
        "Costas",
        "Descricao atualizada"
    )

    print("\n5. Atualizacao:", resultado)

    # 6. EXCLUIR
    resultado = dao.excluir(id_exercicio)

    print("\n6. Exclusao:", resultado)

    print("\n=== TESTES CONCLUIDOS ===")

finally:
    # Limpar somente o exercicio temporario
    if id_exercicio is not None:
        exercicio = dao.buscar_por_id(id_exercicio)

        if exercicio is not None:
            dao.excluir(id_exercicio)
