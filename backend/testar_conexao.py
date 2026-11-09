from config.database import conectar

print("Testando conexão com o SYSTEM GYM...")

conexao = conectar()

if conexao:
    if conexao.is_connected():
        print("Conexão realizada com sucesso!")
        print("Banco conectado: SYSTEM GYM")

    conexao.close()
    print("Conexão encerrada.")

else:
    print("Não foi possível conectar ao banco.")