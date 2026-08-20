// ---------------------------------------------------------------------------
// ANALISE ESTATICA DE CODIGO JAVA
// ---------------------------------------------------------------------------
// Roda no navegador, de graca, sem servidor e sem internet.
//
// O que ela faz: pega os erros MECANICOS — os que reprovam em entrevista e
// que dao para detectar lendo o texto do codigo. Date em vez de java.time,
// double para dinheiro, catch vazio, String comparada com ==.
//
// O que ela NAO faz, e nao vai fazer: julgar design. "Regra de negocio no
// lugar certo", "adicionar um tipo novo nao exige mudar o codigo existente" —
// isso exige entender a intencao, nao o texto. Um checador que dissesse
// "aprovado" nesses criterios estaria mentindo para voce.
//
// Por isso o resultado e dividido em: reprova, alerta e informacao. Passar na
// analise estatica NAO significa exercicio concluido.
// ---------------------------------------------------------------------------

const semStringsNemComentarios = (codigo) =>
  codigo
    .replace(/\/\*[\s\S]*?\*\//g, ' ')      // bloco
    .replace(/\/\/[^\n]*/g, ' ')            // linha
    .replace(/"(\\.|[^"\\])*"/g, '""')      // string
    .replace(/'(\\.|[^'\\])*'/g, "''")      // char

export const GRAVIDADE = {
  reprova: { rotulo: 'Reprova', cor: 'var(--danger)', peso: 3 },
  alerta: { rotulo: 'Alerta', cor: 'var(--warn)', peso: 2 },
  info: { rotulo: 'Observacao', cor: 'var(--text-3)', peso: 1 },
}

// ---------------------------------------------------------------------------
// Regras universais — valem para qualquer codigo Java do sistema
// ---------------------------------------------------------------------------

