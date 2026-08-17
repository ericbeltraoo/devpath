// ---------------------------------------------------------------------------
// Alarme e notificacao do Pomodoro
// ---------------------------------------------------------------------------
// O som e gerado pela Web Audio API, nao carregado de um arquivo. Motivos:
//   1. Nao depende de asset externo — a CSP bloqueia origem de fora
//   2. Nao aumenta o bundle
//   3. Funciona offline
// ---------------------------------------------------------------------------

let contexto = null

function pegarContexto() {
  if (!contexto) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    contexto = new AC()
  }
  // Navegadores suspendem o audio ate haver interacao do usuario.
  if (contexto.state === 'suspended') contexto.resume()
  return contexto
}

/**
 * Toca uma sequencia de bipes.
 * @param {'foco'|'pausa'} tipo  fim de foco = grave e longo; fim de pausa = agudo
 */
export function tocarAlarme(tipo = 'foco', volume = 0.6) {
  const ctx = pegarContexto()
  if (!ctx) return

  const notas =
    tipo === 'foco'
      ? [
          { f: 880, t: 0.0, d: 0.18 },
          { f: 660, t: 0.22, d: 0.18 },
          { f: 440, t: 0.44, d: 0.36 },
        ]
      : [
          { f: 523, t: 0.0, d: 0.14 },
          { f: 784, t: 0.16, d: 0.28 },
        ]

  for (const n of notas) {
    const osc = ctx.createOscillator()
    const ganho = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = n.f

    const inicio = ctx.currentTime + n.t
    const fim = inicio + n.d

    // Envelope suave: sem isso o bipe estala no inicio e no fim.
    ganho.gain.setValueAtTime(0.0001, inicio)
    ganho.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), inicio + 0.02)
    ganho.gain.exponentialRampToValueAtTime(0.0001, fim)

    osc.connect(ganho)
    ganho.connect(ctx.destination)
    osc.start(inicio)
    osc.stop(fim + 0.02)
  }
}

/** Desbloqueia o audio. Precisa ser chamado dentro de um clique do usuario. */
export function liberarAudio() {
  pegarContexto()
}

// ---------------------------------------------------------------------------
// Notificacao do sistema
// ---------------------------------------------------------------------------

export function suporteNotificacao() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function permissaoNotificacao() {
  return suporteNotificacao() ? Notification.permission : 'unsupported'
}

export async function pedirPermissaoNotificacao() {
  if (!suporteNotificacao()) return 'unsupported'
  if (Notification.permission !== 'default') return Notification.permission
  try {
    return await Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export function notificar(titulo, corpo) {
  if (!suporteNotificacao() || Notification.permission !== 'granted') return
  try {
    const n = new Notification(titulo, {
      body: corpo,
      tag: 'devpath-pomodoro', // substitui a anterior em vez de empilhar
      requireInteraction: false,
      silent: true, // o som quem toca somos nos, para respeitar o volume configurado
    })
    n.onclick = () => {
      window.focus()
      n.close()
    }
    setTimeout(() => n.close(), 15000)
  } catch {
    /* alguns navegadores exigem service worker; o alarme sonoro cobre */
  }
}

// ---------------------------------------------------------------------------
// Formatacao
// ---------------------------------------------------------------------------

export function mmss(segundos) {
  const s = Math.max(0, Math.round(segundos))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function formatarMinutos(min) {
  const m = Math.round(min)
  if (m < 60) return `${m}min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r === 0 ? `${h}h` : `${h}h ${r}min`
}
