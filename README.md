# 📈 Portfolio Manager

> Um Hub de Análise Fundamentalista e Controle Financeiro com foco em soberania de dados e educação do investidor.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)

## 🎯 Sobre o Projeto
O Portfolio Manager não é apenas um rastreador de carteira. É um sistema projetado para investidores que buscam entender os fundamentos de seus ativos (Dívida, Caixa, Lucros, P/L) e acompanhar o crescimento real do seu patrimônio com foco em dividendos e rentabilidade real.

## ✨ Principais Funcionalidades (MVP)
- **Gestão de Portfólio:** Controle de compras, vendas e cálculo automático de preço médio.
- **Controle de Caixa:** Registro de aportes, resgates e liquidez da conta.
- **Motor Financeiro:** Cotações atualizadas e cálculo de rentabilidade (Lucro/Prejuízo).
- **Raio-X Fundamentalista:** Indicadores chave (P/L, P/VP, DY) consumidos via API.
- **Privacidade e Segurança:** Autenticação robusta e isolamento de dados (RLS) via Supabase.

## 🛠️ Stack Tecnológica
- **Frontend:** Next.js (React), Tailwind CSS.
- **Backend/API:** Python, FastAPI, Pandas.
- **Banco de Dados & Auth:** PostgreSQL (Supabase).
- **Integração de Dados:** yfinance (Yahoo Finance API).

## 📚 Documentação
Toda a modelagem e regras de negócio seguem a cultura de *Docs-as-Code* e podem ser encontradas na pasta `/docs`:
- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Diagrama de Banco de Dados (DER)](./docs/DER.md)
- [Arquitetura do Sistema](./docs/ARQUITETURA.md)
- [Matriz Legal e Segurança](./docs/LEGAL_E_SEGURANCA.md)

---
*Aviso Legal: Ferramenta de caráter estritamente educacional. Não constitui recomendação de investimentos.*