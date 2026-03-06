# Product Requirements Document (PRD)
**Produto:** Portfolio Manager (Hub de Análise e Controle Financeiro)
**Status:** MVP (Minimum Viable Product)
**Data de Atualização:** Março de 2026

## 1. Visão Geral do Produto
O *Portfolio Manager* não é apenas mais um rastreador de carteira. É um Hub de Análise Fundamentalista e Controle Financeiro projetado para investidores que buscam entender os fundamentos de seus ativos (Dívida, Caixa, Lucros, P/L) e acompanhar o crescimento real do seu patrimônio (Evolução + Dividendos). O sistema une gestão de portfólio com educação financeira de alto nível, operando com total segurança e soberania de dados.

## 2. Público-Alvo (Persona)
**O Investidor Fundamentalista / Estudioso**
* **Dores:** Cansado de cadastrar notas de corretagem manualmente. Aplicativos atuais mostram apenas se a ação subiu ou desceu, mas não explicam *o porquê* (falta de dados de balanço). Tem medo de usar planilhas complexas que quebram facilmente.
* **Necessidades:** Precisa de um dashboard claro, importação automática da B3, visualização de proventos (dividendos) e acesso rápido a indicadores fundamentalistas para embasar seus estudos.

## 3. Escopo do MVP (Minimum Viable Product)
O MVP focará exclusivamente no mercado de ações à vista (B3/EUA) e controle de caixa (liquidez). O grande diferencial competitivo desta fase será o "Raio-X do Ativo" e o "Screener Educacional".

### 3.1. Requisitos Funcionais (O que o sistema faz)

**Módulo 1: Autenticação e Conta**
* [RF-01] O sistema deve permitir o cadastro e login de usuários via E-mail e Senha utilizando a infraestrutura do Supabase.
* [RF-02] O sistema deve garantir que um usuário acesse apenas os seus próprios dados financeiros (Row Level Security).

**Módulo 2: Gestão de Caixa e Portfólio**
* [RF-03] O usuário deve poder registrar entradas (aportes) e saídas (resgates) de capital.
* [RF-04] O usuário deve poder registrar compras e vendas de ações, informando Ticker, Quantidade, Data e Preço.
* [RF-05] O sistema deve calcular o Preço Médio automaticamente a cada nova compra.

**Módulo 3: Inteligência e Dados de Mercado**
* [RF-06] O sistema deve buscar a cotação em tempo real (ou com atraso de 15 min padrão) dos ativos cadastrados na carteira via API (ex: `yfinance`).
* [RF-07] O sistema deve exibir um "Termômetro do Mercado" com os índices IBOVESPA, S&P 500 e Dólar.
* [RF-08] O sistema deve calcular o Lucro/Prejuízo (Financeiro e Percentual) de cada ativo e da carteira consolidada.

**Módulo 4: Hub de Análise Fundamentalista**
* [RF-09] O sistema deve ter uma página de "Raio-X do Ativo", onde o usuário pesquisa um Ticker e visualiza: P/L, P/VP, Dividend Yield, Lucro Líquido, Dívida e Caixa.
* [RF-10] O sistema deve apresentar simulações educacionais baseadas em literaturas (Ex: Preço Justo de Graham) com base nos fundamentos matemáticos da empresa.
* [RF-11] O sistema deve possuir um "Screener" que lista ativos do mercado permitindo ordenação por indicadores fundamentalistas.

**Módulo 5: Onboarding (Importação B3)**
* [RF-12] O sistema deve permitir o upload de arquivos `.csv` no padrão da B3 para popular a carteira automaticamente.

### 3.2. Requisitos Não-Funcionais (Como o sistema faz)

* **[RNF-01] Performance:** O carregamento do Dashboard consolidado deve ocorrer em menos de 2.5 segundos. Consultas à API do Yahoo Finance devem ser cacheadas no backend (FastAPI) para evitar lentidão e bloqueios de IP.
* **[RNF-02] Segurança:** Nenhuma senha ou token de API sensível deve ser exposto no frontend. Toda a comunicação deve ser feita via protocolo HTTPS.
* **[RNF-03] Responsividade:** A interface (Next.js + Tailwind) deve ser construída sob o conceito *Mobile-First*, garantindo que gráficos e tabelas complexas sejam usáveis em smartphones.
* **[RNF-04] Arquitetura:** O backend deve ser construído em Python (FastAPI) para facilitar o processamento matemático com a biblioteca `pandas`.

## 4. Restrições e Compliance (Legal)
* **[LEG-01] Disclaimer CVM:** É **obrigatório** exibir no rodapé de todas as páginas públicas e internas o seguinte texto: *"Aviso Legal: Todas as informações e ferramentas apresentadas neste site possuem caráter estritamente informativo e educacional. Não constituem recomendação, análise ou conselho de investimento."*
* **[LEG-02] LGPD:** O sistema deve permitir que o usuário exclua permanentemente sua conta e todos os seus dados financeiros do banco de dados (Direito ao Esquecimento).

## 5. Escopo Negativo (O que NÃO faremos neste MVP)
Para garantir a entrega rápida e a qualidade do código, os seguintes itens estão **fora** do escopo inicial:
1. Gestão de Criptomoedas, Opções, Futuros ou Renda Fixa complexa.
2. Aplicativo nativo para iOS/Android (o foco será Web App responsivo).
3. Integração direta com senhas de corretoras (Open Finance).
4. Robôs de auto-trading (compra e venda automática).