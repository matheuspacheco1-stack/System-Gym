class TreinoExercicio:

    def __init__(self, id_treino_exercicio, id_treino,
                 id_exercicio, series, repeticoes, ordem,
                 observacoes=None):

        self.id_treino_exercicio = id_treino_exercicio
        self.id_treino = id_treino
        self.id_exercicio = id_exercicio
        self.series = series
        self.repeticoes = repeticoes
        self.ordem = ordem
        self.observacoes = observacoes

    def exibir_dados(self):
        print("=== EXERCÍCIO DO TREINO ===")
        print("ID:", self.id_treino_exercicio)
        print("Treino:", self.id_treino)
        print("Exercício:", self.id_exercicio)
        print("Séries:", self.series)
        print("Repetições:", self.repeticoes)
        print("Ordem:", self.ordem)
        print("Observações:", self.observacoes)