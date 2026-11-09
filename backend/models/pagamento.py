class Pagamento:

    def __init__(self, id_pagamento, id_matricula, valor,
                 data_pagamento, data_vencimento,
                 forma_pagamento, status):

        self.id_pagamento = id_pagamento
        self.id_matricula = id_matricula
        self.valor = valor
        self.data_pagamento = data_pagamento
        self.data_vencimento = data_vencimento
        self.forma_pagamento = forma_pagamento
        self.status = status

    def exibir_dados(self):
        print("=== DADOS DO PAGAMENTO ===")
        print("ID:", self.id_pagamento)
        print("Matrícula:", self.id_matricula)
        print("Valor: R$", self.valor)
        print("Data do pagamento:", self.data_pagamento)
        print("Vencimento:", self.data_vencimento)
        print("Forma de pagamento:", self.forma_pagamento)
        print("Status:", self.status)