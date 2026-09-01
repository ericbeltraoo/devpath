// ---------------------------------------------------------------------------
// Exercicios do modulo java-f1-m4 — Data e hora (java.time)
// ---------------------------------------------------------------------------
// REGUA DE NIVEL — leia antes de escrever ou editar qualquer exercicio daqui.
//
// A faixa-alvo e VAGA JUNIOR. Os tres niveis (Aquecimento / Mercado /
// Entrevista) sao progressao DENTRO de junior, nao junior -> pleno -> senior.
//
// O teto nao e opiniao: e a aula do curso do Nelio Alves em que o aluno esta.
// Data-hora e a secao 11. Entao a solucao so pode usar o que veio ate ali:
//
//   PODE   if/for/while, String e StringBuilder, metodos e sobrecarga,
//          classes com construtor e encapsulamento, arrays,
//          java.time inteiro (LocalDate, LocalTime, LocalDateTime, Instant,
//          ZoneId, DateTimeFormatter, Duration, Period, ChronoUnit)
//
//   NAO    enum (secao 12), heranca (13), EXCECOES (14), arquivos (15),
//          interfaces (16), Set/Map/generics (17), lambda e streams (18),
//          record, JUnit, Date e Calendar
//
// Consequencia: validacao vira retorno sentinela (-1) e teste vira main com
// comparacao impressa. Toda muleta dessas fica DECLARADA como muleta no
// codigo, apontando o modulo em que ela vira a forma adulta. Exercicio que
// exige o que o aluno ainda nao estudou nao ensina — so ensina a desistir.
//
// FORMATO. Cada exercicio tem quatro partes, nesta ordem de leitura:
//
//   1. cenario + tarefa + requisitos + testes  -> voce le e TENTA
//   2. explicacao                              -> revelavel
//   3. solucao                                 -> TRANCADA ate marcar "tentei"
//
// A ordem nao e enfeite. Ler a solucao antes de tentar produz a sensacao de
// ter aprendido sem o aprendizado, que e o pior resultado possivel: voce
// atravessa o modulo achando que sabe.
// ---------------------------------------------------------------------------