const UNIVERSAIS = [
  {
    id: 'legado-data',
    gravidade: 'reprova',
    titulo: 'Uso de Date, Calendar ou SimpleDateFormat',
    porque:
      'Sao API legada: mutaveis, e o SimpleDateFormat corrompe dados sob concorrencia. ' +
      'Em codigo novo, use java.time. Isso e eliminatorio em entrevista.',
    detectar: (c) => /\b(new\s+Date\s*\(|Calendar\.getInstance|new\s+SimpleDateFormat)/.test(c),
  },
  {
    id: 'dinheiro-double',
    gravidade: 'reprova',
    titulo: 'double ou float em variavel de dinheiro',
    porque:
      'Ponto flutuante binario nao representa decimal exatamente: 0.1 + 0.2 nao da 0.3. ' +
      'Em dinheiro isso vira divergencia de centavos. Use BigDecimal.',
    detectar: (c) =>
      /\b(double|float)\s+\w*(preco|valor|salario|saldo|total|juros|multa|desconto|comissao|montante|troco)\w*/i.test(c),
  },
  {
    id: 'bigdecimal-double',
    gravidade: 'reprova',
    titulo: 'BigDecimal construido a partir de double',
    porque:
      'new BigDecimal(0.1) carrega o erro do double para dentro do BigDecimal. ' +
      'Construa a partir de String: new BigDecimal("0.10").',
    detectar: (c) => /new\s+BigDecimal\s*\(\s*(\d+\.\d+|[a-z]\w*\s*\))/.test(c) && !/BigDecimal\s*\(\s*"/.test(c),
  },
  {
    id: 'catch-vazio',
    gravidade: 'reprova',
    titulo: 'catch vazio',
    porque:
      'Engolir excecao sem tratar nem registrar apaga a unica pista que voce teria em producao. ' +
      'Trate, relance ou no minimo registre.',
    detectar: (c) => /catch\s*\([^)]*\)\s*\{\s*\}/.test(c),
  },
  {
    id: 'catch-generico',
    gravidade: 'alerta',
    titulo: 'catch (Exception e) generico',
    porque:
      'Captura tudo, inclusive erro de programacao que voce nao queria tratar. ' +
      'Capture o tipo especifico que voce sabe tratar.',
    detectar: (c) => /catch\s*\(\s*(Exception|Throwable)\s+\w+\s*\)/.test(c),
  },
  {
    id: 'string-igualdade',
    gravidade: 'reprova',
    titulo: 'String comparada com == ou !=',
    porque:
      '== compara referencia, nao conteudo. Funciona por acaso com literais por causa do pool ' +
      'de Strings e falha com valor vindo de entrada. Use equals.',
    detectar: (c) => /(\w+\s*(==|!=)\s*"[^"]*")|("[^"]*"\s*(==|!=)\s*\w+)/.test(c),
  },
  {
    id: 'concat-em-laco',
    gravidade: 'alerta',
    titulo: 'Concatenacao de String dentro de laco',
    porque:
      'String e imutavel: cada += cria um objeto novo. Em laco isso vira O(n²). Use StringBuilder.',
    detectar: (c) => {
      const laco = /\b(for|while)\s*\([^)]*\)\s*\{([\s\S]{0,600}?)\}/g
      let m
      // Pega r += "x", r += var e r += itens[i] + "," — qualquer += dentro
      // do laco cujo lado direito envolva String.
      while ((m = laco.exec(c))) if (/\w+\s*\+=\s*[^;]*("|String)/.test(m[2])) return true
      return false
    },
  },
  {
    id: 'optional-get',
    gravidade: 'alerta',
    titulo: 'Optional.get() sem verificacao',
    porque:
      'get() em Optional vazio lanca NoSuchElementException — o mesmo problema do null que ' +
      'o Optional deveria resolver. Use orElseThrow com mensagem, orElse ou ifPresent.',
    detectar: (c) => /\.get\s*\(\s*\)/.test(c) && /Optional|findFirst|findAny|\.stream\s*\(/.test(c),
  },
  {
    id: 'equals-sem-hashcode',
    gravidade: 'reprova',
    titulo: 'equals sobrescrito sem hashCode',
    porque:
      'Quebra o contrato: o objeto vai para baldes diferentes em HashMap e HashSet, ' +
      'e a colecao aceita duplicata sem reclamar. Falha silenciosa.',
    detectar: (c) =>
      /public\s+boolean\s+equals\s*\(\s*Object/.test(c) && !/public\s+int\s+hashCode\s*\(/.test(c),
  },
  {
    id: 'campo-publico',
    gravidade: 'alerta',
    titulo: 'Atributo public',
    porque:
      'Expoe o estado e destroi o encapsulamento: qualquer um altera sem passar pela sua regra. ' +
      'Use private com operacao de negocio.',
    detectar: (c) => /^\s*public\s+(?!static\s+final|class|interface|enum|record|abstract|final\s+class)[\w<>\[\],\s]+\s+\w+\s*(=[^;]*)?;/m.test(c),
  },
  {
    id: 'print-de-debug',
    gravidade: 'info',
    titulo: 'Muitos System.out.println',
    porque:
      'Se sao prints de depuracao, use o debugger. Se sao a saida do programa, tudo bem — ' +
      'mas em codigo de servidor eles deveriam ser log.',
    detectar: (c) => (c.match(/System\.out\.print/g) || []).length > 8,
  },
]

// ---------------------------------------------------------------------------
// Metricas
// ---------------------------------------------------------------------------

function medirMain(codigo) {
  const m = /static\s+void\s+main\s*\([^)]*\)\s*\{/.exec(codigo)
  if (!m) return null
  let prof = 0
  let i = m.index + m[0].length - 1
  const ini = i
  for (; i < codigo.length; i++) {
    if (codigo[i] === '{') prof++
    else if (codigo[i] === '}') {
      prof--
      if (prof === 0) break
    }
  }
  const corpo = codigo.slice(ini + 1, i)
  return corpo.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length
}

function maiorMetodo(codigo) {
  const re = /(public|private|protected)\s+[\w<>\[\],\s]+\s+(\w+)\s*\([^)]*\)\s*\{/g
  let m
  let maior = { nome: null, linhas: 0 }
  while ((m = re.exec(codigo))) {
    let prof = 0
    let i = m.index + m[0].length - 1
    const ini = i
    for (; i < codigo.length; i++) {
      if (codigo[i] === '{') prof++
      else if (codigo[i] === '}') {
        prof--
        if (prof === 0) break
      }
    }
    const n = codigo.slice(ini + 1, i).split('\n').filter((l) => l.trim()).length
    if (n > maior.linhas) maior = { nome: m[2], linhas: n }
  }
  return maior
}

// ---------------------------------------------------------------------------
// Analise
// ---------------------------------------------------------------------------

/**
 * @param {string} codigo   codigo Java colado pelo usuario
 * @param {object} exercicio o exercicio, que pode trazer `checagens` proprias
 */
export function analisar(codigo, exercicio = {}) {
  if (!codigo || codigo.trim().length < 20) {
    return { vazio: true, achados: [], metricas: {}, nota: null }
  }

  const limpo = semStringsNemComentarios(codigo)
  const achados = []

  const regras = [...UNIVERSAIS, ...(exercicio.checagens || [])]
  for (const r of regras) {
    // Regras especificas podem pedir para olhar o codigo com strings.
    const alvo = r.comStrings ? codigo : limpo
    try {
      if (r.detectar(alvo)) achados.push({ ...r })
    } catch {
      /* uma regra quebrada nao pode derrubar a analise inteira */
    }
  }

  // ------------------------------------------------------------- metricas
  const linhasMain = medirMain(limpo)
  const maior = maiorMetodo(limpo)
  const metricas = {
    linhas: codigo.split('\n').length,
    linhasMain,
    maiorMetodo: maior.linhas ? maior : null,
    classes: (limpo.match(/\b(class|interface|enum|record)\s+\w+/g) || []).length,
  }

  if (linhasMain !== null && linhasMain > 15) {
    achados.push({
      id: 'main-longo',
      gravidade: 'alerta',
      titulo: `main com ${linhasMain} linhas`,
      porque:
        'O main deveria orquestrar, nao implementar. Extraia metodos com nome — ' +
        'e o criterio de aceite de varios exercicios deste roadmap.',
    })
  }

  if (maior.linhas > 30) {
    achados.push({
      id: 'metodo-longo',
      gravidade: 'alerta',
      titulo: `Metodo "${maior.nome}" com ${maior.linhas} linhas`,
      porque: 'Metodo longo costuma fazer mais de uma coisa. Se o nome dele precisa de "e", sao dois metodos.',
    })
  }

  const reprova = achados.filter((a) => a.gravidade === 'reprova').length
  const alerta = achados.filter((a) => a.gravidade === 'alerta').length

  return {
    vazio: false,
    achados: achados.sort((a, b) => GRAVIDADE[b.gravidade].peso - GRAVIDADE[a.gravidade].peso),
    metricas,
    resumo: { reprova, alerta, info: achados.length - reprova - alerta },
    // "limpo" nao quer dizer "certo": quer dizer que nao encontrei erro mecanico.
    limpo: reprova === 0 && alerta === 0,
  }
}
