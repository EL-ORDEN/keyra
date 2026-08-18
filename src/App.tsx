import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type VaultEntry = {
  id: number
  name: string
  category: 'Financeiro' | 'Trabalho' | 'Pessoal' | 'Social'
  username: string
  password: string
  url: string
  strength: 'Forte' | 'Muito forte' | 'Excelente'
}

type EntryForm = {
  name: string
  category: VaultEntry['category']
  username: string
  password: string
  url: string
}

const STORAGE_KEY = 'keyra-vault'
const MASTER_KEY = 'keyra-master'
const DEFAULT_ENTRIES: VaultEntry[] = [
  {
    id: 1,
    name: 'Banco do Brasil',
    category: 'Financeiro',
    username: 'renan.dev',
    password: 'K3yra!Bank#2026',
    url: 'bank.com.br',
    strength: 'Excelente',
  },
  {
    id: 2,
    name: 'GitHub',
    category: 'Trabalho',
    username: 'renan@keyra.dev',
    password: 'GitHub!Secure#Keyra',
    url: 'github.com',
    strength: 'Muito forte',
  },
  {
    id: 3,
    name: 'Netflix',
    category: 'Pessoal',
    username: 'renan.oliveira',
    password: 'N3tflix!Stream#96',
    url: 'netflix.com',
    strength: 'Forte',
  },
]

const categories = ['Todos', 'Financeiro', 'Trabalho', 'Pessoal', 'Social'] as const
const navItems = ['Visão geral', 'Vault', 'Gerador', 'Segurança', 'Configurações']

const onboardingSteps = [
  {
    title: 'Crie uma senha forte',
    description: 'Use o gerador para produzir uma combinação segura e única para cada conta.',
    action: 'Gerar senha',
  },
  {
    title: 'Organize sua vault',
    description: 'Salve contas por categoria e mantenha o acesso centralizado em um lugar só.',
    action: 'Adicionar item',
  },
  {
    title: 'Revise a segurança',
    description: 'Confirme o nível de proteção e mantenha sua rotina de senhas ativa.',
    action: 'Verificar',
  },
] as const

const recentActivity = [
  { title: 'Sessão verificada com sucesso', time: 'há 2 min', type: 'success' },
  { title: 'Senha do GitHub regenerada', time: 'há 1h', type: 'warning' },
  { title: 'Novo item adicionado na categoria Financeiro', time: 'há 2h', type: 'info' },
] as const

function getPasswordStrength(password: string): VaultEntry['strength'] {
  if (password.length >= 16 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    return 'Excelente'
  }

  if (password.length >= 12 && /[A-Z]/.test(password)) {
    return 'Muito forte'
  }

  return 'Forte'
}

function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
  let password = ''

  for (let index = 0; index < 18; index += 1) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }

  return password
}

