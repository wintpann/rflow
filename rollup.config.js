const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const url = require('@rollup/plugin-url');
const pkg = require('./package.json');

module.exports = {
  input: 'src/lib/index.ts',
  external: Object.keys(pkg.peerDependencies),
  output: [{ file: 'dist/index.js', format: 'cjs' }],
  plugins: [
    resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    typescript(),
    url(),
    terser(),
  ],
};
