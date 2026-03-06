# Matriz Legal e Políticas de Segurança
**Projeto:** Portfolio Manager
**Data:** Março de 2026

## 1. Disclaimer Jurídico (CVM)
Para evitar enquadramento como casa de análise ou analista de valores mobiliários (conforme instrução CVM), o texto abaixo deve constar obrigatoriamente no **rodapé** de todas as páginas da aplicação:

> *"Aviso Legal: O Portfolio Manager é uma ferramenta estritamente educacional e de controle financeiro pessoal. Todas as simulações, indicadores e dados apresentados não constituem, sob nenhuma hipótese, recomendação de compra, venda ou manutenção de ativos. Rentabilidade passada não é garantia de rentabilidade futura. Consulte um profissional certificado para decisões de investimento."*

## 2. Política de Segurança e Autenticação
Graças à adoção do **Supabase** como plataforma de Backend-as-a-Service, a nossa arquitetura de segurança segue padrões de nível Enterprise ("Enterprise-grade security"):

* **Gestão de Senhas:** Nenhuma senha trafega ou é salva em texto limpo no nosso banco de dados. O Supabase utiliza algoritmos robustos de *hashing* com *salt* dinâmico (criptografia forte) internamente no schema `auth.users`.
* **Sessão (JWT):** A validação de usuários é feita via JSON Web Tokens (JWT) assinados criptograficamente.
* **Isolamento de Dados (RLS):** Todas as tabelas do PostgreSQL (Caixa, Portfólio, Dividendos) possuem *Row Level Security* ativa. Isso garante no nível do banco de dados que um usuário logado jamais consiga consultar via API os dados financeiros de outro usuário.
* **LGPD:** Em conformidade com a Lei Geral de Proteção de Dados, o usuário terá a opção de "Excluir Minha Conta", o que acionará um gatilho de *Cascade Delete* apagando definitivamente todos os seus registros financeiros do sistema.