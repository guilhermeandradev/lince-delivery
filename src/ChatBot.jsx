const respostasSimuladas = [
  { regex: /piada|brinca/i, resp: "Por que a pizza não gosta de dividir? Porque ela sempre quer tudo para si! 🍕😄" },
  { regex: /card[aá]pio|menu|pratos|produtos/i, resp: "Temos pizzas, hambúrgueres, temakis, bebidas geladinhas e sobremesas deliciosas! 😋 Qual categoria você quer ver?" },
  { regex: /entrega|tempo|chega|delivery/i, resp: "Nosso tempo médio de entrega é de 40 minutos na região do Itaim Bibi. 🚀" },
  { regex: /pagamento|pagar|pix|cart[aã]o|dinheiro/i, resp: "Aceitamos cartões, Pix e dinheiro. Como prefere pagar? 💳📱" },
  { regex: /endere[cç]o|localiza[cç][aã]o|onde/i, resp: "Estamos na Rua Iguatemi, 192, Itaim Bibi, São Paulo. Venha nos visitar! 📍" },
  { regex: /promo[cç][aã]o|desconto|cupom/i, resp: "Hoje temos 10% de desconto em pedidos acima de R$50 usando o cupom LINCE10! 🎁" },
  { regex: /whatsapp|zap|atendente/i, resp: "Pode falar conosco também pelo WhatsApp: (11) 99999-0000! 😃" },
  { regex: /obrigad[o|a]|valeu|show/i, resp: "Que bom ajudar! Qualquer dúvida, é só chamar. 🦊" },
  { regex: /ol[aá]|oi|boa noite|bom dia|boa tarde/i, resp: "Oi, tudo bem? Como posso ajudar hoje? 👋" },
  { regex: /quero|gostaria|pedir/i, resp: "Ótimo! Me diga o que deseja pedir ou clique em 'Ver cardápio'." },
  { regex: /surpresa|novidade/i, resp: "Hoje só para você: pizza brotinho grátis nos pedidos acima de R$80! 🎉🍕" },
  { regex: /.*/, resp: "Desculpe, não entendi. Você pode perguntar pelo cardápio, formas de pagamento, tempo de entrega, endereço, promoções ou até pedir uma piada!" }
];

import { useState, useRef, useEffect } from 'react'
import './ChatBot.css'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [mensagens, setMensagens] = useState([
    {
      texto: "Olá! Eu sou a Lince Bot. Como posso ajudar?\nEscolha uma opção abaixo, peça uma sugestão ou até uma piada!",
      bot: true
    }
  ])
  const [input, setInput] = useState('')
  const [esperando, setEsperando] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, open])

  async function enviar(e) {
    e.preventDefault()
    if (!input.trim()) return
    await enviarOp(input)
    setInput('')
  }

  async function enviarOp(msg) {
    setMensagens(msgs => [...msgs, { texto: msg, bot: false }])
    setEsperando(true)
    try {
      const resp = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await resp.json()
      if (data.reply && !/Desculpe, não consegui responder agora/i.test(data.reply)) {
        setMensagens(msgs => [...msgs, { texto: data.reply, bot: true }])
      } else {
        simulaResposta(msg)
      }
    } catch {
      simulaResposta(msg)
    }
    setEsperando(false)
  }

  function simulaResposta(msg) {
    const resposta = respostasSimuladas.find(r => r.regex.test(msg))?.resp
      || "Desculpe, não entendi. Pode perguntar pelo cardápio, pagamento ou promoções! 😊"
    setMensagens(msgs => [...msgs, { texto: resposta, bot: true }])
  }

  const sugestoes = [
    "Ver cardápio",
    "Tempo de entrega",
    "Formas de pagamento",
    "Endereço da loja",
    "Promoções",
    "Contato WhatsApp",
    "Me conta uma piada!",
    "Tem alguma surpresa hoje?"
  ]

  return (
    <div className={`chatbot-box${open ? " open" : ""}`}>
      {!open && (
        <button type="button" className="chatbot-toggle" onClick={() => setOpen(true)}>
          <span role="img" aria-label="Chat">💬</span>
        </button>
      )}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Lince Bot</span>
            <button type="button" className="chatbot-close" onClick={() => setOpen(false)} title="Fechar">×</button>
          </div>
          <div className="chatbot-messages">
            {mensagens.map((m, i) => (
              <div key={i} className={m.bot ? "msg bot" : "msg user"}>
                {m.texto}
              </div>
            ))}
            {esperando && (
              <div className="msg bot">...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Sugestões só na primeira mensagem */}
          {mensagens.length === 1 && (
            <div className="chatbot-sugestoes">
              {sugestoes.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => enviarOp(s)}
                  className="sugestao-btn"
                  disabled={esperando}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form className="chatbot-form" onSubmit={enviar}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              autoFocus={open}
              disabled={esperando}
            />
            <button type="submit" disabled={esperando || !input.trim()}>Enviar</button>
          </form>
        </div>
      )}
    </div>
  )
}
