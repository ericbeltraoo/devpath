import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SECOES_LINKEDIN } from '../data/linkedin'
import { Callout } from '../components/ui'

export default function Linkedin() {
  const [aberta, setAberta] = useState(SECOES_LINKEDIN[0].id)

  return (
    <>
      <div className="page-head">
        <h1>Tutorial de LinkedIn</h1>
        <div className="sub">
          Nove secoes, na ordem de impacto. Se voce tiver 1 hora, arrume headline, Sobre e foto — nessa ordem. Sao
          os campos que decidem se o recrutador clica no seu perfil.
        </div>
      </div>

      <Callout titulo="Por que isso importa tanto para quem esta migrando">
        Sem experiencia formal em TI, o LinkedIn e o seu primeiro filtro. Recrutador tecnico busca por palavra-chave
        (Java, Spring Boot, PostgreSQL) e le a headline antes de qualquer outra coisa. Perfil incompleto simplesmente
        nao aparece na busca — nao e questao de gosto, e de indexacao.
      </Callout>

      <div className="btn-row" style={{ margin: '16px 0' }}>
        <Link className="btn primary" to="/avaliador">
          📈 Avaliar meu perfil agora
        </Link>
      </div>

      {SECOES_LINKEDIN.map((s) => {
        const aberto = aberta === s.id
        return (
          <div className="acc" key={s.id}>
            <div className="acc-head" onClick={() => setAberta(aberto ? null : s.id)}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  display: 'grid', placeItems: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--text-2)',
                }}
              >
                {s.ordem}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 640 }}>{s.titulo}</div>
                <div className="small muted">{s.porqueImporta.slice(0, 90)}...</div>
              </div>
              <span className="muted small">{aberto ? '▲' : '▼'}</span>
            </div>

            {aberto && (
              <div className="acc-body">
                <div className="callout" style={{ margin: '14px 0' }}>
                  <b>Por que importa</b>
                  {s.porqueImporta}
                </div>

                <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>Como fazer</h4>
                <ul className="lista-simples lista-ok">
                  {s.comoFazer.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>

                {s.exemplos && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ marginBottom: 6, fontSize: 13.5, color: 'var(--text-2)' }}>Exemplos</h4>
                    {s.exemplos.ruim && (
                      <div className="exemplo ruim">
                        <span className="exemplo-tag">Fraco</span>
                        {s.exemplos.ruim}
                      </div>
                    )}
                    {s.exemplos.medio && (
                      <div className="exemplo medio">
                        <span className="exemplo-tag">Mediano</span>
                        {s.exemplos.medio}
                      </div>
                    )}
                    {s.exemplos.bom && (
                      <div className="exemplo bom">
                        <span className="exemplo-tag">Bom</span>
                        {s.exemplos.bom}
                      </div>
                    )}
                  </div>
                )}

                <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>Evite</h4>
                <ul className="lista-simples lista-evite">
                  {s.evite.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
