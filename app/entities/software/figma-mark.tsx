export function FigmaMark({ large = false }: { large?: boolean }) {
  return (
    <svg width={large ? 32 : 16} height={large ? 48 : 24} viewBox='0 0 20 30' aria-hidden='true'>
      <path d='M5 0h5v10H5A5 5 0 0 1 5 0' fill='#F24E1E' />
      <path d='M10 0h5a5 5 0 0 1 0 10h-5' fill='#FF7262' />
      <path d='M5 10h5v10H5a5 5 0 0 1 0-10' fill='#A259FF' />
      <circle cx='15' cy='15' r='5' fill='#1ABCFE' />
      <path d='M5 20h5v5a5 5 0 1 1-5-5' fill='#0ACF83' />
    </svg>
  )
}
