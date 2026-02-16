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

export function moneyToNumber(ptbr: string): number {
  const normalized = ptbr.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}