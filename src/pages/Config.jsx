import { useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { OBJETIVOS } from '../lib/planner'
import { exportar, importar } from '../lib/storage'
import { SECOES_NELIO, getSecao } from '../data/cursoNelio'
import { planejarSincronizacao } from '../lib/sincronizarCurso'
import { Callout, Bar } from '../components/ui'

function Conta() {
  const { nuvemAtiva, usuario, sincronia, erroSync, ultimoSync, sincronizarAgora, baixarDaNuvem, sair } = useApp()

  if (!nuvemAtiva) {
    return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 4 }}>Conta</div>
        <div className="card-sub" style={{ marginBottom: 14 }}>
          O app esta rodando em <b>modo local</b>: o progresso fica apenas neste navegador e nao sincroniza entre
          computadores.
        </div>
        <Callout tipo="warn" titulo="Como ativar a sincronizacao">
          Defina <span className="mono">VITE_API_URL</span> no arquivo <span className="mono">.env</span> apontando para a
          API (ex.: <span className="mono">https://devpath.lastweek.com.br</span>) e reinicie o servidor. O passo a
          passo do deploy esta no README.
        </Callout>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 4 }}>Conta</div>
      <div className="card-sub" style={{ marginBottom: 14 }}>
        Conectado como <b>{usuario?.email}</b>. Seu progresso sobe automaticamente a cada alteracao.
      </div>

      <div className="row" style={{ gap: 8, marginBottom: 14 }}>
        <span className={`chip ${sincronia === 'erro' ? 'danger' : sincronia === 'ok' || sincronia === 'migrado' ? 'ok' : 'info'}`}>
          {sincronia === 'ok' && '✓ Sincronizado'}
          {sincronia === 'migrado' && '✓ Progresso local migrado para a conta'}
          {sincronia === 'salvando' && 'Salvando...'}
          {sincronia === 'carregando' && 'Carregando...'}
          {sincronia === 'erro' && '✕ Erro ao sincronizar'}
        </span>
        {ultimoSync && (
          <span className="small muted">
            ultima gravacao: {new Date(ultimoSync).toLocaleString('pt-BR')}
          </span>
        )}
      </div>

      {erroSync && (
        <Callout tipo="danger" titulo="Detalhe do erro">
          {erroSync} — suas alteracoes continuam salvas neste navegador e sobem sozinhas quando a conexao voltar.
        </Callout>
      )}

      <div className="btn-row" style={{ marginTop: 14 }}>
        <button className="btn" onClick={sincronizarAgora}>⬆ Enviar agora</button>
        <button
          className="btn"
          onClick={() => {
            if (confirm('Baixar a versao da nuvem? Alteracoes nao enviadas deste navegador serao perdidas.')) {
              baixarDaNuvem()
            }
          }}
        >
          ⬇ Baixar da nuvem
        </button>
        <button className="btn ghost" onClick={sair}>Sair da conta</button>
      </div>
    </div>
  )
}

