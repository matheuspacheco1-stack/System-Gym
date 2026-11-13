
from dao.pagamento_dao import PagamentoDAO
from dao.matricula_dao import MatriculaDAO
from dao.aluno_dao import AlunoDAO
from dao.plano_dao import PlanoDAO

from datetime import date, timedelta
from decimal import Decimal
from uuid import uuid4


pagamento_dao = PagamentoDAO()
matricula_dao = MatriculaDAO()
aluno_dao = AlunoDAO()
plano_dao = PlanoDAO()

id_aluno = None
id_plano = None
id_matricula = None
id_pagamento = None

identificador = uuid4().hex

try:
    print("\n=== TESTE DO PAGAMENTODAO ===")

    # Criar aluno temporário
    id_aluno = aluno_dao.cadastrar(
        nome="Aluno Teste Pagamento",
        cpf=str(uuid4().int)[:11],
        telefone="19999999999",
        email=f"pagamento.{identificador[:12]}@systemgym.com",
        data_nascimento="2000-01-01",
        endereco="Rua de Teste"
    )

    # Criar plano temporário
    id_plano = plano_dao.cadastrar(
        nome=f"Plano Pagamento {identificador[:8]}",
        descricao="Plano temporário",
        valor=Decimal("99.90"),
        duracao_meses=1
    )

    # Criar matrícula temporária
    data_inicio = date.today()
    data_fim = data_inicio + timedelta(days=30)

    id_matricula = matricula_dao.cadastrar(
        id_aluno,
        id_plano,
        data_inicio,
        data_fim
    )

    # 1. CADASTRAR PAGAMENTO
    id_pagamento = pagamento_dao.cadastrar(
        id_matricula=id_matricula,
        valor=Decimal("99.90"),
        data_vencimento=data_fim,
        data_pagamento=None,
        forma_pagamento="Pix",
        status="Pendente"
    )

    print("\n1. Cadastro realizado!")
    print("ID:", id_pagamento)

    # 2. BUSCAR POR ID
    pagamento = pagamento_dao.buscar_por_id(id_pagamento)

    print("\n2. Pagamento encontrado:")
    print(pagamento)

    # 3. LISTAR
    pagamentos = pagamento_dao.listar()

    print("\n3. Quantidade de pagamentos:", len(pagamentos))

    # 4. LISTAR POR MATRÍCULA
    pagamentos_matricula = pagamento_dao.listar_por_matricula(
        id_matricula
    )

    print("\n4. Pagamentos da matrícula:",
          len(pagamentos_matricula))

    # 5. ATUALIZAR PARA PAGO
    resultado = pagamento_dao.atualizar(
        id_pagamento,
        id_matricula,
        Decimal("99.90"),
        date.today(),
        data_fim,
        "Pix",
        "Pago"
    )

    print("\n5. Atualização:", resultado)

    # 6. EXCLUIR
    resultado = pagamento_dao.excluir(id_pagamento)

    print("\n6. Exclusão:", resultado)

    print("\n=== TESTES CONCLUÍDOS ===")

finally:
    # Limpeza dos registros temporários, respeitando as FKs.

    if id_pagamento is not None:
        pagamento = pagamento_dao.buscar_por_id(id_pagamento)

        if pagamento is not None:
            pagamento_dao.excluir(id_pagamento)

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
