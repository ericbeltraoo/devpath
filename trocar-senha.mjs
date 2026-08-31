// ---------------------------------------------------------------------------
// Troca a senha do DevPath.
//
//   node trocar-senha.mjs
//
// A frase e digitada aqui, escondida, e NAO aparece na tela nem fica no
// historico do terminal. So o hash sai daqui, e ele vai direto para a Vercel
// pela CLI — sem passar por chat, arquivo ou area de transferencia.
//
// Nao existe "esqueci minha senha" neste sistema. Este script e a recuperacao.
// ---------------------------------------------------------------------------
import { spawn } from 'node:child_process'
import readline from 'node:readline'
import bcrypt from 'bcryptjs'

const AMBIENTES = ['production', 'preview', 'development']
const MIN = 10

/**
 * Leitura da senha.
 *
 * No terminal de verdade, esconde o que e digitado (`_writeToOutput`).
 * Fora dele — entrada vinda de pipe, como nos testes — le as linhas de uma
 * vez, porque o readline em modo interativo consome tudo na primeira
 * pergunta e a segunda ficaria esperando para sempre.
 */
const ehTerminal = Boolean(process.stdin.isTTY)

async function lerLinhasDoPipe() {
  let bruto = ''
  for await (const parte of process.stdin) bruto += parte
  return bruto.split(String.fromCharCode(10)).map((l) => l.trimEnd())
}

const linhasDoPipe = ehTerminal ? null : await lerLinhasDoPipe()

const leitor = ehTerminal
  ? readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
  : null

let rotuloAtual = ''
if (leitor) {
  leitor._writeToOutput = (texto) => {
    if (texto.includes(rotuloAtual)) leitor.output.write(rotuloAtual)
  }
}

function perguntarEscondido(rotulo) {
  if (!ehTerminal) {
    process.stdout.write(rotulo + String.fromCharCode(10))
    return Promise.resolve(linhasDoPipe.shift() ?? '')
  }
  rotuloAtual = rotulo
  return new Promise((resolve) => {
    leitor.question(rotulo, (resposta) => {
      process.stdout.write(String.fromCharCode(10))
      resolve(resposta)
    })
  })
}

function rodar(comando, args, entrada) {
  return new Promise((resolve, reject) => {
    const p = spawn(comando, args, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] })
    let saida = ''
    p.stdout.on('data', (d) => (saida += d))
    p.stderr.on('data', (d) => (saida += d))
    p.on('close', (codigo) => (codigo === 0 ? resolve(saida) : reject(new Error(saida.trim()))))
    if (entrada != null) p.stdin.write(entrada)
    p.stdin.end()
  })
}

const cli = process.platform === 'win32'
  ? '.\\node_modules\\.bin\\vercel.cmd'
  : './node_modules/.bin/vercel'

console.log('\nTroca de senha do DevPath')
console.log('A frase nao vai aparecer enquanto voce digita. Isso e proposital.\n')

const senha = await perguntarEscondido('Nova senha: ')
const confirmacao = await perguntarEscondido('Repita:     ')

leitor?.close()

if (senha !== confirmacao) {
  console.log('\nAs duas nao batem. Nada foi alterado.\n')
  process.exit(1)
}
if (senha.length < MIN) {
  console.log(`\nUse pelo menos ${MIN} caracteres. Nada foi alterado.`)
  console.log('Uma frase e melhor que uma palavra: mais longa, mais facil de lembrar.\n')
  process.exit(1)
}

const hash = bcrypt.hashSync(senha, 12)
console.log('\nHash gerado. Enviando para a Vercel...\n')

for (const ambiente of AMBIENTES) {
  // Remover antes de adicionar: a CLI recusa sobrescrever uma variavel que
  // ja existe. Se nao houver o que remover, seguimos em frente.
  await rodar(cli, ['env', 'rm', 'SENHA_HASH', ambiente, '--yes']).catch(() => {})
  try {
    await rodar(cli, ['env', 'add', 'SENHA_HASH', ambiente], hash)
    console.log(`  ${ambiente.padEnd(12)} ok`)
  } catch (e) {
    console.log(`  ${ambiente.padEnd(12)} FALHOU: ${String(e.message).split('\n').pop()}`)
  }
}

console.log('\nFalta publicar para a senha nova valer:\n')
console.log(`  ${cli} --prod --yes\n`)
console.log('Ate publicar, a senha ANTIGA continua funcionando.\n')
