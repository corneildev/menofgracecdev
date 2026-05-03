export function formatPriceFcfa(n: number) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

export function formatPriceUsd(n: number) {
  return `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatPriceEur(n: number) {
  return `€${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
