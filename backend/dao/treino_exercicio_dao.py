
from config.database import conectar


class TreinoExercicioDAO:

    def cadastrar(self, id_treino, id_exercicio, series,
                  repeticoes=None, ordem=None, observacoes=None):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                INSERT INTO treino_exercicio
                (id_treino, id_exercicio, series,
                 repeticoes, ordem, observacoes)
                VALUES (%s, %s, %s, %s, %s, %s)
            """

            valores = (
                id_treino, id_exercicio, series,
                repeticoes, ordem, observacoes
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
                SELECT te.*,
                       e.nome AS nome_exercicio,
                       e.grupo_muscular,
                       t.nome AS nome_treino
                FROM treino_exercicio te
                INNER JOIN exercicio e
                    ON te.id_exercicio = e.id_exercicio
                INNER JOIN treino t
                    ON te.id_treino = t.id_treino
                ORDER BY te.id_treino, te.ordem
            """

            cursor.execute(sql)

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def buscar_por_id(self, id_treino_exercicio):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            sql = """
                SELECT te.*,
                       e.nome AS nome_exercicio,
                       e.grupo_muscular,
                       t.nome AS nome_treino
                FROM treino_exercicio te
                INNER JOIN exercicio e
                    ON te.id_exercicio = e.id_exercicio
                INNER JOIN treino t
                    ON te.id_treino = t.id_treino
                WHERE te.id_treino_exercicio = %s
            """

            cursor.execute(sql, (id_treino_exercicio,))

            return cursor.fetchone()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def listar_por_treino(self, id_treino):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            sql = """
                SELECT te.*,
                       e.nome AS nome_exercicio,
                       e.grupo_muscular,
                       e.descricao AS descricao_exercicio
                FROM treino_exercicio te
                INNER JOIN exercicio e
                    ON te.id_exercicio = e.id_exercicio
                WHERE te.id_treino = %s
                ORDER BY te.ordem, te.id_treino_exercicio
            """

            cursor.execute(sql, (id_treino,))

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def atualizar(self, id_treino_exercicio, id_treino,
                  id_exercicio, series, repeticoes=None,
                  ordem=None, observacoes=None):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                UPDATE treino_exercicio
                SET id_treino = %s,
                    id_exercicio = %s,
                    series = %s,
                    repeticoes = %s,
                    ordem = %s,
                    observacoes = %s
                WHERE id_treino_exercicio = %s
            """

            valores = (
                id_treino, id_exercicio, series,
                repeticoes, ordem, observacoes,
                id_treino_exercicio
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

    def excluir(self, id_treino_exercicio):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            cursor.execute(
                """
                DELETE FROM treino_exercicio
                WHERE id_treino_exercicio = %s
                """,
                (id_treino_exercicio,)
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
