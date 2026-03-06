# Diagrama de Arquitetura (System Design)
**Projeto:** Portfolio Manager
**Data:** Março de 2026

```mermaid
graph LR
    User((Investidor)) -->|Acessa via Celular/PC| Front[Frontend: Next.js]
    Front -->|Autenticação direta| Supabase[(Supabase: Auth)]
    Front -->|Requisições HTTPS| Back[Backend: FastAPI]
    Back -->|Consultas SQL| DB[(Supabase: PostgreSQL)]
    Back -->|Busca Cotações| API[Yahoo Finance / B3]