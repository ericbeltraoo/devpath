// ---------------------------------------------------------------------------
// Avaliacao de forca de senha
// ---------------------------------------------------------------------------
// Isto e uma barreira de UX, nao de seguranca: roda no navegador e um atacante
// simplesmente nao usa a nossa tela. O valor real e impedir que VOCE escolha
// uma senha ruim. A protecao de verdade (hash, rate limit, checagem de senha
// vazada) acontece no servidor do Supabase.
// ---------------------------------------------------------------------------

// As senhas mais usadas do mundo + variacoes obvias em portugues.
const PROIBIDAS = new Set([
  '123456', '123456789', '12345678', '1234567890', 'password', 'senha123',
  'qwerty', 'abc123', '111111', '123123', 'admin', 'admin123', 'senha',
  'iloveyou', 'brasil', 'flamengo', 'corinthians', 'gremio', 'palmeiras',
  'password1', 'senha1234', '1q2w3e4r', 'zxcvbnm', 'asdfgh', 'letmein',
])

const SEQUENCIAS = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm']

function temSequencia(s, tamanho = 4) {
  const baixa = s.toLowerCase()
  for (const seq of SEQUENCIAS) {
    for (let i = 0; i <= seq.length - tamanho; i++) {
      const trecho = seq.slice(i, i + tamanho)
      if (baixa.includes(trecho)) return true
      if (baixa.includes([...trecho].reverse().join(''))) return true
    }
  }
  return false
}

function temRepeticao(s) {
  return /(.)\1{2,}/.test(s)
}

export const NIVEIS_SENHA = [
  { rotulo: 'Muito fraca', cor: '#ef4444' },
  { rotulo: 'Fraca', cor: '#f97316' },
  { rotulo: 'Razoavel', cor: '#eab308' },
  { rotulo: 'Boa', cor: '#84cc16' },
  { rotulo: 'Forte', cor: '#22c55e' },
]

export const MIN_CARACTERES = 10

/**
 * @returns {{pontos: 0|1|2|3|4, nivel: {rotulo, cor}, problemas: string[], aceitavel: boolean}}
 */
export function avaliarSenha(senha, email = '') {
  const problemas = []
  if (!senha) {
    return { pontos: 0, nivel: NIVEIS_SENHA[0], problemas: ['Digite uma senha.'], aceitavel: false }
  }

  const temMinuscula = /[a-z]/.test(senha)
  const temMaiuscula = /[A-Z]/.test(senha)
  const temNumero = /\d/.test(senha)
  const temSimbolo = /[^A-Za-z0-9]/.test(senha)
  const variedade = [temMinuscula, temMaiuscula, temNumero, temSimbolo].filter(Boolean).length

  // --- bloqueios: reprovam independente do resto -------------------------
  if (senha.length < MIN_CARACTERES) problemas.push(`Use pelo menos ${MIN_CARACTERES} caracteres.`)
  if (PROIBIDAS.has(senha.toLowerCase())) problemas.push('Essa e uma das senhas mais usadas do mundo. Troque.')
  if (temSequencia(senha)) problemas.push('Evite sequencias como 1234 ou qwerty.')
  if (temRepeticao(senha)) problemas.push('Evite o mesmo caractere repetido 3 vezes ou mais.')

  const usuarioEmail = (email.split('@')[0] || '').toLowerCase()
  if (usuarioEmail.length >= 4 && senha.toLowerCase().includes(usuarioEmail)) {
    problemas.push('A senha nao pode conter o seu email.')
  }
  if (variedade < 3) {
    problemas.push('Misture pelo menos 3 tipos: minuscula, maiuscula, numero e simbolo.')
  }

  // --- pontuacao ----------------------------------------------------------
  let pontos = 0
  if (senha.length >= 8) pontos++
  if (senha.length >= 12) pontos++
  if (senha.length >= 16) pontos++
  if (variedade >= 3) pontos++
  if (variedade === 4) pontos++

  if (problemas.length > 0) pontos = Math.min(pontos, 1)
  pontos = Math.max(0, Math.min(4, pontos))

  return {
    pontos,
    nivel: NIVEIS_SENHA[pontos],
    problemas,
    aceitavel: problemas.length === 0 && pontos >= 2,
  }
}

// ---------------------------------------------------------------------------
// Backoff exponencial para tentativas de login
// ---------------------------------------------------------------------------
// Depois de 3 erros, cada nova tentativa espera o dobro da anterior, ate 5 min.
// De novo: e defesa contra forca bruta pela NOSSA tela, e contra voce mesmo
// martelando o botao. O bloqueio que conta e o do servidor do Supabase.
// ---------------------------------------------------------------------------

export const TENTATIVAS_LIVRES = 3

export function calcularEspera(tentativasFalhas) {
  if (tentativasFalhas <= TENTATIVAS_LIVRES) return 0
  const excedente = tentativasFalhas - TENTATIVAS_LIVRES
  return Math.min(2 ** excedente * 5, 300) // 10s, 20s, 40s... ate 5 min
}

export function formatarEspera(segundos) {
  if (segundos < 60) return `${segundos}s`
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return s === 0 ? `${m}min` : `${m}min ${s}s`
}
