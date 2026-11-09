class Plano:

    def __init__(self, id_plano, nome, descricao, valor,
                 duracao_meses, status):

        self.id_plano = id_plano
        self.nome = nome
        self.descricao = descricao
        self.valor = valor
        self.duracao_meses = duracao_meses
        self.status = status

    def exibir_dados(self):
        print("=== DADOS DO PLANO ===")
        print("ID:", self.id_plano)
        print("Nome:", self.nome)
        print("Descrição:", self.descricao)
        print("Valor: R$", self.valor)
        print("Duração:", self.duracao_meses, "meses")
        print("Status:", self.status)