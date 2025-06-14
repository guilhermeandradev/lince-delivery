const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const pedidosPath = path.join(__dirname, 'pedidos.json');

// ------------------ IA Chat (OpenAI GPT) ------------------
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const resposta = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
Você é um atendente virtual do Lince Delivery, uma lanchonete moderna em São Paulo.
- Sempre cumprimente com simpatia e use linguagem informal.
- Responda sempre em português brasileiro.
- Responda dúvidas sobre cardápio, sugestões, promoções, horário, formas de pagamento, tempo de entrega, endereço, contato, área de entrega, pedidos já feitos, e como pedir.
- Se perguntarem sobre pedidos já feitos, explique que este canal não consulta status (mas que pode ajudar no processo).
- Se perguntarem sobre "cancelamento" ou "problema", oriente o cliente a entrar em contato pelo WhatsApp da loja.
- Sugira o cardápio, fale sobre pizzas, hambúrgueres, temakis, bebidas e sobremesas, conforme o menu.
- Dê respostas breves e sempre ofereça ajuda para finalizar um pedido.
- Se não souber, peça para o cliente explicar melhor ou oriente a entrar em contato pelo WhatsApp oficial.
`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }

      }
    );
    const respostaIa = resposta.data.choices[0].message.content;
    res.json({ reply: respostaIa });
  } catch (err) {
    console.error('Erro IA:', err.response?.data || err.message);
    res.status(500).json({ reply: "Desculpe, não consegui responder agora." });
  }
});

// ------------------ Mock de produtos ------------------
const produtos = {
  Pizzas: [
    { nome: 'Mussarela', preco: 21.99, img: 'mussarela.jpg' },
    { nome: 'Calabresa', preco: 24.00, img: 'calabresa.jpg' },
    { nome: 'Gourmet', preco: 29.90, img: 'gourmet.jpg' }
  ],
  'Hambúrguer': [
    { nome: 'Cheeseburger', preco: 18.50, img: 'cheeseburger.jpg' },
    { nome: 'Duplo Bacon', preco: 25.00, img: 'duplo-bacon.jpg' }
  ],
  Temaki: [
    { nome: 'Temaki Salmão', preco: 22.00, img: 'temaki-salmao.jpg' },
    { nome: 'Temaki Camarão', preco: 24.00, img: 'temaki-camarao.jpg' }
  ],
  Sobremesas: [
    { nome: 'Petit Gateau', preco: 14.90, img: 'petit-gateau.jpg' },
    { nome: 'Brownie', preco: 12.00, img: 'brownie.jpg' }
  ],
  Bebidas: [
    { nome: 'Refrigerante Lata', preco: 6.00, img: 'refrigerante.jpg' },
    { nome: 'Suco Natural', preco: 8.00, img: 'suco.jpg' }
  ]
};

// ------------------ Pedidos ------------------
let pedidos = [];
try {
  if (fs.existsSync(pedidosPath)) {
    pedidos = JSON.parse(fs.readFileSync(pedidosPath));
  }
} catch (err) {
  pedidos = [];
}

// GET produtos
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// POST pedido
app.post('/pedido', (req, res) => {
  const pedido = { ...req.body, data: new Date().toISOString() };
  if (!pedido.carrinho || pedido.carrinho.length === 0 || !pedido.total) {
    return res.status(400).json({ ok: false, msg: "Pedido inválido" });
  }
  pedidos.push(pedido);
  try {
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
    console.log('Pedido salvo com sucesso:', pedido);
    res.status(201).json({ ok: true, pedido });
  } catch (err) {
    console.error("Erro ao salvar pedido:", err);
    res.status(500).json({ ok: false, msg: "Erro ao salvar pedido" });
  }
});

// GET pedidos (admin/teste)
app.get('/pedidos', (req, res) => {
  res.json(pedidos);
});

// ------------------ Inicialização do servidor ------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
