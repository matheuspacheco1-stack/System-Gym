
from dao.matricula_dao import MatriculaDAO
from dao.aluno_dao import AlunoDAO
from dao.plano_dao import PlanoDAO

from datetime import date, timedelta
from decimal import Decimal
from uuid import uuid4


matricula_dao = MatriculaDAO()
aluno_dao = AlunoDAO()
plano_dao = PlanoDAO()

id_aluno = None
id_plano = None
id_matricula = None

identificador = uuid4().hex

try:
    print("\n=== TESTE DO MATRICULADAO ===")

    # Criar aluno temporário
    id_aluno = aluno_dao.cadastrar(
        nome="Aluno Teste Matricula",
        cpf=str(uuid4().int)[:11],
        telefone="19999999999",
        email=f"matricula.{identificador[:12]}@systemgym.com",
        data_nascimento="2000-01-01",
        endereco="Rua de Teste"
    )

    # Criar plano temporário
    id_plano = plano_dao.cadastrar(
        nome=f"Plano Teste {identificador[:8]}",
        descricao="Plano temporário para teste",
        valor=Decimal("99.90"),
        duracao_meses=1
    )

    # 1. CADASTRAR
    data_inicio = date.today()
    data_fim = data_inicio + timedelta(days=30)

    id_matricula = matricula_dao.cadastrar(
        id_aluno,
        id_plano,
        data_inicio,
        data_fim
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_matricula)

    # 2. BUSCAR POR ID
    matricula = matricula_dao.buscar_por_id(id_matricula)

    print("\n2. Matrícula encontrada:")
    print(matricula)

    # 3. LISTAR
    matriculas = matricula_dao.listar()

    print("\n3. Quantidade de matrículas:", len(matriculas))

    # 4. LISTAR POR ALUNO
    matriculas_aluno = matricula_dao.listar_por_aluno(id_aluno)

    print("\n4. Matrículas do aluno:", len(matriculas_aluno))

    # 5. ATUALIZAR
    resultado = matricula_dao.atualizar(
        id_matricula,
        id_aluno,
        id_plano,
        data_inicio,
        data_fim,
        "Encerrada"
    )

    print("\n5. Atualização:", resultado)

    # 6. EXCLUIR
    resultado = matricula_dao.excluir(id_matricula)

    print("\n6. Exclusão:", resultado)

    print("\n=== TESTES CONCLUÍDOS ===")

finally:
    # Excluir somente os registros temporários.
    # A matrícula precisa ser excluída primeiro.

    if id_matricula is not None:
        matricula = matricula_dao.buscar_por_id(id_matricula)

        if matricula is not None:
            matricula_dao.excluir(id_matricula)

    if id_aluno is not None:
        aluno = aluno_dao.buscar_por_id(id_aluno)

        if aluno is not None:
            aluno_dao.excluir(id_aluno)

    if id_plano is not None:
        plano = plano_dao.buscar_por_id(id_plano)

        if plano is not None:
            plano_dao.excluir(id_plano)
