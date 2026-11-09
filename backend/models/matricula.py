class Matricula:

    def __init__(self, id_matricula, id_aluno, id_plano,
                 data_inicio, data_fim, status):

        self.id_matricula = id_matricula
        self.id_aluno = id_aluno
        self.id_plano = id_plano
        self.data_inicio = data_inicio
        self.data_fim = data_fim
        self.status = status

    def exibir_dados(self):
        print("=== DADOS DA MATRÍCULA ===")
        print("ID:", self.id_matricula)
        print("Aluno:", self.id_aluno)
        print("Plano:", self.id_plano)
        print("Data de início:", self.data_inicio)
        print("Data de término:", self.data_fim)
        print("Status:", self.status)