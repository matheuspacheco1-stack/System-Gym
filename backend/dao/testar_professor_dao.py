
from dao.professor_dao import ProfessorDAO
from uuid import uuid4


dao = ProfessorDAO()

identificador = uuid4().hex

cpf_teste = str(uuid4().int)[:11]
email_teste = f"professor.{identificador[:10]}@systemgym.com"

id_professor = None

try:
    print("\n=== TESTE DO PROFESSORDAO ===")

    # 1. CADASTRAR
    id_professor = dao.cadastrar(
        nome="Professor Teste",
        cpf=cpf_teste,
        telefone="19999999999",
        email=email_teste,
        especialidade="Musculação"
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_professor)

    # 2. BUSCAR POR ID
    professor = dao.buscar_por_id(id_professor)

    print("\n2. Professor encontrado:")
    print(professor)

    # 3. ATUALIZAR
    resultado = dao.atualizar(
        id_professor,
        "Professor Teste Atualizado",
        cpf_teste,
        "19988888888",
        email_teste,
        "Personal Trainer"
    )

    print("\n3. Atualização:", resultado)

    # 4. LISTAR
    professores = dao.listar()

    print("\n4. Quantidade de professores:", len(professores))

    # 5. EXCLUIR
    resultado = dao.excluir(id_professor)

    print("\n5. Exclusão:", resultado)

    print("\n=== TESTES CONCLUÍDOS ===")

finally:
    # Limpar registro de teste caso alguma etapa falhe
    if id_professor is not None:
        professor = dao.buscar_por_id(id_professor)

        if professor is not None:
            dao.excluir(id_professor)
