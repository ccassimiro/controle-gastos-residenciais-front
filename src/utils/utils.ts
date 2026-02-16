export function sanitizeMoneyInput(raw: string): string {
  if (!raw) return "";

  // mantém só dígitos e separadores decimais
  let v = raw.replace(/[^\d.,]/g, "");

  // se tiver ponto e vírgula, considera o ÚLTIMO como separador decimal
  const lastComma = v.lastIndexOf(",");
  const lastDot = v.lastIndexOf(".");
  const decimalPos = Math.max(lastComma, lastDot);

  if (decimalPos !== -1) {
    const intPart = v.slice(0, decimalPos).replace(/[^\d]/g, "");
    const decPart = v.slice(decimalPos + 1).replace(/[^\d]/g, "").slice(0, 2);
    v = decPart.length > 0 ? `${intPart},${decPart}` : `${intPart},`;
  } else {
    // sem decimal: só números
    v = v.replace(/[^\d]/g, "");
  }

  // evita começar com vários zeros tipo 00012 (mas permite "0" e "0,")
  v = v.replace(/^0+(?=\d)/, "0");

  return v;
}

export function moneyToNumber(input: string): number {
  if (!input) return NaN;

  // 1) remove tudo que não for dígito, vírgula, ponto ou sinal de menos
  //    (isso tira "R$", espaços, etc.)
  let v = input.replace(/[^\d,.\-]/g, "");

  if (!v) return NaN;

  // 2) identifica o último separador (vírgula ou ponto) como decimal
  const lastComma = v.lastIndexOf(",");
  const lastDot = v.lastIndexOf(".");
  const decPos = Math.max(lastComma, lastDot);

  let normalized: string;

  if (decPos !== -1) {
    const intPart = v.slice(0, decPos).replace(/[^\d\-]/g, ""); // mantém possível '-'
    const decPart = v.slice(decPos + 1).replace(/[^\d]/g, "");
    normalized = `${intPart}.${decPart}`;
  } else {
    normalized = v.replace(/[^\d\-]/g, "");
  }

  return Number(normalized);
}

const brDecimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function numberToMoneyBRL(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "";
  return brDecimal.format(n); // ex: "1.234,56"
}

export function handlePurposeType(type: number): string {
  switch (type) {
    case 1:
      return "Despesa";
    case 2:
      return "Receita";
    case 3:
      return "Despesa/Receita";
    default:
      return "Desconhecido";
  }
}
