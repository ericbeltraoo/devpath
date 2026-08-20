// ---------------------------------------------------------------------------
// EXECUCAO DE CODIGO — proxy para o Judge0
// ---------------------------------------------------------------------------
// Por que passar pela nossa API em vez de o navegador chamar direto:
//
//   1. CSP: o frontend mantem connect-src 'self'. Nada de liberar dominio de
//      terceiro no cabecalho de seguranca.
//   2. Trocar de provedor vira mudanca de UMA variavel de ambiente. O Piston,
//      que era a opcao obvia, fechou a API publica em 02/2026 — isso vai
//      acontecer de novo com qualquer servico gratuito.
//   3. Limite de uso por usuario, do nosso lado.
//
// IMPORTANTE: o codigo NAO roda nesta VPS. Roda no Judge0. Executar codigo
// arbitrario na mesma maquina que hospeda o lastweek.com.br seria transformar
// "minha conta foi invadida" em "meu servidor foi invadido".
// ---------------------------------------------------------------------------

const JUDGE0 = process.env.JUDGE0_URL || 'https://ce.judge0.com'
const JUDGE0_KEY = process.env.JUDGE0_KEY || ''
const ID_JAVA = 91 // JDK 17

const LIMITE_POR_HORA = 40
const usos = new Map() // usuarioId -> { janela, contagem }

export function dentroDoLimite(usuarioId) {
  const agora = Date.now()
  const u = usos.get(usuarioId)

  if (!u || agora - u.janela > 3600_000) {
    usos.set(usuarioId, { janela: agora, contagem: 1 })
    return { ok: true, restantes: LIMITE_POR_HORA - 1 }
  }
  if (u.contagem >= LIMITE_POR_HORA) {
    return { ok: false, restantes: 0, minutos: Math.ceil((3600_000 - (agora - u.janela)) / 60000) }
  }
  u.contagem++
  return { ok: true, restantes: LIMITE_POR_HORA - u.contagem }
}

export class ErroExecucao extends Error {
  constructor(mensagem, status = 502) {
    super(mensagem)
    this.status = status
  }
}

/**
 * Compila e roda um arquivo Java, devolvendo saida e erros.
 * O timeout curto e proposital: laco infinito no codigo do aluno nao pode
 * segurar a requisicao.
 */
export async function executarJava(fonte) {
  if (typeof fonte !== 'string' || fonte.length > 60000) {
    throw new ErroExecucao('Codigo ausente ou grande demais.', 400)
  }

  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), 30000)

  try {
    const r = await fetch(`${JUDGE0}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      signal: controle.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(JUDGE0_KEY ? { 'X-RapidAPI-Key': JUDGE0_KEY } : {}),
      },
      body: JSON.stringify({
        language_id: ID_JAVA,
        source_code: fonte,
        cpu_time_limit: 10,
        wall_time_limit: 15,
        memory_limit: 256000,
      }),
    })

    if (!r.ok) {
      throw new ErroExecucao(
        `O servico de execucao respondeu ${r.status}. A analise estatica continua funcionando.`,
        502
      )
    }

    const d = await r.json()
    return {
      status: d.status?.description || 'desconhecido',
      compilou: !d.compile_output,
      saida: d.stdout || '',
      erroCompilacao: d.compile_output || '',
      erroExecucao: d.stderr || '',
      tempo: d.time,
    }
  } catch (e) {
    if (e instanceof ErroExecucao) throw e
    if (e.name === 'AbortError') {
      throw new ErroExecucao('A execucao passou de 30 segundos. Ha laco infinito no codigo?', 504)
    }
    throw new ErroExecucao(
      'Nao foi possivel alcancar o servico de execucao. A analise estatica continua funcionando.',
      502
    )
  } finally {
    clearTimeout(relogio)
  }
}

/**
 * Monta o arquivo Java: o codigo do aluno + uma classe Main com os testes.
 *
 * Java so aceita uma classe public por arquivo, entao o `public` das classes
 * coladas e removido. Isso nao muda o comportamento do que esta sendo testado.
 */
export function montarArquivoDeTeste(codigoDoAluno, corpoDosTestes, imports = []) {
  const semPublic = codigoDoAluno
    .replace(/^\s*package\s+[^;]+;\s*/m, '')
    .replace(/\bpublic\s+(class|interface|enum|record|abstract\s+class|final\s+class)\b/g, '$1')

  const importsDoAluno = [...codigoDoAluno.matchAll(/^\s*import\s+([^;]+);/gm)].map((m) => m[1].trim())
  const todos = [...new Set([...imports, ...importsDoAluno])]

  return `${todos.map((i) => `import ${i};`).join('\n')}

${semPublic.replace(/^\s*import\s+[^;]+;\s*/gm, '')}

public class Main {
    static int passou = 0, falhou = 0;

    static void verificar(String nome, boolean condicao) {
        if (condicao) { passou++; System.out.println("PASSOU|" + nome); }
        else          { falhou++; System.out.println("FALHOU|" + nome); }
    }

    static void verificarIgual(String nome, Object obtido, Object esperado) {
        boolean ok = (esperado == null) ? obtido == null : esperado.equals(obtido);
        if (ok) { passou++; System.out.println("PASSOU|" + nome); }
        else    { falhou++; System.out.println("FALHOU|" + nome + "|esperado=" + esperado + "|obtido=" + obtido); }
    }

    static void verificarLanca(String nome, Class<?> tipo, Runnable acao) {
        try {
            acao.run();
            falhou++; System.out.println("FALHOU|" + nome + "|nao lancou " + tipo.getSimpleName());
        } catch (Throwable t) {
            if (tipo.isInstance(t)) { passou++; System.out.println("PASSOU|" + nome); }
            else { falhou++; System.out.println("FALHOU|" + nome + "|lancou " + t.getClass().getSimpleName()); }
        }
    }

    public static void main(String[] args) {
        try {
${corpoDosTestes}
        } catch (Throwable t) {
            System.out.println("ERRO|" + t.getClass().getSimpleName() + ": " + t.getMessage());
        }
        System.out.println("RESUMO|" + passou + "|" + falhou);
    }
}`
}

/** Interpreta a saida padronizada acima. */
export function interpretarSaida(saida) {
  const testes = []
  let resumo = null
  let erroGeral = null

  for (const linha of (saida || '').split('\n')) {
    const p = linha.split('|')
    if (p[0] === 'PASSOU') testes.push({ nome: p[1], ok: true })
    else if (p[0] === 'FALHOU') testes.push({ nome: p[1], ok: false, detalhe: p.slice(2).join(' ') })
    else if (p[0] === 'RESUMO') resumo = { passou: Number(p[1]), falhou: Number(p[2]) }
    else if (p[0] === 'ERRO') erroGeral = p.slice(1).join('|')
  }
  return { testes, resumo, erroGeral }
}
