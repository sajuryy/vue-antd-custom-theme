export function getCoinImageUrl(str: string) : string {
  if(!str) return "/images/icons/coins/1.png"
  let i = str.length

  let hash = i
  while (i) {
    hash = (hash * 93) ^ str.charCodeAt(--i)
  }
  return `/images/icons/coins/${Math.abs((hash % 10))}.png`
}

export function getTokenStat(str: string) {
  if(!str) return "0.00"
  let i = str.length > 6 ? 6 : str.length
  let hash = i
  while (i) {
    hash = (hash * 93) ^ str.charCodeAt(--i)
  }
  return (hash / Math.pow(10, 7)).toFixed(2)
}
