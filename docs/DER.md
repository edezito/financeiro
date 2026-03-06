# Modelagem do Banco de Dados Relacional (DER)

**Banco de Dados:** PostgreSQL (via Supabase)
**Data de Atualização:** Março de 2026

Abaixo está o Diagrama Entidade-Relacionamento do MVP. Utilizamos o schema de autenticação nativo do Supabase (`auth.users`) para gerenciar o login, e vinculamos o ID (UUID) desse usuário a todas as suas movimentações financeiras para garantir a segurança dos dados (Row Level Security).

```mermaid
erDiagram
    Usuarios ||--o{ Transacoes_Caixa : "realiza"
    Usuarios ||--o{ Ativos_Carteira : "possui"
    Usuarios ||--o{ Dividendos : "recebe"

    Usuarios {
        uuid id PK "Vem da tabela auth.users do Supabase"
        varchar email
        timestamp created_at
    }

    Transacoes_Caixa {
        uuid id PK
        uuid usuario_id FK
        varchar tipo "ENTRADA ou SAIDA"
        decimal(15_2) valor "Ex: 1500.00"
        date data_transacao
        varchar descricao "Ex: Aporte Mensal"
    }

    Ativos_Carteira {
        uuid id PK
        uuid usuario_id FK
        varchar ticker "Ex: VALE3"
        integer quantidade "Ex: 100"
        decimal(15_2) preco_medio "Ex: 65.50"
    }

    Dividendos {
        uuid id PK
        uuid usuario_id FK
        varchar ticker "Ex: BBAS3"
        decimal(15_2) valor_total "Ex: 45.00"
        date data_pagamento
    }