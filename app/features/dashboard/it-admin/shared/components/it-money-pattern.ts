/** The visible formatted input is validated separately from the raw string submitted in the form. */
export function itMoneyPattern(language: string | undefined, decimals = true) {
  if (language === 'en') return decimals ? '[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]+)?' : '[0-9]{1,3}(,[0-9]{3})*'
  return decimals ? '[0-9]{1,3}(\\.[0-9]{3})*(,[0-9]+)?' : '[0-9]{1,3}(\\.[0-9]{3})*'
}
