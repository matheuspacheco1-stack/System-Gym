
from config.database import conectar


class ExercicioDAO:

    def cadastrar(self, nome, grupo_muscular=None, descricao=None):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                INSERT INTO exercicio
                (nome, grupo_muscular, descricao)
                VALUES (%s, %s, %s)
            """

            valores = (nome, grupo_muscular, descricao)

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

            cursor.execute(
                "SELECT * FROM exercicio ORDER BY nome"
            )

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def buscar_por_id(self, id_exercicio):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                "SELECT * FROM exercicio WHERE id_exercicio = %s",
                (id_exercicio,)
            )

            return cursor.fetchone()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def listar_por_grupo_muscular(self, grupo_muscular):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT * FROM exercicio
                WHERE grupo_muscular = %s
                ORDER BY nome
                """,
                (grupo_muscular,)
            )

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def atualizar(self, id_exercicio, nome,
                  grupo_muscular=None, descricao=None):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                UPDATE exercicio
                SET nome = %s,
                    grupo_muscular = %s,
                    descricao = %s
                WHERE id_exercicio = %s
            """

            valores = (
                nome, grupo_muscular,
                descricao, id_exercicio
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

    def excluir(self, id_exercicio):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            cursor.execute(
                "DELETE FROM exercicio WHERE id_exercicio = %s",
                (id_exercicio,)
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
