-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/11/2026 às 04:40
-- Versão do servidor: 10.11.16-MariaDB
-- Versão do PHP: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `system_gym`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `id_aluno` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `data_cadastro` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `exercicio`
--

CREATE TABLE `exercicio` (
  `id_exercicio` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `grupo_muscular` varchar(50) DEFAULT NULL,
  `descricao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `matricula`
--

CREATE TABLE `matricula` (
  `id_matricula` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_plano` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `status` enum('Ativa','Encerrada','Cancelada') DEFAULT 'Ativa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `id_pagamento` int(11) NOT NULL,
  `id_matricula` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data_pagamento` date DEFAULT NULL,
  `data_vencimento` date NOT NULL,
  `forma_pagamento` varchar(30) DEFAULT NULL,
  `status` enum('Pendente','Pago','Atrasado') DEFAULT 'Pendente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `plano`
--

CREATE TABLE `plano` (
  `id_plano` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL,
  `duracao_meses` int(11) NOT NULL,
  `status` enum('Ativo','Inativo') DEFAULT 'Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `professor`
--

CREATE TABLE `professor` (
  `id_professor` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `especialidade` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `treino`
--

CREATE TABLE `treino` (
  `id_treino` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_professor` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `data_criacao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `treino_exercicio`
--

CREATE TABLE `treino_exercicio` (
`series` int(11) NOT NULL,
`repeticoes` varchar(30) DEFAULT NULL,
`ordem` int(11) DEFAULT NULL,
`observacoes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`id_aluno`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `exercicio`
--
ALTER TABLE `exercicio`
  ADD PRIMARY KEY (`id_exercicio`);

--
-- Índices de tabela `matricula`
--
ALTER TABLE `matricula`
  ADD PRIMARY KEY (`id_matricula`),
  ADD KEY `id_aluno` (`id_aluno`),
  ADD KEY `id_plano` (`id_plano`);

--
-- Índices de tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD KEY `id_matricula` (`id_matricula`);

--
-- Índices de tabela `plano`
--
ALTER TABLE `plano`
  ADD PRIMARY KEY (`id_plano`);

--
-- Índices de tabela `professor`
--
ALTER TABLE `professor`
  ADD PRIMARY KEY (`id_professor`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `treino`
--
ALTER TABLE `treino`
  ADD PRIMARY KEY (`id_treino`),
  ADD KEY `id_aluno` (`id_aluno`),
  ADD KEY `id_professor` (`id_professor`);

--
-- Índices de tabela `treino_exercicio`
--
ALTER TABLE `treino_exercicio`
  ADD PRIMARY KEY (`id_treino_exercicio`),
  ADD KEY `id_treino` (`id_treino`),
  ADD KEY `id_exercicio` (`id_exercicio`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aluno`
--
ALTER TABLE `aluno`
  MODIFY `id_aluno` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `exercicio`
--
ALTER TABLE `exercicio`
  MODIFY `id_exercicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `matricula`
--
ALTER TABLE `matricula`
  MODIFY `id_matricula` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `id_pagamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `plano`
--
ALTER TABLE `plano`
  MODIFY `id_plano` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `professor`
--
ALTER TABLE `professor`
  MODIFY `id_professor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `treino`
--
ALTER TABLE `treino`
  MODIFY `id_treino` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `treino_exercicio`
--
ALTER TABLE `treino_exercicio`
  MODIFY `id_treino_exercicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `matricula`
--
ALTER TABLE `matricula`
  ADD CONSTRAINT `matricula_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  ADD CONSTRAINT `matricula_ibfk_2` FOREIGN KEY (`id_plano`) REFERENCES `plano` (`id_plano`);

--
-- Restrições para tabelas `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`id_matricula`) REFERENCES `matricula` (`id_matricula`);

--
-- Restrições para tabelas `treino`
--
ALTER TABLE `treino`
  ADD CONSTRAINT `treino_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  ADD CONSTRAINT `treino_ibfk_2` FOREIGN KEY (`id_professor`) REFERENCES `professor` (`id_professor`);

--
-- Restrições para tabelas `treino_exercicio`
--
ALTER TABLE `treino_exercicio`
  ADD CONSTRAINT `treino_exercicio_ibfk_1` FOREIGN KEY (`id_treino`) REFERENCES `treino` (`id_treino`),
  ADD CONSTRAINT `treino_exercicio_ibfk_2` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicio` (`id_exercicio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
