const organizeImports = require('prettier-plugin-organize-imports')
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  parser: 'typescript',
  plugins: [organizeImports],
}