export const EXERCICIOS_DATA_HORA = [
  // =========================================================================
  {
    id: 'dh-1',
    moduloId: 'java-f1-m4',
    nivel: 1,
    titulo: 'Idade de verdade',
    contexto: 'Seguradora · triagem para vaga Júnior',
    tempo: '30 min',

    cenario:
      'Você entrou num time que cuida do sistema de uma seguradora. O preço do seguro muda por ' +
      'faixa etária. Chegou este chamado:\n\n' +
      '"Clientes estão reclamando de cobrança na faixa errada. A idade sai errada para algumas ' +
      'pessoas, principalmente quem nasceu no fim de fevereiro. O código atual faz ' +
      '(hoje - nascimento) / 365. Precisamos disso corrigido para o fechamento do mês."\n\n' +
      'Nenhum chamado real vem com a resposta dentro. Leia de novo e repare no que ele NÃO diz: ' +
      'o que fazer quando a data de nascimento vier errada.',

    tarefa:
      'Monte a solução em três partes, como um projeto Java de verdade:\n\n' +
      '**1. `Pessoa`** — a entidade. Guarda nome e data de nascimento, com atributos privados, ' +
      'construtor e getters.\n\n' +
      '**2. `PessoaService`** — a regra de negócio. Tem `idadeEmAnos(Pessoa, LocalDate referencia)` ' +
      'devolvendo a idade em anos completos, e `faixaEtaria(int idade)` devolvendo "18-24", ' +
      '"25-39", "40-59" ou "60+".\n\n' +
      '**3. `Programa`** — o `main`. Cria as pessoas, chama o service e imprime o resultado.',

    requisitos: [
      'A entidade guarda dado. O service calcula. O `main` só monta e imprime — cada um no seu arquivo',
      'Use `java.time`. Nada de `Date` ou `Calendar`',
      'Anos COMPLETOS: quem faz aniversário amanhã ainda tem a idade de ontem',
      'A data de referência entra como parâmetro. Não chame `LocalDate.now()` dentro do service',
      'Nascimento no futuro é dado inválido: devolva -1 e deixe o `main` decidir o que mostrar',
      'Atributos privados com getters. Nada de atributo público',
    ],

    testes: [
      { dado: 'Maria nasceu 29/02/2000, referência 28/02/2026', esperado: '25 anos, faixa "25-39"' },
      { dado: 'Maria, referência 01/03/2026', esperado: '26 anos' },
      { dado: 'João nasceu 21/08/2006, referência 21/08/2026', esperado: '20 anos (faz hoje)' },
      { dado: 'João nasceu 22/08/2006, referência 21/08/2026', esperado: '19 anos, faixa "18-24"' },
      { dado: 'nascimento 01/01/2030, referência 28/02/2026', esperado: '-1, e o main avisa que é inválido' },
      { dado: 'faixaEtaria(24)', esperado: '"18-24" — a borda pertence à faixa de baixo' },
    ],

    explicacao: {
      testa:
        'Duas coisas ao mesmo tempo.\n\n' +
        'A primeira é saber que idade é conta de **calendário**, não de aritmética. A conta ' +
        'ingênua `(dias) / 365` funciona em 99% dos casos — passa em todo teste que você inventar ' +
        'com a sua própria data de nascimento — e quebra no 1%. Num sistema de seguradora, esse ' +
        '1% é gente ligando para reclamar.\n\n' +
        'A segunda é saber **onde cada código mora**. A entidade guarda, o service calcula, o ' +
        'main monta e imprime. Quem joga tudo numa classe só resolve o problema e perde a vaga.',

      conceito:
        '**Parte 1 — a conta certa.**\n\n' +
        '`Period.between(nascimento, referencia).getYears()` devolve a idade em anos completos. ' +
        'Uma linha. `Period` entende calendário: ele sabe que fevereiro tem 28 ou 29 dias e que ' +
        'o aniversário deste ano pode ainda não ter chegado.\n\n' +
        '`ChronoUnit.DAYS.between(a, b)` devolve o total de dias. O número está certo — e não ' +
        'serve para idade, porque dividir por 365 assume que todo ano tem 365 dias. Não tem.\n\n' +
        'A regra que resolve a maior parte das dúvidas em `java.time`:\n\n' +
        '· pergunta de **calendário** (anos, meses, dias de agenda) → `Period`\n' +
        '· pergunta de **relógio** (horas, minutos, segundos) → `Duration`\n' +
        '· quer um **total numa unidade só** → `ChronoUnit`\n\n' +
        '**Parte 2 — as três camadas.**\n\n' +
        'Esta divisão não é decoração acadêmica: é como todo projeto Java de empresa é ' +
        'organizado, e é o que o Spring vai formalizar mais para frente.\n\n' +
        '`Pessoa` é **entidade**: ela guarda dado e não sabe calcular nada. Nome e nascimento, ' +
        'privados, com getters.\n\n' +
        '`PessoaService` é **serviço**: ele tem a regra de negócio e não guarda estado. Recebe ' +
        'uma `Pessoa`, devolve um número.\n\n' +
        '`Programa` é a **entrada**: cria os objetos, chama o service, imprime. Nenhuma regra ' +
        'mora aqui.\n\n' +
        'O teste para saber se você separou certo: se amanhã a idade tiver que aparecer numa ' +
        'tela web em vez do console, quanto código muda? Se a resposta for "só o Programa", ' +
        'está separado. Se for "tenho que mexer no cálculo", está tudo junto.',

      armadilha:
        '**1. Dividir dias por 365.** Maria nasceu em 29/02/2000. Em 28/02/2026 ela viveu 9496 ' +
        'dias. Divididos por 365 dão 26. A idade real é 25 — o aniversário não chegou. O erro só ' +
        'aparece em quem nasceu perto do fim de fevereiro ou já viveu muitos anos bissextos.\n\n' +
        '**2. Achar que `Period.between(a, b).getDays()` é o total de dias.** Não é. É o que ' +
        'sobra de dias depois de contar anos e meses. Entre 01/01 e 15/03, `getDays()` devolve ' +
        '14, não 73.\n\n' +
        '**3. A borda da faixa.** `if (idade < 24)` joga quem tem 24 anos na faixa de cima. O ' +
        'certo é `<= 24`. Um caractere, cliente cobrado errado. Por isso existe um teste só para ' +
        'a borda.\n\n' +
        '**4. Colocar o cálculo dentro da `Pessoa`.** É tentador: "a pessoa sabe a idade dela". ' +
        'Mas aí a entidade passa a depender da data de hoje, e você não consegue mais criar uma ' +
        '`Pessoa` sem pensar em tempo. Entidade guarda; service calcula.',

      senior:
        'Ele separa entidade e serviço **desde a primeira linha**, mesmo num exercício de 30 ' +
        'minutos. Não porque o exercício exige, mas porque é o hábito — e porque quem começa ' +
        'tudo junto nunca separa depois.\n\n' +
        'Ele recebe a data de referência **como parâmetro**. Um service que chama ' +
        '`LocalDate.now()` por dentro não pode ser testado: você não consegue verificar o caso ' +
        'do 29/02 sem esperar chegar 2026 de verdade. Passar a data por fora é o que torna o ' +
        'código verificável.\n\n' +
        'Ele trata o dado inválido em vez de deixar passar. Nascimento no futuro é cadastro ' +
        'digitado errado. Devolver -1 é um combinado explícito, e quem chama confere. Devolver ' +
        '-3 anos empurra o erro para o cálculo do preço, e o bug vai aparecer longe daqui, num ' +
        'lugar onde ninguém suspeita da idade.\n\n' +
        'E ele deixa o **service sem `System.out.println`**. Quem imprime é o `main`. Service que ' +
        'imprime só funciona no console, e um dia esse código vai virar API.',

      entrevistador:
        'Ele já sabe que você consegue subtrair duas datas. O que ele olha:\n\n' +
        '· **Você separou em camadas ou fez tudo numa classe?** É a primeira coisa que ele vê, ' +
        'antes de ler qualquer lógica.\n' +
        '· Usou `java.time` ou `Calendar`? `Calendar` em 2026 diz que você aprendeu por tutorial ' +
        'velho e não conferiu se ainda valia.\n' +
        '· Tratou o 29/02 sem ninguém lembrar?\n' +
        '· O service depende do relógio do sistema, ou dá para testar?\n' +
        '· **Você perguntou o que fazer com data no futuro, ou decidiu sozinho e seguiu?**\n\n' +
        'O último pesa mais que os outros juntos, e é o mais fácil de acertar. O chamado não diz ' +
        'o que fazer com dado inválido — de propósito. Num teste presencial, perguntar vale ' +
        'ponto. Num teste para levar para casa, escreva junto do código: "o chamado não ' +
        'especifica X; assumi Y porque Z". É o que separa quem executa tarefa de quem resolve ' +
        'problema.',
    },

    solucao: {
      codigo: `// =====================================================================
// arquivo:  entities/Pessoa.java
// =====================================================================
package entities;

import java.time.LocalDate;

public class Pessoa {

    // Privados: quem esta de fora nao mexe no dado direto.
    private String nome;
    private LocalDate nascimento;

    public Pessoa(String nome, LocalDate nascimento) {
        this.nome = nome;
        this.nascimento = nascimento;
    }

    public String getNome() {
        return nome;
    }

    public LocalDate getNascimento() {
        return nascimento;
    }
}


// =====================================================================
// arquivo:  services/PessoaService.java
// =====================================================================
package services;

import java.time.LocalDate;
import java.time.Period;

import entities.Pessoa;

public class PessoaService {

    /**
     * Idade em anos completos.
     *
     * A data de referencia entra como parametro. Se o service chamasse
     * LocalDate.now() aqui dentro, nao daria para conferir o caso do 29/02
     * sem esperar o ano virar de verdade.
     *
     * Devolve -1 quando o dado esta invalido, e quem chama decide o que
     * fazer com isso. O service nao imprime nada: se ele imprimisse, so
     * serviria para console, e um dia este codigo vira API.
     */
    public int idadeEmAnos(Pessoa pessoa, LocalDate referencia) {
        if (pessoa == null || pessoa.getNascimento() == null || referencia == null) {
            return -1;
        }
        if (pessoa.getNascimento().isAfter(referencia)) {
            return -1;                    // cadastro digitado errado
        }

        // Period entende calendario: ano bissexto, meses de tamanhos
        // diferentes e aniversario que ainda nao chegou este ano.
        return Period.between(pessoa.getNascimento(), referencia).getYears();
    }

    public String faixaEtaria(int idade) {
        if (idade < 0)   return "invalida";
        if (idade < 18)  return "menor de idade";
        if (idade <= 24) return "18-24";  // <= : quem tem 24 fica AQUI
        if (idade <= 39) return "25-39";
        if (idade <= 59) return "40-59";
        return "60+";
    }
}


// =====================================================================
// arquivo:  Programa.java
// =====================================================================
import java.time.LocalDate;

import entities.Pessoa;
import services.PessoaService;

public class Programa {

    public static void main(String[] args) {

        PessoaService serv = new PessoaService();
        LocalDate hoje = LocalDate.of(2026, 2, 28);

        Pessoa maria = new Pessoa("Maria", LocalDate.of(2000, 2, 29));
        Pessoa joao  = new Pessoa("Joao",  LocalDate.of(2006, 8, 22));
        Pessoa erro  = new Pessoa("Cadastro errado", LocalDate.of(2030, 1, 1));

        mostrar(serv, maria, hoje);
        mostrar(serv, joao, LocalDate.of(2026, 8, 21));
        mostrar(serv, erro, hoje);
    }

    /**
     * Quem imprime e o Programa, nunca o service. E aqui tambem que o -1
     * vira uma mensagem que uma pessoa entende.
     */
    private static void mostrar(PessoaService serv, Pessoa p, LocalDate referencia) {
        int idade = serv.idadeEmAnos(p, referencia);

        if (idade < 0) {
            System.out.println(p.getNome() + ": data de nascimento invalida");
            return;
        }
        System.out.println(p.getNome() + ": " + idade + " anos, faixa "
                + serv.faixaEtaria(idade));
    }
}`,
      notas: [
        'Repare no que a `Pessoa` NÃO tem: nenhum método que calcula. Ela guarda nome e nascimento e para por aí. Se você colocou `maria.getIdade()` dentro dela, funciona — mas aí a entidade passou a depender da data de hoje, e criar uma `Pessoa` virou um assunto sobre tempo.',
        'O `PessoaService` não tem nenhum atributo. Ele não guarda estado: recebe, calcula, devolve. É por isso que um service só pode ser criado uma vez e reusado o programa inteiro.',
        'O método `mostrar` está no `Programa` porque é apresentação. Se ele estivesse no service, o dia em que a idade precisasse aparecer numa tela web em vez do console, você teria que mexer na regra de negócio para mudar a cor de um texto.',
        'O cálculo inteiro são três `if` e um `return`. Se a sua versão ficou com 40 linhas de conta, o problema não foi esforço: foi escolher `ChronoUnit` onde cabia `Period`. Escolher a classe certa é o exercício.',
        'O `-1` para dado inválido é o combinado possível hoje. Quando você chegar em Exceções, na seção 14 do curso, volte aqui: ali ele vira uma exceção com mensagem, que é a forma adulta. Deixei anotado no código.',
      ],
      testeSugerido: `Rode o Programa. A saida tem que ser exatamente esta:

    Maria: 25 anos, faixa 25-39
    Joao: 19 anos, faixa 18-24
    Cadastro errado: data de nascimento invalida

Se a Maria sair com 26 anos, voce dividiu dias por 365 em vez de usar
Period. E o bug que o chamado descreve, acontecendo na sua maquina.

Se o Joao sair com 20, voce contou o aniversario que ainda nao chegou:
ele nasceu dia 22 e a referencia e dia 21.

Depois troque a referencia para 01/03/2026 e rode de novo. A Maria tem
que virar 26 anos: o aniversario dela passou.`,
    },

    revisa: ['java-f2-m1', 'java-f1-m5'],
  },

  {
    id: 'dh-2',
    moduloId: 'java-f1-m4',
    nivel: 2,
    titulo: 'Folha de ponto',
    contexto: 'Empresa de tecnologia · tarefa de vaga Júnior',
    tempo: '45 min',

    cenario:
      'Você é o júnior mais novo do time que cuida do sistema de RH. O relógio de ponto grava ' +
      'as batidas do crachá como texto, na ordem em que aconteceram. Um dia normal tem quatro: ' +
      'entrada, saída para o almoço, volta e saída. Chegou este chamado:\n\n' +
      '"O relatório de horas está fechando errado. Quem sai no meio do dia para o médico e ' +
      'volta aparece com menos horas do que trabalhou. E o total sai como 8,57 horas, o que ' +
      'ninguém entende — a folha precisa mostrar 8h34. Às vezes o pessoal esquece de bater a ' +
      'saída no fim do dia e o relatório mostra um número absurdo."\n\n' +
      'Leia de novo. São três problemas diferentes, e um deles não é conta: é o que fazer ' +
      'quando o dado chega quebrado.',

    tarefa:
      'Monte em três partes:\n\n' +
      '**1. `CartaoDePonto`** — a entidade. Guarda o nome do funcionário e as batidas do dia ' +
      '(um `String[]`), com atributos privados, construtor e getters.\n\n' +
      '**2. `PontoService`** — a regra. Tem `minutosTrabalhados(CartaoDePonto)` devolvendo o ' +
      'total de minutos, e `formatar(int minutos)` devolvendo "8h34".\n\n' +
      '**3. `Programa`** — o `main`. Cria os cartões do dia e imprime o relatório.',

    requisitos: [
      'As batidas vêm como texto no formato "HH:mm" — por exemplo "08:12"',
      'Os pares são entrada/saída na ordem: 1ª com 2ª, 3ª com 4ª, e assim por diante',
      'O dia pode ter mais de quatro batidas (saiu no meio do expediente e voltou)',
      'Número ÍMPAR de batidas significa que faltou bater a saída: devolva -1',
      'Array vazio é um dia sem trabalho: devolva 0, e isso não é erro',
      'Dois dígitos no minuto: 5 minutos é "0h05", não "0h5"',
      'O service não imprime nada. Quem imprime é o `Programa`',
    ],

    testes: [
      { dado: '["08:12","12:03","13:05","17:48"]', esperado: '514 minutos → "8h34"' },
      { dado: '["09:00","18:00"]', esperado: '540 minutos → "9h00"' },
      { dado: '["08:00","12:00","13:00","15:00","15:30","17:30"]', esperado: '480 minutos → "8h00"' },
      { dado: '["08:12","12:03","13:05"] (ímpar)', esperado: '-1, e o relatório avisa' },
      { dado: '[] (array vazio)', esperado: '0 → "0h00"' },
      { dado: 'formatar(5)', esperado: '"0h05" — dois dígitos no minuto' },
      { dado: 'formatar(60)', esperado: '"1h00"' },
    ],

    explicacao: {
      testa:
        'Se você consegue pegar dado sujo vindo de fora, transformar no tipo certo, calcular e ' +
        'devolver num formato que uma pessoa lê.\n\n' +
        'É literalmente a tarefa que cai na mesa de um júnior na primeira semana. Não tem ' +
        'algoritmo esperto — tem converter, percorrer e formatar. O que separa quem entrega de ' +
        'quem entrega errado é lembrar do caso quebrado antes de ele quebrar.',

      conceito:
        '**Texto não é hora.** `"08:12"` é uma `String`: você não consegue subtrair duas ' +
        'strings. `LocalTime.parse("08:12")` transforma em um tipo que sabe fazer conta. Esse é ' +
        'o primeiro passo de quase todo programa que lê dado de fora — converta cedo e trabalhe ' +
        'com o tipo, nunca com o texto.\n\n' +
        '**Diferença entre dois horários é relógio, não calendário.** Quantos minutos correram ' +
        'entre 08:12 e 12:03? `Duration.between(a, b).toMinutes()` responde, e ' +
        '`ChronoUnit.MINUTES.between(a, b)` faz o mesmo. Nenhuma das duas é `Period` — `Period` ' +
        'é para anos, meses e dias de agenda.\n\n' +
        '**Percorrer de dois em dois.** As batidas são pares. O laço anda `i = i + 2`, pega ' +
        '`marcacoes[i]` como entrada e `marcacoes[i + 1]` como saída. É exatamente por isso que ' +
        'o número ímpar quebra: existe um `i` sem `i + 1`.\n\n' +
        '**Divisão inteira e resto.** 514 minutos: `514 / 60` dá 8 (as horas), `514 % 60` dá 34 ' +
        '(os minutos). Esse par resolve praticamente toda formatação de tempo. Foi tentar ' +
        'imprimir `514 / 60.0` que produziu o "8,57 horas" da reclamação.',

      armadilha:
        '**1. Somar horas e minutos separados.** O reflexo é `horaFim - horaInicio` e ' +
        '`minutoFim - minutoInicio`. Entre 08:12 e 12:03 isso dá 4 horas e -9 minutos. Aí você ' +
        'escreve um `if` para "pegar emprestado" da hora e acabou de reimplementar, com bug, o ' +
        'que `Duration.between` já faz certo.\n\n' +
        '**2. Estourar o array.** Se o laço acessa `marcacoes[i + 1]` sem ter conferido o ' +
        'tamanho antes, o array ímpar não devolve -1: ele explode com ' +
        '`ArrayIndexOutOfBoundsException`. A conferência vai na primeira linha do método, antes ' +
        'do laço.\n\n' +
        '**3. Esquecer o zero à esquerda.** `0 + "h" + 5` produz "0h5". A folha precisa de ' +
        '"0h05". `String.format("%dh%02d", horas, resto)` resolve — o `%02d` é o que garante os ' +
        'dois dígitos.\n\n' +
        '**4. Guardar o total dentro do `CartaoDePonto`.** Tentador: "o cartão sabe quantas ' +
        'horas foram". Mas aí a entidade passa a calcular, e no dia em que a regra mudar (hora ' +
        'noturna vale mais, por exemplo) você vai mexer na classe que só devia guardar dado.',

      senior:
        'Ele valida **antes** de processar, não durante. A checagem do ímpar acontece na ' +
        'primeira linha, e o resto do método já pode assumir que os pares existem. Validar no ' +
        'meio do laço espalha a dúvida por todo lugar.\n\n' +
        'Ele separa **calcular** de **formatar**. `minutosTrabalhados` devolve número puro; ' +
        '`formatar` transforma número em texto. Parece exagero num método de dez linhas, mas é ' +
        'o que permite reusar o cálculo no relatório mensal, no gráfico e na exportação sem ' +
        'arrastar o "8h34" junto.\n\n' +
        'E ele repara que o chamado não diz o que fazer com o dia vazio. Ele decide — 0, e não ' +
        'é erro — e escreve a decisão junto do código em vez de deixar implícita.',

      entrevistador:
        'Este cai muito em entrevista com tela compartilhada. O que ele olha:\n\n' +
        '· Você converteu para `LocalTime` logo no começo, ou ficou fatiando a String com ' +
        '`substring` e `Integer.parseInt`? A segunda funciona e denuncia que você não conhece a ' +
        'biblioteca.\n' +
        '· Tratou o array ímpar antes de acessar `i + 1`?\n' +
        '· A formatação saiu com `%02d` ou com um `if (resto < 10)` improvisado?\n' +
        '· A entidade ficou só com dado, ou virou uma classe que faz tudo?\n\n' +
        'E vem quase sempre a pergunta: **"e se as batidas vierem fora de ordem?"** Não é ' +
        'pegadinha. Ele quer ver se você sabe qual suposição o seu código está fazendo. A ' +
        'resposta boa é "aí precisa ordenar antes, e isso muda a suposição do enunciado". Saber ' +
        'onde seu código é frágil vale mais do que fingir que ele não é.',
    },

    solucao: {
      codigo: `// =====================================================================
// arquivo:  entities/CartaoDePonto.java
// =====================================================================
package entities;

public class CartaoDePonto {

    private String funcionario;
    private String[] marcacoes;      // "08:12", "12:03", ...

    public CartaoDePonto(String funcionario, String[] marcacoes) {
        this.funcionario = funcionario;
        this.marcacoes = marcacoes;
    }

    public String getFuncionario() {
        return funcionario;
    }

    public String[] getMarcacoes() {
        return marcacoes;
    }
}


// =====================================================================
// arquivo:  services/PontoService.java
// =====================================================================
package services;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

import entities.CartaoDePonto;

public class PontoService {

    /**
     * Total de minutos trabalhados no dia.
     *
     * Devolve -1 quando o numero de batidas e impar: falta a saida de
     * alguem, e qualquer numero inventado aqui chegaria na folha de
     * pagamento como se fosse verdade.
     */
    public int minutosTrabalhados(CartaoDePonto cartao) {
        if (cartao == null || cartao.getMarcacoes() == null) {
            return -1;
        }

        String[] batidas = cartao.getMarcacoes();

        // A conferencia vem ANTES do laco. Assim o corpo do laco ja pode
        // contar que, para todo i par, existe i + 1.
        if (batidas.length % 2 != 0) {
            return -1;
        }

        int total = 0;

        // De dois em dois: entrada em i, saida em i + 1.
        for (int i = 0; i < batidas.length; i = i + 2) {
            LocalTime entrada = LocalTime.parse(batidas[i]);
            LocalTime saida   = LocalTime.parse(batidas[i + 1]);

            // Diferenca entre dois horarios e pergunta de RELOGIO.
            // Duration.between(entrada, saida).toMinutes() faz o mesmo.
            total = total + (int) ChronoUnit.MINUTES.between(entrada, saida);
        }

        return total;
    }

    /**
     * 514 -> "8h34".
     *
     * Divisao inteira da as horas, resto da os minutos. Foi tentar
     * imprimir 514 / 60.0 que gerou o "8,57 horas" da reclamacao.
     */
    public String formatar(int minutos) {
        if (minutos < 0) {
            return "--";
        }
        int horas = minutos / 60;
        int resto = minutos % 60;

        // %02d e o que garante "0h05" em vez de "0h5".
        return String.format("%dh%02d", horas, resto);
    }
}


// =====================================================================
// arquivo:  Programa.java
// =====================================================================
import entities.CartaoDePonto;
import services.PontoService;

public class Programa {

    public static void main(String[] args) {

        PontoService serv = new PontoService();

        CartaoDePonto[] dia = {
            new CartaoDePonto("Ana",   new String[] {"08:12", "12:03", "13:05", "17:48"}),
            new CartaoDePonto("Bruno", new String[] {"09:00", "18:00"}),
            new CartaoDePonto("Carla", new String[] {"08:00", "12:00", "13:00",
                                                     "15:00", "15:30", "17:30"}),
            new CartaoDePonto("Diego", new String[] {"08:12", "12:03", "13:05"}),
            new CartaoDePonto("Elisa", new String[] {}),
        };

        System.out.println("RELATORIO DO DIA");
        for (int i = 0; i < dia.length; i++) {
            imprimir(serv, dia[i]);
        }
    }

    /** Quem imprime e o Programa. O service so devolve numero. */
    private static void imprimir(PontoService serv, CartaoDePonto cartao) {
        int minutos = serv.minutosTrabalhados(cartao);

        if (minutos < 0) {
            System.out.println(cartao.getFuncionario()
                    + ": batida faltando, conferir com o RH");
            return;
        }
        System.out.println(cartao.getFuncionario() + ": " + serv.formatar(minutos));
    }
}`,
      notas: [
        'O laço anda `i = i + 2` e lê `i` e `i + 1`. Se você usou dois laços aninhados, ou uma variável do tipo "estou na entrada ou na saída?", funciona — mas compare com esta versão e repare quanto código sumiu quando o passo do laço virou 2.',
        '`ChronoUnit.MINUTES.between(a, b)` e `Duration.between(a, b).toMinutes()` fazem a mesma coisa aqui. Use a que achar mais legível; as duas aparecem em código real.',
        'A validação do ímpar está antes do laço, não dentro. Isso não é gosto: é o que permite o corpo acessar `i + 1` sem medo. Código que valida cedo tem menos `if` depois.',
        'O `CartaoDePonto` só guarda. Se você colocou `cartao.getTotalDeMinutos()` dentro dele, funciona — mas no dia em que a regra mudar (hora noturna vale 1,2x, por exemplo) você vai mexer numa classe que existia só para carregar dado.',
        'O `formatar(-1)` devolvendo "--" não estava no enunciado. Foi decisão minha, e o `Programa` nem usa: ele imprime a mensagem do RH antes. Ter as duas saídas é redundante de propósito — o service não pode depender de quem chama estar prestando atenção.',
      ],
      testeSugerido: `Rode o Programa. A saida tem que ser exatamente esta:

    RELATORIO DO DIA
    Ana: 8h34
    Bruno: 9h00
    Carla: 8h00
    Diego: batida faltando, conferir com o RH
    Elisa: 0h00

Comece conferindo o Diego. Se em vez da mensagem voce tomar um
ArrayIndexOutOfBoundsException, e porque o laco rodou antes da
validacao do impar. Ver esse erro acontecer uma vez ensina mais do
que ler sobre ele tres vezes.

Se a Ana sair "8,57" ou "8h5", o problema esta no formatar: divisao
inteira com resto, e %02d no minuto.`,
    },

    revisa: ['java-f1-m3', 'java-f2-m1'],
  },

  {
    id: 'dh-3',
    moduloId: 'java-f1-m4',
    nivel: 3,
    titulo: 'Agenda entre fusos',
    contexto: 'Telemedicina · teste técnico para vaga Júnior',
    tempo: '1h',

    cenario:
      'Uma plataforma de telemedicina atende o Brasil inteiro e tem médicos morando fora do ' +
      'país. O banco já foi arrumado pelo time sênior e hoje grava o horário da consulta como ' +
      'instante em UTC — essa parte não é sua. Chegou este chamado:\n\n' +
      '"Precisamos de três coisas na tela da agenda. Mostrar o horário no fuso de quem está ' +
      'olhando, porque hoje médico em Lisboa e paciente em Manaus veem o mesmo número e um dos ' +
      'dois chega na hora errada. Impedir que o médico marque duas consultas que se sobrepõem — ' +
      'lembrando que uma consulta que começa exatamente quando a outra termina está ok, isso ' +
      'acontece o dia todo. E recusar remarcação faltando menos de 24 horas."\n\n' +
      'Três regras num parágrafo só. Uma delas é um caso-limite que muda o sinal de comparação ' +
      'que você vai escrever. Ache qual antes de começar a digitar.',

    tarefa:
      'Monte em três partes:\n\n' +
      '**1. `Consulta`** — a entidade. Guarda o instante de início (UTC) e a duração em minutos, ' +
      'com atributos privados, construtor e getters. Pode ter um `getFim()`.\n\n' +
      '**2. `AgendaService`** — a regra. Tem `horarioEm(Consulta, String fuso)` devolvendo ' +
      '"20/06/2026 15:00"; `conflita(Consulta a, Consulta b)`; `podeRemarcar(Consulta, Instant agora)`; ' +
      'e `indiceDoConflito(Consulta[] agenda, Consulta nova)`, devolvendo -1 quando não houver.\n\n' +
      '**3. `Programa`** — o `main`. Monta uma agenda e imprime o que aconteceria em cada caso.',

    requisitos: [
      'O início é um `Instant` (UTC). O fuso NÃO é atributo da consulta: ele é de quem está olhando',
      'Atributos privados. A consulta não muda de horário depois de criada',
      'Encostar não é sobrepor: 14:00–14:30 e 14:30–15:00 podem coexistir',
      'A antecedência de 24h é contada do instante real, não da data do calendário',
      'Os métodos que decidem (conflito, remarcação) não podem mencionar fuso nenhum',
      'O service não imprime. Quem imprime é o `Programa`',
    ],

    testes: [
      { dado: 'consulta 2026-06-20T14:00:00Z, fuso Europe/Lisbon', esperado: '"20/06/2026 15:00"' },
      { dado: 'a mesma consulta, fuso America/Manaus', esperado: '"20/06/2026 10:00"' },
      { dado: '14:00Z por 30min  vs  14:15Z por 30min', esperado: 'conflita' },
      { dado: '14:00Z por 30min  vs  14:30Z por 30min', esperado: 'NÃO conflita (encostou)' },
      { dado: '14:00Z por 30min  vs  13:45Z por 30min', esperado: 'conflita (sobrepõe pela frente)' },
      { dado: 'consulta 14:00Z, agora 25h antes', esperado: 'pode remarcar' },
      { dado: 'consulta 14:00Z, agora 23h antes', esperado: 'NÃO pode' },
      { dado: 'agenda de 3 consultas, nova encaixa no buraco', esperado: '-1' },
    ],

    explicacao: {
      testa:
        'Se você entendeu que **fuso não é formatação, é significado** — e se você lê o ' +
        'enunciado até o fim antes de escrever o `if`.\n\n' +
        'A parte difícil não é o `java.time`: é o "encostar não é sobrepor", que está escrito no ' +
        'meio de uma frase e decide entre `<` e `<=`. Enunciado de mercado é assim. A informação ' +
        'que muda o código raramente vem em negrito.',

      conceito:
        '**Dois tipos de "quando".** Confundir os dois é a origem de quase todo bug de fuso.\n\n' +
        'Um **instante** é um ponto na linha do tempo, o mesmo para todo mundo no planeta. A ' +
        'consulta acontece num instante só; o que muda é o número que cada pessoa lê no relógio ' +
        'dela. Quando o médico em Lisboa e o paciente em Manaus olham a consulta das 14:00Z, ' +
        'eles veem 15:00 e 10:00 — e estão os dois certos, olhando o mesmo momento. Isso é ' +
        '`Instant`.\n\n' +
        'Uma **data-hora local** é um número de calendário sem âncora: "14:00 do dia 20". Não ' +
        'diz quando aconteceu até você dizer *onde*. Isso é `LocalDateTime`, e é a classe errada ' +
        'para um evento que acontece uma vez.\n\n' +
        'A conversão é uma linha: `instante.atZone(ZoneId.of("Europe/Lisbon"))` devolve um ' +
        '`ZonedDateTime` — o mesmo instante, visto dali. Formatar vem depois, com ' +
        '`DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")`.\n\n' +
        '**Sobreposição de intervalos** tem uma fórmula única, e vale para qualquer par:\n\n' +
        '`inicioA < fimB   E   inicioB < fimA`\n\n' +
        'Repare no `<`, não `<=`. Com `<=`, duas consultas que apenas se encostam contariam como ' +
        'conflito e a agenda do médico perderia metade dos horários. Foi por isso que o chamado ' +
        'gastou uma frase falando disso.\n\n' +
        '**Onde cada coisa mora.** A entidade guarda o instante. O service decide e converte. O ' +
        '`main` imprime. E repare numa consequência: os métodos que decidem não precisam saber ' +
        'de fuso nenhum, porque comparar instantes independe de onde alguém está. Se o seu ' +
        '`conflita` precisou de um `ZoneId`, é sinal de que o modelo está errado.',

      armadilha:
        '**1. Comparar só o início.** Duas consultas às 14:00 e 14:15, ambas de 30 minutos, se ' +
        'sobrepõem — e os inícios são diferentes. Conflito é comparação entre intervalos ' +
        'inteiros. Quem compara só o início libera o agendamento, e o médico descobre na hora ' +
        'da consulta.\n\n' +
        '**2. Trocar `<` por `<=`.** É o caso-limite do enunciado. Com `<=`, o teste do 14:30 ' +
        'acusa conflito e você entrega o oposto do que foi pedido, depois de ter lido a frase ' +
        'que avisava.\n\n' +
        '**3. Achar que o offset é o fuso.** `-03:00` não é fuso, é o offset de hoje. ' +
        '`America/Sao_Paulo` é o fuso, e carrega a história das mudanças de regra. Guardar ' +
        '`-03:00` significa errar todas as consultas futuras se o país mudar a regra.\n\n' +
        '**4. Supor que um fuso tem offset fixo.** Lisboa está em UTC+0 no inverno e UTC+1 no ' +
        'verão. A consulta das 14:00Z é 14:00 em Lisboa em março e 15:00 em junho. Se você ' +
        'escrever o teste com data de março esperando 15:00, ele falha — e você vai passar meia ' +
        'hora caçando bug no seu código, quando o errado era o teste. O `ZoneId` sabe disso ' +
        'sozinho; somar `+1` na mão é criar o bug.\n\n' +
        '**5. Contar 24 horas com `plusDays(1)`.** Aqui a pergunta é de relógio: 24 horas ' +
        'corridas. `Duration.between(agora, inicio).toHours() >= 24`. `plusDays` é calendário e, ' +
        'num dia de mudança de horário, "amanhã na mesma hora" pode ter 23 ou 25 horas.',

      senior:
        'Ele separa três responsabilidades que o código apressado mistura:\n\n' +
        '**Guardar** — sempre `Instant`, sempre UTC. Um valor só, sem ambiguidade.\n\n' +
        '**Decidir** — conflito e antecedência são contas entre instantes, sem fuso nenhum.\n\n' +
        '**Exibir** — só aqui entra o fuso, e ele vem de quem está olhando, como parâmetro.\n\n' +
        'Essa separação é o que torna a classe fácil de conferir: dá para testar conflito sem ' +
        'pensar em fuso, e testar exibição sem pensar em conflito.\n\n' +
        'Ele também deixa `getFim()` na entidade, mas **calculado**, não guardado. Se `fim` ' +
        'fosse um campo, existiriam dois valores que precisam concordar — e no dia em que alguém ' +
        'mudasse a duração sem mudar o fim, a agenda passaria a mentir. Derivar o que dá para ' +
        'derivar é o hábito.\n\n' +
        'E ele nota que a duração deveria ser validada: consulta de 0 minuto não existe. Hoje o ' +
        'construtor confia em quem chama; na seção 14, quando você vir Exceções, é ele quem vai ' +
        'barrar isso.',

      entrevistador:
        'Este cai como teste para levar para casa, e a conversa depois vale tanto quanto o ' +
        'código. O que ele olha:\n\n' +
        '· Você guardou `Instant` ou `LocalDateTime`? Guardar local é o erro que ele procura.\n' +
        '· O fuso entrou como parâmetro de exibição, ou virou atributo da consulta? Se virou ' +
        'atributo, ele pergunta: "e quando o paciente viajar?"\n' +
        '· **Você tratou o caso do 14:30 sem ele apontar?** Estava no enunciado. Quem não tratou ' +
        'geralmente não leu até o fim.\n' +
        '· O `conflita` menciona fuso? Se sim, ele vai puxar esse fio.\n\n' +
        'A pergunta final quase certa: "e se a consulta for recorrente, toda terça às 14h, e o ' +
        'horário de verão mudar no meio?" Você **não** precisa saber resolver — é assunto de ' +
        'pleno. Precisa saber dizer por que é difícil: porque aí o que importa deixa de ser o ' +
        'instante e passa a ser a regra, e guardar instantes já calculados deixa a série errada ' +
        'quando a regra do fuso muda. Reconhecer o problema e dizer que não resolveria hoje vale ' +
        'mais do que inventar uma resposta.',
    },

    solucao: {
      codigo: `// =====================================================================
// arquivo:  entities/Consulta.java
// =====================================================================
package entities;

import java.time.Duration;
import java.time.Instant;

public class Consulta {

    private String paciente;
    private Instant inicio;          // sempre UTC
    private int duracaoMinutos;

    public Consulta(String paciente, Instant inicio, int duracaoMinutos) {
        this.paciente = paciente;
        this.inicio = inicio;
        this.duracaoMinutos = duracaoMinutos;
    }

    public String getPaciente() {
        return paciente;
    }

    public Instant getInicio() {
        return inicio;
    }

    public int getDuracaoMinutos() {
        return duracaoMinutos;
    }

    /**
     * Calculado, nao guardado. Se "fim" fosse um campo, existiriam dois
     * valores que precisam concordar — e no dia em que alguem mudasse a
     * duracao sem mudar o fim, a agenda passaria a mentir.
     */
    public Instant getFim() {
        return inicio.plus(Duration.ofMinutes(duracaoMinutos));
    }
}


// =====================================================================
// arquivo:  services/AgendaService.java
// =====================================================================
package services;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import entities.Consulta;

public class AgendaService {

    private static final DateTimeFormatter BR =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ---------------------------------------------------------- EXIBIR

    /**
     * O mesmo instante, lido do relogio de quem esta olhando.
     *
     * O fuso e PARAMETRO. Se fosse atributo da consulta, o horario mudaria
     * de significado quando o paciente viajasse.
     */
    public String horarioEm(Consulta c, String fuso) {
        ZonedDateTime local = c.getInicio().atZone(ZoneId.of(fuso));
        return BR.format(local);
    }

    // --------------------------------------------------------- DECIDIR
    // Nenhum dos dois metodos abaixo menciona fuso. Nao e esquecimento:
    // comparar instantes nao depende de onde ninguem esta. Se precisasse,
    // o modelo estaria errado.

    /**
     * Sobreposicao de intervalos: inicioA < fimB && inicioB < fimA.
     *
     * O sinal e < e nao <=. Com <=, duas consultas que apenas se encostam
     * (uma termina 14:30, a outra comeca 14:30) contariam como conflito e
     * a agenda perderia metade dos horarios. O chamado avisou disso.
     */
    public boolean conflita(Consulta a, Consulta b) {
        if (a == null || b == null) {
            return false;
        }
        return a.getInicio().isBefore(b.getFim())
            && b.getInicio().isBefore(a.getFim());
    }

    /**
     * 24 horas CORRIDAS de antecedencia. Duration, nao plusDays: num dia
     * de mudanca de horario, "amanha na mesma hora" pode ter 23 ou 25h.
     */
    public boolean podeRemarcar(Consulta c, Instant agora) {
        if (c == null || agora == null) {
            return false;
        }
        return Duration.between(agora, c.getInicio()).toHours() >= 24;
    }

    /** Indice da primeira consulta da agenda que conflita, ou -1. */
    public int indiceDoConflito(Consulta[] agenda, Consulta nova) {
        if (agenda == null || nova == null) {
            return -1;
        }
        for (int i = 0; i < agenda.length; i++) {
            if (agenda[i] != null && conflita(agenda[i], nova)) {
                return i;
            }
        }
        return -1;
    }
}


// =====================================================================
// arquivo:  Programa.java
// =====================================================================
import java.time.Instant;

import entities.Consulta;
import services.AgendaService;

public class Programa {

    public static void main(String[] args) {

        AgendaService serv = new AgendaService();

        Consulta c = new Consulta("Joana", Instant.parse("2026-06-20T14:00:00Z"), 30);

        System.out.println("A MESMA CONSULTA, VISTA DE TRES LUGARES");
        System.out.println("  medico em Lisboa: " + serv.horarioEm(c, "Europe/Lisbon"));
        System.out.println("  paciente em Manaus: " + serv.horarioEm(c, "America/Manaus"));
        System.out.println("  central em Sao Paulo: " + serv.horarioEm(c, "America/Sao_Paulo"));

        Consulta[] agenda = {
            c,
            new Consulta("Pedro", Instant.parse("2026-06-20T14:30:00Z"), 30),
            new Consulta("Lucia", Instant.parse("2026-06-20T16:00:00Z"), 60),
        };

        System.out.println();
        System.out.println("TENTANDO ENCAIXAR NOVAS CONSULTAS");
        tentar(serv, agenda, new Consulta("Novo", Instant.parse("2026-06-20T14:15:00Z"), 30));
        tentar(serv, agenda, new Consulta("Novo", Instant.parse("2026-06-20T15:00:00Z"), 30));
        tentar(serv, agenda, new Consulta("Novo", Instant.parse("2026-06-20T13:45:00Z"), 30));

        System.out.println();
        System.out.println("REMARCACAO DA CONSULTA DAS 14:00Z");
        remarcar(serv, c, Instant.parse("2026-06-19T13:00:00Z"));   // 25h antes
        remarcar(serv, c, Instant.parse("2026-06-19T15:00:00Z"));   // 23h antes
    }

    private static void tentar(AgendaService serv, Consulta[] agenda, Consulta nova) {
        int i = serv.indiceDoConflito(agenda, nova);

        if (i < 0) {
            System.out.println("  " + serv.horarioEm(nova, "UTC") + " UTC: horario livre");
        } else {
            System.out.println("  " + serv.horarioEm(nova, "UTC")
                    + " UTC: conflita com a consulta de " + agenda[i].getPaciente());
        }
    }

    private static void remarcar(AgendaService serv, Consulta c, Instant agora) {
        String quando = serv.horarioEm(c, "UTC");
        if (serv.podeRemarcar(c, agora)) {
            System.out.println("  pedido feito em " + agora + ": pode remarcar");
        } else {
            System.out.println("  pedido feito em " + agora + ": menos de 24h, recusado");
        }
    }
}`,
      notas: [
        'Repare que `conflita` e `podeRemarcar` não têm a palavra `ZoneId` em lugar nenhum. Isso não é economia de código: é o sinal de que o modelo está certo. Comparar instantes não depende de onde ninguém está.',
        'A fórmula `inicioA < fimB && inicioB < fimA` cobre todos os casos de sobreposição, inclusive um intervalo inteiro dentro do outro. Se você escreveu quatro `if` para os quatro jeitos de duas consultas se cruzarem, funciona — mas compare com esta linha e guarde a fórmula.',
        'O teste de Lisboa usa **20 de junho** de propósito. Em 20 de março o mesmo instante daria 14:00 em Lisboa, porque o horário de verão europeu ainda não começou. Eu descobri isso rodando o código, não pensando — e é assim que se descobre.',
        '`indiceDoConflito` devolve o índice, não `true`/`false`. Assim o `Programa` consegue dizer *com quem* conflita, e não só que conflita. Método que devolve mais informação útil pelo mesmo custo é quase sempre a escolha melhor.',
        'A `Consulta` não valida a duração no construtor. Consulta de 0 minuto não existe e deveria ser barrada ali — mas barrar de verdade é lançar exceção, que é a seção 14 do curso. Volte aqui naquele dia.',
      ],
      testeSugerido: `Rode o Programa. A saida tem que ser exatamente esta:

    A MESMA CONSULTA, VISTA DE TRES LUGARES
      medico em Lisboa: 20/06/2026 15:00
      paciente em Manaus: 20/06/2026 10:00
      central em Sao Paulo: 20/06/2026 11:00

    TENTANDO ENCAIXAR NOVAS CONSULTAS
      20/06/2026 14:15 UTC: conflita com a consulta de Joana
      20/06/2026 15:00 UTC: horario livre
      20/06/2026 13:45 UTC: conflita com a consulta de Joana

    REMARCACAO DA CONSULTA DAS 14:00Z
      pedido feito em 2026-06-19T13:00:00Z: pode remarcar
      pedido feito em 2026-06-19T15:00:00Z: menos de 24h, recusado

Tres linhas contam a historia toda: a mesma consulta aparece como
15:00, 10:00 e 11:00. Nenhuma delas esta errada.

Agora o teste que decide o exercicio: acrescente uma tentativa as
14:30 UTC. Ela tem que sair "horario livre", porque encostar nao e
sobrepor. Se sair "conflita", voce usou <= no lugar de <, e a
informacao que decidia isso estava no enunciado.`,
    },

    revisa: ['java-f2-m1', 'java-f1-m3'],
  },
]
