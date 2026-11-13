
from config.database import conectar


class PagamentoDAO:

    def cadastrar(self, id_matricula, valor, data_vencimento,
                  data_pagamento=None, forma_pagamento=None,
                  status="Pendente"):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                INSERT INTO pagamento
                (id_matricula, valor, data_pagamento,
                 data_vencimento, forma_pagamento, status)
                VALUES (%s, %s, %s, %s, %s, %s)
            """

            valores = (
                id_matricula, valor, data_pagamento,
                data_vencimento, forma_pagamento, status
            )

            cursor.execute(sql, valores)
            conexao.commit()

            return cursor.lastrowid

        except Exception:
            conexao.rollback()
            raise

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def listar(self):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            sql = """
                SELECT pg.*,
                       m.id_aluno,
                       a.nome AS nome_aluno,
                       p.nome AS nome_plano
                FROM pagamento pg
                INNER JOIN matricula m
                    ON pg.id_matricula = m.id_matricula
                INNER JOIN aluno a
                    ON m.id_aluno = a.id_aluno
                INNER JOIN plano p
                    ON m.id_plano = p.id_plano
                ORDER BY pg.data_vencimento DESC
            """

            cursor.execute(sql)

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def buscar_por_id(self, id_pagamento):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT * FROM pagamento
                WHERE id_pagamento = %s
                """,
                (id_pagamento,)
            )

            return cursor.fetchone()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def listar_por_matricula(self, id_matricula):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT * FROM pagamento
                WHERE id_matricula = %s
                ORDER BY data_vencimento DESC
                """,
                (id_matricula,)
            )

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def atualizar(self, id_pagamento, id_matricula, valor,
                  data_pagamento, data_vencimento,
                  forma_pagamento, status):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                UPDATE pagamento
                SET id_matricula = %s,
                    valor = %s,
                    data_pagamento = %s,
                    data_vencimento = %s,
                    forma_pagamento = %s,
                    status = %s
                WHERE id_pagamento = %s
            """

            valores = (
                id_matricula, valor, data_pagamento,
                data_vencimento, forma_pagamento,
                status, id_pagamento
            )

            cursor.execute(sql, valores)

            alterados = cursor.rowcount
            conexao.commit()

            return alterados > 0

        except Exception:
            conexao.rollback()
            raise

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def excluir(self, id_pagamento):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            cursor.execute(
                """
                DELETE FROM pagamento
                WHERE id_pagamento = %s
                """,
                (id_pagamento,)
            )

            excluidos = cursor.rowcount
            conexao.commit()

            return excluidos > 0

        except Exception:
            conexao.rollback()
            raise

        finally:
            if cursor:
                cursor.close()
            conexao.close()
