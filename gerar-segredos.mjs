// ---------------------------------------------------------------------------
// Gera os dois valores secretos que a Vercel precisa.
//
//   node gerar-segredos.mjs "sua senha aqui"
//
// A senha em si NUNCA e gravada em lugar nenhum. O que sai daqui e o hash
// dela (irreversivel) e um segredo aleatorio para assinar o token de sessao.
// ---------------------------------------------------------------------------
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

const senha = process.argv[2]

if (!senha) {
  console.log('\nComo usar:\n')
  console.log('  node gerar-segredos.mjs "SuaSenhaAqui"\n')
  console.log('Escolha uma senha longa e que voce lembre.')
  console.log('Nao existe "esqueci minha senha" neste sistema.\n')
  process.exit(1)
}

if (senha.length < 10) {
  console.log(`\nEssa senha tem ${senha.length} caracteres. Use pelo menos 10.`)
  console.log('Uma frase e melhor que uma palavra: "meu cafe as 6 da manha" ja')
  console.log('e mais forte que "Xk9#2p" e voce nao esquece.\n')
  process.exit(1)
}

console.log('\n============================================================')
console.log(' COPIE ESTES DOIS VALORES PARA A VERCEL')
console.log('============================================================\n')

console.log('SENHA_HASH')
console.log(bcrypt.hashSync(senha, 12))
console.log()

console.log('JWT_SECRET')
console.log(crypto.randomBytes(48).toString('base64'))
console.log()

console.log('------------------------------------------------------------')
console.log(' Faltam ainda duas variaveis, que NAO sao geradas aqui:')
console.log()
console.log('   DATABASE_URL    -> vem do painel do banco de dados')
console.log('   VITE_API_URL    -> o valor e exatamente:  /')
console.log()
console.log(' Depois de copiar, limpe o historico do terminal:')
console.log('   Clear-History          (PowerShell)')
console.log('------------------------------------------------------------\n')
