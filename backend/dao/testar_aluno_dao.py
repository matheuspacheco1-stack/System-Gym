from dao.aluno_dao import AlunoDAO
from datetime import datetime


dao = AlunoDAO()

# CPF fictício e único para o teste
cpf_teste = "999" + datetime.now().strftime("%H%M%S%f")[:8]

id_aluno = None

try:
    print("\n=== TESTE DO ALUNODAO ===")

    # 1. CADASTRAR
    id_aluno = dao.cadastrar(
        nome="Aluno Teste",
        cpf=cpf_teste,
        telefone="19999999999",
        email="teste@systemgym.com",
        data_nascimento="2000-01-01",
        endereco="Rua de Teste"
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_aluno)

    # 2. BUSCAR POR ID
    aluno = dao.buscar_por_id(id_aluno)

    print("\n2. Aluno encontrado:")
    print(aluno)

    # 3. ATUALIZAR
    resultado = dao.atualizar(
        id_aluno,
        "Aluno Teste Atualizado",
        cpf_teste,
        "19988888888",
        "atualizado@systemgym.com",
        "2000-01-01",
        "Novo endereço"
    )

    print("\n3. Atualização:", resultado)

    # 4. LISTAR
    alunos = dao.listar()

    print("\n4. Quantidade de alunos:", len(alunos))

    # 5. EXCLUIR
    resultado = dao.excluir(id_aluno)

    print("\n5. Exclusão:", resultado)

    print("\n=== TESTES CONCLUÍDOS ===")

finally:
    # Limpa o registro de teste caso alguma etapa falhe
    if id_aluno is not None:
        aluno = dao.buscar_por_id(id_aluno)

        if aluno is not None:
            dao.excluir(id_aluno)
