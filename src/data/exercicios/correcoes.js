// ---------------------------------------------------------------------------
// CORRECAO AUTOMATICA POR EXERCICIO
// ---------------------------------------------------------------------------
// Nem todo exercicio tem — e nao deveria ter. Exercicio de design ("regra de
// negocio no lugar certo", "adicionar um tipo novo nao exige mudar o codigo
// existente") nao e verificavel por teste. Fingir que e daria a voce um
// "aprovado" que nao vale nada.
//
// Cada entrada pode ter:
//   assinatura  o contrato que o seu codigo precisa expor (mostrado na tela)
//   imports     imports adicionados ao arquivo de teste
//   testes      corpo Java executado contra o seu codigo
//   checagens   regras de analise estatica especificas deste exercicio
//
// Os testes usam datas ESCOLHIDAS para pegar o erro classico. O par
// 29/02/2000 -> 28/02/2026, por exemplo, existe porque Period devolve 25 e a
// conta errada (dias/365) devolve 26. Teste que nao pega o bug e teste inutil.
// ---------------------------------------------------------------------------

const TEMPO = ['java.time.*', 'java.time.format.*', 'java.time.temporal.*']
const NUM = ['java.math.BigDecimal', 'java.math.RoundingMode']

export const CORRECOES = {
  // ------------------------------------------------- S11 Data e hora, N1
  'exm-java-f1-m4-n1': {
    assinatura: `public class DataUtils {
    public static int  idadeEmAnos(LocalDate nascimento, LocalDate hoje)
    public static long diasEntre(LocalDate a, LocalDate b)
    public static long diasUteisEntre(LocalDate inicio, LocalDate fim)
    public static ZonedDateTime paraFusoSaoPaulo(Instant instante)
    public static String        formatarBR(LocalDateTime dt)
    public static LocalDateTime parseBR(String texto)
}`,
    imports: TEMPO,
    testes: `
            // Este par existe de proposito: Period devolve 25, e a conta
            // errada (dias / 365) devolve 26.
            verificarIgual("idade: nascido em 29/02, um dia antes do aniversario",
                DataUtils.idadeEmAnos(LocalDate.of(2000, 2, 29), LocalDate.of(2026, 2, 28)), 25);

            verificarIgual("idade: no proprio aniversario",
                DataUtils.idadeEmAnos(LocalDate.of(1998, 3, 15), LocalDate.of(2026, 3, 15)), 28);

            verificarIgual("idade: um dia antes do aniversario",
                DataUtils.idadeEmAnos(LocalDate.of(1998, 3, 15), LocalDate.of(2026, 3, 14)), 27);

            verificarIgual("dias entre duas datas",
                DataUtils.diasEntre(LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 15)), 14L);

            verificarIgual("dias entre e simetrico em valor absoluto",
                Math.abs(DataUtils.diasEntre(LocalDate.of(2026, 8, 15), LocalDate.of(2026, 8, 1))), 14L);

            verificarIgual("dias uteis: sexta -> segunda pula o fim de semana",
                DataUtils.diasUteisEntre(LocalDate.of(2026, 8, 7), LocalDate.of(2026, 8, 10)), 1L);

            verificarIgual("dias uteis: semana cheia",
                DataUtils.diasUteisEntre(LocalDate.of(2026, 8, 3), LocalDate.of(2026, 8, 10)), 5L);

            verificarIgual("dias uteis: mesmo dia",
                DataUtils.diasUteisEntre(LocalDate.of(2026, 8, 5), LocalDate.of(2026, 8, 5)), 0L);

            verificar("fuso: 17:30Z vira 14:30 em Sao Paulo",
                DataUtils.paraFusoSaoPaulo(Instant.parse("2026-08-06T17:30:00Z")).getHour() == 14);

            verificar("fuso: continua sendo o mesmo instante",
                DataUtils.paraFusoSaoPaulo(Instant.parse("2026-08-06T17:30:00Z")).toInstant()
                    .equals(Instant.parse("2026-08-06T17:30:00Z")));

            verificarIgual("formatar no padrao brasileiro",
                DataUtils.formatarBR(LocalDateTime.of(2026, 8, 6, 14, 30)), "06/08/2026 14:30");

            verificarIgual("parse de texto valido",
                DataUtils.parseBR("06/08/2026 14:30"), LocalDateTime.of(2026, 8, 6, 14, 30));

            // parse de data inexistente precisa falhar de forma controlada
            try {
                DataUtils.parseBR("31/02/2026 10:00");
                falhou++; System.out.println("FALHOU|parse de 31/02 deveria falhar|nao lancou nada");
            } catch (Throwable t) {
                passou++; System.out.println("PASSOU|parse de 31/02 e recusado");
            }`,
    checagens: [
      {
        id: 'idade-por-365',
        gravidade: 'reprova',
        titulo: 'Idade calculada dividindo dias por 365',
        porque:
          'Erra em ano bissexto e em quem nasceu em 29/02. Use Period.between(...).getYears(), ' +
          'que entende calendario.',
        detectar: (c) => /DAYS\s*\.\s*between[^;]*\/\s*365|\/\s*365(\.25)?\b/.test(c),
      },
      {
        id: 'mes-minusculo',
        gravidade: 'reprova',
        titulo: 'Padrao de formatacao com "mm" no lugar do mes',
        porque:
          'Em DateTimeFormatter, MM e mes e mm e minuto. "dd/mm/yyyy" devolve o minuto no lugar do mes — ' +
          'e o bug passa despercebido porque o numero parece plausivel.',
        comStrings: true,
        // SEM flag /i: a diferenca entre MM (mes) e mm (minuto) E a regra.
        // So flagra mm em POSICAO DE DATA, entao "HH:mm" (minuto, correto)
        // nao dispara alarme falso.
        detectar: (c) => /ofPattern\s*\(\s*"[^"]*(dd\/mm|mm\/yyyy|mm\/dd|mm-dd|dd-mm)/.test(c),
      },
    ],
  },

  // ---------------------------------------------------- S4 Sintaxe, N1
  'exm-java-f1-m1-n1': {
    assinatura: `public class Troco {
    // devolve a quantidade de cada cedula/moeda, da maior para a menor:
    // [100, 50, 20, 10, 5, 2, 1]
    public static int[] decompor(int trocoEmCentavos)
}`,
    testes: `
            verificar("troco de R$ 187 usa a menor quantidade de cedulas",
                java.util.Arrays.equals(Troco.decompor(18700), new int[]{1, 1, 1, 1, 1, 1, 0}));

            verificar("troco zero devolve tudo zerado",
                java.util.Arrays.equals(Troco.decompor(0), new int[]{0, 0, 0, 0, 0, 0, 0}));

            verificar("R$ 3 sai como 1x2 + 1x1, nao 3x1",
                java.util.Arrays.equals(Troco.decompor(300), new int[]{0, 0, 0, 0, 0, 1, 1}));

            verificar("R$ 99 nao usa nota de 100",
                Troco.decompor(9900)[0] == 0);`,
  },

  // -------------------------------------------------- S4 Sintaxe, N2
  'exm-java-f1-m1-n2': {
    assinatura: `public class Comissao {
    // aliquota PROGRESSIVA: 3% ate 10 mil, 5% de 10 a 30 mil, 8% acima
    public static BigDecimal calcular(BigDecimal vendido)
}`,
    imports: NUM,
    testes: `
            verificar("venda de 40 mil gera 2.100 (300 + 1000 + 800)",
                Comissao.calcular(new BigDecimal("40000")).compareTo(new BigDecimal("2100")) == 0);

            verificar("venda de 5 mil gera 150",
                Comissao.calcular(new BigDecimal("5000")).compareTo(new BigDecimal("150")) == 0);

            verificar("venda de exatamente 10 mil gera 300 (borda da faixa)",
                Comissao.calcular(new BigDecimal("10000")).compareTo(new BigDecimal("300")) == 0);

            verificar("venda de exatamente 30 mil gera 1.300",
                Comissao.calcular(new BigDecimal("30000")).compareTo(new BigDecimal("1300")) == 0);

            verificar("venda zero gera comissao zero",
                Comissao.calcular(BigDecimal.ZERO).compareTo(BigDecimal.ZERO) == 0);`,
    checagens: [
      {
        id: 'progressivo-errado',
        gravidade: 'alerta',
        titulo: 'Possivel aliquota unica em vez de progressiva',
        porque:
          'Se voce multiplica o total por uma unica aliquota, entendeu errado: cada faixa tem a sua, ' +
          'como no imposto de renda. Confira com a venda de 40 mil.',
        detectar: (c) => /return\s+\w+\s*\.multiply\s*\(/.test(c) && !/(0\.05|0\.08|\.05|\.08)/.test(c),
      },
    ],
  },

  // ------------------------------------------------- S7 Metodos, N2
  'exm-java-f1-m5-n2': {
    assinatura: `public class Validador {
    public static boolean validarCpf(String cpf)   // aceita com e sem mascara
    public static boolean validarEmail(String email)
}`,
    testes: `
            verificar("CPF valido com mascara",  Validador.validarCpf("529.982.247-25"));
            verificar("CPF valido sem mascara",  Validador.validarCpf("52998224725"));
            verificar("CPF com um digito trocado e recusado", !Validador.validarCpf("52998224726"));
            verificar("CPF de digitos repetidos e recusado",  !Validador.validarCpf("111.111.111-11"));
            verificar("CPF 000.000.000-00 e recusado",        !Validador.validarCpf("00000000000"));
            verificar("CPF curto demais e recusado",          !Validador.validarCpf("123"));
            verificar("CPF nulo nao quebra",                  !Validador.validarCpf(null));
            verificar("email valido",   Validador.validarEmail("eric@exemplo.com"));
            verificar("email sem @ e recusado",  !Validador.validarEmail("ericexemplo.com"));
            verificar("email sem dominio e recusado", !Validador.validarEmail("eric@"));`,
    checagens: [
      {
        id: 'cpf-so-tamanho',
        gravidade: 'reprova',
        titulo: 'Validacao de CPF aparentemente so pelo tamanho',
        porque:
          'Contar 11 caracteres nao valida CPF: 111.111.111-11 tem 11 digitos e e invalido. ' +
          'O algoritmo do digito verificador e o que cai em entrevista.',
        detectar: (c) => /length\s*\(\s*\)\s*==\s*11/.test(c) && !/%\s*11|\*\s*(10|11)\b/.test(c),
      },
    ],
  },

  // ------------------------------- S9 Classes e encapsulamento, N1
  'exm-java-f2-m1-n1': {
    assinatura: `public class Produto {
    public Produto(String nome, BigDecimal preco, int estoque)
    public void reajustar(double percentual)   // em vez de setPreco
    public void darBaixa(int quantidade)       // em vez de setEstoque
    public void repor(int quantidade)
    public BigDecimal getPreco()
    public int getEstoque()
}`,
    imports: NUM,
    testes: `
            Produto p = new Produto("Teclado", new BigDecimal("100.00"), 10);
            p.reajustar(10);
            verificar("reajuste de 10% leva o preco de 100 para 110",
                p.getPreco().compareTo(new BigDecimal("110.00")) == 0);

            Produto q = new Produto("Mouse", new BigDecimal("50.00"), 5);
            q.darBaixa(3);
            verificarIgual("baixa de 3 em 5 deixa 2", q.getEstoque(), 2);

            q.repor(10);
            verificarIgual("reposicao de 10 leva a 12", q.getEstoque(), 12);

            verificarLanca("baixa maior que o estoque e recusada",
                Exception.class, () -> { new Produto("X", new BigDecimal("1"), 2).darBaixa(5); });

            verificarLanca("preco negativo no construtor e recusado",
                Exception.class, () -> { new Produto("X", new BigDecimal("-1"), 1); });

            verificarLanca("reajuste de -200% e recusado",
                Exception.class, () -> { new Produto("X", new BigDecimal("10"), 1).reajustar(-200); });`,
    checagens: [
      {
        id: 'setter-proibido',
        gravidade: 'reprova',
        titulo: 'Existe setPreco ou setEstoque',
        porque:
          'O enunciado pede operacoes de negocio no lugar dos setters. Com setEstoque publico, ' +
          'qualquer ponto do codigo pode deixar o estoque negativo sem passar pela sua regra.',
        detectar: (c) => /public\s+void\s+set(Preco|Estoque)\s*\(/i.test(c),
      },
    ],
  },
}

export const temCorrecao = (idEx) => Boolean(CORRECOES[idEx])
export const temTestes = (idEx) => Boolean(CORRECOES[idEx]?.testes)
