from datetime import date


class Aluno:

    def __init__(self, id_aluno, nome, cpf, telefone, email,
                 data_nascimento, endereco, data_cadastro):

        self.id_aluno = id_aluno
        self.nome = nome
        self.cpf = cpf
        self.telefone = telefone
        self.email = email
        self.data_nascimento = data_nascimento
        self.endereco = endereco
        self.data_cadastro = data_cadastro

    def exibir_dados(self):
        print("=== DADOS DO ALUNO ===")
        print("ID:", self.id_aluno)
        print("Nome:", self.nome)
        print("CPF:", self.cpf)
        print("Telefone:", self.telefone)
        print("E-mail:", self.email)
        print("Data de nascimento:", self.data_nascimento)
        print("Endereço:", self.endereco)
        print("Data de cadastro:", self.data_cadastro)