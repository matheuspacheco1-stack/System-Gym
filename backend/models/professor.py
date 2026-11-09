class Professor:

    def __init__(self, id_professor, nome, cpf, telefone, email, especialidade):

        self.id_professor = id_professor
        self.nome = nome
        self.cpf = cpf
        self.telefone = telefone
        self.email = email
        self.especialidade = especialidade

    def exibir_dados(self):
        print("=== DADOS DO PROFESSOR ===")
        print("ID:", self.id_professor)
        print("Nome:", self.nome)
        print("CPF:", self.cpf)
        print("Telefone:", self.telefone)
        print("E-mail:", self.email)
        print("Especialidade:", self.especialidade)