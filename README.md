# 💚 FluxoPro — Fluxo de Caixa para Autônomos e Pequenos Negócios

> **"Sua empresa no verde, todos os dias."**

O **FluxoPro** é uma aplicação web completa desenvolvida para ajudar trabalhadores autônomos e pequenos empreendedores a gerenciarem suas finanças com simplicidade, agilidade e precisão.

🌐 **Acesse a aplicação no ar:** [meu-fluxopro.lovable.app](https://meu-fluxopro.lovable.app)

---

## 🚀 Funcionalidades Principais

* **Autenticação Segura:** Cadastro e login individual com e-mail e senha integrados via Supabase Auth, além de fluxo de recuperação de senha.
* **Dashboard Financeiro Dinâmico:** Cálculo automático em tempo real do Saldo Final, Total de Receitas e Total de Despesas com indicação de cor condicional (verde para saldo positivo e vermelho para negativo).
* **Gestão de Transações (CRUD Completo):** Adicione, edite e exclua lançamentos de entradas e saídas de forma rápida.
* **Filtros Avançados:** Filtre movimentações por categoria, tipo de lançamento ou por **Intervalo de Datas** personalizado.
* **Gráficos de Análise:** Visualização de comparativo entre Receitas vs. Despesas e gráfico de rosca com a distribuição de gastos por categoria.
* **Exportação em CSV:** Baixe o extrato de movimentações diretamente para planilhas.
* **Perfil do Usuário com Foto:** Suporte a upload e troca de avatar conectado ao Supabase Storage.
* **Interface Premium Dark Mode:** Design mobile-first com bottom navigation bar simétrica de 5 posições e visual em vidro fosco (glassmorphism).

---

## 🛠️ Tecnologias Utilizadas

* **Front-End:** React, TypeScript, Tailwind CSS, Shadcn/UI
* **Visualização de Dados:** Recharts
* **Back-End & Banco de Dados:** Supabase (Auth, Postgres Database, Row Level Security e Storage)
* **Build Tool:** Vite / TanStack Router

---

## 🔒 Segurança (Row Level Security)

O banco de dados utiliza políticas de **Row Level Security (RLS)** no Supabase. Isso garante que cada usuário logado consiga visualizar, criar, editar e excluir **estritamente as suas próprias transações**, mantendo total privacidade e segurança dos dados financeiros.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos

* **Node.js** (versão 18 ou superior) ou **Bun**
* Conta no **Supabase** (para configurar as variáveis de ambiente)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/fluxopro.git
   cd fluxopro
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou usando bun:
   # bun install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou usando bun:
   # bun dev
   ```
   Abra o navegador no endereço indicado (geralmente http://localhost:5173).

---

## 📄 Licença

Este projeto foi desenvolvido para fins de aprendizado e portfólio. Sinta-se à vontade para explorar e contribuir!