function SincronizarCurso() {
  const { estado, sincronizarComCurso } = useApp()
  const [secao, setSecao] = useState(estado.cursoSincronizado?.secao ?? 11)
  const [aula, setAula] = useState(estado.cursoSincronizado?.aula ?? 10)
  const [feito, setFeito] = useState(false)

  const info = getSecao(secao)
  const plano = useMemo(
    () => planejarSincronizacao(secao, aula, info?.aulas || 1),
    [secao, aula, info]
  )

  const jaMarcados = Object.keys(estado.topicos).length

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 4 }}>Sincronizar com o curso do Nélio Alves</div>
      <div className="card-sub" style={{ marginBottom: 14 }}>
        Diga onde você está no curso e o sistema marca como concluído tudo que vem antes. Serve para você não
        precisar clicar em 180 tópicos na mão — e para refazer conforme avança.
      </div>

      <div className="row" style={{ gap: 12, alignItems: 'flex-end' }}>
        <div className="field" style={{ marginBottom: 0, flex: '1 1 240px', minWidth: 200 }}>
          <label>Em que seção você está?</label>
          <select value={secao} onChange={(e) => { setSecao(Number(e.target.value)); setAula(1); setFeito(false) }}>
            {SECOES_NELIO.map((s) => (
              <option key={s.n} value={s.n}>
                {s.n}. {s.nome} ({s.aulas} aulas)
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0, flex: '1 1 150px', minWidth: 140 }}>
          <label>Qual aula da seção?</label>
          <select value={aula} onChange={(e) => { setAula(Number(e.target.value)); setFeito(false) }}>
            {Array.from({ length: info?.aulas || 1 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} de {info?.aulas}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="callout" style={{ marginTop: 14 }}>
        <b>O que vai acontecer</b>
        {plano.totalTopicos} tópico(s) serão marcados como concluídos, em{' '}
        {plano.completos.length} módulo(s) completo(s)
        {plano.parciais.length > 0 ? ` e ${plano.parciais.length} parcial(is)` : ''}. As revisões ficam
        escalonadas ao longo de <b>{plano.dias} dia(s)</b>, no máximo 5 por dia — se todas vencessem amanhã, a fila
        estouraria o limite e travaria o seu roadmap no primeiro dia.
      </div>

      {plano.completos.length > 0 && (
        <div style={{ marginTop: 12, maxHeight: 190, overflowY: 'auto' }}>
          {plano.completos.map((m) => (
            <div key={m.id} className="spread small" style={{ padding: '4px 0' }}>
              <span style={{ color: 'var(--text-2)' }}>✓ {m.titulo}</span>
              <span className="muted">S{m.curso.secao} · {m.topicos.length} tóp.</span>
            </div>
          ))}
          {plano.parciais.map((p) => (
            <div key={p.modulo.id} className="spread small" style={{ padding: '4px 0' }}>
              <span style={{ color: 'var(--warn)' }}>◐ {p.modulo.titulo}</span>
              <span className="muted">
                S{p.modulo.curso.secao} · {p.quantos} de {p.modulo.topicos.length} tóp.
              </span>
            </div>
          ))}
        </div>
      )}

      {jaMarcados > 0 && (
        <div className="small muted" style={{ marginTop: 10 }}>
          Você já tem {jaMarcados} tópico(s) marcados. A sincronização <b>não desmarca nada</b> e não recria revisão
          do que já existe.
        </div>
      )}

      <div className="btn-row" style={{ marginTop: 14 }}>
        <button
          className="btn primary"
          disabled={plano.totalTopicos === 0}
          onClick={() => {
            sincronizarComCurso({ ...plano, secao, aula })
            setFeito(true)
          }}
        >
          Marcar {plano.totalTopicos} tópico(s) como concluídos
        </button>
      </div>

      {feito && (
        <Callout tipo="ok" titulo="Sincronizado">
          Progresso marcado e revisões escalonadas. Abra a aba <b>Revisão</b> — o que aparecer lá é o que você
          declarou saber. Se travar em algo, era exatamente o que precisava voltar.
        </Callout>
      )}

      {estado.cursoSincronizado && !feito && (
        <div className="small muted" style={{ marginTop: 10 }}>
          Última sincronização: seção {estado.cursoSincronizado.secao}, aula {estado.cursoSincronizado.aula} —{' '}
          {new Date(estado.cursoSincronizado.em).toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  )
}

function Disciplina() {
  const { estado, setBloqueio, fila } = useApp()
  const b = estado.bloqueio

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 4 }}>Trava de conteúdo novo</div>
      <div className="card-sub" style={{ marginBottom: 14 }}>
        Quando a fila de revisões atrasadas passa do limite, o roadmap trava tópicos não concluídos. Você continua
        podendo desmarcar (corrigir engano), mas não avançar.
      </div>

      <label className="topico" style={{ alignItems: 'center' }}>
        <input type="checkbox" checked={b.ativo} onChange={(e) => setBloqueio({ ativo: e.target.checked })} />
        <span>Manter a trava ativa</span>
      </label>

      {b.ativo ? (
        <div className="field" style={{ marginTop: 12, maxWidth: 260 }}>
          <label>Travar a partir de quantas atrasadas</label>
          <input
            type="number"
            min="3"
            max="100"
            value={b.limite}
            onChange={(e) => setBloqueio({ limite: Math.min(100, Math.max(3, Number(e.target.value) || 15)) })}
          />
          <span className="help">
            Você tem {fila.vencidas.length} atrasada(s) agora.{' '}
            {fila.vencidas.length >= b.limite ? 'A trava está ativa neste momento.' : 'Ainda abaixo do limite.'}
          </span>
        </div>
      ) : (
        <Callout tipo="warn" titulo="Você desligou o mecanismo que resolve o problema que relatou">
          Sua queixa foi esquecer o conteúdo anterior. A trava existe exatamente para impedir que você acumule
          material novo em cima de base esquecida. Desligada, o DevPath vira mais um checklist bonito — que é o
          tipo de coisa que você já disse que não funciona.
        </Callout>
      )}
    </div>
  )
}

export default function Config() {
  const { estado, setEstado, setPerfil, resetar, nuvemAtiva } = useApp()
  const inputRef = useRef(null)
  const [msg, setMsg] = useState(null)

  async function aoImportar(e) {
    const arq = e.target.files?.[0]
    if (!arq) return
    try {
      const dados = await importar(arq)
      setEstado(dados)
      setMsg({ tipo: 'ok', texto: 'Backup restaurado com sucesso.' })
    } catch {
      setMsg({ tipo: 'danger', texto: 'Arquivo invalido. Use um backup gerado por este sistema.' })
    }
    e.target.value = ''
  }

  return (
    <>
      <div className="page-head">
        <h1>Configuracoes</h1>
        <div className="sub">
          {nuvemAtiva
            ? 'Sua conta, o status da sincronizacao e o backup do progresso.'
            : 'Seus dados ficam apenas neste navegador. Faca backup se for trocar de maquina.'}
        </div>
      </div>

      {msg && (
        <Callout tipo={msg.tipo} titulo={msg.tipo === 'ok' ? 'Pronto' : 'Erro'}>
          {msg.texto}
        </Callout>
      )}

      <div style={{ marginTop: msg ? 14 : 0 }}>
        <Conta />
      </div>

      <SincronizarCurso />

      <Disciplina />

      <div className="card">
        <div className="card-title" style={{ marginBottom: 14 }}>Perfil e plano</div>
        <div className="field">
          <label>Nome</label>
          <input type="text" value={estado.perfil.nome} onChange={(e) => setPerfil({ nome: e.target.value })} />
        </div>
        <div className="field">
          <label>Objetivo</label>
          <select value={estado.perfil.objetivo} onChange={(e) => setPerfil({ objetivo: e.target.value })}>
            {Object.entries(OBJETIVOS).map(([id, o]) => (
              <option key={id} value={id}>
                {o.icone} {o.nome}
              </option>
            ))}
          </select>
          <span className="help">{OBJETIVOS[estado.perfil.objetivo]?.desc}</span>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1, minWidth: 140 }}>
            <label>Horas por semana</label>
            <input
              type="number"
              min="1"
              max="60"
              value={estado.perfil.horasSemana}
              onChange={(e) => setPerfil({ horasSemana: Number(e.target.value) })}
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Data de inicio</label>
            <input
              type="date"
              value={estado.perfil.dataInicio}
              onChange={(e) => setPerfil({ dataInicio: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 4 }}>Backup</div>
        <div className="card-sub" style={{ marginBottom: 14 }}>
          Mesmo com a nuvem ligada, um backup em arquivo e util para levar o progresso para outra conta ou para
          guardar um ponto no tempo.
        </div>
        <div className="btn-row">
          <button className="btn" onClick={() => exportar(estado)}>
            ⬇ Exportar progresso (.json)
          </button>
          <button className="btn" onClick={() => inputRef.current?.click()}>
            ⬆ Importar backup
          </button>
          <input ref={inputRef} type="file" accept="application/json" onChange={aoImportar} style={{ display: 'none' }} />
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 4 }}>Zona de perigo</div>
        <div className="card-sub" style={{ marginBottom: 14 }}>
          Apaga todo o progresso, notas, exercicios e a avaliacao do LinkedIn. Nao tem como desfazer.
        </div>
        <button
          className="btn danger"
          onClick={() => {
            if (confirm('Apagar TODO o progresso? Essa acao nao pode ser desfeita.')) resetar()
          }}
        >
          Apagar tudo e recomecar
        </button>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>Sobre este sistema</div>
        <p className="small muted">
          DevPath e um projeto React + Vite{nuvemAtiva ? ', com API propria em Node + MySQL para login e sincronizacao' : ''}.
          Todo o conteudo (trilhas, exercicios, perguntas e criterios do avaliador) vive em arquivos de dados em{' '}
          <span className="mono">src/data/</span> — voce pode editar, adicionar modulos e ajustar o roadmap ao seu
          ritmo sem mexer em nenhum componente.
        </p>
      </div>
    </>
  )
}
