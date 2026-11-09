class Exercicio:

    def __init__(self, id_exercicio, nome,
                 grupo_muscular, descricao):

        self.id_exercicio = id_exercicio
        self.nome = nome
        self.grupo_muscular = grupo_muscular
        self.descricao = descricao

    def exibir_dados(self):
        print("=== DADOS DO EXERCÍCIO ===")
        print("ID:", self.id_exercicio)
        print("Nome:", self.nome)
        print("Grupo muscular:", self.grupo_muscular)
        print("Descrição:", self.descricao)