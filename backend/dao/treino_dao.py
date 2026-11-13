
from config.database import conectar


class TreinoDAO:

    def cadastrar(self, id_aluno, id_professor, nome,
                  descricao, data_criacao):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                INSERT INTO treino
                (id_aluno, id_professor, nome,
                 descricao, data_criacao)
                VALUES (%s, %s, %s, %s, %s)
            """

            valores = (
                id_aluno, id_professor, nome,
                descricao, data_criacao
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
                SELECT t.*,
                       a.nome AS nome_aluno,
                       p.nome AS nome_professor
                FROM treino t
                INNER JOIN aluno a
                    ON t.id_aluno = a.id_aluno
                INNER JOIN professor p
                    ON t.id_professor = p.id_professor
                ORDER BY t.data_criacao DESC
            """

            cursor.execute(sql)

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def buscar_por_id(self, id_treino):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                "SELECT * FROM treino WHERE id_treino = %s",
                (id_treino,)
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
                SELECT t.*,
                       p.nome AS nome_professor
                FROM treino t
                INNER JOIN professor p
                    ON t.id_professor = p.id_professor
                WHERE t.id_aluno = %s
                ORDER BY t.data_criacao DESC
                """,
                (id_aluno,)
            )

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def listar_por_professor(self, id_professor):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT t.*,
                       a.nome AS nome_aluno
                FROM treino t
                INNER JOIN aluno a
                    ON t.id_aluno = a.id_aluno
                WHERE t.id_professor = %s
                ORDER BY t.data_criacao DESC
                """,
                (id_professor,)
            )

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def atualizar(self, id_treino, id_aluno, id_professor,
                  nome, descricao, data_criacao):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                UPDATE treino
                SET id_aluno = %s,
                    id_professor = %s,
                    nome = %s,
                    descricao = %s,
                    data_criacao = %s
                WHERE id_treino = %s
            """

            valores = (
                id_aluno, id_professor, nome,
                descricao, data_criacao, id_treino
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

    def excluir(self, id_treino):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            cursor.execute(
                "DELETE FROM treino WHERE id_treino = %s",
                (id_treino,)
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
