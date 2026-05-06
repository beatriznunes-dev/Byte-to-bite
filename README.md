# Byte-to-bite
# 🍽️ Byte to Bite

> Sistema de gestão operacional para pequenos negócios de comida — pedidos, cozinha, estoque e faturamento em tempo real.

---

## 📌 O Problema

Pequenos negócios de comida frequentemente perdem pedidos, tempo e dinheiro por não possuírem um sistema centralizado que conecte atendimento, cozinha, estoque e financeiro em tempo real.

Muitos processos ainda dependem de anotações manuais, mensagens no WhatsApp ou da memória operacional do negócio.

O **Byte to Bite** foi criado para resolver esse problema com uma interface simples, visual e eficiente, focada no que realmente importa para a operação.

---

## ✅ Funcionalidades

* Gerenciamento de pedidos em tempo real
* Fluxo visual da cozinha
**Recebido → Em preparo → Pronto → Finalizado**
* Alertas para pedidos sem movimentação
* Dashboard com faturamento diário
* Controle de pedidos abertos e concluídos
* Controle básico de estoque

---

## 🛠️ Tecnologias

### Backend

* Node.js
* Fastify
* TypeScript
* PostgreSQL

### Frontend

* React
* Vite
* TypeScript
* TailwindCSS
* TanStack Query

---

## 🏗️ Estrutura do projeto

```bash
Byte-to-bite/
├── backend/ # API, regras de negócio e banco de dados
└── frontend/ # Interface da aplicação
```

---

## 🚀 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/beatriznunes-dev/Byte-to-bite
cd Byte-to-bite
```

---

### 2. Backend

```bash
cd backend
npm install
npm run migrate
npm run dev
```

A API estará disponível em:

```bash
http://localhost:5173/
```

---

### 3. Frontend

```bash
cd ../frontend
npm install
```

### 🔐 Variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `frontend/`:

```env
VITE_API_URL=http://localhost:5173/
```

> ⚠️ O arquivo `.env` não deve ser versionado.

---

### 4. Execute o frontend

```bash
npm run dev
```

A aplicação estará disponível em:

```bash
http://localhost:5173/
```

---

## 📌 Observações

* Certifique-se de que o backend esteja rodando antes de iniciar o frontend
* O sistema foi pensado para operações em tempo real
* Projeto desenvolvido com foco em escalabilidade e organização full stack

---

## 🎯 Objetivo do projeto

O **Byte to Bite** foi desenvolvido como projeto full stack para aplicar conceitos de:

* Arquitetura cliente-servidor
* Consumo de API
* Gerenciamento de estado
* Comunicação entre frontend e backend
* Organização escalável de código

---