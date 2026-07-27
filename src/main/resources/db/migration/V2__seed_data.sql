INSERT INTO users (name, email, password, cpf)
SELECT 'Admin', 'admin@viagens.com', '$2a$10$DXqSGnYLtFPR1rmuJ419euZJQzHyYfWPnVA9QRRddo0iPfqJD9q2O', '11111111112'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@viagens.com'
);


INSERT INTO users (name, email, password, cpf)
SELECT 'Umberto', 'umberto@teste.com', '$2a$10$DXqSGnYLtFPR1rmuJ419euZJQzHyYfWPnVA9QRRddo0iPfqJD9q2O', '11111111111'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'umberto@teste.com'
);

INSERT INTO users (name, email, password, cpf)
SELECT 'Doisberto', 'doisberto@teste.com', '$2a$10$DXqSGnYLtFPR1rmuJ419euZJQzHyYfWPnVA9QRRddo0iPfqJD9q2O', '22222222222'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'doisberto@teste.com'
);


INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'ABC-1234', 'Fiorino', 'LEVE', 2022
WHERE NOT EXISTS (
    SELECT 1 FROM veiculos WHERE placa = 'ABC-1234'
);

INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'XYZ-9876', 'Volvo FH', 'PESADO', 2021
WHERE NOT EXISTS (
    SELECT 1 FROM veiculos WHERE placa = 'XYZ-9876'
);

INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'KJG-1122', 'Mercedes Sprinter', 'LEVE', 2020
WHERE NOT EXISTS (
    SELECT 1 FROM veiculos WHERE placa = 'KJG-1122'
);

INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'LMN-4455', 'Scania R500', 'PESADO', 2023
WHERE NOT EXISTS (
    SELECT 1 FROM veiculos WHERE placa = 'LMN-4455'
);

INSERT INTO viagens (veiculo_id, data_saida, data_chegada, origem, destino, km_percorrida) VALUES
(1, '2024-05-01 08:00:00', '2024-05-01 18:00:00', 'São Paulo', 'Rio de Janeiro', 435.00),
(1, '2024-05-05 09:00:00', '2024-05-05 12:00:00', 'Rio de Janeiro', 'Niterói', 20.50),
(2, '2024-05-02 05:00:00', '2024-05-03 20:00:00', 'Curitiba', 'Belo Horizonte', 1000.00);

INSERT INTO manutencoes (veiculo_id, data_inicio, data_finalizacao, tipo_servico, custo_estimado, status) VALUES
(1, '2024-06-10', '2024-06-11', 'Troca de Óleo', 350.00, 'PENDENTE'),
(2, '2024-06-15', '2024-06-17', 'Revisão de Freios', 1500.00, 'PENDENTE'),
(3, '2024-05-20', '2024-05-20', 'Troca de Pneus', 2200.00, 'CONCLUIDA');
