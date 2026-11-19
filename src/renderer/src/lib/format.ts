const numberFormat = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export function formatNumber(value: number): string {
  return numberFormat.format(Number.isFinite(value) ? value : 0)
}

export function formatMoney(value: number): string {
  return `${formatNumber(value)} $CUP`
}

const exactMoneyFormat = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export function formatMoneyExact(value: number): string {
  return `${exactMoneyFormat.format(Number.isFinite(value) ? value : 0)} $CUP`
}
