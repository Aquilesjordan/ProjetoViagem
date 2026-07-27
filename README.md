# Sistema de Viagens

![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-6DB33F)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.0-3178C6)

Sistema full stack para gestão de **veículos**, **viagens** e **manutenções**, com autenticação JWT e dashboard analítico. Voltado para operações de logística/frota que precisam acompanhar quilometragem, volume de viagens por categoria e status de manutenção.

---

## Sumário

1. [Como configurar e rodar o projeto localmente](#1-como-configurar-e-rodar-o-projeto-localmente)
2. [Como rodar com Docker Compose (full stack)](#2-como-rodar-com-docker-compose-full-stack)
3. [Decisões técnicas, ferramentas e arquitetura](#3-decisões-técnicas-ferramentas-e-arquitetura)
4. [Alterações no banco de dados](#4-alterações-no-banco-de-dados)
5. [Endpoints principais](#5-endpoints-principais)
6. [Demonstração](#6-demonstração)
7. [Estrutura de pastas](#7-estrutura-de-pastas)

---

## 1) Como configurar e rodar o projeto localmente

### Pré-requisitos

| Ferramenta | Versão |
|---|---|
| Java | 21 |
| Maven | incluso via wrapper (`mvnw` / `mvnw.cmd`) |
| Node.js + npm | LTS atual |
| PostgreSQL | em execução local ou via Docker |

### Passo 1 — Clonar o repositório

```bash
git clone <url-do-repositorio>
cd ProjetoViagem
```

### Passo 2 — Configurar o backend

Crie/edite `src/main/resources/application.properties` (use placeholders, não suba credenciais reais):

```properties
server.port=8081

spring.datasource.url=jdbc:postgresql://localhost:5432/viagens
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

security.jwt.secret=UMA_CHAVE_COM_PELO_MENOS_32_CARACTERES
```

> O schema é criado/atualizado automaticamente pelo **Flyway** na primeira execução (ver seção 3).

### Passo 3 — Subir o backend

```bash
# na raiz do repositório
./mvnw spring-boot:run
# Windows
mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8081`.

### Passo 4 — Configurar e subir o frontend

Opcional — crie `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8081
```

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe por padrão em `http://localhost:5173`.

### Passo 5 — Testar a API pelo Swagger

- UI: `http://localhost:8081/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`

Para testar endpoints protegidos:
1. Execute `POST /auth` com e-mail/CPF e senha válidos.
2. Copie o `token` retornado.
3. Clique em **Authorize** no topo do Swagger e cole o token.
4. Os demais endpoints passam a ser executados com o header `Authorization` automaticamente.

---

## 2) Como rodar com Docker Compose (full stack)

O projeto está preparado para subir **PostgreSQL + backend Spring Boot + frontend React (build estático via Nginx)** com um único comando.

### Arquivos usados

- `docker-compose.yml`
- `Dockerfile` (backend)
- `frontend/Dockerfile` (build do frontend)
- `frontend/nginx.conf` (fallback SPA para rotas do React Router)

### Subir tudo

```bash
docker compose up --build
```

### Serviços e portas

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8081`
- **Swagger**: `http://localhost:8081/swagger-ui/index.html`
- **PostgreSQL**: `localhost:5432`

### Variáveis importantes (definidas no compose)

- `SPRING_DATASOURCE_URL=jdbc:postgresql://postgresql:5432/viagens`
- `SPRING_DATASOURCE_USERNAME=postgres`
- `SPRING_DATASOURCE_PASSWORD=postgres`
- `SERVER_PORT=8081`
- `SECURITY_JWT_SECRET=changeitchangeitchangeitchangeit`

### Parar containers

```bash
docker compose down
```

Para remover também o volume do banco:

```bash
docker compose down -v
```

### Troubleshooting rápido

- Se a porta `5432`, `8081` ou `5173` estiver ocupada, altere o mapeamento em `docker-compose.yml`.
- O backend depende do healthcheck do PostgreSQL (`pg_isready`), então ele só inicia após o banco ficar saudável.
- Se alterar dependências do frontend/backend, rode novamente com `--build`.

---

## 3) Decisões técnicas, ferramentas e arquitetura

### Backend — tecnologias e por quê

| Tecnologia | Motivo da escolha |
|---|---|
| **Java 21 + Spring Boot 3.5.6** | Base madura para APIs REST, com auto-configuração e ecossistema amplo. |
| **Spring Data JPA (Hibernate)** | Reduz boilerplate de persistência e mapeia entidades diretamente para o schema relacional. |
| **Spring Security + JWT (jjwt)** | Autenticação stateless, sem sessão no servidor — adequado para uma API consumida por um SPA. |
| **Bean Validation** | Validação declarativa nos DTOs de entrada, evitando validação manual repetida nos controllers. |
| **springdoc-openapi** | Gera documentação Swagger automaticamente a partir dos controllers, facilitando testes manuais. |
| **Flyway** | Versionamento de schema auditável e reproduzível (ver seção 4). |
| **PostgreSQL** | Banco relacional robusto, com suporte nativo a constraints e tipos usados no domínio (`CHECK`, `DECIMAL`). |
| **Lombok** | Reduz boilerplate de getters/setters/construtores nas entidades e DTOs. |

### Frontend — tecnologias e por quê

| Tecnologia | Motivo da escolha |
|---|---|
| **React 18 + TypeScript** | Tipagem estática reduz erros em tempo de desenvolvimento, especialmente na camada de formulários e serviços de API. |
| **Vite** | Dev server rápido e build otimizado. |
| **React Query** | Cache, revalidação e sincronização de estado assíncrono com a API, evitando gerenciamento manual de loading/erro. |
| **React Hook Form + Zod** | Formulários performáticos com validação declarativa e tipada, compartilhando o schema entre validação e tipo TypeScript. |
| **Material UI + X Data Grid** | Design system consistente e componente de tabela com paginação/ordenação prontos para uso. |
| **Recharts** | Gráficos do dashboard (barras e pizza) com boa integração em React. |
| **Axios** | Cliente HTTP com interceptors para injeção automática do JWT em cada requisição. |

### Arquitetura do backend (camadas)

```
application/
├─ controller/   → endpoints REST (Auth, Vehicle, Viagem, Manutencao, Dashboard, User)
├─ service/      → regras de negócio e orquestração
├─ repository/   → acesso a dados via Spring Data JPA
├─ model/        → entidades JPA e enums de domínio
└─ dto/          → contratos de entrada/saída da API
config/
├─ security/     → JWT, filtros de autenticação
└─ (CORS, Swagger)
common/
└─ exceptions/   → tratamento centralizado de erros (@RestControllerAdvice)
```

**Boas práticas de POO aplicadas:**
- **DTO Pattern** — controllers nunca expõem entidades diretamente, apenas DTOs.
- **Injeção de dependência via construtor** — services e repositories injetados sem `@Autowired` em campo.
- **Single Responsibility** — controller delega regra de negócio ao service; repository concentra apenas acesso a dados.
- **Consultas agregadas no banco** — o dashboard usa `SUM`, `COUNT` e `GROUP BY` em JPQL nos repositórios, evitando trazer todos os registros para agregação em memória na aplicação.

### Autenticação e autorização

- Login via `POST /auth`, aceitando e-mail **ou CPF** + senha.
- `AuthService` valida as credenciais e gera o token JWT através de `JwtService`.
- `SecurityConfig` configura:
  - sessão **STATELESS** (sem estado no servidor);
  - rotas públicas: `/auth/**`, Swagger, `/users`;
  - demais rotas exigem token válido.
- `JwtAuthenticationFilter` intercepta cada requisição e valida o header `Authorization: Bearer <token>`.
- No frontend, o token é persistido e injetado automaticamente via interceptor do Axios em toda chamada.

### CORS

- Configurado para aceitar a origem do frontend em desenvolvimento (`http://localhost:5173`), com os métodos `GET, POST, PUT, DELETE, PATCH, OPTIONS`.
- O `SecurityConfig` também libera explicitamente o método `OPTIONS` (preflight), já que o Spring Security intercepta requisições antes do handler de CORS do Spring MVC — sem essa liberação, o preflight retorna `403` mesmo com o CORS configurado corretamente.

### Arquitetura do frontend

```
src/
├─ pages/        → telas de negócio (Dashboard, Trips, Vehicles, Manutencoes, Login)
├─ components/
│  ├─ layout/    → shell da aplicação (Header, Sidebar, PageLayout)
│  ├─ ui/        → componentes reutilizáveis (botões, inputs, cards, diálogos)
│  └─ trips/     → tabela e formulário específicos de viagens
├─ services/     → camada de acesso HTTP (api.ts + serviços por recurso)
├─ hooks/        → hooks customizados (useTrips, useDashboard, useAuth, useNotification)
├─ contexts/     → autenticação e notificações globais
└─ types/        → tipagem de domínio compartilhada com a API
```

---

## 4) Alterações no banco de dados

### Justificativa

O schema inicial foi adaptado para refletir o domínio real do desafio — controle de **veículos**, **viagens** e **manutenções** — em vez de um modelo genérico. As principais decisões foram:

- **Versionamento via Flyway**, em vez de deixar o Hibernate criar/atualizar o schema livremente (`ddl-auto=update` é usado apenas como apoio em desenvolvimento; a fonte de verdade do schema é a migration versionada).
- **Constraint `CHECK` no campo `tipo`** de veículos (`LEVE`/`PESADO`), garantindo integridade a nível de banco, não apenas na aplicação.
- **`ON DELETE CASCADE`** nas chaves estrangeiras de `viagens` e `manutencoes`, já que esses registros não têm sentido de existir sem o veículo associado.
- **Campos numéricos com `DECIMAL(10,2)`** para quilometragem e custo estimado, evitando problemas de precisão de ponto flutuante em valores financeiros e de medição.

### Scripts de migration (`V1__init.sql` + `V2__seed_data.sql`)

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cpf VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS veiculos (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('LEVE', 'PESADO')),
    ano INTEGER
);

CREATE TABLE IF NOT EXISTS viagens (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
    data_saida TIMESTAMP NOT NULL,
    data_chegada TIMESTAMP,
    origem VARCHAR(100),
    destino VARCHAR(100),
    km_percorrida DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS manutencoes (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_finalizacao DATE,
    tipo_servico VARCHAR(100),
    custo_estimado DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'PENDENTE'
);

-- V2__seed_data.sql
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
    
-- Inserindo Veículos
INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'ABC-1234', 'Fiorino', 'LEVE', 2022
WHERE NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = 'ABC-1234');
INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'XYZ-9876', 'Volvo FH', 'PESADO', 2021
WHERE NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = 'XYZ-9876');
INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'KJG-1122', 'Mercedes Sprinter', 'LEVE', 2020
WHERE NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = 'KJG-1122');
INSERT INTO veiculos (placa, modelo, tipo, ano)
SELECT 'LMN-4455', 'Scania R500', 'PESADO', 2023
WHERE NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = 'LMN-4455');

-- Inserindo Viagens (Para testar o Dashboard)
INSERT INTO viagens (veiculo_id, data_saida, data_chegada, origem, destino, km_percorrida) VALUES 
(1, '2024-05-01 08:00:00', '2024-05-01 18:00:00', 'São Paulo', 'Rio de Janeiro', 435.00),
(1, '2024-05-05 09:00:00', '2024-05-05 12:00:00', 'Rio de Janeiro', 'Niterói', 20.50),
(2, '2024-05-02 05:00:00', '2024-05-03 20:00:00', 'Curitiba', 'Belo Horizonte', 1000.00);

-- Inserindo Manutenções (Para testar o Cronograma e Custos)
INSERT INTO manutencoes (veiculo_id, data_inicio, data_finalizacao, tipo_servico, custo_estimado, status) VALUES 
(1, '2024-06-10', '2024-06-11', 'Troca de Óleo', 350.00, 'PENDENTE'),
(2, '2024-06-15', '2024-06-17', 'Revisão de Freios', 1500.00, 'PENDENTE'),
(3, '2024-05-20', '2024-05-20', 'Troca de Pneus', 2200.00, 'CONCLUIDA');
```

### Relacionamentos

- `viagens.veiculo_id → veiculos.id` — muitas viagens para um veículo (N:1).
- `manutencoes.veiculo_id → veiculos.id` — muitas manutenções para um veículo (N:1).

---

## 5) Endpoints principais

### Autenticação
- `POST /auth` — login (e-mail ou CPF + senha), retorna JWT.

### Usuário
- `POST /users` — cadastro de usuário.

### Dashboard
- `GET /api/dashboard` — indicadores agregados (km total, viagens por categoria, ranking de veículos).

### Veículos
- `GET /api/veiculos` — lista veículos.
- `GET /api/veiculos/{id}` — detalhe de veículo.
- `POST /api/veiculos` — cria veículo.
- `PUT /api/veiculos/{id}` — atualiza veículo.
- `DELETE /api/veiculos/{id}` — remove veículo.

### Viagens
- `GET /api/viagens` — lista paginada com filtros (`vehicleId`, `originCity`, `destinationCity`, `departureStart`, `departureEnd`, `minDistanceKm`, `maxDistanceKm`, `page`, `size`, `sort`).
- `GET /api/viagens/{id}` — detalhe de viagem.
- `POST /api/viagens` — cria viagem.
- `PUT /api/viagens/{id}` — atualiza viagem.
- `DELETE /api/viagens/{id}` — remove viagem.

### Manutenções
- `GET /api/manutencoes` — lista manutenções.
- `GET /api/manutencoes/{id}` — detalhe de manutenção.
- `POST /api/manutencoes` — cria manutenção.
- `PUT /api/manutencoes/{id}` — atualiza manutenção.
- `DELETE /api/manutencoes/{id}` — remove manutenção.

---

## 6) Demonstração

> 📸 Video: **[\[adicionar aqui\]](https://www.youtube.com/watch?v=_5d01Hn8CsA)**

---

## 7) Estrutura de pastas

```text
ProjetoViagem/
├─ pom.xml
├─ docker-compose.yml
├─ Dockerfile
├─ src/
│  ├─ main/
│  │  ├─ java/com/challenge/paymengateway/
│  │  │  ├─ application/
│  │  │  │  ├─ controller/
│  │  │  │  ├─ service/
│  │  │  │  ├─ repository/
│  │  │  │  ├─ model/
│  │  │  │  └─ dto/
│  │  │  ├─ config/
│  │  │  │  └─ security/
│  │  │  └─ common/
│  │  │     └─ exceptions/
│  │  └─ resources/
│  │     ├─ application.properties
│  │     └─ db/migration/V1__init.sql
│  └─ test/
├─ frontend/
│  ├─ Dockerfile
│  ├─ nginx.conf
│  ├─ package.json
│  └─ src/
│     ├─ pages/
│     ├─ components/
│     │  ├─ layout/
│     │  ├─ trips/
│     │  └─ ui/
│     ├─ services/
│     ├─ hooks/
│     ├─ contexts/
│     ├─ types/
│     └─ utils/
└─ README.md
```