const config = {
  plugins: ['prettier-plugin-css-order', '@trivago/prettier-plugin-sort-imports'],

  printWidth: 100,
  singleQuote: true,

  cssDeclarationSorterOrder: 'smacss',

  importOrder: ['^react', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '\\.s?css$', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};

export default config;
