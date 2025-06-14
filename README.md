# Lince Delivery

Sistema web de delivery inteligente, com chatbot integrado (OpenAI) e atendimento automatizado.


## ✨ Visão Geral

O **Lince Delivery** é uma plataforma moderna de pedidos para restaurantes, focada em experiência do usuário, automação de atendimento e integração de inteligência artificial.  
Desenvolvido para facilitar o processo de escolha, pedido e acompanhamento, conta com um chatbot humanizado que responde dúvidas e ajuda o cliente em tempo real.

---

## 🚀 Funcionalidades

- Consulta de cardápio por categoria (pizzas, hambúrgueres, temakis, bebidas, sobremesas)
- Carrinho de compras integrado e visual
- Finalização e registro de pedidos no backend
- Chatbot inteligente (OpenAI), com fallback de respostas automáticas e personalizadas
- Dúvidas frequentes: promoções, pagamento, tempo de entrega, endereço
- Página de contato, sobre e localização com Google Maps
- Painel de administração (endpoint de pedidos)
- Experiência mobile responsiva

---

## 👨‍💻 Tecnologias Utilizadas

- **Front-end:** ReactJS, HTML, CSS
- **Back-end:** Node.js, Express, Axios, fs
- **Inteligência Artificial:** API OpenAI (ChatGPT 3.5-turbo) + simulação local
- **Persistência:** Arquivo `.json` (pedidos)
- **APIs e integrações:** OpenAI, Google Maps (embed)

---

## 🎬 Demonstração

Vídeo de apresentação:  
(em breve no YouTube!)

---

## 🖼️ Telas do Sistema

- Página inicial e destaques do dia
- Navegação por categorias do cardápio
- Carrinho e checkout visual
- Chatbot flutuante no canto direito
- Tela de contato e localização


---

## 📑 Referências

- [OpenAI API Docs](https://platform.openai.com/docs/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs)
- [Express Documentation](https://expressjs.com/pt-br/)

---

## 📋 Como executar localmente

**Pré-requisitos:**  
- Node.js instalado  
- npm ou yarn instalado

```bash
# Clone o repositório
git clone https://github.com/guilhermeandradev/lince-delivery.git

# Instale dependências do backend
cd lince-delivery/backend
npm install

# Instale dependências do frontend
cd ../frontend
npm install

# No backend, crie um arquivo .env com sua chave OpenAI:
OPENAI_API_KEY=sk-...

# Rode o backend
cd ../backend
node server.js

# Rode o frontend (em outro terminal)
cd ../frontend
npm start
