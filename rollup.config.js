import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.ts',
  plugins: [
    typescript(),
    resolve({
      mainFields: ['lodash-es'],
    }),
    commonjs(),
  ],
  output: {
    file: 'dist/xjs.umd.js',
    name: 'Xjs',
    format: 'umd',
  },
};
