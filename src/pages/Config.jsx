import { useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { OBJETIVOS } from '../lib/planner'
import { exportar, importar } from '../lib/storage'
import { configuracaoIncompleta } from '../lib/supabase'
import { Callout } from '../components/ui'

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
        {configuracaoIncompleta && (
          <Callout tipo="danger" titulo="Configuracao pela metade">
            Uma das duas variaveis do Supabase foi encontrada e a outra nao, entao a sincronizacao ficou desligada.
            Abra o console do navegador (F12) para ver qual esta faltando. Causa mais comum no Windows: o arquivo{' '}
            <span className="mono">.env</span> foi salvo em UTF-8 <b>com BOM</b> — regrave como UTF-8 sem BOM.
          </Callout>
        )}
        <Callout tipo="warn" titulo="Como ativar a sincronizacao">
          Crie o arquivo <span className="mono">.env</span> na raiz do projeto com as chaves do Supabase
          (<span className="mono">VITE_SUPABASE_URL</span> e <span className="mono">VITE_SUPABASE_ANON_KEY</span>) e
          reinicie o servidor. O passo a passo completo esta no README.
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
          DevPath e um projeto React + Vite{nuvemAtiva ? ', com Supabase (Postgres + Auth) para login e sincronizacao' : ''}.
          Todo o conteudo (trilhas, exercicios, perguntas e criterios do avaliador) vive em arquivos de dados em{' '}
          <span className="mono">src/data/</span> — voce pode editar, adicionar modulos e ajustar o roadmap ao seu
          ritmo sem mexer em nenhum componente.
        </p>
      </div>
    </>
  )
}
