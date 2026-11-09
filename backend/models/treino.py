class Treino:

    def __init__(self, id_treino, id_aluno, id_professor,
                 nome, descricao, data_criacao):

        self.id_treino = id_treino
        self.id_aluno = id_aluno
        self.id_professor = id_professor
        self.nome = nome
        self.descricao = descricao
        self.data_criacao = data_criacao

    def exibir_dados(self):
        print("=== DADOS DO TREINO ===")
        print("ID:", self.id_treino)
        print("Aluno:", self.id_aluno)
        print("Professor:", self.id_professor)
        print("Nome:", self.nome)
        print("Descrição:", self.descricao)
        print("Data de criação:", self.data_criacao)