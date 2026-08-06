export function Bar({ pct, cor, thin }) {
  return (
    <div className={`bar${thin ? ' thin' : ''}`}>
      <i style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: cor || undefined }} />
    </div>
  )
}

export function Ring({ pct, size = 118, stroke = 10, cor = 'var(--accent)', label, sub }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (Math.min(100, Math.max(0, pct)) / 100) * c
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg className="ring" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={cor}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .5s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeContent: 'center',
          textAlign: 'center',
          lineHeight: 1.15,
        }}
      >
        <div style={{ fontSize: size / 4.2, fontWeight: 700, letterSpacing: '-0.02em' }}>{label ?? `${pct}%`}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</div>}
      </div>
    </div>
  )
}

export function Stat({ label, value, hint, cor }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: cor }}>
        {value}
      </div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  )
}

export function Empty({ icone = '🔍', titulo, texto }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icone}</div>
      <div style={{ fontWeight: 600, color: 'var(--text-2)' }}>{titulo}</div>
      {texto && <div className="small" style={{ marginTop: 4 }}>{texto}</div>}
    </div>
  )
}

/** Etiqueta "Secao X do curso do Nelio Alves". Nao renderiza nada se o modulo nao mapeia. */
export function ChipCurso({ curso, compacto }) {
  if (!curso) return null
  return (
    <span
      className="chip"
      style={{ borderColor: 'rgba(232,111,0,.3)', color: '#f0a562', background: 'rgba(232,111,0,.08)' }}
      title={curso.nome ? `Curso do Nelio Alves — Secao ${curso.secao}: ${curso.nome}` : undefined}
    >
      🎓 Seç. {curso.secao}
      {!compacto && curso.nome ? ` · ${curso.nome}` : ''}
    </span>
  )
}

export function Callout({ tipo, titulo, children }) {
  return (
    <div className={`callout${tipo ? ' ' + tipo : ''}`}>
      {titulo && <b>{titulo}</b>}
      {children}
    </div>
  )
}
