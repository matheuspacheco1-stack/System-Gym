
from config.database import conectar


class MatriculaDAO:

    def cadastrar(self, id_aluno, id_plano, data_inicio,
                  data_fim, status="Ativa"):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                INSERT INTO matricula
                (id_aluno, id_plano, data_inicio, data_fim, status)
                VALUES (%s, %s, %s, %s, %s)
            """

            valores = (
                id_aluno, id_plano,
                data_inicio, data_fim, status
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
                SELECT m.*,
                       a.nome AS nome_aluno,
                       p.nome AS nome_plano
                FROM matricula m
                INNER JOIN aluno a
                    ON m.id_aluno = a.id_aluno
                INNER JOIN plano p
                    ON m.id_plano = p.id_plano
                ORDER BY m.id_matricula DESC
            """

            cursor.execute(sql)

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def buscar_por_id(self, id_matricula):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT m.*,
                       a.nome AS nome_aluno,
                       p.nome AS nome_plano
                FROM matricula m
                INNER JOIN aluno a
                    ON m.id_aluno = a.id_aluno
                INNER JOIN plano p
                    ON m.id_plano = p.id_plano
                WHERE m.id_matricula = %s
                """,
                (id_matricula,)
            )

            return cursor.fetchone()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def listar_por_aluno(self, id_aluno):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT m.*,
                       p.nome AS nome_plano,
                       p.valor AS valor_plano
                FROM matricula m
                INNER JOIN plano p
                    ON m.id_plano = p.id_plano
                WHERE m.id_aluno = %s
                ORDER BY m.data_inicio DESC
                """,
                (id_aluno,)
            )

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def atualizar(self, id_matricula, id_aluno, id_plano,
                  data_inicio, data_fim, status):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                UPDATE matricula
                SET id_aluno = %s,
                    id_plano = %s,
                    data_inicio = %s,
                    data_fim = %s,
                    status = %s
                WHERE id_matricula = %s
            """

            valores = (
                id_aluno, id_plano,
                data_inicio, data_fim,
                status, id_matricula
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

    def excluir(self, id_matricula):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            cursor.execute(
                "DELETE FROM matricula WHERE id_matricula = %s",
                (id_matricula,)
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