function App() {
  const [vault, setVault] = useState<VaultEntry[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_ENTRIES

    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_ENTRIES
  })
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('Todos')
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({})
  const [showComposer, setShowComposer] = useState(false)
  const [authError, setAuthError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isCopying, setIsCopying] = useState(false)
  const [securitySettings, setSecuritySettings] = useState({
    autoLock: true,
    breachAlerts: true,
    clipboardClean: false,
    localOnly: true,
  })
  const [hasMaster, setHasMaster] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return Boolean(window.localStorage.getItem(MASTER_KEY))
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newMaster, setNewMaster] = useState('')
  const [confirmMaster, setConfirmMaster] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [form, setForm] = useState<EntryForm>({
    name: '',
    category: 'Financeiro',
    username: '',
    password: '',
    url: '',
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vault))
  }, [vault])

  const summaryCards = useMemo(
    () => [
      { label: 'Senhas salvas', value: String(vault.length), accent: 'gold' },
      { label: 'Alertas', value: '03', accent: 'rose' },
      { label: 'Criptografia', value: 'AES-256', accent: 'blue' },
    ],
    [vault.length],
  )

  const filteredEntries = useMemo(() => {
    return vault.filter((entry) => {
      const matchesCategory =
        selectedCategory === 'Todos' || entry.category === selectedCategory

      const searchTerm = search.trim().toLowerCase()
      const matchesSearch =
        searchTerm.length === 0 ||
        entry.name.toLowerCase().includes(searchTerm) ||
        entry.username.toLowerCase().includes(searchTerm) ||
        entry.url.toLowerCase().includes(searchTerm)

      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory, vault])

  const handleSetup = (event: FormEvent) => {
    event.preventDefault()

    if (newMaster.length < 8) {
      setAuthError('A senha mestre precisa ter pelo menos 8 caracteres.')
      return
    }

    if (newMaster !== confirmMaster) {
      setAuthError('As senhas mestre não conferem.')
      return
    }

    window.localStorage.setItem(MASTER_KEY, newMaster)
    setHasMaster(true)
    setIsAuthenticated(true)
    setAuthError('')
    setNewMaster('')
    setConfirmMaster('')
  }

  const handleLogin = (event: FormEvent) => {
    event.preventDefault()

    const storedMaster = window.localStorage.getItem(MASTER_KEY) || ''
    if (storedMaster === loginPassword) {
      setIsAuthenticated(true)
      setAuthError('')
      setLoginPassword('')
      return
    }

    setAuthError('Senha mestre incorreta.')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setLoginPassword('')
    setStatusMessage('Sessão encerrada com sucesso.')
  }

  const togglePassword = (id: number) => {
    setVisiblePasswords((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  const handleGeneratePassword = () => {
    const generated = generatePassword()
    setForm((current) => ({ ...current, password: generated }))
    setStatusMessage('Senha gerada com sucesso.')
  }

  const handleCopyPassword = async (value: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setStatusMessage('Copiar não está disponível neste ambiente.')
      return
    }

    setIsCopying(true)

    try {
      await navigator.clipboard.writeText(value)
      setStatusMessage('Senha copiada para a área de transferência.')
    } catch {
      setStatusMessage('Não foi possível copiar a senha neste momento.')
    } finally {
      setIsCopying(false)
    }
  }

  const handleAddEntry = (event: FormEvent) => {
    event.preventDefault()

    if (!form.name || !form.username || !form.password || !form.url) {
      setStatusMessage('Preencha todos os campos antes de salvar.')
      return
    }

    const nextEntry: VaultEntry = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      username: form.username,
      password: form.password,
      url: form.url,
      strength: getPasswordStrength(form.password),
    }

    setVault((current) => [nextEntry, ...current])
    setForm({ name: '', category: 'Financeiro', username: '', password: '', url: '' })
    setShowComposer(false)
    setStatusMessage('Credencial salva com segurança.')
  }

  const handleRemoveEntry = (id: number) => {
    setVault((current) => current.filter((entry) => entry.id !== id))
    setStatusMessage('Credencial removida da vault.')
  }

  const handleSecurityToggle = (key: keyof typeof securitySettings) => {
    setSecuritySettings((current) => ({
      ...current,
      [key]: !current[key],
    }))
    setStatusMessage('Configuração de segurança atualizada.')
  }

  if (!hasMaster) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <img src="/keyra-logo.svg" alt="Keyra" className="auth-logo" />
          <h1>Crie sua chave mestre</h1>
          <p>Defina uma senha principal para proteger sua vault.</p>

          <form onSubmit={handleSetup} className="auth-form">
            <label>
              <span>Senha mestre</span>
              <input
                type="password"
                value={newMaster}
                onChange={(event) => setNewMaster(event.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </label>

            <label>
              <span>Confirmar senha</span>
              <input
                type="password"
                value={confirmMaster}
                onChange={(event) => setConfirmMaster(event.target.value)}
                placeholder="Repita sua senha"
              />
            </label>

            {authError ? <div className="auth-error">{authError}</div> : null}

            <button type="submit" className="primary-button wide">
              Criar vault
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <img src="/keyra-logo.svg" alt="Keyra" className="auth-logo" />
          <h1>Bem-vindo de volta</h1>
          <p>Insira sua chave mestre para acessar sua vault.</p>

          <form onSubmit={handleLogin} className="auth-form">
            <label>
              <span>Senha mestre</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Digite sua senha"
              />
            </label>

            {authError ? <div className="auth-error">{authError}</div> : null}

            <button type="submit" className="primary-button wide">
              Entrar na vault
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/keyra-logo.svg" alt="Keyra logo" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav" aria-label="Menu principal">
          {navItems.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`nav-item ${index === 1 ? 'active' : ''}`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="security-card">
          <span className="mini-label">Proteção</span>
          <strong>Vault segura</strong>
          <div className="mini-meter">
            <span />
          </div>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              type="search"
              placeholder="Buscar senhas, sites ou usuários"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="topbar-actions">
            <button type="button" className="action-button ghost" onClick={handleGeneratePassword}>
              Gerar senha
            </button>
            <button type="button" className="action-button primary" onClick={() => setShowComposer(true)}>
              + Novo item
            </button>
            <div className="profile-pill">
              <span className="profile-avatar">R</span>
              <span>Renan</span>
            </div>
          </div>
        </header>

        {statusMessage ? <div className="status-banner">{statusMessage}</div> : null}

        <section className="summary-grid">
          {summaryCards.map((card) => (
            <article key={card.label} className={`summary-card ${card.accent}`}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </section>

        <section className="onboarding-card">
          <div className="onboarding-header">
            <div>
              <span className="eyebrow dark">Onboarding</span>
              <h2>Primeiros passos da sua vault</h2>
            </div>
          </div>

          <div className="checklist">
            {onboardingSteps.map((step) => (
              <div key={step.title} className="check-item">
                <div className="check-icon">✓</div>
                <div className="check-copy">
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
                <button
                  type="button"
                  className="mini-button compact"
                  onClick={() => {
                    if (step.action === 'Gerar senha') {
                      handleGeneratePassword()
                      return
                    }

                    if (step.action === 'Adicionar item') {
                      setShowComposer(true)
                      return
                    }

                    setStatusMessage('Sua segurança está em bom estado. Continue monitorando as credenciais.')
                  }}
                >
                  {step.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="security-panel">
          <div className="panel-header-row compact">
            <div>
              <span className="eyebrow dark">Segurança</span>
              <h2>Centro de proteção</h2>
            </div>
          </div>

          <div className="security-grid">
            {[
              {
                key: 'autoLock',
                label: 'Bloqueio automático',
                description: 'Trava a sessão após inatividade.',
              },
              {
                key: 'breachAlerts',
                label: 'Alertas de vazamento',
                description: 'Monitora exposições de contas sensíveis.',
              },
              {
                key: 'clipboardClean',
                label: 'Limpeza da área de transferência',
                description: 'Remove o dado copiado após uso.',
              },
              {
                key: 'localOnly',
                label: 'Armazenamento local',
                description: 'Mantém os dados isolados no dispositivo.',
              },
            ].map((setting) => (
              <button
                key={setting.key}
                type="button"
                className="setting-row"
                onClick={() => handleSecurityToggle(setting.key as keyof typeof securitySettings)}
              >
                <div className="setting-copy">
                  <strong>{setting.label}</strong>
                  <span>{setting.description}</span>
                </div>

                <span className={securitySettings[setting.key as keyof typeof securitySettings] ? 'toggle-switch on' : 'toggle-switch'}>
                  <span className="toggle-knob" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="activity-panel">
          <div className="panel-header-row compact">
            <div>
              <span className="eyebrow dark">Atividade</span>
              <h2>Resumo do dispositivo</h2>
            </div>
          </div>

          <div className="activity-grid">
            <div className="activity-card">
              <h3>Atividade recente</h3>
              <ul className="activity-list">
                {recentActivity.map((item) => (
                  <li key={item.title} className={item.type}>
                    <span className="dot" />
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.time}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="activity-card">
              <h3>Estado do aparelho</h3>
              <div className="device-metrics">
                <div>
                  <span>Último login</span>
                  <strong>Hoje · 08:41</strong>
                </div>
                <div>
                  <span>Sincronização</span>
                  <strong>Protegida</strong>
                </div>
                <div>
                  <span>Biometria</span>
                  <strong>Disponível</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vault-panel">
          <div className="panel-header-row">
            <div>
              <span className="eyebrow dark">Vault</span>
              <h2>Credenciais protegidas</h2>
            </div>

            <div className="category-filter" aria-label="Filtrar por categoria">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={selectedCategory === category ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {showComposer ? (
            <form className="composer" onSubmit={handleAddEntry}>
              <div className="composer-grid">
                <label>
                  <span>Nome</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Ex: Google"
                  />
                </label>

                <label>
                  <span>Categoria</span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        category: event.target.value as VaultEntry['category'],
                      }))
                    }
                  >
                    <option value="Financeiro">Financeiro</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Social">Social</option>
                  </select>
                </label>

                <label>
                  <span>Usuário</span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, username: event.target.value }))
                    }
                    placeholder="usuario@email.com"
                  />
                </label>

                <label>
                  <span>URL</span>
                  <input
                    type="text"
                    value={form.url}
                    onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                    placeholder="exemplo.com"
                  />
                </label>

                <label className="password-field">
                  <span>Senha</span>
                  <div className="password-input-wrap">
                    <input
                      type="text"
                      value={form.password}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, password: event.target.value }))
                      }
                      placeholder="Senha segura"
                    />
                    <button type="button" className="mini-button" onClick={handleGeneratePassword}>
                      Gerar
                    </button>
                  </div>
                </label>
              </div>

              <div className="composer-actions">
                <button type="button" className="row-button muted" onClick={() => setShowComposer(false)}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  Salvar credencial
                </button>
              </div>
            </form>
          ) : null}

          <div className="entry-list">
            {filteredEntries.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhuma credencial encontrada</h3>
                <p>Adicione uma nova entrada para começar a proteger seus acessos.</p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isVisible = !!visiblePasswords[entry.id]

                return (
                  <article key={entry.id} className="entry-card">
                    <div className="entry-main">
                      <div className="entry-brand">{entry.name.slice(0, 2).toUpperCase()}</div>
                      <div className="entry-meta">
                        <div className="entry-title-row">
                          <h3>{entry.name}</h3>
                          <span className="entry-tag">{entry.category}</span>
                        </div>
                        <p>{entry.url}</p>
                      </div>
                    </div>

                    <div className="entry-details">
                      <div>
                        <span className="meta-label">Usuário</span>
                        <strong>{entry.username}</strong>
                      </div>
                      <div>
                        <span className="meta-label">Senha</span>
                        <strong>{isVisible ? entry.password : '••••••••••••'}</strong>
                      </div>
                      <div>
                        <span className="meta-label">Força</span>
                        <strong className="strength">{entry.strength}</strong>
                      </div>
                    </div>

                    <div className="entry-actions">
                      <button type="button" className="row-button" onClick={() => togglePassword(entry.id)}>
                        {isVisible ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button
                        type="button"
                        className="row-button muted"
                        onClick={() => handleCopyPassword(entry.password)}
                        disabled={isCopying}
                      >
                        {isCopying ? 'Copiando...' : 'Copiar'}
                      </button>
                      <button type="button" className="row-button muted" onClick={() => handleRemoveEntry(entry.id)}>
                        Excluir
                      </button>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
