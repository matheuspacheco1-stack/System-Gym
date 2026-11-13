
from dao.treino_dao import TreinoDAO
from dao.aluno_dao import AlunoDAO
from dao.professor_dao import ProfessorDAO

from datetime import date
from uuid import uuid4


treino_dao = TreinoDAO()
aluno_dao = AlunoDAO()
professor_dao = ProfessorDAO()

id_aluno = None
id_professor = None
id_treino = None

identificador = uuid4().hex

try:
    print("\n=== TESTE DO TREINODAO ===")

    # Criar aluno temporário
    id_aluno = aluno_dao.cadastrar(
        nome="Aluno Teste Treino",
        cpf=str(uuid4().int)[:11],
        telefone="19999999999",
        email=f"aluno.{identificador[:10]}@systemgym.com",
        data_nascimento="2000-01-01",
        endereco="Rua de Teste"
    )

    # Criar professor temporário
    id_professor = professor_dao.cadastrar(
        nome="Professor Teste Treino",
        cpf=str(uuid4().int)[:11],
        telefone="19988888888",
        email=f"prof.{identificador[:10]}@systemgym.com",
        especialidade="Musculação"
    )

    # 1. CADASTRAR TREINO
    id_treino = treino_dao.cadastrar(
        id_aluno=id_aluno,
        id_professor=id_professor,
        nome="Treino A",
        descricao="Treino de membros superiores",
        data_criacao=date.today()
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_treino)

    # 2. BUSCAR POR ID
    treino = treino_dao.buscar_por_id(id_treino)

    print("\n2. Treino encontrado:")
    print(treino)

    # 3. LISTAR TODOS
    treinos = treino_dao.listar()

    print("\n3. Quantidade de treinos:", len(treinos))

    # 4. LISTAR POR ALUNO
    treinos_aluno = treino_dao.listar_por_aluno(id_aluno)

    print("\n4. Treinos do aluno:", len(treinos_aluno))

    # 5. LISTAR POR PROFESSOR
    treinos_professor = treino_dao.listar_por_professor(id_professor)

    print("\n5. Treinos do professor:", len(treinos_professor))

    # 6. ATUALIZAR
    resultado = treino_dao.atualizar(
        id_treino,
        id_aluno,
        id_professor,
        "Treino A Atualizado",
        "Treino atualizado para teste",
        date.today()
    )

    print("\n6. Atualização:", resultado)

    # 7. EXCLUIR
    resultado = treino_dao.excluir(id_treino)

    print("\n7. Exclusão:", resultado)

    print("\n=== TESTES CONCLUÍDOS ===")

finally:

    # Excluir primeiro o treino
    if id_treino is not None:
        treino = treino_dao.buscar_por_id(id_treino)

        if treino is not None:
            treino_dao.excluir(id_treino)

    # Depois excluir o aluno
    if id_aluno is not None:
        aluno = aluno_dao.buscar_por_id(id_aluno)

        if aluno is not None:
            aluno_dao.excluir(id_aluno)

    # Por último, excluir o professor
    if id_professor is not None:
        professor = professor_dao.buscar_por_id(id_professor)

        if professor is not None:
            professor_dao.excluir(id_professor)
