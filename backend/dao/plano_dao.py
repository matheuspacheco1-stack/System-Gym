
from config.database import conectar


class PlanoDAO:

    def cadastrar(self, nome, descricao, valor,
                  duracao_meses, status="Ativo"):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                INSERT INTO plano
                (nome, descricao, valor, duracao_meses, status)
                VALUES (%s, %s, %s, %s, %s)
            """

            valores = (
                nome, descricao, valor,
                duracao_meses, status
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

            cursor.execute("SELECT * FROM plano ORDER BY nome")

            return cursor.fetchall()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def buscar_por_id(self, id_plano):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                "SELECT * FROM plano WHERE id_plano = %s",
                (id_plano,)
            )

            return cursor.fetchone()

        finally:
            if cursor:
                cursor.close()
            conexao.close()

    def atualizar(self, id_plano, nome, descricao, valor,
                  duracao_meses, status):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            sql = """
                UPDATE plano
                SET nome = %s,
                    descricao = %s,
                    valor = %s,
                    duracao_meses = %s,
                    status = %s
                WHERE id_plano = %s
            """

            valores = (
                nome, descricao, valor,
                duracao_meses, status, id_plano
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

    def excluir(self, id_plano):

        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        cursor = None

        try:
            cursor = conexao.cursor()

            cursor.execute(
                "DELETE FROM plano WHERE id_plano = %s",
                (id_plano,)
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
