from models.aluno import Aluno
from datetime import date

# Criando um objeto da classe Aluno
aluno1 = Aluno(
    1,
    "João Silva",
    "123.456.789-00",
    "11999999999",
    "joao@email.com",
    date(2005, 4, 15),
    "Rua A, 100",
    date.today()
)

# Exibindo os dados
aluno1.exibir_dados()