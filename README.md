cat > README.md << 'EOF'

# 🚗 Fleet Management API

API REST para gestão de frota de veículos desenvolvida com NestJS.

## 🛠 Tecnologias

- **NestJS** — framework principal
- **TypeORM** — ORM para SQL Server
- **SQL Server** — banco de dados relacional
- **Redis** — cache de consultas
- **RabbitMQ** — mensageria de eventos
- **MongoDB** — auditoria de interações
- **JWT** — autenticação
- **Jest** — testes automatizados
- **Docker** — containerização

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

## 🚀 Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/HelanoHolanda/fleet-management.git
cd fleet-management
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

> Edite o `.env` com suas configurações se necessário.

### 3. Instale as dependências

```bash
npm install
```

### 4. Suba os containers

```bash
docker-compose up -d sqlserver redis rabbitmq mongodb
```

### 5. Aguarde o SQL Server iniciar (30 segundos) e crie o banco

```bash
docker exec -it fleet-sqlserver //opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "SuaSenha@123" -No -Q "CREATE DATABASE fleet_db"
```

### 6. Execute as migrations

```bash
npm run migration:run
```

### 7. Execute o seed

```bash
npm run seed:aivacol
```

### 8. Inicie a aplicação

```bash
npm run start:dev
```

## 📮 Postman

Importe o arquivo `fleet-management.postman_collection.json` no Postman para ter todas as rotas prontas.

## 🔐 Autenticação

Todas as rotas são protegidas por JWT. Para obter o token:

POST /auth/login
{
"nickname": "aivacol",
"password": "123456"
}

Use o token retornado no header:

## 📡 Rotas

### Auth

| Método | Rota        | Descrição |
| ------ | ----------- | --------- |
| POST   | /auth/login | Login     |

### Vehicles

| Método | Rota          | Descrição         |
| ------ | ------------- | ----------------- |
| POST   | /vehicles     | Criar veículo     |
| GET    | /vehicles     | Listar veículos   |
| PATCH  | /vehicles/:id | Atualizar veículo |
| DELETE | /vehicles/:id | Remover veículo   |

### Models

| Método | Rota        | Descrição        |
| ------ | ----------- | ---------------- |
| POST   | /models     | Criar modelo     |
| GET    | /models     | Listar modelos   |
| PATCH  | /models/:id | Atualizar modelo |
| DELETE | /models/:id | Remover modelo   |

### Brands (bônus)

| Método | Rota                             | Descrição               |
| ------ | -------------------------------- | ----------------------- |
| POST   | /brands                          | Criar marca             |
| GET    | /brands                          | Listar marcas           |
| PATCH  | /brands/:id                      | Atualizar marca         |
| DELETE | /brands/:id                      | Remover marca           |
| PATCH  | /brands/:brandId/models/:modelId | Associar modelo à marca |

## 🏗 Arquitetura

src/
├── auth/
├── common/
│ ├── decorators/
│ ├── filters/
│ ├── guards/
│ └── pipes/
├── brands/
├── models/
├── users/
├── vehicles/
├── messaging/
└── audit/

Cada módulo segue a arquitetura em camadas:

- **Controller** — recebe requisições HTTP
- **Use Cases** — regras de negócio isoladas
- **Repository** — acesso ao banco de dados
- **Entity** — representação da tabela
- **DTO** — validação e tipagem

## ⚡ Cache

Consultas de veículos são cacheadas no Redis com TTL configurável via `CACHE_TTL` no `.env`. O cache é invalidado automaticamente ao criar, atualizar ou remover um veículo.

## 📨 Mensageria

Eventos de veículos são publicados no RabbitMQ:

- `vehicle.created`
- `vehicle.updated`
- `vehicle.deleted`

## 📝 Auditoria

Todas as interações com veículos são registradas no MongoDB na coleção `audit_logs`.

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Cobertura
npm run test:cov
```

## 🔧 Decisões Técnicas

- **UUID** nos IDs — segurança contra enumeração de recursos
- **Cache Redis** — redução de carga no banco em consultas frequentes
- **Use Cases isolados** — facilita testes e manutenção
- **RabbitMQ** — desacoplamento entre módulos
- **MongoDB** — flexibilidade para logs de auditoria

## 🌱 Melhorias Futuras

- Refresh Token
- Roles e permissões
- Rate limiting
- Documentação Swagger
  EOF
