
from dao.treino_exercicio_dao import TreinoExercicioDAO
from dao.treino_dao import TreinoDAO
from dao.exercicio_dao import ExercicioDAO
from dao.aluno_dao import AlunoDAO
from dao.professor_dao import ProfessorDAO

from datetime import date
from uuid import uuid4


dao = TreinoExercicioDAO()
treino_dao = TreinoDAO()
exercicio_dao = ExercicioDAO()
aluno_dao = AlunoDAO()
professor_dao = ProfessorDAO()

id_aluno = None
id_professor = None
id_treino = None
id_exercicio = None
id_treino_exercicio = None

identificador = uuid4().hex[:10]

try:
    print("\n=== TESTE DO TREINOEXERCICIODAO ===")

    # Criar aluno temporário
    id_aluno = aluno_dao.cadastrar(
        nome="Aluno Teste Exercício",
        cpf=str(uuid4().int)[:11],
        telefone="19999999999",
        email=f"aluno.{identificador}@systemgym.com",
        data_nascimento="2000-01-01",
        endereco="Rua de Teste"
    )

    # Criar professor temporário
    id_professor = professor_dao.cadastrar(
        nome="Professor Teste Exercício",
        cpf=str(uuid4().int)[:11],
        telefone="19988888888",
        email=f"prof.{identificador}@systemgym.com",
        especialidade="Musculação"
    )

    # Criar treino temporário
    id_treino = treino_dao.cadastrar(
        id_aluno=id_aluno,
        id_professor=id_professor,
        nome="Treino Teste",
        descricao="Treino temporário",
        data_criacao=date.today()
    )

    # Criar exercício temporário
    id_exercicio = exercicio_dao.cadastrar(
        nome=f"Supino Teste {identificador}",
        grupo_muscular="Peito",
        descricao="Exercício temporário"
    )

    # 1. CADASTRAR
    id_treino_exercicio = dao.cadastrar(
        id_treino=id_treino,
        id_exercicio=id_exercicio,
        series=4,
        repeticoes="10 a 12",
        ordem=1,
        observacoes="Manter a execução controlada."
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_treino_exercicio)

    # 2. BUSCAR POR ID
    registro = dao.buscar_por_id(id_treino_exercicio)

    print("\n2. Registro encontrado:")
    print(registro)

    # 3. LISTAR TODOS
    registros = dao.listar()

    print("\n3. Quantidade de registros:", len(registros))

    # 4. LISTAR POR TREINO
    exercicios_treino = dao.listar_por_treino(id_treino)

    print("\n4. Exercícios do treino:", len(exercicios_treino))

    # 5. ATUALIZAR
    resultado = dao.atualizar(
        id_treino_exercicio,
        id_treino,
        id_exercicio,
        3,
        "12 a 15",
        2,
        "Observação atualizada."
    )

    print("\n5. Atualização:", resultado)

    # 6. EXCLUIR
    resultado = dao.excluir(id_treino_exercicio)

    print("\n6. Exclusão:", resultado)

    print("\n=== TESTES CONCLUÍDOS ===")

finally:

    # Excluir primeiro o vínculo entre treino e exercício
    if id_treino_exercicio is not None:
        registro = dao.buscar_por_id(id_treino_exercicio)

        if registro is not None:
            dao.excluir(id_treino_exercicio)

    # Excluir o treino
    if id_treino is not None:
        treino = treino_dao.buscar_por_id(id_treino)

        if treino is not None:
            treino_dao.excluir(id_treino)

    # Excluir o exercício
    if id_exercicio is not None:
        exercicio = exercicio_dao.buscar_por_id(id_exercicio)

        if exercicio is not None:
            exercicio_dao.excluir(id_exercicio)

    # Excluir aluno
    if id_aluno is not None:
        aluno = aluno_dao.buscar_por_id(id_aluno)

        if aluno is not None:
            aluno_dao.excluir(id_aluno)

    # Excluir professor
    if id_professor is not None:
        professor = professor_dao.buscar_por_id(id_professor)

        if professor is not None:
            professor_dao.excluir(id_professor)
