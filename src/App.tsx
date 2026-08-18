import './App.css'

const stats = [
  { value: '256-bit', label: 'criptografia' },
  { value: 'Zero', label: 'knowledge' },
  { value: '24/7', label: 'monitoramento' },
]

const features = [
  {
    title: 'Armazenamento invisível',
    text: 'Suas credenciais ficam protegidas com criptografia local e acesso controlado por sua própria chave mestre.',
  },
  {
    title: 'Autenticação inteligente',
    text: 'Acesso rápido e seguro com verificações contínuas, autenticação forte e redução de riscos por reutilização de senhas.',
  },
  {
    title: 'Organização premium',
    text: 'Categorias, favoritos e busca instantânea para manter tudo em ordem sem perder tempo nem segurança.',
  },
]

const pillars = [
  'Criptografia local com chaves próprias',
  'Arquitetura Zero-Knowledge',
  'Design minimalista e premium',
  'Sincronização segura entre dispositivos',
]

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <img src="/keyra-logo.svg" alt="Keyra logo" className="brand-logo" />
        </div>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#seguranca">Segurança</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#sobre">Sobre</a>
        </nav>

        <button type="button" className="nav-button">
          Acessar vault
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Privacidade em primeiro lugar</span>
            <h1>
              O gerenciador de senhas <span>premium</span> feito para quem exige
              segurança absoluta.
            </h1>
            <p>
              Keyra combina criptografia de nível militar com uma experiência visual
              sofisticada, inspirada em gravismo, para proteger cada credencial sem
              comprometer o conforto do uso diário.
            </p>

            <div className="cta-row">
              <button type="button" className="primary-button">
                Começar agora
              </button>
              <button type="button" className="secondary-button">
                Ver demonstração
              </button>
            </div>

            <div className="stats-grid" aria-label="Estatísticas da plataforma">
              {stats.map((item) => (
                <div key={item.label} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="vault-panel" aria-label="Painel de demonstração do gerenciador">
            <div className="panel-header">
              <span className="dot dot-gold" />
              <span className="dot dot-silver" />
              <span className="dot dot-dark" />
            </div>

            <div className="vault-card vault-card-main">
              <div className="vault-row">
                <span>Vault pessoal</span>
                <span className="status">Seguro</span>
              </div>

              <div className="vault-list">
                <div className="vault-item active">
                  <div>
                    <small>Banco</small>
                    <strong>Banco do Brasil</strong>
                  </div>
                  <span>••••••</span>
                </div>
                <div className="vault-item">
                  <div>
                    <small>Email</small>
                    <strong>Workspace</strong>
                  </div>
                  <span>••••••</span>
                </div>
                <div className="vault-item">
                  <div>
                    <small>Cloud</small>
                    <strong>Drive Premium</strong>
                  </div>
                  <span>••••••</span>
                </div>
              </div>
            </div>

            <div className="vault-card vault-card-side">
              <div className="mini-label">Proteção</div>
              <strong>Zero-Knowledge</strong>
              <div className="shield-bar">
                <span />
              </div>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="feature-section">
          <div className="section-heading">
            <span className="eyebrow">O que torna o Keyra diferente</span>
            <h2>Proteção sem ruído, elegância sem compromissos.</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon" aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="seguranca" className="security-section">
          <div className="security-copy">
            <span className="eyebrow">Arquitetura segura</span>
            <h2>Segurança desenhada para o futuro digital.</h2>
            <p>
              Cada senha, chave e credencial ficam protegidas por mecanismos que
              reduzem a exposição e reforçam a confiança em cada acesso.
            </p>
          </div>

          <ul className="security-list">
            {pillars.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="sobre" className="cta-section">
          <div>
            <span className="eyebrow">Keyra</span>
            <h2>Seu cofre digital, com presença e inteligência.</h2>
          </div>
          <button type="button" className="primary-button">
            Explorar a plataforma
          </button>
        </section>
      </main>
    </div>
  )
}

export default App
