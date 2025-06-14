import { useState, useEffect } from 'react'
import './App.css'
import ChatBot from './ChatBot'

function App() {
  const [produtos, setProdutos] = useState({})
  const [carrinho, setCarrinho] = useState([])
  const [categoriaAtiva, setCategoriaAtiva] = useState('Pizzas')
  const [pagina, setPagina] = useState('inicio')
  const [user, setUser] = useState(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginSenha, setLoginSenha] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showCartPopover, setShowCartPopover] = useState(false)
  const [showLocate, setShowLocate] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [pedidoSucesso, setPedidoSucesso] = useState(false)
  const [search, setSearch] = useState('')

 
  useEffect(() => {
    fetch('http://localhost:4000/produtos')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setProdutos(data))
      .catch(() => alert("Erro ao carregar produtos. Tente novamente mais tarde."));
  }, []);



  useEffect(() => {
    function handleClick(e) {
      if (
        !e.target.closest('.popover-card') &&
        !e.target.closest('.icon-btn')
      ) {
        setShowSearch(false)
        setShowLogin(false)
        setShowCartPopover(false)
        setShowLocate(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0).toFixed(2)

  const adicionarCarrinho = (item) => setCarrinho([...carrinho, item])
  const removerDoCarrinho = (index) => {
    const novoCarrinho = [...carrinho]
    novoCarrinho.splice(index, 1)
    setCarrinho(novoCarrinho)
  }

  const IconSearch = () => (
    <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="3">
      <circle cx="14" cy="14" r="9" />
      <line x1="21" y1="21" x2="29" y2="29" />
    </svg>
  )
  const IconUser = () => (
    <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="3">
      <circle cx="16" cy="12" r="6" />
      <path d="M6 26c0-5.5 20-5.5 20 0" />
    </svg>
  )
  const IconCart = () => (
    <svg width="38" height="32" fill="none" stroke="#fff" strokeWidth="3">
      <rect x="8" y="10" width="18" height="10" rx="2" />
      <circle cx="14" cy="26" r="2" />
      <circle cx="24" cy="26" r="2" />
      <line x1="8" y1="10" x2="6" y2="6" />
      <line x1="26" y1="10" x2="28" y2="6" />
    </svg>
  )
  const IconLocate = () => (
    <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="3">
      <circle cx="16" cy="16" r="9" />
      <circle cx="16" cy="16" r="3" />
      <line x1="16" y1="7" x2="16" y2="25" />
      <line x1="7" y1="16" x2="25" y2="16" />
    </svg>
  )

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <h1>Lince Delivery</h1>
          <nav>
            <button onClick={() => setPagina("inicio")}>Início</button>
            <button onClick={() => setPagina("cardapio")}>Cardápio</button>
            <button onClick={() => setPagina("sobre")}>Sobre Nós</button>
            <button onClick={() => setPagina("localizacao")}>Localização</button>
            <button onClick={() => setPagina("contato")}>Contato</button>
          </nav>
          <div className="header-icons">
            {/* Pesquisa */}
            <div className="icon-wrapper">
              <button
                className="icon-btn"
                title="Pesquisar"
                aria-label="Pesquisar produto"
                onClick={() => {
                  setShowSearch(!showSearch)
                  setShowLogin(false)
                  setShowCartPopover(false)
                  setShowLocate(false)
                }}>
                <IconSearch />
              </button>
              {showSearch && (
                <div className="popover-card" tabIndex={0}>
                  <h3 style={{ margin: "0 0 0.7rem 0" }}>Pesquisar Produto</h3>
                  <input
                    type="text"
                    placeholder="Digite o nome do produto..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                    style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 12 }}
                  />
                  <ul>
                    {Object.keys(produtos).flatMap(categoria =>
                      (produtos[categoria] || [])
                        .filter(prod => prod.nome.toLowerCase().includes(search.toLowerCase()))
                        .map(prod => (
                          <li key={prod.nome} style={{ cursor: 'pointer' }}
                            onClick={() => adicionarCarrinho(prod)}>
                            {prod.nome} - R$ {prod.preco.toFixed(2)} <small>({categoria})</small>
                          </li>
                        ))
                    )}
                  </ul>
                  <button className="close-btn" onClick={() => setShowSearch(false)}>Fechar</button>
                </div>
              )}
            </div>

            {/* Localizar */}
            <div className="icon-wrapper">
              <button
                className="icon-btn"
                title="Localizar Produtos"
                aria-label="Localizar Produtos"
                onClick={() => {
                  setShowLocate(!showLocate)
                  setShowSearch(false)
                  setShowLogin(false)
                  setShowCartPopover(false)
                }}>
                <IconLocate />
              </button>
              {showLocate && (
                <div className="popover-card" tabIndex={0}>
                  <h3 style={{ margin: "0 0 0.7rem 0" }}>Todos os Produtos</h3>
                  {Object.keys(produtos).map(cat => (
                    <div key={cat}>
                      <h4 style={{ margin: "0.7em 0 0.2em", color: "#d30000" }}>{cat}</h4>
                      <ul>
                        {(produtos[cat] || []).map(prod => (
                          <li key={prod.nome} style={{ cursor: 'pointer' }}
                            onClick={() => adicionarCarrinho(prod)}>
                            {prod.nome} - R$ {prod.preco.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button className="close-btn" onClick={() => setShowLocate(false)}>Fechar</button>
                </div>
              )}
            </div>

            {/* Usuário */}
            <div className="icon-wrapper">
              <button className="icon-btn" title="Usuário"
                onClick={() => {
                  setShowLogin(!showLogin)
                  setShowSearch(false)
                  setShowCartPopover(false)
                  setShowLocate(false)
                }}>
                <IconUser />
              </button>
              {showLogin && (
                <div className="popover-card" tabIndex={0}>
                  <h3 style={{ margin: "0 0 0.7rem 0" }}>{user ? "Minha Conta" : "Entrar"}</h3>
                  {!user ? (
                    <>
                      <input
                        type="email"
                        placeholder="Seu e-mail"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 8 }}
                      />
                      <input
                        type="password"
                        placeholder="Sua senha"
                        value={loginSenha}
                        onChange={e => setLoginSenha(e.target.value)}
                        style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 12 }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => {
                          if (loginEmail.trim() && loginSenha.trim()) {
                            setUser({ email: loginEmail });
                            setShowLogin(false);
                          } else {
                            alert("Preencha e-mail e senha corretamente.");
                          }
                        }}>

                          Entrar
                        </button>
                        <button className="close-btn" onClick={() => setShowLogin(false)}>Fechar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>Bem-vindo, {user.email}!</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setUser(null)}>Sair</button>
                        <button className="close-btn" onClick={() => setShowLogin(false)}>Fechar</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Carrinho */}
            <div className="icon-wrapper">
              <button className="icon-btn" title="Carrinho"
                onClick={() => {
                  setShowCartPopover(!showCartPopover)
                  setShowSearch(false)
                  setShowLogin(false)
                  setShowLocate(false)
                }}>
                <IconCart />
                <span className="cart-badge">{carrinho.length}</span>
              </button>
              {showCartPopover && (
                <div className="popover-card" tabIndex={0}>
                  <h3 style={{ margin: "0 0 0.7rem 0" }}>Carrinho</h3>
                  <ul>
                    {carrinho.length === 0 && <li>Seu carrinho está vazio.</li>}
                    {carrinho.map((item, i) => (
                      <li key={i}>
                        {item.nome} - R$ {item.preco.toFixed(2)}
                        <button onClick={() => removerDoCarrinho(i)} className="remover-btn" style={{ marginLeft: 4 }}>🗑</button>
                      </li>
                    ))}
                  </ul>
                  <p><strong>Total:</strong> R$ {total}</p>
                  {carrinho.length > 0 && (
                    <button className="checkout-btn" onClick={() => {
                      setShowCartPopover(false)
                      setPagina("checkout")
                    }}>
                      Prosseguir com a compra
                    </button>
                  )}
                  <button className="close-btn" style={{ marginTop: 8 }} onClick={() => setShowCartPopover(false)}>Fechar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {pagina === "inicio" && (
          <section className="inicio">
            <h2>Bem-vindo ao Lince Delivery!</h2>
            <p>Sabores irresistíveis entregues até você com rapidez e carinho. Peça sua pizza, hambúrguer, temaki ou sobremesa agora mesmo!</p>
            <img src="/img/gourmet.jpg" alt="Destaque" className="banner-img" />
          </section>
        )}

        {pagina === "cardapio" && (
          <div className="main-content">
            <article>
              <section>
                <h2>{categoriaAtiva}</h2>
                <div className="grid">
                  {(produtos[categoriaAtiva] || []).map((produto, i) => (
                    <div className="card" key={i}>
                      <img src={`/img/${produto.img}`} alt={produto.nome} />
                      <h3>{produto.nome}</h3>
                      <p>Preço: R$ {produto.preco.toFixed(2)}</p>
                      <button onClick={() => adicionarCarrinho(produto)}>Adicionar</button>
                    </div>
                  ))}
                </div>
              </section>
            </article>
            <aside>
              <h2>Categorias</h2>
              <ul>
                {Object.keys(produtos).map((categoria) => (
                  <li key={categoria}>
                    <button className="link-categoria" onClick={() => setCategoriaAtiva(categoria)}>
                      {categoria}
                    </button>
                  </li>
                ))}
              </ul>
              <section id="carrinho">
                <h2>Carrinho</h2>
                <ul>
                  {carrinho.map((item, i) => (
                    <li key={i}>
                      {item.nome} - R$ {item.preco.toFixed(2)}
                      <button onClick={() => removerDoCarrinho(i)} className="remover-btn">🗑</button>
                    </li>
                  ))}
                </ul>
                <p><strong>Total:</strong> R$ {total}</p>
                {carrinho.length > 0 && (
                  <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                    Prosseguir com a compra
                  </button>
                )}
              </section>
            </aside>
            <div className="extra-panel">
              <h2>Destaques do Dia</h2>
              <div className="highlight">
                <img src="/img/gourmet.jpg" alt="Destaque" />
                <p><strong>Pizza Gourmet</strong><br />Hoje por apenas R$ 24,90!</p>
              </div>
            </div>
          </div>
        )}

        {pagina === "sobre" && (
          <section className="sobre">
            <h2>Sobre Nós</h2>
            <p>O Lince Delivery nasceu para levar praticidade e sabor até você. Somos apaixonados por comida e tecnologia, e queremos transformar seu pedido em uma experiência especial!</p>
          </section>
        )}

        {pagina === "localizacao" && (
          <section className="localizacao">
            <h2>Nossa Localização</h2>
            <p>
              Estamos em São Paulo, Rua Iguatemi, 192 - Itaim Bibi. Venha nos conhecer ou faça seu pedido online!
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.8282119682023!2d-46.67446618496381!3d-23.579381968507687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce575cd3f271f3%3A0x801c8418e3c75c12!2sR.%20Iguatemi%2C%20192%20-%20Itaim%20Bibi%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001451-001!5e0!3m2!1spt-BR!2sbr!4v1718026664531!5m2!1spt-BR!2sbr"
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: "12px", marginTop: "1.5rem" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Lince Delivery"
            ></iframe>
          </section>
        )}

        {pagina === "checkout" && (
          <section className="checkout-page">
            <h2>Finalizar Pedido</h2>
            <ul>
              {carrinho.map((item, i) => (
                <li key={i}>
                  {item.nome}
                  <span style={{ float: "right", color: "var(--cor-primaria)" }}>
                    R$ {item.preco.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <p><strong>Total: R$ {total}</strong></p>

            <div className="checkout-btns">
              <button
                onClick={() => {
                  fetch('http://localhost:4000/pedido', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      carrinho,
                      total,
                      usuario: user
                    })
                  })
                    .then(res => {
                      if (!res.ok) throw new Error();
                      return res.json();
                    })
                    .then(data => {
                      setCarrinho([]);
                      setPagina("inicio");
                      setPedidoSucesso(true);
                      setTimeout(() => setPedidoSucesso(false), 2500);
                    })
                    .catch(() => alert("Erro ao enviar pedido. Tente novamente."));
                }}
              >
                Confirmar Pedido
              </button>
              <button
                className="cancel"
                onClick={() => setPagina("cardapio")}
              >
                Cancelar
              </button>
            </div>
          </section>
        )}

      </main>

      {/* Modal de checkout */}
      {showCheckout && (
        <div className="modal-bg" onClick={() => setShowCheckout(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Finalizar Pedido</h2>
            <ul>
              {carrinho.map((item, i) => (
                <li key={i}>{item.nome} <span style={{ float: "right", color: "#d30000" }}>R$ {item.preco.toFixed(2)}</span></li>
              ))}
            </ul>
            <p><strong>Total: R$ {total}</strong></p>
            <div className="modal-btns">
              <button
                onClick={() => {
                  fetch('http://localhost:4000/pedido', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      carrinho,
                      total,
                      usuario: user
                    })
                  })
                    .then(res => {
                      if (!res.ok) throw new Error();
                      return res.json();
                    })
                    .then(data => {
                      setCarrinho([]);
                      setShowCheckout(false);
                      setPedidoSucesso(true);
                      setTimeout(() => setPedidoSucesso(false), 2500);
                    })
                    .catch(() => alert("Erro ao enviar pedido. Tente novamente."));

                }}
              >Confirmar Pedido</button>
              <button
                className="cancel"
                onClick={() => setShowCheckout(false)}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Card de sucesso */}
      {pedidoSucesso && (
        <div className="modal-bg">
          <div className="modal success-modal" style={{ alignItems: "center", justifyContent: "center" }}>
            <div className="success-check">
              <svg width="65" height="65" viewBox="0 0 65 65">
                <circle className="circle" cx="32.5" cy="32.5" r="30" fill="none" stroke="#4BB543" strokeWidth="4" />
                <polyline className="check" fill="none" stroke="#4BB543" strokeWidth="5.5"
                  points="18,35 29,48 49,24" />
              </svg>
            </div>
            <h2>Pedido enviado!</h2>
            <p>Obrigado pela preferência 😃</p>
          </div>
        </div>
      )}
<ChatBot />

      <footer>
        <p>&copy; 2025 Lince Delivery - Todos os direitos reservados</p>
      </footer>
    </div>
  )
}

export default App
