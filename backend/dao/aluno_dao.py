
from config.database import conectar


class AlunoDAO:

    def cadastrar(self, nome, cpf, telefone=None, email=None,
                  data_nascimento=None, endereco=None):
        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        try:
            cursor = conexao.cursor()

            sql = """
                INSERT INTO aluno
                (nome, cpf, telefone, email,
                 data_nascimento, endereco, data_cadastro)
                VALUES (%s, %s, %s, %s, %s, %s, CURDATE())
            """

            valores = (
                nome, cpf, telefone, email,
                data_nascimento, endereco
            )

            cursor.execute(sql, valores)
            conexao.commit()

            return cursor.lastrowid

        except Exception:
            conexao.rollback()
            raise

        finally:
            cursor.close() if "cursor" in locals() else None
            conexao.close()

    def listar(self):
        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        try:
            cursor = conexao.cursor(dictionary=True)
            cursor.execute("SELECT * FROM aluno ORDER BY nome")
            return cursor.fetchall()

        finally:
            cursor.close() if "cursor" in locals() else None
            conexao.close()

    def buscar_por_id(self, id_aluno):
        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        try:
            cursor = conexao.cursor(dictionary=True)

            cursor.execute(
                "SELECT * FROM aluno WHERE id_aluno = %s",
                (id_aluno,)
            )

            return cursor.fetchone()

        finally:
            cursor.close() if "cursor" in locals() else None
            conexao.close()

    def atualizar(self, id_aluno, nome, cpf, telefone=None,
                  email=None, data_nascimento=None, endereco=None):
        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        try:
            cursor = conexao.cursor()

            sql = """
                UPDATE aluno
                SET nome = %s,
                    cpf = %s,
                    telefone = %s,
                    email = %s,
                    data_nascimento = %s,
                    endereco = %s
                WHERE id_aluno = %s
            """

            cursor.execute(sql, (
                nome, cpf, telefone, email,
                data_nascimento, endereco, id_aluno
            ))

            alterados = cursor.rowcount
            conexao.commit()

            return alterados > 0

        except Exception:
            conexao.rollback()
            raise

        finally:
            cursor.close() if "cursor" in locals() else None
            conexao.close()

    def excluir(self, id_aluno):
        conexao = conectar()

        if conexao is None:
            raise ConnectionError("Não foi possível conectar ao banco.")

        try:
            cursor = conexao.cursor()

            cursor.execute(
                "DELETE FROM aluno WHERE id_aluno = %s",
                (id_aluno,)
            )

            excluidos = cursor.rowcount
            conexao.commit()

            return excluidos > 0

        except Exception:
            conexao.rollback()
            raise

        finally:
            cursor.close() if "cursor" in locals() else None
            conexao.close()
